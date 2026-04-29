import React from "react";
import { VSCodeWindow } from "../components/VSCodeWindow";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CODE_FONT =
  "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

// ── Retry attempt bubble ─────────────────────────────────────────────────────

type AttemptStatus = "fail" | "success";

type Attempt = {
  label: string;
  status: AttemptStatus;
  startFrame: number;
};

const ATTEMPTS: Attempt[] = [
  { label: "Attempt 1", status: "fail",    startFrame: 28 },
  { label: "Attempt 2", status: "fail",    startFrame: 52 },
  { label: "Attempt 3", status: "success", startFrame: 76 },
];

const AttemptBubble: React.FC<Attempt & { frame: number; fps: number }> = ({
  label,
  status,
  startFrame,
  frame,
  fps,
}) => {
  const isFail = status === "fail";
  const color = isFail ? "#f87171" : "#1d9e75";

  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `scale(${scale})`,
        userSelect: "none",
        width: 110,
      }}
    >
      {/* Circle */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          border: `2px solid ${color}70`,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          color,
        }}
      >
        {isFail ? "✕" : "✓"}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: isFail ? "#f87171bb" : "#1d9e75cc",
          letterSpacing: "0.2px",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── Retry arrow between attempts ─────────────────────────────────────────────

const RetryArrow: React.FC<{ frame: number; visibleAfter: number }> = ({
  frame,
  visibleAfter,
}) => {
  const opacity = interpolate(frame, [visibleAfter, visibleAfter + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const DASH = 14;
  const GAP = 7;
  const offset = -((frame * 2) % (DASH + GAP));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity,
        userSelect: "none",
        marginTop: -40, // align with circle center
      }}
    >
      <svg width={72} height={24} style={{ flexShrink: 0 }}>
        <line
          x1={0}
          y1={12}
          x2={72}
          y2={12}
          stroke="#f87171"
          strokeWidth={2}
          strokeDasharray={`${DASH} ${GAP}`}
          strokeDashoffset={offset}
          opacity={0.65}
        />
        <polygon points="64,7 72,12 64,17" fill="#f87171" opacity={0.8} />
      </svg>
      <div
        style={{
          fontSize: 12,
          color: "rgba(248,113,113,0.55)",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        retry
      </div>
    </div>
  );
};

// ── Code line ────────────────────────────────────────────────────────────────

type Token = { text: string; color: string };

type CodeLineData = {
  tokens: Token[];
  startFrame: number;
};

const CODE_LINES: CodeLineData[] = [
  {
    tokens: [
      { text: "WorkerBuilder", color: "#60a5fa" },
      { text: "::", color: "rgba(255,255,255,0.3)" },
      { text: "new", color: "#1d9e75" },
      { text: "(", color: "rgba(255,255,255,0.35)" },
      { text: '"email_worker"', color: "#f97316" },
      { text: ")", color: "rgba(255,255,255,0.35)" },
    ],
    startFrame: 96,
  },
  {
    tokens: [
      { text: "    .", color: "rgba(255,255,255,0.35)" },
      { text: "catch_panic", color: "#a78bfa" },
      { text: "()", color: "rgba(255,255,255,0.35)" },
    ],
    startFrame: 110,
  },
  {
    tokens: [
      { text: "    .", color: "rgba(255,255,255,0.35)" },
      { text: "layer", color: "rgba(255,255,255,0.7)" },
      { text: "(", color: "rgba(255,255,255,0.35)" },
      { text: "RetryLayer", color: "#60a5fa" },
      { text: "::", color: "rgba(255,255,255,0.3)" },
      { text: "new", color: "#1d9e75" },
      { text: "(", color: "rgba(255,255,255,0.35)" },
      { text: "RetryPolicy", color: "#60a5fa" },
      { text: "::", color: "rgba(255,255,255,0.3)" },
      { text: "retries", color: "#1d9e75" },
      { text: "(", color: "rgba(255,255,255,0.35)" },
      { text: "3", color: "#f97316" },
      { text: ")))", color: "rgba(255,255,255,0.35)" },
    ],
    startFrame: 124,
  },
  {
    tokens: [
      { text: "    .", color: "rgba(255,255,255,0.35)" },
      { text: "build", color: "rgba(255,255,255,0.7)" },
      { text: "(", color: "rgba(255,255,255,0.35)" },
      { text: "handle_email", color: "#ffffff" },
      { text: ")", color: "rgba(255,255,255,0.35)" },
    ],
    startFrame: 138,
  },
];

const AnimatedCodeLine: React.FC<CodeLineData & { frame: number; fps: number }> = ({
  tokens,
  startFrame,
  frame,
  fps,
}) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateX = interpolate(progress, [0, 1], [-14, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily: CODE_FONT,
        fontSize: 22,
        lineHeight: 1,
        userSelect: "none",
        display: "flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
      }}
    >
      {tokens.map((t, i) => (
        <span key={i} style={{ color: t.color }}>
          {t.text}
        </span>
      ))}
    </div>
  );
};

