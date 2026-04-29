"use client";

import { useState } from "react";
import { Icon } from "../icons";
import { motion } from "framer-motion";
import { Code } from "../layout/code";
import { Logo } from "../atoms/logo";

export const Ergonomics = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  return (
    <section className="relative my-4">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        <h2 className="font-display mb-6 text-2xl sm:text-3xl lg:text-4xl text-white text-center">
          {content.heading}
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto">{content.text}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-6 pt-12">
          <div className="flex flex-col items-center gap-6">
            <div className="lg:pr-16">
              <ul>
                {content.features.map(({ name, description, color }, index) => (
                  <li key={index}>
                    {index > 0 && (
                      <Icon
                        name="arrow-down"
                        className="h-3 ml-2 text-zinc-600 -translate-x-px"
                      />
                    )}
                    <button
                      onClick={() => setCurrentIndex(index)}
                      className="text-white flex gap-4 items-center text-left relative"
                    >
                      {currentIndex >= index && (
                        <>
                          <div
                            className="absolute -left-2 w-9 h-9 rounded-sm"
                            style={{ backgroundColor: color }}
                          />
                          <div className="absolute -left-2 w-9 h-9 rounded-sm border border-white/10" />
                        </>
                      )}
                      <div className="relative bg-gradient-to-br from-zinc-100 to-zinc-500 h-5 w-5 rounded-sm p-px">
                        <div
                          className={`rounded-sm-[5px] h-full w-full flex items-center justify-center ${currentIndex >= index ? "bg-white" : "bg-black"
                            }`}
                        >
                          <Icon name="check" className="ml-px h-3.5 text-black" />
                        </div>
                      </div>
                      <div>
                        <div>{name}</div>
                        <div className="text-xs text-zinc-400">{description}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <Code
              tabs={[
                {
                  name: content.features[currentIndex].withApalis.fileName,
                  content: content.features[currentIndex].withApalis.code,
                  highlights:
                    content.features[currentIndex].withApalis.highlights,
                  language: "rust"
                },
              ]}
              fixedHeight={300}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const content = {
  heading: "Simple and ergonomic API",
  text: `Apalis provides production-ready task processing with minimal boilerplate, letting you focus on business logic.`,
  features: [
    {
      name: "Simple task handlers",
      description: "Task handlers are just async functions with a macro-free API.",
      color: "#283413",
      withApalis: {
        fileName: "main.rs",
        code: `\
struct Email {
    to: String,
    subject: String,
}

async fn send_email(task: Email) {
    // Do something
}
    
#[tokio::main]
async fn main() -> Result<()> {
    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .build(send_email);
    worker.run().await?;
}\
        `,
        highlights: [
          {
            color: "#28233B",
            lines: [6, 7, 8, 14],
          },
        ],
      },
    },
    {
      name: "Robust error handling",
      description: "Configurable error handling with retry policies and exponential backoff.",
      color: "#39300D",
      withApalis: {
        fileName: "main.rs",
        code: `\
async fn send_email(task: Email) -> Result<(), MyError> {
    Ok(())
}
    
#[tokio::main]
async fn main() -> Result<()> {
    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .retry(
            RetryPolicy::retries(3)
              .with_backoff(backoff)
              .retry_if(can_recover),
        )
        .build(send_email);
    worker.run().await?;
}\
        `,
        highlights: [
          {
            color: "#28233B",
            lines: [1, 9, 10, 11, 12, 13],
          },
        ],
      },
    },
    {
      name: "Graceful Shutdown",
      description: "Clean shutdown handling with configurable timeouts.",
      color: "#28233B",
      withApalis: {
        fileName: "main.rs",
        code: `\
async fn send_email(task: Email) {
    // Do something
}
    
#[tokio::main]
async fn main() -> Result<()> {
    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .build(send_email);
    Monitor::new()
      .register(|_| worker)
      .shutdown_timeout(Duration::from_secs(30))
      .run_with_signal(tokio::signal::ctrl_c())
      .await?;
}\
        `,
        highlights: [
          {
            color: "#28233B",
            lines: [12, 13],
          },
        ],
      },
    },
    {
      name: "Telemetry and observability",
      description: "Built-in metrics and tracing integration.",
      color: "#10322E",
      withApalis: {
        fileName: "main.rs",
        code: `\
async fn send_email(task: Email) {
    // Do something
}
    
#[tokio::main]
async fn main() -> Result<()> {
    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .layer(PrometheusLayer::new())
        .layer(TraceLayer::new())
        .build(send_email);
    worker.run().await?;
}\
        `,
        highlights: [
          {
            color: "#10322E",
            lines: [9, 10],
          },
        ],
      },
    },
    {
      name: "Distributed and controllable execution",
      description:
        "Distributed Sequential and DAG workflows",
      color: "#2E1F3B",

      withApalis: {
        fileName: "main.rs",
        code: `\
#[tokio::main]
async fn main() -> Result<()> {

    let workflow = Workflow::new("product-image-workflow")
       .and_then(generate_thumbnail)
       .and_then(extract_items)
       .filter_map(classify_and_recognise)
       .and_then(publish_to_website);

    let worker = WorkerBuilder::new("rango-tango")
        .backend(backend)
        .build(workflow);
    worker.run().await?;
}\
        `,
        highlights: [
          {
            color: "#2E1F3B",
            lines: [5, 6, 7, 8, 12],
          },
        ],
      },
    },
  ],
};
