import { Icon } from "@/components/icons";
import type React from "react";

interface MiddlewareProps {
  className?: string;
}

const Middleware: React.FC<MiddlewareProps> = ({ className = "" }) => {
  const layers = [
    {
      name: "Retries",
      icon: "/images/features/retry.svg",
    },
    {
      name: "Prometheus", icon: "/images/features/prometheus.svg",
      external: true,
    },
    {
      name: "Sentry",
      icon: "/images/features/sentry.svg",
      external: true,
    },
    { name: "Tracing", icon: "/images/features/tracing.svg" },
    {
      name: "CatchPanic",
      icon: "/images/features/panic.svg",
    },
    { name: "CircuitBreaker", icon: "/images/features/circuit.svg" },
  ];

  return (
    <div
      className={`w-full h-full flex items-center justify-center p-4 relative ${className}`}
      role="img"
      aria-label="Middleware component showcasing available layers"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, calc(-50% + 24px))",
          width: "345px",
          height: "277px",
          background:
            "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)",
          backdropFilter: "blur(16px)",
          borderRadius: "9.628px",
          border: "0.802px solid hsl(var(--border))",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Search Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12.837px",
              padding: "8.826px 12.837px",
              borderBottom: "0.802px solid hsl(var(--border))",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "14.442px",
                height: "14.442px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Icon
                name="search"
                className="w-full h-full text-muted-foreground"
              />
            </div>
            <span
              style={{
                fontFamily:
                  "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: "12.837px",
                lineHeight: "19.256px",
                color: "hsl(var(--muted-foreground))",
                fontWeight: 400,
                whiteSpace: "nowrap",
              }}
            >
              Search for Middleware
            </span>
          </div>
          {/* Integration List */}
          {layers.map((layers, index) => (
            <div
              key={layers.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8.826px 12.837px",
                borderBottom:
                  index < layers.length - 1
                    ? "0.479px solid hsl(var(--border))"
                    : "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12.837px",
                }}
              >
                <div
                  className="border border rounded-sm p-1"
                  style={{
                    width: "24px",
                    height: "24px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={layers.icon || "/placeholder.svg"}
                    alt={layers.name}
                    className="w-full h-full object-contain opacity-70 grayscale" // Apply opacity and grayscale
                  />
                </div>
                <span
                  style={{
                    fontFamily:
                      "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    fontSize: "12.837px",
                    lineHeight: "19.256px",
                    color: "hsl(var(--muted-foreground))",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {layers.name}
                </span>
              </div>
              {layers.external && (
                <div
                  style={{
                    background: "hsl(var(--primary) / 0.08)",
                    padding: "1.318px 5.272px",
                    borderRadius: "3.295px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontSize: "9.583px",
                      lineHeight: "15.333px",
                      color: "hsl(var(--primary))",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    External
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Middleware;
