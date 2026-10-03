// Receives her choice. Shows up in your server logs (e.g. Vercel → Logs, search "date-choice").
//
// Notifications (set either or both as environment variables):
//   Telegram: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (see README)
//   ntfy:     NOTIFY_URL, e.g. https://ntfy.sh/<your-secret-topic>

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { restaurantId, restaurantName, date } = body ?? {};

  if (![restaurantId, restaurantName, date].every((v) => typeof v === "string" && v)) {
    return Response.json({ error: "Missing restaurant or date" }, { status: 400 });
  }

  console.log("[date-choice]", { restaurantId, restaurantName, date, at: new Date().toISOString() });

  const message = `Episode 01 approved: ${restaurantName} on ${date}`;
  // Awaited before responding, so the serverless function isn't frozen mid-request.
  const results = await Promise.all([sendTelegram(message), sendNtfy(message)]);
  const notified = results.some((r) => r === true);
  if (results.every((r) => r === null)) {
    console.warn("[date-choice] No notification channel is configured for this deployment");
  }

  return Response.json({ ok: true, notified });
}

// Each sender returns true (sent), false (failed) or null (not configured).

async function sendTelegram(text: string): Promise<boolean | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => null);
    console.log("[date-choice] telegram responded", res.status, data?.ok ? "" : (data?.description ?? ""));
    return res.ok && data?.ok === true;
  } catch (err) {
    console.error("[date-choice] telegram request failed", err);
    return false;
  }
}

async function sendNtfy(message: string): Promise<boolean | null> {
  const url = process.env.NOTIFY_URL?.trim();
  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: message,
      headers: { Title: "Episode 01" },
      signal: AbortSignal.timeout(8000),
    });
    const detail = res.ok ? "" : await res.text().catch(() => "");
    console.log("[date-choice] ntfy responded", res.status, detail.slice(0, 200));
    return res.ok;
  } catch (err) {
    console.error("[date-choice] ntfy request failed", err);
    return false;
  }
}
