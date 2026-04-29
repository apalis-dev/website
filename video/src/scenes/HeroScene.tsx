import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PHRASES = [
  { text: "Orchestrate workflows", color: "#a78bfa" },
  { text: "Build reliable workers", color: "#60a5fa" },
  { text: "Monitor background queues", color: "#1d9e75" },
  { text: "Manage task backpressure", color: "#f97316" },
  { text: "Handle task retries", color: "#f87171" },
];


const PHRASE_DURATION = 40;
const TRANSITION_FRAMES = 12;

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Wordmark ──────────────────────────────────────────────
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

  // ── Cycling phrases (one pass only — clamps at last phrase) ──
  const phraseIndex = Math.min(Math.floor(frame / PHRASE_DURATION), PHRASES.length - 1);
  const phraseFrame = frame % PHRASE_DURATION;
  const prevIndex = (phraseIndex - 1 + PHRASES.length) % PHRASES.length;

  // Show exit animation only after the first full cycle has passed
  const inTransition = phraseFrame < TRANSITION_FRAMES;
  const showExit = inTransition && frame >= PHRASE_DURATION;

  const enterOpacity = interpolate(phraseFrame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enterY = interpolate(phraseFrame, [0, TRANSITION_FRAMES], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitOpacity = showExit
    ? interpolate(phraseFrame, [0, TRANSITION_FRAMES], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const exitY = showExit
    ? interpolate(phraseFrame, [0, TRANSITION_FRAMES], [0, -20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : -20;

  // ── "with confidence" ─────────────────────────────────────
  const withConfidenceOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const current = PHRASES[phraseIndex];
  const prev = PHRASES[prevIndex];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", userSelect: "none" }}>
        {/* Wordmark — 120px white */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-4px",
            transform: `scale(${wordmarkScale})`,
            opacity: wordmarkOpacity,
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          Apalis
        </div>

        {/* Line 2 — Cycling phrase */}
        <div
          style={{
            marginTop: 28,
            position: "relative",
            overflow: "hidden",
            height: 62,
            minWidth: 900,
          }}
        >
          {/* Exiting phrase */}
          {showExit && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                fontSize: 48,
                fontWeight: 800,
                color: prev.color,
                opacity: exitOpacity,
                transform: `translateY(${exitY}px)`,
                textAlign: "center",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {prev.text}
            </div>
          )}
          {/* Entering phrase */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              fontSize: 48,
              fontWeight: 800,
              color: current.color,
              opacity: enterOpacity,
              transform: `translateY(${enterY}px)`,
              textAlign: "center",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {current.text}
          </div>
        </div>

        {/* Line 3 — "with confidence" */}
        <div
          style={{
            marginTop: 16,
            fontSize: 48,
            fontWeight: 800,
            color: "rgba(255,255,255,0.85)",
            opacity: withConfidenceOpacity,
            lineHeight: 1,
          }}
        >
          with confidence
        </div>
      </div>
    </AbsoluteFill>
  );
};
