import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const NODES = [
  { icon: "⬡", color: "#82aaff", label: "your app",        title: "Push job", startFrame: 5  },
  { icon: "⬡", color: "#1d9e75", label: "postgres / redis", title: "Queue",    startFrame: 15 },
  { icon: "⬡", color: "#5dcaa5", label: "async fn",         title: "Worker",   startFrame: 25 },
  { icon: "✓", color: "#1d9e75", label: "retried if needed", title: "Done ✓",  startFrame: 35, isDone: true },
];

const MIDDLEWARE = [
  { label: "Retry + backoff",    startFrame: 50 },
  { label: "Circuit breaker",    startFrame: 60 },
  { label: "Tracing",            startFrame: 70 },
  { label: "Panic catch",        startFrame: 80 },
  { label: "Graceful shutdown",  startFrame: 90 },
];

// ── Pipeline node ────────────────────────────────────────────────────────────
const PipelineNode: React.FC<{
  icon: string;
  color: string;
  label: string;
  title: string;
  startFrame: number;
  isDone?: boolean;
  frame: number;
  fps: number;
}> = ({ icon, color, label, title, startFrame, isDone, frame, fps }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateY(${translateY}px)`,
        opacity,
        userSelect: "none",
        width: 160,
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 100,
          height: 100,
          border: isDone
            ? "2px solid rgba(29,158,117,0.6)"
            : `2px solid ${color}55`,
          borderRadius: 24,
          background: isDone ? "rgba(29,158,117,0.12)" : `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          color,
        }}
      >
        {icon}
      </div>

      {/* Labels */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>
          {label}
        </div>
      </div>
    </div>
  );
};

// ── Middleware badge ──────────────────────────────────────────────────────────
const MiddlewareBadge: React.FC<{
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
  const translateY = interpolate(progress, [0, 1], [24, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "rgba(29,158,117,0.1)",
        border: "1px solid rgba(29,158,117,0.35)",
        borderRadius: 10,
        padding: "11px 22px",
        fontSize: 18,
        fontWeight: 600,
        color: "#5dcaa5",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

// ── Flowing dashed arrow ──────────────────────────────────────────────────────
const FlowArrow: React.FC<{ frame: number; visible: boolean }> = ({ frame, visible }) => {
  if (!visible) return null;
  const DASH = 16;
  const GAP = 8;
  const offset = -((frame * 2) % (DASH + GAP));

  return (
    <svg width={80} height={24} style={{ alignSelf: "center", marginTop: -24, flexShrink: 0 }}>
      <line
        x1={0} y1={12} x2={80} y2={12}
        stroke="#1d9e75"
        strokeWidth={2}
        strokeDasharray={`${DASH} ${GAP}`}
        strokeDashoffset={offset}
        opacity={0.75}
      />
      <polygon points="72,7 80,12 72,17" fill="#1d9e75" opacity={0.9} />
    </svg>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────
export const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrowVisible = (nodeStartFrame: number) => frame > nodeStartFrame + 15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 64,
      }}
    >
      {/* Pipeline row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {NODES.map((node, i) => (
          <React.Fragment key={node.title}>
            <PipelineNode {...node} frame={frame} fps={fps} />
            {i < NODES.length - 1 && (
              <FlowArrow frame={frame} visible={arrowVisible(node.startFrame)} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Middleware badges */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          maxWidth: 860,
        }}
      >
        {MIDDLEWARE.map((m) => (
          <MiddlewareBadge key={m.label} {...m} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
