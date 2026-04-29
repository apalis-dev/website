import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PILLS = [
  { label: "Axum",              startFrame: 22 },
  { label: "Actix",             startFrame: 34 },
  { label: "Tokio",             startFrame: 46 },
  { label: "Microservices",     startFrame: 58 },
  { label: "Platform backends", startFrame: 70 },
];

const FrameworkPill: React.FC<{
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
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: "#161b22",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: 12,
        padding: "14px 28px",
        fontSize: 20,
        fontWeight: 600,
        color: "rgba(255,255,255,0.75)",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

export const WhoItsForScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Built for Rust" label
  const labelOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Main title
  const titleProgress = spring({
    fps,
    frame: Math.max(0, frame - 8),
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const titleY = interpolate(titleProgress, [0, 1], [28, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Quote
  const quoteOpacity = interpolate(frame, [86, 100], [0, 1], {
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
        gap: 36,
      }}
    >
      {/* "Built for Rust" label */}
      <div
        style={{
          opacity: labelOpacity,
          textTransform: "uppercase",
          letterSpacing: "4px",
          color: "rgba(255,255,255,0.35)",
          fontSize: 18,
          fontWeight: 600,
          userSelect: "none",
        }}
      >
        Built for Rust
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          userSelect: "none",
        }}
      >
        <div style={{ color: "#ffffff" }}>No macros. No boilerplate.</div>
        <div style={{ color: "#1d9e75" }}>Just async functions doing real work.</div>
      </div>

      {/* Framework pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          maxWidth: 800,
        }}
      >
        {PILLS.map((p) => (
          <FrameworkPill key={p.label} {...p} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Quote */}
      <div
        style={{
          opacity: quoteOpacity,
          fontSize: 22,
          color: "rgba(255,255,255,0.35)",
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        "If you're building in Rust, Apalis fits right in."
      </div>
    </AbsoluteFill>
  );
};
