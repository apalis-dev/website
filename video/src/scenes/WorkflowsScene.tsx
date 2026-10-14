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
    y: interpolate(p, [0, 1], [24, 0]),
    scale: interpolate(p, [0, 1], [0.84, 1]),
  };
}

const ActHeader: React.FC<{
  eyebrow: string;
  headline: React.ReactNode;
  localFrame: number;
  fps: number;
}> = ({ eyebrow, headline, localFrame, fps }) => {
  const eyebrowOpacity = interpolate(localFrame, [0, 14], [0, 1], cl);
  const e = ent(localFrame, 10, fps);
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

// ── Animated dashed horizontal arrow ─────────────────────────────────────────
const DashArrow: React.FC<{ localFrame: number; startAt: number }> = ({
  localFrame,
  startAt,
}) => {
  const opacity = interpolate(localFrame, [startAt, startAt + 12], [0, 0.85], cl);
  if (opacity === 0) return null;
  const DASH = 14,
    GAP = 7;
  const offset = -((localFrame * 2) % (DASH + GAP));
  return (
    <svg
      width={80}
      height={24}
      style={{ alignSelf: "center", flexShrink: 0, opacity }}
    >
      <line
        x1={0}
        y1={12}
        x2={80}
        y2={12}
        stroke="#1d9e75"
        strokeWidth={2}
        strokeDasharray={`${DASH} ${GAP}`}
        strokeDashoffset={offset}
      />
      <polygon points="72,7 80,12 72,17" fill="#1d9e75" />
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 1 — Sequential Workflows  (localFrame = frame, 0–220)
// Shows a live pipeline: Input → and_then → filter_map → and_then → Done
// ══════════════════════════════════════════════════════════════════════════════

const PIPELINE: Array<{
  label: string;
  sub: string;
  typeNote: string;
  color: string;
  startAt: number;
  isEdge?: boolean;
}> = [
  {
    label: "10",
    sub: "start value",
    typeNote: "usize",
    color: "rgba(255,255,255,0.55)",
    startAt: 28,
    isEdge: true,
  },
  {
    label: ".and_then()",
    sub: "collect into Vec",
    typeNote: "usize → Vec<usize>",
    color: "#1d9e75",
    startAt: 46,
  },
  {
    label: ".filter_map()",
    sub: "keep odd numbers",
    typeNote: "Vec<usize> → Vec<usize>",
    color: "#60a5fa",
    startAt: 64,
  },
  {
    label: ".and_then()",
    sub: "sum & print",
    typeNote: "Vec<usize> → ()",
    color: "#a78bfa",
    startAt: 82,
  },
  {
    label: "Done ✓",
    sub: "workflow complete",
    typeNote: "()",
    color: "#5dcaa5",
    startAt: 100,
    isEdge: true,
  },
];

const Act1: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame,
  fps,
  opacity,
}) => {
  const taglineOpacity = interpolate(localFrame, [118, 136], [0, 1], cl);
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 52,
      }}
    >
      <ActHeader
        eyebrow="Workflows"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Step by step. </span>
            <span style={{ color: "#1d9e75" }}>Type-safe pipelines.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      {/* Pipeline */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {PIPELINE.map((step, i) => {
          const e = ent(localFrame, step.startAt, fps);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  opacity: e.opacity,
                  transform: `translateY(${e.y}px)`,
                  background: step.isEdge
                    ? "rgba(255,255,255,0.04)"
                    : "#161b22",
                  border: `1.5px solid ${step.color}${step.isEdge ? "50" : "80"}`,
                  borderRadius: 14,
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 176,
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    fontFamily: CODE_FONT,
                    fontSize: 17,
                    fontWeight: 700,
                    color: step.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.45)",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {step.sub}
                </div>
                <div
                  style={{
                    fontFamily: CODE_FONT,
                    fontSize: 11,
                    color: "rgba(255,255,255,0.22)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.typeNote}
                </div>
              </div>
              {i < PIPELINE.length - 1 && (
                <DashArrow
                  localFrame={localFrame}
                  startAt={step.startAt + 12}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 18,
          color: "rgba(255,255,255,0.28)",
          fontStyle: "italic",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        Each step receives and transforms the previous output —{" "}
        <span style={{ color: "#5dcaa5", fontStyle: "normal" }}>
          type-checked at compile time
        </span>
        .
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 2 — Sequential Combinators  (localFrame = frame − 200)
// ══════════════════════════════════════════════════════════════════════════════

const COMBINATORS = [
  {
    name: "and_then",
    input: "Any T",
    purpose: "Transform data; short-circuits on error",
    color: "#1d9e75",
    startAt: 22,
  },
  {
    name: "filter_map",
    input: "Vec<T>",
    purpose: "Keep or discard collection elements",
    color: "#60a5fa",
    startAt: 42,
  },
  {
    name: "fold",
    input: "Vec<T>",
    purpose: "Aggregate collection into single value",
    color: "#a78bfa",
    startAt: 62,
  },
  {
    name: "repeat_until",
    input: "Any T",
    purpose: "Loop until completion condition met",
    color: "#f97316",
    startAt: 82,
  },
  {
    name: "delay_for",
    input: "Any T",
    purpose: "Insert a fixed duration pause",
    color: "#5dcaa5",
    startAt: 102,
  },
  {
    name: "delay_with",
    input: "Any T",
    purpose: "Variable pause based on input value",
    color: "#f87171",
    startAt: 122,
  },
];

const Act2: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame,
  fps,
  opacity,
}) => {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      <ActHeader
        eyebrow="Sequential Workflows"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Six </span>
            <span style={{ color: "#1d9e75" }}>combinators.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          maxWidth: 1120,
        }}
      >
        {COMBINATORS.map((c) => {
          const e = ent(localFrame, c.startAt, fps);
          return (
            <div
              key={c.name}
              style={{
                opacity: e.opacity,
                transform: `translateY(${e.y}px)`,
                background: "#161b22",
                border: `1px solid ${c.color}40`,
                borderLeft: `3px solid ${c.color}`,
                borderRadius: 12,
                padding: "22px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: 316,
                userSelect: "none",
              }}
            >
              <div
                style={{
                  fontFamily: CODE_FONT,
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.color,
                }}
              >
                .{c.name}()
              </div>
              <div
                style={{
                  alignSelf: "flex-start",
                  background: `${c.color}18`,
                  border: `1px solid ${c.color}40`,
                  borderRadius: 5,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: c.color,
                  fontFamily: CODE_FONT,
                }}
              >
                {c.input}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.5,
                }}
              >
                {c.purpose}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 3 — DAG Workflows  (localFrame = frame − 400)
// Shows: u32 input → [get_name | get_age | get_address] → collector
// ══════════════════════════════════════════════════════════════════════════════

const DAG_W = 700;
const DAG_H = 352;

// All positions relative to the DAG container
const DN = {
  input:   { cx: 350, ty: 0,   w: 180, h: 72 },
  name:    { cx: 110, ty: 140, w: 170, h: 72 },
  age:     { cx: 350, ty: 140, w: 150, h: 72 },
  address: { cx: 590, ty: 140, w: 170, h: 72 },
  coll:    { cx: 350, ty: 280, w: 230, h: 72 },
};

const DagDiagram: React.FC<{ localFrame: number; fps: number }> = ({
  localFrame,
  fps,
}) => {
  const inputE = ent(localFrame, 22, fps);
  const nameE  = ent(localFrame, 42, fps);
  const ageE   = ent(localFrame, 54, fps);
  const addrE  = ent(localFrame, 66, fps);
  const collE  = ent(localFrame, 94, fps);

  const forkProgress  = interpolate(localFrame, [50, 78], [0, 1], cl);
  const mergeProgress = interpolate(localFrame, [82, 110], [0, 1], cl);
  const forkDash  = interpolate(forkProgress,  [0, 1], [999, 0], cl);
  const mergeDash = interpolate(mergeProgress, [0, 1], [999, 0], cl);

  // Derived endpoints
  const iBot  = { x: DN.input.cx,   y: DN.input.ty   + DN.input.h };
  const nmTop = { x: DN.name.cx,    y: DN.name.ty };
  const agTop = { x: DN.age.cx,     y: DN.age.ty };
  const adTop = { x: DN.address.cx, y: DN.address.ty };
  const nmBot = { x: DN.name.cx,    y: DN.name.ty    + DN.name.h };
  const agBot = { x: DN.age.cx,     y: DN.age.ty     + DN.age.h };
  const adBot = { x: DN.address.cx, y: DN.address.ty + DN.address.h };
  const coTop = { x: DN.coll.cx,    y: DN.coll.ty };

  const nodeStyle = (
    e: ReturnType<typeof ent>,
    node: { cx: number; ty: number; w: number; h: number },
    color: string
  ): React.CSSProperties => ({
    position: "absolute",
    left: node.cx - node.w / 2,
    top: node.ty,
    width: node.w,
    height: node.h,
    opacity: e.opacity,
    transform: `translateY(${e.y}px)`,
    background: "#161b22",
    border: `1.5px solid ${color}70`,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    userSelect: "none",
  });

  const label = (text: string, color: string) => (
    <div
      style={{
        fontFamily: CODE_FONT,
        fontSize: 15,
        fontWeight: 700,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
  const sub = (text: string) => (
    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{text}</div>
  );

  return (
    <div style={{ position: "relative", width: DAG_W, height: DAG_H }}>
      {/* SVG arrow layer */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DAG_W,
          height: DAG_H,
          pointerEvents: "none",
        }}
      >
        {/* Fork lines: input → parallel nodes */}
        {(
          [
            [iBot.x, iBot.y, nmTop.x, nmTop.y],
            [iBot.x, iBot.y, agTop.x, agTop.y],
            [iBot.x, iBot.y, adTop.x, adTop.y],
          ] as [number, number, number, number][]
        ).map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#1d9e75"
            strokeWidth={1.5}
            opacity={0.55}
            strokeDasharray="999"
            strokeDashoffset={forkDash}
          />
        ))}
        {/* Merge lines: parallel nodes → collector */}
        {(
          [
            [nmBot.x, nmBot.y, coTop.x, coTop.y],
            [agBot.x, agBot.y, coTop.x, coTop.y],
            [adBot.x, adBot.y, coTop.x, coTop.y],
          ] as [number, number, number, number][]
        ).map(([x1, y1, x2, y2], i) => (
          <line
            key={i + 3}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#a78bfa"
            strokeWidth={1.5}
            opacity={0.55}
            strokeDasharray="999"
            strokeDashoffset={mergeDash}
          />
        ))}
      </svg>

      {/* Input node */}
      <div style={nodeStyle(inputE, DN.input, "rgba(255,255,255,0.6)")}>
        {label("u32 input", "rgba(255,255,255,0.6)")}
        {sub("42, 43, 44")}
      </div>

      {/* Parallel nodes */}
      <div style={nodeStyle(nameE, DN.name, "#1d9e75")}>
        {label("get_name()", "#1d9e75")}
        {sub("→ String")}
      </div>
      <div style={nodeStyle(ageE, DN.age, "#60a5fa")}>
        {label("get_age()", "#60a5fa")}
        {sub("→ usize")}
      </div>
      <div style={nodeStyle(addrE, DN.address, "#a78bfa")}>
        {label("get_address()", "#a78bfa")}
        {sub("→ usize")}
      </div>

      {/* Collector node */}
      <div style={nodeStyle(collE, DN.coll, "#f97316")}>
        {label("collector()", "#f97316")}
        {sub("(String, usize, usize) → usize")}
      </div>
    </div>
  );
};

const Act3: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame,
  fps,
  opacity,
}) => {
  const taglineOpacity = interpolate(localFrame, [114, 132], [0, 1], cl);
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundColor: "#0d0d0d",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 46,
      }}
    >
      <ActHeader
        eyebrow="Workflows"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Parallel branches. </span>
            <span style={{ color: "#1d9e75" }}>Smart merging.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      <DagDiagram localFrame={localFrame} fps={fps} />

      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 18,
          color: "rgba(255,255,255,0.28)",
          fontStyle: "italic",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        Independent nodes run{" "}
        <span style={{ color: "#1d9e75", fontStyle: "normal" }}>
          concurrently
        </span>
        . Dependent nodes wait for all inputs to complete.
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 4 — Validate · Inspect · When to Use  (localFrame = frame − 600)
// ══════════════════════════════════════════════════════════════════════════════

const DOT_GRAPH = `digraph user-etl-workflow {
  get_name    -> collector;
  get_age     -> collector;
  get_address -> collector;
}`;

const SEQ_WHEN = [
  "Steps must run in strict order",
  "Each step needs the previous result",
  "Simple ETL pipelines",
  "Errors should short-circuit early",
];

const DAG_WHEN = [
  "Steps can run independently",
  "Better throughput from parallelism",
  "Branches merge at collection points",
  "Complex dependency graphs",
];

const Act4: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame,
  fps,
  opacity,
}) => {
  const validateE = ent(localFrame, 22, fps);
  const dotE      = ent(localFrame, 48, fps);
  const seqE      = ent(localFrame, 80, fps);
  const dagE      = ent(localFrame, 102, fps);

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
        eyebrow="DAG Workflows"
        headline={
          <>
            <span style={{ color: "#ffffff" }}>Validate. </span>
            <span style={{ color: "#1d9e75" }}>Inspect. Run.</span>
          </>
        }
        localFrame={localFrame}
        fps={fps}
      />

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {/* Left: validate() + DOT graph */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* validate() */}
          <div
            style={{
              opacity: validateE.opacity,
              transform: `translateY(${validateE.y}px)`,
              background: "#161b22",
              border: "1px solid rgba(29,158,117,0.4)",
              borderLeft: "3px solid #1d9e75",
              borderRadius: 12,
              padding: "20px 26px",
              userSelect: "none",
              width: 368,
            }}
          >
            <div
              style={{
                fontFamily: CODE_FONT,
                fontSize: 18,
                fontWeight: 700,
                color: "#1d9e75",
                marginBottom: 10,
              }}
            >
              dag_flow.validate()?
            </div>
            <div
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.6,
              }}
            >
              Checks the graph is acyclic, all dependencies reference registered
              nodes, and valid entry points exist.
            </div>
          </div>

          {/* DOT output */}
          <div
            style={{
              opacity: dotE.opacity,
              transform: `translateY(${dotE.y}px)`,
              background: "#161b22",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "20px 26px",
              userSelect: "none",
              width: 368,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.2)",
                marginBottom: 12,
              }}
            >
              DOT output · Graphviz
            </div>
            <pre
              style={{
                fontFamily: CODE_FONT,
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                lineHeight: 1.85,
              }}
            >
              {DOT_GRAPH}
            </pre>
          </div>
        </div>

        {/* Right: when to use */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Sequential */}
          <div
            style={{
              opacity: seqE.opacity,
              transform: `translateY(${seqE.y}px)`,
              background: "#161b22",
              border: "1px solid rgba(96,165,250,0.3)",
              borderLeft: "3px solid #60a5fa",
              borderRadius: 12,
              padding: "20px 26px",
              userSelect: "none",
              width: 368,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#60a5fa",
                marginBottom: 12,
              }}
            >
              Use Sequential when…
            </div>
            {SEQ_WHEN.map((item, i) => (
              <div
                key={i}
                style={{
                  opacity: interpolate(
                    localFrame,
                    [86 + i * 10, 98 + i * 10],
                    [0, 1],
                    cl
                  ),
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.65,
                  paddingLeft: 10,
                }}
              >
                · {item}
              </div>
            ))}
          </div>

          {/* DAG */}
          <div
            style={{
              opacity: dagE.opacity,
              transform: `translateY(${dagE.y}px)`,
              background: "#161b22",
              border: "1px solid rgba(167,139,250,0.3)",
              borderLeft: "3px solid #a78bfa",
              borderRadius: 12,
              padding: "20px 26px",
              userSelect: "none",
              width: 368,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#a78bfa",
                marginBottom: 12,
              }}
            >
              Use DAG when…
            </div>
            {DAG_WHEN.map((item, i) => (
              <div
                key={i}
                style={{
                  opacity: interpolate(
                    localFrame,
                    [108 + i * 10, 120 + i * 10],
                    [0, 1],
                    cl
                  ),
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.65,
                  paddingLeft: 10,
                }}
              >
                · {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE
// Act 1: 0   – 220  (opacity [0,20,200,220] → [0,1,1,0])
// Act 2: 200 – 420  (opacity [200,220,400,420])
// Act 3: 400 – 620  (opacity [400,420,600,620])
// Act 4: 600 – 800  (opacity [600,620] → [0,1]; FadeWrapper handles fade-out)
// Total: 800 frames (~26.7 s)
// ══════════════════════════════════════════════════════════════════════════════

export const WorkflowsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const act1Opacity = interpolate(frame, [0, 20, 200, 220], [0, 1, 1, 0], cl);
  const act2Opacity = interpolate(
    frame,
    [200, 220, 400, 420],
    [0, 1, 1, 0],
    cl
  );
  const act3Opacity = interpolate(
    frame,
    [400, 420, 600, 620],
    [0, 1, 1, 0],
    cl
  );
  const act4Opacity = interpolate(frame, [600, 620], [0, 1], cl);

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
          localFrame={Math.max(0, frame - 200)}
          fps={fps}
          opacity={act2Opacity}
        />
      )}
      {act3Opacity > 0 && (
        <Act3
          localFrame={Math.max(0, frame - 400)}
          fps={fps}
          opacity={act3Opacity}
        />
      )}
      {act4Opacity > 0 && (
        <Act4
          localFrame={Math.max(0, frame - 600)}
          fps={fps}
          opacity={act4Opacity}
        />
      )}
    </AbsoluteFill>
  );
};
