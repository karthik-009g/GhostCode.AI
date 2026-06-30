import type * as THREE from "three";

/**
 * Linear interpolation.
 */
export function lerp(
  a: number,
  b: number,
  t: number,
): number {
  return a + (b - a) * t;
}

/**
 * Framerate independent damping.
 */
export function damp(
  a: number,
  b: number,
  lambda: number,
  dt: number,
): number {
  return lerp(
    a,
    b,
    1 -
      Math.exp(
        -lambda * dt,
      ),
  );
}

/**
 * Vector3 damping.
 */
export function dampVector3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
): void {
  current.x = damp(
    current.x,
    target.x,
    lambda,
    dt,
  );

  current.y = damp(
    current.y,
    target.y,
    lambda,
    dt,
  );

  current.z = damp(
    current.z,
    target.z,
    lambda,
    dt,
  );
}

/**
 * Euler damping.
 */
export function dampEuler(
  current: THREE.Euler,
  target: THREE.Euler,
  lambda: number,
  dt: number,
): void {
  current.x = damp(
    current.x,
    target.x,
    lambda,
    dt,
  );

  current.y = damp(
    current.y,
    target.y,
    lambda,
    dt,
  );

  current.z = damp(
    current.z,
    target.z,
    lambda,
    dt,
  );
}

/**
 * Smoothstep.
 */
export function smoothstep(
  edge0: number,
  edge1: number,
  x: number,
): number {
  if (edge0 === edge1)
    return 0;

  const t = Math.max(
    0,
    Math.min(
      1,
      (x - edge0) /
        (edge1 - edge0),
    ),
  );

  return (
    t * t * (3 - 2 * t)
  );
}

/**
 * Smootherstep.
 */
export function smootherstep(
  edge0: number,
  edge1: number,
  x: number,
): number {
  if (edge0 === edge1)
    return 0;

  const t = Math.max(
    0,
    Math.min(
      1,
      (x - edge0) /
        (edge1 - edge0),
    ),
  );

  return (
    t *
    t *
    t *
    (t *
      (t * 6 - 15) +
      10)
  );
}