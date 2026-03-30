import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { chatWithManager } from "@/lib/services/ai-service";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 20 requests per minute per user
  const rl = rateLimit(`ai-chat:${user.id}`, 20, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { messages, conversationId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty messages array" },
        { status: 400 }
      );
    }

    // Load user context from DB for a richer AI conversation
    const [latestAnalytics, releaseCount, subscriberCount, recentReleases] =
      await Promise.all([
        prisma.analyticsSnapshot.findFirst({
          where: { userId: user.id },
          orderBy: { date: "desc" },
        }),
        prisma.release.count({ where: { userId: user.id } }),
        prisma.subscriber.count({ where: { userId: user.id } }),
        prisma.release.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { title: true, type: true, status: true, releaseDate: true },
        }),
      ]);

    const userContext = {
      name: user.name,
      artistName: user.artistName,
      plan: user.plan,
      genre: user.genre,
      location: user.location,
      streams: latestAnalytics?.totalStreams ?? 0,
      monthlyListeners: latestAnalytics?.monthlyListeners ?? 0,
      followers: latestAnalytics?.followers ?? 0,
      releases: releaseCount,
      subscribers: subscriberCount,
      recentReleases,
    };

    // Call AI
    const aiResponse = await chatWithManager(messages, userContext as Record<string, unknown>);

    // Save conversation to DB
    const allMessages = [
      ...messages,
      { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() },
    ];

    let conversation;
    if (conversationId) {
      // Update existing conversation
      conversation = await prisma.aIConversation.update({
        where: { id: conversationId },
        data: { messages: allMessages },
      });
    } else {
      // Create new conversation
      conversation = await prisma.aIConversation.create({
        data: {
          userId: user.id,
          messages: allMessages,
        },
      });
    }

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/chat] Error:", message);
    return NextResponse.json(
      { error: "Chat failed", detail: message },
      { status: 500 }
    );
  }
}
