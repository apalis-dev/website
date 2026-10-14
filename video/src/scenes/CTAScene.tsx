import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BADGES = [
  { label: "MIT / Apache", startFrame: 35 },
  { label: "Open source",  startFrame: 42 },
  { label: "Postgres",     startFrame: 49 },
  { label: "Redis",        startFrame: 56 },
  { label: "SQLite",       startFrame: 63 },
  { label: "NATS",         startFrame: 70 },
  { label: "Free tier",    startFrame: 77 },
];

const Badge: React.FC<{
  label: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ label, startFrame, frame, fps }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateY = interpolate(progress, [0, 1], [20, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "#161b22",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10,
        padding: "12px 24px",
        fontSize: 18,
        color: "rgba(255,255,255,0.55)",
        fontWeight: 500,
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wordmark
  const wordmarkScale = spring({
    fps,
    frame: Math.max(0, frame - 5),
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0.4,
    to: 1,
  });
  const wordmarkOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [15, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [15, 28], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA pill
  const pillOpacity = interpolate(frame, [25, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillY = interpolate(frame, [25, 38], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          fontSize: 140,
          fontWeight: 800,
          color: "#1d9e75",
          letterSpacing: "-5px",
          transform: `scale(${wordmarkScale})`,
          opacity: wordmarkOpacity,
          display: "inline-block",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Apalis
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.5)",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          userSelect: "none",
          letterSpacing: "0.2px",
        }}
      >
        Process background tasks with confidence
      </div>

      {/* CTA pill */}
      <div
        style={{
          opacity: pillOpacity,
          transform: `translateY(${pillY}px)`,
          background: "rgba(29,158,117,0.12)",
          border: "1.5px solid rgba(29,158,117,0.45)",
          borderRadius: 12,
          padding: "16px 40px",
          fontSize: 24,
          fontWeight: 700,
          color: "#5dcaa5",
          userSelect: "none",
          letterSpacing: "0.4px",
        }}
      >
        apalis.dev →
      </div>

      {/* Ecosystem badges */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          maxWidth: 780,
          marginTop: 8,
        }}
      >
        {BADGES.map((b) => (
          <Badge key={b.label} {...b} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
