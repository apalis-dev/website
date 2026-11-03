import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading settings"
    >
      <div>
        <h1 className="text-lg font-medium">Settings</h1>
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4 rounded-xl border p-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="space-y-4 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
