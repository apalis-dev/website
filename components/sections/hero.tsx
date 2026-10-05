"use client"

import { AnimatePresence, motion } from "framer-motion"
// import { Pill } from "../atoms/pill"
import { useEffect, useState } from "react"
import { Button } from "../atoms/button"
import Image from "next/image"
// import { Video } from "../atoms/video"

export const headlines = [
  { text: "Process background tasks", gradient: "from-violet-400 to-violet-600" },
  { text: "Build reliable workers", gradient: "from-[#5B9EE9] to-[#2F74C0]" },
  { text: "Handle task retries", gradient: "from-red-400 to-red-600" },
  { text: "Distribute task processing", gradient: "from-orange-400 to-orange-600" },
  { text: "Orcherstrate workflows", gradient: "from-violet-400 to-violet-600" },
  { text: "Monitor background queues", gradient: "from-emerald-400 to-emerald-600" },
  { text: "Schedule cron jobs", gradient: "from-green-400 to-green-600" },
  { text: "Manage task backpressure", gradient: "from-orange-400 to-orange-600" }
]

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  useEffect(() => {
    const id = setInterval(
      () =>
        setCurrentIndex((id) => (id === headlines.length - 1 ? 0 : id + 1)),
      2500
    )
    return () => {
      clearInterval(id)
    }
  }, [])

  return (
    <section className="relative z-10 my-4">
      <div className="w-full max-w-(--breakpoint-2xl) mx-auto px-4 sm:px-8 lg:px-16 pt-16">
        <section className="flex flex-col gap-8 lg:gap-11 items-center text-center">
          <h1 className="font-display text-4xl sm:text-4xl lg:text-5xl mb-4 mx-auto">
            <span className="block relative">
              <AnimatePresence initial={false}>
                <span className="relative opacity-0">
                  {headlines[currentIndex].text}
                </span>
                <motion.span
                  key={currentIndex}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className={`not-sr-only absolute top-0 -bottom-4 block text-transparent bg-clip-text bg-linear-to-br ${headlines[currentIndex].gradient}`}
                >
                  {headlines[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-300">
              with confidence
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Button href="/docs/introduction/quickstart">Get Started</Button>
            <Button href="https://github.com/apalis-dev/examples" secondary>
              View Examples
            </Button>
          </div>
          <Image
            alt="Web UI dashboard"
            className="rounded-t-3xl border-b-0 border hover:cursor-pointer mb-8"
            src="/images/board.png"
            width={3236}
            height={1714}
          />
        </section>
      </div>
    </section>
  )
}
