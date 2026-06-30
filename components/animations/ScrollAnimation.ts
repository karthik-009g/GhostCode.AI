export interface ScrollSection {
  id: string;

  start: number;

  end: number;
}

export function normalizeScroll(
  progress: number,
  start: number,
  end: number,
): number {
  if (progress <= start)
    return 0;

  if (progress >= end)
    return 1;

  return (
    (progress - start) /
    (end - start)
  );
}

export function isSectionActive(
  progress: number,
  section: ScrollSection,
): boolean {
  return (
    progress >= section.start &&
    progress <= section.end
  );
}

export function smoothScroll(
  current: number,
  target: number,
  delta: number,
  speed = 4,
): number {
  return (
    current +
    (target - current) *
      (1 -
        Math.exp(
          -speed * delta,
        ))
  );
}

export function getRevealProgress(
  progress: number,
  start: number,
  end: number,
): number {
  return normalizeScroll(
    progress,
    start,
    end,
  );
}

export function getCinematicProgress(
  progress: number,
): number {
  return (
    progress *
    progress *
    (3 - 2 * progress)
  );
}