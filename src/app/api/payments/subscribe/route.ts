import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, updateUserPlan } from "@/lib/services/auth-service";
import {
  createSubscription,
  cancelSubscription,
} from "@/lib/services/manifest-payments";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/payments/subscribe — create or change subscription
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { planId } = body;

  if (!planId || !["starter", "pro", "business"].includes(planId)) {
    return NextResponse.json(
      { error: "Invalid planId. Must be starter, pro, or business." },
      { status: 400 }
    );
  }

  const planMap: Record<string, "STARTER" | "PRO" | "BUSINESS"> = {
    starter: "STARTER",
    pro: "PRO",
    business: "BUSINESS",
  };

  try {
    // Check if the user already has an active manifest subscription we need to cancel
    const existingAccount = await prisma.connectedAccount.findUnique({
      where: {
        userId_platform: {
          userId: user.id,
          platform: "manifest_subscription",
        },
      },
    });

    if (existingAccount?.externalId) {
      await cancelSubscription(existingAccount.externalId);
    }

    // Create the new subscription
    const subscription = await createSubscription({
      userId: user.id,
      email: user.email,
      planId,
    });

    // Store subscription reference
    await prisma.connectedAccount.upsert({
      where: {
        userId_platform: {
          userId: user.id,
          platform: "manifest_subscription",
        },
      },
      create: {
        userId: user.id,
        platform: "manifest_subscription",
        externalId: subscription.manifestSubscriptionId,
      },
      update: {
        externalId: subscription.manifestSubscriptionId,
      },
    });

    // Update the user's plan
    const updatedUser = await updateUserPlan(user.id, planMap[planId]);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.manifestSubscriptionId,
        planId,
        status: subscription.status,
      },
      user: updatedUser,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
