import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import {
  type HoverState,
} from "../shared";
import { sampleDirectedCamera } from "./CameraKeyframes";

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
    new THREE.Vector3(5.8, 28, 44),
  );
  const currentTarget = useRef(
    new THREE.Vector3(-2.4, 4.5, -70),
  );
  const currentFov = useRef(46);
  const pointerTarget = useRef({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const updatePointer = (clientX: number, clientY: number) => {
      pointerTarget.current.x = (clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -(clientY / window.innerHeight) * 2 + 1;
      pointerTarget.current.active = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];

      if (touch) {
        updatePointer(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    window.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useFrame((state, delta) => {
    const hover = hoverRef.current;
    const pointer = pointerTarget.current.active
      ? pointerTarget.current
      : state.pointer;

    hover.x +=
      (pointer.x - hover.x) *
      (1 - Math.exp(-7 * delta));
    hover.y +=
      (pointer.y - hover.y) *
      (1 - Math.exp(-7 * delta));
    hover.energy +=
      ((Math.abs(pointer.x) +
        Math.abs(pointer.y) * 0.65) -
        hover.energy) *
      (1 - Math.exp(-5 * delta));

    const shot = sampleDirectedCamera(
      progress,
      desiredPosition.current,
      desiredTarget.current,
    );

    desiredPosition.current.x += hover.x * 0.45;
    desiredPosition.current.y += hover.y * 0.18;
    desiredTarget.current.x += hover.x * 1.15;
    desiredTarget.current.y += hover.y * 0.28;

    currentPosition.current.lerp(
      desiredPosition.current,
      1 - Math.exp(-2.6 * delta),
    );
    currentTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-3.2 * delta),
    );
    currentFov.current = THREE.MathUtils.damp(
      currentFov.current,
      shot.fov,
      2.2,
      delta,
    );

    state.camera.position.copy(currentPosition.current);
    const camera = state.camera as THREE.PerspectiveCamera;

    if (Math.abs(camera.fov - currentFov.current) > 0.001) {
      camera.fov = currentFov.current;
      camera.updateProjectionMatrix();
    }

    const bank =
      shot.bank +
      hover.x * -0.022 +
      hover.y * 0.012 +
      0;

    state.camera.up.set(Math.sin(bank), Math.cos(bank), 0);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}
