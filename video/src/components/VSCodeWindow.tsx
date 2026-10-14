import React from "react";

const CODE_FONT =
  "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

interface VSCodeWindowProps {
  lineCount: number;
  fontSize: number;
  lineHeight: number | string;
  gap: number;
  codePaddingV?: number;
  codePaddingH?: number;
  border?: string;
  borderRadius?: number;
  outerStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export const VSCodeWindow: React.FC<VSCodeWindowProps> = ({
  lineCount,
  fontSize,
  lineHeight,
  gap,
  codePaddingV = 26,
  codePaddingH = 32,
  border = "1px solid rgba(255,255,255,0.09)",
  borderRadius = 14,
  outerStyle,
  children,
}) => (
  <div
    style={{
      background: "#161b22",
      border,
      borderRadius,
      overflow: "hidden",
      ...outerStyle,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        background: "#1c2128",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "11px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28CA41" }} />
    </div>

    {/* Code area */}
    <div style={{ display: "flex" }}>
      {/* Line number gutter */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          paddingTop: codePaddingV,
          paddingBottom: codePaddingV,
          paddingLeft: 16,
          paddingRight: 16,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          userSelect: "none",
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            style={{
              fontSize,
              lineHeight,
              color: "rgba(255,255,255,0.2)",
              textAlign: "right",
              minWidth: 20,
              fontFamily: CODE_FONT,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          paddingTop: codePaddingV,
          paddingBottom: codePaddingV,
          paddingLeft: codePaddingH,
          paddingRight: codePaddingH,
          flex: 1,
          fontFamily: CODE_FONT,
          whiteSpace: "pre",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);
