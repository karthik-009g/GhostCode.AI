import * as THREE from "three";

type CameraShot = {
  at: number;
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
  bank: number;
};

const SHOTS: readonly CameraShot[] = [
  { at: 0, position: [5.8, 28, 44], target: [-2.4, 4.5, -70], fov: 46, bank: -0.025 },
  { at: 0.09, position: [-1.4, 5.2, 22], target: [-0.8, 2.7, -39], fov: 42, bank: 0.006 },
  { at: 0.22, position: [4.8, 6.7, -10], target: [0.1, 4.8, -92], fov: 39, bank: -0.018 },
  { at: 0.36, position: [2.4, 3.4, -46], target: [1.2, 3.75, -154], fov: 32, bank: -0.014 },
  { at: 0.48, position: [0.8, 8, -75], target: [0, 7.1, -211], fov: 34, bank: -0.008 },
  { at: 0.54, position: [-1, 12, -90], target: [0, 15, -250], fov: 42, bank: 0 },
  { at: 0.58, position: [1, 10, -118], target: [0, 8, -280], fov: 39, bank: -0.006 },
  { at: 0.64, position: [-4.5, 11.8, -190], target: [0, 15, -356], fov: 34, bank: 0.012 },
  { at: 0.71, position: [4.2, 10.2, -265], target: [0, 10, -432], fov: 36, bank: -0.012 },
  { at: 0.77, position: [-2.8, 9.2, -336], target: [0, 10, -500], fov: 33, bank: 0.01 },
  { at: 0.82, position: [1.8, 11.5, -392], target: [0, 12, -550], fov: 35, bank: -0.008 },
  { at: 0.87, position: [7.2, 10, -456], target: [6, 10, -592], fov: 35, bank: -0.018 },
  { at: 0.915, position: [-3.6, 10, -526], target: [0, 10, -642], fov: 36, bank: 0.012 },
  { at: 0.945, position: [0, 14, -588], target: [0, 16, -695], fov: 33, bank: -0.006 },
  { at: 0.965, position: [-2, 13, -658], target: [0, 10, -760], fov: 36, bank: 0.008 },
  { at: 0.982, position: [3, 15, -728], target: [0, 15, -842], fov: 38, bank: -0.008 },
  { at: 1, position: [0, 19, -806], target: [0, 18, -900], fov: 42, bank: 0 },
];

const nextPosition = new THREE.Vector3();
const nextTarget = new THREE.Vector3();

export function sampleDirectedCamera(
  progress: number,
  position: THREE.Vector3,
  target: THREE.Vector3,
) {
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  let current = SHOTS[0]!;
  let next = SHOTS[SHOTS.length - 1]!;

  for (let index = 0; index < SHOTS.length - 1; index += 1) {
    const candidate = SHOTS[index]!;
    const following = SHOTS[index + 1]!;
    if (clamped <= following.at) {
      current = candidate;
      next = following;
      break;
    }
  }

  const local = THREE.MathUtils.clamp(
    (clamped - current.at) / Math.max(next.at - current.at, 0.0001),
    0,
    1,
  );
  const eased = local * local * (3 - 2 * local);
  position.set(...current.position);
  nextPosition.set(...next.position);
  position.lerp(nextPosition, eased);
  target.set(...current.target);
  nextTarget.set(...next.target);
  target.lerp(nextTarget, eased);

  return {
    fov: THREE.MathUtils.lerp(current.fov, next.fov, eased),
    bank: THREE.MathUtils.lerp(current.bank, next.bank, eased),
  };
}
