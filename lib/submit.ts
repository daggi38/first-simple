export type DateChoice = {
  restaurantId: string;
  restaurantName: string;
  date: string; // YYYY-MM-DD
};

// Logs her choice and sends it to /api/choice (which logs it server-side and can notify you).
// To use a different API later, only change the body of this function.
export async function submitDateChoice(choice: DateChoice): Promise<void> {
  console.log("Date choice:", choice);
  const res = await fetch("/api/choice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(choice),
  });
  if (!res.ok) throw new Error(`Submit failed (${res.status})`);
}
