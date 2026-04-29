import React from "react";
import { VSCodeWindow } from "../components/VSCodeWindow";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Syntax token types ────────────────────────────────────────────────────────
type Token = { text: string; color: string; hl?: boolean };
type CodeLine = Token[];

const kw  = (t: string): Token => ({ text: t, color: "#c792ea" });          // keyword
const fn_ = (t: string): Token => ({ text: t, color: "#82aaff" });          // function
const ty  = (t: string): Token => ({ text: t, color: "#f78c6c" });          // type
const str = (t: string): Token => ({ text: t, color: "#c3e88d" });          // string
const cm  = (t: string): Token => ({ text: t, color: "rgba(255,255,255,0.28)" }); // comment
const op  = (t: string): Token => ({ text: t, color: "rgba(255,255,255,0.38)" }); // operator
const tx  = (t: string): Token => ({ text: t, color: "rgba(255,255,255,0.78)" }); // plain
const at_ = (t: string): Token => ({ text: t, color: "#f97316" });          // attribute/macro
const nb  = (t: string): Token => ({ text: t, color: "#f78c6c" });          // number

// ── Code snippets ─────────────────────────────────────────────────────────────

/** 1 – Simple Task Handler */
const S1: CodeLine[] = [
  [kw("struct"), tx(" Email "), op("{")],
  [tx("    to"), op(": "), ty("String"), op(",")],
  [tx("    subject"), op(": "), ty("String"), op(",")],
  [op("}")],
  [],
  [kw("async fn "), fn_("send_email"), op("("), tx("task"), op(": "), ty("Email"), op(") {")],
  [tx("    "), cm("// Do something")],
  [op("}")],
  [],
  [at_("#[tokio::main]")],
  [kw("async fn "), fn_("main"), op("() -> "), ty("Result"), op("<()> {")],
  [tx("    "), kw("let"), tx(" worker = "), ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"rango-tango"'), op(")")],
  [tx("        ."), fn_("backend"), op("(backend)")],
  [tx("        ."), fn_("build"), op("(send_email);")],
  [tx("    worker."), fn_("run"), op("().await?;")],
  [op("}")],
];

/** 2 – Robust Error Handling */
const S2: CodeLine[] = [
  [kw("async fn "), fn_("send_email"), op("("), tx("task"), op(": "), ty("Email"), op(") -> "), ty("Result"), op("<(), "), ty("MyError"), op("> {")],
  [tx("    "), ty("Ok"), op("(())")],
  [op("}")],
  [],
  [at_("#[tokio::main]")],
  [kw("async fn "), fn_("main"), op("() -> "), ty("Result"), op("<()> {")],
  [tx("    "), kw("let"), tx(" worker = "), ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"rango-tango"'), op(")")],
  [tx("        ."), fn_("backend"), op("(backend)")],
  [tx("        ."), fn_("retry"), op("(")],
  [tx("            "), ty("RetryPolicy"), op("::"), fn_("retries"), op("("), nb("3"), op(")")],
  [tx("                ."), fn_("with_backoff"), op("(backoff)")],
  [tx("                ."), fn_("retry_if"), op("(can_recover),")],
  [tx("        "), op(")")],
  [tx("        ."), fn_("build"), op("(send_email);")],
  [tx("    worker."), fn_("run"), op("().await?;")],
  [op("}")],
];

/** 3 – Graceful Shutdown */
const S3: CodeLine[] = [
  [at_("#[tokio::main]")],
  [kw("async fn "), fn_("main"), op("() -> "), ty("Result"), op("<()> {")],
  [tx("    "), kw("let"), tx(" worker = "), ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"rango-tango"'), op(")")],
  [tx("        ."), fn_("backend"), op("(backend)")],
  [tx("        ."), fn_("build"), op("(send_email);")],
  [tx("    "), ty("Monitor"), op("::"), fn_("new"), op("()")],
  [tx("        ."), fn_("register"), op("(|_| worker)")],
  [tx("        ."), fn_("shutdown_timeout"), op("("), ty("Duration"), op("::"), fn_("from_secs"), op("("), nb("30"), op("))")],
  [tx("        ."), fn_("run_with_signal"), op("("), fn_("ctrl_c"), op("())")],
  [tx("        .await?;")],
  [op("}")],
];

/** 4 – Telemetry & Observability */
const S4: CodeLine[] = [
  [at_("#[tokio::main]")],
  [kw("async fn "), fn_("main"), op("() -> "), ty("Result"), op("<()> {")],
  [tx("    "), kw("let"), tx(" worker = "), ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"rango-tango"'), op(")")],
  [tx("        ."), fn_("backend"), op("(backend)")],
  [tx("        ."), fn_("layer"), op("("), ty("PrometheusLayer"), op("::"), fn_("new"), op("())")],
  [tx("        ."), fn_("layer"), op("("), ty("TraceLayer"), op("::"), fn_("new"), op("())")],
  [tx("        ."), fn_("build"), op("(send_email);")],
  [tx("    worker."), fn_("run"), op("().await?;")],
  [op("}")],
];

/** 5 – Distributed & Controllable Execution */
const S5: CodeLine[] = [
  [at_("#[tokio::main]")],
  [kw("async fn "), fn_("main"), op("() -> "), ty("Result"), op("<()> {")],
  [tx("    "), kw("let"), tx(" workflow = "), ty("Workflow"), op("::"), fn_("new"), op("("), str('"product-image-workflow"'), op(")")],
  [tx("        ."), fn_("and_then"), op("(generate_thumbnail)")],
  [tx("        ."), fn_("and_then"), op("(extract_items)")],
  [tx("        ."), fn_("filter_map"), op("(classify_and_recognise)")],
  [tx("        ."), fn_("and_then"), op("(publish_to_website);")],
  [],
  [tx("    "), kw("let"), tx(" worker = "), ty("WorkerBuilder"), op("::"), fn_("new"), op("("), str('"rango-tango"'), op(")")],
  [tx("        ."), fn_("backend"), op("(backend)")],
  [tx("        ."), fn_("build"), op("(workflow);")],
  [tx("    worker."), fn_("run"), op("().await?;")],
  [op("}")],
];

// ── Snippet metadata ──────────────────────────────────────────────────────────

type Snippet = {
  label: string;
  title: string;
  color: string;
  lines: CodeLine[];
  // opacity window: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd]
  window: [number, number, number, number] | [number, number];
};

// Scene: 360 frames.  Each snippet gets ~64f peak, 11f cross-fade each side.
const SNIPPETS: Snippet[] = [
  { label: "01", title: "Simple Task Handler",            color: "#1d9e75", lines: S1, window: [15, 26, 90, 101] },
  { label: "02", title: "Robust Error Handling",          color: "#f87171", lines: S2, window: [90, 101, 165, 176] },
  { label: "03", title: "Graceful Shutdown",              color: "#60a5fa", lines: S3, window: [165, 176, 240, 251] },
  { label: "04", title: "Telemetry & Observability",      color: "#f97316", lines: S4, window: [240, 251, 310, 321] },
  { label: "05", title: "Distributed Execution",          color: "#a78bfa", lines: S5, window: [310, 321] },
];

// ── Render helpers ────────────────────────────────────────────────────────────

const cl = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

function snippetOpacity(frame: number, w: Snippet["window"]): number {
  if (w.length === 2) {
    return interpolate(frame, w, [0, 1], cl);
  }
  const [a, b, c, d] = w;
  return interpolate(frame, [a, b, c, d], [0, 1, 1, 0], cl);
}

function snippetY(frame: number, w: Snippet["window"]): number {
  const fadeInEnd = w[1];
  const fadeOutStart = w.length === 4 ? w[2] : Infinity;
  if (frame < fadeInEnd) {
    return interpolate(frame, [w[0], w[1]], [18, 0], cl);
  }
  if (frame > fadeOutStart) {
    return interpolate(frame, [w[2]!, w[3]!], [0, -18], cl);
  }
  return 0;
}

function renderLine(line: CodeLine, i: number) {
  if (line.length === 0) return <div key={i} style={{ height: "1.65em" }} />;
  return (
    <div key={i} style={{ lineHeight: "1.65em" }}>
      {line.map((tok, j) =>
        tok.hl ? (
          <span key={j} style={{ color: tok.color, background: "rgba(29,158,117,0.18)", borderRadius: 3, padding: "0 2px" }}>
            {tok.text}
          </span>
        ) : (
          <span key={j} style={{ color: tok.color }}>{tok.text}</span>
        )
      )}
    </div>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

export const IntroApalisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Wordmark
  const wordmarkScale = spring({
    fps,
    frame: Math.max(0, frame - 5),
    config: { damping: 14, stiffness: 100, mass: 0.5 },
    from: 0.4,
    to: 1,
  });
  const wordmarkOpacity = interpolate(frame, [5, 20], [0, 1], cl);

  // Tagline
  const taglineOpacity = interpolate(frame, [12, 26], [0, 1], cl);

  // Current active snippet index (for progress dots)
  const activeIdx =
    frame < 90  ? 0 :
    frame < 165 ? 1 :
    frame < 240 ? 2 :
    frame < 310 ? 3 : 4;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0d0d",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* ── Top: wordmark + tagline + progress dots ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 32 }}>

        {/* Wordmark */}
        <div style={{
          fontSize: 90,
          fontWeight: 800,
          color: "#1d9e75",
          letterSpacing: "-4px",
          transform: `scale(${wordmarkScale})`,
          opacity: wordmarkOpacity,
          display: "inline-block",
          lineHeight: 1,
          userSelect: "none",
        }}>
          Apalis
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 21,
          color: "rgba(255,255,255,0.45)",
          opacity: taglineOpacity,
          userSelect: "none",
          letterSpacing: "0.3px",
        }}>
          Process background tasks with confidence
        </div>

        {/* Progress dots */}
        <div style={{
          display: "flex",
          gap: 10,
          marginTop: 4,
          opacity: taglineOpacity,
        }}>
          {SNIPPETS.map((s, i) => (
            <div key={i} style={{
              width: i === activeIdx ? 28 : 10,
              height: 10,
              borderRadius: 5,
              background: i === activeIdx ? s.color : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* ── Code area: snippet title + code block ── */}
      <div style={{ position: "relative", width: 920 }}>
        {SNIPPETS.map((snippet, idx) => {
          const op = snippetOpacity(frame, snippet.window);
          if (op <= 0) return null;
          const y = snippetY(frame, snippet.window);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                opacity: op,
                transform: `translateY(${y}px)`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Snippet label + title */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                userSelect: "none",
              }}>
                <div style={{
                  background: `${snippet.color}22`,
                  border: `1px solid ${snippet.color}55`,
                  borderRadius: 8,
                  padding: "5px 14px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: snippet.color,
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  letterSpacing: "1px",
                }}>
                  {snippet.label}
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: snippet.color,
                  letterSpacing: "0.2px",
                }}>
                  {snippet.title}
                </div>
              </div>

              {/* Code block */}
              <VSCodeWindow
                lineCount={snippet.lines.length}
                fontSize={19}
                lineHeight="1.65em"
                gap={0}
                codePaddingV={28}
                codePaddingH={36}
                border={`1px solid ${snippet.color}50`}
              >
                {snippet.lines.map((line, i) => renderLine(line, i))}
              </VSCodeWindow>
            </div>
          );
        })}

        {/* Spacer to hold layout height (tallest snippet = 16 lines) */}
        <div style={{ visibility: "hidden" }}>
          <VSCodeWindow lineCount={16} fontSize={19} lineHeight="1.65em" gap={0} codePaddingV={28} codePaddingH={36}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ height: "1.65em" }}>{"x"}</div>
            ))}
          </VSCodeWindow>
        </div>
      </div>
    </AbsoluteFill>
  );
};
