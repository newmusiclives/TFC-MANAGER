import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockCities = [
  { city: "Los Angeles", country: "US", lat: 34, lng: -118, listeners: 2840, superfans: 42, growth: "+18%", intensity: 95 },
  { city: "Paris", country: "FR", lat: 48.8, lng: 2.3, listeners: 1920, superfans: 28, growth: "+24%", intensity: 80 },
  { city: "London", country: "UK", lat: 51.5, lng: -0.1, listeners: 1640, superfans: 22, growth: "+12%", intensity: 72 },
  { city: "New York", country: "US", lat: 40.7, lng: -74, listeners: 1380, superfans: 19, growth: "+15%", intensity: 65 },
  { city: "Berlin", country: "DE", lat: 52.5, lng: 13.4, listeners: 980, superfans: 14, growth: "+31%", intensity: 52 },
  { city: "Toronto", country: "CA", lat: 43.7, lng: -79.4, listeners: 820, superfans: 11, growth: "+9%", intensity: 44 },
  { city: "Sydney", country: "AU", lat: -33.9, lng: 151.2, listeners: 640, superfans: 8, growth: "+22%", intensity: 36 },
  { city: "S\u00e3o Paulo", country: "BR", lat: -23.5, lng: -46.6, listeners: 580, superfans: 7, growth: "+45%", intensity: 32 },
  { city: "Tokyo", country: "JP", lat: 35.7, lng: 139.7, listeners: 420, superfans: 5, growth: "+38%", intensity: 24 },
  { city: "Mexico City", country: "MX", lat: 19.4, lng: -99.1, listeners: 380, superfans: 4, growth: "+52%", intensity: 20 },
];

const mockSuperfans = [
  { name: "Alex M.", city: "Los Angeles", score: 98, saves: 47, shares: 23, streams: 312, lastActive: "2 hours ago" },
  { name: "Marie L.", city: "Paris", score: 96, saves: 41, shares: 19, streams: 289, lastActive: "4 hours ago" },
  { name: "James K.", city: "London", score: 94, saves: 38, shares: 31, streams: 267, lastActive: "1 hour ago" },
  { name: "Sarah T.", city: "New York", score: 91, saves: 35, shares: 15, streams: 245, lastActive: "6 hours ago" },
  { name: "Lukas B.", city: "Berlin", score: 89, saves: 33, shares: 28, streams: 221, lastActive: "3 hours ago" },
  { name: "Emma R.", city: "Toronto", score: 87, saves: 29, shares: 12, streams: 198, lastActive: "8 hours ago" },
  { name: "Yuki S.", city: "Tokyo", score: 85, saves: 27, shares: 17, streams: 186, lastActive: "5 hours ago" },
  { name: "Pedro C.", city: "S\u00e3o Paulo", score: 82, saves: 24, shares: 22, streams: 174, lastActive: "12 hours ago" },
];

const mockStats = {
  citiesReached: 48,
  countries: 23,
  superfansCount: 160,
  avgEngagement: "24.3%",
};

// ---------------------------------------------------------------------------
// GET /api/fan-heatmap — Return geographic listener data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with real analytics when available)
    return NextResponse.json({
      cities: mockCities,
      superfans: mockSuperfans,
      stats: mockStats,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch heatmap data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
