import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockSetlists = [
  {
    id: "sl-1",
    name: "NYC Bowery Set",
    showId: "sh-1",
    songs: [
      { id: "sg-1", title: "Midnight Drive", duration: 245 },
      { id: "sg-2", title: "Golden Hour", duration: 198 },
      { id: "sg-3", title: "City Lights", duration: 212 },
      { id: "sg-4", title: "Slow Burn", duration: 267 },
      { id: "sg-5", title: "Electric Dreams", duration: 190 },
      { id: "sg-6", title: "Waves", duration: 224 },
      { id: "sg-7", title: "Neon Signs", duration: 180 },
      { id: "sg-8", title: "Better Days", duration: 235 },
    ],
    createdAt: "2026-03-20",
  },
  {
    id: "sl-2",
    name: "LA Troubadour Set",
    showId: "sh-2",
    songs: [
      { id: "sg-1", title: "Midnight Drive", duration: 245 },
      { id: "sg-3", title: "City Lights", duration: 212 },
      { id: "sg-5", title: "Electric Dreams", duration: 190 },
      { id: "sg-2", title: "Golden Hour", duration: 198 },
      { id: "sg-8", title: "Better Days", duration: 235 },
      { id: "sg-6", title: "Waves", duration: 224 },
    ],
    createdAt: "2026-03-22",
  },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ setlists: mockSetlists });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch setlists";
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
    const newSetlist = {
      id: `sl-${Date.now()}`,
      name: body.name,
      showId: body.showId || null,
      songs: body.songs || [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json({ setlist: newSetlist }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create setlist";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