// ── Feature cards ────────────────────────────────────────────────────────────

type Feature = {
  label: string;
  desc: string;
  color: string;
  startFrame: number;
};

const FEATURES: Feature[] = [
  {
    label: "RetryLayer",
    desc: "exponential backoff · configurable retries",
    color: "#1d9e75",
    startFrame: 150,
  },
  {
    label: "CatchPanicLayer",
    desc: "panics become errors, not crashes",
    color: "#f97316",
    startFrame: 162,
  },
];

const FeatureCard: React.FC<Feature & { frame: number; fps: number }> = ({
  label,
  desc,
  color,
  startFrame,
  frame,
  fps,
}) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 110, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const scale = interpolate(progress, [0, 1], [0.84, 1]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: "#161b22",
        border: `1px solid ${color}40`,
        borderRadius: 14,
        padding: "18px 34px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        userSelect: "none",
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color,
          fontFamily: CODE_FONT,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.35)",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {desc}
      </div>
    </div>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────

export const ErrorHandlingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eyebrow
  const eyebrowOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Headline
  const titleProgress = spring({
    fps,
    frame: Math.max(0, frame - 8),
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const titleY = interpolate(titleProgress, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Code card container
  const cardProgress = spring({
    fps,
    frame: Math.max(0, frame - 90),
    config: { damping: 16, stiffness: 80, mass: 0.6 },
    from: 0,
    to: 1,
  });
  const cardOpacity = interpolate(cardProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(cardProgress, [0, 1], [20, 0]);

  // Tagline
  const taglineOpacity = interpolate(frame, [168, 178], [0, 1], {
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
        gap: 30,
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          opacity: eyebrowOpacity,
          textTransform: "uppercase",
          letterSpacing: "4px",
          color: "rgba(255,255,255,0.35)",
          fontSize: 17,
          fontWeight: 600,
          userSelect: "none",
        }}
      >
        Error Handling
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 58,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          userSelect: "none",
        }}
      >
        <span style={{ color: "#ffffff" }}>Panic-safe. </span>
        <span style={{ color: "#1d9e75" }}>Retry-smart.</span>
      </div>

      {/* Retry flow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          userSelect: "none",
        }}
      >
        {ATTEMPTS.map((a, i) => (
          <React.Fragment key={a.label}>
            <AttemptBubble {...a} frame={frame} fps={fps} />
            {i < ATTEMPTS.length - 1 && (
              <RetryArrow frame={frame} visibleAfter={a.startFrame + 18} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Code card */}
      <VSCodeWindow
        lineCount={CODE_LINES.length}
        fontSize={22}
        lineHeight={1}
        gap={14}
        codePaddingV={26}
        codePaddingH={40}
        borderRadius={18}
        outerStyle={{ opacity: cardOpacity, transform: `translateY(${cardY}px)` }}
      >
        {CODE_LINES.map((line, i) => (
          <AnimatedCodeLine key={i} {...line} frame={frame} fps={fps} />
        ))}
      </VSCodeWindow>

      {/* Feature cards */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {FEATURES.map((f) => (
          <FeatureCard key={f.label} {...f} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 21,
          color: "rgba(255,255,255,0.35)",
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        "No crash, no lost work — just automatic recovery."
      </div>
    </AbsoluteFill>
  );
};
