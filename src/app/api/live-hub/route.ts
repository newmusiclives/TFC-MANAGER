import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockShows = [
  { id: "sh-1", venue: "The Bowery Ballroom", city: "New York, NY", date: "2026-04-12", time: "8:00 PM", capacity: 575, ticketsSold: 412, ticketPrice: 25, revenue: 10300, status: "Confirmed" },
  { id: "sh-2", venue: "The Troubadour", city: "Los Angeles, CA", date: "2026-04-19", time: "9:00 PM", capacity: 400, ticketsSold: 385, ticketPrice: 30, revenue: 11550, status: "Sold Out" },
  { id: "sh-3", venue: "Schubas Tavern", city: "Chicago, IL", date: "2026-05-03", time: "7:30 PM", capacity: 165, ticketsSold: 89, ticketPrice: 20, revenue: 1780, status: "On Sale" },
  { id: "sh-4", venue: "The Fillmore", city: "San Francisco, CA", date: "2026-05-17", time: "8:00 PM", capacity: 1150, ticketsSold: 340, ticketPrice: 35, revenue: 11900, status: "On Sale" },
];

const mockCheckins = [
  { id: "ci-1", fanName: "Alex Morrison", email: "alex.m@email.com", checkedInAt: "2026-04-12T19:32:00", showId: "sh-1" },
  { id: "ci-2", fanName: "Marie Laurent", email: "marie.l@email.com", checkedInAt: "2026-04-12T19:45:00", showId: "sh-1" },
  { id: "ci-3", fanName: "James Kim", email: "jamesk@email.com", checkedInAt: "2026-04-12T19:58:00", showId: "sh-1" },
  { id: "ci-4", fanName: "Sarah Torres", email: "sarah.t@email.com", checkedInAt: "2026-04-12T20:05:00", showId: "sh-1" },
  { id: "ci-5", fanName: "Lukas Braun", email: "lukas.b@email.com", checkedInAt: "2026-04-12T20:12:00", showId: "sh-1" },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      shows: mockShows,
      checkins: mockCheckins,
      stats: {
        upcomingShows: mockShows.length,
        totalTicketsSold: mockShows.reduce((s, sh) => s + sh.ticketsSold, 0),
        totalRevenue: mockShows.reduce((s, sh) => s + sh.revenue, 0),
        avgCapacityFill: Math.round(mockShows.reduce((s, sh) => s + (sh.ticketsSold / sh.capacity) * 100, 0) / mockShows.length),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch live hub data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
