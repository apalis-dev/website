import { ArrowsUpDownIcon } from "@/components/icons/arrows-up-down"
import { CheckIcon } from "@/components/icons/check"
import { FilePlusIcon } from "@/components/icons/file-plus"
import type React from "react"

interface WorkflowsProps {
  className?: string
}

const Workflows: React.FC<WorkflowsProps> = ({ className = "" }) => {
  const themeVars = {
    "--workflows-background-color": "hsl(var(--background))",
    "--workflows-background-glass": "hsl(var(--card) / 0.2)",
    "--workflows-background-gradient-start": "hsl(var(--card) / 0.2)",
    "--workflows-background-gradient-end": "transparent",
    "--workflows-text-primary": "hsl(var(--foreground))",
    "--workflows-text-secondary": "hsl(var(--muted-foreground))",
    "--workflows-border-color": "hsl(var(--border))",
    "--workflows-border-main": "hsl(var(--border))",
    "--workflows-shadow-color": "rgba(0, 0, 0, 0.12)", // Keeping as is, common shadow
    "--workflows-container-background": "hsl(var(--card) / 0.4)",
    "--workflows-container-gradient-start": "hsl(var(--card) / 0.4)",
    "--workflows-container-gradient-end": "transparent",
  }

  const CheckmarkIcon = () => (
    <svg
      width="13.885"
      height="13.885"
      viewBox="0 0 14 14"
      fill="none"
      style={{ width: "13.885px", height: "13.885px" }}
    >
      <path
        d="M3.85156 7.875L6.47656 10.5L10.8516 3.5"
        stroke="var(--workflows-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )

  const RefreshIcon = () => (
    <svg
      width="13.885"
      height="13.885"
      viewBox="0 0 14 14"
      fill="none"
      style={{ width: "13.885px", height: "13.885px" }}
    >
      <path
        d="M1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.8995 1.75 12.25 4.1005 12.25 7C12.25 9.8995 9.8995 12.25 7 12.25"
        stroke="var(--workflows-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path
        d="M4.375 10.5L1.75 12.25L3.5 9.625"
        stroke="var(--workflows-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )

  const SparklesIcon = () => (
    <svg
      width="13.885"
      height="13.885"
      viewBox="0 0 14 14"
      fill="none"
      style={{ width: "13.885px", height: "13.885px" }}
    >
      <path
        d="M7 1.75L8.225 5.775L12.25 7L8.225 8.225L7 12.25L5.775 8.225L1.75 7L5.775 5.775L7 1.75Z"
        stroke="var(--workflows-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  )

  const steps = [
    {
      icon: <SparklesIcon />,
      title: "Fetch unpaid users",
      workflow: "AndThen",
      node: "and_then(fetch_unpaid)",
    },
    {
      icon: <CheckIcon />,
      title: "Remove unsubscribed",
      workflow: "FilterMap",
      node: "filter_map(remove_unsubs)",
    },
    {
      icon: <FilePlusIcon />,
      title: "Generate report",
      workflow: "Fold",
      node: "fold(build_report)",
    },
    {
      icon: <ArrowsUpDownIcon />,
      title: "Email report",
      workflow: "AndThen",
      node: "and_then(email_report)",
    },
  ]

  return (
    <div
      className={className}
      style={
        {
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(180deg, var(--workflows-container-gradient-start) 0%, var(--workflows-container-gradient-end) 100%)`,
          backdropFilter: "blur(8.372px)",
          borderRadius: "10.047px",
          boxSizing: "border-box",
          flexShrink: 0,
          margin: "0 auto",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Parallel coding agents working on different tasks simultaneously"
    >
      {/* Inner content area with gradient background */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start", // Changed to flex-start for top alignment
          gap: "16px",
          padding: "20px",
          height: "100%",
          width: "calc(100% - 48px)", // Adjusted width for 24px margin on both sides
          background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, transparent 100%)", // Updated background property
          backdropFilter: "blur(16px)",
          borderRadius: "9.628px",
          border: "0.802px solid hsl(var(--border))",
          overflow: "hidden",
          boxSizing: "border-box",
          margin: "24px 24px 0 24px", // Updated margin to 24px on both sides
        }}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "8.658px",
              padding: "6.494px 8.658px",
              background: `linear-gradient(180deg, var(--workflows-background-gradient-start) 0%, var(--workflows-background-gradient-end) 100%)`,
              backdropFilter: "blur(19.481px)",
              borderRadius: "8.658px",
              boxShadow: `0px 1.082px 2.165px 0px var(--workflows-shadow-color)`,
              border: "0.541px solid var(--workflows-border-color)",
              width: "100%",
              maxWidth: "320px",
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* Icon container */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8.658px",
                padding: "3.247px 0 0 0",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "17.316px",
                  height: "17.316px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </div>
            </div>
            {/* Content container */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "2.164px",
                padding: "0",
                flexShrink: 0,
                ...(index === 1
                  ? {
                    flexBasis: 0,
                    flexGrow: 1,
                    minHeight: "1px",
                    minWidth: "1px",
                  }
                  : {}),
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "10.823px",
                  lineHeight: "17.316px",
                  color: "var(--workflows-text-primary)",
                  whiteSpace: "pre",
                  flexShrink: 0,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "10.823px",
                  lineHeight: "17.316px",
                  color: "var(--workflows-text-secondary)",
                  whiteSpace: index === 1 ? "nowrap" : "pre",
                  overflow: index === 1 ? "hidden" : "visible",
                  textOverflow: index === 1 ? "ellipsis" : "clip",
                  width: index === 1 ? "100%" : "auto",
                  minWidth: index === 1 ? "100%" : "auto",
                  flexShrink: 0,
                }}
              >
                {`${step.workflow} • ${step.node}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Workflows
