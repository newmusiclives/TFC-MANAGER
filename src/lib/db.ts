// In-memory database (replace with real DB in production)

export type User = {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "pro" | "business";
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  lastActive: string;
  streams: number;
  releases: number;
};

export type Artist = {
  id: string;
  name: string;
  genre: string;
  location: string;
  userId: string;
  totalStreams: number;
  monthlyListeners: number;
  followers: number;
  releases: number;
  status: "verified" | "pending" | "flagged";
  joinedAt: string;
  plan: "starter" | "pro" | "business";
};

export type PlatformStats = {
  totalUsers: number;
  activeUsers: number;
  totalArtists: number;
  totalStreams: number;
  totalReleases: number;
  revenue: number;
  newUsersThisMonth: number;
  churnRate: number;
};

// Mock users
export const users: User[] = [
  {
    id: "u1",
    name: "Jordan Davis",
    email: "jordan@example.com",
    plan: "pro",
    status: "active",
    joinedAt: "2025-01-12",
    lastActive: "2026-03-28",
    streams: 128500,
    releases: 12,
  },
  {
    id: "u2",
    name: "Yaya Minté",
    email: "yaya@example.com",
    plan: "business",
    status: "active",
    joinedAt: "2025-02-05",
    lastActive: "2026-03-27",
    streams: 245300,
    releases: 8,
  },
  {
    id: "u3",
    name: "Pablo Lucas",
    email: "pablo@example.com",
    plan: "pro",
    status: "active",
    joinedAt: "2025-03-18",
    lastActive: "2026-03-26",
    streams: 89200,
    releases: 5,
  },
  {
    id: "u4",
    name: "Janis Carmelo",
    email: "janis@example.com",
    plan: "starter",
    status: "active",
    joinedAt: "2025-04-22",
    lastActive: "2026-03-25",
    streams: 34100,
    releases: 3,
  },
  {
    id: "u5",
    name: "Luna Park",
    email: "luna@example.com",
    plan: "pro",
    status: "inactive",
    joinedAt: "2025-05-10",
    lastActive: "2026-02-15",
    streams: 67800,
    releases: 7,
  },
  {
    id: "u6",
    name: "Marcus Chen",
    email: "marcus@example.com",
    plan: "business",
    status: "active",
    joinedAt: "2025-06-01",
    lastActive: "2026-03-28",
    streams: 312000,
    releases: 15,
  },
  {
    id: "u7",
    name: "Aisha Nkosi",
    email: "aisha@example.com",
    plan: "starter",
    status: "suspended",
    joinedAt: "2025-07-14",
    lastActive: "2026-01-20",
    streams: 12400,
    releases: 2,
  },
  {
    id: "u8",
    name: "Remy Dubois",
    email: "remy@example.com",
    plan: "pro",
    status: "active",
    joinedAt: "2025-08-20",
    lastActive: "2026-03-27",
    streams: 156700,
    releases: 9,
  },
  {
    id: "u9",
    name: "Sofia Reyes",
    email: "sofia@example.com",
    plan: "business",
    status: "active",
    joinedAt: "2025-09-03",
    lastActive: "2026-03-28",
    streams: 421000,
    releases: 18,
  },
  {
    id: "u10",
    name: "Kai Tanaka",
    email: "kai@example.com",
    plan: "starter",
    status: "active",
    joinedAt: "2025-10-11",
    lastActive: "2026-03-24",
    streams: 8900,
    releases: 1,
  },
  {
    id: "u11",
    name: "Elena Volkov",
    email: "elena@example.com",
    plan: "pro",
    status: "active",
    joinedAt: "2025-11-25",
    lastActive: "2026-03-28",
    streams: 78300,
    releases: 6,
  },
  {
    id: "u12",
    name: "Dex Williams",
    email: "dex@example.com",
    plan: "starter",
    status: "inactive",
    joinedAt: "2025-12-08",
    lastActive: "2026-02-28",
    streams: 5200,
    releases: 1,
  },
];

