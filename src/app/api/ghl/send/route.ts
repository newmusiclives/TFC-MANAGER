import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  sendSMS,
  sendEmail,
  sendWhatsApp,
  initiateVoiceCall,
} from "@/lib/services/gohighlevel-service";

// ---------------------------------------------------------------------------
// POST /api/ghl/send — Send communication via GoHighLevel
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, contactId, message, subject, htmlBody } = body as {
      type: "sms" | "email" | "whatsapp" | "voice";
      contactId: string;
      message?: string;
      subject?: string;
      htmlBody?: string;
    };

    if (!type || !contactId) {
      return NextResponse.json(
        { error: "Missing required fields: type, contactId" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "sms": {
        if (!message) {
          return NextResponse.json(
            { error: "SMS requires a message" },
            { status: 400 }
          );
        }
        result = await sendSMS({ contactId, message });
        break;
      }

      case "email": {
        if (!subject || !htmlBody) {
          return NextResponse.json(
            { error: "Email requires subject and htmlBody" },
            { status: 400 }
          );
        }
        result = await sendEmail({ contactId, subject, htmlBody });
        break;
      }

      case "whatsapp": {
        if (!message) {
          return NextResponse.json(
            { error: "WhatsApp requires a message" },
            { status: 400 }
          );
        }
        result = await sendWhatsApp({ contactId, message });
        break;
      }

      case "voice": {
        result = await initiateVoiceCall({ contactId });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unsupported communication type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      contactId,
      result,
    });
  } catch (error) {
    console.error("[GHL Send] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send communication";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
