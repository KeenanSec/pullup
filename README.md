# PullUp

Campus plans that go ahead when enough people commit. Built with Next.js App Router, React, TypeScript, and Lucide icons.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` for a production build and `npm start` to serve it.

## What works

- Responsive discovery feed with category filters, search, and sorting.
- Create plans with a meeting place, minimum attendance, and confirmation deadline.
- Join or leave plans with a five-token commitment balance; capacity and token limits are enforced.
- Confirmed-plan check-ins refund a token once. Pending plans dissolve at their deadline and release reserved tokens.
- My plans, device-local persistence, accessible native dialogs, keyboard focus, and reduced-motion support.

## Architecture

`src/lib/plans.ts` contains the pure state reducer and token calculation. `src/hooks/usePlans.ts` connects that state to browser storage and timer synchronization. `src/app/page.tsx` composes the interface. `MeetupCard` renders discovery cards; `PlanDialog` handles modal focus and keyboard dismissal. Sample campus data lives in `src/lib/mockData.ts`.

Run the state-transition regression tests with:

```sh
node --test tests/plans.test.cjs
npx tsc --noEmit
```

## Current scope

This is a local interactive prototype, not a shared service. Other participants are sample data. Plans persist only in this browser under `lockin-plans-v1`; clearing that key resets the demo. Check-in is self-reported. There is no authentication, database, campus verification, notification delivery, or location verification. A production launch needs server-authoritative identity, plan membership and token transactions, expiration jobs, and shared storage.

Geist fonts load through `next/font/google`; initial builds require access to Google Fonts. Older prototype components remain in `src/components` for reference but are not used by the current page.

## Visual direction

The current interface uses a charcoal canvas, large editorial typography, lavender accents, and original category-specific SVG artwork. The visual references were [Laws of UX](https://lawsofux.com/) and [Land-book](https://land-book.com/?view=mobile). The feed adapts from three columns to two to one; controls, confirmation status, and token actions use the same layout across categories. `src/hooks/usePlans.ts` owns browser persistence and timer synchronization; `PlanForm` owns plan creation, and `PlanArtwork` contains the vector covers.
