import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CALC_ICONS } from "@/components/calc-icons";
import { Input } from "@/components/ui/input";
import { calculators, categories, getCalculator } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [query, setQuery] = useState("");
  const recents = useStore((s) => s.recents);
  const featured = calculators.filter((c) => c.featured);
  const q = query.trim().toLowerCase();

  const grouped = useMemo(() => {
    const filtered = calculators.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.short.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
    return categories
      .map((cat) => ({
        cat,
        items: filtered.filter((c) => c.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  const recentCalcs = recents
    .map((slug) => getCalculator(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          mm · m · m² · m³ · °
        </p>
        <h1 className="max-w-xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Site calculations.
          <span className="block text-muted">Metric only.</span>
        </h1>
        <p className="max-w-lg text-base text-muted">
          Decking, corrugated roof, pitch, stairs, balustrades and the rest of the
          takeoff — sized for the van, the bench and the slab.
        </p>
      </section>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators"
          className="pl-10"
          aria-label="Search calculators"
        />
      </div>

      {!q && recentCalcs.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Recent
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentCalcs.map((calc) => (
              <Link
                key={calc.slug}
                to="/calc/$slug"
                params={{ slug: calc.slug }}
                className="inline-flex h-11 shrink-0 items-center rounded-full border border-border px-4 text-sm hover:border-foreground/40"
              >
                {calc.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!q ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            On the tools
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {featured.map((calc, i) => {
              const Icon = CALC_ICONS[calc.slug];
              return (
                <li key={calc.slug}>
                  <Link
                    to="/calc/$slug"
                    params={{ slug: calc.slug }}
                    className="group flex min-h-20 items-center gap-4 rounded-xl bg-card px-4 py-4 shadow-border transition-colors duration-150 hover:bg-foreground/5"
                  >
                    <span className="font-mono text-xs tabular-nums text-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {Icon ? <Icon className="size-5 shrink-0" strokeWidth={1.75} /> : null}
                    <span className="flex min-w-0 flex-col">
                      <span className="font-display text-xl font-semibold tracking-tight">
                        {calc.name}
                      </span>
                      <span className="text-sm text-muted">{calc.short}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <section className="flex flex-col gap-8">
        {grouped.length === 0 ? (
          <p className="text-muted">No calculators match that search.</p>
        ) : (
          grouped.map((group) => (
            <div key={group.cat} className="flex flex-col gap-2">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                {group.cat}
              </h2>
              <ul className="divide-y divide-border rounded-xl bg-card shadow-border">
                {group.items.map((calc) => {
                  const Icon = CALC_ICONS[calc.slug];
                  return (
                    <li key={calc.slug}>
                      <Link
                        to="/calc/$slug"
                        params={{ slug: calc.slug }}
                        className={cn(
                          "flex min-h-14 items-center gap-3 px-4 py-3 hover:bg-foreground/[0.03]",
                        )}
                      >
                        {Icon ? (
                          <Icon className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
                        ) : null}
                        <span className="flex-1 font-medium">{calc.name}</span>
                        <span className="hidden text-sm text-muted sm:inline">{calc.short}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
