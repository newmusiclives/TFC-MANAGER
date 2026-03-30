// ---------------------------------------------------------------------------
// TrueFans CONNECT Integration Service
// ---------------------------------------------------------------------------
// Bridges TrueFans MANAGER with the TrueFans CONNECT platform
// (https://truefansconnect.com). CONNECT handles geolocation-based show
// discovery, real-time fan donations (via Manifest Financials), "Know Your
// Fan" CRM, SMS/email comms, fan rewards/points, artist profiles, show pages,
// and venue partnerships. This service SYNCS data between the two platforms
// rather than duplicating CONNECT functionality.
// ---------------------------------------------------------------------------

import prisma from "@/lib/prisma";

// TRUEFANS_CONNECT_API_URL - e.g., "https://api.truefansconnect.com/v1"
// TRUEFANS_CONNECT_API_KEY - API key for TrueFans CONNECT

const CONNECT_API_URL =
  process.env.TRUEFANS_CONNECT_API_URL || "https://api.truefansconnect.com/v1";
const CONNECT_API_KEY = process.env.TRUEFANS_CONNECT_API_KEY || "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMockMode(): boolean {
  return !CONNECT_API_KEY;
}

function mockId(): string {
  return `tfc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function connectRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  if (isMockMode()) {
    throw new Error("MOCK_MODE");
  }

  const url = `${CONNECT_API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${CONNECT_API_KEY}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`TrueFans CONNECT API error ${res.status}: ${errorBody}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Account Linking
// ---------------------------------------------------------------------------

interface ConnectAccountInfo {
  exists: boolean;
  active: boolean;
  plan: string | null;
  connectId: string | null;
}

export async function verifyConnectAccount(
  email: string
): Promise<ConnectAccountInfo> {
  if (isMockMode()) {
    // Mock: pretend the account exists for demo purposes
    return {
      exists: true,
      active: true,
      plan: "artist_pro",
      connectId: mockId(),
    };
  }

  try {
    const data = await connectRequest<{
      exists: boolean;
      active: boolean;
      plan: string;
      id: string;
    }>(`/accounts/verify?email=${encodeURIComponent(email)}`);

    return {
      exists: data.exists,
      active: data.active,
      plan: data.plan,
      connectId: data.id,
    };
  } catch {
    return { exists: false, active: false, plan: null, connectId: null };
  }
}

export async function linkAccounts(
  userId: string,
  connectEmail: string
): Promise<{ success: boolean; connectId: string | null; error?: string }> {
  const account = await verifyConnectAccount(connectEmail);

  if (!account.exists) {
    return {
      success: false,
      connectId: null,
      error: "No TrueFans CONNECT account found for this email",
    };
  }

  if (!account.active) {
    return {
      success: false,
      connectId: null,
      error: "TrueFans CONNECT account is not active",
    };
  }

  // Update user: store connectId and upgrade to PRO
  await prisma.user.update({
    where: { id: userId },
    data: {
      truefansConnectId: account.connectId,
      plan: "PRO",
    },
  });

  // Notify CONNECT about the link (best-effort)
  if (!isMockMode()) {
    try {
      await connectRequest(`/accounts/${account.connectId}/link`, "POST", {
        managerUserId: userId,
      });
    } catch {
      // Non-fatal — the link is stored on our side regardless
    }
  }

  return { success: true, connectId: account.connectId };
}

export async function unlinkAccounts(
  userId: string
): Promise<{ success: boolean }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.truefansConnectId) {
    return { success: false };
  }

  // Notify CONNECT about the unlink (best-effort)
  if (!isMockMode()) {
    try {
      await connectRequest(
        `/accounts/${user.truefansConnectId}/unlink`,
        "POST",
        { managerUserId: userId }
      );
    } catch {
      // Non-fatal
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { truefansConnectId: null },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Data Sync: CONNECT -> Manager
// ---------------------------------------------------------------------------

interface ConnectShow {
  id: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  time?: string;
  capacity?: number;
  ticketsSold?: number;
  revenue?: number;
  status?: string;
}

export async function syncShowsFromConnect(connectId: string): Promise<{
  synced: number;
  skipped: number;
}> {
  let shows: ConnectShow[];

  if (isMockMode()) {
    shows = [
      {
        id: "cs_1",
        venue: "The Blue Note",
        city: "New York",
        country: "US",
        date: "2026-05-15",
        time: "20:00",
        capacity: 300,
        ticketsSold: 180,
        revenue: 5400,
        status: "confirmed",
      },
      {
        id: "cs_2",
        venue: "The Troubadour",
        city: "Los Angeles",
        country: "US",
        date: "2026-06-01",
        time: "21:00",
        capacity: 500,
        ticketsSold: 0,
        status: "announced",
      },
    ];
  } else {
    shows = await connectRequest<ConnectShow[]>(
      `/artists/${connectId}/shows`
    );
  }

  // Find the user linked to this connectId
  const user = await prisma.user.findUnique({
    where: { truefansConnectId: connectId },
  });
  if (!user) throw new Error("No user linked to this CONNECT account");

  // Get existing gigs to avoid duplicates (match on venue + date)
  const existingGigs = await prisma.gig.findMany({
    where: { userId: user.id },
    select: { venue: true, date: true },
  });

  const existingKeys = new Set(
    existingGigs.map((g) => `${g.venue}|${g.date.toISOString().slice(0, 10)}`)
  );

  let synced = 0;
  let skipped = 0;

  for (const show of shows) {
    const key = `${show.venue}|${show.date.slice(0, 10)}`;
    if (existingKeys.has(key)) {
      skipped++;
      continue;
    }

    await prisma.gig.create({
      data: {
        userId: user.id,
        venue: show.venue,
        city: show.city,
        country: show.country,
        date: new Date(show.date),
        time: show.time || null,
        capacity: show.capacity || null,
        ticketsSold: show.ticketsSold || 0,
        revenue: show.revenue || 0,
        status: show.status || "announced",
      },
    });
    synced++;
  }

  return { synced, skipped };
}

interface ConnectFan {
  id: string;
  email: string;
  name?: string;
  totalDonations?: number;
  showsAttended?: number;
  rewardPoints?: number;
  lastInteraction?: string;
}

export async function syncFansFromConnect(
  connectId: string,
  userId: string
): Promise<{ synced: number; skipped: number }> {
  let fans: ConnectFan[];

  if (isMockMode()) {
    fans = [
      {
        id: "fan_1",
        email: "superfan@example.com",
        name: "Jamie Rivera",
        totalDonations: 150,
        showsAttended: 8,
        rewardPoints: 2400,
      },
      {
        id: "fan_2",
        email: "musiclover@example.com",
        name: "Alex Chen",
        totalDonations: 45,
        showsAttended: 3,
        rewardPoints: 800,
      },
    ];
  } else {
    fans = await connectRequest<ConnectFan[]>(
      `/artists/${connectId}/fans`
    );
  }

  let synced = 0;
  let skipped = 0;

  for (const fan of fans) {
    // Check if subscriber already exists for this user + email
    const existing = await prisma.subscriber.findUnique({
      where: { userId_email: { userId, email: fan.email } },
    });

    if (existing) {
      // Update engagement score based on CONNECT activity
      const activityScore = Math.min(
        100,
        (fan.showsAttended || 0) * 5 + (fan.totalDonations || 0) / 10
      );
      const newScore = Math.round(
        (existing.engagementScore + activityScore) / 2
      );

      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          engagementScore: newScore,
          tags: {
            ...(existing.tags as Record<string, unknown> || {}),
            truefansConnect: true,
            connectShowsAttended: fan.showsAttended || 0,
          },
        },
      });
      skipped++;
      continue;
    }

    await prisma.subscriber.create({
      data: {
        userId,
        email: fan.email,
        name: fan.name || null,
        source: "truefans_connect",
        status: "active",
        engagementScore: Math.min(
          100,
          50 + (fan.showsAttended || 0) * 5
        ),
        tags: {
          truefansConnect: true,
          connectFanId: fan.id,
          connectShowsAttended: fan.showsAttended || 0,
          connectRewardPoints: fan.rewardPoints || 0,
        },
      },
    });
    synced++;
  }

  return { synced, skipped };
}

interface ConnectDonation {
  id: string;
  amount: number;
  currency: string;
  donorEmail: string;
  donorName?: string;
  date: string;
  showId?: string;
}

export async function syncDonationsFromConnect(
  connectId: string,
  userId: string
): Promise<{ synced: number; total: number }> {
  let donations: ConnectDonation[];

  if (isMockMode()) {
    donations = [
      {
        id: "don_1",
        amount: 25.0,
        currency: "USD",
        donorEmail: "superfan@example.com",
        donorName: "Jamie Rivera",
        date: "2026-03-15",
      },
      {
        id: "don_2",
        amount: 10.0,
        currency: "USD",
        donorEmail: "musiclover@example.com",
        date: "2026-03-20",
        showId: "cs_1",
      },
    ];
  } else {
    donations = await connectRequest<ConnectDonation[]>(
      `/artists/${connectId}/donations`
    );
  }

  // Get existing CONNECT earnings to avoid duplicates
  const existingEarnings = await prisma.earning.findMany({
    where: { userId, platform: "truefans_connect" },
    select: { manifestTxId: true },
  });

  const existingTxIds = new Set(
    existingEarnings.map((e) => e.manifestTxId).filter(Boolean)
  );

  let synced = 0;
  let total = 0;

  for (const donation of donations) {
    total += donation.amount;

    if (existingTxIds.has(donation.id)) continue;

    const period = donation.date.slice(0, 7); // "2026-03"

    await prisma.earning.create({
      data: {
        userId,
        platform: "truefans_connect",
        amount: donation.amount,
        currency: donation.currency || "USD",
        period,
        manifestTxId: donation.id, // Store CONNECT donation ID for dedup
      },
    });
    synced++;
  }

  return { synced, total };
}

interface ConnectAnalytics {
  totalShows: number;
  totalAttendees: number;
  totalDonations: number;
  donationTotal: number;
  fanCount: number;
  fanGrowthRate: number; // percentage
  topCities: { city: string; count: number }[];
  recentActivity: { type: string; detail: string; date: string }[];
}

export async function getConnectAnalytics(
  connectId: string
): Promise<ConnectAnalytics> {
  if (isMockMode()) {
    return {
      totalShows: 24,
      totalAttendees: 3850,
      totalDonations: 142,
      donationTotal: 4280.5,
      fanCount: 312,
      fanGrowthRate: 12.5,
      topCities: [
        { city: "New York", count: 8 },
        { city: "Los Angeles", count: 5 },
        { city: "Chicago", count: 4 },
        { city: "Nashville", count: 3 },
      ],
      recentActivity: [
        {
          type: "donation",
          detail: "Jamie Rivera donated $25.00",
          date: "2026-03-15",
        },
        {
          type: "checkin",
          detail: "18 fans checked in at The Blue Note",
          date: "2026-03-10",
        },
      ],
    };
  }

  return connectRequest<ConnectAnalytics>(
    `/artists/${connectId}/analytics`
  );
}

// ---------------------------------------------------------------------------
// Data Sync: Manager -> CONNECT
// ---------------------------------------------------------------------------

export async function pushReleaseToConnect(
  connectId: string,
  release: { title: string; date: string; smartLinkUrl?: string }
): Promise<{ success: boolean; connectReleaseId?: string }> {
  if (isMockMode()) {
    return { success: true, connectReleaseId: mockId() };
  }

  try {
    const data = await connectRequest<{ id: string }>(
      `/artists/${connectId}/releases`,
      "POST",
      {
        title: release.title,
        releaseDate: release.date,
        smartLinkUrl: release.smartLinkUrl || null,
      }
    );
    return { success: true, connectReleaseId: data.id };
  } catch {
    return { success: false };
  }
}

export async function pushShowToConnect(
  connectId: string,
  gig: { venue: string; city: string; date: string; time?: string }
): Promise<{ success: boolean; connectShowId?: string }> {
  if (isMockMode()) {
    return { success: true, connectShowId: mockId() };
  }

  try {
    const data = await connectRequest<{ id: string }>(
      `/artists/${connectId}/shows`,
      "POST",
      {
        venue: gig.venue,
        city: gig.city,
        date: gig.date,
        time: gig.time || null,
      }
    );
    return { success: true, connectShowId: data.id };
  } catch {
    return { success: false };
  }
}

// ---------------------------------------------------------------------------
// Combined Features
// ---------------------------------------------------------------------------

interface UnifiedFanProfile {
  email: string;
  name: string | null;
  // From CONNECT
  connectData: {
    totalDonations: number;
    showsAttended: number;
    rewardPoints: number;
    lastCheckin: string | null;
  } | null;
  // From Manager
  managerData: {
    engagementScore: number;
    source: string | null;
    subscribedAt: string;
    tags: unknown;
  } | null;
  // Merged
  combined: {
    lifetimeValue: number;
    totalTouchpoints: number;
    isSuperfan: boolean;
  };
}

export async function getUnifiedFanProfile(
  email: string,
  userId: string
): Promise<UnifiedFanProfile> {
  // Get Manager subscriber data
  const subscriber = await prisma.subscriber.findUnique({
    where: { userId_email: { userId, email } },
  });

  // Get CONNECT fan data
  const user = await prisma.user.findUnique({ where: { id: userId } });
  let connectFan: ConnectFan | null = null;

  if (user?.truefansConnectId) {
    if (isMockMode()) {
      connectFan = {
        id: "fan_mock",
        email,
        name: subscriber?.name || "Fan",
        totalDonations: 85,
        showsAttended: 5,
        rewardPoints: 1200,
        lastInteraction: "2026-03-20",
      };
    } else {
      try {
        connectFan = await connectRequest<ConnectFan>(
          `/artists/${user.truefansConnectId}/fans/${encodeURIComponent(email)}`
        );
      } catch {
        connectFan = null;
      }
    }
  }

  const donationTotal = connectFan?.totalDonations || 0;
  const showsAttended = connectFan?.showsAttended || 0;
  const engagementScore = subscriber?.engagementScore || 0;

  return {
    email,
    name: subscriber?.name || connectFan?.name || null,
    connectData: connectFan
      ? {
          totalDonations: connectFan.totalDonations || 0,
          showsAttended: connectFan.showsAttended || 0,
          rewardPoints: connectFan.rewardPoints || 0,
          lastCheckin: connectFan.lastInteraction || null,
        }
      : null,
    managerData: subscriber
      ? {
          engagementScore: subscriber.engagementScore,
          source: subscriber.source,
          subscribedAt: subscriber.createdAt.toISOString(),
          tags: subscriber.tags,
        }
      : null,
    combined: {
      lifetimeValue: donationTotal,
      totalTouchpoints: showsAttended + (subscriber ? 1 : 0),
      isSuperfan:
        donationTotal > 100 || showsAttended >= 5 || engagementScore >= 80,
    },
  };
}

export async function syncAll(
  userId: string,
  connectId: string
): Promise<{
  shows: { synced: number; skipped: number };
  fans: { synced: number; skipped: number };
  donations: { synced: number; total: number };
}> {
  const [shows, fans, donations] = await Promise.all([
    syncShowsFromConnect(connectId),
    syncFansFromConnect(connectId, userId),
    syncDonationsFromConnect(connectId, userId),
  ]);

  // Also push Manager releases to CONNECT (best-effort)
  try {
    const releases = await prisma.release.findMany({
      where: { userId, status: "LIVE" },
      select: { title: true, releaseDate: true },
      orderBy: { releaseDate: "desc" },
      take: 10,
    });

    for (const release of releases) {
      if (release.releaseDate) {
        await pushReleaseToConnect(connectId, {
          title: release.title,
          date: release.releaseDate.toISOString().slice(0, 10),
        });
      }
    }
  } catch {
    // Non-fatal — release push is best-effort
  }

  return { shows, fans, donations };
}
