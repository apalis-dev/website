"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/button"
import { Icon } from "../icons"

export function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(true)

    const pricingPlans = [
        {
            name: "Free",
            monthlyPrice: "$0",
            annualPrice: "$0",
            description: "Perfect for individuals starting their journey.",
            features: [
                "Open source under MIT/Apache license",
                "Cron, Postgres, Redis and other common backends",
                "Realtime logs",
                "Support via Github issues",
                "Basic Web UI for observability",
            ],
            buttonText: "Get Started",
            buttonClass:
                "bg-zinc-300 shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] outline outline-0.5 outline-[#1e29391f] outline-offset-[-0.5px] text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-zinc-400 bg-transparent",
        },
        {
            name: "Pro",
            monthlyPrice: "$99",
            annualPrice: "$999",
            description: "Ideal for professionals.",
            features: [
                "Batch processing support",
                "Pausable Queues",
                "Improved perfomance via bulk inserts",
                "Enhanced Web UI",
                "Observability for Cronjobs",
                "Custom feature requests",
                "Custom telemetry backends",
                "1 Application",
                "Priority support",
            ],
            buttonText: "Contact Sales",
            buttonClass:
                "bg-primary-foreground shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-black text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-primary-foreground/90",
            popular: true,
        },
        {
            name: "Enterprise",
            monthlyPrice: "Custom",
            annualPrice: "Custom",
            description: "Tailored solutions for teams.",
            features: [
                "Encryption support",
                "Unlimited Applications",
                "Advanced workflow coordination",
                "Dedicated account support",
                "Collaborative coding with our team",
                "Priority Custom feature requests",
                "Logs and metrics retention",
                "Enterprise-grade security and compliance",
                "All Pro features"
            ],
            buttonText: "Talk to Sales",
            buttonClass:
                "bg-secondary shadow-[0px_1px_1px_-0.5px_rgba(16,24,40,0.20)] text-secondary-foreground text-shadow-[0px_1px_1px_rgba(16,24,40,0.08)] hover:bg-secondary/90",
        },
    ]

    return (
        <section className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14">
            <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
                <div className="flex flex-col justify-start items-center gap-4">
                    <h2 className="text-center dark:text-foreground text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]">
                        Pricing built for every developer
                    </h2>
                    <p className="self-stretch text-center dark:text-muted-foreground text-sm font-medium leading-tight">
                        Choose a plan that fits your background processing requirements, from individuals starting out to <br /> growing professionals
                        and large organizations.
                    </p>
                </div>
                <div className="pt-4">
                    <div className="p-0.5 dark:bg-muted rounded-md outline outline-1 outline-[#0307120a] -outline-offset-1 flex justify-start items-center gap-1 md:mt-0">
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
                        >
                            <span
                                className={`text-center text-sm font-medium leading-tight ${isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
                            >
                                Annually
                            </span>
                        </button>
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-2 py-1 flex justify-start items-start rounded-md ${!isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
                        >
                            <span
                                className={`text-center text-sm font-medium leading-tight ${!isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
                            >
                                Monthly
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-(--breakpoint-2xl) mx-auto self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6">
                {pricingPlans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`flex-1 p-4 overflow-hidden rounded-md flex flex-col justify-start items-center self-stretch gap-6 ${plan.popular ? "bg-primary shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.10)]" : "bg-linear-to-b from-gray-50/5 to-gray-50/0"}`}
                        style={plan.popular ? {} : { outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
                    >
                        <div className="self-stretch flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch flex flex-col justify-start items-start gap-8">
                                <div
                                    className={`w-full h-5 text-sm font-medium leading-tight ${plan.popular ? "dark:text-primary-foreground" : "dark:text-zinc-200"}`}
                                >
                                    {plan.name}
                                    {plan.popular && (
                                        <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-linear-to-b from-primary-light/50 to-primary-light bg-white">
                                            <div className="text-center text-primary-foreground text-xs font-normal leading-tight wrap-break-word">
                                                Popular
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                                    <div className="flex justify-start items-center gap-1.5">
                                        <div
                                            className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "dark:text-primary-foreground" : "dark:text-zinc-50"}`}
                                        >
                                            <span className="invisible">{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                                            <span
                                                className="absolute inset-0 flex items-center transition-all duration-500"
                                                style={{
                                                    opacity: isAnnual ? 1 : 0,
                                                    transform: `scale(${isAnnual ? 1 : 0.8})`,
                                                    filter: `blur(${isAnnual ? 0 : 4}px)`,
                                                }}
                                                aria-hidden={!isAnnual}
                                            >
                                                {plan.annualPrice}
                                            </span>
                                            <span
                                                className="absolute inset-0 flex items-center transition-all duration-500"
                                                style={{
                                                    opacity: !isAnnual ? 1 : 0,
                                                    transform: `scale(${!isAnnual ? 1 : 0.8})`,
                                                    filter: `blur(${!isAnnual ? 0 : 4}px)`,
                                                }}
                                                aria-hidden={isAnnual}
                                            >
                                                {plan.monthlyPrice}
                                            </span>
                                        </div>
                                        <div
                                            className={`text-center text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-zinc-400"}`}
                                        >
                                            {plan.name != "Enterprise" ? <span>/{isAnnual ? "year" : "month"}</span> : <></>}
                                        </div>
                                    </div>
                                    <div
                                        className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-primary-foreground/70" : "text-zinc-400"}`}
                                    >
                                        {plan.description}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-4">
                            <div
                                className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "dark:text-primary-foreground/70" : "dark:text-muted-foreground"}`}
                            >
                                {plan.name === "Free" ? "Get Started today:" : "Everything in Free +"}
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                                        <div className="w-4 h-4 flex items-center justify-center">
                                            <Icon
                                                name="check"
                                                className={`w-full h-full ${plan.popular ? "dark:text-primary-foreground" : "dark:text-muted-foreground"}`}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div
                                            className={`leading-tight font-normal text-sm text-left ${plan.popular ? "dark:text-primary-foreground" : "dark:text-muted-foreground"}`}
                                        >
                                            {feature}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
