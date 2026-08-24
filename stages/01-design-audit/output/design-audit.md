# Setout — Design Audit

Reviewed: home/calculator-list, `decking` and `stairs` calculator routes (desktop +
mobile), `src/styles.css` tokens, `app-shell.tsx`, `__root.tsx` head tags, `catalog.ts`.

## Overall read
The trade-tool identity is already there and it's good — this isn't a template.
Warm putty/stone background (`#efece3`), near-black ink (`#1b1914`), a condensed
display face for headlines against IBM Plex Mono for the measurement units strip
(`MM · M · M² · M³ · °`), numbered index tags on the calculator cards (01, 02, 03…),
a black square logo mark. It reads like a site diary or a spec sheet, which is the
right register for a trade audience. Keep this identity through the rest of the
pipeline rather than genericizing it.

## Strengths
- **Coherent token set.** One `@theme` block drives everything — background, card,
  muted/subtle text, border, and semantic `ok`/`warn`/`danger` colors are all named
  and reused, not one-off hex values scattered through components.
- **Typography does real work.** Display condensed face for the big "Site
  calculations. / Metric only." headline, mono for units and index numbers — the
  mix reinforces the "measuring tool" feel instead of decorating it.
- **Card list is legible and scannable.** Icon, index number, name, one-line scope
  ("Boards, joists, bearers, posts") — a tradesperson can find their calculator in
  under a second.
- **Calculator layout is sound.** Left column inputs, right column live results +
  diagram, sticky action row (Copy takeoff / Save job / Reset) — a proven
  spec-sheet pattern already validated in the SlabSet family (see
  [[project_slabset_versions]]).
- **Print stylesheet exists** (`@media print` hides header/nav) — useful for a
  trade tool people take to site; worth carrying into the app-parity pass.
- **Reduced-motion respected** (`prefers-reduced-motion` query present).
- **Mobile layout holds up** — the home screen reflows cleanly to 390px with no
  overflow; touch targets on the card list are generously sized.

## Gaps (ranked, for the 02-design-system brief)

### Fix before build
1. **No dark-mode tokens.** Only one palette is defined on bare values, no
   `prefers-color-scheme` branch. iOS App Store review and users both expect
   system dark mode to be respected, or a deliberate opt-out stated — right now
   there's no decision, just an absence.
2. **Grok platform chrome is still load-bearing.** `manifest.webmanifest`,
   `apple-touch-icon`, and the "Created with Grok" injector all come from
   `public/__grok/`. None of this can ship to setout.online or an App Store
   listing as-is — a real manifest, icon set, and splash assets need to be
   authored and owned by Setout, not inherited from the sandbox. This is a
   design-asset gap, not just a build step: nobody has drawn the app icon yet.
3. **Single icon size (180px only).** iOS needs the full marketing/App Store
   icon set (1024 App Store, plus the standard iOS size ladder if going native
   rather than pure PWA-wrapped). None of these have been designed.

### Should fix in 02
4. **Contrast on `--color-subtle` (`#9a9488` on `#efece3`) is borderline.** Card
   sublines ("Boards, joists, bearers, posts") and helper text under inputs
   ("Boards run this way") sit close to WCAG AA's 4.5:1 for body text — measure
   and either darken the token or bump size/weight where it's used at small text
   sizes.
5. **No stated iOS-native affordances.** Top header + full-width content reads
   as a website, not an iOS app — no safe-area inset handling visible, no
   decision yet on bottom tab bar vs. the current top nav for the native shell.
   This is a real product decision, not styling, so it belongs in 03-platform-spec,
   but 02 should produce the visual spec for whichever direction 03 picks.
6. **No auth/account UI reviewed.** Better Auth is wired (`src/lib/auth/`) but no
   login/account screen was in the audited surface — needs a design pass before
   build if the iOS app will gate anything behind sign-in.
7. **No empty/error/loading states seen.** Only the happy path (fields populated,
   valid results) was visible in the screenshots reviewed — worth confirming
   these exist and match the identity before they're needed on a device with a
   flaky site connection.

### Minor / polish
8. **Favicon is a plain monochrome SVG mark** — fine for now, low priority next
   to the icon-set gap above.
9. **"METRIC" badge in the header is static** — if Setout ever serves an
   imperial market this is a hook already in place; not urgent, just noting it's
   there.

## Not audited (out of scope for this pass)
Jobs list (`jobs.tsx`), the remaining 8 calculators beyond decking/stairs, and any
settings/account screens. Sample before 02 closes.

## Verdict
Strong, distinctive foundation — the identity doesn't need reinventing. The gaps
are almost entirely about **launch readiness for two platforms at once** (owned
icon/manifest set, dark mode, native-shell navigation decision) rather than the
core visual language, which is in good shape.
