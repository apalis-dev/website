import Link from "next/link";
import type { Route } from "next";
import type { Backend } from "contentlayer/generated";
import { BackendIcon } from "./backend-icon";
import { Icon } from "../icons";

export const BackendCard = ({ backend }: { backend: Backend }) => {
  return (
    <Link
      href={backend.urlPath as Route}
      className="group flex items-center gap-5 border-b border-zinc-200 py-5 transition-colors first:border-t hover:border-zinc-400 dark:border-white/[0.08] dark:hover:border-white/20"
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${backend.accent} text-white`}
      >
        <BackendIcon backend={backend} className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
            {backend.title}
          </h3>

          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
            {backend.kind}
          </span>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {backend.excerpt}
        </p>
      </div>

      <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all group-hover:translate-x-1 group-hover:text-zinc-950 dark:text-zinc-500 dark:group-hover:text-white">
        <Icon name="arrow-right" className="size-4" />
      </span>
    </Link>
  );
};
