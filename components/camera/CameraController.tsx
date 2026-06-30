"use client";

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { dampVector3 } from "@/lib/lerp";
import { CAMERA } from "@/constants/camera";
import { ANIMATION } from "@/constants/animation";

interface CameraControllerProps {
  scrollProgress: number;
  enableIdleOrbit: boolean;
}

export function CameraController({
  scrollProgress,
  enableIdleOrbit,
}: CameraControllerProps) {
  const { camera } =
    useThree();

  const targetPos =
    useRef(
      new THREE.Vector3(
        CAMERA.position.x,
        CAMERA.position.y,
        CAMERA.position.z,
      ),
    );

  const targetLook =
    useRef(
      new THREE.Vector3(
        CAMERA.target.x,
        CAMERA.target.y,
        CAMERA.target.z,
      ),
    );

  const currentLook =
    useRef(
      new THREE.Vector3(
        CAMERA.target.x,
        CAMERA.target.y,
        CAMERA.target.z,
      ),
    );
  const currentFov =
    useRef<number>(
      CAMERA.fov,
    );
  const tempVector =
    useRef(new THREE.Vector3());

  useFrame(
    (state, delta) => {
      const t =
        state.clock.elapsedTime;

      const scrollX =
        THREE.MathUtils.lerp(
          -2.4,
          2.8,
          scrollProgress,
        );
      const scrollY =
        THREE.MathUtils.lerp(
          2.6,
          0.5,
          scrollProgress,
        );
      const scrollZ =
        THREE.MathUtils.lerp(
          18,
          8.5,
          scrollProgress,
        );
      const targetY =
        THREE.MathUtils.lerp(
          0.8,
          -0.3,
          scrollProgress,
        );
      const ghostBias =
        THREE.MathUtils.smoothstep(
          scrollProgress,
          0.56,
          0.94,
        );

      if (
        enableIdleOrbit
      ) {
        targetPos.current.set(
          scrollX,
          scrollY,
          scrollZ,
        );

        targetPos.current.x +=
          Math.sin(
            t *
              ANIMATION
                .camera
                .idleFrequency,
          ) *
          ANIMATION
            .camera
            .idleAmplitude *
          5.5;

        targetPos.current.y +=
          Math.cos(
            t *
              ANIMATION
                .camera
                .idleFrequency *
              0.7,
          ) *
          ANIMATION
            .camera
            .idleAmplitude *
          2.4;
      } else {
        targetPos.current.set(
          scrollX,
          scrollY,
          scrollZ,
        );
      }

      targetLook.current.set(
        THREE.MathUtils.lerp(
          0,
          1.3,
          scrollProgress,
        ),
        targetY,
        THREE.MathUtils.lerp(
          1.4,
          2.8,
          scrollProgress,
        ),
      );

      tempVector.current.set(
        state.pointer.x * 0.55,
        state.pointer.y * 0.35,
        0,
      );

      targetPos.current.add(
        tempVector.current,
      );
      targetLook.current.add(
        tempVector.current
          .clone()
          .multiplyScalar(0.22),
      );

      dampVector3(
        camera.position,
        targetPos.current,
        3,
        delta,
      );

      dampVector3(
        currentLook.current,
        targetLook.current,
        4,
        delta,
      );

      camera.rotation.z =
        Math.sin(
          t * 0.18,
        ) *
          0.0035 +
        ghostBias * 0.018;

      currentFov.current =
        THREE.MathUtils.lerp(
          currentFov.current,
          THREE.MathUtils.lerp(
            42,
            50,
            ghostBias,
          ),
          1 - Math.exp(-2 * delta),
        );

      if (
        "fov" in camera
      ) {
        camera.fov =
          currentFov.current;
        camera.updateProjectionMatrix();
      }

      camera.lookAt(
        currentLook.current,
      );
    },
  );

  return null;
}
