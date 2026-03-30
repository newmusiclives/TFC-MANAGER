import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockPersonas = [
  { id: "ap-1", name: "Indie Emily", ageRange: "22-28", gender: "Female", interests: ["Vinyl collecting", "Coffee shops", "Film photography", "Festival culture"], platforms: ["Spotify", "Instagram", "TikTok"], listeningHabits: "Discovers music through editorial playlists and indie blogs. Listens during commutes and while working. Attends 4-6 live shows per month.", location: "Brooklyn, NY / Portland, OR", spending: "High — buys merch, vinyl, concert tickets" },
  { id: "ap-2", name: "Chill Marcus", ageRange: "25-34", gender: "Male", interests: ["Skateboarding", "Lo-fi production", "Craft beer", "Gaming"], platforms: ["YouTube", "Spotify", "Reddit"], listeningHabits: "Uses lo-fi and chill playlists as background music. Discovers through YouTube recommendations and Reddit threads. Prefers albums over singles.", location: "Austin, TX / Denver, CO", spending: "Medium — streams heavily, occasional merch" },
  { id: "ap-3", name: "Gen Z Zara", ageRange: "16-22", gender: "Female", interests: ["TikTok trends", "Aesthetic mood boards", "Thrifting", "Journaling"], platforms: ["TikTok", "Spotify", "Pinterest"], listeningHabits: "Discovers music exclusively through TikTok. Creates playlists by mood. Engages deeply with artist content and behind-the-scenes.", location: "Global — US, UK, Australia", spending: "Low monetary but high engagement — shares, saves, creates UGC" },
];

const mockCampaigns = [
  { id: "ac-1", platform: "Meta (Instagram)", name: "EP Launch — Story Ads", budget: 500, spent: 342, impressions: 85400, clicks: 2150, conversions: 186, status: "Active", startDate: "2026-03-15", endDate: "2026-04-15" },
  { id: "ac-2", platform: "TikTok", name: "Snippet Promotion — 'Midnight Drive'", budget: 300, spent: 300, impressions: 124000, clicks: 4800, conversions: 420, status: "Completed", startDate: "2026-02-20", endDate: "2026-03-10" },
  { id: "ac-3", platform: "Google (YouTube)", name: "Music Video Pre-Roll", budget: 750, spent: 215, impressions: 42000, clicks: 890, conversions: 67, status: "Active", startDate: "2026-03-20", endDate: "2026-04-20" },
  { id: "ac-4", platform: "Meta (Facebook)", name: "Tour Ticket Promotion", budget: 400, spent: 0, impressions: 0, clicks: 0, conversions: 0, status: "Draft", startDate: "2026-04-01", endDate: "2026-04-30" },
];

const mockStrategies = [
  { id: "gs-1", title: "Post more TikTok content", description: "Your genre is trending on TikTok — indie/alternative content sees 3x more engagement than average. Post 15-second snippets of upcoming tracks with visual hooks.", priority: "High", impact: "High", effort: "Low", category: "Social" },
  { id: "gs-2", title: "Target playlist curators in indie folk", description: "Based on your sound analysis, you match 12 editorial playlists you haven't pitched to yet. Curators in the indie folk space have a 23% acceptance rate for your profile.", priority: "High", impact: "High", effort: "Medium", category: "Playlists" },
  { id: "gs-3", title: "Launch a fan referral program", description: "Your superfans have an average engagement score of 87. Incentivize them to share your music with a referral reward (exclusive content, early access).", priority: "Medium", impact: "Medium", effort: "Medium", category: "Fan Engagement" },
  { id: "gs-4", title: "Collaborate with artists in adjacent genres", description: "Artists like Luna Park and Mia Chen have overlapping audiences. A feature or remix could expose you to 50K+ new potential fans.", priority: "Medium", impact: "High", effort: "High", category: "Collaborations" },
  { id: "gs-5", title: "Optimize Spotify profile for discovery", description: "Your 'About' section hasn't been updated in 6 months. Updated profiles get 30% more saves from Release Radar and Discover Weekly.", priority: "Low", impact: "Medium", effort: "Low", category: "Profile" },
  { id: "gs-6", title: "Run Instagram Reels series", description: "Behind-the-scenes studio content performs 4x better than polished posts for indie artists. Start a weekly 'Studio Sessions' Reels series.", priority: "High", impact: "Medium", effort: "Low", category: "Social" },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      personas: mockPersonas,
      campaigns: mockCampaigns,
      strategies: mockStrategies,
      stats: {
        totalReach: mockCampaigns.reduce((s, c) => s + c.impressions, 0),
        totalSpent: mockCampaigns.reduce((s, c) => s + c.spent, 0),
        totalConversions: mockCampaigns.reduce((s, c) => s + c.conversions, 0),
        avgCostPerConversion: +(mockCampaigns.reduce((s, c) => s + c.spent, 0) / Math.max(1, mockCampaigns.reduce((s, c) => s + c.conversions, 0))).toFixed(2),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch growth data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
