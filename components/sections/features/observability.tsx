import type React from "react"

interface ObservabilityProps {
  /** Width of component – number (px) or any CSS size value */
  width?: number | string
  /** Height of component – number (px) or any CSS size value */
  height?: number | string
  /** Extra Tailwind / CSS classes for root element */
  className?: string
}

const Observability: React.FC<ObservabilityProps> = ({ width = "100%", height = "100%", className = "" }) => {
  /* ------------------------------------------------------------
   * Theme-based design tokens using global CSS variables
   * ---------------------------------------------------------- */
  const themeVars = {
    "--observe-primary-color": "hsl(var(--primary))",
    "--observe-background-color": "hsl(var(--background))",
    "--observe-text-color": "hsl(var(--foreground))",
    "--observe-text-secondary": "hsl(var(--muted-foreground))",
    "--observe-border-color": "hsl(var(--border))",
  } as React.CSSProperties

  const logLines = [
    "[16:37:25.637] Initializing email service...",
    "[16:37:25.638] Connecting to SMTP server (smtp.gmail.com:587)",
    "[16:37:25.653] Authenticating with credentials...",
    "[16:37:25.741] ✓ Successfully authenticated",
    "[16:37:25.979] Preparing email message...",
    '[16:37:29.945] Setting recipients: "user@example.com"',
    "[16:37:30.561] Subject: Project Update - Q1 2026",
    '[16:37:30.880] Attaching files: "report.pdf" (2.4 MB)...',
    "[16:37:30.914] Validating email content...",
    "[16:37:30.940] Encoding attachments",
    "[16:37:34.436] ✓ Attachment encoded successfully",
    '[16:37:34.436] Adding CC: "team@example.com"',
    "[16:37:37.265] Composing MIME message",
    "[16:37:39.076] Message size: 2.6 MB",
    "[16:37:39.137] ▶ Sending email...",
    "[16:37:41.439] ✓ Message accepted by server",
    "[16:37:53.979] ✓ Delivery confirmed",
    "[16:38:00.585] Message-ID: <abc123@mail.example.com>",
    "[16:38:01.099] Email sent successfully [35s]",
    "📧 Email delivered – Message sent!",
  ]

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 relative ${className}`}
      style={{
        width,
        height,
        position: "relative",
        background: "transparent",
        ...themeVars,
      }}
      role="img"
      aria-label="Telemetry console output with the tracing crate"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "340px",
          height: "239px",
          background: "linear-gradient(180deg, var(--observe-background-color) 0%, transparent 100%)",
          backdropFilter: "blur(7.907px)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "2px",
            borderRadius: "8px",
            background: "hsl(var(--foreground) / 0.08)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "8px",
            height: "100%",
            overflow: "hidden",
            fontFamily: "'Geist Mono', 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
            fontSize: "10px",
            lineHeight: "16px",
            color: "var(--observe-text-color)",
            whiteSpace: "pre",
          }}
        >
          {logLines.map((line, index) => (
            <p key={index} style={{ margin: 0 }}>
              {line}
            </p>
          ))}
        </div>

        {/* Inner border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "0.791px solid var(--observe-border-color)",
            borderRadius: "10px",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
}

export default Observability
