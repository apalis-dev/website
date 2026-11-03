
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  MailPlusIcon,
  UserMinusIcon,
  XIcon,
  UsersIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  inviteWorkspaceMemberAction,
  removeWorkspaceMemberAction,
  revokeWorkspaceInvitationAction,
} from "@/app/dashboard/settings/actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WorkspaceInvitation,
  WorkspaceMember,
} from "@/lib/dashboard/types";
import { useWorkspace } from "@/lib/dashboard/workspace-context";
import { getWorkspaceLimits } from "@/lib/workspace/policy";
import { getErrorMessage } from "./utils";

const INVITABLE_ROLES = [
  { value: "org:member", label: "Member" },
  { value: "org:admin", label: "Admin" },
] as const;

const roleSchema = z.enum(["org:member", "org:admin"]);

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

const inviteSchema = z.object({
  email: normalizedEmailSchema,
  role: roleSchema,
});

type InviteValues = z.infer<typeof inviteSchema>;

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "?";
}

function getRoleLabel(role: string) {
  const normalizedRole = role.replace(/^org:/, "");

  switch (normalizedRole) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    default:
      return normalizedRole.charAt(0).toUpperCase() +
        normalizedRole.slice(1);
  }
}

function getRoleBadgeVariant(role: string) {
  const normalizedRole = role.replace(/^org:/, "");

  if (normalizedRole === "owner") return "default" as const;
  if (normalizedRole === "admin") return "secondary" as const;

  return "outline" as const;
}

function EmptyMembersState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-8 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
        <UsersIcon className="size-5 text-muted-foreground" />
      </div>

      <p className="text-sm font-medium">No workspace members yet</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Invite someone to collaborate with you in this workspace.
      </p>
    </div>
  );
}

