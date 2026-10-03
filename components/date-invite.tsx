"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowDown, Check } from "lucide-react";
import { config, restaurants, type Restaurant } from "@/data/config";
import { formatDate, toKey } from "@/lib/dates";
import { submitDateChoice } from "@/lib/submit";
import { DateCalendar } from "./date-calendar";
import { Button } from "./ui";

export function DateInvite() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  // Read "today" on the client only, so the prerendered HTML never disagrees with it.
  const today = useSyncExternalStore(noop, () => toKey(new Date()), () => null);
  const ready = Boolean(restaurant && date);
  const locked = status === "done" || status === "sending";

  async function approve() {
    if (!restaurant || !date) return;
    setStatus("sending");
    try {
      await submitDateChoice({ restaurantId: restaurant.id, restaurantName: restaurant.name, date });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="page mx-auto w-full max-w-md md:max-w-5xl">
      {/* 01 — The pilot (title card) */}
      <section className="flex min-h-dvh flex-col items-center justify-center pb-10 pt-[env(safe-area-inset-top)] text-center">
        <div className="fade-in">
          <p className="label">Season 01</p>
          <p className="label mt-2">Episode 01</p>
          <h1 className="mt-8 font-serif text-6xl italic leading-none tracking-tight md:text-7xl">The Pilot</h1>
          <span className="mx-auto mt-8 block h-px w-12 bg-accent/60" aria-hidden />
        </div>
        <div className="fade-in-late">
          <p className="mx-auto mt-8 max-w-[20ch] font-serif text-2xl leading-snug">
            Selome, aka Star, will you go on a simple date with me?
          </p>
          <p className="mt-4 text-muted">I picked a few places based on our chats.</p>
          <p className="mx-auto mt-10 max-w-[30ch] text-muted">
            If you&apos;re up for Episode 01, choose the setting below.
          </p>
          <a
            href="#setting"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md px-5 text-base font-medium text-ink transition-colors hover:text-accent active:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Continue <ArrowDown size={16} className="nudge" aria-hidden />
          </a>
        </div>
      </section>

      {/* 02 — The setting */}
      <section id="setting" className="scroll-mt-6 py-12">
        <SectionTitle label="Episode 01" text="Every pilot needs a good setting.">
          The Setting
        </SectionTitle>
        <ul className="grid gap-6 md:grid-cols-3 md:gap-5">
          {restaurants.map((r, i) => (
            <RestaurantCard
              key={r.id}
              index={i + 1}
              restaurant={r}
              selected={r.id === restaurantId}
              disabled={locked}
              onSelect={() => setRestaurantId(r.id)}
            />
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-md">
        {/* 03 — Air date */}
        <section className="py-12">
          <SectionTitle label="Episode 01" text="Now we just need a date.">
            Air Date
          </SectionTitle>
          {!today ? (
            <div className="calendar rounded-lg border border-line bg-surface" />
          ) : (
            <DateCalendar
              today={today}
              selected={date}
              onSelect={(d) => !locked && setDate(d)}
              locale={config.locale}
            />
          )}
        </section>

        {/* 04 — Episode details */}
        <section className="pt-6">
          {status === "done" && restaurant && date ? (
            <div className="fade-in pb-[calc(5rem+env(safe-area-inset-bottom))] pt-6 text-center">
              <p className="label">Episode 01</p>
              <p className="mt-4 font-serif text-5xl italic tracking-tight">Approved.</p>
              <p className="mt-8 font-serif text-2xl">{restaurant.name}</p>
              <p className="mt-1 text-muted">{formatDate(date, config.locale)}</p>
              <p className="mt-10">See you in Episode 01.</p>
              <p className="mt-16 text-xs tracking-wide text-muted/70">Episode 02 depends on the pilot.</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-line bg-surface p-6">
                <p className="label">Episode 01</p>
                <h3 className="mt-2 font-serif text-3xl italic">The First Date</h3>
                <dl className="mt-6 space-y-5">
                  <Detail label="Setting" value={restaurant?.name} />
                  <Detail label="Air date" value={date ? formatDate(date, config.locale) : undefined} />
                </dl>
                <p className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm text-muted">
                  <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                  Status: Pending approval
                </p>
              </div>

              {/* Pinned to the bottom of the screen while this section is in view, within thumb reach */}
              <div className="bleed sticky bottom-0 mt-6 bg-paper/90 pb-[max(1rem,calc(env(safe-area-inset-bottom)+0.5rem))] pt-3 backdrop-blur">
                <Button className="w-full" onClick={approve} disabled={!ready || status === "sending"}>
                  {status === "sending" ? "Approving…" : "Approve Episode 01"}
                </Button>
                {status === "error" ? (
                  <p role="alert" className="mt-2 text-center text-sm text-ink">
                    That didn&apos;t go through. Check your connection and try again.
                  </p>
                ) : (
                  !ready && (
                    <p className="mt-2 text-center text-sm text-muted">
                      {restaurant ? "Pick an air date first." : date ? "Pick a setting first." : "Pick a setting and an air date first."}
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const noop = () => () => {};

function SectionTitle({ label, children, text }: { label: string; children: string; text: string }) {
  return (
    <header className="mb-8 text-center">
      <h2 className="label">
        {label} <span className="text-accent/70">—</span> {children}
      </h2>
      <p className="mt-4 font-serif text-2xl italic">{text}</p>
    </header>
  );
}

function RestaurantCard({
  index,
  restaurant: r,
  selected,
  disabled,
  onSelect,
}: {
  index: number;
  restaurant: Restaurant;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      className={`flex flex-col overflow-hidden rounded-lg border bg-surface transition-[border-color,box-shadow] duration-300 ${
        selected ? "border-accent/80 ring-1 ring-accent/60" : "border-line"
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-line">
        <Image
          src={r.image}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, (max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        {selected && (
          <span className="fade-in absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-paper/80 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur">
            <Check size={12} aria-hidden /> Selected
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label">{String(index).padStart(2, "0")}</p>
        <h3 className="mt-1 font-serif text-2xl leading-tight">{r.name}</h3>
        <p className="mt-2 leading-relaxed text-muted">{r.description}</p>

        <ul className="mt-4 space-y-1">
          {r.menu.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <p className="text-sm text-muted">
            {r.location}
          </p>
          <div className="-ml-3 flex items-center text-sm text-muted">
            <ExtLink href={r.tiktokUrl}>TikTok</ExtLink>
            <span aria-hidden>·</span>
            <ExtLink href={r.mapsUrl}>Maps</ExtLink>
          </div>

          <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            aria-pressed={selected}
            className={`mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border text-base font-medium transition-[color,border-color,background-color,transform] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-safe:enabled:active:scale-[0.98] disabled:cursor-default ${
              selected
                ? "border-accent bg-accent text-paper"
                : "border-ink/20 hover:border-accent hover:text-accent active:bg-accent-soft disabled:opacity-40 disabled:hover:border-ink/20 disabled:hover:text-ink"
            }`}
          >
            {selected ? (
              <>
                <Check size={18} aria-hidden /> Selected
              </>
            ) : (
              "Select"
            )}
          </button>
        </div>
      </div>
    </li>
  );
}

function ExtLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center rounded-md px-3 underline decoration-line underline-offset-4 transition-colors hover:text-ink active:bg-accent-soft active:text-ink"
    >
      {children}
    </a>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className={`mt-1 ${value ? "font-serif text-xl" : "text-muted/60"}`}>{value ?? "Not chosen yet"}</dd>
    </div>
  );
}
