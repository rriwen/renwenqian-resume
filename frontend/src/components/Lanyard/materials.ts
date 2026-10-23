import * as THREE from 'three';
import type { CardLayout, Settings } from './types';
import { FINISHES, METALS } from './config';
import { buildGrainTexture, buildWeaveTexture, luminance, makeCanvasTexture, parseColor } from './textures';

const FOIL_VERTEX_HEAD = `
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;
`;

const FOIL_VERTEX_BODY = `
vFoilUv = uv;
vFoilX = normalize((modelViewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
vFoilY = normalize((modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
`;

const FOIL_FRAGMENT_HEAD = `
uniform float foilStrength;
uniform float foilAspect;
uniform vec3 foilKey;
uniform vec3 foilFill;
uniform vec3 foilTop;
varying vec2 vFoilUv;
varying vec3 vFoilX;
varying vec3 vFoilY;

float foilHash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float foilBump(float t, float center, float width) {
  float x = (t - center) / width;
  return max(0.0, 1.0 - x * x);
}

vec3 foilSpectrum(float t) {
  return vec3(
    foilBump(t, 0.82, 0.32) + 0.4 * foilBump(t, 0.02, 0.12),
    foilBump(t, 0.5, 0.26),
    foilBump(t, 0.18, 0.24)
  );
}

vec3 foilGrating(float u, float spacing) {
  vec3 color = vec3(0.0);
  for (int m = 1; m <= 2; m++) {
    float order = float(m);
    float t = (spacing * abs(u) / order - 0.38) / 0.32;
    color += foilSpectrum(t) / order;
  }
  return color;
}

vec3 foilShard(vec2 p) {
  vec2 base = floor(p);
  float best = 9.0;
  float edge = 9.0;
  vec2 id = base;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      vec2 site = cell + vec2(foilHash(cell), foilHash(cell + 7.31)) * 0.9 + 0.05;
      float d = length(site - p);
      if (d < best) {
        edge = best;
        best = d;
        id = cell;
      } else if (d < edge) {
        edge = d;
      }
    }
  }
  return vec3(foilHash(id + 3.17), foilHash(id + 11.73), edge - best);
}
`;

const FOIL_FRAGMENT_BODY = `
if (foilStrength > 0.0) {
  vec3 foilView = normalize(vViewPosition);
  vec3 foilNormal = normalize(normal);
  vec2 foilP = vec2(vFoilUv.x, vFoilUv.y * foilAspect);
  vec3 shard = foilShard(foilP * 26.0);
  vec2 ray = foilP - vec2(-1.6, 2.6 * foilAspect);
  float angle = atan(ray.y, ray.x) + (shard.x - 0.5) * 0.16;
  vec3 grating = normalize(vFoilX * cos(angle) + vFoilY * sin(angle));
  float spacing = 1.7 * (0.95 + shard.y * 0.1);
  vec3 rainbow = foilGrating(dot(foilKey + foilView, grating), spacing);
  rainbow += 0.6 * foilGrating(dot(foilTop + foilView, grating), spacing);
  rainbow *= 0.8 + 0.2 * smoothstep(0.0, 0.04, shard.z);
  rainbow = max(rainbow - 0.35 * min(rainbow.r, min(rainbow.g, rainbow.b)), 0.0);
  vec2 grid = foilP * 64.0;
  vec2 cell = floor(grid);
  vec2 jitter = vec2(foilHash(cell + 1.7), foilHash(cell + 9.2));
  float flake = smoothstep(0.32, 0.06, length(fract(grid) - jitter * 0.6 - 0.2)) * step(0.45, foilHash(cell + 4.4));
  vec3 facet = normalize(foilNormal + (vFoilX * (jitter.x - 0.5) + vFoilY * (jitter.y - 0.5)) * 0.8);
  float glint = pow(max(dot(reflect(-foilKey, facet), foilView), 0.0), 28.0);
  glint += 0.7 * pow(max(dot(reflect(-foilTop, facet), foilView), 0.0), 28.0);
  float fine = 1.0 - smoothstep(0.35, 0.9, max(fwidth(grid.x), fwidth(grid.y)));
  vec3 sparkle = flake * glint * fine * (vec3(0.7) + foilGrating(dot(foilKey + foilView, grating) + jitter.x * 0.4, spacing));
  float ink = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float foil = foilStrength * (0.08 + 0.92 * smoothstep(0.04, 0.7, ink));
  float facing = clamp(dot(foilNormal, foilView), 0.0, 1.0);
  float tint = clamp(dot(rainbow, vec3(0.4)), 0.0, 1.0);
  outgoingLight = outgoingLight * (1.0 - foil * (0.3 + 0.32 * tint)) + (rainbow * 0.62 * (0.4 + 0.6 * facing) + sparkle * 1.6) * foil;
}
`;