function InviteMemberForm() {
  const router = useRouter();
  const { canManageMembers, canInviteMember } = useWorkspace();

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "org:member",
    },
  });

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = form;

  const email = form.watch("email");

  if (!canManageMembers) {
    return (
      <div className="rounded-lg border border-dashed p-3">
        <p className="text-sm text-muted-foreground">
          Only workspace admins can invite or remove members.
        </p>
      </div>
    );
  }

  if (!canInviteMember) {
    return (
      <div className="rounded-lg border border-dashed p-3">
        <p className="text-sm font-medium">No available seats</p>
        <p className="mt-1 text-sm text-muted-foreground">
          All purchased seats are reserved. Upgrade your plan or revoke a
          pending invitation to free a seat.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: InviteValues) => {
    clearErrors("root");

    try {
      const result = await inviteWorkspaceMemberAction({
        emailAddress: values.email,
        role: values.role,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast.success(`Invitation sent to ${values.email}.`);

      reset({
        email: "",
        role: "org:member",
      });

      router.refresh();
    } catch (inviteError) {
      const message = getErrorMessage(
        inviteError,
        "We couldn't send this invitation."
      );

      setError("root", {
        type: "server",
        message,
      });

      toast.error(message);
    }
  };

  return (
    <div className="space-y-3 border-t pt-4">
      <div>
        <h3 className="text-sm font-medium">Invite a member</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add someone to your workspace by email.
        </p>
      </div>

      <Form {...form}>
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-w-0 flex-1">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="teammate@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full sm:w-36">
                <FormLabel>Role</FormLabel>
                <Select
                  value={field.value}
                  items={Object.fromEntries(
                    INVITABLE_ROLES.map((option) => [
                      option.value,
                      option.label,
                    ])
                  )}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {INVITABLE_ROLES.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="shrink-0"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <MailPlusIcon className="size-4" />
            )}
            {isSubmitting ? "Sending..." : "Send invite"}
          </Button>
        </form>

        {errors.root?.message && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}
      </Form>
    </div>
  );
}

export function WorkspaceMembersCard() {
  const { userId } = useAuth();

  const {
    workspace,
    canManageMembers,
    currentMemberRole,
  } = useWorkspace();

  const router = useRouter();

  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [revokingInvitationId, setRevokingInvitationId] =
    useState<string | null>(null);

  const memberLimit =
    workspace.subscription.plan === "Free" ||
    workspace.subscription.seats === 0
      ? getWorkspaceLimits(workspace.plan).includedSeats
      : workspace.subscription.seats;

  const pendingInvitationCount = workspace.pendingInvitations.length;
  const activeMemberCount = workspace.members.length;
  const reservedSeats = activeMemberCount + pendingInvitationCount;

  const canRemoveMember = (member: WorkspaceMember) =>
    canManageMembers &&
    member.id !== userId &&
    member.role !== "owner" &&
    (currentMemberRole === "owner" || member.role === "member");

  const handleRemove = async (
    userIdToRemove: string,
    name: string
  ) => {
    setRemovingUserId(userIdToRemove);

    try {
      const result = await removeWorkspaceMemberAction({
        userId: userIdToRemove,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast.success(`${name} was removed from ${workspace.name}.`);

      router.refresh();
    } catch (removeError) {
      toast.error(
        getErrorMessage(
          removeError,
          "We couldn't remove this member."
        )
      );
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleRevokeInvitation = async (
    invitation: WorkspaceInvitation
  ) => {
    setRevokingInvitationId(invitation.id);

    try {
      const result = await revokeWorkspaceInvitationAction({
        invitationId: invitation.id,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast.success(
        `Invitation for ${invitation.email} was revoked.`
      );

      router.refresh();
    } catch (revokeError) {
      toast.error(
        getErrorMessage(
          revokeError,
          "We couldn't revoke this invitation."
        )
      );
    } finally {
      setRevokingInvitationId(null);
    }
  };

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Members</CardTitle>
            <CardDescription>
              Manage who has access to this workspace.
            </CardDescription>
          </div>

          <Badge variant="outline" className="shrink-0 tabular-nums">
            {reservedSeats}/{memberLimit} seats
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground">
          {activeMemberCount} active
          {pendingInvitationCount > 0 &&
            ` · ${pendingInvitationCount} pending`}
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {activeMemberCount === 0 ? (
          <EmptyMembersState />
        ) : (
          <ul className="divide-y">
            {workspace.members.map((member) => {
              const isRemoving = removingUserId === member.id;
              const removable = canRemoveMember(member);

              return (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-9 shrink-0">
                      {member.avatar && (
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                        />
                      )}

                      <AvatarFallback>
                        {getInitials(member.name || member.email)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name || "Unnamed member"}
                        {member.id === userId && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">
                            You
                          </span>
                        )}
                      </p>

                      <p className="truncate text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {getRoleLabel(member.role)}
                    </Badge>

                    {removable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isRemoving}
                        onClick={() =>
                          handleRemove(member.id, member.name)
                        }
                        aria-label={`Remove ${member.name}`}
                      >
                        {isRemoving ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <UserMinusIcon className="size-4" />
                        )}

                        <span className="hidden sm:inline">
                          Remove
                        </span>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pendingInvitationCount > 0 && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-medium">
                  Pending invitations
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  People who haven't joined yet.
                </p>
              </div>

              <Badge variant="secondary">
                {pendingInvitationCount}
              </Badge>
            </div>

            <ul className="divide-y rounded-lg border px-3">
              {workspace.pendingInvitations.map((invitation) => {
                const isRevoking =
                  revokingInvitationId === invitation.id;

                return (
                  <li
                    key={invitation.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {invitation.email}
                      </p>

                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Invited as {getRoleLabel(invitation.role)}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary">Pending</Badge>

                      {canManageMembers && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isRevoking}
                          onClick={() =>
                            handleRevokeInvitation(invitation)
                          }
                          aria-label={`Revoke invitation for ${invitation.email}`}
                        >
                          {isRevoking ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <XIcon className="size-4" />
                          )}

                          <span className="hidden sm:inline">
                            Revoke
                          </span>
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <InviteMemberForm />
      </CardContent>
    </Card>
  );
}
