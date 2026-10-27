import FunctionalApproach from "./features/functional"
import WebBasedUI from "./features/web-ui"
import CompatibleBackends from "./features/compatible-backends"
import Middleware from "./features/middleware"
import Observability from "./features/observability"
import Workflows from "./features/workflows"
import Link from "next/link"

const FeatureCard = ({ title, description, Component, href }) => (
    <div className="overflow-hidden rounded-md border border-white/20 flex flex-col justify-start items-start relative">
        <div
            className="absolute inset-0 rounded-md"
            style={{
                background: "#15171a",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
            }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-md" />

        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <Link href={href} className="self-stretch text-foreground font-normal leading-7">
                    {title} <br />
                    <span className="text-muted-foreground">{description}</span>
                </Link>
            </div>
        </div>
        <div className="self-stretch h-72 relative -mt-0.5 z-10">
            <Component />
        </div>
    </div>
)

export function Features() {
    const cards = [
        {
            title: "Functional",
            description: "Functional programming approach with dependency injection with no macros.",
            Component: FunctionalApproach,
            href: "/docs/guides/tasks/introduction"
        },
        {
            title: "Web-based UI",
            description: "Intuitive web interface for managing and monitoring background tasks.",
            Component: WebBasedUI,
            href: "/docs/products/web-board"
        },
        {
            title: "Compatible with popular backends",
            description: "Easily connect your projects to databases and services.",
            Component: CompatibleBackends,
            href: "/docs/introduction/architecture#the-backend"
        },
        {
            title: "Flexible Middleware",
            description: "Provides middleware support build on top of tower",
            Component: Middleware,
            href: "/docs/guides/workers/middleware"
        },
        {
            title: "Workflow Orchestration",
            description: "Coordinate complex background tasks with ease.",
            Component: Workflows,
            href: "/docs/guides/workflows"
        },
        {
            title: "Observability",
            description: "Gain insights into your background tasks with built-in instrumentation.",
            Component: Observability,
            href: "/docs/integrations/tracing"
        },
    ]

    return (
        <section className="w-full max-w-(--breakpoint-2xl) mx-auto px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
            <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
                <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
                <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <h2 className="font-display mb-6 text-2xl sm:text-3xl lg:text-4xl text-white text-center">
                            Feature rich
                        </h2>
                        <p className="text-center max-w-xl mx-auto">
                            Apalis offers a complete developer toolset for background processing in rust. Process background tasks confidently, concurrently and fearlessly
                        </p>
                    </div>
                </div>
                <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
                    {cards.map((card) => (
                        <FeatureCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
