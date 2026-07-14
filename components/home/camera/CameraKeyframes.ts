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
  { at: 0.08, position: [-1.4, 5.2, 22], target: [-0.8, 2.7, -39], fov: 42, bank: 0.006 },
  { at: 0.17, position: [-3.4, 4.2, 4], target: [0.4, 4.6, -68], fov: 36, bank: 0.02 },
  { at: 0.27, position: [4.8, 6.7, -12], target: [0.1, 6.2, -102], fov: 38, bank: -0.02 },
  { at: 0.38, position: [-4.6, 7.4, -52], target: [2.2, 8.2, -178], fov: 34, bank: 0.028 },
  { at: 0.49, position: [0.8, 8.6, -78], target: [0, 9.2, -220], fov: 35, bank: -0.008 },
  { at: 0.56, position: [-1.2, 12.5, -104], target: [0, 15, -260], fov: 43, bank: 0.004 },
  { at: 0.605, position: [5.5, 10.8, -156], target: [-1.5, 8.2, -282], fov: 36, bank: -0.026 },
  { at: 0.645, position: [-5.8, 13.4, -214], target: [0, 16, -354], fov: 33, bank: 0.022 },
  { at: 0.69, position: [3.8, 15.4, -270], target: [0, 19, -360], fov: 30, bank: -0.014 },
  { at: 0.735, position: [7.2, 11.8, -326], target: [0, 13.2, -432], fov: 35, bank: -0.024 },
  { at: 0.78, position: [-5.6, 9.4, -386], target: [0, 12.5, -500], fov: 32, bank: 0.02 },
  { at: 0.825, position: [2.4, 13.2, -438], target: [0, 14, -550], fov: 34, bank: -0.012 },
  { at: 0.865, position: [9.4, 10.4, -494], target: [7.5, 10.4, -592], fov: 33, bank: -0.032 },
  { at: 0.9, position: [7.8, 8.6, -536], target: [6.5, 8.8, -610], fov: 31, bank: -0.026 },
  { at: 0.925, position: [-5.2, 10.8, -584], target: [0, 11, -642], fov: 34, bank: 0.022 },
  { at: 0.95, position: [0.5, 16.4, -636], target: [0, 18, -695], fov: 30, bank: -0.008 },
  { at: 0.968, position: [-3.8, 12.4, -704], target: [0, 10.5, -760], fov: 35, bank: 0.012 },
  { at: 0.986, position: [4.2, 16.8, -768], target: [0, 18, -842], fov: 37, bank: -0.012 },
  { at: 1, position: [0, 21, -820], target: [0, 18, -900], fov: 42, bank: 0 },
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
