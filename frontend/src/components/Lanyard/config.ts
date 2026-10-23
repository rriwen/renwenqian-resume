import type { FinishLook } from './types';

export const CARD_SIZES: Record<string, [number, number]> = {
  portrait: [1.6, 2.25],
  landscape: [2.25, 1.6]
};
export const ANCHORS: Record<string, number> = { left: 0.27, center: 0.5, right: 0.73 };
export const THICKNESS = 0.018;
export const BEVEL = 0.0035;
export const JOINTS = 4;
export const NODE_WEIGHT = 1 / 0.05;
export const MAX_STEP = 1 / 960;
export const ITERATIONS = 2;
export const SAMPLES = 72;
export const FOV = 24;
export const STRAP_WIDTH = 0.36;
export const RING_RADIUS = 0.095;
export const EYELET_RADIUS = 0.036;
export const CLAMP_BODY = 0.15;
export const FACE_WIDTH = 1024;

export const FINISHES: Record<string, FinishLook> = {
  glossy: { roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.06, foil: 0, anisotropy: 0 },
  matte: { roughness: 0.85, metalness: 0, clearcoat: 0, clearcoatRoughness: 0.6, foil: 0, anisotropy: 0 },
  holographic: { roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, foil: 1, anisotropy: 0 },
  metallic: { roughness: 0.36, metalness: 0.75, clearcoat: 0.5, clearcoatRoughness: 0.18, foil: 0, anisotropy: 0.7 }
};

export const BAND_COLUMNS = [0, 0.07, 0.93, 1];
export const BAND_BEND = [-0.95, -0.28, 0.28, 0.95];
export const FLIP_SPIN = 9;

export const METALS: Record<string, { color: string; roughness: number }> = {
  silver: { color: '#d9dce2', roughness: 0.16 },
  gold: { color: '#e4b965', roughness: 0.2 },
  graphite: { color: '#4d4f55', roughness: 0.28 }
};

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
