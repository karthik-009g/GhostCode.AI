"use client";

import type { ExperienceProps } from "@/types/scene";

import { CameraRig } from "@/components/camera/CameraRig";
import { Environment as EnvironmentSystem } from "@/components/environment/Environment";
import { Effects } from "@/components/effects/Effects";

import { GhostWorld } from "./GhostWorld";
import { SceneLoader } from "./SceneLoader";

export function Experience({
  scrollProgress = 0,
}: ExperienceProps) {
  return (
    <>
      <CameraRig
        scrollProgress={
          scrollProgress
        }
        enableIdleOrbit
      />

      <SceneLoader>
        <EnvironmentSystem />
        <GhostWorld
          scrollProgress={
            scrollProgress
          }
        />
      </SceneLoader>

      <Effects />
    </>
  );
}
