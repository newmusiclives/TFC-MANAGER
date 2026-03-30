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

export interface SoundProfile {
  energy: number;
  danceability: number;
  acoustic: number;
  vocalPresence: number;
  productionComplexity: number;
  uniqueness: number;
}

export interface AudienceDNA {
  primaryAgeRange: string;
  topGenders: { label: string; percentage: number }[];
  topCountries: { name: string; percentage: number }[];
  peakListeningTime: string;
  deviceSplit: { mobile: number; desktop: number; smartSpeaker: number };
}

export interface SimilarArtist {
  name: string;
  genre: string;
  breakthroughMoment: string;
  whatTheyDid: string;
  currentMonthlyListeners: string;
}

export interface CareerDNA {
  soundProfile: SoundProfile;
  audienceDNA: AudienceDNA;
  growthPattern: {
    classification: string;
    explanation: string;
  };
  similarArtists: SimilarArtist[];
  optimalPath: string;
  strengths: string[];
  growthAreas: string[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// generateCareerDNA
// ---------------------------------------------------------------------------

export async function generateCareerDNA(userId: string): Promise<CareerDNA> {
  if (IS_MOCK) {
    return getMockCareerDNA(userId);
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: `You are a music analytics AI at TrueFans MANAGER. You analyze artist data to build a unique "Career DNA" fingerprint that covers sound profile, audience demographics, growth patterns, and strategic recommendations.

Return ONLY valid JSON matching the CareerDNA schema with these fields:
- soundProfile: { energy, danceability, acoustic, vocalPresence, productionComplexity, uniqueness } (all 0-100)
- audienceDNA: { primaryAgeRange, topGenders, topCountries, peakListeningTime, deviceSplit }
- growthPattern: { classification, explanation }
- similarArtists: array of 4-5 artists with breakthroughMoment and whatTheyDid
- optimalPath: strategic recommendation string
- strengths: array of 3-5 strengths
- growthAreas: array of 3-5 areas to develop`,
      messages: [
        {
          role: "user",
          content: `Generate a comprehensive Career DNA profile for artist (userId: ${userId}). Analyze their music style, audience patterns, and growth trajectory to produce actionable insights.`,
        },
      ],
    });

    const block = response.content[0];
    const text = block.type === "text" ? block.text : "";
    const parsed = JSON.parse(text);
    return { ...parsed, generatedAt: new Date().toISOString() };
  } catch (error) {
    console.error("[career-dna-service] Error:", error);
    return getMockCareerDNA(userId);
  }
}

// ---------------------------------------------------------------------------
// getCareerDNA
// ---------------------------------------------------------------------------

export async function getCareerDNA(userId: string): Promise<CareerDNA> {
  // In production, this would fetch from DB. For now, generate fresh.
  return generateCareerDNA(userId);
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockCareerDNA(_userId: string): CareerDNA {
  return {
    soundProfile: {
      energy: 72,
      danceability: 58,
      acoustic: 35,
      vocalPresence: 81,
      productionComplexity: 67,
      uniqueness: 74,
    },
    audienceDNA: {
      primaryAgeRange: "18-27",
      topGenders: [
        { label: "Female", percentage: 52 },
        { label: "Male", percentage: 44 },
        { label: "Non-binary", percentage: 4 },
      ],
      topCountries: [
        { name: "United States", percentage: 38 },
        { name: "United Kingdom", percentage: 18 },
        { name: "Germany", percentage: 12 },
      ],
      peakListeningTime: "9 PM - 12 AM",
      deviceSplit: { mobile: 68, desktop: 22, smartSpeaker: 10 },
    },
    growthPattern: {
      classification: "Steady Climber",
      explanation:
        "Your growth has been consistent and organic over the past 12 months, with a 12-15% month-over-month increase in streams. Unlike viral spikers who see sudden jumps that often drop off, your trajectory shows strong fan retention and genuine audience building. This pattern is associated with long-term career sustainability.",
    },
    similarArtists: [
      {
        name: "Raveena",
        genre: "Alt R&B / Indie",
        breakthroughMoment: "Lucid EP — Discover Weekly algorithm pick",
        whatTheyDid:
          "Released consistently every 8 weeks, built a strong visual identity on Instagram, and leaned into niche playlists before going editorial.",
        currentMonthlyListeners: "2.1M",
      },
      {
        name: "boy pablo",
        genre: "Indie Pop",
        breakthroughMoment: "'Everytime' viral on YouTube",
        whatTheyDid:
          "DIY music videos with authentic lo-fi aesthetic. Maintained a close community on social media and released an EP that capitalized on viral momentum.",
        currentMonthlyListeners: "5.8M",
      },
      {
        name: "Remi Wolf",
        genre: "Indie Pop / Funk",
        breakthroughMoment: "'Photo ID' TikTok virality",
        whatTheyDid:
          "Combined bold visual branding with genre-blending sound. Used short-form video content extensively and collaborated with bigger artists at the right time.",
        currentMonthlyListeners: "4.2M",
      },
      {
        name: "Samia",
        genre: "Indie Rock",
        breakthroughMoment: "'Is There Something in the Movies?' blog buzz",
        whatTheyDid:
          "Built a grassroots following through touring and press coverage. Focused on storytelling in lyrics that resonated deeply with her core audience.",
        currentMonthlyListeners: "850K",
      },
      {
        name: "Arlo Parks",
        genre: "Indie Pop / Spoken Word",
        breakthroughMoment: "BBC Sound of 2020 nomination",
        whatTheyDid:
          "Cultivated a literary and poetic brand. Shared poetry alongside music, partnered with indie labels early, and built strong press relationships.",
        currentMonthlyListeners: "3.5M",
      },
    ],
    optimalPath:
      "Based on your DNA, artists like you typically break through via playlist placements in indie pop and alternative playlists. Your strong vocal presence (81/100) and uniqueness score (74/100) make you an ideal candidate for Spotify's editorial indie playlists. Focus on releasing singles every 6-8 weeks to stay in the algorithm's favor, invest in short-form video content for TikTok/Reels to boost discovery, and build your email list to convert casual listeners into superfans. Your audience peaks at 9 PM-12 AM — schedule all releases and social posts for this window.",
    strengths: [
      "Strong vocal identity that stands out in your genre",
      "Consistent release cadence driving algorithmic favor",
      "High save-to-stream ratio indicating genuine fan connection",
      "Growing international audience (UK + Germany expanding)",
      "Above-average engagement rate on social platforms",
    ],
    growthAreas: [
      "Production complexity could be pushed further to attract playlist curators",
      "Desktop listener share is low — consider YouTube and long-form content",
      "Limited presence on TikTok compared to peers at your level",
      "Press coverage is minimal — invest in blog outreach and PR",
      "Live performance history is thin — book opening slots to build touring base",
    ],
    generatedAt: new Date().toISOString(),
  };
}
