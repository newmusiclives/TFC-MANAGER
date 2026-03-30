import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Client
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

export interface ReleaseOption {
  id: string;
  title: string;
  type: string;
  releaseDate: string;
}

export interface PerformanceMetric {
  label: string;
  goal: number;
  actual: number;
  unit: string;
}

export interface TimelineWeek {
  week: number;
  label: string;
  streams: number;
  events: string[];
}

export interface ReleaseReplay {
  id: string;
  releaseId: string;
  releaseTitle: string;
  releaseType: string;
  releaseDate: string;
  performance: PerformanceMetric[];
  timeline: TimelineWeek[];
  whatWorked: string[];
  whatDidnt: string[];
  aiRecommendations: string[];
  comparison: {
    previousRelease: string;
    metrics: { label: string; current: number; previous: number; unit: string }[];
  } | null;
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// generateReplay
// ---------------------------------------------------------------------------

export async function generateReplay(userId: string, releaseId: string): Promise<ReleaseReplay> {
  if (IS_MOCK) {
    return getMockReplay(userId, releaseId);
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: `You are a music release analyst at TrueFans MANAGER. Generate a detailed post-release retrospective with performance analysis, timeline breakdown, and actionable recommendations.

Return ONLY valid JSON matching the ReleaseReplay schema.`,
      messages: [
        {
          role: "user",
          content: `Generate a release replay analysis for userId: ${userId}, releaseId: ${releaseId}. Include performance vs goals, week-by-week timeline, what worked, what didn't, and AI recommendations for next release.`,
        },
      ],
    });

    const block = response.content[0];
    const text = block.type === "text" ? block.text : "";
    return JSON.parse(text);
  } catch (error) {
    console.error("[release-replay-service] Error:", error);
    return getMockReplay(userId, releaseId);
  }
}

// ---------------------------------------------------------------------------
// getReplay
// ---------------------------------------------------------------------------

export async function getReplay(releaseId: string): Promise<ReleaseReplay | null> {
  // In production, fetch from DB
  return getMockReplay("mock-user", releaseId);
}

// ---------------------------------------------------------------------------
// getReplays
// ---------------------------------------------------------------------------

export async function getReplays(userId: string): Promise<ReleaseOption[]> {
  // In production, fetch from DB
  void userId;
  return getMockReleaseOptions();
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockReleaseOptions(): ReleaseOption[] {
  return [
    { id: "rel-1", title: "Golden Hour", type: "Single", releaseDate: "2026-02-14" },
    { id: "rel-2", title: "Midnight Drive EP", type: "EP", releaseDate: "2025-11-01" },
    { id: "rel-3", title: "Neon Dreams", type: "Single", releaseDate: "2025-08-22" },
    { id: "rel-4", title: "Echoes", type: "Single", releaseDate: "2025-06-10" },
    { id: "rel-5", title: "First Light", type: "Album", releaseDate: "2025-03-15" },
  ];
}

function getMockReplay(_userId: string, releaseId: string): ReleaseReplay {
  const releases: Record<string, Partial<ReleaseReplay>> = {
    "rel-1": {
      releaseTitle: "Golden Hour",
      releaseType: "Single",
      releaseDate: "2026-02-14",
    },
    "rel-2": {
      releaseTitle: "Midnight Drive EP",
      releaseType: "EP",
      releaseDate: "2025-11-01",
    },
  };

  const release = releases[releaseId] || releases["rel-1"];

  return {
    id: `replay-${releaseId}`,
    releaseId: releaseId || "rel-1",
    releaseTitle: release?.releaseTitle || "Golden Hour",
    releaseType: release?.releaseType || "Single",
    releaseDate: release?.releaseDate || "2026-02-14",
    performance: [
      { label: "First Week Streams", goal: 15000, actual: 18420, unit: "streams" },
      { label: "Total Streams (30 days)", goal: 50000, actual: 62300, unit: "streams" },
      { label: "Save Rate", goal: 20, actual: 24.3, unit: "%" },
      { label: "Playlist Adds", goal: 15, actual: 22, unit: "playlists" },
      { label: "Engagement Rate", goal: 5, actual: 7.2, unit: "%" },
      { label: "Pre-save Conversions", goal: 500, actual: 380, unit: "saves" },
    ],
    timeline: [
      { week: 1, label: "Release Week", streams: 18420, events: ["Release day social blitz", "Added to 'Fresh Finds' playlist", "Instagram Reel hit 12K views"] },
      { week: 2, label: "Week 2", streams: 14800, events: ["Blog feature on Indie Shuffle", "Added to 3 user playlists (10K+ followers)"] },
      { week: 3, label: "Week 3", streams: 12100, events: ["TikTok sound picked up organically", "Spotify algorithmic playlist inclusion"] },
      { week: 4, label: "Week 4", streams: 17000, events: ["Second TikTok wave", "Added to 'Chill Vibes' editorial playlist", "Radio play on college station"] },
    ],
    whatWorked: [
      "Pre-release teaser campaign drove strong day-one engagement",
      "Instagram Reel strategy generated 3x more saves than previous release",
      "Timing the release for Valentine's Day created natural thematic hook",
      "Blog outreach 3 weeks early secured coverage on release day",
      "Fan email blast had 42% open rate — highest ever",
    ],
    whatDidnt: [
      "Pre-save campaign underperformed — link placement on socials was too subtle",
      "YouTube premiere had low attendance (only 45 viewers live)",
      "Twitter/X engagement was minimal — the platform isn't connecting with your audience",
      "Merch bundle wasn't promoted enough during release week",
      "No TikTok content prepared for release day — viral moment was organic luck",
    ],
    aiRecommendations: [
      "Create a dedicated TikTok content calendar for your next release — prepare 10+ short-form videos in advance. The organic pickup this time was lucky; plan for it next time.",
      "Move pre-save campaign start to 3 weeks before release (vs 1 week). Use a countdown mechanic with exclusive content unlocks.",
      "Skip YouTube premieres and invest that effort into short-form vertical video instead. Your audience engages 8x more on Instagram and TikTok.",
      "Bundle merch with the release from day one. A limited-edition item with a 48-hour window creates urgency.",
      "Your save rate (24.3%) is excellent. Pitch to larger editorial playlists next time — you now have the data to support it.",
      "Consider a remix or acoustic version drop 3-4 weeks post-release to extend the lifecycle.",
    ],
    comparison: {
      previousRelease: "Neon Dreams",
      metrics: [
        { label: "First Week Streams", current: 18420, previous: 11200, unit: "streams" },
        { label: "Save Rate", current: 24.3, previous: 18.1, unit: "%" },
        { label: "Playlist Adds", current: 22, previous: 12, unit: "playlists" },
        { label: "Social Engagement", current: 7.2, previous: 4.8, unit: "%" },
        { label: "Blog Coverage", current: 5, previous: 2, unit: "features" },
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}
