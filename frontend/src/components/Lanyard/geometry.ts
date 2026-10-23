import * as THREE from 'three';
import type { CardLayout, Orientation, PathLike } from './types';
import { BAND_COLUMNS, BEVEL, CARD_SIZES, CLAMP_BODY, RING_RADIUS, THICKNESS, clamp, mix } from './config';

const traceRoundedRect = (path: PathLike, x: number, y: number, width: number, height: number, radius: number) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const k = r * 0.4477;
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.bezierCurveTo(x + width - k, y, x + width, y + k, x + width, y + r);
  path.lineTo(x + width, y + height - r);
  path.bezierCurveTo(x + width, y + height - k, x + width - k, y + height, x + width - r, y + height);
  path.lineTo(x + r, y + height);
  path.bezierCurveTo(x + k, y + height, x, y + height - k, x, y + height - r);
  path.lineTo(x, y + r);
  path.bezierCurveTo(x, y + k, x + k, y, x + r, y);
};

export const cardLayout = (orientation: Orientation, cornerRadius: number): CardLayout => {
  const [width, height] = CARD_SIZES[orientation] || CARD_SIZES.portrait;
  const radius = mix(0.03, Math.min(width, height) * 0.2, clamp(cornerRadius, 0, 1));
  const slot = { width: 0.34, height: 0.07, y: height / 2 - 0.13 };
  const ringY = height / 2 + 0.19;
  return { width, height, radius, slot, ringY, hangY: ringY + RING_RADIUS };
};

export const buildCardGeometry = (layout: CardLayout) => {
  const { width, height, radius } = layout;
  const outline = new THREE.Shape();
  traceRoundedRect(
    outline,
    -width / 2 + BEVEL,
    -height / 2 + BEVEL,
    width - BEVEL * 2,
    height - BEVEL * 2,
    Math.max(radius - BEVEL, 0.005)
  );
  const body = new THREE.ExtrudeGeometry(outline, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 5,
    curveSegments: 24
  });
  body.translate(0, 0, -THICKNESS / 2);
  const face = new THREE.ShapeGeometry(outline, 24);
  const position = face.getAttribute('position');
  const uv = face.getAttribute('uv');
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + width / 2) / width, (position.getY(i) + height / 2) / height);
  }
  uv.needsUpdate = true;
  return { body, face };
};

// A clear welded holder: open center keeps the printed insert crisp.
export const buildHolderGeometry = (layout: CardLayout) => {
  const { width, height } = layout;
  const shape = new THREE.Shape();
  traceRoundedRect(shape, -width / 2 - 0.11, -height / 2 - 0.10,
    width + 0.22, height + 0.37, 0.10);
  const window = new THREE.Path();
  traceRoundedRect(window, -width / 2 + 0.012, -height / 2 + 0.012,
    width - 0.024, height - 0.024, layout.radius);
  shape.holes.push(window);
  const slot = new THREE.Path();
  traceRoundedRect(slot, -0.18, height / 2 + 0.10, 0.36, 0.065, 0.025);
  shape.holes.push(slot);
  for (const x of [-0.52, 0.52]) {
    const hole = new THREE.Path();
    hole.absarc(x, height / 2 + 0.15, 0.035, 0, Math.PI * 2, false);
    shape.holes.push(hole);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.014, bevelEnabled: true, bevelThickness: 0.003,
    bevelSize: 0.003, bevelSegments: 5, curveSegments: 24
  });
  geometry.translate(0, 0, -0.027);
  return geometry;
};

export const buildClampGeometry = (width: number) => {
  const shape = new THREE.Shape();
  const w = width * 1.16;
  traceRoundedRect(shape, -w / 2 + 0.014, -CLAMP_BODY / 2 + 0.014, w - 0.028, CLAMP_BODY - 0.028, 0.024);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.014,
    bevelSegments: 6,
    curveSegments: 10
  });
  geometry.translate(0, 0, -0.01);
  return geometry;
};

export const buildBandGeometry = (count: number) => {
  const columns = BAND_COLUMNS.length;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(count * columns * 3), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * columns * 2), 2));
  const index: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    for (let c = 0; c < columns - 1; c++) {
      const a = i * columns + c;
      index.push(a, a + columns, a + 1, a + 1, a + columns, a + columns + 1);
    }
  }
  geometry.setIndex(index);
  return geometry;
};
