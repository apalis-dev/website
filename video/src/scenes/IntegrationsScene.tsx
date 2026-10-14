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
    y: interpolate(p, [0, 1], [20, 0]),
    scale: interpolate(p, [0, 1], [0.84, 1]),
  };
}

// ── Inline SVG logos ─────────────────────────────────────────────────────────

/** Tracing: flame-graph / span hierarchy (custom) */
const TracingLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="4" y="10" width="56" height="11" rx="5.5" fill="#5dcaa5" />
    <rect x="4" y="27" width="40" height="11" rx="5.5" fill="#5dcaa5" opacity="0.72" />
    <rect x="14" y="44" width="26" height="11" rx="5.5" fill="#5dcaa5" opacity="0.44" />
  </svg>
);

/** Sentry: official path, fill changed to white for dark bg */
const SentryLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 -14.5 256 256">
    <path
      fill="#ffffff"
      d="M148.367708,12.4025287 C144.036807,5.21480737 136.258026,0.820118864
        127.866362,0.820118864 C119.474697,0.820118864 111.695916,5.21480737
        107.365016,12.4025287 L73.6403017,70.165071 C126.066153,96.3390588
        160.689085,148.341727 164.615024,206.806542 L140.93597,206.806542
        C137.017513,156.694333 106.874845,112.396698 61.6982677,90.3588968
        L30.4849684,144.32869 C55.8497707,155.704426 73.6778379,179.211206
        77.7918243,206.704035 L23.4120041,206.704035 C22.1018479,206.611361
        20.9266153,205.864669 20.2861278,204.71799 C19.6456403,203.571311
        19.6261529,202.179068 20.2342955,201.014912 L35.3027847,175.388229
        C30.1976229,171.128798 24.3630321,167.829476 18.0816541,165.65009
        L3.16692493,191.276772 C0.0305635285,196.656417 -0.818661742,203.068719
        0.809210488,209.079324 C2.43708272,215.08993 6.40620885,220.197261
        11.8287436,223.258872 C15.3657216,225.251729 19.3523095,226.310116
        23.4120041,226.334074 L97.8831433,226.334074 C100.696274,191.620878
        85.1423372,157.966047 56.8804514,137.614499 L68.7199787,117.113153
        C104.398813,141.618242 124.473737,183.151896 121.510945,226.334074
        L184.603837,226.334074 C187.593899,160.904124 155.557278,98.8221906
        100.497065,63.3483734 L124.432386,22.3456815 C125.542508,20.4856859
        127.944329,19.8680747 129.81399,20.9618406 C132.530418,22.4481882
        233.807067,199.169791 235.703442,201.219925 C236.383476,202.439289
        236.358897,203.929352 235.639016,205.125624 C234.919136,206.321896
        233.614065,207.041397 232.218213,207.011555 L207.821611,207.011555
        C208.129131,213.537817 208.129131,220.046994 207.821611,226.539592
        L232.32072,226.539592 C238.604421,226.580218 244.643414,224.105731
        249.091568,219.667205 C253.539722,215.228679 256.027289,209.195062
        256,202.911286 C256.002825,198.802186 254.905596,194.767215
        252.822066,191.225519 L148.367708,12.4025287 Z"
    />
  </svg>
);

