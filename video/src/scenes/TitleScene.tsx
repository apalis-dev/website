import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import postgresLogo from "../assets/postgresql.svg";
import redisLogo from "../assets/redis.svg";
import mysqlLogo from "../assets/mysql.svg";
import rabbitmqLogo from "../assets/rabbitmq.svg";
import prometheusLogo from "../assets/prometheus.svg";
import sentryLogo from "../assets/sentry.svg";

const LINE_W = 960;

// ─── Backend logo definitions ──────────────────────────────────────────────
const BACKENDS = [
  {
    name: "PostgreSQL",
    color: "#336791",
    logo: postgresLogo,
    x: 410, y: 185,
    rotation: -10, startFrame: 8, floatPhase: 0,
  },
  {
    name: "Redis",
    color: "#DC382D",
    logo: redisLogo,
    x: 1710, y: 175,
    rotation: 8, startFrame: 14, floatPhase: 1.3,
  },
  {
    name: "MySQL",
    color: "#00758F",
    logo: mysqlLogo,
    x: 1100, y: 270,
    rotation: -5, startFrame: 20, floatPhase: 2.2,
  },
  {
    name: "RabbitMQ",
    color: "#FFFFFF",
    logo: rabbitmqLogo,
    x: 1600, y: 848,
    rotation: 6, startFrame: 26, floatPhase: 0.7,
  },
  {
    name: "Prometheus",
    color: "#E6522C",
    logo: prometheusLogo,
    x: 210, y: 895,
    rotation: 7, startFrame: 32, floatPhase: 1.8,
  },
  {
    name: "Sentry",
    color: "#a78bfa",
    logo: sentryLogo,
    x: 1000, y: 890,
    rotation: -8, startFrame: 38, floatPhase: 3.0,
  },
] as const;

// ─── Single backend badge ──────────────────────────────────────────────────
const BADGE_W = 200;
const BADGE_H = 200;
const ICON_SIZE = 80; 

const BackendBadge: React.FC<{
  name: string;
  color: string;
  logo: string;
  x: number;
  y: number;
  rotation: number;
  startFrame: number;
  floatPhase: number;
  frame: number;
  fps: number;
}> = ({ name, color, logo, x, y, rotation, startFrame, floatPhase, frame, fps }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 13, stiffness: 110, mass: 0.6 },
    from: 0,
    to: 1,
  });

  const scale = interpolate(progress, [0, 1], [0.4, 1]);
  const opacity = interpolate(progress, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });

  const floatY = progress > 0.95
    ? Math.sin(frame * 0.055 + floatPhase) * 5
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x - BADGE_W / 2,
        top: y - BADGE_H / 2 + floatY,
        width: BADGE_W,
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: "center center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        userSelect: "none",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 22,
          background: `${color}20`,
          border: `1.5px solid ${color}70`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={logo}
          width={ICON_SIZE}
          height={ICON_SIZE}
          style={{
            objectFit: "contain",
            // Make all logos white so they read cleanly on dark background
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>
      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.4px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
    </div>
  );
};

// ─── Title line helper ─────────────────────────────────────────────────────
const TitleLine: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  fps: number;
  frame: number;
}> = ({ children, startFrame, fps, frame }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateY = interpolate(progress, [0, 1], [24, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ transform: `translateY(${translateY}px)`, opacity, lineHeight: 1.5 }}>
      {children}
    </div>
  );
};

// ─── Scene ─────────────────────────────────────────────────────────────────
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerReveal = interpolate(frame, [28, 48], [0, LINE_W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [36, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [36, 50], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      {/* ── Peripheral backend logos ── */}
      {BACKENDS.map((b) => (
        <BackendBadge key={b.name} {...b} frame={frame} fps={fps} />
      ))}

      {/* ── Center title content ── */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            userSelect: "none",
          }}
        >


          {/* Title */}
          <div
            style={{
              fontSize: 70,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-2px",
              textAlign: "center",
            }}
          >
            <TitleLine startFrame={6} fps={fps} frame={frame}>
              What is <span style={{ color: "#1d9e75" }}>Apalis</span>
              <span>,</span>
            </TitleLine>
            <TitleLine startFrame={14} fps={fps} frame={frame}>
              and When Should You Use It?
            </TitleLine>
          </div>

          {/* Dashed divider */}
          <svg
            width={LINE_W}
            height={4}
            style={{ overflow: "visible", display: "block" }}
          >
            <defs>
              <clipPath id="divider-reveal">
                <rect x={0} y={-4} width={dividerReveal} height={12} />
              </clipPath>
            </defs>
            <line
              x1={0} y1={2} x2={LINE_W} y2={2}
              stroke="#1d9e75"
              strokeWidth={1.5}
              strokeDasharray="8 5"
              clipPath="url(#divider-reveal)"
            />
          </svg>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.4)",
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              letterSpacing: "0.3px",
            }}
          >
            Background job processing for Rust
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
