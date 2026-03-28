import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  verifyConnectAccount,
  linkAccounts,
  unlinkAccounts,
} from "@/lib/services/truefans-connect-service";

// ---------------------------------------------------------------------------
// POST /api/truefans-connect/link — Link TrueFans CONNECT account
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { connectEmail } = body;

    if (!connectEmail || typeof connectEmail !== "string") {
      return NextResponse.json(
        { error: "connectEmail is required" },
        { status: 400 }
      );
    }

    // Verify CONNECT account exists
    const account = await verifyConnectAccount(connectEmail);

    if (!account.exists) {
      return NextResponse.json(
        {
          error:
            "No TrueFans CONNECT account found for this email. Sign up at https://truefansconnect.com",
        },
        { status: 404 }
      );
    }

    if (!account.active) {
      return NextResponse.json(
        { error: "TrueFans CONNECT account is not active" },
        { status: 400 }
      );
    }

    // Link the accounts and upgrade to PRO
    const result = await linkAccounts(user.id, connectEmail);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to link accounts" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      connectId: result.connectId,
      plan: "PRO",
      message:
        "TrueFans CONNECT account linked successfully. Your plan has been upgraded to PRO.",
    });
  } catch (error) {
    console.error("[truefans-connect/link] POST error:", error);
    return NextResponse.json(
      { error: "Failed to link TrueFans CONNECT account" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/truefans-connect/link — Unlink TrueFans CONNECT account
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await unlinkAccounts(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: "No linked TrueFans CONNECT account found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "TrueFans CONNECT account unlinked successfully.",
    });
  } catch (error) {
    console.error("[truefans-connect/link] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to unlink TrueFans CONNECT account" },
      { status: 500 }
    );
  }
}
