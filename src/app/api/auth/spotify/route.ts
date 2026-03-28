import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/auth/spotify — redirect to Spotify OAuth authorization
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || "";
  const baseUrl = process.env.NEXTAUTH_URL || "";

  if (!clientId || clientId.includes("your-") || !baseUrl) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=not-configured", baseUrl || request.url)
    );
  }

  const redirectUri = `${baseUrl}/api/auth/spotify/callback`;
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-read-recently-played",
    "streaming",
  ].join(" ");

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString(
    "base64url"
  );

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