/** Prometheus: official path */
const PrometheusLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-0.5 0 257 257">
    <path
      fill="#e6522c"
      d="M128.001129,0.667 C57.3110392,0.667 0,57.9712627 0,128.663612
        C0,199.353702 57.3110392,256.662482 128.001129,256.662482
        C198.69122,256.662482 256,199.353702 256,128.663612
        C256,57.9712627 198.688961,0.667 128.001129,0.667 Z
        M128.001129,240.227234 C107.888506,240.227234 91.5820105,226.791712
        91.5820105,210.223193 L164.420248,210.223193 C164.420248,226.789453
        148.113753,240.227234 128.001129,240.227234 Z
        M188.153777,200.286599 L67.8417054,200.286599 L67.8417054,178.470817
        L188.156036,178.470817 L188.156036,200.286599 Z
        M187.72234,167.242172 L68.1850476,167.242172
        C67.7874935,166.78363 67.3809041,166.331864 66.9969029,165.866545
        C54.6817608,150.913089 51.7814229,143.106572 48.9646617,135.150972
        C48.9172262,134.888948 63.8977879,138.211687 74.5210662,140.601529
        C74.5210662,140.601529 79.9874353,141.866474 87.9791764,143.32342
        C80.3059303,134.328758 75.7498699,122.894559 75.7498699,111.207372
        C75.7498699,85.5493202 95.4287983,63.1281719 88.3292951,45.0055775
        C95.2390566,45.5680262 102.629949,59.5885851 103.12915,81.5105319
        C110.474866,71.3593491 113.549134,52.8211299 113.549134,41.4546964
        C113.549134,29.6861912 121.303698,16.015751 129.060521,15.5481732
        C122.146242,26.9439714 130.851773,36.7134119 138.590525,60.9484008
        C141.493122,70.0514864 141.122674,85.3708727 143.363433,95.0861012
        C144.106589,74.9079713 147.576152,45.4663788 160.376942,35.301643
        C154.729867,48.1024336 161.212709,64.1197984 165.646793,71.8201505
        C172.800508,84.2437164 177.137462,93.6562617 177.137462,111.458102
        C177.137462,123.393761 172.730485,134.631441 165.296674,143.416032
        C173.749217,141.830333 179.586034,140.400493 179.586034,140.400493
        L207.035338,135.044807
        C207.037597,135.042548 203.048503,151.446173 187.72234,167.242172 Z"
    />
  </svg>
);

/** OpenTelemetry: official two-path logo */
const OtelLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 128 128">
    <path
      fill="#f5a800"
      d="M67.648 69.797c-5.246 5.25-5.246 13.758 0 19.008 5.25 5.246 13.758
        5.246 19.004 0 5.25-5.25 5.25-13.758 0-19.008-5.246-5.246-13.754-5.246-19.004
        0Zm14.207 14.219a6.649 6.649 0 0 1-9.41 0 6.65 6.65 0 0 1 0-9.407 6.649 6.649
        0 0 1 9.41 0c2.598 2.586 2.598 6.809 0 9.407ZM86.43 3.672l-8.235 8.234a4.17
        4.17 0 0 0 0 5.875l32.149 32.149a4.17 4.17 0 0 0 5.875 0l8.234-8.235c1.61-1.61
        1.61-4.261 0-5.87L92.29 3.671a4.159 4.159 0 0 0-5.86 0ZM28.738
        108.895a3.763 3.763 0 0 0 0-5.31l-4.183-4.187a3.768 3.768 0 0
        0-5.313 0l-8.644 8.649-.016.012-2.371-2.375c-1.313-1.313-3.45-1.313-4.75
        0-1.313 1.312-1.313 3.449 0 4.75l14.246 14.242a3.353 3.353 0 0 0 4.746
        0c1.3-1.313 1.313-3.45 0-4.746l-2.375-2.375.016-.012Zm0 0"
    />
    <path
      fill="#425cc7"
      d="M72.297 27.313 54.004 45.605c-1.625 1.625-1.625 4.301 0
        5.926L65.3 62.824c7.984-5.746 19.18-5.035 26.363 2.153l9.148-9.149c1.622-1.625
        1.622-4.297 0-5.922L78.22 27.313a4.185 4.185 0 0 0-5.922 0ZM60.55
        67.585l-6.672-6.672c-1.563-1.562-4.125-1.562-5.684 0l-23.53 23.54a4.036
        4.036 0 0 0 0 5.687l13.331 13.332a4.036 4.036 0 0 0 5.688 0l15.132-15.157c-3.199-6.609-2.625-14.593
        1.735-20.73Zm0 0"
    />
  </svg>
);

