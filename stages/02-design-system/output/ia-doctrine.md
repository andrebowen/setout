# Setout — Calculator IA Doctrine

How calculators get named, grouped, and split or merged as the catalog grows past
the current 14. Two independent axes, plus a placement rule for setout-math.

## Axis 1 — Output type: materials takeoff vs. setout-math

The test: **does the answer get bought, or does it get marked out on site?**

| | Materials takeoff | Setout-math |
|---|---|---|
| Question answered | "How many do I need to buy?" | "Where does this go / what do I mark?" |
| Output shape | Quantity + waste allowance + an order line (Job → Order, or Job → Order → Supply if there's a pack-size conversion) | A dimension, angle, or spacing (Job → Result only) — no waste %, no "buy N" line |
| Naming | Named after the component being bought (Balustrade, Decking, Concrete) | Named after the on-site task (Roof pitch, Baluster spacing, Arc setout) |

Currently 13 of Setout's 14 calculators are pure takeoff. Roof pitch is the only
pure setout-math tool live today — that's why this axis hasn't needed visible UI
treatment yet. It will, as setout-math tools get added.

## Axis 2 — Trade: who does the job

Categories should read as the trade the audience self-identifies with, not a
building-science classification. Rule: **a category is promoted to its trade name
once it has ≥2 calculators that genuinely belong to that one trade; otherwise it
stays folded into a broader phase bucket** (`Site`, `Fit-out`) so the home screen
doesn't turn into a wall of one-item headers.

| Category | Rename from | Items today |
|---|---|---|
| Roofing | Roof | Corrugated roof, Roof pitch |
| Carpentry | Structure | Decking, Stairs, Balustrade, Wall framing |
| Wet trades | (unchanged — split into Concreting/Bricklaying once either gets a 2nd item) | Concrete, Brickwork |
| Fit-out | (unchanged — split once a sub-trade gets 2+ items) | Flooring, Tiling, Paint, Plasterboard |
| Site | (unchanged — phase label, not one trade; Fencing and Excavation aren't the same trade) | Fencing, Excavation |

## Placement rule for setout-math (three-way, not a blanket "separate section")

1. **Same job moment, same inputs as an existing takeoff calc → merge into it as
   another result section.** Precedent already live: `stairs.ts` returns both a
   "Geometry" section (risers, going, pitch, NCC compliance flags — pure
   setout-math) and a "Cutting list" / `order` section (stringers, treads,
   risers — takeoff) in one calculator. Don't build a second card for math that
   shares the same inputs as an existing takeoff calc.
2. **Same trade, different job moment → separate card, nested in the same trade
   section.** Precedent already live: Roof pitch sits next to Corrugated roof
   under Roofing — pitch gets worked out at a different point in the job than
   "how many sheets to order," even though both are roofing.
3. **No single trade owns it → its own cross-trade section**, e.g. "Setout &
   Measuring." Nothing here is built yet.

## Applying the rule to the current backlog (ex-BuildSet, `build-set/calculator-areas.md`)

- **Merge into an existing takeoff calc:** Baluster spacing → Balustrade;
  Stud/joist/noggin spacing → Wall framing; Raked walls → Wall framing;
  Stair compliance check (AS 1657) → Stairs (extend the existing compliance
  flags with a second, commercial-code mode).
- **Separate card, nested in trade:** (none new identified yet beyond the live
  Roof pitch precedent — revisit as new trade-specific setout-math ideas come up).
- **Cross-trade "Setout & Measuring" section:** Check Square, Equal spacing,
  Running measurements, Triangles, Mitre/compound angle, Dumpy level, Pitch/Slope
  (generic — distinct from Roof pitch), Fall/drainage grade, Circular/arc setout.
  None of these are owned by one trade — a concreter, a decker, and a fencer all
  need Fall/drainage grade or a Dumpy level equally.

## Built (2026-08-25)

- **Gravel, soil & mulch fill volumes** — `slug: "fill"`, Site category,
  materials takeoff. `src/lib/calc/site.ts` (`fillFields` / `computeFill`),
  registered in `catalog.ts`, unit test in `calc.test.ts`. Length × width × depth
  → net/order volume with a compaction allowance, bag count (material-specific
  yield), and an approx-tonnes reference. First calculator built off this
  doctrine's placement rule.
- **Asphalt** — `slug: "asphalt"`, Site category, materials takeoff
  (`src/lib/calc/site.ts`). The "pending future — not placed" note below was
  resolved by just putting it in Site, next to Fencing/Excavation/Fill — it's a
  driveway/paving job, not roofing-adjacent in practice.
- **The whole "Setout & Measuring" cross-trade section** — the section this
  doctrine scoped in the "Applying the rule to the current backlog" note above,
  now live as `category: "Setout & Measuring"` in `src/lib/calc/catalog.ts` /
  `src/lib/calc/measuring.ts`: **Check square, Equal spacing, Running
  measurements, Triangle (right/SSS/SAS — folds in Mitre/compound angle's sibling
  "any triangle" ask), Mitre angle (flat-plane only), Levelling (RL) (single
  instrument setup, not a multi-point run), Slope & fall (folds generic Pitch/Slope
  and Fall/drainage grade into one calculator — same maths, different context
  presets), Arc setout (= Circular/arc setout).** Fall/drainage grade was
  deliberately **not** given its own card — see Slope & fall above.
- **Raked walls** — merged into Wall framing (`src/lib/calc/framing.ts`) exactly
  as this doctrine specified: a `wallType: flat | raked` toggle: raked mode adds
  low/high height inputs and a "Raked studs" result section (stud lengths step
  evenly between the two ends, plus the rake angle for the top-plate bevel cut).
  No new card.
- Trigger for this pass: a side-by-side against two competitor apps (screenshots),
  which turned out to want almost exactly this section. Andre's go-ahead: build
  everything identified as a gap. Full reasoning and scope calls (why Mitre angle
  stops at flat-plane, why "Set-out marks" wasn't given its own card, why the cut
  list uses fixed slots) are logged in `MEMORY.md`, not duplicated here.
- 26 calculators total, all passing `calc.test.ts` (25/25), clean `npm run
  typecheck` and `eslint`.

Everything else — Retaining wall, Render/stucco coverage, Stair compliance check
(AS 1657), a true compound/raked mitre table, a real multi-point level run — is
still [PLANNED] or blocked on a "repeatable row" `Field` kind that doesn't exist
yet (needed for both the cut list beyond 6 slots and a proper level run).

Full current listing arrangement (built + backlog, by section) is in the session
transcript and `MEMORY.md` — this file is the reusable rule, not the point-in-time
list.
