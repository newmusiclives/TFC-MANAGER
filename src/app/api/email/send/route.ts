import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  sendWelcomeEmail,
  sendWeeklyReport,
  sendFanEmail,
  sendPasswordReset,
  sendNotification,
} from "@/lib/services/email-service";

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, to, subject, body: emailBody } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "welcome": {
        const recipient = to || user.email;
        const name = body.name || user.name;
        result = await sendWelcomeEmail(recipient, name);
        break;
      }

      case "weekly-report": {
        if (!emailBody) {
          return NextResponse.json(
            { error: "weekly-report requires body (reportHtml)" },
            { status: 400 }
          );
        }
        const recipient = to || user.email;
        const name = body.name || user.name;
        result = await sendWeeklyReport(recipient, name, emailBody);
        break;
      }

      case "fan-email": {
        if (!to || !subject || !emailBody) {
          return NextResponse.json(
            { error: "fan-email requires to (array), subject, and body" },
            { status: 400 }
          );
        }
        const recipients = Array.isArray(to) ? to : [to];
        const fromArtist = body.fromArtist || user.artistName || user.name;
        result = await sendFanEmail(recipients, subject, emailBody, fromArtist);
        break;
      }

      case "password-reset": {
        if (!to || !body.resetUrl) {
          return NextResponse.json(
            { error: "password-reset requires to and resetUrl" },
            { status: 400 }
          );
        }
        result = await sendPasswordReset(to, body.resetUrl);
        break;
      }

      case "notification": {
        const recipient = to || user.email;
        if (!body.title || !body.message) {
          return NextResponse.json(
            { error: "notification requires title and message" },
            { status: 400 }
          );
        }
        result = await sendNotification(recipient, body.title, body.message);
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/email/send] Error:", message);
    return NextResponse.json(
      { error: "Email send failed", detail: message },
      { status: 500 }
    );
  }
}
