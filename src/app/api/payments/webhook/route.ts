import { NextRequest, NextResponse } from "next/server";
import { processWebhook } from "@/lib/services/manifest-payments";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/payments/webhook — Manifest Financials webhook handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-manifest-signature") || "";
  let payload: string;

  try {
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let event: { type: string; data: Record<string, unknown> };

  try {
    const result = await processWebhook(payload, signature);
    if (!result.verified) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }
    event = result.event as { type: string; data: Record<string, unknown> };
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 401 }
    );
  }

  try {
    switch (event.type) {
      // ── subscription.created ──────────────────────────────────
      case "subscription.created": {
        const { metadata, id, planId } = event.data as {
          metadata?: { userId?: string };
          id?: string;
          planId?: string;
        };
        const userId = metadata?.userId;

        if (userId && id) {
          const planMap: Record<string, "STARTER" | "PRO" | "BUSINESS"> = {
            starter: "STARTER",
            pro: "PRO",
            business: "BUSINESS",
          };

          await prisma.connectedAccount.upsert({
            where: {
              userId_platform: {
                userId,
                platform: "manifest_subscription",
              },
            },
            create: {
              userId,
              platform: "manifest_subscription",
              externalId: id,
            },
            update: {
              externalId: id,
            },
          });

          if (planId && planMap[planId]) {
            await prisma.user.update({
              where: { id: userId },
              data: { plan: planMap[planId] },
            });
          }
        }
        break;
      }

      // ── subscription.cancelled ────────────────────────────────
      case "subscription.cancelled": {
        const { metadata } = event.data as {
          metadata?: { userId?: string };
        };
        const userId = metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { plan: "STARTER" },
          });

          await prisma.connectedAccount.deleteMany({
            where: { userId, platform: "manifest_subscription" },
          });
        }
        break;
      }

      // ── payment.succeeded ─────────────────────────────────────
      case "payment.succeeded": {
        const {
          metadata,
          amount,
          id: txId,
          campaignId,
        } = event.data as {
          metadata?: { userId?: string };
          amount?: number;
          id?: string;
          campaignId?: string;
        };
        const userId = metadata?.userId;

        if (userId && amount) {
          await prisma.earning.create({
            data: {
              userId,
              platform: "manifest",
              amount: amount / 100, // cents to dollars
              currency: "USD",
              period: new Date().toISOString().slice(0, 7),
              manifestTxId: txId,
            },
          });
        }

        // Update campaign raised amount if applicable
        if (campaignId) {
          await prisma.fanCampaign.updateMany({
            where: { manifestCampaignId: campaignId },
            data: {
              raisedAmount: { increment: (amount || 0) / 100 },
              backerCount: { increment: 1 },
            },
          });
        }
        break;
      }

      // ── payout.completed ──────────────────────────────────────
      case "payout.completed": {
        const { metadata, id: payoutId } = event.data as {
          metadata?: { userId?: string; releaseId?: string };
          id?: string;
        };
        const userId = metadata?.userId;
        const releaseId = metadata?.releaseId;

        if (userId && releaseId && payoutId) {
          const split = await prisma.revenueSplit.findFirst({
            where: { userId, releaseId },
          });

          if (split) {
            const existingIds = (split.manifestPayoutIds as string[]) || [];
            await prisma.revenueSplit.update({
              where: { id: split.id },
              data: {
                manifestPayoutIds: [...existingIds, payoutId],
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
