import { Check, Copy, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { CalcDiagram } from "@/components/calc-diagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalcOutput, Calculator, Inputs } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CalcResults({
  calc,
  inputs,
  output,
  onReset,
}: {
  calc: Calculator;
  inputs: Inputs;
  output: CalcOutput;
  onReset: () => void;
}) {
  const saveJob = useStore((s) => s.saveJob);

  function copyOrder() {
    const lines = [
      `SETOUT — ${calc.name}`,
      output.headline,
      "",
      ...(output.order ?? []).map((row) => `${row.item}\t${row.qty}`),
      "",
      ...output.sections.flatMap((sec) => [
        sec.title.toUpperCase(),
        ...sec.rows.map((r) => `${r.label}\t${r.value}`),
        "",
      ]),
    ];
    void navigator.clipboard.writeText(lines.join("\n")).then(
      () => toast.success("Takeoff copied"),
      () => toast.error("Could not copy"),
    );
  }

  function save() {
    const name = `${calc.name} · ${new Date().toLocaleDateString("en-AU")}`;
    saveJob({ name, slug: calc.slug, inputs, headline: output.headline });
    toast.success("Saved to Jobs");
  }

  const empty = output.sections.length === 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2 no-print">
        <Button type="button" onClick={copyOrder} disabled={empty} size="sm">
          <Copy />
          Copy takeoff
        </Button>
        <Button type="button" variant="secondary" onClick={save} disabled={empty} size="sm">
          <Save />
          Save job
        </Button>
        <Button type="button" variant="ghost" onClick={onReset} size="sm">
          <RotateCcw />
          Reset
        </Button>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Result</p>
        <p className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {output.headline}
        </p>
      </div>

      {output.flags && output.flags.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {output.flags.map((flag) => (
            <li key={flag.text}>
              <Badge variant={flag.tone === "ok" ? "ok" : flag.tone === "warn" ? "warn" : "bad"}>
                {flag.tone === "ok" ? <Check className="mr-1 size-3" /> : null}
                {flag.text}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {output.kpis.length > 0 ? (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {output.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl bg-card px-3 py-3 shadow-border"
            >
              <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{kpi.label}</dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">{kpi.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {output.diagram ? <CalcDiagram spec={output.diagram} /> : null}

      {output.order && output.order.length > 0 ? (
        <section className="overflow-hidden rounded-xl bg-card shadow-border">
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
              Order list
            </h2>
          </header>
          <ul>
            {output.order.map((row) => (
              <li
                key={row.item}
                className="flex items-baseline justify-between gap-4 border-b border-border/70 px-4 py-2.5 last:border-0"
              >
                <span className="text-sm">{row.item}</span>
                <span className="font-mono text-sm tabular-nums">{row.qty}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {output.sections.map((section) => (
        <section
          key={section.title}
          className="overflow-hidden rounded-xl bg-card shadow-border"
        >
          <header className="border-b border-border px-4 py-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
              {section.title}
            </h2>
          </header>
          <ul>
            {section.rows.map((row) => (
              <li
                key={row.label}
                className="flex flex-col gap-0.5 border-b border-border/70 px-4 py-2.5 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="text-sm text-muted">{row.label}</span>
                <span className="flex flex-col items-start sm:items-end">
                  <span
                    className={cn(
                      "font-mono text-sm tabular-nums",
                      row.tone === "strong" && "font-medium text-foreground",
                      row.tone === "ok" && "text-ok",
                      row.tone === "warn" && "text-warn",
                    )}
                  >
                    {row.value}
                  </span>
                  {row.hint ? (
                    <span className="text-xs text-subtle">{row.hint}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {output.notes.length > 0 ? (
        <ul className="flex flex-col gap-2 text-sm text-muted">
          {output.notes.map((note) => (
            <li key={note} className="leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
