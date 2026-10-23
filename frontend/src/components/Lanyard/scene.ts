import * as THREE from 'three';
import type { Applied, Images, Point, Press, Settings } from './types';
import { ANCHORS, BEVEL, CLAMP_BODY, EYELET_RADIUS, FACE_WIDTH, FOV, SAMPLES, STRAP_WIDTH, THICKNESS, clamp, mix } from './config';
import { buildBandGeometry, buildCardGeometry, buildClampGeometry, buildHolderGeometry, cardLayout } from './geometry';
import { buildEnvironment } from './environment';
import { createMaterials } from './materials';
import { createBandUpdater } from './band';
import { loadImage, paintFace, paintStrap, parseColor } from './textures';
import { configureSimulation, createSimulation, flipSimulation, physicsForSettings, placeHanging, stepSimulation } from './simulation';

/** Owns all WebGL/browser resources for one mounted badge. */
export const createLanyardScene = (container: HTMLDivElement, getSettings: () => Settings) => {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return undefined;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  const canvas = renderer.domElement;
  canvas.className = 'lanyard-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const scene = new THREE.Scene();
  const environment = buildEnvironment(renderer);
  scene.environment = environment.texture;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(-2.5, 4, 6);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(3, -1, 4);
  scene.add(keyLight, fillLight);

  const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
  const images: Images = { front: null, back: null, strap: null };
  const materials = createMaterials(anisotropy);
  const {
    frontCanvas, backCanvas, strapCanvas, frontTexture, backTexture, strapTexture, weave, foilUniforms, frontMaterial, backMaterial, edgeMaterial, metalMaterial, bandMaterial, holderMaterial
  } = materials;

  const cardGroup = new THREE.Group();
  const holder = new THREE.Mesh(undefined, holderMaterial);
  const bodyMesh = new THREE.Mesh(undefined, edgeMaterial);
  const frontMesh = new THREE.Mesh(undefined, frontMaterial);
  const backMesh = new THREE.Mesh(undefined, backMaterial);
  const ring = new THREE.Mesh(buildClampGeometry(0.17), metalMaterial);
  ring.scale.y = 1.65;
  ring.rotation.x = 0.22;
  const snap = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 12), metalMaterial);
  snap.scale.z = 0.3;
  ring.add(snap);
  snap.position.z = 0.035;
  cardGroup.add(bodyMesh, frontMesh, backMesh, ring, holder);
  scene.add(cardGroup);

  const bandGeometry = buildBandGeometry(SAMPLES);
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.frustumCulled = false;
  scene.add(band);

  const clampGroup = new THREE.Group();
  const clampMesh = new THREE.Mesh(buildClampGeometry(STRAP_WIDTH), metalMaterial);
  clampMesh.position.y = EYELET_RADIUS + CLAMP_BODY / 2 - 0.004;
  const eyelet = new THREE.Mesh(new THREE.TorusGeometry(EYELET_RADIUS, 0.0105, 14, 40), metalMaterial);
  clampGroup.add(clampMesh, eyelet);
  scene.add(clampGroup);

  const entranceGroup = new THREE.Group();
  entranceGroup.add(cardGroup, band, clampGroup);
  scene.add(entranceGroup);

  const sim = createSimulation();
  const view = { width: 1, height: 1 };
  let layout = cardLayout('portrait', 0.3);
  let applied: Applied = {};
  let strapScale = STRAP_WIDTH;
  let tileRatio = 2;
  let raf = 0;
  let last = performance.now();
  let time = 0;
  let visible = true;
  let alive = true;
  let placed = false;
  let hovering = false;
  let press: Press | null = null;
  let imageToken = 0;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let entrancePending = getSettings().intro && !reducedMotion;
  entranceGroup.visible = !entrancePending;

  const paintFaces = () => {
    const s = getSettings();
    const color = parseColor(s.cardColor, [1, 1, 1]);
    const width = FACE_WIDTH;
    const height = Math.round((FACE_WIDTH * layout.height) / layout.width);
    if (frontCanvas.width !== width || frontCanvas.height !== height) {
      frontCanvas.width = width;
      frontCanvas.height = height;
      backCanvas.width = width;
      backCanvas.height = height;
      frontTexture.dispose();
      backTexture.dispose();
    }
    paintFace(frontCanvas, images.front, color, s.imageFit);
    paintFace(backCanvas, images.back || images.front, color, s.imageFit);
    frontTexture.needsUpdate = true;
    backTexture.needsUpdate = true;
    start();
  };

  const repaintStrap = () => {
    const s = getSettings();
    tileRatio = paintStrap(strapCanvas, images.strap, parseColor(s.strapColor, [0.07, 0.07, 0.07]));
    weave.repeat.set(2, 2 * tileRatio);
    strapTexture.dispose();
    strapTexture.needsUpdate = true;
    start();
  };

  const frameView = () => {
    const s = getSettings();
    const aspect = view.width / view.height;
    let viewHeight = layout.height / clamp(s.size, 0.15, 0.9);
    const minimumWidth = layout.width / 0.72;
    if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
    const viewWidth = viewHeight * aspect;
    camera.aspect = aspect;
    camera.position.set(0, 0, viewHeight / 2 / Math.tan((FOV * Math.PI) / 360));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    foilUniforms.foilKey.value.set(-2.5, 4, 6).normalize().transformDirection(camera.matrixWorldInverse);
    foilUniforms.foilFill.value.set(3, -1, 4).normalize().transformDirection(camera.matrixWorldInverse);
    foilUniforms.foilTop.value.set(0.5, 4.5, 8).normalize().transformDirection(camera.matrixWorldInverse);
    const anchorFraction = Number.parseFloat(getComputedStyle(container).getPropertyValue('--lanyard-anchor'));
    const anchorX = ((Number.isFinite(anchorFraction) ? anchorFraction : ANCHORS[s.anchor] ?? 0.5) - 0.5) * viewWidth;
    const anchorY = viewHeight / 2 + 0.2;
    const cardTop = viewHeight / 2 - viewHeight * mix(0.12, 0.42, clamp(s.strapLength, 0, 1));
    const hangTop = cardTop + (layout.hangY - layout.height / 2);
    sim.anchor.set(anchorX, anchorY, 0);
    configureSimulation(sim, layout, anchorY - hangTop);
    sim.nodes[0].copy(sim.anchor);
    sim.previous[0].copy(sim.anchor);
  };

  const apply = () => {
    const s = getSettings();
    const layoutKey = `${s.orientation}|${s.cornerRadius}`;
    if (layoutKey !== applied.layoutKey) {
      layout = cardLayout(s.orientation, s.cornerRadius);
      const geometry = buildCardGeometry(layout);
      bodyMesh.geometry.dispose();
      frontMesh.geometry.dispose();
      backMesh.geometry.dispose();
      holder.geometry.dispose();
      holder.geometry = buildHolderGeometry(layout);
      bodyMesh.geometry = geometry.body;
      frontMesh.geometry = geometry.face;
      backMesh.geometry = geometry.face.clone();
      frontMesh.position.z = THICKNESS / 2 + BEVEL + 0.0006;
      backMesh.rotation.y = Math.PI;
      backMesh.position.z = -(THICKNESS / 2 + BEVEL + 0.0006);
      // Lower the insert and holder together so the clip tip meets the slot.
      for (const mesh of [bodyMesh, frontMesh, backMesh, holder]) {
        mesh.position.y = -0.06;
      }
      ring.position.set(0, layout.ringY, 0.005);
      applied.framingKey = '';
    }
    const framingKey = `${layoutKey}|${s.size}|${s.anchor}|${s.strapLength}|${view.width}|${view.height}`;
    if (framingKey !== applied.framingKey) {
      frameView();
      if (!placed) {
        placeHanging(sim, layout, false);
        placed = true;
      } else if (layoutKey !== applied.layoutKey) {
        placeHanging(sim, layout, false);
      }
    }

    const imageKey = `${s.frontImage}|${s.backImage}|${s.strapImage}`;
    if (imageKey !== applied.imageKey) {
      const token = ++imageToken;
      Promise.all([
        loadImage(imageCache, s.frontImage),
        loadImage(imageCache, s.backImage),
        loadImage(imageCache, s.strapImage)
      ]).then(([front, back, strap]) => {
        if (!alive || token !== imageToken) return;
        images.front = front;
        images.back = back;
        images.strap = strap;
        paintFaces();
        repaintStrap();
        if (entrancePending) {
          placeHanging(sim, layout, true);
          entrancePending = false;
          entranceGroup.visible = true;
        }
        start();
      });
    }
    const faceKey = `${layoutKey}|${s.cardColor}|${s.imageFit}`;
    if (faceKey !== applied.faceKey) paintFaces();
    if (s.strapColor !== applied.strapColor) repaintStrap();

    materials.applyFinish(s, layout);
    strapScale = STRAP_WIDTH * clamp(s.strapWidth, 0.4, 2);
    if (strapScale !== applied.strapScale) {
      clampMesh.geometry.dispose();
      clampMesh.geometry = buildClampGeometry(strapScale);
    }
    canvas.style.touchAction = s.interactive ? 'pan-y' : 'auto';

    applied = { layoutKey, framingKey, imageKey, faceKey, strapColor: s.strapColor, strapScale };
    start();
  };

  const updateBand = createBandUpdater(sim, camera, bandGeometry, clampGroup);

  const render = () => {
    cardGroup.position.copy(sim.body.position);
    cardGroup.quaternion.copy(sim.body.quaternion);
    updateBand(strapScale, tileRatio);
    renderer.render(scene, camera);
  };

  const tick = (now: number) => {
    raf = 0;
    if (!alive) return;
    const dt = Math.min(1 / 30, Math.max(1 / 240, (now - last) / 1000));
    last = now;
    time += dt;
    const current = physicsForSettings(getSettings(), reducedMotion);
    stepSimulation(sim, dt, current, time);
    const body = sim.body;
    if (!Number.isFinite(body.position.x + body.position.y + body.position.z + body.quaternion.w)) {
      sim.grab = null;
      placeHanging(sim, layout, false);
    }
    render();
    const resting = !entrancePending && sim.calm > 1.2 && !sim.grab && current.breeze === 0;
    if (visible && !resting) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (raf || !visible || !alive) return;
    sim.calm = 0;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const toPointer = (event: Point) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
  };

  const pickCard = () => {
    cardGroup.updateMatrixWorld();
    const hits = raycaster.intersectObjects([bodyMesh, frontMesh, backMesh], false);
    return hits[0] || null;
  };

  const setCursor = (value: string) => {
    if (canvas.style.cursor !== value) canvas.style.cursor = value;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!getSettings().interactive || event.button > 0) return;
    toPointer(event);
    const hit = pickCard();
    if (!hit) return;
    sim.grab = {
      local: hit.point.clone().sub(sim.body.position).applyQuaternion(sim.body.quaternion.clone().invert()),
      rotation: sim.body.quaternion.clone(),
      reach: hit.distance,
      from: hit.point.clone(),
      target: hit.point.clone()
    };
    press = { x: event.clientX, y: event.clientY, time: performance.now(), point: hit.point.clone() };
    canvas.setPointerCapture?.(event.pointerId);
    setCursor('grabbing');
    event.preventDefault();
    start();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!getSettings().interactive) return;
    toPointer(event);
    if (sim.grab) {
      if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 6) press = null;
      raycaster.ray.at(sim.grab.reach, sim.grab.target);
      start();
      return;
    }
    if (event.pointerType === 'touch') return;
    hovering = !!pickCard();
    setCursor(hovering ? 'grab' : '');
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!sim.grab) return;
    sim.grab = null;
    if (press && event.type === 'pointerup' && performance.now() - press.time < 450) flipSimulation(sim, press.point, camera.position);
    press = null;
    canvas.releasePointerCapture?.(event.pointerId);
    setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '');
    start();
  };

  const onTouchStart = (event: TouchEvent) => {
    if (!getSettings().interactive || event.touches.length !== 1) return;
    toPointer(event.touches[0]);
    if (pickCard()) event.preventDefault();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('lostpointercapture', onPointerUp);
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });

  const resize = () => {
    view.width = Math.max(1, container.clientWidth);
    view.height = Math.max(1, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(view.width, view.height, false);
    apply();
    render();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  });
  intersectionObserver.observe(container);
  const onVisibility = () => {
    if (!document.hidden) start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  resize();

  const dispose = () => {
    alive = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('lostpointercapture', onPointerUp);
    canvas.removeEventListener('touchstart', onTouchStart);
    [bodyMesh, frontMesh, backMesh, ring, clampMesh, eyelet, band, holder, snap].forEach(mesh => mesh.geometry?.dispose());
    materials.dispose();
    environment.dispose();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };

  return { apply, dispose };
};
