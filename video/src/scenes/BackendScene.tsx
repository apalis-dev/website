import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CODE_FONT =
  "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

const cl = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ── Animation helper (pure — no hooks) ───────────────────────────────────────
function ent(localFrame: number, start: number, fps: number) {
  const p = spring({
    fps,
    frame: Math.max(0, localFrame - start),
    config: { damping: 14, stiffness: 120, mass: 0.5 },
    from: 0,
    to: 1,
  });
  return {
    opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(p, [0, 1], [20, 0]),
    scale: interpolate(p, [0, 1], [0.84, 1]),
  };
}

// ── Shared: act header ───────────────────────────────────────────────────────
const ActHeader: React.FC<{
  eyebrow: string;
  headline: React.ReactNode;
  localFrame: number;
  fps: number;
}> = ({ eyebrow, headline, localFrame, fps }) => {
  const eyebrowOpacity = interpolate(localFrame, [0, 12], [0, 1], cl);
  const e = ent(localFrame, 8, fps);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          opacity: eyebrowOpacity,
          textTransform: "uppercase",
          letterSpacing: "4px",
          color: "rgba(255,255,255,0.35)",
          fontSize: 16,
          fontWeight: 600,
          userSelect: "none",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          opacity: e.opacity,
          transform: `translateY(${e.y}px)`,
          fontSize: 52,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          userSelect: "none",
        }}
      >
        {headline}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 1 — The Backend  (localFrame = frame, peak 10–90)
// ══════════════════════════════════════════════════════════════════════════════

const BACKENDS = [
  ["Postgres", "MySQL", "SQLite"],
  ["Redis", "AMQP", "PGMQ"],
  ["NATS", "RSMQ", "Cron"],
];

const RESPONSIBILITIES = ["Poll tasks", "Heartbeat", "Middleware"];

const FlowDashArrow: React.FC<{ localFrame: number; visible: boolean }> = ({
  localFrame,
  visible,
}) => {
  if (!visible) return null;
  const DASH = 14,
    GAP = 7;
  const offset = -((localFrame * 2) % (DASH + GAP));
  return (
    <svg
      width={76}
      height={24}
      style={{ alignSelf: "center", flexShrink: 0 }}
    >
      <line
        x1={0}
        y1={12}
        x2={76}
        y2={12}
        stroke="#1d9e75"
        strokeWidth={2}
        strokeDasharray={`${DASH} ${GAP}`}
        strokeDashoffset={offset}
        opacity={0.7}
      />
      <polygon points="68,7 76,12 68,17" fill="#1d9e75" opacity={0.9} />
    </svg>
  );
};

