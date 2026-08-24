# Setout — Memory

**Brand:** Setout — confirmed as the canonical name over the retired "BuildSet"
placeholder, 2026-08-25.
**Status:** Live, working app (real calculator engine); held at design stage for the
iOS + web launch pipeline, per Andre's instruction.
**Last updated:** 2026-08-25

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

**Setout — 14 calculators, all with a real compute engine**
(`src/lib/calc/catalog.ts`):

| Category | Calculators |
|---|---|
| Structure | Decking, Stairs, Balustrade, Wall framing |
| Roof | Corrugated roof, Roof pitch |
| Wet trades | Concrete, Brickwork |
| Fit-out | Flooring, Tiling, Paint, Plasterboard |
| Site | Fencing, Excavation |

**BuildSet — 30 areas documented, 13 built as UI-only prototype (no engine),
17 never built** (`build-set/calculator-areas.md`):

- **Overlap — already built (with a real engine) in Setout:** Decking, Concrete,
  Roof pitch, Stairs, Fencing, Plasterboard, Paint, Tiling.
- **Built as prototype UI in BuildSet, not in Setout at all** — the clearest
  next-build candidates, since the IA/design work already exists: **Gravel / Soil /
  Mulch fill volumes, Paving / turf, Insulation, Fall / drainage grade, Circular /
  arc setout.**
- **In Setout only, not anywhere on BuildSet's 30-area list:** Corrugated roof,
  Wall framing, Flooring.
- **Planned in BuildSet, never built anywhere (17 total):** Asphalt, Roofing,
  Brick/block wall, Retaining wall, Render/stucco coverage, Cut/fill excavation
  volume, Check Square, Baluster spacing, Dumpy level, Equal spacing, Running
  measurements, Pitch/Slope, Raked walls, Triangles, Stud/joist/noggin spacing,
  Mitre/compound angle, Stair compliance check.
  - Note: Setout already has **Excavation** and **Brickwork** as material-quantity
    calculators — BuildSet's "Cut/fill excavation volume" and "Brick/block wall"
    are the same domain, just never built. Setout's **Balustrade** and **Wall
    framing** are material-takeoff calculators; BuildSet's "Baluster spacing" and
    "Stud/joist/noggin spacing" are a different calc type (setout/spacing math, not
    a materials order) in the same domain — related, not duplicates.

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

## Next

Andre reviews the audit + logo change, decides whether to open 02-design-system in
full (dark mode, owned icon/manifest set, contrast fix, nav decision, auth/empty
states) and/or pull specific calculators off the BuildSet backlog above into
Setout's catalog.
