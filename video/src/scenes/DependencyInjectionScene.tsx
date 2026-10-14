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

// ── Parameter lines ──────────────────────────────────────────────────────────

type Param = {
  name: string;
  nameWidth: number;
  type: string;
  annotation: string;
  annotationColor: string;
  startFrame: number;
};

const PARAMS: Param[] = [
  {
    name: "job",
    nameWidth: 72,
    type: "EmailJob",
    annotation: "the task",
    annotationColor: "#f97316",
    startFrame: 32,
  },
  {
    name: "user",
    nameWidth: 72,
    type: "User",
    annotation: "custom extractor",
    annotationColor: "#60a5fa",
    startFrame: 52,
  },
  {
    name: "config",
    nameWidth: 72,
    type: "Data<AppConfig>",
    annotation: "shared state",
    annotationColor: "#5dcaa5",
    startFrame: 72,
  },
  {
    name: "ctx",
    nameWidth: 72,
    type: "WorkerContext",
    annotation: "built-in",
    annotationColor: "#a78bfa",
    startFrame: 92,
  },
];

const ParamLine: React.FC<Param & { frame: number; fps: number }> = ({
  name,
  nameWidth,
  type,
  annotation,
  annotationColor,
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
  const translateX = interpolate(progress, [0, 1], [-18, 0]);
  const opacity = interpolate(progress, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
        transform: `translateX(${translateX}px)`,
        userSelect: "none",
      }}
    >
      {/* Code portion */}
      <div
        style={{
          fontFamily: CODE_FONT,
          fontSize: 23,
          lineHeight: 1,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.0)",
            width: 24,
            display: "inline-block",
          }}
        >
          {"  "}
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.75)",
            width: nameWidth,
            display: "inline-block",
          }}
        >
          {name}
          <span style={{ color: "rgba(255,255,255,0.3)" }}>:</span>
        </span>
        <span style={{ color: "#60a5fa", marginLeft: 8 }}>{type}</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>,</span>
      </div>

      {/* Annotation badge */}
      <div
        style={{
          background: `${annotationColor}18`,
          border: `1px solid ${annotationColor}50`,
          borderRadius: 8,
          padding: "5px 14px",
          fontSize: 15,
          fontWeight: 600,
          color: annotationColor,
          whiteSpace: "nowrap",
          letterSpacing: "0.3px",
        }}
      >
        {annotation}
      </div>
    </div>
  );
};

// ── Extractor cards ──────────────────────────────────────────────────────────

type Extractor = {
  label: string;
  desc: string;
  color: string;
  startFrame: number;
};

const EXTRACTORS: Extractor[] = [
  {
    label: "Data<T>",
    desc: "shared state",
    color: "#5dcaa5",
    startFrame: 114,
  },
  {
    label: "WorkerContext",
    desc: "worker metadata",
    color: "#a78bfa",
    startFrame: 124,
  },
  {
    label: "Attempt",
    desc: "retry info",
    color: "#60a5fa",
    startFrame: 134,
  },
  {
    label: "impl FromRequest",
    desc: "any custom type",
    color: "#f97316",
    startFrame: 144,
  },
];

const ExtractorCard: React.FC<Extractor & { frame: number; fps: number }> = ({
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
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const scale = interpolate(progress, [0, 1], [0.82, 1]);
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
        padding: "16px 26px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        userSelect: "none",
        minWidth: 168,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color,
          fontFamily: CODE_FONT,
          letterSpacing: "-0.3px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.35)",
          fontWeight: 500,
        }}
      >
        {desc}
      </div>
    </div>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────

export const DependencyInjectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Eyebrow label
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
    frame: Math.max(0, frame - 20),
    config: { damping: 16, stiffness: 80, mass: 0.6 },
    from: 0,
    to: 1,
  });
  const cardOpacity = interpolate(cardProgress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // "async fn process(" opening line
  const fnLineOpacity = interpolate(frame, [22, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Closing ") -> Result<…>" line
  const closingOpacity = interpolate(frame, [100, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [155, 168], [0, 1], {
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
        Dependency Injection
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
        <span style={{ color: "#ffffff" }}>Extractors. </span>
        <span style={{ color: "#1d9e75" }}>Not boilerplate.</span>
      </div>

      {/* Code card */}
      <VSCodeWindow
        lineCount={1 + PARAMS.length + 1}
        fontSize={23}
        lineHeight={1}
        gap={16}
        codePaddingV={30}
        codePaddingH={44}
        borderRadius={20}
        outerStyle={{ opacity: cardOpacity, minWidth: 740 }}
      >
        {/* fn signature — opening */}
        <div
          style={{
            opacity: fnLineOpacity,
            fontSize: 23,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <span style={{ color: "#a78bfa" }}>async fn </span>
          <span style={{ color: "#ffffff" }}>process</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>(</span>
        </div>

        {/* Parameters — animated one by one */}
        {PARAMS.map((p) => (
          <ParamLine key={p.name} {...p} frame={frame} fps={fps} />
        ))}

        {/* Closing */}
        <div
          style={{
            opacity: closingOpacity,
            fontSize: 23,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{") -> "}</span>
          <span style={{ color: "#5dcaa5" }}>Result</span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>{"<(), Error>"}</span>
        </div>
      </VSCodeWindow>

      {/* Built-in extractor cards */}
      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {EXTRACTORS.map((e) => (
          <ExtractorCard key={e.label} {...e} frame={frame} fps={fps} />
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
        Any type. Auto-injected. Zero glue code.
      </div>
    </AbsoluteFill>
  );
};
