# Stage 02 — Design System

**State:** ⏳ not started
**Gate:** every "fix before build" and "should fix" item in
[`../01-design-audit/output/design-audit.md`](../01-design-audit/output/design-audit.md)
has a designed answer — dark-mode token set, owned app icon set (App Store 1024 +
iOS ladder) and splash assets, contrast-safe `subtle` text token, auth/account
screens, empty/error/loading states.

## Scope (when picked up)
- Extend `@theme` tokens with a `prefers-color-scheme: dark` branch, keeping the
  putty/ink identity coherent in both modes.
- Design and export the icon/splash asset set that replaces `public/__grok/`.
- Design missing screens (auth, empty/error/loading) in the same visual language.
- Produce the visual spec for whichever nav shell 03-platform-spec picks
  (top header vs. bottom tab bar) for the native wrapper.

## Decisions already applied (ahead of full stage kickoff)
- **2026-08-25 — logo mark set.** `src/components/logo.tsx` now uses the SlabSet
  family "S" mark (three offset slab-course bars) on Andre's direct instruction,
  redrawn in Setout's own dark-badge / cream-cutout construction rather than
  SlabSet's yellow — keeps Setout's existing monochrome identity, borrows the
  shared family shape. Source geometry: `slab-set/app-v23/shared/logo.svg` (the
  live SlabSet mark). Still open: this only fixes the *mark* — Setout still needs
  its own owned icon/manifest set built from it (App Store 1024, iOS ladder,
  splash) per gap #2/#3 in the 01 audit; that's still unbuilt.

## Do not start the rest of this stage without Andre's go-ahead — this
workspace is held at the design stage per the current instruction.
