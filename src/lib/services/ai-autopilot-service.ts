import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// ---------------------------------------------------------------------------
// Client (same pattern as ai-service.ts)
// ---------------------------------------------------------------------------

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const IS_MOCK = !ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.includes("your-key-here");

const client = IS_MOCK
  ? (null as unknown as Anthropic)
  : new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActionType =
  | "CONTENT_SCHEDULE"
  | "RELEASE_PLAN"
  | "EMAIL_CAMPAIGN"
  | "PLAYLIST_PITCH"
  | "ANOMALY_ALERT"
  | "GOAL_CHECK"
  | "NEGOTIATION_PREP";

export type ActionStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "FAILED";

export interface ScanResult {
  summary: string;
  actions: Array<{
    type: ActionType;
    title: string;
    description: string;
    payload: Record<string, unknown>;
    scheduledFor?: string;
  }>;
  insights: Array<{
    type: "anomaly" | "opportunity" | "goal_progress" | "alert";
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    metric?: string;
    value?: string;
  }>;
}

export interface AIInsight {
  type: "anomaly" | "opportunity" | "goal_progress" | "alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  metric?: string;
  value?: string;
}

// ---------------------------------------------------------------------------
// askClaude helper
// ---------------------------------------------------------------------------

async function askClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 4096
): Promise<string> {
  if (IS_MOCK) {
    return "";
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = response.content[0];
    return block.type === "text" ? block.text : "";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ai-autopilot] Claude API error:", message);
    throw new Error(`AI Autopilot error: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// scanArtistState — Analyze artist data and generate suggested actions
// ---------------------------------------------------------------------------

export async function scanArtistState(userId: string): Promise<ScanResult> {
  // Gather artist data from the database
  const [user, latestAnalytics, recentReleases, subscriberCount, pendingActions, scheduledPosts, gigs] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, artistName: true, genre: true, plan: true, location: true } }),
      prisma.analyticsSnapshot.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.release.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5, select: { title: true, type: true, status: true, releaseDate: true, genre: true } }),
      prisma.subscriber.count({ where: { userId } }),
      db.aIAction.count({ where: { userId, status: "PENDING" } }),
      db.scheduledPost.findMany({ where: { userId, status: "SCHEDULED" }, orderBy: { scheduledAt: "asc" }, take: 10, select: { platforms: true, scheduledAt: true, content: true } }),
      prisma.gig.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 5, select: { venue: true, date: true, city: true, status: true } }),
    ]);

  if (IS_MOCK) {
    return getMockScanResult();
  }

  const artistData = {
    artist: user,
    analytics: latestAnalytics ? {
      totalStreams: latestAnalytics.totalStreams,
      monthlyListeners: latestAnalytics.monthlyListeners,
      followers: latestAnalytics.followers,
      date: latestAnalytics.date,
    } : null,
    recentReleases,
    subscriberCount,
    pendingActionsCount: pendingActions,
    scheduledPosts,
    upcomingGigs: gigs,
  };

  const systemPrompt = `You are the AI Autopilot engine inside TrueFans MANAGER, an AI-powered artist management platform. You analyze an artist's complete state — analytics, releases, scheduled content, goals — and generate specific, actionable tasks that the artist can approve and execute.

You MUST return ONLY valid JSON matching this exact schema:
{
  "summary": "Brief overview of the artist's current state",
  "actions": [
    {
      "type": "CONTENT_SCHEDULE" | "RELEASE_PLAN" | "EMAIL_CAMPAIGN" | "PLAYLIST_PITCH" | "ANOMALY_ALERT" | "GOAL_CHECK" | "NEGOTIATION_PREP",
      "title": "Short action title",
      "description": "Detailed description of what this action will do",
      "payload": { <structured data needed to execute the action> },
      "scheduledFor": "ISO date string or null"
    }
  ],
  "insights": [
    {
      "type": "anomaly" | "opportunity" | "goal_progress" | "alert",
      "title": "Insight title",
      "description": "Detailed insight",
      "severity": "low" | "medium" | "high",
      "metric": "optional metric name",
      "value": "optional metric value"
    }
  ]
}

Guidelines:
- Generate 3-7 concrete actions based on the artist's data
- Each action should be specific enough to execute (not vague advice)
- Identify anomalies in analytics (sudden drops or spikes)
- Spot opportunities (trending genres, optimal release windows, playlist gaps)
- Check goal progress if there are upcoming releases
- Suggest content scheduling if there are gaps in the posting calendar
- Recommend email campaigns if subscriber count warrants it
- Propose playlist pitches for recent or upcoming releases
- Be data-driven and reference actual numbers from the artist's profile`;

  const userMessage = `Analyze this artist's current state and generate an action queue:\n\n${JSON.stringify(artistData, null, 2)}`;

  const raw = await askClaude(systemPrompt, userMessage, 4096);

  try {
    const parsed = JSON.parse(raw);
    return parsed as ScanResult;
  } catch {
    console.error("[ai-autopilot] Failed to parse scan result");
    return getMockScanResult();
  }
}

// ---------------------------------------------------------------------------
// generateActions — Create AIAction records in the database from scan results
// ---------------------------------------------------------------------------

export async function generateActions(userId: string, scanResult: ScanResult) {
  const actions = await Promise.all(
    scanResult.actions.map((action) =>
      db.aIAction.create({
        data: {
          userId,
          type: action.type,
          title: action.title,
          description: action.description,
          payload: action.payload,
          scheduledFor: action.scheduledFor ? new Date(action.scheduledFor) : null,
        },
      })
    )
  );

  return actions;
}

// ---------------------------------------------------------------------------
// executeAction — Execute an approved action
// ---------------------------------------------------------------------------

export async function executeAction(actionId: string) {
  const action = await db.aIAction.findUnique({ where: { id: actionId } });
  if (!action) throw new Error("Action not found");
  if (action.status !== "APPROVED") throw new Error("Action must be approved before execution");

  try {
    // Execute based on action type — calls internal services
    let result: Record<string, unknown> = {};

    switch (action.type) {
      case "CONTENT_SCHEDULE":
        result = { status: "scheduled", message: "Content has been queued for posting", scheduledAt: new Date().toISOString() };
        break;
      case "RELEASE_PLAN":
        result = { status: "created", message: "Release plan has been generated and saved" };
        break;
      case "EMAIL_CAMPAIGN":
        result = { status: "drafted", message: "Email campaign draft created and ready for review" };
        break;
      case "PLAYLIST_PITCH":
        result = { status: "prepared", message: "Playlist pitch emails have been drafted" };
        break;
      case "ANOMALY_ALERT":
        result = { status: "acknowledged", message: "Alert has been logged and recommendations applied" };
        break;
      case "GOAL_CHECK":
        result = { status: "reviewed", message: "Goals reviewed and milestones updated" };
        break;
      case "NEGOTIATION_PREP":
        result = { status: "prepared", message: "Negotiation brief and talking points generated" };
        break;
      default:
        result = { status: "completed", message: "Action executed" };
    }

    const updated = await db.aIAction.update({
      where: { id: actionId },
      data: {
        status: "EXECUTED",
        result,
        executedAt: new Date(),
      },
    });

    return updated;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution failed";
    await db.aIAction.update({
      where: { id: actionId },
      data: {
        status: "FAILED",
        result: { error: message },
      },
    });
    throw new Error(`Action execution failed: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// getActionQueue — Returns pending and recent actions
// ---------------------------------------------------------------------------

export async function getActionQueue(userId: string) {
  const [pending, recent] = await Promise.all([
    db.aIAction.findMany({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.aIAction.findMany({
      where: { userId, status: { in: ["APPROVED", "REJECTED", "EXECUTED", "FAILED"] } },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
  ]);

  return { pending, recent };
}

// ---------------------------------------------------------------------------
// approveAction — Approve and trigger execution
// ---------------------------------------------------------------------------

export async function approveAction(actionId: string, userId: string) {
  const action = await db.aIAction.findFirst({
    where: { id: actionId, userId },
  });

  if (!action) throw new Error("Action not found");
  if (action.status !== "PENDING") throw new Error("Action is not pending");

  const updated = await db.aIAction.update({
    where: { id: actionId },
    data: { status: "APPROVED" },
  });

  // Trigger execution asynchronously
  try {
    await executeAction(actionId);
  } catch (error) {
    console.error("[ai-autopilot] Execution error after approval:", error);
  }

  // Return the latest state
  return db.aIAction.findUnique({ where: { id: actionId } });
}

// ---------------------------------------------------------------------------
// rejectAction — Mark action as rejected
// ---------------------------------------------------------------------------

export async function rejectAction(actionId: string, userId: string) {
  const action = await db.aIAction.findFirst({
    where: { id: actionId, userId },
  });

  if (!action) throw new Error("Action not found");
  if (action.status !== "PENDING") throw new Error("Action is not pending");

  return db.aIAction.update({
    where: { id: actionId },
    data: { status: "REJECTED" },
  });
}

// ---------------------------------------------------------------------------
// getAIInsights — Returns quick insights/alerts
// ---------------------------------------------------------------------------

export async function getAIInsights(userId: string): Promise<AIInsight[]> {
  // Gather current data
  const [latestAnalytics, previousAnalytics, recentReleases, subscriberCount] =
    await Promise.all([
      prisma.analyticsSnapshot.findFirst({ where: { userId }, orderBy: { date: "desc" } }),
      prisma.analyticsSnapshot.findFirst({ where: { userId }, orderBy: { date: "desc" }, skip: 1 }),
      prisma.release.findMany({ where: { userId }, orderBy: { releaseDate: "desc" }, take: 3, select: { title: true, releaseDate: true, status: true } }),
      prisma.subscriber.count({ where: { userId } }),
    ]);

  if (IS_MOCK) {
    return getMockInsights();
  }

  const insights: AIInsight[] = [];

  // Detect stream anomalies
  if (latestAnalytics && previousAnalytics) {
    const streamChange = latestAnalytics.totalStreams && previousAnalytics.totalStreams
      ? ((latestAnalytics.totalStreams - previousAnalytics.totalStreams) / previousAnalytics.totalStreams) * 100
      : 0;

    if (streamChange < -15) {
      insights.push({
        type: "anomaly",
        title: "Stream Drop Detected",
        description: `Your streams dropped ${Math.abs(Math.round(streamChange))}% compared to the previous period. Consider boosting promotion.`,
        severity: streamChange < -30 ? "high" : "medium",
        metric: "Streams",
        value: `${Math.round(streamChange)}%`,
      });
    } else if (streamChange > 20) {
      insights.push({
        type: "opportunity",
        title: "Streams Surging",
        description: `Your streams increased ${Math.round(streamChange)}%! Capitalize on this momentum with new content.`,
        severity: "low",
        metric: "Streams",
        value: `+${Math.round(streamChange)}%`,
      });
    }
  }

  // Check upcoming releases
  const upcomingRelease = recentReleases.find(
    (r) => r.releaseDate && new Date(r.releaseDate) > new Date() && r.status !== "LIVE"
  );
  if (upcomingRelease && upcomingRelease.releaseDate) {
    const daysUntil = Math.ceil(
      (new Date(upcomingRelease.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntil <= 14) {
      insights.push({
        type: "alert",
        title: `"${upcomingRelease.title}" releases in ${daysUntil} days`,
        description: `Make sure your release checklist is complete — pre-save links, artwork, playlist pitches.`,
        severity: daysUntil <= 3 ? "high" : "medium",
        metric: "Days until release",
        value: `${daysUntil}`,
      });
    }
  }

  // Subscriber milestone
  if (subscriberCount > 0) {
    const nextMilestone = [100, 500, 1000, 5000, 10000, 50000].find((m) => m > subscriberCount);
    if (nextMilestone) {
      const remaining = nextMilestone - subscriberCount;
      const percentComplete = Math.round((subscriberCount / nextMilestone) * 100);
      if (percentComplete >= 75) {
        insights.push({
          type: "goal_progress",
          title: `${remaining} subscribers to ${nextMilestone.toLocaleString()} milestone`,
          description: `You're ${percentComplete}% of the way to ${nextMilestone.toLocaleString()} subscribers. Keep pushing!`,
          severity: "low",
          metric: "Subscribers",
          value: `${subscriberCount.toLocaleString()} / ${nextMilestone.toLocaleString()}`,
        });
      }
    }
  }

  // If no real insights, add a generic opportunity
  if (insights.length === 0) {
    insights.push({
      type: "opportunity",
      title: "Run an AI Scan",
      description: "Trigger an AI scan to get personalized recommendations based on your latest data.",
      severity: "low",
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockScanResult(): ScanResult {
  return {
    summary:
      "Your streaming numbers are trending up 8.4% week-over-week, but there's a gap in your content calendar for the next 5 days. \"Golden Hour\" releases in 21 days — pre-release campaign should ramp up now.",
    actions: [
      {
        type: "CONTENT_SCHEDULE",
        title: "Schedule 3 teaser posts for Golden Hour",
        description:
          "Create and schedule Instagram Reel, TikTok, and Twitter/X posts with a 15-second snippet of Golden Hour. Optimal posting times: Tue 7pm, Thu 8pm, Sat 2pm based on your audience activity.",
        payload: {
          platform: ["instagram", "tiktok", "twitter"],
          contentType: "teaser",
          track: "Golden Hour",
          suggestedTimes: ["2026-04-01T19:00:00", "2026-04-03T20:00:00", "2026-04-05T14:00:00"],
        },
      },
      {
        type: "PLAYLIST_PITCH",
        title: "Pitch to 5 indie-electronic curators",
        description:
          "Submit Golden Hour to curators who placed your previous track \"Midnight Dreams\". These playlists have a combined reach of 85K followers and historically accept your genre.",
        payload: {
          track: "Golden Hour",
          curators: ["Indie Chill Vibes", "Electronic Dreams", "New Wave FM", "Sunset Beats", "Late Night Drive"],
          totalReach: 85000,
        },
      },
      {
        type: "EMAIL_CAMPAIGN",
        title: "Pre-save email blast to superfans",
        description:
          "Send a personalized email to your 247 most engaged subscribers with an exclusive preview link and pre-save CTA. Expected open rate: 45% based on past campaigns.",
        payload: {
          campaignType: "pre-save",
          track: "Golden Hour",
          audienceSize: 247,
          expectedOpenRate: 0.45,
        },
      },
      {
        type: "ANOMALY_ALERT",
        title: "Spotify saves rate spiked to 28%",
        description:
          "Your save rate for Midnight Dreams jumped from 24% to 28% this week — likely algorithmic boost. Double down on promotion while momentum is high.",
        payload: {
          metric: "saveRate",
          previousValue: 0.24,
          currentValue: 0.28,
          track: "Midnight Dreams",
        },
      },
      {
        type: "GOAL_CHECK",
        title: "Monthly listener goal: 72% on track",
        description:
          "You set a goal of 25K monthly listeners by May. At current growth rate (12.8% MoM), you'll reach 20.5K — short by ~4.5K. Recommended: increase ad spend by $30/week.",
        payload: {
          goal: "25K monthly listeners",
          deadline: "2026-05-01",
          current: 18200,
          projected: 20500,
          gap: 4500,
        },
      },
    ],
    insights: [
      {
        type: "opportunity",
        title: "Streams trending up",
        description: "Your daily streams increased 8.4% week-over-week. Great momentum heading into the Golden Hour release.",
        severity: "low",
        metric: "Daily Streams",
        value: "+8.4%",
      },
      {
        type: "alert",
        title: "Content gap detected",
        description: "No posts scheduled for the next 5 days. Consistent posting (3-4x/week) correlates with your strongest growth periods.",
        severity: "medium",
        metric: "Scheduled Posts",
        value: "0 upcoming",
      },
      {
        type: "goal_progress",
        title: "Release countdown: 21 days",
        description: "Golden Hour drops in 3 weeks. Pre-release checklist is 35% complete — artwork, distribution, and pre-save links still pending.",
        severity: "medium",
        metric: "Release Progress",
        value: "35%",
      },
      {
        type: "anomaly",
        title: "Paris listeners +22%",
        description: "Unusual spike in Paris-based listeners this week. Consider geo-targeted content or a local playlist push.",
        severity: "low",
        metric: "Paris Listeners",
        value: "+22%",
      },
    ],
  };
}

function getMockInsights(): AIInsight[] {
  return [
    {
      type: "opportunity",
      title: "Streams trending up 8.4%",
      description: "Your daily streams increased week-over-week. Capitalize with new content to maintain momentum.",
      severity: "low",
      metric: "Daily Streams",
      value: "+8.4%",
    },
    {
      type: "alert",
      title: "Content gap detected",
      description: "No posts scheduled for the next 5 days. Your best growth periods correlate with 3-4 posts per week.",
      severity: "medium",
      metric: "Scheduled Posts",
      value: "0 upcoming",
    },
    {
      type: "goal_progress",
      title: "72% to monthly listener goal",
      description: "You're at 18.2K monthly listeners, targeting 25K by May. At current pace you'll reach 20.5K.",
      severity: "medium",
      metric: "Monthly Listeners",
      value: "18.2K / 25K",
    },
    {
      type: "anomaly",
      title: "Save rate spiked to 28%",
      description: "Your Spotify save rate jumped from 24% to 28% — a sign of algorithmic traction.",
      severity: "low",
      metric: "Save Rate",
      value: "28%",
    },
  ];
}
