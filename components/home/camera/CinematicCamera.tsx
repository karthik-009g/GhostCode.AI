import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useRef } from "react";
import * as THREE from "three";

import {
  CAMERA_KEYS,
  type HoverState,
  sampleTrack,
} from "../shared";

type CinematicCameraProps = {
  progress: number;
  hoverRef: MutableRefObject<HoverState>;
};

export function CinematicCamera({
  progress,
  hoverRef,
}: CinematicCameraProps) {
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3());
  const currentPosition = useRef(
    new THREE.Vector3(0, 2.8, 20),
  );
  const currentTarget = useRef(
    new THREE.Vector3(0, 2, -28),
  );

  useFrame((state, delta) => {
    const hover = hoverRef.current;

    hover.x +=
      (state.pointer.x - hover.x) *
      (1 - Math.exp(-4.5 * delta));
    hover.y +=
      (state.pointer.y - hover.y) *
      (1 - Math.exp(-4.5 * delta));
    hover.energy +=
      ((Math.abs(state.pointer.x) +
        Math.abs(state.pointer.y) * 0.6) -
        hover.energy) *
      (1 - Math.exp(-2.8 * delta));

    const basePosition = sampleTrack(
      CAMERA_KEYS,
      progress,
      "position",
    );
    const baseTarget = sampleTrack(
      CAMERA_KEYS,
      progress,
      "target",
    );
    const breath =
      Math.sin(state.clock.elapsedTime * 0.42) *
      0.14;

    desiredPosition.current.copy(basePosition);
    desiredPosition.current.x += hover.x * 1.75;
    desiredPosition.current.y +=
      hover.y * 0.55 + breath;
    desiredPosition.current.z += Math.abs(hover.x) * 0.8;

    desiredTarget.current.copy(baseTarget);
    desiredTarget.current.x += hover.x * 4.2;
    desiredTarget.current.y +=
      hover.y * 0.8 + breath * 0.45;

    currentPosition.current.lerp(
      desiredPosition.current,
      1 - Math.exp(-2.6 * delta),
    );
    currentTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-3.2 * delta),
    );

    state.camera.position.copy(currentPosition.current);
    state.camera.lookAt(currentTarget.current);
    state.camera.rotation.z =
      hover.x * -0.022 +
      hover.y * 0.012 +
      Math.sin(state.clock.elapsedTime * 0.3) *
        0.003;
  });

  return null;
}
