import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CalcForm } from "@/components/calc-form";
import { CalcResults } from "@/components/calc-results";
import { CALC_ICONS } from "@/components/calc-icons";
import { defaultsFor, getCalculator, type Inputs } from "@/lib/calc";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/calc/$slug")({
  component: CalcPage,
});

function CalcPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const calc = getCalculator(slug);
  const hydrated = useStore((s) => s.hydrated);
  const saved = useStore((s) => s.inputsBySlug[slug]);
  const setInputsStore = useStore((s) => s.setInputs);
  const touchRecent = useStore((s) => s.touchRecent);

  const defaults = useMemo(() => (calc ? defaultsFor(calc.fields) : {}), [calc]);
  const [inputs, setInputs] = useState<Inputs>(saved ?? defaults);

  useEffect(() => {
    if (!calc) {
      void navigate({ to: "/" });
      return;
    }
    touchRecent(calc.slug);
  }, [calc, navigate, touchRecent]);

  useEffect(() => {
    if (!calc) return;
    if (hydrated && saved) setInputs({ ...defaults, ...saved });
    else setInputs(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per slug/hydrate
  }, [slug, hydrated]);

  useEffect(() => {
    if (!calc) return;
    const t = window.setTimeout(() => setInputsStore(calc.slug, inputs), 200);
    return () => window.clearTimeout(t);
  }, [calc, inputs, setInputsStore]);

  if (!calc) return null;

  const output = calc.compute(inputs);
  const Icon = CALC_ICONS[calc.slug];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="inline-flex h-11 w-fit items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All calculators
        </Link>
        <div className="flex items-start gap-3">
          {Icon ? <Icon className="mt-1 size-6 shrink-0" strokeWidth={1.75} /> : null}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {calc.category}
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">{calc.name}</h1>
            <p className="mt-1 text-muted">{calc.short}</p>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="rounded-xl bg-card p-4 shadow-border lg:sticky lg:top-20">
          <CalcForm fields={calc.fields} inputs={inputs} onChange={setInputs} />
        </div>
        <CalcResults
          calc={calc}
          inputs={inputs}
          output={output}
          onReset={() => setInputs(defaults)}
        />
      </div>
    </div>
  );
}
