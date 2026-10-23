import * as THREE from 'three';
import type { Simulation } from './types';
import { BAND_BEND, BAND_COLUMNS, CLAMP_BODY, EYELET_RADIUS, JOINTS, SAMPLES } from './config';

export const createBandUpdater = (
  sim: Simulation,
  camera: THREE.PerspectiveCamera,
  bandGeometry: THREE.BufferGeometry,
  clampGroup: THREE.Group
) => {
  const controls: THREE.Vector3[] = [];
  const mouth = new THREE.Vector3();
  const tuck = new THREE.Vector3();
  const curve = new THREE.CatmullRomCurve3(controls, false, 'centripetal');
  const points = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
  const sides = Array.from({ length: SAMPLES }, () => new THREE.Vector3());
  const bends = BAND_BEND.map((angle): [number, number] => [Math.cos(angle), Math.sin(angle)]);
  const work = {
    fallback: new THREE.Vector3(),
    tangent: new THREE.Vector3(),
    toCamera: new THREE.Vector3(),
    basis: new THREE.Matrix4(),
    up: new THREE.Vector3(),
    across: new THREE.Vector3(),
    facing: new THREE.Vector3(),
    end: new THREE.Vector3()
  };

  return (strapScale: number, tileRatio: number) => {
    const hang = sim.nodes[JOINTS];
    const reach = EYELET_RADIUS + CLAMP_BODY + 0.05;
    let guide = JOINTS - 1;
    while (guide > 0 && sim.nodes[guide].distanceTo(hang) < reach * 1.1) guide--;
    const axis = work.up.subVectors(sim.nodes[guide], hang);
    if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0).applyQuaternion(sim.body.quaternion);
    axis.normalize();
    mouth.copy(hang).addScaledVector(axis, reach);
    tuck.copy(hang).addScaledVector(axis, EYELET_RADIUS + CLAMP_BODY * 0.35);
    controls.length = 0;
    for (let i = 0; i <= guide; i++) controls.push(sim.nodes[i]);
    controls.push(mouth, tuck);
    curve.updateArcLengths();
    for (let i = 0; i < SAMPLES; i++) curve.getPointAt(i / (SAMPLES - 1), points[i]);
    const length = curve.getLength();
    const held = 1 - mouth.distanceTo(tuck) / Math.max(length, 0.001);
    const position = bandGeometry.getAttribute('position');
    const normal = bandGeometry.getAttribute('normal');
    const uv = bandGeometry.getAttribute('uv');
    const columns = BAND_COLUMNS.length;
    const restLength = sim.rest * JOINTS;
    const repeats = restLength / (strapScale * tileRatio);
    const width = strapScale / Math.pow(Math.max(1, length / Math.max(restLength, 0.001)), 0.35);
    const { tangent, toCamera, across, facing } = work;
    for (let i = 0; i < SAMPLES; i++) {
      tangent.subVectors(points[Math.min(SAMPLES - 1, i + 1)], points[Math.max(0, i - 1)]);
      if (tangent.lengthSq() < 1e-12) tangent.set(0, -1, 0);
      tangent.normalize();
      toCamera.subVectors(camera.position, points[i]).normalize();
      const side = sides[i].crossVectors(toCamera, tangent);
      if (side.lengthSq() < 1e-10) side.copy(i > 0 ? sides[i - 1] : work.fallback.set(1, 0, 0));
      side.normalize();
      if (i > 0 && side.dot(sides[i - 1]) < 0) side.negate();
      const angle = -sim.twist * Math.pow(Math.min(1, i / (SAMPLES - 1) / held), 1.3);
      facing.crossVectors(tangent, side);
      across.copy(side).multiplyScalar(Math.cos(angle)).addScaledVector(facing, Math.sin(angle));
      facing.crossVectors(tangent, across);
      const p = points[i];
      const v = (1 - i / (SAMPLES - 1)) * repeats;
      for (let c = 0; c < columns; c++) {
        const k = i * columns + c;
        const offset = (BAND_COLUMNS[c] - 0.5) * width;
        const [bendCos, bendSin] = bends[c];
        position.setXYZ(k, p.x + across.x * offset, p.y + across.y * offset, p.z + across.z * offset);
        normal.setXYZ(
          k,
          facing.x * bendCos + across.x * bendSin,
          facing.y * bendCos + across.y * bendSin,
          facing.z * bendCos + across.z * bendSin
        );
        uv.setXY(k, BAND_COLUMNS[c], v);
      }
    }
    work.end.copy(across);
    position.needsUpdate = true;
    normal.needsUpdate = true;
    uv.needsUpdate = true;

    across.copy(work.end).addScaledVector(axis, -work.end.dot(axis)).normalize();
    facing.crossVectors(across, axis).normalize();
    work.basis.makeBasis(across, axis, facing);
    clampGroup.quaternion.setFromRotationMatrix(work.basis);
    clampGroup.position.copy(hang);
  };

};
