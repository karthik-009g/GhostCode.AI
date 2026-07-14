import {
  createRng,
  range,
  type TowerSpec,
} from "../shared";

export type WindowBand = {
  y: number;
  width: number;
  opacity: number;
  phase: number;
};

export function createWindowBands(
  spec: TowerSpec,
  index: number,
  density: number,
): WindowBand[] {
  const rng = createRng(index * 911 + Math.floor(spec.height * 37));
  const count = Math.max(7, Math.floor((spec.height / 2.4) * density));

  return Array.from({ length: count }, (_, row) => ({
    y: -spec.height * 0.38 + row * (spec.height / count),
    width: spec.width * range(rng, 0.54, 0.86),
    opacity: range(rng, 0.08, 0.3),
    phase: range(rng, 0, Math.PI * 2),
  }));
}
