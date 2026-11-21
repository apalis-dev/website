import type { Metadata } from "next"
import { BackendCard } from "@/components/backend/backend-card"
import { Navigation } from "@/components/layout/navigation"
import { allBackends } from "contentlayer/generated"

export const metadata: Metadata = {
  title: "Backends – Apalis",
  description:
    "Run Apalis on the infrastructure you already have: Redis, PostgreSQL, SQLite, MySQL, AMQP, NATS, and PGMQ."
}

export default function BackendsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen w-full bg-white pt-16 text-zinc-700 dark:bg-[#09090B] dark:text-zinc-300 sm:pt-24">
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 opacity-10 blur-3xl"
          />
          <div className="relative mx-auto w-full max-w-screen-2xl px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-20 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
              Backends
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl text-black dark:text-white sm:text-5xl lg:text-6xl">
              Run Apalis on infrastructure you already trust.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Every backend implements the same Apalis traits, so your tasks,
              workers, and middleware stay the same when your queue does. Pick a
              database, a message broker, or a Postgres extension and get
              started.
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200 dark:border-white/10">
          <div className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allBackends.map((backend) => (
                <BackendCard key={backend.urlPath} backend={backend} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