// ── Shared: act header ────────────────────────────────────────────────────────
const ActHeader: React.FC<{
  eyebrow: string;
  headline: React.ReactNode;
  localFrame: number;
  fps: number;
}> = ({ eyebrow, headline, localFrame, fps }) => {
  const ey = interpolate(localFrame, [0, 12], [0, 1], cl);
  const e = ent(localFrame, 8, fps);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ opacity: ey, textTransform: "uppercase", letterSpacing: "4px", color: "rgba(255,255,255,0.35)", fontSize: 16, fontWeight: 600, userSelect: "none" }}>
        {eyebrow}
      </div>
      <div style={{ opacity: e.opacity, transform: `translateY(${e.y}px)`, fontSize: 52, fontWeight: 800, textAlign: "center", lineHeight: 1.2, letterSpacing: "-1px", userSelect: "none" }}>
        {headline}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ACT 1 — Hub overview  (localFrame = frame, peak 10–100)
// ══════════════════════════════════════════════════════════════════════════════

// Positions in 1920×1080 space
const HUB_CX = 960;
const HUB_CY = 620;
const HUB_NODE_HALF_W = 70;  // node box half-width
const HUB_NODE_HALF_H = 78;  // node box half-height (logo + label)
const HUB_CENTER_HALF_W = 90;
const HUB_CENTER_HALF_H = 44;

type HubNodeData = {
  id: string;
  label: string;
  logo: React.ReactNode;
  color: string;
  x: number;
  y: number;
  startLocal: number;
};

const HUB_NODES: HubNodeData[] = [
  { id: "tracing",    label: "Tracing",        logo: <TracingLogo size={72} />,    color: "#5dcaa5", x: HUB_CX,       y: HUB_CY - 290, startLocal: 45 },
  { id: "sentry",     label: "Sentry",          logo: <SentryLogo size={72} />,     color: "#e0d7f5", x: HUB_CX + 320, y: HUB_CY,       startLocal: 52 },
  { id: "prometheus", label: "Prometheus",      logo: <PrometheusLogo size={72} />, color: "#e6522c", x: HUB_CX,       y: HUB_CY + 290, startLocal: 59 },
  { id: "otel",       label: "OpenTelemetry",   logo: <OtelLogo size={72} />,       color: "#f5a800", x: HUB_CX - 320, y: HUB_CY,       startLocal: 66 },
];

// Compute line endpoints (center box edge → node box edge)
function lineEndpoints(node: HubNodeData): [number, number, number, number] {
  const dx = node.x - HUB_CX;
  const dy = node.y - HUB_CY;
  // from center edge
  const cx = HUB_CX + Math.sign(dx) * HUB_CENTER_HALF_W;
  const cy = HUB_CY + Math.sign(dy) * HUB_CENTER_HALF_H;
  // to node edge
  const nx = node.x - Math.sign(dx) * HUB_NODE_HALF_W;
  const ny = node.y - Math.sign(dy) * HUB_NODE_HALF_H;
  return [cx, cy, nx, ny];
}

