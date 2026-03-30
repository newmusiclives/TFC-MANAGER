import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Mock data — Team members
// ---------------------------------------------------------------------------

const mockTeamMembers = [
  {
    id: "tm-1",
    name: "Sarah Mitchell",
    email: "sarah@truefans.io",
    role: "Manager",
    status: "Accepted",
    avatar: null,
    joinedAt: "2025-11-15T10:00:00Z",
  },
  {
    id: "tm-2",
    name: "Alex Rivera",
    email: "alex@truefans.io",
    role: "Label Rep",
    status: "Accepted",
    avatar: null,
    joinedAt: "2025-12-01T14:30:00Z",
  },
  {
    id: "tm-3",
    name: "Jordan Lee",
    email: "jordan@example.com",
    role: "Producer",
    status: "Accepted",
    avatar: null,
    joinedAt: "2026-01-10T09:00:00Z",
  },
  {
    id: "tm-4",
    name: "Casey Brooks",
    email: "casey@example.com",
    role: "Social Media",
    status: "Pending",
    avatar: null,
    joinedAt: "2026-03-20T16:45:00Z",
  },
  {
    id: "tm-5",
    name: "Morgan Chen",
    email: "morgan@accounting.co",
    role: "Accountant",
    status: "Accepted",
    avatar: null,
    joinedAt: "2026-02-05T11:15:00Z",
  },
  {
    id: "tm-6",
    name: "Taylor Kim",
    email: "taylor@example.com",
    role: "Viewer",
    status: "Pending",
    avatar: null,
    joinedAt: "2026-03-25T08:00:00Z",
  },
];

const mockActivityLog = [
  { id: "a-1", user: "Sarah Mitchell", action: "updated Release Plan for 'Midnight Drive'", timestamp: "2026-03-29T09:15:00Z" },
  { id: "a-2", user: "Alex Rivera", action: "viewed Earnings dashboard", timestamp: "2026-03-29T08:42:00Z" },
  { id: "a-3", user: "Jordan Lee", action: "uploaded new master for 'Solar Flare'", timestamp: "2026-03-28T22:10:00Z" },
  { id: "a-4", user: "Sarah Mitchell", action: "pitched 'Midnight Drive' to 5 playlists", timestamp: "2026-03-28T18:30:00Z" },
  { id: "a-5", user: "Casey Brooks", action: "scheduled 3 social media posts", timestamp: "2026-03-28T15:00:00Z" },
  { id: "a-6", user: "Morgan Chen", action: "exported Q1 earnings report", timestamp: "2026-03-28T12:45:00Z" },
  { id: "a-7", user: "Alex Rivera", action: "approved distribution to Apple Music", timestamp: "2026-03-27T20:15:00Z" },
  { id: "a-8", user: "Sarah Mitchell", action: "created new release plan for 'Neon Lights EP'", timestamp: "2026-03-27T16:30:00Z" },
  { id: "a-9", user: "Jordan Lee", action: "added stems to 'Solar Flare' collab room", timestamp: "2026-03-27T11:00:00Z" },
  { id: "a-10", user: "Morgan Chen", action: "reconciled royalty payments for February", timestamp: "2026-03-26T14:20:00Z" },
];

// ---------------------------------------------------------------------------
// GET /api/team — List team members and activity
// ---------------------------------------------------------------------------

export async function GET() {
  return NextResponse.json({
    members: mockTeamMembers,
    activity: mockActivityLog,
  });
}

// ---------------------------------------------------------------------------
// POST /api/team — Invite a new team member
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    const newMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      status: "Pending",
      avatar: null,
      joinedAt: new Date().toISOString(),
    };

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to invite team member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
