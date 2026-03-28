import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { linkTrueFansConnect } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/auth/truefans-connect/callback — handle TrueFans CONNECT callback
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "";
  const settingsUrl = `${baseUrl}/dashboard/settings`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code || !state) {
      return NextResponse.redirect(`${settingsUrl}?error=truefans-denied`);
    }

    // Decode userId from state
    const { userId } = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    );

    if (!userId) {
      return NextResponse.redirect(`${settingsUrl}?error=invalid-state`);
    }

    // Exchange code for tokens with TrueFans CONNECT
    const connectApiUrl = process.env.TRUEFANS_CONNECT_API_URL || "";

    const tokenRes = await fetch(`${connectApiUrl}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
      }),
    });

    if (!tokenRes.ok) {
      console.error(
        "TrueFans CONNECT token exchange failed:",
        await tokenRes.text()
      );
      return NextResponse.redirect(
        `${settingsUrl}?error=truefans-token-failed`
      );
    }

    const tokens = await tokenRes.json();

    // Verify the account by fetching profile
    const profileRes = await fetch(`${connectApiUrl}/api/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(
        `${settingsUrl}?error=truefans-verify-failed`
      );
    }

    const profile = await profileRes.json();
    const connectId = profile.id || profile.connectId;

    if (!connectId) {
      return NextResponse.redirect(
        `${settingsUrl}?error=truefans-verify-failed`
      );
    }

    // Link TrueFans CONNECT and upgrade to PRO
    await linkTrueFansConnect(userId, connectId);

    // Upsert connected account record
    const existing = await prisma.connectedAccount.findFirst({
      where: { userId, platform: "truefans_connect" },
    });

    const data = {
      platform: "truefans_connect",
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      tokenExpiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
      externalId: connectId,
      username: profile.name || profile.username || null,
    };

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.connectedAccount.create({ data });
    }

    return NextResponse.redirect(`${settingsUrl}?connected=truefans-connect`);
  } catch (error) {
    console.error("TrueFans CONNECT callback error:", error);
    return NextResponse.redirect(`${settingsUrl}?error=truefans-failed`);
  }
}
