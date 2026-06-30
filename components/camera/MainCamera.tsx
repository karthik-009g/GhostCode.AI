"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { CAMERA } from "@/constants/camera";

export function MainCamera() {
  const { size } = useThree();

  const responsiveFov =
    size.width < 768
      ? CAMERA.fov + 8
      : CAMERA.fov;

  return (
    <PerspectiveCamera
      makeDefault
      fov={responsiveFov}
      near={CAMERA.near}
      far={CAMERA.far}
      position={[
        CAMERA.position.x,
        CAMERA.position.y,
        CAMERA.position.z,
      ]}
      rotation={[
        CAMERA.initialRotation.x,
        CAMERA.initialRotation.y,
        CAMERA.initialRotation.z,
      ]}
    />
  );
}
