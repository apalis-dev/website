"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, RocketIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const iconColors = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export function NewAppForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(iconColors[0]);
  const [submitting, setSubmitting] = useState(false);

  const slug = useMemo(
    () =>
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    [name]
  );

  const initials =
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an application name.");
      return;
    }

    setSubmitting(true);
    toast.success("Application created");

    setTimeout(() => {
      router.push("/dashboard/apps");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name">Application name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Production API"
                className="h-10"
              />
              <p className="text-xs text-muted-foreground">
                This name is visible throughout your dashboard.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <div className="rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
                {slug || "your-app-slug"}
              </div>
              <p className="text-xs text-muted-foreground">
                Generated automatically from the application name.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
                <span className="ml-1 text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Internal production API used by the mobile application."
                className="min-h-28 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Helps your team identify this application later.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Application color</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Used throughout the dashboard for quick identification.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {iconColors.map((c) => {
                  const active = color === c;

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "relative flex size-9 items-center justify-center rounded-full transition-all",
                        c,
                        active
                          ? "ring-2 ring-foreground ring-offset-2"
                          : "hover:scale-105"
                      )}
                    >
                      {active && <CheckIcon className="size-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold text-white",
                  color
                )}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">
                  {name || "Untitled Application"}
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {description ||
                    "A short description will appear here once you've added one."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Active
                  </span>
                  <span>Free Plan</span>
                  <span>Created today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-end border-t pt-6">
        <Button type="submit" disabled={submitting} className="min-w-36">
          <RocketIcon className="size-4" />
          {submitting ? "Creating..." : "Create Application"}
        </Button>
      </div>
    </form>
  );
}