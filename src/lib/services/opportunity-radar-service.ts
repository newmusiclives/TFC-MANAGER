// ---------------------------------------------------------------------------
// Opportunity Radar Service
// ---------------------------------------------------------------------------

export type OpportunityType = "sync" | "playlist" | "collab" | "festival" | "grant" | "press" | "brand" | "contest";
export type OpportunityStatus = "active" | "applied" | "dismissed";

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  deadline: string;
  matchScore: number;
  source: string;
  status: OpportunityStatus;
  url?: string;
  payout?: string;
  requirements?: string;
  createdAt: string;
}

export interface OpportunityStats {
  foundThisMonth: number;
  appliedTo: number;
  successRate: number;
}

export interface OpportunityFilters {
  type?: OpportunityType;
  minMatchScore?: number;
  status?: OpportunityStatus;
  beforeDeadline?: string;
}

// ---------------------------------------------------------------------------
// scanOpportunities
// ---------------------------------------------------------------------------

export async function scanOpportunities(userId: string): Promise<Opportunity[]> {
  // In production, this would use AI to scan external sources
  void userId;
  return getMockOpportunities();
}

// ---------------------------------------------------------------------------
// getOpportunities
// ---------------------------------------------------------------------------

export async function getOpportunities(
  userId: string,
  filters?: OpportunityFilters
): Promise<{ opportunities: Opportunity[]; stats: OpportunityStats }> {
  void userId;
  let opps = getMockOpportunities();

  if (filters?.type) {
    opps = opps.filter((o) => o.type === filters.type);
  }
  if (filters?.minMatchScore) {
    opps = opps.filter((o) => o.matchScore >= filters.minMatchScore!);
  }
  if (filters?.status) {
    opps = opps.filter((o) => o.status === filters.status);
  }

  const stats: OpportunityStats = {
    foundThisMonth: 23,
    appliedTo: 7,
    successRate: 28.6,
  };

  return { opportunities: opps, stats };
}

