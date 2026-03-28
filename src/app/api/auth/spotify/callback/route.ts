import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/auth/spotify/callback — handle Spotify OAuth callback
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
      return NextResponse.redirect(`${settingsUrl}?error=spotify-denied`);
    }

    // Decode userId from state
    const { userId } = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8")
    );

    if (!userId) {
      return NextResponse.redirect(`${settingsUrl}?error=invalid-state`);
    }

    // Exchange code for tokens
    const clientId = process.env.SPOTIFY_CLIENT_ID || "";
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
    const redirectUri = `${baseUrl}/api/auth/spotify/callback`;

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Spotify token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${settingsUrl}?error=spotify-token-failed`);
    }

    const tokens = await tokenRes.json();

    // Fetch Spotify user profile
    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = profileRes.ok ? await profileRes.json() : null;

    // Upsert connected account
    const existing = await prisma.connectedAccount.findFirst({
      where: { userId, platform: "spotify" },
    });

    const data = {
      platform: "spotify",
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      tokenExpiry: tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null,
      externalId: profile?.id || null,
      username: profile?.display_name || null,
    };

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await prisma.connectedAccount.create({ data });
    }

    return NextResponse.redirect(`${settingsUrl}?connected=spotify`);
  } catch (error) {
    console.error("Spotify callback error:", error);
    return NextResponse.redirect(`${settingsUrl}?error=spotify-failed`);
  }
}
