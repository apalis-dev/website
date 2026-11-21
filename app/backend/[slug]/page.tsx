import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allBackends } from "contentlayer/generated";

import { MDX } from "@/components/atoms/mdx";
import { BackendCard } from "@/components/backend/backend-card";
import { BackendIcon } from "@/components/backend/backend-icon";
import { Icon } from "@/components/icons";
import { Navigation } from "@/components/layout/navigation";

type BackendPageProps = {
  params: Promise<{ slug: string }>;
};

const slugFromPath = (urlPath: string) => urlPath.replace("/backend/", "");

const findBackend = (slug: string) =>
  allBackends.find((backend) => backend.urlPath === `/backend/${slug}`);

export const generateStaticParams = () =>
  allBackends.map((backend) => ({
    slug: slugFromPath(backend.urlPath),
  }));

export async function generateMetadata({
  params,
}: BackendPageProps): Promise<Metadata> {
  const { slug } = await params;
  const backend = findBackend(slug);

  if (!backend) return {};

  return {
    title: `${backend.title} backend – Apalis`,
    description: backend.description,
    openGraph: {
      title: `${backend.title} backend – Apalis`,
      description: backend.excerpt,
    },
  };
}

export default async function BackendPage({ params }: BackendPageProps) {
  const { slug } = await params;
  const backend = findBackend(slug);

  if (!backend) notFound();

  const related = allBackends
    .filter((item) => item.urlPath !== backend.urlPath)
    .slice(0, 3);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-white pt-16 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 sm:pt-20">
        {/* Hero */}
        <section className="relative isolate overflow-hidden border-b border-zinc-200 dark:border-white/[0.08]">
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-48 left-1/3 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br ${backend.accent} opacity-[0.12] blur-[100px]`}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#a1a1aa_0.7px,transparent_0.7px)] bg-[size:24px_24px] opacity-[0.15] dark:opacity-[0.08]"
          />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14 lg:px-10">
            <nav
              aria-label="Breadcrumb"
              className="mb-12 flex items-center gap-2 text-sm"
            >
              <Link
                href="/backend"
                className="text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white"
              >
                Backends
              </Link>

              <Icon name="chevron-right" className="h-3 w-3 text-zinc-400" />

              <span className="font-medium text-zinc-900 dark:text-zinc-200">
                {backend.title}
              </span>
            </nav>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-16">
              <div className="min-w-0">
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <div
                    className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${backend.accent} text-white shadow-lg shadow-black/10`}
                  >
                    <BackendIcon backend={backend} className="size-7" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                      Apalis backend
                    </span>

                    <span className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                      {backend.crate}
                    </span>
                  </div>
                </div>

                <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
                  {backend.title}
                </h1>

                <p className="mt-6 max-w-2xl text-xl leading-relaxed tracking-tight text-zinc-700 dark:text-zinc-200 sm:text-2xl">
                  {backend.excerpt}
                </p>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  {backend.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href={backend.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-br ${backend.accent} px-5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg`}
                  >
                    Read documentation
                    <Icon name="arrow-up-right-light" className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={backend.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.07]"
                  >
                    View source
                    <Icon name="arrow-up-right-light" className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-5">
                  <Link
                    href="/docs/guides/backend"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                  >
                    Read the backend guide
                    <Icon name="arrow-right" className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Backend specifications */}
              <aside className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025] lg:sticky lg:top-28">
                <div className="border-b border-zinc-200 px-5 py-4 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Specifications
                    </h2>

                    <span className="size-2 rounded-full bg-emerald-500" />
                  </div>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Backend overview
                  </p>
                </div>

                <dl className="divide-y divide-zinc-100 px-5 dark:divide-white/[0.06]">
                  {backend.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start justify-between gap-4 py-4"
                    >
                      <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                        {spec.label}
                      </dt>

                      <dd className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
                  <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                    {backend.crate}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 dark:border-white/[0.08]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
              {/* Section introduction */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Capabilities
                </p>

                <h2 className="mt-5 max-w-lg font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  Everything you need to run workers.
                </h2>

                <p className="mt-5 max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  The same Apalis guarantees you get everywhere else, delivered
                  through the infrastructure of your choice.
                </p>

                <div className="mt-8 hidden h-px w-16 bg-zinc-300 dark:bg-white/20 lg:block" />
              </div>

              {/* Feature list */}
              <div className="border-t border-zinc-200 dark:border-white/[0.1]">
                {backend.features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="group grid gap-4 border-b border-zinc-200 py-7 dark:border-white/[0.1] sm:grid-cols-[52px_1fr] sm:gap-6 sm:py-8"
                  >
                    <span className="pt-1 font-mono text-xs tabular-nums text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick start */}
        <section className="border-b border-zinc-200 dark:border-white/[0.08]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                Get started
              </p>

              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                Up and running in minutes.
              </h2>

              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Add the crate, connect to your {backend.title} instance, and
                start processing jobs with Apalis.
              </p>

              <ol className="mt-10 space-y-7">
                {[
                  {
                    title: "Install the crate",
                    description: `Add Apalis and ${backend.crate} to your dependencies.`,
                  },
                  {
                    title: "Connect your backend",
                    description:
                      "Create a storage instance using your existing connection.",
                  },
                  {
                    title: "Start a worker",
                    description:
                      "Push a task and start processing it with the Apalis worker API.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                      {index + 1}
                    </span>

                    <div className="pt-0.5">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {step.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-12">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Best suited for
                </h3>

                <ul className="mt-4 space-y-3">
                  {backend.bestFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-500"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Installation command */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-white/[0.1] dark:bg-[#0c0c0e]">
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-red-400/80" />
                    <span className="size-2.5 rounded-full bg-yellow-400/80" />
                    <span className="size-2.5 rounded-full bg-green-400/80" />
                  </div>

                  <span className="font-mono text-xs text-zinc-500">
                    Terminal
                  </span>

                  <span className="text-xs text-zinc-400">Installation</span>
                </div>

                <div className="p-5 sm:p-7">
                  <p className="mb-4 font-mono text-xs text-zinc-500">
                    # Install dependencies
                  </p>

                  <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                    <code>{backend.install}</code>
                  </pre>
                </div>

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
                  <p className="text-xs text-zinc-500">
                    Follow the documentation for complete setup instructions.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-zinc-500">
                  Need a working example?
                </span>

                <Link
                  href="#examples"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-500 dark:text-zinc-200 dark:hover:text-white"
                >
                  Explore examples
                  <Icon name="arrow-right" className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section
          id="examples"
          className="scroll-mt-24 border-b border-zinc-200 dark:border-white/[0.08]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                  Code examples
                </p>

                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  See it in action.
                </h2>

                <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  Examples from the {backend.crate} documentation. Refer to the
                  official docs for the latest version.
                </p>
              </div>

              <a
                href={backend.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Official documentation
                <Icon name="arrow-up-right-light" className="size-3.5" />
              </a>
            </div>

            <div className="mt-12 min-w-0 [&>div]:max-w-none">
              <MDX content={backend.body.code} />
            </div>
          </div>
        </section>

        {/* Related backends */}
        <section>
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                  Keep exploring
                </p>

                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  Other backends.
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Explore other ways to power your Apalis workers.
                </p>
              </div>

              <Link
                href="/backend"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                All backends
                <Icon name="arrow-right" className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BackendCard key={item.urlPath} backend={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