// ---------------------------------------------------------------------------
// updateOpportunityStatus
// ---------------------------------------------------------------------------

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus
): Promise<Opportunity | null> {
  // In production, update in DB
  const opps = getMockOpportunities();
  const opp = opps.find((o) => o.id === id);
  if (!opp) return null;
  return { ...opp, status };
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockOpportunities(): Opportunity[] {
  return [
    {
      id: "opp-1",
      type: "sync",
      title: "Netflix Indie Film — Emotional Scene Placement",
      description: "Seeking indie tracks with strong vocal presence and emotional depth for a coming-of-age film. 30-60 second placement. Non-exclusive license.",
      deadline: "2026-04-15",
      matchScore: 92,
      source: "Musicbed",
      status: "active",
      payout: "$2,000 - $5,000",
      requirements: "Master ownership required. Track under 4 minutes preferred.",
      createdAt: "2026-03-20",
    },
    {
      id: "opp-2",
      type: "playlist",
      title: "Spotify 'Indie Chill' Editorial Playlist",
      description: "Curator accepting submissions for Spotify's Indie Chill playlist (850K followers). Looking for mellow, atmospheric indie tracks.",
      deadline: "2026-04-01",
      matchScore: 88,
      source: "Spotify for Artists",
      status: "active",
      requirements: "Must be released within last 30 days.",
      createdAt: "2026-03-15",
    },
    {
      id: "opp-3",
      type: "collab",
      title: "Collab with Arlo Waves (120K Monthly Listeners)",
      description: "Arlo Waves is looking for a vocalist for their upcoming single. Indie pop with electronic production. Split 50/50.",
      deadline: "2026-04-20",
      matchScore: 85,
      source: "TrueFans Connect",
      status: "active",
      url: "https://truefans.com/collab/arlo-waves",
      createdAt: "2026-03-22",
    },
    {
      id: "opp-4",
      type: "festival",
      title: "SXSW 2027 Emerging Artist Showcase",
      description: "Applications open for SXSW 2027 emerging artist showcase slots. 25-minute set, travel stipend included.",
      deadline: "2026-06-30",
      matchScore: 78,
      source: "SXSW",
      status: "active",
      requirements: "Must have released music in the past 12 months. US-based or willing to travel.",
      createdAt: "2026-03-10",
    },
    {
      id: "opp-5",
      type: "grant",
      title: "FACTOR Canada — Artist Development Grant",
      description: "Up to $15,000 for recording, marketing, and touring support. Open to Canadian artists or those with Canadian distribution.",
      deadline: "2026-05-15",
      matchScore: 45,
      source: "FACTOR",
      status: "active",
      payout: "Up to $15,000",
      requirements: "Canadian citizenship or permanent residency required.",
      createdAt: "2026-03-01",
    },
    {
      id: "opp-6",
      type: "press",
      title: "Earmilk Feature — New Artist Spotlight",
      description: "Earmilk accepting submissions for their weekly New Artist Spotlight series. 500-word feature + social media push.",
      deadline: "2026-04-10",
      matchScore: 82,
      source: "Earmilk",
      status: "active",
      requirements: "Press kit and high-res photos required.",
      createdAt: "2026-03-18",
    },
    {
      id: "opp-7",
      type: "brand",
      title: "Fender — Next Gen Artist Program",
      description: "Fender seeking 10 emerging artists for their Next Gen program. Includes gear, content creation opportunities, and social media features.",
      deadline: "2026-05-01",
      matchScore: 76,
      source: "Fender",
      status: "active",
      payout: "Gear + $1,000 stipend",
      createdAt: "2026-03-12",
    },
    {
      id: "opp-8",
      type: "sync",
      title: "Apple TV+ Series — Background Music",
      description: "Looking for upbeat indie tracks for background scenes in a new dramedy series. Multiple placements possible.",
      deadline: "2026-04-30",
      matchScore: 74,
      source: "Music Gateway",
      status: "active",
      payout: "$500 - $2,000 per placement",
      createdAt: "2026-03-25",
    },
    {
      id: "opp-9",
      type: "contest",
      title: "NPR Tiny Desk Contest 2026",
      description: "Annual contest for a chance to play an NPR Tiny Desk Concert. Submit an original song video performance.",
      deadline: "2026-04-22",
      matchScore: 71,
      source: "NPR",
      status: "active",
      requirements: "Must submit a video performance. Original music only.",
      createdAt: "2026-03-05",
    },
    {
      id: "opp-10",
      type: "playlist",
      title: "Apple Music 'New in Indie' Playlist",
      description: "Weekly updated playlist for fresh indie releases. Submit through Apple Music for Artists.",
      deadline: "2026-04-05",
      matchScore: 86,
      source: "Apple Music for Artists",
      status: "active",
      createdAt: "2026-03-19",
    },
    {
      id: "opp-11",
      type: "festival",
      title: "Primavera Sound 2027 — Open Call",
      description: "Primavera Sound Barcelona accepting applications for their emerging artist stage. International slots available.",
      deadline: "2026-07-15",
      matchScore: 62,
      source: "Primavera Sound",
      status: "active",
      requirements: "Active touring history and European distribution preferred.",
      createdAt: "2026-03-08",
    },
    {
      id: "opp-12",
      type: "collab",
      title: "Producer Session with MXXWLL (Grammy-nominated)",
      description: "Open producer session for 3 selected artists. Full day in studio with MXXWLL, track kept by artist.",
      deadline: "2026-04-12",
      matchScore: 68,
      source: "Splice Sessions",
      status: "active",
      createdAt: "2026-03-14",
    },
    {
      id: "opp-13",
      type: "grant",
      title: "PRS Foundation — Women Make Music",
      description: "Funding for women, trans, and non-binary musicians. Grants of $500-$5,000 for recording, touring, or development.",
      deadline: "2026-05-20",
      matchScore: 70,
      source: "PRS Foundation",
      status: "active",
      payout: "$500 - $5,000",
      createdAt: "2026-03-02",
    },
    {
      id: "opp-14",
      type: "brand",
      title: "Converse — Music Ambassador Program",
      description: "Converse seeking diverse emerging musicians for a 6-month brand ambassador program with content creation and live events.",
      deadline: "2026-04-25",
      matchScore: 65,
      source: "Converse Music",
      status: "active",
      payout: "$3,000 + product",
      createdAt: "2026-03-16",
    },
    {
      id: "opp-15",
      type: "press",
      title: "Pitchfork 'Rising' Feature",
      description: "Pitchfork's Rising column showcasing the best new artists. Editorial team sourcing candidates.",
      deadline: "2026-04-18",
      matchScore: 58,
      source: "Pitchfork",
      status: "active",
      requirements: "Strong critical acclaim or unique angle required.",
      createdAt: "2026-03-21",
    },
    {
      id: "opp-16",
      type: "sync",
      title: "Volkswagen Commercial — Summer Campaign",
      description: "Feel-good indie track for summer TV and digital ad campaign. Global placement.",
      deadline: "2026-05-10",
      matchScore: 80,
      source: "Music Dealers",
      status: "applied",
      payout: "$10,000 - $25,000",
      createdAt: "2026-03-11",
    },
    {
      id: "opp-17",
      type: "playlist",
      title: "Tidal 'Rising' Playlist Feature",
      description: "Tidal editorial team curating tracks for their Rising playlist. Focus on genre-bending artists.",
      deadline: "2026-03-25",
      matchScore: 72,
      source: "Tidal",
      status: "dismissed",
      createdAt: "2026-03-06",
    },
  ];
}
