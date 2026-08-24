# Stage 03 — Platform Spec

**State:** ⏳ not started
**Gate:** a written decision on how "iOS app + website, simultaneously" actually
ships, plus a role assignment for the two live domains.

## Open questions for this stage
- **Native wrapper approach:** wrap the existing TanStack Start web app (PWA →
  installable, or a thin native shell e.g. Capacitor) vs. a separate native build.
  Affects most of what 02 needs to design.
- **Domain roles:** setout.online and setout.site are both in place but neither
  has an assigned job yet — e.g. marketing/landing vs. the live app, or one
  redirecting to the other. Decide and document here before 04 builds against it.
- **Decoupling from the Grok App Builder sandbox** for a real deploy target
  (own manifest, own hosting, `public/__grok/` platform chrome removed per its
  own rules — see `AGENTS.md` in the app root).
- **App Store checklist:** account, bundle id, privacy questions (Better Auth is
  already wired — confirm what data it collects), screenshots sizes, review
  guidelines relevant to a utility/calculator app.

## Do not start without Andre's go-ahead — this workspace is held at the design
stage per the current instruction.
