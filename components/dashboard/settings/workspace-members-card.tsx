"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { LoaderCircle, MailPlusIcon, UserMinusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import {
  inviteWorkspaceMemberAction,
  removeWorkspaceMemberAction,
  revokeWorkspaceInvitationAction,
} from "@/app/dashboard/settings/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type InviteRole = (typeof INVITABLE_ROLES)[number]["value"];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function WorkspaceMembersCard() {
  const { userId } = useAuth();
  const {
    workspace,
    canInviteMember,
    canManageMembers,
    currentMemberRole,
  } = useWorkspace();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("org:member");
  const [inviting, setInviting] = useState(false);
  const [invitingError, setInvitingError] = useState<string | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [revokingInvitationId, setRevokingInvitationId] = useState<
    string | null
  >(null);

  const memberLimit =
    workspace.subscription.plan === "Free" || workspace.subscription.seats === 0
      ? getWorkspaceLimits(workspace.plan).includedSeats
      : workspace.subscription.seats;
  const pendingInvitationCount = workspace.pendingInvitations.length;
  const reservedSeats = workspace.members.length + pendingInvitationCount;
  const canRemoveMember = (member: WorkspaceMember) =>
    canManageMembers &&
    member.id !== userId &&
    member.role !== "owner" &&
    (currentMemberRole === "owner" || member.role === "member");

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Enter an email address to invite.");
      return;
    }

    setInviting(true);
    setInvitingError(null);

    try {
      const result = await inviteWorkspaceMemberAction({
        emailAddress: trimmedEmail,
        role,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast.success(`Invitation sent to ${trimmedEmail}.`);
      setEmail("");
      router.refresh();
    } catch (inviteError) {
      setInvitingError(
        getErrorMessage(inviteError, "We couldn't send this invitation.")
      );
      toast.error(
        getErrorMessage(inviteError, "We couldn't send this invitation.")
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userIdToRemove: string, name: string) => {
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
        getErrorMessage(removeError, "We couldn't remove this member.")
      );
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleRevokeInvitation = async (invitation: WorkspaceInvitation) => {
    setRevokingInvitationId(invitation.id);

    try {
      const result = await revokeWorkspaceInvitationAction({
        invitationId: invitation.id,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      toast.success(`Invitation for ${invitation.email} was revoked.`);
      router.refresh();
    } catch (revokeError) {
      toast.error(
        getErrorMessage(revokeError, "We couldn't revoke this invitation.")
      );
    } finally {
      setRevokingInvitationId(null);
    }
  };

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {reservedSeats} of {memberLimit} seat
          {memberLimit === 1 ? "" : "s"} reserved
          {pendingInvitationCount > 0
            ? ` · ${workspace.members.length} active, ${pendingInvitationCount} pending`
            : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y">
          {workspace.members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-8 shrink-0">
                  {member.avatar && (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  )}
                  <AvatarFallback>
                    {getInitials(member.name || member.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="outline">{member.role}</Badge>

                {canRemoveMember(member) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={removingUserId === member.id}
                    onClick={() => handleRemove(member.id, member.name)}
                  >
                    {removingUserId === member.id ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <UserMinusIcon />
                    )}
                    Remove
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {workspace.pendingInvitations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Pending invitations</p>
            <ul className="divide-y rounded-lg border px-3">
              {workspace.pendingInvitations.map((invitation) => (
                <li
                  key={invitation.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {invitation.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invited as {invitation.role}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary">pending</Badge>

                    {canManageMembers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={revokingInvitationId === invitation.id}
                        onClick={() => handleRevokeInvitation(invitation)}
                      >
                        {revokingInvitationId === invitation.id ? (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        ) : (
                          <XIcon />
                        )}
                        Revoke
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {canManageMembers && canInviteMember && (
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={handleInvite}
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="invite-member-email">Invite by email</Label>
              <Input
                id="invite-member-email"
                type="email"
                placeholder="teammate@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="w-full space-y-2 sm:w-40">
              <Label htmlFor="invite-member-role">Role</Label>
              <Select
                value={role}
                items={{
                  "org:member": "Member",
                  "org:admin": "Admin",
                }}
                onValueChange={(value) => setRole(value as InviteRole)}
              >
                <SelectTrigger id="invite-member-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INVITABLE_ROLES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={inviting || !email.trim()}>
              {inviting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <MailPlusIcon />
              )}
              {inviting ? "Sending…" : "Invite"}
            </Button>
          </form>
        )}

        {invitingError && (
          <p role="alert" className="text-sm text-destructive">
            {invitingError}
          </p>
        )}

        {canManageMembers && !canInviteMember && (
          <p className="text-sm text-muted-foreground">
            All purchased seats are reserved. Upgrade the plan or revoke a
            pending invitation to free a seat.
          </p>
        )}

        {!canManageMembers && (
          <p className="text-sm text-muted-foreground">
            Only workspace admins can invite or remove members.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
