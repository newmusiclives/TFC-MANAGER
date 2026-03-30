import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockBookings = [
  { id: "bk-1", collaboratorName: "Jordan Hayes", role: "Producer", project: "New EP — Track 3 Production", status: "In Progress", startDate: "2026-03-15", endDate: "2026-04-15", rate: 150, totalCost: 600, asClient: true },
  { id: "bk-2", collaboratorName: "Mia Chen", role: "Vocalist", project: "Feature Vocals — 'Midnight Drive' Remix", status: "Completed", startDate: "2026-02-10", endDate: "2026-02-28", rate: 100, totalCost: 300, asClient: true },
  { id: "bk-3", collaboratorName: "Rico Fernandez", role: "Videographer", project: "Music Video — 'Golden Hour'", status: "Pending", startDate: "2026-04-05", endDate: "2026-04-20", rate: 250, totalCost: 1500, asClient: true },
  { id: "bk-4", collaboratorName: "Alex Morrison", role: "Client", project: "Session Guitar for Album", status: "In Progress", startDate: "2026-03-20", endDate: "2026-04-10", rate: 80, totalCost: 320, asClient: false },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ bookings: mockBookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newBooking = {
      id: `bk-${Date.now()}`,
      collaboratorName: body.collaboratorName,
      role: body.role,
      project: body.project,
      status: "Pending",
      startDate: body.startDate,
      endDate: body.endDate,
      rate: body.rate || 0,
      totalCost: body.totalCost || 0,
      asClient: true,
    };

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
