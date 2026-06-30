"use client";

import {
  Suspense,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  Html,
  useProgress,
} from "@react-three/drei";

function Loader() {
  const {
    progress,
  } =
    useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="glass flex h-24 w-48 flex-col items-center justify-center gap-4">
          <div className="h-[2px] w-32 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="font-mono text-[10px] tracking-[0.4em] text-white/40">
            GHOST_CODE
          </div>

          <div className="font-mono text-[10px] text-cyan-300">
            {Math.round(
              progress,
            )}
            %
          </div>
        </div>
      </div>
    </Html>
  );
}

interface SceneLoaderProps {
  children: ReactNode;
}

export function SceneLoader({
  children,
}: SceneLoaderProps) {
  return (
    <Suspense
      fallback={
        <Loader />
      }
    >
      {children}
    </Suspense>
  );
}