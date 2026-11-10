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
export const createLanyardScene = (container: HTMLDivElement, getSettings: () => Settings, renderContainer?: HTMLElement, onReady?: () => void) => {
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
  canvas.style.visibility = 'hidden';
  canvas.setAttribute('aria-hidden', 'true');
  const fullViewport = getSettings().fullViewport && !renderContainer;
  const expanded = fullViewport || !!renderContainer;
  const surface = expanded ? document.createElement('div') : container;
  const interactionElement: HTMLElement = expanded ? document.createElement('div') : canvas;
  if (expanded) {
    surface.className = fullViewport ? 'lanyard-viewport' : 'lanyard-stage';
    surface.setAttribute('aria-hidden', 'true');
    interactionElement.className = 'lanyard-hit-area';
    (renderContainer ?? document.body).appendChild(surface);
  }
  surface.appendChild(canvas);
  if (expanded) surface.appendChild(interactionElement);

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
  const view = { width: 1, height: 1, left: 0, top: 0, renderWidth: 1, renderHeight: 1 };
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
    const cardFill = clamp(s.size, 0.15, 0.9);
    let viewHeight = layout.height / cardFill;
    const minimumWidth = layout.width / cardFill;
    if (viewHeight * aspect < minimumWidth) viewHeight = minimumWidth / aspect;
    const viewWidth = viewHeight * aspect;
    camera.aspect = aspect;
    // Extend the frustum beyond the layout frame without changing the badge scale.
    if (expanded) camera.setViewOffset(view.width, view.height, -view.left, -view.top, view.renderWidth, view.renderHeight);
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
    const framingKey = `${layoutKey}|${s.size}|${s.anchor}|${s.strapLength}|${view.width}|${view.height}|${view.left}|${view.top}|${view.renderWidth}|${view.renderHeight}`;
    if (framingKey !== applied.framingKey) {
      frameView();
      if (!placed) {
        placeHanging(sim, layout, false);
        placed = true;
      } else if (layoutKey !== applied.layoutKey || (expanded && !sim.grab)) {
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
        render();
        canvas.style.visibility = 'visible';
        onReady?.();
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
    interactionElement.style.touchAction = s.interactive ? (expanded ? 'none' : 'pan-y') : 'auto';
    if (expanded) interactionElement.style.pointerEvents = s.interactive ? 'auto' : 'none';

    applied = { layoutKey, framingKey, imageKey, faceKey, strapColor: s.strapColor, strapScale };
    start();
  };

  const updateBand = createBandUpdater(sim, camera, bandGeometry, clampGroup);
  const hitCorners = Array.from({ length: 4 }, () => new THREE.Vector3());
  const cornerSigns = [[-1, 1], [1, 1], [1, -1], [-1, -1]];

  const render = () => {
    cardGroup.position.copy(sim.body.position);
    cardGroup.quaternion.copy(sim.body.quaternion);
    updateBand(strapScale, tileRatio);
    renderer.render(scene, camera);
    if (expanded) {
      // Capture pointers only over the projected card, leaving the page underneath usable.
      const polygon = cornerSigns.map(([x, y], index) => {
        const point = hitCorners[index].set(x * layout.width / 2, y * layout.height / 2 - 0.06, THICKNESS / 2);
        point.applyMatrix4(cardGroup.matrixWorld).project(camera);
        return `${((point.x + 1) * view.renderWidth / 2).toFixed(2)}px ${((1 - point.y) * view.renderHeight / 2).toFixed(2)}px`;
      });
      interactionElement.style.clipPath = `polygon(${polygon.join(',')})`;
      interactionElement.style.visibility = entranceGroup.visible ? 'visible' : 'hidden';
    }
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
    if (interactionElement.style.cursor !== value) interactionElement.style.cursor = value;
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
    interactionElement.setPointerCapture?.(event.pointerId);
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
    interactionElement.releasePointerCapture?.(event.pointerId);
    setCursor(hovering && event.pointerType !== 'touch' ? 'grab' : '');
    start();
  };

  const onTouchStart = (event: TouchEvent) => {
    if (!getSettings().interactive || event.touches.length !== 1) return;
    toPointer(event.touches[0]);
    if (pickCard()) event.preventDefault();
  };

  interactionElement.addEventListener('pointerdown', onPointerDown);
  interactionElement.addEventListener('pointermove', onPointerMove);
  interactionElement.addEventListener('pointerup', onPointerUp);
  interactionElement.addEventListener('pointercancel', onPointerUp);
  interactionElement.addEventListener('lostpointercapture', onPointerUp);
  interactionElement.addEventListener('touchstart', onTouchStart, { passive: false });

  const resize = () => {
    if (expanded && (!container.clientWidth || !container.clientHeight)) {
      surface.hidden = true;
      visible = false;
      sim.grab = null;
      press = null;
      return;
    }
    if (expanded) {
      surface.hidden = false;
      visible = true;
    }
    const rect = container.getBoundingClientRect();
    view.width = Math.max(1, container.clientWidth);
    view.height = Math.max(1, container.clientHeight);
    view.left = rect.left;
    view.top = rect.top + (fullViewport ? window.scrollY : 0);
    view.renderWidth = fullViewport ? window.innerWidth : view.width;
    view.renderHeight = fullViewport ? window.innerHeight : view.height;
    if (renderContainer) {
      // The local frame sets the resting position; the canvas covers the whole modal.
      surface.style.height = '100%';
      view.renderWidth = Math.max(1, renderContainer.clientWidth);
      view.renderHeight = Math.max(1, renderContainer.scrollHeight);
      surface.style.height = `${view.renderHeight}px`;
      const surfaceRect = surface.getBoundingClientRect();
      view.left = rect.left - surfaceRect.left;
      view.top = rect.top - surfaceRect.top;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(view.renderWidth, view.renderHeight, false);
    apply();
    render();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  if (renderContainer) resizeObserver.observe(renderContainer);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = expanded ? container.getClientRects().length > 0 : entry.isIntersecting;
    if (expanded) surface.hidden = !visible;
    if (visible) start();
  });
  intersectionObserver.observe(container);
  const onVisibility = () => {
    if (!document.hidden) start();
  };
  document.addEventListener('visibilitychange', onVisibility);
  if (expanded) window.addEventListener('resize', resize);

  resize();

  const dispose = () => {
    alive = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('resize', resize);
    interactionElement.removeEventListener('pointerdown', onPointerDown);
    interactionElement.removeEventListener('pointermove', onPointerMove);
    interactionElement.removeEventListener('pointerup', onPointerUp);
    interactionElement.removeEventListener('pointercancel', onPointerUp);
    interactionElement.removeEventListener('lostpointercapture', onPointerUp);
    interactionElement.removeEventListener('touchstart', onTouchStart);
    [bodyMesh, frontMesh, backMesh, ring, clampMesh, eyelet, band, holder, snap].forEach(mesh => mesh.geometry?.dispose());
    materials.dispose();
    environment.dispose();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    if (expanded) surface.remove();
  };

  return { apply, dispose };
};
