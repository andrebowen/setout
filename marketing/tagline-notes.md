# Setout marketing notes: tagline exploration

Ideas only, nothing built or wired into the app. Started 2026-08-25 from the
"Square Level Plumb" splash concept in `marketing/splash-page-square-level-plumb.html`.

## The real pain points

"Square Level Plumb" describes checking a build. Setout doesn't check a build,
it calculates an order, which is a different anxiety and probably the sharper one.

- **Running short mid-job.** Concrete truck's paid for, deck's half-decked, and
  you're short three bags or two boards. That's the nightmare scenario a
  calculator app exists to prevent, more than "is it square."
- **The second trip.** Driving back to the merchant because you under-ordered
  eats a whole morning. A tagline built around avoiding that trip is very real
  to a tradie.
- **Over-ordering.** The opposite failure, wasted material sitting in the ute,
  wasted money. "Enough, not more" territory.

## Candidate directions, closer to what the app does

- **Measure once. Order right.** Plays off "measure twice, cut once" but
  points at ordering, which is Setout's actual job.
- **No second trip.** Blunt, very tradie, everyone's had that morning.
- **Get it right before the ute leaves the yard.** Longer, more voice-driven,
  less splash-headline shaped.
- **Site maths, sorted.** Plainer, less poetic, but honest about what it is.
- **Measure twice. Order once.** (2026-08-25) Keeps the exact rhythm of the
  real trade proverb ("measure twice, cut once") and swaps only "cut" for
  "order," so it lands as instantly recognizable while pivoting straight from
  build-anxiety to order-anxiety. Punctuation matches the existing homepage
  tagline style ("Site calculations. Metric only.").

## Square Level Plumb: where it still fits

Not wrong, just borrowed from the physical-build trade rather than the
ordering trade. Candidate: demote it from splash headline to a secondary
line or footer nod ("built by people who still check with a level") rather
than leading with it.

## Metric positioning: open discussion

Three ways of saying "no imperial confusion," each doing a different job:

- **All Metric** — reads like a scope/category label. Fine as a filter tag,
  flat as an emotional pitch line.
- **Metric only** — already the live homepage subhead. Has an edge to it: a
  confident, slightly exclusionary flex, and speaks directly to the AU
  frustration of imperial-default apps built for a US audience.
- **mm · m · m² · m³** — not a sentence, a visual/graphic device (the unit
  strip, already in IBM Plex Mono elsewhere in the app). Reads best as an
  iconographic footer or eyebrow tag, not as headline copy.
- **in Metric** (2026-08-25) — small trailing tag rather than a subhead
  sentence. Reads like a note on a construction drawing ("all dimensions in
  mm unless noted") rather than a claim defending against imperial. Quieter
  than "Metric only," less of an edge, more matter-of-fact.

**Two separate ideas, not one fused line.** "Measure twice. Order once." and
the metric-positioning line (whichever of the four above) are independent
candidates, each usable on its own, not a headline+subhead pair to lock
together. Keep evaluating them separately.

## Also good ideas: the existing lines (2026-08-25)

Already live on the homepage, and worth keeping in the running rather than
being replaced wholesale by the new candidates above:

- **Site calculations.**
- **Metric only.**
- **mm · m · m² · m³ · °**

Same short-clause, full-stop voice as everything above, plus the unit strip
already does exactly the iconographic-footer job noted for the metric
options. Not necessarily an either/or against "Measure twice. Order once.",
worth testing as a combined stack too.

## "Measure twice. Order once." prior-use check (2026-08-25)

Not virgin territory, but no real collision:

- Already used as a blog headline in the office furniture industry, twice:
  [WorkspaceInteriors](https://www.workspaceinteriorsod.com/blog/measure-twice-order-once-how-to-measure-your-office-to-get-it-right-the-first-time/)
  and a matching [LinkedIn post](https://www.linkedin.com/pulse/measure-twice-order-once-how-your-office-get-right-first-schrank).
  Different industry, reads as a generic content headline, not a claimed slogan.
- "Measure twice. Build once." shows up as a construction company tagline per
  [Unbox Fame's tagline roundup](https://www.unboxfame.com/blog/construction-company-tagline-ideas/).
- "Measure twice, cut once" itself is everywhere in trade writing, expected
  since it's the source proverb.

Nobody owns "order once" in the trade space specifically. It'll read as
familiar rather than stolen, which is most of why it works as a tagline, just
not a phrase Setout would be first to use.

## Decision (2026-08-25): wired into splash-page-square-level-plumb.html

Split three candidates across the two roles they actually fit, rather than
picking one winner:

- **Splash headline** (`.lede`): "Measure twice, order once." One-time,
  high-impact read, earns the wit because it's only seen once per visit.
- **Splash eyebrow** (`.eyebrow`, above the wordmark): "Metric site
  calculations · no conversions." Plain and functional, does the explaining
  the headline deliberately skips.
- **Header** (`.domain-pill`, persistent nav element): "Australian made ·
  Metric first." Repurposed the domain pill, since the domain is already
  shown in the footer (`setout.online · setout.site`). Plain/trust-building
  copy holds up better than a witty line under repeated exposure across
  every page view.

## Correction: the homepage headline already changed (2026-08-26)

"Every site calculation in one app." / "Built in Australia for metric site
work." is **not a candidate under review — it's the current live homepage
h1/p**, `src/routes/index.tsx:28-33`, already shipped (by Andre, outside this
session, sometime after the 2026-08-25 audit that had "Site calculations." /
"Metric only." live). An earlier version of this note wrongly logged it as a
"candidate pair rejected" and compared it against the eyebrow ("Metric site
calculations · no conversions") and domain pill ("Australian made · Metric
first") from `marketing/splash-page-square-level-plumb.html` as if those were
also live — they aren't. That splash file is a separate, unshipped concept
page; nothing in it has been wired into the real app. Correcting the record
here rather than leaving a wrong claim standing.

Critique of the actual live pair, re-grounded:

- **"Every ... in one app"** is a completeness claim the roadmap argues
  against on purpose: the same-day catalog trim, the mitre calculator's own
  "isn't covered here" note, Retaining wall / Render / Stair compliance
  sitting deliberately unbuilt. The brand's edge is doing the right maths and
  saying so when it can't, not doing everything — this live line claims the
  opposite, and it's App Store breadth-copy register, not this app's voice.
- **"Built in Australia for metric site work"** isn't redundant with anything
  live (that argument was wrong), but on its own it still reads as a
  provenance stamp, closer to packaging text than trade voice.
- **Both lines share identical classes** (`font-display text-xl font-bold
  tracking-tight`) — no headline/support hierarchy between them, and `text-xl`
  is a step down in scale from the two-tone "Site calculations." (bold ink) /
  "Metric only." (lighter tone) hero treatment it replaced.

If revising: **"Structure, roofing, fit-out, site. One app."** for breadth
without the completeness claim, or **"Australian trade calculators. Metric,
always."** for the AU/metric line — both keep the short-clause, hard-stop
rhythm the rest of the identity uses. Not applied to `index.tsx` — this is
Andre's live copy, not touched without confirmation.

## Next

Compare a second splash concept built around the "no second trip" /
ordering-anxiety angle against the existing Square Level Plumb one.
