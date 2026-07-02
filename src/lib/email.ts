import nodemailer from "nodemailer";
import { getInputMethodLabel, getVisitorTypeLabel } from "@/lib/admin-i18n";

export interface VisitNotificationPayload {
  visitId: string;
  to: string;
  staffName: string;
  visitorName: string;
  visitorCompany: string | null;
  visitorType: string;
  inputMethod: string;
  createdAt: Date;
  hasPhoto: boolean;
}

export function getAppBaseUrl(): string {
  return process.env.APP_BASE_URL?.trim() || "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS?.trim()
  );
}

export function getSmtpStatus() {
  return {
    smtpHostConfigured: !!process.env.SMTP_HOST?.trim(),
    smtpUserConfigured: !!process.env.SMTP_USER?.trim(),
    smtpFromConfigured: !!process.env.SMTP_FROM?.trim(),
    appBaseUrl: getAppBaseUrl(),
    smtpReady: isEmailConfigured(),
  };
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function deliverEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    return { sent: false, error: "SMTP not configured" };
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed";
    console.error("[YOBELL email]", message);
    return { sent: false, error: message };
  }
}

export async function sendTestEmail(
  to: string
): Promise<{ sent: boolean; fallback: boolean; error?: string }> {
  const subject = "【YOBELL】テストメール";
  const text = "YOBELLのメール通知設定テストです。";
  const html = `<p>${text}</p>`;

  if (!isEmailConfigured()) {
    console.log("[YOBELL email fallback] Test email:", { to, subject, body: text });
    return { sent: false, fallback: true, error: "SMTP not configured" };
  }

  const result = await deliverEmail({ to, subject, html, text });
  return { sent: result.sent, fallback: false, error: result.error };
}

function buildResponseUrl(visitId: string, status: string): string {
  const base = getAppBaseUrl().replace(/\/$/, "");
  return `${base}/api/visits/respond?id=${encodeURIComponent(visitId)}&status=${encodeURIComponent(status)}`;
}

function buildEmailHtml(
  payload: VisitNotificationPayload,
  links: { accepted: string; please_wait: string; declined: string }
): string {
  const createdAt = payload.createdAt.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const visitorType = getVisitorTypeLabel("ja", payload.visitorType);
  const inputMethod = getInputMethodLabel("ja", payload.inputMethod);
  const company = payload.visitorCompany ?? "—";

  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; color: #1a2b4b; line-height: 1.6; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="font-size: 20px; margin-bottom: 8px;">【YOBELL】来訪者の呼び出し</h1>
  <p style="margin-top: 0;">${payload.staffName} 様</p>
  <p>受付キオスクから来訪者の呼び出しがありました。</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr><td style="padding: 8px 0; color: #64748b;">来訪種別</td><td style="padding: 8px 0; font-weight: bold;">${visitorType}</td></tr>
    <tr><td style="padding: 8px 0; color: #64748b;">来訪者</td><td style="padding: 8px 0; font-weight: bold;">${payload.visitorName}</td></tr>
    <tr><td style="padding: 8px 0; color: #64748b;">会社</td><td style="padding: 8px 0;">${company}</td></tr>
    <tr><td style="padding: 8px 0; color: #64748b;">呼び出し方法</td><td style="padding: 8px 0;">${inputMethod}</td></tr>
    <tr><td style="padding: 8px 0; color: #64748b;">日時</td><td style="padding: 8px 0;">${createdAt}</td></tr>
    <tr><td style="padding: 8px 0; color: #64748b;">写真</td><td style="padding: 8px 0;">${payload.hasPhoto ? "あり" : "なし"}</td></tr>
  </table>
  <p style="font-weight: bold; margin-bottom: 12px;">対応を選択してください：</p>
  <p style="margin: 12px 0;">
    <a href="${links.accepted}" style="display: inline-block; background: #16a34a; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; margin: 4px 8px 4px 0;">今行きます</a>
    <a href="${links.please_wait}" style="display: inline-block; background: #d97706; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; margin: 4px 8px 4px 0;">少々お待ちください</a>
    <a href="${links.declined}" style="display: inline-block; background: #dc2626; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-weight: bold; margin: 4px 8px 4px 0;">本日は対応できません</a>
  </p>
  <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">YOBELL Entry — このメールに返信しないでください</p>
</body>
</html>`;
}

export async function sendVisitNotificationEmail(
  payload: VisitNotificationPayload
): Promise<{ sent: boolean; error?: string }> {
  const links = {
    accepted: buildResponseUrl(payload.visitId, "accepted"),
    please_wait: buildResponseUrl(payload.visitId, "please_wait"),
    declined: buildResponseUrl(payload.visitId, "declined"),
  };

  const subject = `【YOBELL】来訪者の呼び出し - ${payload.visitorName}`;
  const html = buildEmailHtml(payload, links);

  if (!isEmailConfigured()) {
    console.log("[YOBELL email fallback] Notification payload:", {
      to: payload.to,
      subject,
      staffName: payload.staffName,
      visitorName: payload.visitorName,
      visitorCompany: payload.visitorCompany,
      visitorType: getVisitorTypeLabel("ja", payload.visitorType),
      inputMethod: getInputMethodLabel("ja", payload.inputMethod),
      createdAt: payload.createdAt.toISOString(),
      hasPhoto: payload.hasPhoto,
      responseLinks: links,
    });
    return { sent: false, error: "SMTP not configured" };
  }

  return deliverEmail({ to: payload.to, subject, html });
}

export function buildRespondSuccessHtml(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>対応を送信しました</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; color: #1a2b4b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; }
    .card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,.08); padding: 40px 32px; max-width: 420px; text-align: center; }
    h1 { font-size: 24px; margin: 0 0 12px; }
    p { color: #64748b; margin: 0 0 28px; line-height: 1.6; }
    button { background: #1a2b4b; color: #fff; border: none; border-radius: 10px; padding: 14px 32px; font-size: 16px; font-weight: bold; cursor: pointer; }
    button:hover { background: #152238; }
  </style>
</head>
<body>
  <div class="card">
    <h1>対応を送信しました</h1>
    <p>受付画面に反映されます</p>
    <button type="button" onclick="window.close()">閉じる</button>
  </div>
</body>
</html>`;
}

export function buildRespondErrorHtml(message: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>エラー</title></head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
  <h1>エラー</h1>
  <p>${message}</p>
  <button type="button" onclick="window.close()">閉じる</button>
</body>
</html>`;
}
