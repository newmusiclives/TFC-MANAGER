import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/auth/ghl/callback — handle GoHighLevel OAuth callback
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "";
  const integrationsUrl = `${baseUrl}/dashboard/integrations`;

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(`${integrationsUrl}?error=ghl-denied`);
    }

    // Decode userId from state
    const { userId } = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    );

    if (!userId) {
      return NextResponse.redirect(`${integrationsUrl}?error=invalid-state`);
    }

    // Exchange code for tokens
    const clientId = process.env.GHL_CLIENT_ID || "";
    const clientSecret = process.env.GHL_CLIENT_SECRET || "";

    const tokenRes = await fetch(
      "https://services.leadconnectorhq.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      }
    );

    if (!tokenRes.ok) {
      console.error("GHL token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${integrationsUrl}?error=ghl-token-failed`);
    }

    const tokens = await tokenRes.json();

    // Upsert connected account
    const existing = await prisma.connectedAccount.findFirst({
      where: { userId, platform: "gohighlevel" },
    });

    const data = {
      platform: "gohighlevel",
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      tokenExpiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
      externalId: tokens.locationId || tokens.companyId || null,
      username: null,
    };

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.connectedAccount.create({ data });
    }

    return NextResponse.redirect(`${integrationsUrl}?connected=ghl`);
  } catch (error) {
    console.error("GHL callback error:", error);
    return NextResponse.redirect(`${integrationsUrl}?error=ghl-failed`);
  }
}
