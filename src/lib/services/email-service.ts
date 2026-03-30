import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const IS_MOCK = !RESEND_API_KEY || RESEND_API_KEY.includes("your-key-here");
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@truefansmanager.com";

const resend = IS_MOCK ? null : new Resend(RESEND_API_KEY);

// ---------------------------------------------------------------------------
// Shared HTML template wrapper
// ---------------------------------------------------------------------------

function wrapHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#10b981;padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">TrueFans MANAGER</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} TrueFans MANAGER. All rights reserved.<br/>
                <a href="https://truefansmanager.com" style="color:#10b981;text-decoration:none;">truefansmanager.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background:#10b981;border-radius:8px;padding:12px 28px;">
      <a href="${url}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:inline-block;">${text}</a>
    </td>
  </tr>
</table>`;
}

// ---------------------------------------------------------------------------
// Send helper
// ---------------------------------------------------------------------------

async function send(params: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (IS_MOCK || !resend) {
    console.log(`[email-service] (mock) Would send "${params.subject}" to ${Array.isArray(params.to) ? params.to.join(", ") : params.to}`);
    return { id: "mock", success: true };
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { id: result.data?.id, success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[email-service] Send error:", message);
    throw new Error(`Email send failed: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// sendWelcomeEmail
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(to: string, name: string) {
  const html = wrapHtml(
    "Welcome to TrueFans MANAGER",
    `<h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Welcome aboard, ${name}!</h2>
<p style="color:#4b5563;font-size:15px;line-height:1.6;">
  You just took a huge step in your music career. TrueFans MANAGER gives you the tools major-label artists use — AI-powered release planning, smart analytics, fan CRM, and more — all built for independent artists like you.
</p>
<p style="color:#4b5563;font-size:15px;line-height:1.6;">Here is how to get started:</p>
<ol style="color:#4b5563;font-size:15px;line-height:1.8;">
  <li>Complete your artist profile</li>
  <li>Connect your streaming accounts</li>
  <li>Upload your first release or explore the AI tools</li>
</ol>
${ctaButton("Get Started", "https://truefansmanager.com/dashboard")}
<p style="color:#6b7280;font-size:14px;">If you have any questions, just reply to this email. We are here to help.</p>`
  );

  return send({ to, subject: "Welcome to TrueFans MANAGER 🎵", html });
}

// ---------------------------------------------------------------------------
// sendWeeklyReport
// ---------------------------------------------------------------------------

export async function sendWeeklyReport(
  to: string,
  name: string,
  reportHtml: string
) {
  const html = wrapHtml(
    "Your Weekly Report",
    `<h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Hey ${name}, here is your weekly update</h2>
<div style="color:#4b5563;font-size:15px;line-height:1.6;">
  ${reportHtml}
</div>
${ctaButton("View Full Dashboard", "https://truefansmanager.com/dashboard")}
<p style="color:#6b7280;font-size:13px;">This report was generated by your AI Manager. You can adjust report preferences in Settings.</p>`
  );

  return send({ to, subject: `Your Weekly Report — TrueFans MANAGER`, html });
}

// ---------------------------------------------------------------------------
// sendFanEmail
// ---------------------------------------------------------------------------

export async function sendFanEmail(
  to: string[],
  subject: string,
  body: string,
  fromArtist: string
) {
  const html = wrapHtml(
    subject,
    `<p style="color:#6b7280;font-size:13px;margin:0 0 8px;">From <strong>${fromArtist}</strong> via TrueFans MANAGER</p>
<div style="color:#4b5563;font-size:15px;line-height:1.7;">
  ${body}
</div>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
<p style="color:#9ca3af;font-size:12px;">You are receiving this because you subscribed to ${fromArtist}'s mailing list on TrueFans MANAGER. <a href="https://truefansmanager.com/unsubscribe" style="color:#10b981;">Unsubscribe</a></p>`
  );

  return send({ to, subject, html });
}

// ---------------------------------------------------------------------------
// sendPasswordReset
// ---------------------------------------------------------------------------

export async function sendPasswordReset(to: string, resetUrl: string) {
  const html = wrapHtml(
    "Reset Your Password",
    `<h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Password Reset Request</h2>
<p style="color:#4b5563;font-size:15px;line-height:1.6;">
  We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
</p>
${ctaButton("Reset Password", resetUrl)}
<p style="color:#6b7280;font-size:13px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>`
  );

  return send({ to, subject: "Reset your TrueFans MANAGER password", html });
}

// ---------------------------------------------------------------------------
// sendNotification
// ---------------------------------------------------------------------------

export async function sendNotification(
  to: string,
  title: string,
  message: string
) {
  const html = wrapHtml(
    title,
    `<h2 style="margin:0 0 16px;color:#111827;font-size:20px;">${title}</h2>
<p style="color:#4b5563;font-size:15px;line-height:1.6;">
  ${message}
</p>
${ctaButton("Open Dashboard", "https://truefansmanager.com/dashboard")}`
  );

  return send({ to, subject: `${title} — TrueFans MANAGER`, html });
}
