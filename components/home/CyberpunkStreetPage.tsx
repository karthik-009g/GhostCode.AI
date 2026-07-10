"use client";

import { Canvas } from "@react-three/fiber";

import { BG } from "./shared";
import { useScrollProgress } from "./useScrollProgress";
import { Overlay } from "./ui/Overlay";
import { WorldScene } from "./world/WorldScene";

export default function CyberpunkStreetPage() {
  const progress = useScrollProgress();

  return (
    <main
      style={{
        position: "relative",
        minHeight: "500vh",
        background: BG,
      }}
    >
      <Overlay progress={progress} />
      <Canvas
        camera={{
          fov: 42,
          near: 0.1,
          far: 400,
          position: [0, 2.8, 20],
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{
          position: "fixed",
          inset: 0,
        }}
      >
        <WorldScene progress={progress} />
      </Canvas>
    </main>
  );
}
