import { animate } from "animejs";
import { useEffect, useRef } from "react";

import {
  DISTRICTS,
  GHOST,
  GHOST_SOFT,
  NEON,
  NEON_SOFT,
  PANEL_BORDER,
  WHITE,
} from "../shared";
import type { CinematicCue } from "../timeline/CinematicTimeline";

type OverlayProps = {
  progress: number;
  cue: CinematicCue;
};

function mixOverlayColor(
  color: string,
  strength: number,
) {
  if (strength <= 0) {
    return "rgba(255,255,255,0.16)";
  }

  const normalized = color.replace("#", "");

  if (normalized.length !== 6) {
    return color;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const alpha = 0.16 + strength * 0.84;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function Overlay({
  progress,
  cue,
}: OverlayProps) {
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = manifestoRef.current;
    if (!panel) return;

    const animation = animate(panel, {
      opacity: [0.28, 1],
      duration: 420,
      ease: "out(3)",
    });

    return () => {
      animation.cancel();
    };
  }, [cue.id]);
  const activeDistrict =
    [...DISTRICTS]
      .reverse()
      .find((district) => progress >= district.at)
      ?.label ?? DISTRICTS[0].label;
  const currentIndex = Math.max(
    0,
    DISTRICTS.findIndex(
      (district, index) =>
        progress < (DISTRICTS[index + 1]?.at ?? 1.1),
    ),
  );
  const activeIsGhost =
    activeDistrict === "Ghost Breach" ||
    activeDistrict === "Ghost Repository";

  const manifesto =
    progress < 0.1
      ? "A street-level software city where every sign, tower, and current is alive."
      : progress < 0.22
        ? "Scroll moves deeper into the architecture. Hover wakes up the nearby world."
        : progress < 0.36
          ? "The city shifts from commerce to infrastructure to system core without cuts."
          : progress < 0.54
            ? "The route drops under the visible city into routing decks, service bridges, and data pressure."
            : progress < 0.68
              ? "Corruption enters the frame slowly, then takes the district without breaking the shot."
              : progress < 0.82
                ? "The kernel resolves into directories, dependencies, services, and live execution paths."
                : progress < 0.92
                  ? "The repository reveals its abandoned processes, broken links, and haunted system memory."
                  : progress < 0.97
                    ? "Analysis exposes the dead archive, then the city starts repairing its own software."
                    : "Future architecture carries the system beyond the repository into an open horizon.";

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div
        style={{
          position: "absolute",
          top: 34,
          left: 34,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 48,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            fontWeight: 700,
            color: WHITE,
            textShadow: "0 0 32px rgba(255,255,255,0.16)",
          }}
        >
          GHOSTCODE
        </div>
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 14,
            lineHeight: 1.6,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {"// Copyright (c) 2026"}
          <br />
          GhostCode System World
        </div>
      </div>

      <div
        ref={manifestoRef}
        style={{
          position: "absolute",
          top: 46,
          right: 34,
          width: "min(330px, calc(100vw - 68px))",
          padding: "14px 16px",
          borderRadius: 6,
          border: `1px solid ${PANEL_BORDER}`,
          background: "rgba(4, 9, 14, 0.22)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 12px 46px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            marginBottom: 10,
          }}
        >
          {"///// Manifesto"}
        </div>
        <div
          style={{
            fontFamily:
              "Iowan Old Style, Palatino Linotype, Book Antiqua, Georgia, serif",
            fontSize: 23,
            lineHeight: 1.08,
            color: WHITE,
          }}
        >
          {manifesto}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 34,
          bottom: 34,
          display: "grid",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 14,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Scroll to enter the city.
          <br />
          Move cursor to scan nearby systems.
        </div>
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: activeIsGhost ? GHOST_SOFT : NEON_SOFT,
          }}
        >
          {activeDistrict}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 34,
          bottom: 34,
          width: 150,
          display: "grid",
          gap: 7,
          justifyItems: "end",
        }}
      >
        {DISTRICTS.map((district, index) => {
          const isCurrent = index === currentIndex;
          const hasPassed = index < currentIndex;
          const approach = Math.max(
            0,
            Math.min(1, (progress - (district.at - 0.16)) / 0.16),
          );
          const routeStrength = isCurrent
            ? 1
            : hasPassed
              ? 0.48
              : approach * 0.34;
          const color =
            district.label === "Ghost Breach" ||
            district.label === "Ghost Repository"
              ? GHOST
              : NEON;

          return (
            <div
              key={district.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 28 + routeStrength * 28,
                  height: 1,
                  background:
                    mixOverlayColor(color, routeStrength),
                  boxShadow:
                    routeStrength > 0.4
                      ? `0 0 10px ${color}`
                      : "none",
                  transition: "width 260ms ease, background 260ms ease",
                }}
              />
              <div
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: isCurrent
                    ? WHITE
                    : hasPassed
                      ? "rgba(255,255,255,0.62)"
                      : "rgba(255,255,255,0.4)",
                }}
              >
                {district.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
