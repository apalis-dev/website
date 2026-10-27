import Link from "next/link";
import { PlusIcon, SearchIcon, ArrowUpDownIcon } from "lucide-react";

import { AppCard } from "@/components/dashboard/app-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockApps } from "@/lib/dashboard/mock-data";

export default function Apps() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Apps</h1>

          <p className="text-sm text-muted-foreground">
            Manage your applications and environments.
          </p>
        </div>

        <Button render={<Link href="/dashboard/apps/new" />}>
          <PlusIcon className="size-4" />
          New App
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <ArrowUpDownIcon className="size-4" />
            Sort
          </Button>
        </div>
      </div>

      <Separator />

      {mockApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <h3 className="text-base font-medium">No applications yet</h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first application to start receiving webhooks.
          </p>

          <Button className="mt-6" render={<Link href="/dashboard/apps/new" />}>
            <PlusIcon className="size-4" />
            New App
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {mockApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
