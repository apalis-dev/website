import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import emailIcon    from "../assets/email.svg";
import timerIcon    from "../assets/timer.svg";
import workflowIcon from "../assets/workflow.svg";
import webhookIcon  from "../assets/webhook.svg";
import scaleIcon    from "../assets/scale.svg";

// bg = tint color; icon rendered white over it
const CARDS = [
  {
    logo: emailIcon,
    title: "Emails & notifications",
    subtitle: "Don't block your API — offload to a worker",
    bg: "#c792ea",
    startFrame: 8,
  },
  {
    logo: timerIcon,
    title: "Scheduled reports",
    subtitle: "Cron jobs, data pipelines, ETL tasks",
    bg: "#82aaff",
    startFrame: 18,
  },
  {
    logo: workflowIcon,
    title: "DAG workflows",
    subtitle: "Multi-step tasks with dependencies",
    bg: "#c3e88d",
    startFrame: 28,
  },
  {
    logo: webhookIcon,
    title: "Webhooks & events",
    subtitle: "Reliable third-party integrations",
    bg: "#f87171",
    startFrame: 38,
  },
  {
    logo: scaleIcon,
    title: "Scale background work independently from your web layer",
    subtitle: "",
    bg: "#ffffff",
    startFrame: 48,
    fullWidth: true,
  },
];

// ── Card component ────────────────────────────────────────────────────────────
const UseCaseCard: React.FC<{
  logo: string;
  title: string;
  subtitle: string;
  bg: string;
  startFrame: number;
  fullWidth?: boolean;
  frame: number;
  fps: number;
}> = ({ logo, title, subtitle, bg, startFrame, fullWidth, frame, fps }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateX = interpolate(progress, [0, 1], [-40, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        background: `${bg}18`,
        border: `1.5px solid ${bg}55`,
        borderRadius: 16,
        padding: "26px 28px",
        display: "flex",
        flexDirection: fullWidth ? "row" : "column",
        alignItems: fullWidth ? "center" : "flex-start",
        gap: fullWidth ? 24 : 18,
        flex: fullWidth ? "1" : "0 0 calc(50% - 10px)",
        userSelect: "none",
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: `${bg}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Img
          src={logo}
          width={38}
          height={38}
          style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ── Scene ─────────────────────────────────────────────────────────────────────
export const UseCasesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = spring({
    fps,
    frame: Math.max(0, frame),
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const headingOpacity = interpolate(headingProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headingY = interpolate(headingProgress, [0, 1], [16, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          transform: `translateY(${headingY}px)`,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          userSelect: "none",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.75)" }}>Use </span>
        <span style={{ color: "#1d9e75" , fontSize: 56 }}>Apalis</span>
        <span style={{ color: "rgba(255,255,255,0.75)" }}> when you need to…</span>
      </div>

      {/* Card grid — 2 + 2 + 1 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 940,
        }}
      >
        {/* Row 1 */}
        <div style={{ display: "flex", gap: 24 }}>
          <UseCaseCard {...CARDS[0]} frame={frame} fps={fps} />
          <UseCaseCard {...CARDS[1]} frame={frame} fps={fps} />
        </div>
        {/* Row 2 */}
        <div style={{ display: "flex", gap: 24 }}>
          <UseCaseCard {...CARDS[2]} frame={frame} fps={fps} />
          <UseCaseCard {...CARDS[3]} frame={frame} fps={fps} />
        </div>
        {/* Full-width row 3 */}
        <div style={{ display: "flex" }}>
          <UseCaseCard {...CARDS[4]} frame={frame} fps={fps} fullWidth />
        </div>
      </div>
    </AbsoluteFill>
  );
};
