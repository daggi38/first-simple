"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fromKey, toKey } from "@/lib/dates";

type Props = {
  today: string; // YYYY-MM-DD; any day from here on can be picked
  selected: string | null;
  onSelect: (date: string) => void;
  locale: string;
};

// Small month calendar: any day from today onwards can be tapped, with no upper limit.
export function DateCalendar({ today, selected, onSelect, locale }: Props) {
  const start = fromKey(today);
  // Months after the current one (0 = this month)
  const [index, setIndex] = useState(() => {
    if (!selected) return 0;
    const s = fromKey(selected);
    return (s.getFullYear() - start.getFullYear()) * 12 + s.getMonth() - start.getMonth();
  });

  const first = new Date(start.getFullYear(), start.getMonth() + index, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // Monday first
  const cells: (string | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toKey(new Date(first.getFullYear(), first.getMonth(), i + 1)),
    ),
  ];
  // Always 6 rows, so the page doesn't jump when switching months
  while (cells.length < 42) cells.push(null);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "narrow" }),
  );

  return (
    <div className="calendar rounded-lg border border-line bg-surface p-2">
      <div className="mb-2 flex h-12 items-center justify-between pl-3">
        <p className="font-serif text-lg">
          {first.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <NavButton label="Previous month" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            <ChevronLeft size={20} />
          </NavButton>
          <NavButton label="Next month" onClick={() => setIndex(index + 1)}>
            <ChevronRight size={20} />
          </NavButton>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center">
        {weekdays.map((w, i) => (
          <span key={i} className="pb-1 text-xs leading-4 text-muted" aria-hidden>
            {w}
          </span>
        ))}
        {cells.map((key, i) => {
          if (!key) return <span key={`e${i}`} className="h-12" />;
          const isAvailable = key >= today;
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-label={fromKey(key).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
              className={[
                "h-12 rounded-md text-base tabular-nums transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                isSelected
                  ? "bg-accent font-medium text-surface"
                  : isAvailable
                    ? `hover:bg-accent-soft active:bg-accent-soft ${key === today ? "font-medium text-accent" : "text-ink"}`
                    : "text-muted/30",
              ].join(" ")}
            >
              {Number(key.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavButton({
  label,
  children,
  ...props
}: { label: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-12 place-items-center rounded-md text-ink hover:bg-accent-soft active:bg-accent-soft disabled:opacity-30 disabled:hover:bg-transparent"
      {...props}
    >
      {children}
    </button>
  );
}
