"use client";

import { ParticleField } from "./ParticleField";

import { usePerformance } from "@/hooks/usePerformance";

export function ParticleSystem() {
  const {
    runtimeTier,
  } = usePerformance();

  if (runtimeTier === "low") {
    return null;
  }

  return (
    <>
      <ParticleField
        density={
          runtimeTier === "high"
            ? 1
            : 0.5
        }
      />

      {/* Phase 4 */}
      {/* Ghost corruption particles */}

      {/* Phase 5 */}
      {/* Reactive particles */}
    </>
  );
}