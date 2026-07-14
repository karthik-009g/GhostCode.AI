"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

import { BG } from "./shared";
import { useScrollProgress } from "./useScrollProgress";
import { useCinematicTimeline } from "./timeline/CinematicTimeline";
import { Overlay } from "./ui/Overlay";

const WorldScene = dynamic(
  () =>
    import("./world/WorldScene").then(
      (module) => module.WorldScene,
    ),
  {
    ssr: false,
  },
);

export default function CyberpunkStreetPage() {
  const progress = useScrollProgress();
  const cinematic = useCinematicTimeline(progress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        position: "relative",
        minHeight: "2100vh",
        background: BG,
      }}
    >
      <Overlay progress={progress} cue={cinematic.cue} />
      {mounted ? (
      <Canvas
        camera={{
          fov: 42,
          near: 0.1,
          far: 1400,
          position: [5.8, 28, 44],
        }}
        dpr={[1, 1.25]}
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
        <WorldScene progress={progress} timeline={cinematic.values} />
      </Canvas>
      ) : null}
    </main>
  );
}
