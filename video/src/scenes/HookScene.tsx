import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

const fadeIn = (frame: number, start: number, duration = 10) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const slideUp = (frame: number, start: number, duration = 10) =>
  interpolate(frame, [start, start + duration], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const TerminalLine: React.FC<{
  frame: number;
  startFrame: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, startFrame, children, style }) => (
  <div
    style={{
      opacity: fadeIn(frame, startFrame),
      transform: `translateY(${slideUp(frame, startFrame)}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Shake animation for error badge
  const shakeOffset =
    frame >= 65 && frame < 82
      ? interpolate(
          (frame - 65) % 8,
          [0, 2, 4, 6, 8],
          [0, -6, 6, -3, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  // Blinking cursor
  const cursorOpacity =
    frame >= 80 ? (Math.floor((frame - 80) / 15) % 2 === 0 ? 1 : 0) : 0;

  // Spinner rotations
  const spinner2Rotation = frame >= 25 ? (frame - 25) * 9 : 0;
  const spinner3Rotation = frame >= 40 ? (frame - 40) * 9 : 0;

  // Caption
  const captionOpacity = fadeIn(frame, 90, 16);
  const captionY = slideUp(frame, 90, 16);

  // Panel fade
  const panelOpacity = fadeIn(frame, 0, 10);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 44,
      }}
    >
      {/* ── Terminal panel ── */}
      <div
        style={{
          opacity: panelOpacity,
          background: "#161b22",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: "32px 44px",
          width: 1100,
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
          fontSize: 22,
          lineHeight: 2,
          userSelect: "none",
        }}
      >
        {/* Traffic-light dots */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#28c840" }} />
        </div>

        {/* Line 1 — frame 10 */}
        <TerminalLine frame={frame} startFrame={10}>
          <span style={{ color: "#1d9e75" }}>▶</span>
          <span style={{ color: "rgba(255,255,255,0.75)" }}> POST /api/orders </span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>     200 OK · 3ms</span>
        </TerminalLine>

        {/* Line 2 — frame 25 */}
        <TerminalLine frame={frame} startFrame={25}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>▶ scheduling email delivery... </span>
          <span
            style={{
              display: "inline-block",
              transform: `rotate(${spinner2Rotation}deg)`,
              color: "#60a5fa",
            }}
          >
            ⟳
          </span>
        </TerminalLine>

        {/* Line 3 — frame 40 */}
        <TerminalLine frame={frame} startFrame={40}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>▶ generating invoice PDF...    </span>
          <span
            style={{
              display: "inline-block",
              transform: `rotate(${spinner3Rotation}deg)`,
              color: "#60a5fa",
            }}
          >
            ⟳
          </span>
        </TerminalLine>

        {/* Line 4 — frame 65 — error badge with shake */}
        <div
          style={{
            opacity: fadeIn(frame, 65),
            transform: `translateX(${shakeOffset}px)`,
            marginTop: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(232,93,36,0.15)",
              border: "1px solid rgba(232,93,36,0.45)",
              borderRadius: 8,
              padding: "5px 16px",
              color: "#f87171",
              fontSize: 20,
            }}
          >
            ✕ timeout 30s — job failed silently
          </span>
        </div>

        {/* Line 5 — frame 80 */}
        <TerminalLine frame={frame} startFrame={80} style={{ marginTop: 8 }}>
          <span style={{ color: "#ef4444", opacity: 0.65 }}>500 Internal Server Error</span>
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 22,
              background: "rgba(255,255,255,0.7)",
              marginLeft: 6,
              verticalAlign: "middle",
              opacity: cursorOpacity,
            }}
          />
        </TerminalLine>
      </div>

      {/* ── Caption ── */}
      <div
        style={{
          maxWidth: 780,
          textAlign: "center",
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
          fontSize: 22,
          color: "rgba(255,255,255,0.4)",
          fontStyle: "italic",
          lineHeight: 1.65,
          userSelect: "none",
        }}
      >
        You've built the API. Orders are flying in. But somewhere behind the
        scenes… things are quietly breaking.
      </div>
    </AbsoluteFill>
  );
};
