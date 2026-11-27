import type { Backend } from "contentlayer/generated"
import { BackendIcon } from "./backend-icon"

export const BackendBadge = ({
  backend,
  size = "sm"
}: {
  backend: Backend
  size?: "sm" | "lg"
}) => {
  const large = size === "lg"

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-[9px] border border-border bg-gradient-to-b from-foreground/20 to-transparent text-[hsl(var(--primary))] shadow-sm backdrop-blur-[18px] ${
        large ? "h-14 w-14 p-1.5" : "h-10 w-10 p-1.5"
      }`}
    >
      <BackendIcon
        backend={backend}
        className={large ? "h-8 w-8" : "h-6 w-6"}
      />
    </span>
  )
}
