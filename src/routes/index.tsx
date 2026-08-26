import { createFileRoute, Link } from "@tanstack/react-router";
import { CALC_ICONS } from "@/components/calc-icons";
import { calculators, categories, getCalculator } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {

  const grouped = categories
    .map((cat) => ({
      cat,
      items: calculators.filter((c) => c.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const favorites = useStore((s) => s.favorites ?? []);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const favoriteCalcs = calculators.filter((c) => favorites.includes(c.slug));

  const topList = favoriteCalcs; // Only show favorites on the top rail — no 'Recent' section

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">Setout calculators</h1>
      {topList.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            Favorites
          </h2>
          <ol className="grid gap-2 sm:grid-cols-2">
            {topList.map((calc) => {
              const Icon = CALC_ICONS[calc.slug];
              return (
                <li key={calc.slug}>
                  <div className="flex items-center gap-4 rounded-xl bg-card px-4 py-4 shadow-border transition-colors duration-150 hover:bg-foreground/5">
                    <Link
                      to="/calc/$slug"
                      params={{ slug: calc.slug }}
                      className="flex min-h-20 flex-1 items-center gap-4"
                    >
                      {Icon ? <Icon className="size-5 shrink-0" strokeWidth={1.75} /> : null}
                      <span className="flex min-w-0 flex-col">
                        <span className="font-display text-xl font-semibold tracking-tight">
                          {calc.name}
                        </span>
                        <span className="text-sm text-muted">{calc.short}</span>
                      </span>
                    </Link>
                    <button
                      aria-pressed={favorites.includes(calc.slug)}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleFavorite(calc.slug);
                      }}
                      className={cn(
                        "ml-3 h-9 w-9 inline-flex items-center justify-center transition-colors",
                        favorites.includes(calc.slug) ? "text-foreground" : "text-muted hover:text-foreground/80",
                      )}
                      title={favorites.includes(calc.slug) ? "Unfavorite" : "Favorite"}
                    >
                      <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 17.3l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2.5l3.08 6.25L22 9.76l-5.02 4.9 1.18 6.88L12 17.3z" fill={favorites.includes(calc.slug) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <section className="flex flex-col gap-8">
        {grouped.map((group) => (
          <div key={group.cat} className="flex flex-col gap-2">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              {group.cat}
            </h2>
            <ul className="divide-y divide-border rounded-xl bg-card shadow-border">
              {group.items.map((calc) => {
                const Icon = CALC_ICONS[calc.slug];
                return (
                  <li key={calc.slug}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.03]">
                      <Link
                        to="/calc/$slug"
                        params={{ slug: calc.slug }}
                        className="flex min-h-14 flex-1 items-center gap-3"
                      >
                        {Icon ? (
                          <Icon className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
                        ) : null}
                        <span className="flex-1 font-medium">{calc.name}</span>
                        <span className="hidden text-sm text-muted sm:inline">{calc.short}</span>
                      </Link>
                      <button
                        aria-pressed={favorites.includes(calc.slug)}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          toggleFavorite(calc.slug);
                        }}
                        className={cn(
                          "ml-3 h-9 w-9 inline-flex items-center justify-center transition-colors",
                          favorites.includes(calc.slug) ? "text-foreground" : "text-muted hover:text-foreground/80",
                        )}
                        title={favorites.includes(calc.slug) ? "Unfavorite" : "Favorite"}
                      >
                        <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 17.3l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2.5l3.08 6.25L22 9.76l-5.02 4.9 1.18 6.88L12 17.3z" fill={favorites.includes(calc.slug) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
