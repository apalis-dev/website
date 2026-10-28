import { getWorkspaceTickets } from "@/lib/dashboard/mock-data";
import { getDashboardWorkspace } from "@/lib/dashboard/workspace-server";
import { TicketsTable } from "@/components/dashboard/tickets-table";

export default async function Page() {
  const workspace = await getDashboardWorkspace();
  const tickets = getWorkspaceTickets(workspace);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Support requests across {workspace.name}.
        </p>
      </div>

      <TicketsTable tickets={tickets} apps={workspace.apps} />
    </div>
  );
}
