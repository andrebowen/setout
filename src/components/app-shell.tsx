import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { useStore } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrate = useStore((s) => s.hydrate);
  const jobs = useStore((s) => s.jobs);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="h-1 bg-foreground" />
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-2.5 text-foreground"
            aria-label="Setout home"
          >
            <Logo className="size-7 text-foreground" />
            <span className="font-display text-xl font-semibold tracking-tight">
              Setout
            </span>
            <span className="hidden rounded-full border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:inline">
              Metric
            </span>
          </Link>
          <Link
            to="/jobs"
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-foreground hover:bg-foreground/5"
          >
            <ClipboardList className="size-4" />
            <span>Jobs</span>
            {hydrated && jobs.length > 0 ? (
              <span className="rounded-full bg-foreground px-1.5 font-mono text-[11px] text-primary-foreground">
                {jobs.length}
              </span>
            ) : null}
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:pt-8">{children}</main>
    </div>
  );
}
