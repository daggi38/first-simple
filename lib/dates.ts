// Dates are handled as local "YYYY-MM-DD" strings to avoid timezone shifts.

export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(key: string, locale: string): string {
  return fromKey(key).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
