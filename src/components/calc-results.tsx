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
  const hasOrder = (output.order?.length ?? 0) > 0;

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
      () => toast.success(hasOrder ? "Takeoff copied" : "Result copied"),
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-border">
        <div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Result</p>
            <p className="mt-2 font-display text-xl font-semibold tracking-tight text-foreground">
              {output.headline}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4 no-print">
            <Button className="flex-none" type="button" variant="secondary" onClick={save} disabled={empty} size="sm">
              <Save />
              Save job
            </Button>
            <Button className="flex-none" type="button" variant="secondary" onClick={copyOrder} disabled={empty} size="sm">
              <Copy />
              {hasOrder ? "Copy takeoff" : "Copy result"}
            </Button>
            <Button className="flex-none" type="button" variant="secondary" onClick={onReset} size="sm" title="Reset inputs">
              <RotateCcw />
              Reset
            </Button>
          </div>
        </div>

        {output.flags && output.flags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {output.flags.map((flag) => (
              <Badge key={flag.text} variant={flag.tone === "ok" ? "ok" : flag.tone === "warn" ? "warn" : "bad"}>
                {flag.tone === "ok" ? <Check className="mr-1 size-3" /> : null}
                {flag.text}
              </Badge>
            ))}
          </div>
        ) : null}

        {output.kpis.length > 0 ? (
          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {output.kpis.map((kpi) => (
              <div key={kpi.label} className="px-3 py-3">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{kpi.label}</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums">{kpi.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {output.diagram ? <div className="mt-4"><CalcDiagram spec={output.diagram} /></div> : null}

        {output.order && output.order.length > 0 ? (
          <div className="mt-4 border-t border-border pt-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">Order list</h3>
            <ul className="mt-2">
              {output.order.map((row) => (
                <li key={row.item} className="flex items-baseline justify-between gap-4 py-2 border-b border-border/70 last:border-0">
                  <span className="text-sm">{row.item}</span>
                  <span className="font-mono text-sm tabular-nums">{row.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {output.sections.map((section) => (
          <div key={section.title} className="mt-4 border-t border-border pt-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">{section.title}</h3>
            <ul className="mt-2">
              {section.rows.map((row) => (
                <li key={row.label} className="flex flex-col gap-0.5 py-2 border-b border-border/70 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
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
                    {row.hint ? <span className="text-xs text-subtle">{row.hint}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {output.notes.length > 0 ? (
          <div className="mt-4 text-sm text-muted">
            <ul className="flex flex-col gap-2">
              {output.notes.map((note) => (
                <li key={note} className="leading-relaxed">{note}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