function lineLength(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const Act1: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame, fps, opacity,
}) => {
  const centerE = ent(localFrame, 26, fps);
  const taglineOpacity = interpolate(localFrame, [78, 90], [0, 1], cl);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "#0d0d0d" }}>
      {/* Eyebrow + headline (top center) */}
      <div style={{ position: "absolute", top: 80, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ opacity: interpolate(localFrame, [0, 12], [0, 1], cl), textTransform: "uppercase", letterSpacing: "4px", color: "rgba(255,255,255,0.35)", fontSize: 16, fontWeight: 600, userSelect: "none" }}>
          Integrations
        </div>
        <div style={{ opacity: ent(localFrame, 8, fps).opacity, transform: `translateY(${ent(localFrame, 8, fps).y}px)`, fontSize: 52, fontWeight: 800, textAlign: "center", lineHeight: 1.2, letterSpacing: "-1px", userSelect: "none" }}>
          <span style={{ color: "#ffffff" }}>Observe </span>
          <span style={{ color: "#1d9e75" }}>everything.</span>
        </div>
      </div>

      {/* SVG overlay for connecting lines */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1920 1080"
      >
        {HUB_NODES.map((node) => {
          const [x1, y1, x2, y2] = lineEndpoints(node);
          const len = lineLength(x1, y1, x2, y2);
          const lineStart = node.startLocal - 10;
          const progress = interpolate(localFrame, [lineStart, lineStart + 22], [0, 1], cl);
          const dashOffset = len * (1 - progress);
          const arrowOpacity = interpolate(localFrame, [node.startLocal + 4, node.startLocal + 14], [0, 1], cl);
          // Arrow direction (normalized)
          const adx = (x2 - x1) / len;
          const ady = (y2 - y1) / len;
          const ax = x2, ay = y2;
          const bx = ax - adx * 12 + ady * 6, by = ay - ady * 12 - adx * 6;
          const cx2 = ax - adx * 12 - ady * 6, cy2 = ay - ady * 12 + adx * 6;
          return (
            <g key={node.id}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={node.color}
                strokeWidth={1.8}
                strokeDasharray={len}
                strokeDashoffset={dashOffset}
                opacity={0.55}
              />
              <polygon
                points={`${ax},${ay} ${bx},${by} ${cx2},${cy2}`}
                fill={node.color}
                opacity={arrowOpacity * 0.8}
              />
            </g>
          );
        })}
      </svg>

      {/* Center Apalis node */}
      <div style={{
        position: "absolute",
        left: HUB_CX - HUB_CENTER_HALF_W,
        top: HUB_CY - HUB_CENTER_HALF_H,
        width: HUB_CENTER_HALF_W * 2,
        height: HUB_CENTER_HALF_H * 2,
        opacity: centerE.opacity,
        transform: `scale(${centerE.scale})`,
        border: "1.5px solid rgba(29,158,117,0.7)",
        borderRadius: 16,
        background: "rgba(29,158,117,0.1)",
        boxShadow: "0 0 36px rgba(29,158,117,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#1d9e75", letterSpacing: "-0.5px" }}>
          apalis
        </span>
      </div>

      {/* Integration nodes */}
      {HUB_NODES.map((node) => {
        const e = ent(localFrame, node.startLocal, fps);
        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: node.x - HUB_NODE_HALF_W,
              top: node.y - HUB_NODE_HALF_H,
              width: HUB_NODE_HALF_W * 2,
              height: HUB_NODE_HALF_H * 2,
              opacity: e.opacity,
              transform: `scale(${e.scale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#161b22",
              border: `1px solid ${node.color}40`,
              borderRadius: 16,
              userSelect: "none",
            }}
          >
            {node.logo}
            <div style={{ fontSize: 13, fontWeight: 700, color: node.color, textAlign: "center", letterSpacing: "0.2px" }}>
              {node.label}
            </div>
          </div>
        );
      })}

      {/* Tagline */}
      <div style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: taglineOpacity,
        fontSize: 19,
        color: "rgba(255,255,255,0.3)",
        fontStyle: "italic",
        userSelect: "none",
      }}>
        Composable Tower middleware layers — add what you need.
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// Acts 2–5 — Integration detail pages
// ══════════════════════════════════════════════════════════════════════════════

type Token = { text: string; color: string };
type SnippetLineData = { tokens: Token[]; startLocal: number };

const SnippetLine: React.FC<SnippetLineData & { localFrame: number; fps: number }> = ({
  tokens, startLocal, localFrame, fps,
}) => {
  const e = ent(localFrame, startLocal, fps);
  return (
    <div style={{ opacity: e.opacity, transform: `translateX(${interpolate(e.opacity, [0, 1], [-12, 0])})`, fontFamily: CODE_FONT, fontSize: 21, lineHeight: 1, userSelect: "none", display: "flex", flexWrap: "nowrap" }}>
      {tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)}
    </div>
  );
};

type CapturePill = { label: string; color: string; startLocal: number };

const Pill: React.FC<CapturePill & { localFrame: number; fps: number }> = ({
  label, color, startLocal, localFrame, fps,
}) => {
  const e = ent(localFrame, startLocal, fps);
  return (
    <div style={{ opacity: e.opacity, transform: `scale(${e.scale})`, background: `${color}18`, border: `1px solid ${color}50`, borderRadius: 9, padding: "6px 16px", fontSize: 15, fontWeight: 600, color, userSelect: "none", whiteSpace: "nowrap" }}>
      {label}
    </div>
  );
};

// ── Helper to build a WorkerBuilder snippet ───────────────────────────────────
type LayerLine = { tokens: Token[] };

function builderSnippet(layers: LayerLine[]): SnippetLineData[] {
  const op = (t: string): Token => ({ text: t, color: "rgba(255,255,255,0.32)" });
  const ty = (t: string): Token => ({ text: t, color: "#60a5fa" });
  const fn_ = (t: string): Token => ({ text: t, color: "#1d9e75" });
  const str = (t: string): Token => ({ text: t, color: "#f97316" });
  const plain = (t: string): Token => ({ text: t, color: "rgba(255,255,255,0.75)" });

  const lines: SnippetLineData[] = [
    { tokens: [ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"worker"'), op(")")], startLocal: 22 },
    { tokens: [plain("    ."), fn_("backend"), op("("), plain("backend"), op(")")], startLocal: 34 },
    ...layers.map((l, i) => ({ tokens: l.tokens, startLocal: 46 + i * 13 })),
    { tokens: [plain("    ."), fn_("build"), op("("), plain("handler"), op(")")], startLocal: 46 + layers.length * 13 },
  ];
  return lines;
}

// ── ACT 2 — Tracing ──────────────────────────────────────────────────────────

const TRACING_LINES = builderSnippet([
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "TraceLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "new", color: "#1d9e75" },
    { text: "()", color: "rgba(255,255,255,0.32)" },
  ]},
  { tokens: [
    { text: "        .make_span_with(", color: "rgba(255,255,255,0.32)" },
    { text: "ContextualTaskSpan", color: "#a78bfa" },
    { text: "::new()))", color: "rgba(255,255,255,0.32)" },
  ]},
]);

const TRACING_PILLS: CapturePill[] = [
  { label: "task_id",        color: "#5dcaa5", startLocal: 70 },
  { label: "attempt",        color: "#5dcaa5", startLocal: 82 },
  { label: "queue_name",     color: "#5dcaa5", startLocal: 94 },
  { label: "W3C TraceContext", color: "#60a5fa", startLocal: 106 },
];

const Act2: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame, fps, opacity,
}) => (
  <IntegrationAct
    opacity={opacity} localFrame={localFrame} fps={fps}
    logo={<TracingLogo size={52} />} color="#5dcaa5"
    eyebrow="Tracing" headline={<><span style={{ color: "#fff" }}>Structured spans </span><span style={{ color: "#5dcaa5" }}>for every task.</span></>}
    snippetLines={TRACING_LINES}
    pills={TRACING_PILLS}
    pillsLabel="Span fields"
  />
);

// ── ACT 3 — Sentry ───────────────────────────────────────────────────────────

const SENTRY_LINES = builderSnippet([
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "NewSentryLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "new_from_top", color: "#1d9e75" },
    { text: "())", color: "rgba(255,255,255,0.32)" },
  ]},
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "SentryLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "new", color: "#1d9e75" },
    { text: "())", color: "rgba(255,255,255,0.32)" },
  ]},
]);

const SENTRY_PILLS: CapturePill[] = [
  { label: "errors",         color: "#e0d7f5", startLocal: 78 },
  { label: "performance",    color: "#e0d7f5", startLocal: 90 },
  { label: "transactions",   color: "#e0d7f5", startLocal: 102 },
];

const Act3: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame, fps, opacity,
}) => (
  <IntegrationAct
    opacity={opacity} localFrame={localFrame} fps={fps}
    logo={<SentryLogo size={52} />} color="#e0d7f5"
    eyebrow="Sentry" headline={<><span style={{ color: "#fff" }}>Real-time </span><span style={{ color: "#e0d7f5" }}>error tracking.</span></>}
    snippetLines={SENTRY_LINES}
    pills={SENTRY_PILLS}
    pillsLabel="Captures"
  />
);

// ── ACT 4 — OpenTelemetry ─────────────────────────────────────────────────────

const OTEL_LINES = builderSnippet([
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "OpenTelemetryMetricsLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "default", color: "#1d9e75" },
    { text: "())", color: "rgba(255,255,255,0.32)" },
  ]},
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "TraceLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "new", color: "#1d9e75" },
    { text: "()", color: "rgba(255,255,255,0.32)" },
  ]},
  { tokens: [
    { text: "        .make_span_with(", color: "rgba(255,255,255,0.32)" },
    { text: "ContextualTaskSpan", color: "#a78bfa" },
    { text: "::new()))", color: "rgba(255,255,255,0.32)" },
  ]},
]);

const OTEL_PILLS: CapturePill[] = [
  { label: "consumed.messages",  color: "#f5a800", startLocal: 86 },
  { label: "process.duration",   color: "#425cc7", startLocal: 100 },
];

const Act4: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame, fps, opacity,
}) => (
  <IntegrationAct
    opacity={opacity} localFrame={localFrame} fps={fps}
    logo={<OtelLogo size={52} />} color="#f5a800"
    eyebrow="OpenTelemetry" headline={<><span style={{ color: "#fff" }}>Metrics </span><span style={{ color: "#f5a800" }}>and distributed traces.</span></>}
    snippetLines={OTEL_LINES}
    pills={OTEL_PILLS}
    pillsLabel="OTel instruments"
  />
);

// ── ACT 5 — Prometheus ────────────────────────────────────────────────────────

const PROMETHEUS_LINES = builderSnippet([
  { tokens: [
    { text: "    .", color: "rgba(255,255,255,0.75)" },
    { text: "layer", color: "rgba(255,255,255,0.75)" },
    { text: "(", color: "rgba(255,255,255,0.32)" },
    { text: "PrometheusLayer", color: "#60a5fa" },
    { text: "::", color: "rgba(255,255,255,0.32)" },
    { text: "default", color: "#1d9e75" },
    { text: "())", color: "rgba(255,255,255,0.32)" },
  ]},
]);

const PROMETHEUS_PILLS: CapturePill[] = [
  { label: "tasks_total",             color: "#e6522c", startLocal: 64 },
  { label: "task_duration_seconds",   color: "#e6522c", startLocal: 76 },
  { label: "worker · queue · status", color: "rgba(230,82,44,0.7)", startLocal: 88 },
];

const Act5: React.FC<{ localFrame: number; fps: number; opacity: number }> = ({
  localFrame, fps, opacity,
}) => (
  <IntegrationAct
    opacity={opacity} localFrame={localFrame} fps={fps}
    logo={<PrometheusLogo size={52} />} color="#e6522c"
    eyebrow="Prometheus" headline={<><span style={{ color: "#fff" }}>Scrape-ready </span><span style={{ color: "#e6522c" }}>task metrics.</span></>}
    snippetLines={PROMETHEUS_LINES}
    pills={PROMETHEUS_PILLS}
    pillsLabel="Recorded metrics"
  />
);

// ── Shared integration detail layout ─────────────────────────────────────────
const IntegrationAct: React.FC<{
  opacity: number;
  localFrame: number;
  fps: number;
  logo: React.ReactNode;
  color: string;
  eyebrow: string;
  headline: React.ReactNode;
  snippetLines: SnippetLineData[];
  pills: CapturePill[];
  pillsLabel: string;
}> = ({
  opacity, localFrame, fps, logo, color, eyebrow, headline,
  snippetLines, pills, pillsLabel,
}) => {
  const cardE = ent(localFrame, 18, fps);
  const pillLabelOpacity = interpolate(localFrame, [60, 70], [0, 1], cl);

  return (
    <AbsoluteFill style={{
      opacity,
      backgroundColor: "#0d0d0d",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: 32,
    }}>
      {/* Logo + header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ opacity: interpolate(localFrame, [0, 14], [0, 1], cl), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {logo}
          <div style={{ textTransform: "uppercase", letterSpacing: "4px", color: "rgba(255,255,255,0.35)", fontSize: 15, fontWeight: 600, userSelect: "none" }}>
            {eyebrow}
          </div>
        </div>
        <div style={{
          ...(() => { const e2 = ent(localFrame, 10, fps); return { opacity: e2.opacity, transform: `translateY(${e2.y}px)` }; })(),
          fontSize: 48,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-1px",
          userSelect: "none",
        }}>
          {headline}
        </div>
      </div>

      {/* Code card */}
      <VSCodeWindow
        lineCount={snippetLines.length}
        fontSize={21}
        lineHeight={1}
        gap={13}
        codePaddingV={26}
        codePaddingH={38}
        borderRadius={16}
        border={`1px solid ${color}28`}
        outerStyle={{ opacity: cardE.opacity, transform: `translateY(${cardE.y}px)` }}
      >
        {snippetLines.map((line, i) => (
          <SnippetLine key={i} {...line} localFrame={localFrame} fps={fps} />
        ))}
      </VSCodeWindow>

      {/* Capture pills */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ opacity: pillLabelOpacity, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "3px", color: "rgba(255,255,255,0.22)", userSelect: "none" }}>
          {pillsLabel}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {pills.map((p) => (
            <Pill key={p.label} {...p} localFrame={localFrame} fps={fps} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCENE
// Each act: 176 frames, 16-frame crossfades → 144 frames of full reading time
//   Act 1: 0   – 176  (opacity [0,16,160,176])   hub flowchart
//   Act 2: 160 – 336  (opacity [160,176,320,336]) tracing
//   Act 3: 320 – 496  (opacity [320,336,480,496]) sentry
//   Act 4: 480 – 656  (opacity [480,496,640,656]) opentelemetry
//   Act 5: 640 – 800  (opacity [640,656] → [0,1]; FadeWrapper handles end)
// Total: 800 frames (~26.7 s)
// ══════════════════════════════════════════════════════════════════════════════

export const IntegrationsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const act1Opacity = interpolate(frame, [0, 16, 160, 176], [0, 1, 1, 0], cl);
  const act2Opacity = interpolate(frame, [160, 176, 320, 336], [0, 1, 1, 0], cl);
  const act3Opacity = interpolate(frame, [320, 336, 480, 496], [0, 1, 1, 0], cl);
  const act4Opacity = interpolate(frame, [480, 496, 640, 656], [0, 1, 1, 0], cl);
  const act5Opacity = interpolate(frame, [640, 656], [0, 1], cl);

  return (
    <AbsoluteFill style={{
      backgroundColor: "#0d0d0d",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    }}>
      {act1Opacity > 0 && <Act1 localFrame={frame}                   fps={fps} opacity={act1Opacity} />}
      {act2Opacity > 0 && <Act2 localFrame={Math.max(0, frame - 160)} fps={fps} opacity={act2Opacity} />}
      {act3Opacity > 0 && <Act3 localFrame={Math.max(0, frame - 320)} fps={fps} opacity={act3Opacity} />}
      {act4Opacity > 0 && <Act4 localFrame={Math.max(0, frame - 480)} fps={fps} opacity={act4Opacity} />}
      {act5Opacity > 0 && <Act5 localFrame={Math.max(0, frame - 640)} fps={fps} opacity={act5Opacity} />}
    </AbsoluteFill>
  );
};
