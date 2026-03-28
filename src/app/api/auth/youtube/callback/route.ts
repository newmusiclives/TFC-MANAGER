import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/auth/youtube/callback — handle YouTube/Google OAuth callback
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
      return NextResponse.redirect(`${settingsUrl}?error=youtube-denied`);
    }

    // Decode userId from state
    const { userId } = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    );

    if (!userId) {
      return NextResponse.redirect(`${settingsUrl}?error=invalid-state`);
    }

    // Exchange code for tokens
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = `${baseUrl}/api/auth/youtube/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) {
      console.error("YouTube token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${settingsUrl}?error=youtube-token-failed`);
    }

    const tokens = await tokenRes.json();

    // Fetch YouTube channel info
    const channelRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );

    const channelData = channelRes.ok ? await channelRes.json() : null;
    const channel = channelData?.items?.[0];

    // Upsert connected account
    const existing = await prisma.connectedAccount.findFirst({
      where: { userId, platform: "youtube" },
    });

    const data = {
      platform: "youtube",
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      tokenExpiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
      externalId: channel?.id || null,
      username: channel?.snippet?.title || null,
    };

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.connectedAccount.create({ data });
    }

    return NextResponse.redirect(`${settingsUrl}?connected=youtube`);
  } catch (error) {
    console.error("YouTube callback error:", error);
    return NextResponse.redirect(`${settingsUrl}?error=youtube-failed`);
  }
}
