import type { Metadata } from "next";
import { BackendCard } from "@/components/backend/backend-card";
import { Navigation } from "@/components/layout/navigation";
import { allBackends } from "contentlayer/generated";

export const metadata: Metadata = {
  title: "Backends – Apalis",
  description:
    "Run Apalis on the infrastructure you already have: Redis, PostgreSQL, SQLite, MySQL, AMQP, NATS, and PGMQ.",
};

export default function BackendsPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white pt-24 text-zinc-700 dark:bg-[#09090B] dark:text-zinc-300">
        <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
          <header className="mb-12">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Backends
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Apalis works with the infrastructure you already use. Choose a
              backend to learn how to configure it and start running your
              workers.
            </p>
          </header>

          <section>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Available backends
            </h2>

            <div className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-white/10 dark:border-white/10">
              {allBackends.map((backend) => (
                <BackendCard key={backend.urlPath} backend={backend} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
