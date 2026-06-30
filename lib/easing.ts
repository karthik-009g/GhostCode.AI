export type EasingFn = (
  t: number,
) => number;

export const easing: Record<
  string,
  EasingFn
> = {
  linear: (t) => t,

  easeInQuad: (t) => t * t,

  easeOutQuad: (t) =>
    t * (2 - t),

  easeInOutQuad: (t) =>
    t < 0.5
      ? 2 * t * t
      : -1 +
        (4 - 2 * t) * t,

  easeInCubic: (t) =>
    t * t * t,

  easeOutCubic: (t) =>
    --t * t * t + 1,

  easeInOutCubic: (t) =>
    t < 0.5
      ? 4 * t * t * t
      : (t - 1) *
            (2 * t - 2) *
            (2 * t - 2) +
          1,

  easeInExpo: (t) =>
    t === 0
      ? 0
      : Math.pow(
          2,
          10 * t - 10,
        ),

  easeOutExpo: (t) =>
    t === 1
      ? 1
      : 1 -
        Math.pow(
          2,
          -10 * t,
        ),

  easeInOutSine: (t) =>
    -(Math.cos(
      Math.PI * t,
    ) - 1) / 2,

  easeInOutExpo: (t) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? Math.pow(
          2,
          20 * t - 10,
        ) / 2
      : (2 -
          Math.pow(
            2,
            -20 * t + 10,
          )) /
        2,

  ghostEase: (t) => {
    const c4 =
      (2 * Math.PI) / 3;

    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(
          2,
          -10 * t,
        ) *
          Math.sin(
            (t * 10 -
              0.75) *
              c4,
          ) +
        1;
  },

  cinematic: (t) =>
    1 -
    Math.pow(
      1 - t,
      4,
    ),

  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return (
      1 +
      c3 *
        Math.pow(
          t - 1,
          3,
        ) +
      c1 *
        Math.pow(
          t - 1,
          2,
        )
    );
  },
};