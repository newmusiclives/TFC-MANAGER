// ---------------------------------------------------------------------------
// Streaming Platform Integration Service
// ---------------------------------------------------------------------------

import prisma from "@/lib/prisma";

const SPOTIFY_API = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const APPLE_MUSIC_API = "https://api.music.apple.com/v1";
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

// ---------------------------------------------------------------------------
// Mock data helpers
// ---------------------------------------------------------------------------

function mockSpotifyArtist() {
  return {
    id: "mock_spotify_artist",
    name: "Artist",
    followers: { total: 12400 },
    monthlyListeners: 28500,
    images: [{ url: "https://via.placeholder.com/300", width: 300, height: 300 }],
    topTracks: [
      { name: "Summer Nights", streams: 45200, id: "t1" },
      { name: "Midnight Drive", streams: 32100, id: "t2" },
      { name: "Golden Hour", streams: 28700, id: "t3" },
    ],
    genres: ["pop", "indie"],
  };
}

function mockSpotifyStats() {
  return {
    totalStreams: 128500,
    monthlyListeners: 28500,
    followers: 12400,
    saveRate: 24.3,
    topTracks: [
      { name: "Summer Nights", streams: 45200 },
      { name: "Midnight Drive", streams: 32100 },
      { name: "Golden Hour", streams: 28700 },
    ],
    topCountries: [
      { country: "US", listeners: 12000 },
      { country: "UK", listeners: 5400 },
      { country: "DE", listeners: 3200 },
    ],
    demographics: {
      age: { "18-24": 35, "25-34": 42, "35-44": 15, "45+": 8 },
      gender: { male: 48, female: 49, other: 3 },
    },
  };
}

function mockAppleMusicData() {
  return {
    streams: 42300,
    listeners: 8900,
    shazams: 1200,
    topSongs: [
      { name: "Summer Nights", plays: 15200 },
      { name: "Midnight Drive", plays: 11800 },
    ],
    topCities: [
      { city: "Los Angeles", listeners: 2100 },
      { city: "London", listeners: 1800 },
    ],
  };
}

function mockYouTubeStats() {
  return {
    channelId: "mock_channel",
    subscriberCount: 5400,
    viewCount: 324000,
    videoCount: 28,
    recentVideos: [
      { title: "Summer Nights (Official Video)", views: 45000, likes: 3200 },
      { title: "Midnight Drive (Lyric Video)", views: 22000, likes: 1800 },
    ],
  };
}

// ---------------------------------------------------------------------------
// getSpotifyArtistData
// ---------------------------------------------------------------------------

export async function getSpotifyArtistData(accessToken: string) {
  if (!accessToken || accessToken === "mock") {
    return mockSpotifyArtist();
  }

  try {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const [profileRes, topTracksRes] = await Promise.all([
      fetch(`${SPOTIFY_API}/me`, { headers }),
      fetch(`${SPOTIFY_API}/me/top/tracks?limit=10&time_range=medium_term`, {
        headers,
      }),
    ]);

    if (!profileRes.ok || !topTracksRes.ok) {
      throw new Error("Spotify API request failed");
    }

    const profile = await profileRes.json();
    const topTracks = await topTracksRes.json();

    return {
      id: profile.id,
      name: profile.display_name,
      followers: profile.followers,
      images: profile.images,
      topTracks: topTracks.items?.map(
        (t: { name: string; popularity: number; id: string }) => ({
          name: t.name,
          streams: t.popularity * 1000, // approximate
          id: t.id,
        })
      ),
      genres: profile.genres || [],
    };
  } catch (error) {
    console.error("Spotify artist data error:", error);
    return mockSpotifyArtist();
  }
}

// ---------------------------------------------------------------------------
// getSpotifyStreamingStats
// ---------------------------------------------------------------------------

export async function getSpotifyStreamingStats(
  accessToken: string,
  timeRange: string = "medium_term"
) {
  if (!accessToken || accessToken === "mock") {
    return mockSpotifyStats();
  }

  try {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const [topTracksRes, topArtistsRes] = await Promise.all([
      fetch(
        `${SPOTIFY_API}/me/top/tracks?limit=20&time_range=${timeRange}`,
        { headers }
      ),
      fetch(
        `${SPOTIFY_API}/me/top/artists?limit=10&time_range=${timeRange}`,
        { headers }
      ),
    ]);

    if (!topTracksRes.ok || !topArtistsRes.ok) {
      throw new Error("Spotify stats request failed");
    }

    const topTracks = await topTracksRes.json();
    const topArtists = await topArtistsRes.json();

    const totalStreams = topTracks.items?.reduce(
      (sum: number, t: { popularity: number }) => sum + t.popularity * 1000,
      0
    );

    return {
      totalStreams,
      topTracks: topTracks.items?.slice(0, 5).map(
        (t: { name: string; popularity: number }) => ({
          name: t.name,
          streams: t.popularity * 1000,
        })
      ),
      topArtists: topArtists.items?.slice(0, 5).map(
        (a: { name: string; followers: { total: number } }) => ({
          name: a.name,
          followers: a.followers?.total,
        })
      ),
    };
  } catch (error) {
    console.error("Spotify streaming stats error:", error);
    return mockSpotifyStats();
  }
}

// ---------------------------------------------------------------------------
// getAppleMusicData
// ---------------------------------------------------------------------------

