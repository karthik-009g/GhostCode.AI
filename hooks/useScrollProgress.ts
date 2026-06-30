"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export interface ScrollProgress {
  progress: number;
  smoothProgress: number;
  scrollY: number;
  direction:
    | "up"
    | "down"
    | "idle";
  velocity: number;
}

export function useScrollProgress():
  ScrollProgress {
  const raf =
    useRef<number>();

  const lastY =
    useRef(0);

  const lastTime =
    useRef(
      performance.now(),
    );

  const smooth =
    useRef(0);

  const [state, setState] =
    useState<ScrollProgress>({
      progress: 0,
      smoothProgress: 0,
      scrollY: 0,
      direction:
        "idle",
      velocity: 0,
    });

  useEffect(() => {
    function update() {
      const now =
        performance.now();

      const scrollY =
        window.scrollY;

      const max =
        document
          .documentElement
          .scrollHeight -
        window.innerHeight;

      const progress =
        max > 0
          ? Math.min(
              scrollY / max,
              1,
            )
          : 0;

      const deltaY =
        scrollY -
        lastY.current;

      const deltaT =
        Math.max(
          now -
            lastTime.current,
          1,
        );

      smooth.current +=
        (
          progress -
          smooth.current
        ) * 0.1;

      setState({
        progress,

        smoothProgress:
          smooth.current,

        scrollY,

        direction:
          deltaY > 0
            ? "down"
            : deltaY < 0
            ? "up"
            : "idle",

        velocity:
          Math.abs(
            deltaY,
          ) / deltaT,
      });

      lastY.current =
        scrollY;

      lastTime.current =
        now;

      raf.current =
        undefined;
    }

    function onScroll() {
      if (
        raf.current ===
        undefined
      ) {
        raf.current =
          requestAnimationFrame(
            update,
          );
      }
    }

    update();

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      onScroll,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        onScroll,
      );

      window.removeEventListener(
        "resize",
        onScroll,
      );

      if (
        raf.current !==
        undefined
      ) {
        cancelAnimationFrame(
          raf.current,
        );
      }
    };
  }, []);

  return state;
}