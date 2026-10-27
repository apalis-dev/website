import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  Clock3Icon,
  MessageSquareIcon,
  UserIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockApps, mockTickets } from "@/lib/dashboard/mock-data";
import { cn } from "@/lib/utils";

const priorityConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  high: {
    label: "High",
    className: "bg-destructive/10 text-destructive",
  },
};

const statusVariant: Record<string, "success" | "secondary" | "outline"> = {
  open: "outline",
  in_progress: "secondary",
  resolved: "success",
  closed: "secondary",
};

export default async function Page({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const ticket = mockTickets.find((t) => t.id === ticketId);

  if (!ticket) notFound();

  const app = mockApps.find((a) => a.id === ticket.appId);

  const priority = priorityConfig[ticket.priority];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            render={<Link href="/dashboard/tickets" />}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {ticket.id}
              </span>

              <Badge variant={statusVariant[ticket.status]}>
                {ticket.status.replace("_", " ")}
              </Badge>

              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  priority.className
                )}
              >
                {priority.label}
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {ticket.subject}
              </h1>

              <p className="mt-2 max-w-2xl text-muted-foreground">
                Support request opened on{" "}
                {format(new Date(ticket.createdAt), "MMMM d, yyyy")}.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">Assign</Button>

          <Button variant="outline">Close</Button>

          <Button>Resolve</Button>
        </div>
      </div>

      <Separator />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* LEFT COLUMN */}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>

              <CardDescription>Customer reported issue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="leading-7 text-muted-foreground">
                {ticket.description}
              </p>

              <div className="rounded-xl border bg-muted/30 p-5">
                <h3 className="font-medium">Reproduction Notes</h3>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>User signs into the dashboard.</li>
                  <li>Attempts to complete the reported action.</li>
                  <li>The operation unexpectedly fails.</li>
                  <li>The customer contacted support.</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>

              <CardDescription>Timeline of this ticket</CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="flex gap-4">
                <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquareIcon className="size-4 text-primary" />
                </div>

                <div className="flex-1">
                  <p className="font-medium">Ticket created</p>
                  <p className="text-sm text-muted-foreground">
                    Customer opened this support request.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(
                      new Date(ticket.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-muted">
                  <Clock3Icon className="size-4" />
                </div>

                <div className="flex-1">
                  <p className="font-medium">Awaiting investigation</p>
                  <p className="text-sm text-muted-foreground">
                    Engineering team has been notified and is reviewing the
                    issue.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated{" "}
                    {format(
                      new Date(ticket.updatedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              </div>

              {ticket.status === "resolved" && (
                <div className="flex gap-4">
                  <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2Icon className="size-4 text-green-600" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">Resolved</p>
                    <p className="text-sm text-muted-foreground">
                      This issue has been marked as resolved.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Status
                </p>

                <div className="mt-2">
                  <Badge variant={statusVariant[ticket.status]}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Priority
                </p>

                <div className="mt-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      priority.className
                    )}
                  >
                    {priority.label}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Application
                </p>

                {app ? (
                  <Link
                    href={`/dashboard/apps/${app.id}`}
                    className="mt-3 flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-md text-sm font-semibold text-white",
                        app.color
                      )}
                    >
                      {app.icon}
                    </div>

                    <div>
                      <p className="font-medium">{app.name}</p>

                      <p className="text-xs text-muted-foreground">
                        View application
                      </p>
                    </div>
                  </Link>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unknown application
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Reporter
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="size-4" />
                  </div>

                  <div>
                    <p className="font-medium">Customer</p>

                    <p className="text-xs text-muted-foreground">
                      support@example.com
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>

                  <span className="font-medium">
                    {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Updated</span>

                  <span className="font-medium">
                    {format(new Date(ticket.updatedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
