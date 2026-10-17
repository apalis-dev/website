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
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 pt-16">
        <section className="flex flex-col gap-8 lg:gap-11 items-center text-center">
          <Intro />

          {/*<h1 className="font-display text-4xl sm:text-4xl lg:text-5xl mb-4 mx-auto">
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
                  className={`not-sr-only absolute top-0 -bottom-4 block text-transparent bg-clip-text bg-gradient-to-br ${headlines[currentIndex].gradient}`}
                >
                  {headlines[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300">
              with confidence
            </span>
          </h1>*/}
          <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
            <Button href="/docs/introduction/quickstart">Get Started</Button>
            <Button href="https://github.com/apalis-dev/examples" secondary>
              View Examples
            </Button>
          </div>

        </section>
      </div>
    </section>
  )
}



export function Intro() {
  const title = "Apalis intro video"
  const videoId = "EtIcrNnDNpg";
  const [playing, setPlaying] = useState(false);
  const fallback = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const [src, setSrc] = useState(
     `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  );

  // maxresdefault doesn't exist for every video: YouTube answers with a tiny placeholder.
  const useFallback = () => src !== fallback && setSrc(fallback);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        alt=""
        onError={useFallback}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 120) useFallback();
        }}
      />

      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className={`
            group absolute inset-0 grid h-full w-full cursor-pointer place-items-center
            bg-black/30 p-0 text-white transition-colors hover:bg-black/15
            focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-white
            motion-reduce:transition-none
          `}
        >
          <span
            aria-hidden="true"
            className={`
              relative grid aspect-square w-[clamp(56px,11%,96px)] place-items-center rounded-full
              bg-white/15 ring-[1.5px] ring-inset ring-white/55
              backdrop-blur-[14px] backdrop-saturate-[1.4]
              transition-all duration-300 ease-out
              group-hover:scale-[1.06] group-hover:bg-white/25
              group-focus-visible:scale-[1.06] group-focus-visible:bg-white/25
              motion-reduce:transition-none

              after:absolute after:-inset-2.5 after:rounded-full after:border after:border-white/35
              after:opacity-0 after:scale-90 after:transition-all after:duration-300 after:ease-out
              group-hover:after:scale-100 group-hover:after:opacity-100
              group-focus-visible:after:scale-100 group-focus-visible:after:opacity-100
              motion-reduce:after:transition-none
            `}
          >
            <svg viewBox="0 0 24 24" className="h-auto w-[42%]">
              <path
                d="M9 6.5 18 12 9 17.5Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
