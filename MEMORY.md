# Setout — Memory

**Brand:** Setout — confirmed as the canonical name over the retired "BuildSet"
placeholder, 2026-08-25.
**Status:** Live, working app (real calculator engine, 22 calculators); held at
design stage for the iOS + web launch pipeline, per Andre's instruction — the
calculator engine itself is treated as a separate, ongoing scoped exception to
that hold (see the fill-volume and competitor-gap-fill entries below).
**Last updated:** 2026-08-26

---

## What it is

AU trade site-calculators — decking, roof, stairs, balustrade, concrete, framing,
fit-out and site takeoffs — built as a real TanStack Start app (React 19, Tailwind v4,
Radix, Better Auth) in the Grok App Builder sandbox. Every calculator has a working
compute engine (`src/lib/calc/`), not a mockup. Domains **setout.online** and
**setout.site** are both live but neither has an assigned role yet (open question for
`stages/03-platform-spec/`).

**Tagline (from the homepage):** "Site calculations. Metric only." — "Decking,
corrugated roof, pitch, stairs, balustrades and the rest of the takeoff — sized for
the van, the bench and the slab."

## Identity

- **Palette:** warm putty/stone background (`#efece3`), near-black ink (`#1b1914`) —
  see full token set in `src/styles.css`.
- **Type:** Barlow Condensed for display headlines, IBM Plex Mono for the unit strip
  (`MM · M · M² · M³ · °`) and card index numbers.
- **Logo:** the "S" mark — three offset slab-course bars, same geometry as the live
  SlabSet mark (`slab-set/app-v23/shared/logo.svg`), redrawn in Setout's own
  dark-badge/cream-cutout colors rather than SlabSet's hi-vis yellow. Applied
  2026-08-25 in `src/components/logo.tsx`, on Andre's direct instruction — confirms
  Setout and SlabSet intentionally share a visual family even though the wordmark
  doesn't follow the sibling `[Domain]Set` naming formula.
- **Wordmark:** `Setout` — single word, one capital, not hyphenated (`Set-Out`) and
  not internally capped (`SetOut`). Reasoning: "setout" (site setout — the
  surveying/marking-out step before building) is a real trade term the audience
  already knows, not an invented two-word brand mashup like SlabSet/BuildSet — an
  internal cap would visually re-split it into "Set" + "Out" and invite a
  verb-phrase misread. Also matches the unhyphenated live domains exactly.

## Naming decision: Setout vs. BuildSet (2026-08-25)

BuildSet was the placeholder name for a 12+ calculator trade suite explored
2026-08-10 through 2026-08-21 (`Calculator-Studio/build-set/`) — brand exploration,
a clickable IA prototype (`app/index.html`), a 30-area calculator backlog
(`calculator-areas.md`), and a pricing model ($10 one-time App Store IAP). It fits
the sibling naming formula (SlabSet, PoolSet, GravelSet…) but **never had a working
calculator engine** — every field in the prototype was hand-set, no maths ran — and
the name itself was always explicitly left open (alternatives considered: TradeSet,
SiteSet, QuantoSet, MaterialSet, OrderSet).

Setout is functionally the same product concept, already shipped as a real app with
live domains and a real compute engine. Verdict: **Setout wins** — it's a more
distinctive, evocative name (a real trade term, not a generic `[Domain]+Set`
mashup), and switching to BuildSet now would mean reworking a running app's
domains/code/logo for a name that was never finalized. **BuildSet is retired**,
marked superseded in `build-set/README.md`. Its 30-area calculator backlog remains
useful as a candidate list for Setout's own catalog (see below).

## Calculator catalog: Setout (built) vs. BuildSet (retired backlog)

**Setout — 22 calculators, all with a real compute engine**
(`src/lib/calc/catalog.ts`), trimmed from 26 to 21 on 2026-08-25, then Mitre
angle split back out to 22 the same day on Andre's call — see "Catalog trim"
below:

| Category | Calculators |
|---|---|
| Carpentry | Decking, Stairs, Balustrade, Wall framing (flat + raked) |
| Roofing | Corrugated roof, Roof pitch |
| Wet trades | Concrete, Brickwork |
| Fit-out | Flooring, Tiling, Paint, Plasterboard |
| Site | Fencing, Site volume & tonnage (excavation, gravel/soil/mulch fill, asphalt — one calculator with a material selector) |
| Setout & Measuring | Check square, Equal spacing (also does fixed-increment running marks as a third mode), Triangle (right/SSS/SAS), Mitre angle, Levelling (RL), Slope & fall, Arc setout, Linear cut list |

**BuildSet — 30 areas documented, 13 built as UI-only prototype (no engine),
17 never built** (`build-set/calculator-areas.md`):

