import {
  auth,
  clerkClient,
  reverificationErrorResponse,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const { userId, has } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!has({ reverification: "strict" })) {
    return reverificationErrorResponse("strict");
  }

  try {
    const client = await clerkClient();
    await client.users.disableUserMFA(userId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "We couldn't disable two-factor authentication." },
      { status: 500 }
    );
  }
}
