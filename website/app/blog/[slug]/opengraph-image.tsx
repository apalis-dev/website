import { ImageResponse } from "next/og"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const alt = "Apalis"
export const size = {
  width: 1200,
  height: 630
}

export const contentType = "image/png"

const baseUrl = async () => {
  let h = await headers();
  const host = h.get("host") ?? "localhost:3000"
  const proto = host.includes("localhost") ? "http" : "https"
  return `${proto}://${host}`
}

export default async function Image({
  params: { slug }
}: {
  params: { slug: string }
}) {
  const base = await baseUrl();
  const [post, inter, calSans] = await Promise.all([
    fetch(`${base}/api/blog/${slug}`).then((res) => {
      if (!res.ok) return notFound()
      return res.json()
    }),
    fetch(new URL(`${base}/fonts/inter-light.ttf`, import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
    fetch(
      new URL(`${base}/fonts/cal-sans-semibold.ttf`, import.meta.url)
    ).then((res) => res.arrayBuffer())
  ] as const)

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a1a0f 0%, #0f2d18 50%, #0a1a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px 100px",
          position: "relative",
        }}
      >
        {/* Subtle grid overlay for texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #16a34a, #4ade80, #16a34a)",
            display: "flex",
          }}
        />

        {/* Text content — top area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            flex: 1,
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {/* Label pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                background: "rgba(74,222,128,0.15)",
                border: "1px solid rgba(74,222,128,0.4)",
                borderRadius: "100px",
                padding: "6px 18px",
                color: "#4ade80",
                fontSize: "18px",
                fontFamily: "Inter",
                display: "flex",
              }}
            >
              Blog
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              color: "#ffffff",
              fontSize: 68,
              fontFamily: "CalSans",
              lineHeight: 1.1,
              letterSpacing: "-1px",
              maxWidth: "900px",
              display: "flex",
            }}
          >
            {post.title}
          </div>

          {/* Excerpt */}
          <div
            style={{
              color: "#86efac",
              fontSize: 28,
              fontFamily: "Inter",
              lineHeight: 1.5,
              maxWidth: "800px",
              display: "flex",
            }}
          >
            {post.excerpt}
          </div>
        </div>

        {/* Bottom row: logo left, domain right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width={48}
              height={48}
              style={{ fill: "#ffffff" }}
            >
              <polygon points="141.598,307.12 0,448.707 42.972,448.707 174.577,317.114" />
              <path d="M511.324,156.078c-1.335-3.15-4.427-5.197-7.848-5.197H459.55c-4.709,0-8.524,3.816-8.524,8.524l12.519,41.258c1.655,1.602,3.793,2.399,5.927,2.399c2.229,0,4.454-0.868,6.126-2.596l34.006-35.133C511.981,162.873,512.659,159.229,511.324,156.078z" />
              <path d="M321.452,365.844c-91.686,0-129.88-64.005-128.392-110.162c-0.011-0.011,192.355-192.389,192.355-192.389c37.778,20.889,67.236,55.007,82.09,96.115c4.069,11.229,7.035,22.98,8.785,35.13c1.227,8.456,1.864,17.093,1.864,25.878c0,2.75-0.057,5.501-0.193,8.217C477.961,228.633,425.246,365.844,321.452,365.844z" />
              <path d="M409.805,228.633h68.157c-4.285,95.285-82.897,171.216-179.24,171.216c-56.542,0-106.969-26.163-139.848-67.032c-6.478-8.024-12.252-16.616-17.275-25.697l51.45-51.45c14.775,44.21,56.508,76.078,105.673,76.078C357.457,331.749,405.577,286.288,409.805,228.633z" />
              <path d="M393.325,197.174c-20.824,0-37.766-16.942-37.766-37.766c0-20.831,16.942-37.778,37.766-37.778c20.831,0,37.778,16.947,37.778,37.778C431.103,180.232,414.156,197.174,393.325,197.174z" />
              <path d="M393.325,144.36c8.308,0,15.047,6.74,15.047,15.047s-6.74,15.036-15.047,15.036s-15.036-6.728-15.036-15.036S385.017,144.36,393.325,144.36z" />
            </svg>
            <span
              style={{
                color: "#ffffff",
                fontSize: 26,
                fontFamily: "CalSans",
                letterSpacing: "0.5px",
                display: "flex",
              }}
            >
              Apalis
            </span>
          </div>

          {/* Domain */}
          <div
            style={{
              color: "rgba(134,239,172,0.6)",
              fontSize: 20,
              fontFamily: "Inter",
              display: "flex",
            }}
          >
            apalis.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: inter,
          style: "normal",
          weight: 300
        },
        {
          name: "CalSans",
          data: calSans,
          style: "normal",
          weight: 600
        }
      ]
    }
  )
}
