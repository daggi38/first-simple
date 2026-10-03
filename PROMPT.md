# Date invite site — Claude Code prompt

Build a one-page Next.js site I'll send to someone to ask her on a date. Inspect the repo first; reuse what's there. Stack: Next.js (App Router), TypeScript, Tailwind, Lucide. No new deps beyond that.

**Tone:** personal, warm, minimal. Not cheesy. Max one subtle heart (success screen only). No pink/red, gradients, heavy shadows, emoji, template-y landing-page look. Mobile-first, big tap targets.

**Flow** (one page, client state, subtle fade between steps, back keeps selections):
1. Invite — "Want to go on a date with me?" / "I made you a few options." / button "Sure, let's do it". No "No" button.
2. Pick a place — "I picked three options. Have a look and choose whichever you like." Each restaurant: image, name, location, description, price, "View menu" toggle, TikTok + Maps links (new tab), choose button. Selected state is obvious; then continue.
3. Pick a date — "Choose a day that works for you." Calendar where only configured future dates are tappable. Continue after selecting.
4. Confirm — "Your choice", restaurant + date, "Does that look good?", Confirm / Go back.
5. Done — "Perfect." / restaurant / date / "See you then."

**Config:** restaurants and `availableDates` in one file (`data/config.ts`).

**Submit:** `submitDateChoice({ restaurantId, restaurantName, date })` POSTs to `/api/choice`, which logs it and, if `NOTIFY_URL` is set, sends a push (e.g. ntfy.sh) so I actually see her answer. Show a retry message on failure.

**Don't:** auth, admin, database, extra abstractions.