export const createMaterials = (anisotropy: number) => {
  const frontCanvas = document.createElement('canvas');
  const backCanvas = document.createElement('canvas');
  const strapCanvas = document.createElement('canvas');
  const frontTexture = makeCanvasTexture(frontCanvas, anisotropy);
  const backTexture = makeCanvasTexture(backCanvas, anisotropy);
  const strapTexture = makeCanvasTexture(strapCanvas, anisotropy);
  strapTexture.wrapS = THREE.ClampToEdgeWrapping;
  strapTexture.wrapT = THREE.RepeatWrapping;
  const grain = buildGrainTexture();
  const weave = buildWeaveTexture();
  const foilUniforms = {
    foilStrength: { value: 0 },
    foilAspect: { value: 1.4 },
    foilKey: { value: new THREE.Vector3() },
    foilFill: { value: new THREE.Vector3() },
    foilTop: { value: new THREE.Vector3() }
  };
  const injectFoil = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, foilUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${FOIL_VERTEX_HEAD}`)
      .replace('#include <project_vertex>', `#include <project_vertex>\n${FOIL_VERTEX_BODY}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FOIL_FRAGMENT_HEAD}`)
      .replace('#include <opaque_fragment>', `${FOIL_FRAGMENT_BODY}\n#include <opaque_fragment>`);
  };

  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTexture,
    normalMap: grain,
    normalScale: new THREE.Vector2(0.06, 0.06)
  });
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTexture,
    normalMap: grain,
    normalScale: new THREE.Vector2(0.06, 0.06)
  });
  // Only compile the expensive foil shader when that finish is requested.
  const noFoil = () => {};
  let hasFoil = false;
  const edgeMaterial = new THREE.MeshPhysicalMaterial();
  const metalMaterial = new THREE.MeshStandardMaterial({ metalness: 1 });
  const bandMaterial = new THREE.MeshPhysicalMaterial({
    map: strapTexture,
    normalMap: weave,
    normalScale: new THREE.Vector2(0.16, 0.28),
    roughness: 0.36,
    sheen: 1,
    sheenRoughness: 0.24,
    anisotropy: 0.65,
    sheenColor: new THREE.Color(0.32, 0.32, 0.34),
    side: THREE.DoubleSide
  });

  const holderMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e9edf0', transparent: true, opacity: 0.24,
    roughness: 0.28, metalness: 0, clearcoat: 0.55,
    clearcoatRoughness: 0.22, side: THREE.DoubleSide, depthWrite: false
  });

  const applyFinish = (s: Settings, layout: CardLayout) => {
    const nextHasFoil = s.finish === 'holographic';
    if (nextHasFoil !== hasFoil) {
      hasFoil = nextHasFoil;
      for (const material of [frontMaterial, backMaterial]) {
        material.onBeforeCompile = hasFoil ? injectFoil : noFoil;
        material.needsUpdate = true;
      }
    }
    const finish = FINISHES[s.finish] || FINISHES.glossy;
    const card = parseColor(s.cardColor, [1, 1, 1]);
    holderMaterial.opacity = luminance(card) < 0.3 ? 0.14 : 0.24;
    [frontMaterial, backMaterial].forEach(material => {
      material.roughness = finish.roughness;
      material.metalness = finish.metalness;
      material.clearcoat = finish.clearcoat;
      material.clearcoatRoughness = finish.clearcoatRoughness;
      material.anisotropy = finish.anisotropy;
    });
    foilUniforms.foilStrength.value = finish.foil;
    foilUniforms.foilAspect.value = layout.height / layout.width;
    edgeMaterial.color.setRGB(card[0] * 0.92, card[1] * 0.92, card[2] * 0.92, THREE.SRGBColorSpace);
    edgeMaterial.roughness = 0.65;
    edgeMaterial.metalness = finish.metalness;
    edgeMaterial.clearcoat = 0.15;
    edgeMaterial.clearcoatRoughness = 0.35;
    const metalLook = METALS[s.metal] || METALS.silver;
    metalMaterial.color.set(metalLook.color);
    metalMaterial.roughness = metalLook.roughness;
  };

  const dispose = () => {
    [frontMaterial, backMaterial, edgeMaterial, metalMaterial, bandMaterial, holderMaterial].forEach(material => material.dispose());
    [frontTexture, backTexture, strapTexture, grain, weave].forEach(texture => texture.dispose());
  };

  return {
    frontCanvas, backCanvas, strapCanvas, frontTexture, backTexture, strapTexture, weave, foilUniforms, frontMaterial, backMaterial, edgeMaterial, metalMaterial, bandMaterial, holderMaterial,
    applyFinish, dispose
  };
};
