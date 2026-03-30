import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { scheduler } from "@/lib/services/job-scheduler";

// ---------------------------------------------------------------------------
// GET /api/admin/jobs — Return scheduler status
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = scheduler.getStatus();
    return NextResponse.json({ jobs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch job status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/jobs — Start or stop a job
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, action } = body as { jobId: string; action: "start" | "stop" };

    if (!jobId || !action) {
      return NextResponse.json(
        { error: "jobId and action are required" },
        { status: 400 }
      );
    }

    if (action !== "start" && action !== "stop") {
      return NextResponse.json(
        { error: "action must be 'start' or 'stop'" },
        { status: 400 }
      );
    }

    if (action === "start") {
      scheduler.start(jobId);
    } else {
      scheduler.stop(jobId);
    }

    const jobs = scheduler.getStatus();
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
