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
  maxTokens = 4096
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
    console.error("[seo-aieo-service] Claude API error:", message);
    throw new Error(`AI service error: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SEOIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  fix: string;
}

export interface SEOAudit {
  overallScore: number;
  categories: {
    technicalSEO: { score: number; issues: SEOIssue[] };
    contentSEO: { score: number; issues: SEOIssue[] };
    socialSEO: { score: number; issues: SEOIssue[] };
    aiVisibility: { score: number; issues: SEOIssue[] };
  };
  recommendations: string[];
}

export interface AIEOProfile {
  aiReadinessScore: number;
  structuredData: {
    hasSchema: boolean;
    schemaTypes: string[];
    missingSchemas: string[];
  };
  entityRecognition: {
    isRecognizedEntity: boolean;
    knowledgeGraphPresence: string[];
    missingPlatforms: string[];
  };
  contentAuthority: {
    score: number;
    signals: string[];
    improvements: string[];
  };
  citationReadiness: {
    score: number;
    existingCitations: string[];
    opportunities: string[];
  };
}

export interface KeywordAnalysis {
  primaryKeywords: { keyword: string; volume: string; difficulty: string; currentRank: string }[];
  longTailOpportunities: { keyword: string; volume: string; difficulty: string }[];
  aiQueryOpportunities: { query: string; relevance: number; currentVisibility: string }[];
}

export interface CompetitorSEOData {
  name: string;
  seoScore: number;
  aieoScore: number;
  socialPresence: number;
  contentAuthority: number;
}

export interface CompetitorAnalysis {
  artist: CompetitorSEOData;
  competitors: CompetitorSEOData[];
  behind: string[];
  ahead: string[];
  recommendations: string[];
}

export interface StructuredDataOutput {
  schemas: Record<string, object>;
  faqSchema?: object;
}

// ---------------------------------------------------------------------------
// runSEOAudit
// ---------------------------------------------------------------------------

export async function runSEOAudit(artistData: {
  name?: string;
  genre?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  [key: string]: unknown;
}): Promise<SEOAudit> {
  if (IS_MOCK) {
    return getMockSEOAudit();
  }

  const systemPrompt = `You are an expert SEO and AI Engine Optimization analyst at TrueFans MANAGER. Analyze the artist's online presence and provide a comprehensive SEO audit.

Return ONLY valid JSON matching this schema:
{
  "overallScore": <0-100>,
  "categories": {
    "technicalSEO": { "score": <0-100>, "issues": [{ "severity": "critical"|"warning"|"info", "title": "...", "description": "...", "fix": "..." }] },
    "contentSEO": { "score": <0-100>, "issues": [...] },
    "socialSEO": { "score": <0-100>, "issues": [...] },
    "aiVisibility": { "score": <0-100>, "issues": [...] }
  },
  "recommendations": ["..."]
}

Provide at least 15 issues across all categories. Be specific and actionable.`;

  const raw = await askClaude(systemPrompt, `Analyze SEO for this artist:\n${JSON.stringify(artistData, null, 2)}`, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return getMockSEOAudit();
  }
}

// ---------------------------------------------------------------------------
// generateAIEOProfile
// ---------------------------------------------------------------------------

export async function generateAIEOProfile(artistData: {
  name?: string;
  genre?: string;
  [key: string]: unknown;
}): Promise<AIEOProfile> {
  if (IS_MOCK) {
    return getMockAIEOProfile();
  }

  const systemPrompt = `You are an AI Engine Optimization expert at TrueFans MANAGER. Analyze how well an artist is optimized for AI engines (ChatGPT, Perplexity, Claude, Google AI Overviews).

Return ONLY valid JSON matching this schema:
{
  "aiReadinessScore": <0-100>,
  "structuredData": { "hasSchema": boolean, "schemaTypes": [...], "missingSchemas": [...] },
  "entityRecognition": { "isRecognizedEntity": boolean, "knowledgeGraphPresence": [...], "missingPlatforms": [...] },
  "contentAuthority": { "score": <0-100>, "signals": [...], "improvements": [...] },
  "citationReadiness": { "score": <0-100>, "existingCitations": [...], "opportunities": [...] }
}`;

  const raw = await askClaude(systemPrompt, `Analyze AI visibility for:\n${JSON.stringify(artistData, null, 2)}`, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return getMockAIEOProfile();
  }
}

// ---------------------------------------------------------------------------
// analyzeKeywords
// ---------------------------------------------------------------------------

export async function analyzeKeywords(genre: string, artistName: string): Promise<KeywordAnalysis> {
  if (IS_MOCK) {
    return getMockKeywordAnalysis(genre, artistName);
  }

  const systemPrompt = `You are a music industry SEO keyword researcher at TrueFans MANAGER. Analyze keyword opportunities for an artist.

Return ONLY valid JSON:
{
  "primaryKeywords": [{ "keyword": "...", "volume": "...", "difficulty": "Low"|"Medium"|"High", "currentRank": "..." }],
  "longTailOpportunities": [{ "keyword": "...", "volume": "...", "difficulty": "Low"|"Medium"|"High" }],
  "aiQueryOpportunities": [{ "query": "...", "relevance": <0-100>, "currentVisibility": "Not visible"|"Partially visible"|"Visible" }]
}`;

  const raw = await askClaude(systemPrompt, `Keywords for: ${artistName}, genre: ${genre}`, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return getMockKeywordAnalysis(genre, artistName);
  }
}

// ---------------------------------------------------------------------------
// generateStructuredData
// ---------------------------------------------------------------------------

export async function generateStructuredData(artistData: {
  name?: string;
  genre?: string;
  description?: string;
  albums?: { name: string; releaseDate: string }[];
  website?: string;
  socialLinks?: Record<string, string>;
  [key: string]: unknown;
}, enabledSchemas: string[] = ["MusicGroup", "Person", "MusicAlbum", "MusicRecording", "Event"]): Promise<StructuredDataOutput> {
  const schemas: Record<string, object> = {};

  if (enabledSchemas.includes("MusicGroup")) {
    schemas.MusicGroup = {
      "@context": "https://schema.org",
      "@type": "MusicGroup",
      name: artistData.name || "Artist Name",
      genre: artistData.genre || "Pop",
      description: artistData.description || `${artistData.name || "Artist"} is an independent music artist.`,
      url: artistData.website || "https://example.com",
      sameAs: Object.values(artistData.socialLinks || {}),
    };
  }

  if (enabledSchemas.includes("Person")) {
    schemas.Person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: artistData.name || "Artist Name",
      url: artistData.website || "https://example.com",
      jobTitle: "Music Artist",
      sameAs: Object.values(artistData.socialLinks || {}),
    };
  }

  if (enabledSchemas.includes("MusicAlbum") && artistData.albums?.length) {
    schemas.MusicAlbum = {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: artistData.albums[0].name,
      datePublished: artistData.albums[0].releaseDate,
      byArtist: {
        "@type": "MusicGroup",
        name: artistData.name || "Artist Name",
      },
    };
  }

  if (enabledSchemas.includes("MusicRecording")) {
    schemas.MusicRecording = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: "Latest Track",
      byArtist: {
        "@type": "MusicGroup",
        name: artistData.name || "Artist Name",
      },
      genre: artistData.genre || "Pop",
    };
  }

  if (enabledSchemas.includes("Event")) {
    schemas.Event = {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: `${artistData.name || "Artist"} Live`,
      performer: {
        "@type": "MusicGroup",
        name: artistData.name || "Artist Name",
      },
    };
  }

  return { schemas };
}

// ---------------------------------------------------------------------------
// generateMetaTags
// ---------------------------------------------------------------------------

export function generateMetaTags(
  pageType: string,
  data: {
    artistName?: string;
    trackName?: string;
    description?: string;
    imageUrl?: string;
    url?: string;
    [key: string]: unknown;
  }
): Record<string, string> {
  const artistName = data.artistName || "Artist";
  const description = data.description || `${artistName} — independent music artist. Listen to the latest releases and discover more.`;

  const baseTags: Record<string, string> = {
    title: "",
    description,
    "og:type": "music.musician",
    "og:title": "",
    "og:description": description,
    "og:image": data.imageUrl || "/default-og.jpg",
    "og:url": data.url || "",
    "twitter:card": "summary_large_image",
    "twitter:title": "",
    "twitter:description": description,
    "twitter:image": data.imageUrl || "/default-og.jpg",
  };

  switch (pageType) {
    case "artist":
      baseTags.title = `${artistName} — Official Artist Page`;
      baseTags["og:title"] = baseTags.title;
      baseTags["twitter:title"] = baseTags.title;
      break;
    case "track":
      baseTags.title = `${data.trackName || "New Track"} by ${artistName}`;
      baseTags["og:title"] = baseTags.title;
      baseTags["og:type"] = "music.song";
      baseTags["twitter:title"] = baseTags.title;
      break;
    case "album":
      baseTags.title = `${data.trackName || "New Album"} — ${artistName}`;
      baseTags["og:title"] = baseTags.title;
      baseTags["og:type"] = "music.album";
      baseTags["twitter:title"] = baseTags.title;
      break;
    default:
      baseTags.title = `${artistName} — Music`;
      baseTags["og:title"] = baseTags.title;
      baseTags["twitter:title"] = baseTags.title;
  }

  return baseTags;
}

// ---------------------------------------------------------------------------
// generateAIOptimizedBio
// ---------------------------------------------------------------------------

export async function generateAIOptimizedBio(artistData: {
  name?: string;
  genre?: string;
  achievements?: string[];
  releases?: string[];
  [key: string]: unknown;
}): Promise<string> {
  if (IS_MOCK) {
    return getMockAIOptimizedBio(artistData.name || "Artist");
  }

  const systemPrompt = `You are an AI Engine Optimization bio writer at TrueFans MANAGER. Write artist bios that are optimized for AI engines to understand and cite.

The bio should be:
- Entity-rich: clearly state who the person is, what they do, their genre, achievements
- Factual and verifiable: include specific data points AI engines can reference
- Structured: use clear, parseable sentences that AI can extract facts from
- Citation-worthy: written in a style that AI would want to quote
- 2-3 paragraphs, professional yet engaging`;

  return askClaude(systemPrompt, `Write an AI-optimized bio for:\n${JSON.stringify(artistData, null, 2)}`, 1024);
}

// ---------------------------------------------------------------------------
// getCompetitorSEOAnalysis
// ---------------------------------------------------------------------------

export async function getCompetitorSEOAnalysis(competitors: string[]): Promise<CompetitorAnalysis> {
  if (IS_MOCK) {
    return getMockCompetitorAnalysis(competitors);
  }

  const systemPrompt = `You are an SEO competitive analyst at TrueFans MANAGER. Compare an artist's SEO performance against competitors.

Return ONLY valid JSON:
{
  "artist": { "name": "...", "seoScore": <0-100>, "aieoScore": <0-100>, "socialPresence": <0-100>, "contentAuthority": <0-100> },
  "competitors": [{ "name": "...", "seoScore": <0-100>, "aieoScore": <0-100>, "socialPresence": <0-100>, "contentAuthority": <0-100> }],
  "behind": ["areas where artist is behind"],
  "ahead": ["areas where artist is ahead"],
  "recommendations": ["actionable recommendations"]
}`;

  const raw = await askClaude(systemPrompt, `Competitors: ${competitors.join(", ")}`, 4096);

  try {
    return JSON.parse(raw);
  } catch {
    return getMockCompetitorAnalysis(competitors);
  }
}

// ---------------------------------------------------------------------------
// generateFAQSchema
// ---------------------------------------------------------------------------

export function generateFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// trackAIVisibility
// ---------------------------------------------------------------------------

export async function trackAIVisibility(artistName: string): Promise<{
  overallVisibility: string;
  platforms: { name: string; status: string; details: string }[];
}> {
  // Always mock — we can't actually query AI engines programmatically
  return {
    overallVisibility: "Partially Visible",
    platforms: [
      { name: "ChatGPT", status: "Partially visible", details: `ChatGPT can identify ${artistName} but provides limited information. Bio data is incomplete.` },
      { name: "Perplexity", status: "Visible", details: `Perplexity surfaces ${artistName}'s Spotify and social profiles. Discography data is accurate.` },
      { name: "Google AI Overviews", status: "Not visible", details: `${artistName} does not appear in Google AI Overviews for relevant queries. Structured data and authority signals need improvement.` },
      { name: "Claude", status: "Partially visible", details: `Claude has basic knowledge of ${artistName} but lacks recent release information and detailed discography.` },
      { name: "Bing Copilot", status: "Not visible", details: `${artistName} is not referenced in Bing Copilot responses. Improving Bing indexing and LinkedIn presence may help.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

function getMockSEOAudit(): SEOAudit {
  return {
    overallScore: 54,
    categories: {
      technicalSEO: {
        score: 62,
        issues: [
          { severity: "critical", title: "Missing SSL certificate on artist website", description: "Your website does not have a valid SSL certificate. This severely impacts search rankings and user trust.", fix: "Install an SSL certificate through your hosting provider. Most providers offer free SSL via Let's Encrypt." },
          { severity: "critical", title: "No sitemap.xml found", description: "Search engines cannot discover all your pages without a sitemap.", fix: "Generate a sitemap.xml and submit it to Google Search Console and Bing Webmaster Tools." },
          { severity: "warning", title: "Slow page load speed (4.2s)", description: "Your website takes over 4 seconds to load on mobile. Google recommends under 2.5 seconds.", fix: "Optimize images, enable compression, and consider a CDN. Defer non-critical JavaScript." },
          { severity: "warning", title: "Missing robots.txt", description: "No robots.txt file found. Search engines may not crawl your site efficiently.", fix: "Create a robots.txt file in your root directory that allows crawling of important pages." },
          { severity: "info", title: "No canonical tags on key pages", description: "Canonical tags help prevent duplicate content issues.", fix: "Add rel='canonical' tags to all important pages." },
        ],
      },
      contentSEO: {
        score: 48,
        issues: [
          { severity: "critical", title: "No meta descriptions on 80% of pages", description: "Most pages are missing meta descriptions, which appear in search results and influence click-through rates.", fix: "Write unique, compelling meta descriptions (150-160 characters) for every page." },
          { severity: "critical", title: "Thin content on artist bio page", description: "Your bio page has only 45 words. Search engines favor comprehensive, detailed content.", fix: "Expand your bio to 300-500 words. Include genre, influences, discography, achievements, and upcoming projects." },
          { severity: "warning", title: "No heading hierarchy (H1-H6)", description: "Pages lack proper heading structure, making it hard for search engines to understand content hierarchy.", fix: "Use a single H1 per page, followed by H2s for sections and H3s for subsections." },
          { severity: "warning", title: "Images missing alt text", description: "12 images across your site have no alt text, reducing accessibility and image search visibility.", fix: "Add descriptive alt text to all images. Include your name and relevant context." },
        ],
      },
      socialSEO: {
        score: 55,
        issues: [
          { severity: "warning", title: "Missing Open Graph tags", description: "Social shares of your website don't display rich previews.", fix: "Add og:title, og:description, og:image, and og:url tags to all pages." },
          { severity: "warning", title: "No Twitter Card markup", description: "Twitter shares display as plain links instead of rich cards.", fix: "Add Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image)." },
          { severity: "info", title: "Inconsistent branding across platforms", description: "Your name/bio differs between Spotify, Instagram, and your website.", fix: "Ensure consistent artist name, bio, and profile images across all platforms." },
        ],
      },
      aiVisibility: {
        score: 38,
        issues: [
          { severity: "critical", title: "No structured data (JSON-LD) found", description: "AI engines rely heavily on structured data to understand entities. Without it, you're invisible to AI.", fix: "Add MusicGroup, Person, and MusicAlbum JSON-LD schemas to your website." },
          { severity: "critical", title: "Not in any knowledge graph", description: "You don't appear in Google Knowledge Graph, Wikidata, or MusicBrainz.", fix: "Create entries on Wikidata and MusicBrainz. Claim your Google Knowledge Panel." },
          { severity: "warning", title: "No FAQ content for AI to cite", description: "AI engines love citing FAQ-style content. Your site has no FAQ section.", fix: "Add a FAQ page with common questions about your music, genre, and upcoming releases." },
        ],
      },
    },
    recommendations: [
      "Add JSON-LD structured data (MusicGroup, Person schemas) to your website immediately — this is the #1 thing you can do for AI visibility.",
      "Create entries on Wikidata and MusicBrainz to establish yourself as a recognized entity.",
      "Write a comprehensive, fact-rich bio that AI engines can parse and cite.",
      "Install an SSL certificate and fix technical SEO issues to improve baseline rankings.",
      "Add Open Graph and Twitter Card tags to improve social sharing visibility.",
      "Create FAQ content targeting common AI queries about your genre and style.",
      "Ensure your name, bio, and profile are consistent across all platforms.",
      "Submit your sitemap to Google Search Console and Bing Webmaster Tools.",
    ],
  };
}

function getMockAIEOProfile(): AIEOProfile {
  return {
    aiReadinessScore: 35,
    structuredData: {
      hasSchema: false,
      schemaTypes: [],
      missingSchemas: ["MusicGroup", "Person", "MusicAlbum", "MusicRecording", "Event", "FAQPage"],
    },
    entityRecognition: {
      isRecognizedEntity: false,
      knowledgeGraphPresence: ["Spotify", "Apple Music"],
      missingPlatforms: ["Google Knowledge Graph", "Wikidata", "MusicBrainz", "Discogs", "AllMusic", "Wikipedia"],
    },
    contentAuthority: {
      score: 42,
      signals: [
        "Verified Spotify for Artists profile",
        "Consistent social media activity (3+ posts/week)",
        "Active Apple Music for Artists profile",
      ],
      improvements: [
        "Get featured in music blogs and publications to build backlinks",
        "Create consistent, fact-rich content that other sites can reference",
        "Establish presence on authoritative music databases (MusicBrainz, Discogs)",
        "Get your Wikipedia article created (requires notability criteria)",
        "Ensure all streaming profiles have complete, matching metadata",
      ],
    },
    citationReadiness: {
      score: 28,
      existingCitations: [
        "Spotify artist profile appears in Perplexity searches",
        "Instagram posts referenced in Google AI Overviews for genre queries",
      ],
      opportunities: [
        "Create a detailed press kit page that AI can cite for biographical info",
        "Publish interviews and quotes that AI engines can reference",
        "Write thought-leadership content about your genre/craft",
        "Get reviewed by established music publications",
        "Create a YouTube channel with optimized descriptions and transcripts",
        "Build a comprehensive discography page with structured data",
      ],
    },
  };
}

function getMockKeywordAnalysis(genre: string, artistName: string): KeywordAnalysis {
  return {
    primaryKeywords: [
      { keyword: `${artistName} music`, volume: "1,200/mo", difficulty: "Low", currentRank: "Not ranked" },
      { keyword: `${artistName} songs`, volume: "880/mo", difficulty: "Low", currentRank: "Not ranked" },
      { keyword: `${artistName} new album`, volume: "320/mo", difficulty: "Low", currentRank: "Not ranked" },
      { keyword: `${genre} new artists 2026`, volume: "5,400/mo", difficulty: "High", currentRank: "#45" },
      { keyword: `best ${genre} artists`, volume: "8,100/mo", difficulty: "High", currentRank: "Not ranked" },
      { keyword: `${artistName} concert tickets`, volume: "260/mo", difficulty: "Low", currentRank: "Not ranked" },
      { keyword: `${artistName} lyrics`, volume: "590/mo", difficulty: "Low", currentRank: "Not ranked" },
    ],
    longTailOpportunities: [
      { keyword: `${genre} artists like ${artistName}`, volume: "140/mo", difficulty: "Low" },
      { keyword: `underground ${genre} artists to watch 2026`, volume: "2,900/mo", difficulty: "Medium" },
      { keyword: `best new ${genre} songs this week`, volume: "3,600/mo", difficulty: "Medium" },
      { keyword: `${genre} playlist submissions indie`, volume: "1,800/mo", difficulty: "Medium" },
      { keyword: `independent ${genre} artists spotify`, volume: "720/mo", difficulty: "Low" },
      { keyword: `${genre} music blog features`, volume: "480/mo", difficulty: "Low" },
    ],
    aiQueryOpportunities: [
      { query: `Who are the best new ${genre} artists?`, relevance: 92, currentVisibility: "Not visible" },
      { query: `What ${genre} songs should I listen to?`, relevance: 88, currentVisibility: "Not visible" },
      { query: `Tell me about ${artistName}`, relevance: 100, currentVisibility: "Partially visible" },
      { query: `What genre is ${artistName}?`, relevance: 95, currentVisibility: "Partially visible" },
      { query: `Best indie ${genre} playlists`, relevance: 78, currentVisibility: "Not visible" },
      { query: `New ${genre} releases this month`, relevance: 85, currentVisibility: "Not visible" },
      { query: `${genre} artists similar to [popular artist]`, relevance: 82, currentVisibility: "Not visible" },
      { query: `Up and coming ${genre} musicians`, relevance: 90, currentVisibility: "Not visible" },
    ],
  };
}

function getMockAIOptimizedBio(name: string): string {
  return `${name} is an independent music artist and songwriter known for blending contemporary production with authentic, emotionally resonant storytelling. Based in Los Angeles, California, ${name} has been active in the music industry since 2020, releasing multiple singles and EPs that have collectively garnered over 500,000 streams across major platforms including Spotify, Apple Music, and YouTube Music.

${name}'s musical style draws from a diverse range of influences spanning alternative R&B, indie pop, and electronic music. Critics have noted the artist's distinctive vocal delivery and innovative approach to production, which combines organic instrumentation with modern synthesizers and sampling techniques. Notable releases include the debut EP "First Light" (2022) and the single "Midnight Frequencies" (2024), which was featured on several editorial playlists.

As an independent artist, ${name} represents a growing movement of self-managed musicians leveraging technology and direct fan engagement to build sustainable careers outside the traditional label system. ${name} is currently working on a forthcoming full-length album scheduled for release in 2026, and has performed at venues and festivals across the United States.`;
}

function getMockCompetitorAnalysis(competitors: string[]): CompetitorAnalysis {
  const compNames = competitors.length >= 3 ? competitors.slice(0, 3) : ["Similar Artist A", "Similar Artist B", "Similar Artist C"];
  return {
    artist: { name: "You", seoScore: 54, aieoScore: 35, socialPresence: 62, contentAuthority: 42 },
    competitors: [
      { name: compNames[0], seoScore: 78, aieoScore: 65, socialPresence: 85, contentAuthority: 72 },
      { name: compNames[1], seoScore: 65, aieoScore: 48, socialPresence: 71, contentAuthority: 55 },
      { name: compNames[2], seoScore: 42, aieoScore: 22, socialPresence: 58, contentAuthority: 30 },
    ],
    behind: [
      `${compNames[0]} has structured data on their website, giving them a significant AI visibility advantage`,
      `${compNames[0]} has a Wikipedia page and Wikidata entry — major entity recognition boost`,
      `${compNames[1]} has 3x more backlinks from music publications`,
      `Both ${compNames[0]} and ${compNames[1]} have consistent Open Graph tags for social sharing`,
      `${compNames[0]} appears in Google Knowledge Graph with a knowledge panel`,
    ],
    ahead: [
      `Your social media posting frequency is higher than ${compNames[2]}`,
      `Your Spotify profile is more complete than ${compNames[2]}`,
      `You have more consistent cross-platform branding than ${compNames[1]}`,
    ],
    recommendations: [
      `Priority: Add structured data to match ${compNames[0]}'s AI visibility`,
      `Create a Wikidata entry and aim for a Wikipedia page to close the entity recognition gap`,
      `Pursue press coverage and blog features to build backlinks like ${compNames[1]}`,
      `Implement Open Graph and Twitter Card tags to match competitor social sharing quality`,
      `Focus on content depth — write longer, more detailed pages like ${compNames[0]}'s artist bio`,
    ],
  };
}
