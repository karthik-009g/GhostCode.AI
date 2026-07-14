"use client";

import { animate } from "animejs";
import { useEffect, useMemo, useRef } from "react";

export type CinematicValues = {
  cloudDensity: number;
  auroraIntensity: number;
  beamPulse: number;
  satelliteRate: number;
  atmosphereMix: number;
};

export type CinematicCue = {
  id: string;
  at: number;
  manifesto: string;
  values: CinematicValues;
};

const CUES: readonly CinematicCue[] = [
  { id: "arrival", at: 0, manifesto: "Arrival systems initialize across the city.", values: { cloudDensity: 0.18, auroraIntensity: 0.04, beamPulse: 0.12, satelliteRate: 0.3, atmosphereMix: 0 } },
  { id: "corridor", at: 0.18, manifesto: "Infrastructure lanes begin exposing the city stack.", values: { cloudDensity: 0.24, auroraIntensity: 0.08, beamPulse: 0.2, satelliteRate: 0.36, atmosphereMix: 0.08 } },
  { id: "kernel", at: 0.48, manifesto: "The kernel horizon opens above the route.", values: { cloudDensity: 0.3, auroraIntensity: 0.12, beamPulse: 0.24, satelliteRate: 0.42, atmosphereMix: 0.16 } },
  { id: "repository", at: 0.57, manifesto: "The street resolves into a navigable repository.", values: { cloudDensity: 0.34, auroraIntensity: 0.16, beamPulse: 0.28, satelliteRate: 0.48, atmosphereMix: 0.24 } },
  { id: "dependencies", at: 0.64, manifesto: "Dependencies form a living system above the route.", values: { cloudDensity: 0.42, auroraIntensity: 0.32, beamPulse: 0.58, satelliteRate: 0.64, atmosphereMix: 0.38 } },
  { id: "services", at: 0.71, manifesto: "Services light their routes through the network.", values: { cloudDensity: 0.48, auroraIntensity: 0.42, beamPulse: 0.7, satelliteRate: 0.78, atmosphereMix: 0.52 } },
  { id: "execution", at: 0.78, manifesto: "Execution systems compress into a processor cathedral.", values: { cloudDensity: 0.54, auroraIntensity: 0.36, beamPulse: 0.62, satelliteRate: 0.68, atmosphereMix: 0.62 } },
  { id: "ghost", at: 0.86, manifesto: "Abandoned systems remain present in the city memory.", values: { cloudDensity: 0.62, auroraIntensity: 0.16, beamPulse: 0.46, satelliteRate: 0.4, atmosphereMix: 0.82 } },
  { id: "recovery", at: 0.94, manifesto: "Analysis restores architecture from corrupted state.", values: { cloudDensity: 0.5, auroraIntensity: 0.62, beamPulse: 0.82, satelliteRate: 0.7, atmosphereMix: 0.4 } },
  { id: "horizon", at: 0.982, manifesto: "The repaired system opens toward its next horizon.", values: { cloudDensity: 0.32, auroraIntensity: 0.8, beamPulse: 1, satelliteRate: 0.9, atmosphereMix: 0.14 } },
];

export function useCinematicTimeline(progress: number) {
  const values = useRef<CinematicValues>({ ...CUES[0]!.values });
  const cue = useMemo(
    () => [...CUES].reverse().find((candidate) => progress >= candidate.at) ?? CUES[0]!,
    [progress],
  );

  useEffect(() => {
    const animation = animate(values.current, {
      ...cue.values,
      duration: 900,
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
    };
  }, [cue]);

  return { cue, values };
}
