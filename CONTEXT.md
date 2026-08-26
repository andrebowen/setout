# Context — Setout

**Layer 1 — Project Router**

## Status

status: active — held at design stage (Andre's instruction)
committed: 2026-08-25
shipped: null
current_stage: 01-design-audit

## Progress

```
  ✓   Design Audit
  →   Design System              ← one decision applied (logo mark); rest pending
  ·   Platform Spec
  ·   Build
  ·   Verify / QA
  ·   Content / SEO / ASO
  ·   Ship
  ·   Launch
```

Legend: ✓ Complete · → In Progress · · Pending

---

## Current Stage: Design Audit → Design System

01-design-audit is done (full write-up in `stages/01-design-audit/output/design-audit.md`).
Design-system work so far: the logo mark reuses SlabSet's "S" geometry, redrawn in
Setout's own dark-badge/cream palette (`src/components/logo.tsx`); a calculator IA
doctrine is written (`stages/02-design-system/output/ia-doctrine.md`); and, on Andre's
explicit go-ahead, calculators from the doctrine's backlog have been built in two
passes: **Gravel, soil & mulch fill volumes** (`slug: "fill"`, Site category), then
(2026-08-25, prompted by a competitor comparison) **Asphalt** plus the entire
**"Setout & Measuring"** cross-trade section the doctrine had scoped but not built —
Check square, Equal spacing, Running measurements, Triangle, Mitre angle,
Levelling (RL), Slope & fall, Arc setout, Area, Linear cut list — and Raked walls
merged into Wall framing. Then (2026-08-25, prompted by a UI/IA/UX review, with
star/favourites now live) the catalog was trimmed 26 → 21: Area dropped
(redundant with the area KPI every trade calculator already shows); Excavation +
Fill + Asphalt merged into one "Site volume & tonnage" calculator with a material
selector; Running measurements folded into Equal spacing as a third mode; Mitre
angle folded into Triangle as a fifth mode. Mitre angle was then split back out
into its own calculator again (2026-08-26, Andre's call — it's not a Triangle
mode), so the net trim is 26 → **22**. Three merges stuck (Area dropped;
Excavation/Fill/Asphalt → Site volume & tonnage; Running measurements → Equal
spacing), not cuts of real trade capability — see "Catalog trim" in `MEMORY.md`.
22 calculators total, all with passing tests (`npm run --prefix Setout
test`-style run via `node --experimental-strip-types --test
src/lib/calc/calc.test.ts`, 25/25), clean `npm run typecheck`, clean `eslint` on
every touched file, and a clean `npx vite build`.
Everything else on the backlog (Retaining wall, Render/stucco, Stair compliance,
compound/raked mitre, multi-point level run) stays [PLANNED]/pending — these were
scoped, named exceptions for the calculator engine specifically, not a general
green light into 04-build for the rest of the launch pipeline (dark mode, native
nav, ASO, App Store submission, etc.).
See `MEMORY.md` for full session history and reasoning.

**Do not build or ship past design without Andre's explicit go-ahead** —
[[feedback_confirm_before_each_deploy]] applies here.

## Stage Map

| Stage | Folder | Status | Description |
|-------|--------|--------|-------------|
| 01-design-audit | `stages/01-design-audit/` | ✓ Done | Existing UI audited for a dual-platform (iOS + web) launch bar |
| 02-design-system | `stages/02-design-system/` | → In progress | Logo mark applied; dark mode, owned icon/manifest set, contrast fix, auth/empty states still open |
| 03-platform-spec | `stages/03-platform-spec/` | · Pending | Native-wrapper decision + domain roles (setout.online vs setout.site) + App Store checklist |
| 04-build | `stages/04-build/` | · Pending | Web + iOS builds off the 02/03 spec |
| 05-verify-qa | `stages/05-verify-qa/` | · Pending | Both platforms QA'd — devices, accessibility, offline |
| 06-content-seo-aso | `stages/06-content-seo-aso/` | · Pending | Web SEO + App Store ASO copy/screenshots |
| 07-ship | `stages/07-ship/` | · Pending | Web deployed, iOS submitted (TestFlight → App Store) |
| 08-launch | `stages/08-launch/` | · Pending | Coordinated go-live, both platforms |

## Go To

Andre reviews the 01 audit and the applied logo change, then decides whether to open
up 02-design-system in full. Read `MEMORY.md` for the naming decision (Setout vs.
BuildSet) and the full calculator catalog before picking that up.

## Project Config

- **Brand:** Setout — name confirmed over the retired "BuildSet" placeholder, 2026-08-25.
- **Logo:** shared "S" mark with SlabSet (three offset slab-course bars), Setout's own
  dark-badge/cream-cutout colors, no SlabSet yellow.
- **Domains:** setout.online, setout.site — both live, roles not yet assigned (03).
- **Stack:** TanStack Start (React 19) + Tailwind v4 + Radix + Better Auth, built in the
  Grok App Builder sandbox — `AGENTS.md` in this folder is the sandbox contract, not a
  project-state file (that's this file + `MEMORY.md`).
- **Calculators:** 22 built and live in `src/lib/calc/catalog.ts` (trimmed from 26 on
  2026-08-25/26) — see `MEMORY.md` for the full list and how it compares to the
  retired BuildSet backlog.
