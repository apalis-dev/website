"use client"

import type React from "react"
import { useState } from "react"
import { Icon } from "../icons"

const faqData = [
  {
    question: "What is Apalis and who should use it?",
    answer:
      "Apalis is a Rust-first background job and task processing framework designed for developers building reliable, scalable systems. It’s ideal for backend engineers, platform teams, and infrastructure-focused projects that need asynchronous job execution, worker orchestration, and strong type safety without sacrificing performance.",
  },
  {
    question: "What problems does Apalis solve?",
    answer:
      "Apalis helps you run background jobs such as email delivery, data processing, scheduled tasks, and long-running workflows. It provides a structured way to define jobs, execute them with workers, manage retries, handle failures, and coordinate concurrent task execution in production-grade Rust applications.",
  },
  {
    question: "How does Apalis handle workers and job execution?",
    answer:
      "Apalis uses a worker-based execution model where workers continuously pull jobs from a backend and process them asynchronously. It supports configurable concurrency, graceful shutdowns, retries, timeouts, and middleware, giving you fine-grained control over how jobs are executed and supervised.",
  },
  {
    question: "Which storage backends are supported?",
    answer:
      "Apalis is backend-agnostic and works with multiple storage providers through dedicated crates. Popular options include PostgreSQL, Redis, SQLite, and in-memory backends. This flexibility allows you to choose the best storage layer for your workload, from local development to large-scale production systems.",
  },
  {
    question: "Can Apalis be integrated into existing Rust applications?",
    answer:
      "Yes. Apalis is designed to integrate cleanly with existing Rust applications and async runtimes like Tokio. It works well alongside popular web frameworks such as Axum and Actix, making it easy to add background processing to APIs, services, and microservice architectures.",
  },
  {
    question: "Is Apalis suitable for production use?",
    answer:
      "Absolutely. Apalis focuses on reliability, observability, and correctness. It supports structured error handling, retries, graceful shutdowns, and extensibility via middleware. Its strongly typed API and async-first design make it a solid choice for production workloads that demand performance and safety.",
  },
];


interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }
  return (
    <div
      className={`w-full bg-[rgba(231,236,235,0.08)] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] overflow-hidden rounded-[10px] outline outline-1 outline-border outline-offset-[-1px] transition-all duration-500 ease-out cursor-pointer`}
      onClick={handleClick}
    >
      <div className="w-full px-5 py-[18px] pr-4 flex justify-between items-center gap-5 text-left transition-all duration-300 ease-out">
        <div className="flex-1 text-foreground text-base font-medium leading-6 break-words">{question}</div>
        <div className="flex justify-center items-center">
          <Icon
            name="chevron-down"
            className={`w-6 h-6 text-muted-foreground-dark transition-all duration-500 ease-out ${isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "pb-[18px] pt-2 translate-y-0" : "pb-0 pt-0 -translate-y-2"}`}
        >
          <div className="text-foreground/80 text-sm font-normal leading-6 break-words">{answer}</div>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }
  return (
    <section className="w-full pt-[66px] pb-20 md:pb-40 px-5 relative flex flex-col justify-center items-center">
      <div className="w-[300px] h-[500px] absolute top-[150px] left-1/2 -translate-x-1/2 origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[100px] z-0" />
      <div className="self-stretch pt-8 pb-8 md:pt-14 md:pb-14 flex flex-col justify-center items-center gap-2 relative z-10">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="w-full max-w-[435px] text-center text-foreground text-4xl font-semibold leading-10 break-words">
            Frequently Asked Questions
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-[18.20px] break-words">
            Everything you need to know about Pointer and how it can transform your development workflow
          </p>
        </div>
      </div>
      <div className="w-full max-w-[600px] pt-0.5 pb-10 flex flex-col justify-start items-start gap-4 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem key={index} {...faq} isOpen={openItems.has(index)} onToggle={() => toggleItem(index)} />
        ))}
      </div>
    </section>
  )
}
