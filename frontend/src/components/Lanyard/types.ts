import type { CSSProperties } from 'react';
import type * as THREE from 'three';

export type Orientation = 'portrait' | 'landscape';
export type Finish = 'glossy' | 'matte' | 'holographic' | 'metallic';
export type Metal = 'graphite' | 'silver' | 'gold';
export type Anchor = 'left' | 'center' | 'right';
export type ImageFit = 'cover' | 'contain';
export type Rgb = [number, number, number];
export type Point = { clientX: number; clientY: number };

export interface PathLike {
  moveTo(x: number, y: number): unknown;
  lineTo(x: number, y: number): unknown;
  bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): unknown;
}

export interface LanyardProps {
  frontImage?: string;
  backImage?: string;
  imageFit?: ImageFit;
  cardColor?: string;
  orientation?: Orientation;
  finish?: Finish;
  cornerRadius?: number;
  size?: number;
  anchor?: Anchor;
  strapLength?: number;
  strapImage?: string;
  strapColor?: string;
  strapWidth?: number;
  metal?: Metal;
  gravity?: number;
  damping?: number;
  elasticity?: number;
  breeze?: number;
  interactive?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface Settings {
  frontImage?: string;
  backImage?: string;
  imageFit: ImageFit;
  cardColor: string;
  orientation: Orientation;
  finish: Finish;
  cornerRadius: number;
  size: number;
  anchor: Anchor;
  strapLength: number;
  strapImage?: string;
  strapColor: string;
  strapWidth: number;
  metal: Metal;
  gravity: number;
  damping: number;
  elasticity: number;
  breeze: number;
  interactive: boolean;
  intro: boolean;
}

export interface Images {
  front: HTMLImageElement | null;
  back: HTMLImageElement | null;
  strap: HTMLImageElement | null;
}

export interface CardLayout {
  width: number;
  height: number;
  radius: number;
  slot: { width: number; height: number; y: number };
  ringY: number;
  hangY: number;
}

export interface FinishLook {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  foil: number;
  anisotropy: number;
}

export interface Body {
  position: THREE.Vector3;
  previous: THREE.Vector3;
  velocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  previousQuaternion: THREE.Quaternion;
  angular: THREE.Vector3;
  mass: number;
  inverseInertia: THREE.Vector3;
  hang: THREE.Vector3;
}

export interface Grab {
  local: THREE.Vector3;
  rotation: THREE.Quaternion;
  reach: number;
  from: THREE.Vector3;
  target: THREE.Vector3;
}

export interface Simulation {
  nodes: THREE.Vector3[];
  previous: THREE.Vector3[];
  velocities: THREE.Vector3[];
  lengths: Float64Array;
  impulses: Float64Array;
  rest: number;
  anchor: THREE.Vector3;
  body: Body;
  grab: Grab | null;
  turn: number;
  twist: number;
  twistRaw: number;
  calm: number;
}

export interface Physics {
  gravity: number;
  hold: number;
  stiffness: number;
  spring: number;
  bandDamping: number;
  linearDrag: number;
  angularDrag: number;
  air: number;
  broadside: number;
  spinAir: number;
  nodeDrag: number;
  nodeAir: number;
  twist: number;
  twistDamping: number;
  grip: number;
  gripDamping: number;
  breeze: number;
}

export interface Applied {
  layoutKey?: string;
  framingKey?: string;
  imageKey?: string;
  faceKey?: string;
  strapColor?: string;
  strapScale?: number;
}

export interface Press {
  x: number;
  y: number;
  time: number;
  point: THREE.Vector3;
}
