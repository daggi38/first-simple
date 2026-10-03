// Receives her choice. Shows up in your server logs (e.g. Vercel → Logs, search "date-choice").
// Set NOTIFY_URL to get a push on your phone, e.g. https://ntfy.sh/<your-secret-topic>

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { restaurantId, restaurantName, date } = body ?? {};

  if (![restaurantId, restaurantName, date].every((v) => typeof v === "string" && v)) {
    return Response.json({ error: "Missing restaurant or date" }, { status: 400 });
  }

  console.log("[date-choice]", { restaurantId, restaurantName, date, at: new Date().toISOString() });

  const notified = await notify(`She picked ${restaurantName} on ${date}`);
  return Response.json({ ok: true, notified });
}

// Awaited before responding, so the serverless function isn't frozen mid-request.
async function notify(message: string): Promise<boolean> {
  const url = process.env.NOTIFY_URL?.trim();
  if (!url) {
    console.warn("[date-choice] NOTIFY_URL is not set for this deployment; no push sent");
    return false;
  }

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
