import { mockApps, mockTickets } from "@/lib/dashboard/mock-data";
import { TicketsTable } from "@/components/dashboard/tickets-table";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Support requests across all of your applications.
        </p>
      </div>

      <TicketsTable tickets={mockTickets} apps={mockApps} />
    </div>
  );
}