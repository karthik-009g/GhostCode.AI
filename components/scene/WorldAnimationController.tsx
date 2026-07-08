"use client";

import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import { useAnimationStore } from "@/stores/animation.store";

interface WorldAnimationControllerProps {
  scrollProgress: number;
}

export function WorldAnimationController({
  scrollProgress,
}: WorldAnimationControllerProps) {
  const setGlobalTime = useAnimationStore(
    (state) => state.setGlobalTime,
  );

  const setIntroProgress = useAnimationStore(
    (state) => state.setIntroProgress,
  );

  useEffect(() => {
    setIntroProgress(scrollProgress);
  }, [scrollProgress, setIntroProgress]);

  useFrame((state) => {
    setGlobalTime(state.clock.elapsedTime);
  });

  return null;
}