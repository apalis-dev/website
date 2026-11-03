"use client";

import { useStatements } from "@clerk/nextjs/experimental";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BillingHistory() {
  const { data, isLoading, isError, error } = useStatements({
    for: "organization",
    pageSize: 10,
  });
  const statements = data ?? [];

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                Statement
              </TableHead>
              <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                Date
              </TableHead>
              <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="px-6 text-xs font-medium text-muted-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`statement-skeleton-${index}`}>
                  <TableCell className="px-6">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="px-6">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="px-6">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="px-6">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && isError && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {error?.message ?? "We couldn't load billing statements."}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && statements.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  No statements yet. Your first paid invoice will appear here.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              statements.map((statement) => {
                const total = statement.totals.grandTotal;

                return (
                  <TableRow key={statement.id}>
                    <TableCell className="max-w-[220px] px-6">
                      <span
                        className="block truncate font-mono text-xs"
                        title={statement.id}
                      >
                        {statement.id}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 text-sm text-muted-foreground">
                      {format(statement.timestamp, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="px-6 text-sm font-medium">
                      {total.currencySymbol}
                      {total.amountFormatted}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant={
                          statement.status === "closed" ? "success" : "secondary"
                        }
                      >
                        {statement.status === "closed" ? "Closed" : "Open"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
