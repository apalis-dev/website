import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div
      className="mx-auto max-w-5xl space-y-8"
      aria-busy="true"
      aria-label="Loading billing"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border p-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-t pt-3"
            >
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <Skeleton className="h-5 w-28" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-t pt-3"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
