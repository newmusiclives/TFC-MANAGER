import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  generateAIOptimizedBio,
  generateMetaTags,
  generateFAQSchema,
} from "@/lib/services/seo-aieo-service";

// ---------------------------------------------------------------------------
// POST /api/seo-aieo/optimize — Generate optimized content
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter. Use: bio, meta-tags, faq-schema" },
        { status: 400 }
      );
    }

    switch (type) {
      case "bio": {
        const bio = await generateAIOptimizedBio({
          name: user.artistName || user.name,
          genre: body.genre || "Pop",
          achievements: body.achievements,
          releases: body.releases,
        });
        return NextResponse.json({ bio });
      }
      case "meta-tags": {
        const tags = generateMetaTags(body.pageType || "artist", {
          artistName: user.artistName || user.name,
          trackName: body.trackName,
          description: body.description,
          imageUrl: body.imageUrl,
          url: body.url,
        });
        return NextResponse.json({ tags });
      }
      case "faq-schema": {
        const faqs = body.faqs || [
          { question: `Who is ${user.artistName || user.name}?`, answer: `${user.artistName || user.name} is an independent music artist.` },
        ];
        const schema = generateFAQSchema(faqs);
        return NextResponse.json({ schema });
      }
      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}. Use: bio, meta-tags, faq-schema` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/optimize] POST error:", message);
    return NextResponse.json(
      { error: "Failed to generate optimized content", detail: message },
      { status: 500 }
    );
  }
}
