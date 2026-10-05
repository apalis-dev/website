"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DashboardApp, Ticket } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

const statusVariant = {
  open: "outline",
  in_progress: "secondary",
  resolved: "success",
  closed: "secondary",
} as const;

const priorityVariant = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
} as const;

const priorityRank: Record<Ticket["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const statusRank: Record<Ticket["status"], number> = {
  open: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
};

type SortKey = "status" | "priority" | "createdAt";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "createdAt", label: "Created" },
];

const PAGE_SIZE = 10;

interface TicketsTableProps {
  tickets: Ticket[];
  apps: DashboardApp[];
}

export function TicketsTable({ tickets, apps }: TicketsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = tickets;

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "status") cmp = statusRank[a.status] - statusRank[b.status];
      else if (sortKey === "priority")
        cmp = priorityRank[a.priority] - priorityRank[b.priority];
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tickets, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(
      selected.size === paged.length ? new Set() : new Set(paged.map((t) => t.id))
    );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(0);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full max-w-xs">
            <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm">
            <span className="text-muted-foreground">
              {selected.size} {selected.size === 1 ? "ticket" : "tickets"} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={paged.length > 0 && selected.size === paged.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-xs font-normal text-muted-foreground">
                Ticket
              </TableHead>
              <TableHead className="text-xs font-normal text-muted-foreground">
                App
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-xs font-normal text-muted-foreground"
                >
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 capitalize hover:text-foreground transition-colors"
                  >
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ArrowUpIcon className="size-3" />
                      ) : (
                        <ArrowDownIcon className="size-3" />
                      ))}
                  </button>
                </TableHead>
              ))}
              <TableHead className="text-right text-xs font-normal text-muted-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((ticket) => {
                const app = apps.find((a) => a.id === ticket.appId);
                const isSelected = selected.has(ticket.id);

                return (
                  <TableRow
                    key={ticket.id}
                    data-state={isSelected ? "selected" : undefined}
                    className="cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/dashboard/tickets/${ticket.id}`)
                    }
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleRow(ticket.id)}
                      />
                    </TableCell>

                    <TableCell className="min-w-[320px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{ticket.subject}</p>
                          <code className="font-mono text-[11px] text-muted-foreground">
                            {ticket.id}
                          </code>
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {app && (
                        <Link
                          href={`/dashboard/apps/${app.id}`}
                          className="flex w-fit items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className={cn(
                              "flex size-6 items-center justify-center rounded-md text-xs font-medium text-white",
                              app.color
                            )}
                          >
                            {app.icon}
                          </span>
                          <span className="text-sm">{app.name}</span>
                        </Link>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant={priorityVariant[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={statusVariant[ticket.status]}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(ticket.createdAt), "MMM d")}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages} — {filtered.length}{" "}
          {filtered.length === 1 ? "ticket" : "tickets"}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage === 0}
            onClick={() => setPage(0)}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage(totalPages - 1)}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </>
  );
}