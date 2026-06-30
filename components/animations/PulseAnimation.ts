export interface PulseSettings {
  min: number;
  max: number;
  speed: number;
  offset?: number;
}

export function getPulse(
  time: number,
  settings: PulseSettings,
): number {
  const wave =
    (Math.sin(
      time *
        settings.speed +
        (settings.offset ?? 0),
    ) +
      1) *
    0.5;

  return (
    settings.min +
    (settings.max -
      settings.min) *
      wave
  );
}

export function getConnectionPulse(
  time: number,
  speed = 1.5,
): number {
  return (
    0.5 +
    Math.sin(
      time * speed,
    ) *
      0.5
  );
}

export function getCorruptionPulse(
  time: number,
  intensity: number,
): number {
  return (
    1 +
    Math.sin(
      time * 8,
    ) *
      intensity
  );
}

export function getFlicker(
  time: number,
): number {
  return (
    0.7 +
    Math.sin(
      time * 12,
    ) *
      0.3
  );
}