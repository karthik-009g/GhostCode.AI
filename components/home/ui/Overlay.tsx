import {
  DISTRICTS,
  GHOST,
  GHOST_SOFT,
  NEON,
  NEON_SOFT,
  PANEL,
  PANEL_BORDER,
  WHITE,
} from "../shared";

type OverlayProps = {
  progress: number;
};

export function Overlay({
  progress,
}: OverlayProps) {
  const activeDistrict =
    [...DISTRICTS]
      .reverse()
      .find((district) => progress >= district.at)
      ?.label ?? DISTRICTS[0].label;

  const manifesto =
    progress < 0.28
      ? "A street-level software city where every sign, tower, and current is alive."
      : progress < 0.58
        ? "Scroll moves deeper into the architecture. Hover wakes up the nearby world."
        : progress < 0.82
          ? "The city shifts from commerce to infrastructure to system core without cuts."
          : "Corruption enters the frame slowly, then takes the district without breaking the shot.";

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
            letterSpacing: "-0.08em",
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
        style={{
          position: "absolute",
          top: 46,
          right: 34,
          width: "min(360px, calc(100vw - 68px))",
          padding: "18px 20px",
          borderRadius: 24,
          border: `1px solid ${PANEL_BORDER}`,
          background: PANEL,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 16px 60px rgba(0,0,0,0.26)",
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
            fontSize: 28,
            lineHeight: 1.05,
            color: WHITE,
            textWrap: "balance",
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
            color: "rgba(255,255,255,0.84)",
          }}
        >
          Scroll to enter the city.
          <br />
          Hover to wake nearby neon.
        </div>
        <div
          style={{
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: progress > 0.74 ? GHOST_SOFT : NEON_SOFT,
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
          gap: 8,
          justifyItems: "end",
        }}
      >
        {DISTRICTS.map((district) => {
          const active = progress >= district.at;

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
                  width: active ? 56 : 28,
                  height: 1,
                  background: active
                    ? district.at > 0.72
                      ? GHOST
                      : NEON
                    : "rgba(255,255,255,0.16)",
                  transition: "width 180ms ease",
                }}
              />
              <div
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: active ? WHITE : "rgba(255,255,255,0.4)",
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
