/**
 * Clamp a value.
 */
export function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.max(
    min,
    Math.min(max, value),
  );
}

/**
 * Normalize value between two points.
 */
export function inverseLerp(
  a: number,
  b: number,
  value: number,
): number {
  if (a === b) return 0;

  return (value - a) / (b - a);
}

/**
 * Remap value.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  shouldClamp = false,
): number {
  if (inMin === inMax)
    return outMin;

  const t = inverseLerp(
    inMin,
    inMax,
    value,
  );

  const mapped =
    outMin +
    (outMax - outMin) * t;

  return shouldClamp
    ? clamp(
        mapped,
        outMin,
        outMax,
      )
    : mapped;
}

/**
 * Degrees -> radians
 */
export function degToRad(
  deg: number,
): number {
  return (deg * Math.PI) / 180;
}

/**
 * Radians -> degrees
 */
export function radToDeg(
  rad: number,
): number {
  return (rad * 180) / Math.PI;
}

/**
 * Round decimals.
 */
export function round(
  value: number,
  decimals = 2,
): number {
  return (
    Math.round(
      value * 10 ** decimals,
    ) /
    10 ** decimals
  );
}

/**
 * Random float.
 */
export function randomFloat(
  min: number,
  max: number,
): number {
  return (
    Math.random() *
      (max - min) +
    min
  );
}

/**
 * Random integer.
 */
export function randomInt(
  min: number,
  max: number,
): number {
  return Math.floor(
    randomFloat(
      min,
      max + 1,
    ),
  );
}

/**
 * Random sign.
 */
export function randomSign(): 1 | -1 {
  return Math.random() > 0.5
    ? 1
    : -1;
}

/**
 * Normalize.
 */
export function normalize(
  value: number,
  min: number,
  max: number,
): number {
  return clamp(
    inverseLerp(
      min,
      max,
      value,
    ),
    0,
    1,
  );
}