- **Overlap — already built (with a real engine) in Setout:** Decking, Concrete,
  Roof pitch, Stairs, Fencing, Plasterboard, Paint, Tiling, Gravel/Soil/Mulch fill
  volumes, and (2026-08-25) **Asphalt, Check Square, Equal spacing, Running
  measurements, Pitch/Slope (as the generic Slope & fall tool), Raked walls (merged
  into Wall framing), Triangles, Mitre/compound angle (flat-plane only — see below),
  Dumpy level (as Levelling (RL)), Circular / arc setout.**
- **Deliberately not built as separate BuildSet items** — folded into an existing
  Setout calculator instead, per the IA doctrine's placement rule:
  - **Baluster spacing / Stud-joist-noggin spacing** → live inside Balustrade /
    Wall framing respectively (unchanged from before).
  - **Fall / drainage grade** → folded into the generic **Slope & fall** calculator
    alongside Pitch/Slope — same ratio/percent/angle maths, different context
    presets (ramp 1:14, path 1:20, drainage/paving 1:100), rather than two near-
    identical cards.
- **Still open, never built anywhere:** Roofing (asphalt shingles — deliberately
  skipped, rare in the AU market Setout targets; Corrugated roof already covers
  AU sheet-metal roofing), Retaining wall, Render/stucco coverage, Stair
  compliance check (AS 1657 commercial mode).
- **In Setout only, not anywhere on BuildSet's 30-area list:** Corrugated roof,
  Wall framing, Flooring, Area (generic m²), Linear cut list.

### Scope decisions made building the "Setout & Measuring" section (2026-08-25)

Triggered by a side-by-side against two competitor apps (screenshots supplied by
Andre — an unnamed dark "Tools" app and Peth Pty Ltd's "The Chippy Calc",
Toowoomba). Both ship almost exactly the cross-trade section the IA doctrine had
already scoped but not built. Andre's go-ahead: "do it so we cover all the other
apps" → build everything identified as a gap, not just a subset.

- **Mitre angle** is flat-plane only (`mitre = cornerAngle / 2`). A raked/compound
  mitre — skirting running up a sloped ceiling, crown moulding — needs a full
  compound-angle table (spring angle × plan angle); explicitly out of scope, said
  so in the calculator's own notes rather than silently producing a wrong number.
- **"Set-out marks"** (a named tool in the dark "Tools" app) was not built as its
  own card — it's the same job as **Equal spacing** + **Running measurements**
  (marking positions along a run), so building a third near-duplicate would just
  fragment the same math. Worth a look at what that app's version actually does
  before assuming this call was right.
- **Linear cut list** uses a fixed 6 length/qty slots (not a dynamic list) because
  the `Field` type has no "repeatable row" kind yet — a real constraint, not a
  scope cut. First-fit-decreasing bin packing, kerf added per cut.
- **Triangle** solver covers right (two legs, or hyp+leg), SSS and SAS — matches
  "solve any triangle" claims from competitors, not just the right-triangle case.
- **Levelling (RL)** is a single instrument setup (one backsight, one foresight) —
  a genuine multi-point level run would need the same dynamic-list capability the
  cut list is missing. Noted in the calculator's own copy: chain setups by using
  each target RL as the next station's benchmark.
- Added test coverage for every new calc in `calc.test.ts` (hand-verified
  expected values, including a manual trace of the cut-list bin-packing) —
  25/25 passing, `npm run typecheck` and `npx eslint` both clean.

## Design audit (2026-08-25, stage 01 — done)

Full write-up: `stages/01-design-audit/output/design-audit.md`. Short version: the
identity is strong and distinctive already, keep it. Gaps are almost entirely about
being launch-ready on two platforms at once, not the visual language:
- No dark-mode tokens
- App still depends on Grok's `public/__grok/` manifest/icon/branding scaffolding —
  needs an owned manifest + icon set (App Store 1024 + iOS ladder) before either
  store or domain launch
- Only one icon size exists (180px)
- `--color-subtle` text contrast is borderline
- No iOS-native nav decision yet (top header vs. bottom tab bar)
- Auth screens and empty/error/loading states weren't in the audited surface

## Stage pipeline

`stages/` holds an 8-stage pipeline (01-design-audit through 08-launch) built
specifically for this project — publish an iOS app and a website simultaneously.
See `CONTEXT.md` for the live stage map. **Held at design stage by Andre's
instruction** — 02 has one applied decision (the logo mark); everything else in 02
through 08 is scaffolded only, not started.

## Correctness fix: Decking headline/KPIs (2026-08-25)

