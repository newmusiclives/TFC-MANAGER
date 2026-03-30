// ---------------------------------------------------------------------------
// Fan Value Score Service
// ---------------------------------------------------------------------------

export interface FanSegment {
  tier: string;
  label: string;
  color: string;
  minValue: number;
  maxValue: number | null;
  count: number;
  totalValue: number;
  percentageOfFans: number;
}

export interface TopFan {
  id: string;
  name: string;
  email: string;
  lifetimeValue: number;
  streams: number;
  merchPurchases: number;
  showAttendance: number;
  engagementScore: number;
  lastActive: string;
  tier: string;
}

export interface ValueDriver {
  source: string;
  percentage: number;
  color: string;
}

export interface GrowthOpportunity {
  title: string;
  description: string;
  estimatedImpact: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

export interface FanValueAnalytics {
  overview: {
    totalFanbaseValue: number;
    averageFanValue: number;
    topTenPercentValue: number;
    totalFans: number;
    valueTrend: { month: string; value: number }[];
  };
  segments: FanSegment[];
  topFans: TopFan[];
  valueDrivers: ValueDriver[];
  growthOpportunities: GrowthOpportunity[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// calculateFanValues
// ---------------------------------------------------------------------------

export async function calculateFanValues(userId: string): Promise<FanValueAnalytics> {
  // In production, this would crunch real data from streams, merch, shows, etc.
  return getMockFanValueAnalytics(userId);
}

// ---------------------------------------------------------------------------
// getFanValueAnalytics
// ---------------------------------------------------------------------------

export async function getFanValueAnalytics(userId: string): Promise<FanValueAnalytics> {
  return calculateFanValues(userId);
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockFanValueAnalytics(_userId: string): FanValueAnalytics {
  return {
    overview: {
      totalFanbaseValue: 47850,
      averageFanValue: 8.32,
      topTenPercentValue: 62.40,
      totalFans: 5750,
      valueTrend: [
        { month: "Oct 2025", value: 35200 },
        { month: "Nov 2025", value: 37800 },
        { month: "Dec 2025", value: 39500 },
        { month: "Jan 2026", value: 42100 },
        { month: "Feb 2026", value: 45300 },
        { month: "Mar 2026", value: 47850 },
      ],
    },
    segments: [
      {
        tier: "platinum",
        label: "Platinum",
        color: "#7c3aed",
        minValue: 50,
        maxValue: null,
        count: 85,
        totalValue: 8925,
        percentageOfFans: 1.5,
      },
      {
        tier: "gold",
        label: "Gold",
        color: "#f59e0b",
        minValue: 20,
        maxValue: 50,
        count: 340,
        totalValue: 11560,
        percentageOfFans: 5.9,
      },
      {
        tier: "silver",
        label: "Silver",
        color: "#6b7280",
        minValue: 5,
        maxValue: 20,
        count: 1150,
        totalValue: 13800,
        percentageOfFans: 20.0,
      },
      {
        tier: "bronze",
        label: "Bronze",
        color: "#d97706",
        minValue: 1,
        maxValue: 5,
        count: 2175,
        totalValue: 8700,
        percentageOfFans: 37.8,
      },
      {
        tier: "inactive",
        label: "Inactive",
        color: "#e5e7eb",
        minValue: 0,
        maxValue: 1,
        count: 2000,
        totalValue: 4865,
        percentageOfFans: 34.8,
      },
    ],
    topFans: [
      { id: "f1", name: "Sarah Mitchell", email: "sarah.m@email.com", lifetimeValue: 342.50, streams: 4820, merchPurchases: 12, showAttendance: 8, engagementScore: 98, lastActive: "2026-03-28", tier: "platinum" },
      { id: "f2", name: "James Chen", email: "james.c@email.com", lifetimeValue: 289.00, streams: 3560, merchPurchases: 9, showAttendance: 6, engagementScore: 95, lastActive: "2026-03-27", tier: "platinum" },
      { id: "f3", name: "Maria Rodriguez", email: "maria.r@email.com", lifetimeValue: 256.80, streams: 5200, merchPurchases: 7, showAttendance: 5, engagementScore: 94, lastActive: "2026-03-29", tier: "platinum" },
      { id: "f4", name: "Alex Kim", email: "alex.k@email.com", lifetimeValue: 198.40, streams: 2890, merchPurchases: 8, showAttendance: 4, engagementScore: 91, lastActive: "2026-03-26", tier: "platinum" },
      { id: "f5", name: "Jordan Peters", email: "jordan.p@email.com", lifetimeValue: 187.20, streams: 3100, merchPurchases: 6, showAttendance: 5, engagementScore: 89, lastActive: "2026-03-28", tier: "platinum" },
      { id: "f6", name: "Emma Watson", email: "emma.w@email.com", lifetimeValue: 156.90, streams: 2450, merchPurchases: 5, showAttendance: 4, engagementScore: 87, lastActive: "2026-03-25", tier: "platinum" },
      { id: "f7", name: "Tyler Brooks", email: "tyler.b@email.com", lifetimeValue: 134.50, streams: 2100, merchPurchases: 6, showAttendance: 3, engagementScore: 85, lastActive: "2026-03-27", tier: "platinum" },
      { id: "f8", name: "Lisa Park", email: "lisa.p@email.com", lifetimeValue: 128.00, streams: 1980, merchPurchases: 4, showAttendance: 4, engagementScore: 83, lastActive: "2026-03-24", tier: "platinum" },
      { id: "f9", name: "David Okafor", email: "david.o@email.com", lifetimeValue: 112.30, streams: 2340, merchPurchases: 3, showAttendance: 3, engagementScore: 81, lastActive: "2026-03-29", tier: "platinum" },
      { id: "f10", name: "Nina Patel", email: "nina.p@email.com", lifetimeValue: 98.60, streams: 1670, merchPurchases: 4, showAttendance: 2, engagementScore: 79, lastActive: "2026-03-23", tier: "platinum" },
      { id: "f11", name: "Chris Taylor", email: "chris.t@email.com", lifetimeValue: 87.40, streams: 1890, merchPurchases: 3, showAttendance: 2, engagementScore: 76, lastActive: "2026-03-26", tier: "platinum" },
      { id: "f12", name: "Amy Liu", email: "amy.l@email.com", lifetimeValue: 76.20, streams: 1540, merchPurchases: 2, showAttendance: 3, engagementScore: 74, lastActive: "2026-03-22", tier: "platinum" },
      { id: "f13", name: "Ryan Nakamura", email: "ryan.n@email.com", lifetimeValue: 68.90, streams: 1320, merchPurchases: 3, showAttendance: 1, engagementScore: 72, lastActive: "2026-03-28", tier: "platinum" },
      { id: "f14", name: "Sophie Martin", email: "sophie.m@email.com", lifetimeValue: 62.50, streams: 1200, merchPurchases: 2, showAttendance: 2, engagementScore: 70, lastActive: "2026-03-21", tier: "platinum" },
      { id: "f15", name: "Marcus Johnson", email: "marcus.j@email.com", lifetimeValue: 55.80, streams: 1450, merchPurchases: 1, showAttendance: 2, engagementScore: 68, lastActive: "2026-03-25", tier: "platinum" },
      { id: "f16", name: "Hannah Davis", email: "hannah.d@email.com", lifetimeValue: 48.30, streams: 980, merchPurchases: 2, showAttendance: 1, engagementScore: 65, lastActive: "2026-03-20", tier: "gold" },
      { id: "f17", name: "Kevin O'Brien", email: "kevin.o@email.com", lifetimeValue: 44.60, streams: 1100, merchPurchases: 1, showAttendance: 1, engagementScore: 62, lastActive: "2026-03-27", tier: "gold" },
      { id: "f18", name: "Priya Sharma", email: "priya.s@email.com", lifetimeValue: 41.20, streams: 890, merchPurchases: 2, showAttendance: 0, engagementScore: 60, lastActive: "2026-03-19", tier: "gold" },
      { id: "f19", name: "Jake Morrison", email: "jake.m@email.com", lifetimeValue: 38.90, streams: 760, merchPurchases: 1, showAttendance: 1, engagementScore: 58, lastActive: "2026-03-24", tier: "gold" },
      { id: "f20", name: "Olivia Scott", email: "olivia.s@email.com", lifetimeValue: 35.40, streams: 680, merchPurchases: 1, showAttendance: 1, engagementScore: 55, lastActive: "2026-03-18", tier: "gold" },
    ],
    valueDrivers: [
      { source: "Streaming", percentage: 40, color: "#3b82f6" },
      { source: "Merch", percentage: 25, color: "#8b5cf6" },
      { source: "Shows", percentage: 20, color: "#f59e0b" },
      { source: "Tips & Funding", percentage: 15, color: "#10b981" },
    ],
    growthOpportunities: [
      {
        title: "Convert Silver fans to Gold",
        description: "Run a targeted merch campaign to your 1,150 Silver fans. Even a 5% conversion rate would move 57 fans up a tier.",
        estimatedImpact: "+$570/month",
        difficulty: "Easy",
        category: "Merch",
      },
      {
        title: "Re-engage inactive fans",
        description: "Send a personalized email to your 2,000 inactive fans with an exclusive track or behind-the-scenes content. Historically, 10-15% of inactive fans re-engage.",
        estimatedImpact: "+$800/month",
        difficulty: "Medium",
        category: "Email",
      },
      {
        title: "Launch a fan funding tier",
        description: "Your top 85 Platinum fans are highly engaged. Offering a $10/month supporter tier could generate significant recurring revenue.",
        estimatedImpact: "+$425/month",
        difficulty: "Easy",
        category: "Fan Funding",
      },
      {
        title: "Book more live shows",
        description: "Your show attendance drives 20% of fan value. Adding 2 more shows per month at your current ticket price could significantly boost value.",
        estimatedImpact: "+$1,200/month",
        difficulty: "Hard",
        category: "Live",
      },
      {
        title: "Create limited-edition merch drops",
        description: "Your Gold and Platinum fans have high merch purchase rates. Limited drops create urgency and can boost average order value by 40%.",
        estimatedImpact: "+$650/month",
        difficulty: "Medium",
        category: "Merch",
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}
