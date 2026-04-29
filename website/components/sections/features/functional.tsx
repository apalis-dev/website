import { Code } from "@/components/layout/code"
import type React from "react"

const Functional: React.FC = () => {
  const themeVars = {
    "--fc-primary-color": "hsl(var(--primary))",
    "--fc-background-color": "hsl(var(--background))",
    "--fc-text-color": "hsl(var(--foreground))",
    "--fc-text-dark": "hsl(var(--primary-foreground))",
    "--fc-border-color": "hsl(var(--border))",
    "--fc-border-main": "hsl(var(--foreground) / 0.1)",
    "--fc-highlight-primary": "hsl(var(--primary) / 0.12)",
    "--fc-highlight-header": "hsl(var(--accent) / 0.2)",
  }

  return (
    <div
      style={
        {
          width: "100%",
          height: "100%",
          background: "transparent",
          ...themeVars,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Code review interface showing dependency injection ergonomics"
      className="p-5 font-thin text-xs"
    >
      <Code
        tabs={
          [
            {
              language: 'rust',
              name: "main.rs",
              content: `\
/// All these are valid handlers
async fn send_email(task: Email) {}
async fn send_email(task: Email) -> Result<(), MyError> {}
async fn send_email(task: Email, worker: WorkerContext) {}
async fn send_email(task: Email, worker: WorkerContext, data: Data<State>) {}
async fn send_email(task: Email, task_id: TaskId<Ulid>) {}
async fn send_email(task: Email, worker: WorkerContext) -> String {}
\
        `,
            }
          ]
        }
      />
    </div>
  )
}

export default Functional
