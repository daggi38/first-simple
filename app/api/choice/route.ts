// Receives her choice. Shows up in your server logs (e.g. Vercel → Logs).
// Optional: set NOTIFY_URL to get a push on your phone, e.g. https://ntfy.sh/<your-secret-topic>

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { restaurantId, restaurantName, date } = body ?? {};

  if (![restaurantId, restaurantName, date].every((v) => typeof v === "string" && v)) {
    return Response.json({ error: "Missing restaurant or date" }, { status: 400 });
  }

  const message = `She picked ${restaurantName} on ${date}`;
  console.log("[date-choice]", { restaurantId, restaurantName, date, at: new Date().toISOString() });

  if (process.env.NOTIFY_URL) {
    await fetch(process.env.NOTIFY_URL, { method: "POST", body: message }).catch((err) =>
      console.error("[date-choice] notify failed", err),
    );
  }

  return Response.json({ ok: true });
}
