import Link from "next/link";
import { format } from "date-fns";
import { CircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTicketsByAppId } from "@/lib/dashboard/mock-data";

const priorityColor = {
  low: "text-muted-foreground",
  medium: "text-amber-500",
  high: "text-destructive",
};

const statusVariant = {
  open: "outline",
  in_progress: "secondary",
  resolved: "success",
  closed: "secondary",
} as const;

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const tickets = getTicketsByAppId(appId);

  const open = tickets.filter((t) => t.status === "open").length;
  const progress = tickets.filter((t) => t.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-xs font-normal text-muted-foreground">
                Subject
              </TableHead>

              <TableHead className="text-xs font-normal text-muted-foreground">
                Priority
              </TableHead>

              <TableHead className="text-xs font-normal text-muted-foreground">
                Status
              </TableHead>

              <TableHead className="text-xs font-normal text-muted-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-36 text-center text-sm text-muted-foreground"
                >
                  No tickets yet.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/dashboard/tickets/${ticket.id}`}
                      className="block"
                    >
                      <div>
                        <p className="font-medium">{ticket.subject}</p>

                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {ticket.description}
                        </p>
                      </div>
                    </Link>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CircleIcon
                        className={`size-2 fill-current ${
                          priorityColor[ticket.priority]
                        }`}
                      />

                      <span className="capitalize">{ticket.priority}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusVariant[ticket.status]}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
