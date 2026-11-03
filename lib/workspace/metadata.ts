import { z } from "zod";

import type { DashboardApp } from "@/lib/dashboard/types";

/**
 * Clerk public metadata is capped at 8KB. Leave headroom for other keys and
 * JSON escaping; the Enterprise app cap is 10.
 */
export const MAX_PUBLIC_METADATA_BYTES = 8_000;
export const MAX_ENTERPRISE_APPS = 10;

export const workspaceAppSchema = z.object({
  id: z.string().regex(/^app_[a-z0-9_]+$/, "App IDs must start with app_."),
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid app slug."),
  description: z.string().max(280).optional(),
  color: z.string().min(1).max(40),
  icon: z.string().min(1).max(4),
  apiKeyId: z.string().min(1).nullable().optional(),
  createdAt: z.string().min(1),
});

export const workspaceMetadataSchema = z.object({
  schemaVersion: z.literal(1),
  apps: z.record(z.string(), workspaceAppSchema),
});

export type WorkspaceAppMetadata = z.infer<typeof workspaceAppSchema>;
export type WorkspaceMetadata = z.infer<typeof workspaceMetadataSchema>;

export function emptyWorkspaceMetadata(): WorkspaceMetadata {
  return {
    schemaVersion: 1,
    apps: {},
  };
}

export function isWorkspaceMetadata(value: unknown): value is WorkspaceMetadata {
  return workspaceMetadataSchema.safeParse(value).success;
}

/**
 * Invalid or missing metadata falls back to an empty workspace. Mutations
 * should validate before writing and surface an error rather than overwrite.
 */
export function parseWorkspaceMetadata(value: unknown): WorkspaceMetadata {
  if (value == null) return emptyWorkspaceMetadata();

  const record =
    typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  // Metadata written before schemaVersion was introduced is still valid at
  // version 1. Without this, an app can exist in Clerk but be invisible here.
  const result = workspaceMetadataSchema.safeParse({
    ...record,
    schemaVersion: record.schemaVersion ?? 1,
    apps: record.apps ?? {},
  });

  return result.success ? result.data : emptyWorkspaceMetadata();
}

export function serializeWorkspaceMetadata(
  metadata: WorkspaceMetadata
): string {
  return JSON.stringify(metadata);
}

export function getMetadataSizeBytes(metadata: WorkspaceMetadata): number {
  return new TextEncoder().encode(
    serializeWorkspaceMetadata(metadata)
  ).length;
}

export function assertMetadataFits(metadata: WorkspaceMetadata): void {
  const size = getMetadataSizeBytes(metadata);

  if (size > MAX_PUBLIC_METADATA_BYTES) {
    throw new Error(
      `Workspace metadata is ${size} bytes; the limit is ${MAX_PUBLIC_METADATA_BYTES}.`
    );
  }
}

export function toWorkspaceAppMetadata(app: DashboardApp): WorkspaceAppMetadata {
  return {
    id: app.id,
    name: app.name,
    slug: app.slug,
    description: app.description,
    color: app.color,
    icon: app.icon,
    apiKeyId: app.apiKeyId ?? null,
    createdAt: app.createdAt,
  };
}

export function toDashboardApp(app: WorkspaceAppMetadata): DashboardApp {
  return {
    id: app.id,
    name: app.name,
    slug: app.slug,
    status: "active",
    apiKeyId: app.apiKeyId ?? undefined,
    icon: app.icon,
    color: app.color,
    description: app.description,
    createdAt: app.createdAt,
  };
}

export function upsertWorkspaceApp(
  metadata: WorkspaceMetadata,
  app: DashboardApp
): WorkspaceMetadata {
  const next: WorkspaceMetadata = {
    schemaVersion: 1,
    apps: {
      ...metadata.apps,
      [app.id]: toWorkspaceAppMetadata(app),
    },
  };

  assertMetadataFits(next);

  return next;
}

export function removeWorkspaceApp(
  metadata: WorkspaceMetadata,
  appId: string
): WorkspaceMetadata {
  const { [appId]: _removed, ...rest } = metadata.apps;

  return {
    schemaVersion: 1,
    apps: rest,
  };
}
