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
// Helpers
// ---------------------------------------------------------------------------

async function askClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 2048
): Promise<string> {
  if (IS_MOCK) {
    return "[Mock response — configure ANTHROPIC_API_KEY to enable AI]";
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
    console.error("[ai-service] Claude API error:", message);
    throw new Error(`AI service error: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// generateContent
// ---------------------------------------------------------------------------

export async function generateContent(
  type: string,
  context: {
    track?: string;
    tone?: string;
    platform?: string;
    additionalContext?: string;
  }
): Promise<string[]> {
  if (IS_MOCK) {
    return getMockContent(type);
  }

  const systemPrompt = `You are an expert music marketing AI working inside TrueFans Manager, a platform for independent artists. You understand streaming algorithms, fan engagement, social media trends, and the music industry inside out.

When generating content you MUST:
- Be authentic and avoid generic corporate language
- Tailor everything to the artist's tone, genre, and platform
- Include emojis where appropriate for social posts
- Think like a seasoned A&R / marketing manager at a major label, but with indie sensibility

Return your output as a JSON array of strings. Each string is one piece of generated content. Generate 3-5 variations unless told otherwise.`;

  const userMessage = buildContentPrompt(type, context);

  const raw = await askClaude(systemPrompt, userMessage, 2048);

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [raw];
  } catch {
    // If response is not JSON, split by double newlines
    return raw
      .split(/\n{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function buildContentPrompt(
  type: string,
  ctx: {
    track?: string;
    tone?: string;
    platform?: string;
    additionalContext?: string;
  }
): string {
  const base = `Track/Release: ${ctx.track || "N/A"}
Tone: ${ctx.tone || "energetic, authentic"}
Platform: ${ctx.platform || "general"}
Additional context: ${ctx.additionalContext || "none"}`;

  switch (type) {
    case "social-post":
      return `Generate social media posts for the following:\n${base}\n\nMake them platform-optimized. Include relevant hashtags at the end.`;
    case "caption":
      return `Generate captions (short & punchy) for:\n${base}`;
    case "hashtags":
      return `Generate a set of 15-20 strategic hashtags for:\n${base}\n\nMix popular, mid-range, and niche tags. Return as a JSON array of strings (each starting with #).`;
    case "email":
      return `Write a fan email for:\n${base}\n\nMake it personal, conversational, with a clear CTA. Return 2-3 variations as a JSON array.`;
    case "press-release":
      return `Write a professional press release for:\n${base}\n\nInclude a headline, body paragraphs, quotes placeholder, and boilerplate. Return as a JSON array with one entry.`;
    case "story-ideas":
      return `Suggest 5 Instagram/TikTok story ideas for:\n${base}\n\nEach idea should include the hook, format (video/photo/poll), and a brief description. Return as a JSON array.`;
    default:
      return `Generate ${type} content for:\n${base}`;
  }
}

function getMockContent(type: string): string[] {
  const mocks: Record<string, string[]> = {
    "social-post": [
      "New music dropping Friday. This one hits different. 🔥 #NewMusic #IndieArtist",
      "Studio sessions at 3am always produce the real ones. Friday. 🎵 #ComingSoon",
      "I poured everything into this one. Ready for you to hear it. 🖤 #NewRelease",
    ],
    caption: [
      "no skip. friday.",
      "the one you've been waiting for 🎧",
      "real ones know. new era starts now.",
    ],
    hashtags: [
      "#NewMusic",
      "#IndieArtist",
      "#NowPlaying",
      "#MusicIsLife",
      "#StreamNow",
      "#Unsigned",
      "#IndieMusic",
      "#NewRelease",
    ],
    email: [
      "Hey! I just finished something special and I want you to hear it first...",
    ],
    "press-release": [
      "[ARTIST] announces new single — a genre-bending exploration of modern sound.",
    ],
    "story-ideas": [
      "Behind-the-scenes studio clip with the hook playing — 15s teaser",
      "Poll: Which cover art vibe? Option A vs Option B",
      "Countdown sticker + pre-save link swipe-up",
    ],
  };
  return mocks[type] || ["Mock content for: " + type];
}

// ---------------------------------------------------------------------------
// generateReleasePlan
// ---------------------------------------------------------------------------

export async function generateReleasePlan(params: {
  title: string;
  releaseDate: string;
  type: string;
  genre?: string;
  context?: string;
}): Promise<{
  phases: Array<{
    name: string;
    startOffset: number;
    endOffset: number;
    tasks: Array<{ title: string; description: string; category: string; priority: string }>;
  }>;
}> {
  if (IS_MOCK) {
    return getMockReleasePlan();
  }

  const systemPrompt = `You are a senior music release strategist at TrueFans Manager. You build detailed, phased release plans for independent artists that rival what major-label marketing teams produce.

Return ONLY valid JSON matching this schema:
{
  "phases": [
    {
      "name": "Phase name",
      "startOffset": <days before release, negative = before, 0 = release day, positive = after>,
      "endOffset": <days>,
      "tasks": [
        { "title": "Task", "description": "Details", "category": "marketing|content|distribution|press|social|community", "priority": "high|medium|low" }
      ]
    }
  ]
}`;

  const userMessage = `Create a comprehensive release plan for:
Title: ${params.title}
Release Date: ${params.releaseDate}
Type: ${params.type}
Genre: ${params.genre || "general"}
Additional context: ${params.context || "independent artist"}

Include phases: pre-release hype (4-6 weeks out), content creation, release week, post-release momentum. Be specific with tasks.`;

  const raw = await askClaude(systemPrompt, userMessage, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return getMockReleasePlan();
  }
}

function getMockReleasePlan() {
  return {
    phases: [
      {
        name: "Pre-Release Hype",
        startOffset: -42,
        endOffset: -14,
        tasks: [
          { title: "Teaser content creation", description: "Create 3-5 short teaser clips for social media", category: "content", priority: "high" },
          { title: "Press outreach", description: "Send advance copies to blogs and playlist curators", category: "press", priority: "high" },
          { title: "Pre-save campaign", description: "Set up pre-save links across all platforms", category: "distribution", priority: "high" },
        ],
      },
      {
        name: "Release Week",
        startOffset: -3,
        endOffset: 3,
        tasks: [
          { title: "Launch day social blitz", description: "Post across all platforms at optimal times", category: "social", priority: "high" },
          { title: "Fan email blast", description: "Send release announcement to subscriber list", category: "marketing", priority: "high" },
          { title: "Listening party", description: "Host a live listening session on Instagram/Discord", category: "community", priority: "medium" },
        ],
      },
      {
        name: "Post-Release Momentum",
        startOffset: 4,
        endOffset: 30,
        tasks: [
          { title: "Behind-the-scenes content", description: "Share studio footage and making-of stories", category: "content", priority: "medium" },
          { title: "Playlist pitching follow-up", description: "Follow up with curators and track placements", category: "press", priority: "high" },
          { title: "Remix / acoustic version", description: "Release an alternate version to sustain interest", category: "content", priority: "low" },
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// analyzeContract
// ---------------------------------------------------------------------------

export async function analyzeContract(
  text: string
): Promise<{
  overallRisk: string;
  clauses: Array<{
    title: string;
    risk: "low" | "medium" | "high" | "critical";
    summary: string;
    detail: string;
    recommendation: string;
  }>;
}> {
  if (IS_MOCK) {
    return {
      overallRisk: "medium",
      clauses: [
        {
          title: "Rights Assignment",
          risk: "high",
          summary: "Transfers master recording rights to the label",
          detail: "Clause grants exclusive, perpetual ownership of all master recordings to the label.",
          recommendation: "Negotiate for a limited license term (e.g., 5-7 years) with reversion rights.",
        },
        {
          title: "Royalty Rate",
          risk: "medium",
          summary: "15% net royalty rate",
          detail: "Artist receives 15% of net receipts after recoupment of advances.",
          recommendation: "Push for 18-25% and clearly define what counts as deductible expenses.",
        },
        {
          title: "Term & Options",
          risk: "medium",
          summary: "3-album deal with label options",
          detail: "Initial term covers one album with two additional option periods at the label's discretion.",
          recommendation: "Limit options to 1 additional album or add performance benchmarks that trigger options.",
        },
      ],
    };
  }

  const systemPrompt = `You are a music industry contract attorney and advisor at TrueFans Manager. You analyze recording contracts, publishing deals, management agreements, and other music industry legal documents for independent artists.

Identify every significant clause, assess its risk to the artist (low/medium/high/critical), and provide a plain-English explanation with an actionable recommendation.

Return ONLY valid JSON:
{
  "overallRisk": "low" | "medium" | "high" | "critical",
  "clauses": [
    {
      "title": "Clause name",
      "risk": "low" | "medium" | "high" | "critical",
      "summary": "One-line summary",
      "detail": "Detailed explanation",
      "recommendation": "What the artist should do"
    }
  ]
}`;

  const raw = await askClaude(systemPrompt, `Analyze this contract:\n\n${text}`, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return { overallRisk: "unknown", clauses: [] };
  }
}

// ---------------------------------------------------------------------------
// generateWeeklyReport
// ---------------------------------------------------------------------------

export async function generateWeeklyReport(userData: {
  name?: string;
  streams?: number;
  followers?: number;
  releases?: number;
  topTrack?: string;
  earnings?: number;
  [key: string]: unknown;
}): Promise<string> {
  if (IS_MOCK) {
    return `<h2>Weekly Manager Report</h2>
<p>Hi ${userData.name || "Artist"},</p>
<p>Here is a summary of your week:</p>
<ul>
  <li><strong>Streams:</strong> ${userData.streams?.toLocaleString() ?? "N/A"}</li>
  <li><strong>Followers:</strong> ${userData.followers?.toLocaleString() ?? "N/A"}</li>
  <li><strong>Top Track:</strong> ${userData.topTrack ?? "N/A"}</li>
</ul>
<p><em>Configure your ANTHROPIC_API_KEY for a personalized AI-generated report.</em></p>`;
  }

  const systemPrompt = `You are a music manager AI at TrueFans Manager. Write a concise, actionable weekly report in HTML format for an independent artist. Include:
1. Performance highlights
2. Key metrics summary
3. 2-3 specific action items for the coming week
4. Motivational closing

Use clean HTML with <h2>, <p>, <ul>, <strong> tags. Keep it under 500 words. Be direct, data-driven, and encouraging.`;

  const userMessage = `Generate a weekly report for this artist data:\n${JSON.stringify(userData, null, 2)}`;

  return askClaude(systemPrompt, userMessage, 2048);
}

// ---------------------------------------------------------------------------
// generateStoryboard
// ---------------------------------------------------------------------------

export async function generateStoryboard(params: {
  track: string;
  style?: string;
  mood?: string;
}): Promise<{
  scenes: Array<{
    time: string;
    shot: string;
    description: string;
    visual: string;
  }>;
  colorPalette: string[];
  mood: string;
}> {
  if (IS_MOCK) {
    return {
      scenes: [
        { time: "0:00-0:15", shot: "Wide establishing", description: "Artist silhouette in empty warehouse, single light", visual: "High contrast, shadows" },
        { time: "0:15-0:40", shot: "Close-up tracking", description: "Camera follows artist walking through neon-lit corridor", visual: "Neon blue and magenta" },
        { time: "0:40-1:10", shot: "Performance medium", description: "Artist performing to camera with dynamic lighting", visual: "Strobe effect, energy build" },
        { time: "1:10-1:30", shot: "Drone overhead", description: "Pull out to reveal full set with backup dancers", visual: "Wide angle, choreography visible" },
      ],
      colorPalette: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
      mood: "dark, cinematic, energetic",
    };
  }

  const systemPrompt = `You are a music video creative director at TrueFans Manager. Generate detailed storyboards for music videos that independent artists can execute on a budget.

Return ONLY valid JSON:
{
  "scenes": [
    { "time": "0:00-0:30", "shot": "Shot type", "description": "What happens", "visual": "Visual notes" }
  ],
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "mood": "overall mood description"
}

Include 6-10 scenes covering the full track. Keep shots achievable without Hollywood budgets.`;

  const userMessage = `Create a storyboard for:
Track: ${params.track}
Style: ${params.style || "cinematic"}
Mood: ${params.mood || "atmospheric"}`;

  const raw = await askClaude(systemPrompt, userMessage, 3072);

  try {
    return JSON.parse(raw);
  } catch {
    return { scenes: [], colorPalette: [], mood: params.mood || "unknown" };
  }
}

// ---------------------------------------------------------------------------
// chatWithManager
// ---------------------------------------------------------------------------

export async function chatWithManager(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  userContext: {
    name?: string;
    plan?: string;
    genre?: string;
    streams?: number;
    followers?: number;
    releases?: number;
    [key: string]: unknown;
  }
): Promise<string> {
  if (IS_MOCK) {
    return "I'm your AI manager at TrueFans Manager. To unlock personalized advice, please configure the ANTHROPIC_API_KEY in your environment. In the meantime, feel free to explore the platform's features!";
  }

  const systemPrompt = `You are the AI Manager inside TrueFans Manager — a smart, experienced, and supportive music industry manager for independent artists. You have deep knowledge of:
- Music marketing, release strategy, and fan engagement
- Streaming platform algorithms and playlist pitching
- Social media growth tactics for musicians
- Contract negotiation and music business fundamentals
- Revenue optimization and touring
- Content creation and branding

Here is context about the artist you are advising:
${JSON.stringify(userContext, null, 2)}

Guidelines:
- Be conversational, warm, but professional
- Give specific, actionable advice — not generic fluff
- Reference the artist's actual data when relevant
- If asked about something outside music, politely redirect
- Keep responses concise (2-4 paragraphs max unless they ask for detail)
- You can use markdown formatting`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const block = response.content[0];
    return block.type === "text" ? block.text : "";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ai-service] Chat error:", message);
    throw new Error(`AI chat error: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// analyzeSoundProfile
// ---------------------------------------------------------------------------

export async function analyzeSoundProfile(metadata: {
  bpm?: number;
  key?: string;
  energy?: number;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  duration?: number;
  genre?: string;
  title?: string;
  [key: string]: unknown;
}): Promise<{
  playlistReadiness: number;
  suggestions: string[];
  similarTracks: Array<{ title: string; artist: string; reason: string }>;
  analysis: string;
}> {
  if (IS_MOCK) {
    return {
      playlistReadiness: 72,
      suggestions: [
        "Consider a shorter intro — editorial playlists favor tracks that hook within the first 5 seconds.",
        "The BPM and energy profile fits well in workout and focus playlists.",
        "Adding a vocal chop or drop at the 30-second mark could boost save rates.",
      ],
      similarTracks: [
        { title: "Blinding Lights", artist: "The Weeknd", reason: "Similar BPM and synth-driven energy" },
        { title: "Levitating", artist: "Dua Lipa", reason: "Comparable danceability and valence" },
        { title: "Heat Waves", artist: "Glass Animals", reason: "Similar atmospheric production style" },
      ],
      analysis: "Your track has strong playlist potential with a solid rhythmic foundation. The energy level sits in a sweet spot for discovery playlists.",
    };
  }

  const systemPrompt = `You are a music data analyst and A&R specialist at TrueFans Manager. Analyze audio metadata and provide insights on playlist readiness, actionable improvement suggestions, and similar commercially successful tracks.

Return ONLY valid JSON:
{
  "playlistReadiness": <0-100 score>,
  "suggestions": ["actionable suggestion 1", "..."],
  "similarTracks": [
    { "title": "Track name", "artist": "Artist name", "reason": "Why it's similar" }
  ],
  "analysis": "Brief overall analysis paragraph"
}

Be specific and data-driven. Reference the actual metrics provided.`;

  const userMessage = `Analyze this track's sound profile:\n${JSON.stringify(metadata, null, 2)}`;

  const raw = await askClaude(systemPrompt, userMessage, 2048);

  try {
    return JSON.parse(raw);
  } catch {
    return {
      playlistReadiness: 0,
      suggestions: ["Unable to analyze — please try again."],
      similarTracks: [],
      analysis: "Analysis could not be completed.",
    };
  }
}
