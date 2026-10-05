"use client";

import { Icon } from "@/components/icons";
import { FC, PropsWithChildren, useRef, useState } from "react";

export const Pre: FC<
  PropsWithChildren<{
    fileName?: string;
    className?: string;
    mode?: string;
    compileResult?: string;
    compileErrors?: number
  }>
> = (props) => {
    let {
      children,
      fileName,
      className,
      mode,
      compileResult,
    } = props
    const container = useRef<HTMLPreElement>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const copy = () => {
      const code: string = container.current?.innerText ?? "";
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <div className={`relative mt-7 ${className}`}>
        <div className="group w-full bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-500 dark:to-zinc-800 p-px rounded-sm overflow-hidden [.code-output_&]:rounded-none-b-none">
          <div className="bg-zinc-50 dark:bg-zinc-950 rounded-sm [.code-output_&]:rounded-none-b-none">
            <div className="flex justify-start group-hover:justify-between items-center pr-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex">
                <div className="h-10 flex items-center gap-2 px-3 border-r border-zinc-200 dark:border-zinc-800">
                  <div className="h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
                </div>
                {compileResult && (
                  <div className="h-10 pl-3 flex items-center border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-850 dark:text-zinc-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={compileResult == "Success" ? "green" : "red"}
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                )}
                {fileName && (
                  <div className="h-10 px-3 flex items-center border-r border-zinc-200 dark:border-zinc-800 font-mono text-sm text-zinc-850 dark:text-zinc-300">
                    {fileName}
                  </div>
                )}
              </div>
              <button
                onClick={copy}
                className="hidden group-hover:block h-6 rounded-sm p-px shadow dark:shadow-lg bg-linear-to-br from-zinc-200 to-zinc-300 dark:from-zinc-300 dark:to-zinc-500"
              >
                <div className="h-full flex items-center gap-1 px-2 font-medium rounded-sm bg-linear-to-br from-zinc-100 dark:from-zinc-700 to-zinc-200 dark:to-zinc-900 text-black dark:text-white text-sm">
                  <Icon name={copied ? "check" : "clipboard"} className="h-3" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </div>
              </button>
            </div>
            <pre
              ref={container}
              className="shiki rounded-sm"
              style={{ margin: 0, padding: 0, backgroundColor: "transparent" }}
            >
              {children}
            </pre>
          </div>
        </div>
      </div>
    );
  };