export async function getAppleMusicData(token: string) {
  if (!token || token === "mock") {
    return mockAppleMusicData();
  }

  try {
    const res = await fetch(`${APPLE_MUSIC_API}/me/recent/played/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Music-User-Token": token,
      },
    });

    if (!res.ok) {
      throw new Error("Apple Music API request failed");
    }

    const data = await res.json();

    return {
      streams: data.meta?.total || 0,
      recentTracks: data.data?.map(
        (t: { attributes: { name: string; artistName: string } }) => ({
          name: t.attributes.name,
          artist: t.attributes.artistName,
        })
      ),
    };
  } catch (error) {
    console.error("Apple Music data error:", error);
    return mockAppleMusicData();
  }
}

// ---------------------------------------------------------------------------
// getYouTubeStats
// ---------------------------------------------------------------------------

export async function getYouTubeStats(apiKey: string, channelId: string) {
  if (!apiKey || apiKey === "mock") {
    return mockYouTubeStats();
  }

  try {
    const [channelRes, videosRes] = await Promise.all([
      fetch(
        `${YOUTUBE_API}/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`
      ),
      fetch(
        `${YOUTUBE_API}/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${apiKey}`
      ),
    ]);

    if (!channelRes.ok || !videosRes.ok) {
      throw new Error("YouTube API request failed");
    }

    const channelData = await channelRes.json();
    const videosData = await videosRes.json();

    const channel = channelData.items?.[0];
    const stats = channel?.statistics;

    return {
      channelId,
      subscriberCount: parseInt(stats?.subscriberCount || "0", 10),
      viewCount: parseInt(stats?.viewCount || "0", 10),
      videoCount: parseInt(stats?.videoCount || "0", 10),
      recentVideos: videosData.items?.map(
        (v: { snippet: { title: string }; id: { videoId: string } }) => ({
          title: v.snippet.title,
          videoId: v.id.videoId,
        })
      ),
    };
  } catch (error) {
    console.error("YouTube stats error:", error);
    return mockYouTubeStats();
  }
}

// ---------------------------------------------------------------------------
// refreshSpotifyToken
// ---------------------------------------------------------------------------

export async function refreshSpotifyToken(refreshToken: string) {
  if (
    !SPOTIFY_CLIENT_ID ||
    !SPOTIFY_CLIENT_SECRET ||
    !refreshToken ||
    refreshToken === "mock"
  ) {
    return {
      accessToken: "mock_refreshed_token",
      expiresIn: 3600,
      refreshToken,
    };
  }

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Spotify token");
  }

  const data = await res.json();

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token || refreshToken,
  };
}

// ---------------------------------------------------------------------------
// aggregateStats
// ---------------------------------------------------------------------------

export async function aggregateStats(userId: string) {
  // Fetch all connected accounts for the user
  const connectedAccounts = await prisma.connectedAccount.findMany({
    where: { userId },
  });

  let totalStreams = 0;
  let monthlyListeners = 0;
  let followers = 0;
  let saveRate = 0;
  const platformBreakdown: Record<string, number> = {};
  let topCountries: { country: string; listeners: number }[] = [];
  let demographics: Record<string, unknown> = {};

  for (const account of connectedAccounts) {
    try {
      if (account.platform === "spotify" && account.accessToken) {
        // Refresh token if needed
        let accessToken = account.accessToken;
        if (account.tokenExpiry && new Date(account.tokenExpiry) < new Date()) {
          if (account.refreshToken) {
            const refreshed = await refreshSpotifyToken(account.refreshToken);
            accessToken = refreshed.accessToken;
            await prisma.connectedAccount.update({
              where: { id: account.id },
              data: {
                accessToken: refreshed.accessToken,
                refreshToken: refreshed.refreshToken,
                tokenExpiry: new Date(
                  Date.now() + refreshed.expiresIn * 1000
                ),
              },
            });
          }
        }

        const stats = await getSpotifyStreamingStats(accessToken);
        const spotifyStreams = stats.totalStreams || 0;
        platformBreakdown.spotify = spotifyStreams;
        totalStreams += spotifyStreams;

        if ("monthlyListeners" in stats) {
          monthlyListeners += (stats as { monthlyListeners: number }).monthlyListeners;
        }
        if ("followers" in stats) {
          followers += (stats as { followers: number }).followers;
        }
        if ("saveRate" in stats) {
          saveRate = (stats as { saveRate: number }).saveRate;
        }
        if ("topCountries" in stats) {
          topCountries = (stats as { topCountries: typeof topCountries }).topCountries;
        }
        if ("demographics" in stats) {
          demographics = (stats as { demographics: Record<string, unknown> }).demographics;
        }
      }

      if (account.platform === "apple_music" && account.accessToken) {
        const appleData = await getAppleMusicData(account.accessToken);
        const appleStreams = appleData.streams || 0;
        platformBreakdown.apple_music = appleStreams;
        totalStreams += appleStreams;
      }

      if (account.platform === "youtube" && account.externalId) {
        const ytApiKey = process.env.YOUTUBE_API_KEY || "mock";
        const ytData = await getYouTubeStats(ytApiKey, account.externalId);
        platformBreakdown.youtube = ytData.viewCount || 0;
        followers += ytData.subscriberCount || 0;
      }
    } catch (error) {
      console.error(
        `Error aggregating stats for platform ${account.platform}:`,
        error
      );
    }
  }

  // If no connected accounts, use mock data
  if (connectedAccounts.length === 0) {
    const mockStats = mockSpotifyStats();
    totalStreams = mockStats.totalStreams;
    monthlyListeners = mockStats.monthlyListeners;
    followers = mockStats.followers;
    saveRate = mockStats.saveRate;
    topCountries = mockStats.topCountries;
    demographics = mockStats.demographics;
    platformBreakdown.spotify = mockStats.totalStreams;
  }

  // Save snapshot to DB
  const snapshot = await prisma.analyticsSnapshot.create({
    data: {
      userId,
      date: new Date(),
      totalStreams,
      monthlyListeners,
      followers,
      saveRate,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      platformBreakdown: platformBreakdown as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topCountries: topCountries as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      demographics: demographics as any,
    },
  });

  return snapshot;
}