const Act1: React.FC<{
  localFrame: number;
  fps: number;
  opacity: number;
}> = ({ localFrame, fps, opacity }) => {
  const app = ent(localFrame, 22, fps);
  const backend = ent(localFrame, 38, fps);
  const store = ent(localFrame, 54, fps);

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 34,
      }}
    >
      <ActHeader
        eyebrow="The Backend"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Your bridge </span>
            <span style={{ color: "#1d9e75" }}>to the task store.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      {/* Flow diagram */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Your App */}
        <div
          style={{
            opacity: app.opacity,
            transform: `translateY(${app.y}px)`,
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 14,
            padding: "15px 26px",
            background: "rgba(255,255,255,0.04)",
            fontSize: 17,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Your App
        </div>

        <FlowDashArrow localFrame={localFrame} visible={localFrame > 30} />

        {/* Backend — highlighted center */}
        <div
          style={{
            opacity: backend.opacity,
            transform: `translateY(${backend.y}px)`,
            border: "1.5px solid rgba(29,158,117,0.7)",
            borderRadius: 14,
            padding: "15px 26px",
            background: "rgba(29,158,117,0.1)",
            boxShadow: "0 0 32px rgba(29,158,117,0.22)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            userSelect: "none",
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1d9e75",
              whiteSpace: "nowrap",
            }}
          >
            Backend
          </div>
          {/* Responsibility badges */}
          <div style={{ display: "flex", gap: 7 }}>
            {RESPONSIBILITIES.map((r, i) => (
              <div
                key={r}
                style={{
                  opacity: interpolate(
                    localFrame,
                    [64 + i * 8, 74 + i * 8],
                    [0, 1],
                    cl
                  ),
                  background: "rgba(29,158,117,0.12)",
                  border: "1px solid rgba(29,158,117,0.3)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5dcaa5",
                  whiteSpace: "nowrap",
                }}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <FlowDashArrow localFrame={localFrame} visible={localFrame > 46} />

        {/* Task Store */}
        <div
          style={{
            opacity: store.opacity,
            transform: `translateY(${store.y}px)`,
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 14,
            padding: "15px 26px",
            background: "rgba(255,255,255,0.04)",
            fontSize: 17,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Task Store
        </div>
      </div>

      {/* Backend implementations grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
        }}
      >
        {BACKENDS.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 8 }}>
            {row.map((name, ci) => {
              const idx = ri * 3 + ci;
              return (
                <div
                  key={name}
                  style={{
                    opacity: interpolate(
                      localFrame,
                      [60 + idx * 6, 74 + idx * 6],
                      [0, 1],
                      cl
                    ),
                    background: "#161b22",
                    border: "1px solid rgba(255,255,255,0.11)",
                    borderRadius: 9,
                    padding: "9px 18px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 2 — Pushing Tasks  (localFrame = frame − 92, peak 10–90)
// ══════════════════════════════════════════════════════════════════════════════

type PushMethod = {
  method: string;
  desc: string;
  detail: string;
  color: string;
  startLocal: number;
};

const PUSH_METHODS: PushMethod[] = [
  {
    method: ".push()",
    desc: "single task",
    detail: "immediate, one-off submission",
    color: "#1d9e75",
    startLocal: 22,
  },
  {
    method: ".push_bulk()",
    desc: "batch",
    detail: "small-to-medium vec of tasks",
    color: "#60a5fa",
    startLocal: 38,
  },
  {
    method: ".push_stream()",
    desc: "lazy stream",
    detail: "large datasets, memory efficient",
    color: "#a78bfa",
    startLocal: 54,
  },
  {
    method: ".push_task()",
    desc: "custom envelope",
    detail: "full control over task metadata",
    color: "#f97316",
    startLocal: 70,
  },
];

const Act2: React.FC<{
  localFrame: number;
  fps: number;
  opacity: number;
}> = ({ localFrame, fps, opacity }) => {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 38,
      }}
    >
      <ActHeader
        eyebrow="Pushing Tasks"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Push work. </span>
            <span style={{ color: "#1d9e75" }}>Your way.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />
      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {PUSH_METHODS.map((m) => {
          const e = ent(localFrame, m.startLocal, fps);
          return (
            <div
              key={m.method}
              style={{
                opacity: e.opacity,
                transform: `translateY(${e.y}px)`,
                background: "#161b22",
                border: `1px solid ${m.color}38`,
                borderLeft: `3px solid ${m.color}`,
                borderRadius: 12,
                padding: "20px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                userSelect: "none",
                width: 248,
              }}
            >
              <div
                style={{
                  fontFamily: CODE_FONT,
                  fontSize: 19,
                  fontWeight: 700,
                  color: m.color,
                }}
              >
                {m.method}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {m.desc}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.3)",
                  lineHeight: 1.4,
                }}
              >
                {m.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 3 — Expose & Maintenance  (localFrame = frame − 194, peak 10–76)
// ══════════════════════════════════════════════════════════════════════════════

type ExposeTrait = {
  name: string;
  desc: string;
  color: string;
  startLocal: number;
};

const EXPOSE_TRAITS: ExposeTrait[] = [
  {
    name: "Metrics",
    desc: "global & per-queue stats",
    color: "#1d9e75",
    startLocal: 20,
  },
  {
    name: "ListWorkers",
    desc: "active workers",
    color: "#60a5fa",
    startLocal: 34,
  },
  {
    name: "ListQueues",
    desc: "available queues",
    color: "#a78bfa",
    startLocal: 48,
  },
  {
    name: "ListAllTasks",
    desc: "tasks across queues",
    color: "#5dcaa5",
    startLocal: 62,
  },
  {
    name: "ListTasks<T>",
    desc: "tasks in a queue",
    color: "#f97316",
    startLocal: 76,
  },
  {
    name: "TaskSink<T>",
    desc: "enqueue tasks",
    color: "#f87171",
    startLocal: 90,
  },
];

const Act3: React.FC<{
  localFrame: number;
  fps: number;
  opacity: number;
}> = ({ localFrame, fps, opacity }) => {
  const taglineOpacity = interpolate(localFrame, [104, 116], [0, 1], cl);

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 34,
      }}
    >
      <ActHeader
        eyebrow="Expose & Maintenance"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Full introspection, </span>
            <span style={{ color: "#1d9e75" }}>built-in.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 860,
        }}
      >
        {EXPOSE_TRAITS.map((t) => {
          const e = ent(localFrame, t.startLocal, fps);
          return (
            <div
              key={t.name}
              style={{
                opacity: e.opacity,
                transform: `scale(${e.scale})`,
                background: "#161b22",
                border: `1px solid ${t.color}40`,
                borderRadius: 12,
                padding: "16px 22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                userSelect: "none",
                minWidth: 172,
              }}
            >
              <div
                style={{
                  fontFamily: CODE_FONT,
                  fontSize: 16,
                  fontWeight: 700,
                  color: t.color,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.35)",
                  fontWeight: 500,
                }}
              >
                {t.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 19,
          color: "rgba(255,255,255,0.3)",
          fontStyle: "italic",
          userSelect: "none",
        }}
      >
        Satisfy all six traits — get{" "}
        <span
          style={{
            color: "#5dcaa5",
            fontStyle: "normal",
            fontFamily: CODE_FONT,
          }}
        >
          Expose
        </span>{" "}
        for free.
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 4 — Shared Connections & Codecs  (localFrame = frame − 286, peak 10–74)
// ══════════════════════════════════════════════════════════════════════════════

type Codec = {
  name: string;
  tag: string;
  feature: string;
  color: string;
  startLocal: number;
};

const CODECS: Codec[] = [
  {
    name: "JsonCodec",
    tag: "default",
    feature: "human-readable",
    color: "#1d9e75",
    startLocal: 68,
  },
  {
    name: "MsgPackCodec",
    tag: "msgpack",
    feature: "20–50% smaller",
    color: "#60a5fa",
    startLocal: 82,
  },
  {
    name: "BincodeCodec",
    tag: "bincode",
    feature: "maximum speed",
    color: "#a78bfa",
    startLocal: 96,
  },
];

const WORKER_LABELS = ["Backend<String>", "Backend<u32>", "Backend<Email>"];
const WORKER_COLORS = ["#1d9e75", "#60a5fa", "#a78bfa"];

const Act4: React.FC<{
  localFrame: number;
  fps: number;
  opacity: number;
}> = ({ localFrame, fps, opacity }) => {
  const poolE = ent(localFrame, 16, fps);
  const arrowOpacity = interpolate(localFrame, [24, 33], [0, 1], cl);
  const workerEs = [
    ent(localFrame, 30, fps),
    ent(localFrame, 42, fps),
    ent(localFrame, 54, fps),
  ];
  const sharedTagOpacity = interpolate(localFrame, [62, 72], [0, 1], cl);
  const dividerOpacity = interpolate(localFrame, [60, 70], [0, 1], cl);
  const codecLabelOpacity = interpolate(localFrame, [62, 72], [0, 1], cl);

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <ActHeader
        eyebrow="Shared & Encoded"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>One pool. </span>
            <span style={{ color: "#1d9e75" }}>Smart encoding.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      {/* Shared connection diagram */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Pool */}
        <div
          style={{
            opacity: poolE.opacity,
            transform: `translateY(${poolE.y}px)`,
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 12,
            padding: "12px 28px",
            background: "rgba(255,255,255,0.04)",
            fontSize: 16,
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Single Connection Pool
        </div>

        {/* Down arrow + make_shared label */}
        <div
          style={{
            opacity: arrowOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width={24} height={22}>
            <line
              x1={12}
              y1={0}
              x2={12}
              y2={16}
              stroke="rgba(29,158,117,0.55)"
              strokeWidth={2}
            />
            <polygon
              points="7,13 12,22 17,13"
              fill="rgba(29,158,117,0.65)"
            />
          </svg>
          <div
            style={{
              fontFamily: CODE_FONT,
              fontSize: 13,
              fontWeight: 700,
              color: "#1d9e75",
              background: "rgba(29,158,117,0.1)",
              border: "1px solid rgba(29,158,117,0.3)",
              borderRadius: 7,
              padding: "4px 12px",
              userSelect: "none",
            }}
          >
            .make_shared()
          </div>
        </div>

        {/* Typed backends */}
        <div style={{ display: "flex", gap: 10 }}>
          {WORKER_LABELS.map((label, i) => (
            <div
              key={label}
              style={{
                opacity: workerEs[i].opacity,
                transform: `scale(${workerEs[i].scale})`,
                background: "#161b22",
                border: `1px solid ${WORKER_COLORS[i]}40`,
                borderRadius: 9,
                padding: "9px 16px",
                fontSize: 13,
                fontWeight: 700,
                color: WORKER_COLORS[i],
                fontFamily: CODE_FONT,
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div
          style={{
            opacity: sharedTagOpacity,
            fontSize: 13,
            color: "rgba(255,255,255,0.28)",
            fontStyle: "italic",
            userSelect: "none",
            marginTop: 2,
          }}
        >
          Fewer connections. Less overhead.
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          opacity: dividerOpacity,
          width: 560,
          height: 1,
          background: "rgba(255,255,255,0.07)",
        }}
      />

      {/* Codecs */}
      <div
        style={{
          opacity: codecLabelOpacity,
          fontSize: 13,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "3px",
          color: "rgba(255,255,255,0.22)",
          userSelect: "none",
        }}
      >
        Codecs
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {CODECS.map((c) => {
          const e = ent(localFrame, c.startLocal, fps);
          return (
            <div
              key={c.name}
              style={{
                opacity: e.opacity,
                transform: `scale(${e.scale})`,
                background: "#161b22",
                border: `1px solid ${c.color}40`,
                borderRadius: 14,
                padding: "16px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                userSelect: "none",
                minWidth: 200,
              }}
            >
              <div
                style={{
                  fontFamily: CODE_FONT,
                  fontSize: 17,
                  fontWeight: 700,
                  color: c.color,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  background: `${c.color}18`,
                  border: `1px solid ${c.color}40`,
                  borderRadius: 6,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.color,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {c.tag}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.38)",
                  fontWeight: 500,
                }}
              >
                {c.feature}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE
// Act windows (global frames):
//   Act 1: 0   – 102  (opacity: [0,10, 90,102] → [0,1,1,0])
//   Act 2: 92  – 204  (opacity: [92,102,192,204])
//   Act 3: 194 – 296  (opacity: [194,204,284,296])
//   Act 4: 286 – 360  (opacity: [286,296,360,360] — FadeWrapper ends scene)
// Total: 360 frames
// ══════════════════════════════════════════════════════════════════════════════

export const BackendScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const act1Opacity = interpolate(frame, [0, 20, 170, 190], [0, 1, 1, 0], cl);
  const act2Opacity = interpolate(frame, [170, 190, 360, 380], [0, 1, 1, 0], cl);
  const act3Opacity = interpolate(frame, [360, 380, 530, 550], [0, 1, 1, 0], cl);
  const act4Opacity = interpolate(frame, [530, 550], [0, 1], cl);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      {act1Opacity > 0 && (
        <Act1 localFrame={frame} fps={fps} opacity={act1Opacity} />
      )}
      {act2Opacity > 0 && (
        <Act2
          localFrame={Math.max(0, frame - 170)}
          fps={fps}
          opacity={act2Opacity}
        />
      )}
      {act3Opacity > 0 && (
        <Act3
          localFrame={Math.max(0, frame - 360)}
          fps={fps}
          opacity={act3Opacity}
        />
      )}
      {act4Opacity > 0 && (
        <Act4
          localFrame={Math.max(0, frame - 530)}
          fps={fps}
          opacity={act4Opacity}
        />
      )}
    </AbsoluteFill>
  );
};
