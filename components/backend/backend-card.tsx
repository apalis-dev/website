import Link from "next/link";
import type { Route } from "next";
import type { Backend } from "contentlayer/generated";
import { BackendBadge } from "./backend-badge";

export const BackendCard = ({ backend }: { backend: Backend }) => {
  return (
    <div className="py-4">
      <Link
        href={backend.urlPath as Route}
        className="group flex items-center gap-4"
      >
        <BackendBadge backend={backend} />

        <span className="min-w-0">
          <span className="font-medium text-zinc-900 underline-offset-4 group-hover:underline dark:text-zinc-100">
            {backend.title}
          </span>

          <span className="mt-1 block text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {backend.excerpt}
          </span>
        </span>
      </Link>
    </div>
  );
};
