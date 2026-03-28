import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  generateContent,
  generateReleasePlan,
  analyzeContract,
  generateWeeklyReport,
  generateStoryboard,
  analyzeSoundProfile,
} from "@/lib/services/ai-service";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, context } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    let result: unknown;

    switch (type) {
      case "social-post":
      case "caption":
      case "hashtags":
      case "email":
      case "press-release":
      case "story-ideas":
        result = await generateContent(type, context || {});
        break;

      case "release-plan":
        if (!context?.title || !context?.releaseDate) {
          return NextResponse.json(
            { error: "release-plan requires title and releaseDate in context" },
            { status: 400 }
          );
        }
        result = await generateReleasePlan({
          title: context.title,
          releaseDate: context.releaseDate,
          type: context.releaseType || "single",
          genre: context.genre,
          context: context.additionalContext,
        });
        break;

      case "contract-analysis":
        if (!context?.text) {
          return NextResponse.json(
            { error: "contract-analysis requires text in context" },
            { status: 400 }
          );
        }
        result = await analyzeContract(context.text);
        break;

      case "weekly-report":
        result = await generateWeeklyReport({
          name: user.name,
          ...context,
        });
        break;

      case "storyboard":
        if (!context?.track) {
          return NextResponse.json(
            { error: "storyboard requires track in context" },
            { status: 400 }
          );
        }
        result = await generateStoryboard({
          track: context.track,
          style: context.style,
          mood: context.mood,
        });
        break;

      case "sound-profile":
        if (!context) {
          return NextResponse.json(
            { error: "sound-profile requires metadata in context" },
            { status: 400 }
          );
        }
        result = await analyzeSoundProfile(context);
        break;

      default:
        // Fallback: try generateContent with custom type
        result = await generateContent(type, context || {});
    }

    return NextResponse.json({ type, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/generate] Error:", message);
    return NextResponse.json(
      { error: "AI generation failed", detail: message },
      { status: 500 }
    );
  }
}
