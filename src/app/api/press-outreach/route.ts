import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockOutreach = [
  { id: "po-1", journalistName: "Emma Sweeney", outlet: "Pitchfork", subject: "New EP Announcement", status: "Published", sentAt: "2026-02-15", articleUrl: "https://pitchfork.com/reviews/artist-new-ep", openedAt: "2026-02-15", repliedAt: "2026-02-17" },
  { id: "po-2", journalistName: "Marcus Hall", outlet: "NME", subject: "Tour Announcement — Spring 2026", status: "Replied", sentAt: "2026-03-01", articleUrl: null, openedAt: "2026-03-01", repliedAt: "2026-03-03" },
  { id: "po-3", journalistName: "Kira Yamamoto", outlet: "The FADER", subject: "Exclusive Interview Request", status: "Opened", sentAt: "2026-03-10", articleUrl: null, openedAt: "2026-03-11", repliedAt: null },
  { id: "po-4", journalistName: "Tom Breihan", outlet: "Stereogum", subject: "Single Premiere — 'Midnight Drive'", status: "Sent", sentAt: "2026-03-20", articleUrl: null, openedAt: null, repliedAt: null },
  { id: "po-5", journalistName: "Sarah Chen", outlet: "DIY Magazine", subject: "Festival Preview Feature", status: "Draft", sentAt: null, articleUrl: null, openedAt: null, repliedAt: null },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      outreach: mockOutreach,
      stats: {
        totalPitches: mockOutreach.length,
        published: mockOutreach.filter((o) => o.status === "Published").length,
        replied: mockOutreach.filter((o) => o.status === "Replied").length,
        openRate: Math.round((mockOutreach.filter((o) => o.openedAt).length / mockOutreach.filter((o) => o.sentAt).length) * 100),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch outreach";
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
    const newPitch = {
      id: `po-${Date.now()}`,
      journalistName: body.journalistName,
      outlet: body.outlet,
      subject: body.subject,
      status: body.send ? "Sent" : "Draft",
      sentAt: body.send ? new Date().toISOString().split("T")[0] : null,
      articleUrl: null,
      openedAt: null,
      repliedAt: null,
    };

    return NextResponse.json({ pitch: newPitch }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create pitch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