The Decking calculator's top-level headline and KPI strip were showing the wrong
numbers as "the answer": **"Boards" KPI was a setout count** (rows across the
width, `ceil(width / boardCover)`), not a purchase quantity, and the KPI strip
carried "Linear" (total lineal metres) instead of the actual purchasable **Stock**
figure (pieces at the chosen stock length) — already computed correctly, just
buried in a section row. On a 6×4m deck with 5.4m stock, "28 boards" in the old
headline was 7 short of the real order (35 stock pieces), since rows longer than
one stock length need a second piece. Fixed: headline now leads with stock
lengths ("35 stock lengths · 184.8 m linear with waste"), KPI strip renamed
"Boards"→"Rows across" and "Linear"→"Stock". Same category error as the
takeoff-vs-setout-math axis in the IA doctrine, just inside one calculator's own
result instead of between two calculators — worth checking other calculators for
the same pattern (a KPI/headline number that reads like an order but isn't one)
next time one gets touched.

## Catalog trim: 26 → 22 calculators (2026-08-25/26)

Prompted by a UI/IA/UX review: with star/favourites now live (returning users
pin their daily tools to the top of the list), the case for a large catalog
shifted from "get to my tools fast" (favourites solves that) to "keep the
catalog itself clear." Four changes, all merges of calculators that were
doing the same underlying maths under a different name, not cuts of real
trade capability:

- **Area dropped entirely.** Every trade calculator already surfaces area as
  a KPI (see Decking's `AREA` figure); a bare length × width page didn't earn
  a standalone card next to 20 calculators with real trade-specific logic.
- **Excavation + Fill + Asphalt → one "Site volume & tonnage" calculator**
  (`slug: "site-volume"`, `computeSiteVolume` in `src/lib/calc/site.ts`).
  All three were plan area × depth → volume × a swell/settle/waste percentage
  → order quantity, just with different presets; now one calculator with a
  "Material / job" selector (`material` field) and per-material fields shown
  via `showWhen` (excavation's `depth`/`bulkage`/`truck` in metres vs the
  fill materials' and asphalt's shared `depthMm` in millimetres, gravel/soil/
  mulch's `allowance` vs asphalt's `waste`). Each material branch keeps its
  original copy, notes and output shape (loads/tonnes/bags) unchanged.
- **Running measurements → folded into Equal spacing** as a third `mode`
  option (`fixed-increment`), alongside the existing target-spacing and
  n-spaces modes. Both calculators were already "generate a list of mark
  positions along a run" — the IA doctrine caught this exact overlap once
  already (that's why the "Set-out marks" competitor feature was never built
  as a third near-duplicate) but hadn't been applied to these two yet.
- **Mitre angle → folded into Triangle**, then split back out (2026-08-26,
  Andre's call: "mitre cut is not to go in triangle"). It's a standalone
  calculator again (`slug: "mitre-angle"`, `computeMitreAngle` /
  `mitreAngleFields` in `measuring.ts`) — code and copy unchanged from before
  the merge. Net effect: this one wasn't a merge that stuck; catalog count is
  **22**, not 21.
- **Kept, despite being long-tail:** Arc setout and Level survey. Both are
  genuinely low-frequency but neither overlaps another calculator, and with
  favourites handling "surface my daily tools," an unstarred card at the
  bottom of a category costs little. Revisit with real usage data once
  shipped rather than cutting on a guess.

Verified: `node --experimental-strip-types --test src/lib/calc/calc.test.ts`
(25/25 passing — every merged path got an explicit test, including a new
excavation-mode test that didn't exist before), `npm run typecheck`, `npx
eslint .` (clean on every touched file; the one pre-existing lint error in
`src/lib/app-data/client.server.ts` predates this change), and `npx vite
build` (production build succeeds).

Slugs `excavation`, `fill`, `asphalt`, `running-measurements`, `mitre-angle`
and `area` no longer resolve — `getCalculator()` returns `undefined` for
them. `jobs.tsx` already handles that gracefully (falls back to the raw slug
as a label), and favourites/saved-job data is `localStorage`-only per device
(`setout.v1` key in `src/lib/store.ts`), so this is a cosmetic orphan for
anyone who'd already favourited or saved a job against one of the retired
slugs, not a crash risk. Worth a look next time favourites are touched.

## Next

Andre reviews the catalog trim above (26 → 22, see "Catalog trim" section),
then the 11-calculator competitor gap-fill build (10 new "Setout &
Measuring" tools + Asphalt + raked walls merged into Wall framing), then
decides whether to open 02-design-system in full (dark mode, owned icon/manifest
set, contrast fix, nav decision, auth/empty states — including the "Setout &
Measuring" category, which has no bespoke UI treatment yet beyond the generic
calculator form/results components). Still open from the backlog: Retaining wall,
Render/stucco coverage, Stair compliance check (AS 1657), a compound/raked mitre
table, and a real multi-point level run — all blocked on either more design time
or a "repeatable row" `Field` kind that doesn't exist yet.