// Mock artists
export const artists: Artist[] = [
  {
    id: "a1",
    name: "Jordan Davis",
    genre: "Pop / Electronic",
    location: "Los Angeles, CA",
    userId: "u1",
    totalStreams: 128500,
    monthlyListeners: 18200,
    followers: 4800,
    releases: 12,
    status: "verified",
    joinedAt: "2025-01-12",
    plan: "pro",
  },
  {
    id: "a2",
    name: "Yaya Minté",
    genre: "Soul / Pop",
    location: "Paris, France",
    userId: "u2",
    totalStreams: 245300,
    monthlyListeners: 32100,
    followers: 12400,
    releases: 8,
    status: "verified",
    joinedAt: "2025-02-05",
    plan: "business",
  },
  {
    id: "a3",
    name: "Pablo Lucas",
    genre: "Pop / Rock",
    location: "Barcelona, Spain",
    userId: "u3",
    totalStreams: 89200,
    monthlyListeners: 11500,
    followers: 3200,
    releases: 5,
    status: "verified",
    joinedAt: "2025-03-18",
    plan: "pro",
  },
  {
    id: "a4",
    name: "Janis Carmelo",
    genre: "R&B / Pop",
    location: "London, UK",
    userId: "u4",
    totalStreams: 34100,
    monthlyListeners: 5800,
    followers: 1500,
    releases: 3,
    status: "pending",
    joinedAt: "2025-04-22",
    plan: "starter",
  },
  {
    id: "a5",
    name: "Luna Park",
    genre: "Indie / Dream Pop",
    location: "Seoul, South Korea",
    userId: "u5",
    totalStreams: 67800,
    monthlyListeners: 9200,
    followers: 5600,
    releases: 7,
    status: "verified",
    joinedAt: "2025-05-10",
    plan: "pro",
  },
  {
    id: "a6",
    name: "Marcus Chen",
    genre: "Hip Hop / R&B",
    location: "Toronto, Canada",
    userId: "u6",
    totalStreams: 312000,
    monthlyListeners: 45600,
    followers: 21300,
    releases: 15,
    status: "verified",
    joinedAt: "2025-06-01",
    plan: "business",
  },
  {
    id: "a7",
    name: "Aisha Nkosi",
    genre: "Afrobeats / Pop",
    location: "Lagos, Nigeria",
    userId: "u7",
    totalStreams: 12400,
    monthlyListeners: 2100,
    followers: 800,
    releases: 2,
    status: "flagged",
    joinedAt: "2025-07-14",
    plan: "starter",
  },
  {
    id: "a8",
    name: "Sofia Reyes",
    genre: "Latin Pop / Reggaeton",
    location: "Mexico City, Mexico",
    userId: "u9",
    totalStreams: 421000,
    monthlyListeners: 58900,
    followers: 34200,
    releases: 18,
    status: "verified",
    joinedAt: "2025-09-03",
    plan: "business",
  },
];

// Platform stats
export const platformStats: PlatformStats = {
  totalUsers: 1248,
  activeUsers: 934,
  totalArtists: 876,
  totalStreams: 4_520_000,
  totalReleases: 3420,
  revenue: 28450,
  newUsersThisMonth: 87,
  churnRate: 3.2,
};

// Revenue over time
export const revenueData = [
  { month: "Apr 25", revenue: 8200, users: 320 },
  { month: "May 25", revenue: 10400, users: 410 },
  { month: "Jun 25", revenue: 12100, users: 498 },
  { month: "Jul 25", revenue: 14800, users: 580 },
  { month: "Aug 25", revenue: 16200, users: 650 },
  { month: "Sep 25", revenue: 18900, users: 745 },
  { month: "Oct 25", revenue: 20100, users: 830 },
  { month: "Nov 25", revenue: 22400, users: 920 },
  { month: "Dec 25", revenue: 24800, users: 1020 },
  { month: "Jan 26", revenue: 25600, users: 1090 },
  { month: "Feb 26", revenue: 27100, users: 1170 },
  { month: "Mar 26", revenue: 28450, users: 1248 },
];

// Plan distribution
export const planDistribution = [
  { plan: "Starter", count: 485, percentage: 38.9 },
  { plan: "Pro", count: 524, percentage: 42.0 },
  { plan: "Business", count: 239, percentage: 19.1 },
];

// Recent activity
export const recentActivity = [
  { id: 1, action: "New user signed up", user: "Kai Tanaka", time: "2 min ago", type: "signup" },
  { id: 2, action: "Upgraded to Pro plan", user: "Elena Volkov", time: "15 min ago", type: "upgrade" },
  { id: 3, action: "Published new release", user: "Marcus Chen", time: "1 hour ago", type: "release" },
  { id: 4, action: "Generated release plan", user: "Sofia Reyes", time: "2 hours ago", type: "action" },
  { id: 5, action: "Account flagged", user: "Aisha Nkosi", time: "3 hours ago", type: "flag" },
  { id: 6, action: "New user signed up", user: "Dex Williams", time: "5 hours ago", type: "signup" },
  { id: 7, action: "Upgraded to Business", user: "Yaya Minté", time: "8 hours ago", type: "upgrade" },
  { id: 8, action: "Published new release", user: "Jordan Davis", time: "12 hours ago", type: "release" },
];
