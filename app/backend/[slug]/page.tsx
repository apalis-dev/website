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

      <main className="min-h-screen bg-white pt-20 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100">
        <div className="mx-auto max-w-4xl px-5 pb-24 sm:px-8">
          {/* Header */}
          <header className="border-b border-zinc-200 pb-10 dark:border-white/[0.1]">
            <nav
              aria-label="Breadcrumb"
              className="mb-10 flex items-center gap-2 text-sm"
            >
              <Link
                href="/backend"
                className="text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                Backends
              </Link>

              <span className="text-zinc-300 dark:text-zinc-700">/</span>

              <span className="text-zinc-900 dark:text-zinc-200">
                {backend.title}
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04]">
                <BackendIcon backend={backend} className="size-5" />
              </div>

              <div>
                <p className="text-xs text-zinc-500">Apalis backend</p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  {backend.crate}
                </p>
              </div>
            </div>

            <h1 className="mt-7 font-display text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
              {backend.title}
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {backend.excerpt}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              {backend.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <a
                href={backend.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 underline underline-offset-4 decoration-zinc-300 transition-colors hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:hover:decoration-white"
              >
                Documentation
                <Icon
                  name="arrow-up-right-light"
                  className="ml-1 inline size-3"
                />
              </a>

              <a
                href={backend.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Source code
                <Icon
                  name="arrow-up-right-light"
                  className="ml-1 inline size-3"
                />
              </a>

              <Link
                href="/docs/guides/backend"
                className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Backend guide
                <Icon name="arrow-right" className="ml-1 inline size-3" />
              </Link>
            </div>

            {/* Specifications */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-zinc-200 pt-6 dark:border-white/[0.1] sm:grid-cols-3">
              {backend.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-zinc-500">{spec.label}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          {/* Features */}
          <section className="border-b border-zinc-200 py-12 dark:border-white/[0.1]">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Capabilities
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              The same Apalis guarantees you get everywhere else, delivered
              through the infrastructure of your choice.
            </p>

            <ul className="mt-8 divide-y divide-zinc-200 dark:divide-white/[0.08]">
              {backend.features.map((feature) => (
                <li key={feature.title} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Quick start */}
          <section className="border-b border-zinc-200 py-12 dark:border-white/[0.1]">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Getting started
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Add the crate, connect to your {backend.title} instance, and start
              processing jobs with Apalis.
            </p>

            <ol className="mt-7 list-decimal space-y-5 pl-5 marker:text-zinc-400">
              <li className="pl-2">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
                  Install the crate
                </h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Add Apalis and {backend.crate} to your dependencies.
                </p>
              </li>

              <li className="pl-2">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
                  Connect your backend
                </h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Create a storage instance using your existing connection.
                </p>
              </li>

              <li className="pl-2">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white">
                  Start a worker
                </h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Push a task and start processing it with the Apalis worker
                  API.
                </p>
              </li>
            </ol>

            <h3 className="mt-9 text-sm font-semibold text-zinc-900 dark:text-white">
              Best suited for
            </h3>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 marker:text-zinc-400 dark:text-zinc-400">
              {backend.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-white">
                Install dependencies
              </p>

              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm leading-7 text-zinc-800 dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-zinc-200">
                <code>{backend.install}</code>
              </pre>

              <p className="mt-3 text-xs text-zinc-500">
                Refer to the official documentation for complete setup
                instructions.
              </p>
            </div>
          </section>

          {/* Examples */}
          <section
            id="examples"
            className="scroll-mt-24 border-b border-zinc-200 py-12 dark:border-white/[0.1]"
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Examples
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Examples from the {backend.crate} documentation. Refer to the{" "}
              <a
                href={backend.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-900 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:hover:decoration-white"
              >
                official documentation
              </a>{" "}
              for the latest version.
            </p>

            <div className="mt-8 min-w-0 [&>div]:max-w-none">
              <MDX content={backend.body.code} />
            </div>
          </section>

          {/* Related backends */}
          {related.length > 0 && (
            <section className="pt-12">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                    Other backends
                  </h2>

                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Explore other ways to power your Apalis workers.
                  </p>
                </div>

                <Link
                  href="/backend"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                >
                  View all backends
                  <Icon name="arrow-right" className="ml-1 inline size-3" />
                </Link>
              </div>

              <div className="mt-6">
                {related.map((item) => (
                  <BackendCard key={item.urlPath} backend={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
