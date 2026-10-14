import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import emailIcon from "../assets/email.svg";
import pdfIcon from "../assets/pdf.svg";
import webhookIcon from "../assets/webhook.svg";
import paymentIcon from "../assets/payment.svg";

const CARDS = [
  { logo: emailIcon,   label: "Email",    status: "stalled", startFrame: 5,  bg: "#a78bfa" },
  { logo: pdfIcon,     label: "PDF report", status: "dropped", startFrame: 15, bg: "#f87171" },
  { logo: webhookIcon, label: "Webhook",  status: "failing", startFrame: 25, bg: "#60a5fa" },
  { logo: paymentIcon, label: "Payment",  status: "timeout", startFrame: 35, bg: "#1d9e75" },
];

const IconCard: React.FC<{
  logo: string;
  label: string;
  status: string;
  startFrame: number;
  bg: string;
  frame: number;
  fps: number;
}> = ({ logo, label, status, startFrame, bg, frame, fps }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - startFrame),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 200,
        padding: "24px 20px 20px",
        background: `${bg}18`,
        border: `1.5px solid ${bg}55`,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        transform: `translateY(${translateY}px)`,
        opacity,
        userSelect: "none",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Img
          src={logo}
          width={34}
          height={34}
          style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Label + status */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <div style={{ fontSize: 18, color: "#ffffff", fontWeight: 700, lineHeight: 1.5 }}>
          {label}
        </div>
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            fontSize: 13,
            color: "#e85d24",
            background: "rgba(232,93,36,0.15)",
            border: "1px solid rgba(232,93,36,0.35)",
            borderRadius: 10,
            padding: "3px 10px",
            fontWeight: 600,
            letterSpacing: "0.5px",
          }}
        >
          {status}
        </div>
      </div>
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Request wall
  const wallOpacity = interpolate(frame, [50, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wallY = interpolate(frame, [50, 62], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Quote
  const quoteOpacity = interpolate(frame, [70, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteY = interpolate(frame, [70, 82], [12, 0], {
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
      {/* Icon cards */}
      <div style={{ display: "flex", gap: 24 }}>
        {CARDS.map((c) => (
          <IconCard key={c.label} {...c} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Request wall */}
      <div
        style={{
          opacity: wallOpacity,
          transform: `translateY(${wallY}px)`,
          background: "#161b22",
          borderLeft: "3px solid #e85d24",
          borderRadius: "0 8px 8px 0",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: 872,
          userSelect: "none",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
            Request lifecycle wall
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
            Too slow · Too risky · No retry
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444", opacity: 0.6 }}>
          500
        </div>
      </div>

      {/* Quote */}
      <div
        style={{
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          maxWidth: 640,
          textAlign: "center",
          fontSize: 16,
          color: "rgba(255,255,255,0.4)",
          fontStyle: "italic",
          lineHeight: 1.65,
          userSelect: "none",
        }}
      >
        "These tasks don't belong in your request lifecycle — they're too slow,
        too risky, and too important to just hope they work."
      </div>
    </AbsoluteFill>
  );
};
