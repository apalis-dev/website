import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import type { DashboardApp } from "@/lib/dashboard/types";
import { getOrganizationPlan } from "@/lib/dashboard/workspace-server";
import {
  MAX_PUBLIC_METADATA_BYTES,
  emptyWorkspaceMetadata,
  removeWorkspaceApp,
  upsertWorkspaceApp,
  workspaceMetadataSchema,
  type WorkspaceMetadata,
} from "@/lib/workspace/metadata";
import { assertCanCreateAppForPlan } from "@/lib/workspace/policy";

const appColorSchema = z
  .string()
  .trim()
  .regex(/^bg-[a-z]+-[0-9]{3}$/, "Choose a valid app color.")
  .max(40);

const createAppSchema = z.object({
  name: z.string().trim().min(1, "Enter an application name.").max(80),
  description: z
    .string()
    .trim()
    .max(280, "Keep the description under 280 characters.")
    .optional()
    .transform((value) => value || undefined),
  color: appColorSchema.default("bg-emerald-500"),
});

const updateAppSchema = z.object({
  appId: z.string().min(1),
  name: z.string().trim().min(1, "Enter an application name.").max(80),
  description: z
    .string()
    .trim()
    .max(280, "Keep the description under 280 characters.")
    .optional()
    .transform((value) => value || undefined),
  color: appColorSchema.optional(),
});

export type CreateAppInput = z.input<typeof createAppSchema>;
export type UpdateAppInput = z.input<typeof updateAppSchema>;

interface MutationContext {
  organizationId: string;
  existingPublicMetadata: Record<string, unknown>;
  metadata: WorkspaceMetadata;
  plan: Awaited<ReturnType<typeof getOrganizationPlan>>;
}

function getAppInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "AP";
}

function slugifyAppName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return slug || "app";
}

function getUniqueSlug(name: string, metadata: WorkspaceMetadata): string {
  const base = slugifyAppName(name);
  const existingSlugs = new Set(
    Object.values(metadata.apps).map((app) => app.slug)
  );

  if (!existingSlugs.has(base)) return base;

  for (let index = 2; index < 100; index += 1) {
    const candidate = `${base}-${index}`;

    if (!existingSlugs.has(candidate)) return candidate;
  }

  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

function createAppId(): string {
  return `app_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

function parseMetadataForWrite(value: unknown): WorkspaceMetadata {
  if (value == null) return emptyWorkspaceMetadata();

  const record =
    typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  if (record.schemaVersion == null && record.apps == null) {
    return emptyWorkspaceMetadata();
  }

  const result = workspaceMetadataSchema.safeParse({
    ...record,
    schemaVersion: record.schemaVersion ?? 1,
    apps: record.apps ?? {},
  });

  if (!result.success) {
    throw new Error(
      "This workspace's app metadata is invalid. Fix it in the Clerk dashboard before managing apps."
    );
  }

  return result.data;
}

function assertPublicMetadataFits(metadata: Record<string, unknown>): void {
  const size = new TextEncoder().encode(JSON.stringify(metadata)).length;

  if (size > MAX_PUBLIC_METADATA_BYTES) {
    throw new Error(
      `Workspace metadata would be ${size} bytes; the limit is ${MAX_PUBLIC_METADATA_BYTES}.`
    );
  }
}

async function getMutationContext(): Promise<MutationContext> {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new Error("You must be signed in to manage apps.");
  }

  if (!orgId) {
    throw new Error("Select a workspace before managing apps.");
  }

  if (orgRole !== "org:admin" && orgRole !== "org:owner") {
    throw new Error("Only workspace admins can manage apps.");
  }

  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });
  const publicMetadata = (organization.publicMetadata ?? {}) as Record<
    string,
    unknown
  >;
  const metadata = parseMetadataForWrite(organization.publicMetadata);
  const plan = await getOrganizationPlan(orgId);

  return {
    organizationId: orgId,
    existingPublicMetadata: publicMetadata,
    metadata,
    plan,
  };
}

export async function createWorkspaceApp(
  input: CreateAppInput
): Promise<DashboardApp> {
  const parsed = createAppSchema.parse(input);
  const context = await getMutationContext();

  assertCanCreateAppForPlan(
    context.plan,
    Object.keys(context.metadata.apps).length
  );

  const app: DashboardApp = {
    id: createAppId(),
    name: parsed.name,
    slug: getUniqueSlug(parsed.name, context.metadata),
    status: "active",
    icon: getAppInitials(parsed.name),
    color: parsed.color,
    description: parsed.description,
    createdAt: new Date().toISOString(),
  };

  const nextMetadata = upsertWorkspaceApp(context.metadata, app);

  assertPublicMetadataFits({
    ...context.existingPublicMetadata,
    schemaVersion: nextMetadata.schemaVersion,
    apps: nextMetadata.apps,
  });

  const client = await clerkClient();

  await client.organizations.updateOrganizationMetadata(
    context.organizationId,
    {
      publicMetadata: {
        schemaVersion: nextMetadata.schemaVersion,
        apps: nextMetadata.apps,
      },
    }
  );

  return app;
}

export async function updateWorkspaceApp(
  input: UpdateAppInput
): Promise<DashboardApp> {
  const parsed = updateAppSchema.parse(input);
  const context = await getMutationContext();
  const existing = context.metadata.apps[parsed.appId];

  if (!existing) {
    throw new Error("Application not found in this workspace.");
  }

  const app: DashboardApp = {
    id: existing.id,
    name: parsed.name,
    slug: existing.slug,
    status: "active",
    apiKeyId: existing.apiKeyId ?? undefined,
    icon: getAppInitials(parsed.name),
    color: parsed.color ?? existing.color,
    description: parsed.description,
    createdAt: existing.createdAt,
  };

  const nextMetadata = upsertWorkspaceApp(context.metadata, app);

  assertPublicMetadataFits({
    ...context.existingPublicMetadata,
    schemaVersion: nextMetadata.schemaVersion,
    apps: nextMetadata.apps,
  });

  const client = await clerkClient();

  await client.organizations.updateOrganizationMetadata(
    context.organizationId,
    {
      publicMetadata: {
        schemaVersion: nextMetadata.schemaVersion,
        apps: nextMetadata.apps,
      },
    }
  );

  return app;
}

export async function deleteWorkspaceApp(appId: string): Promise<void> {
  const context = await getMutationContext();

  if (!context.metadata.apps[appId]) {
    throw new Error("Application not found in this workspace.");
  }

  const nextMetadata = removeWorkspaceApp(context.metadata, appId);
  const client = await clerkClient();

  // TODO(api-keys): revoke the Clerk API key before removing an app that has
  // an apiKeyId. Seeded apps have none, so this is safe for the current MVP.
  await client.organizations.replaceOrganizationMetadata(
    context.organizationId,
    {
      publicMetadata: {
        ...context.existingPublicMetadata,
        schemaVersion: nextMetadata.schemaVersion,
        apps: nextMetadata.apps,
      },
    }
  );
}
