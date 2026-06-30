export interface FloatSettings {
  amplitude: number;
  frequency: number;
  phaseOffset?: number;
}

export function getFloatOffset(
  time: number,
  settings: FloatSettings,
): number {
  return (
    Math.sin(
      time *
        settings.frequency +
        (settings.phaseOffset ?? 0),
    ) * settings.amplitude
  );
}

export function getGhostDrift(
  time: number,
  amplitude: number,
): {
  x: number;
  y: number;
  z: number;
} {
  return {
    x:
      Math.sin(time * 0.3) *
      amplitude,

    y:
      Math.cos(time * 0.5) *
      amplitude *
      0.5,

    z:
      Math.sin(time * 0.2) *
      amplitude *
      0.3,
  };
}

export function getBreathingScale(
  time: number,
  amount = 0.05,
): number {
  return (
    1 +
    Math.sin(time * 2) *
      amount
  );
}