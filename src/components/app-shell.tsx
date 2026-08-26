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
    <div className="min-h-dvh bg-background text-foreground antialiased">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-md px-1 text-foreground"
              aria-label="Setout home"
            >
              <Logo className="size-7 text-foreground" />
              <span className="font-display text-xl font-bold tracking-[-0.04em]">
                Setout
              </span>
            </Link>
            <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:inline">
              Australian made · Metric first
            </span>
          </div>
          <Link
            to="/jobs"
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
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
      <main className="mx-auto w-full max-w-5xl px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pt-6">
        {children}
      </main>
    </div>
  );
}
