import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { isFieldVisible, type Field, type Inputs, type NumberField } from "@/lib/calc";
import { cn } from "@/lib/utils";

const UNIT_LABEL: Record<string, string> = {
  m: "m",
  mm: "mm",
  "%": "%",
  deg: "°",
  count: "qty",
  m2: "m²",
  m3: "m³",
  L: "L",
  kg: "kg",
};

export function CalcForm({
  fields,
  inputs,
  onChange,
}: {
  fields: Field[];
  inputs: Inputs;
  onChange: (next: Inputs) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, i) => {
        if (!isFieldVisible(field, inputs)) return null;
        if (field.kind === "section") {
          return (
            <h2
              key={`s-${field.label}-${i}`}
              className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted"
            >
              {field.label}
            </h2>
          );
        }
        if (field.kind === "select") {
          return (
            <label key={field.key} className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">{field.label}</span>
              <select
                className="h-11 w-full rounded-md border border-border bg-card px-3 text-base shadow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                value={String(inputs[field.key] ?? field.defaultValue)}
                onChange={(e) => onChange({ ...inputs, [field.key]: e.target.value })}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {field.hint ? <span className="text-xs text-muted">{field.hint}</span> : null}
            </label>
          );
        }
        return (
          <NumberFieldControl
            key={field.key}
            field={field}
            value={Number(inputs[field.key] ?? field.defaultValue)}
            onChange={(n) => onChange({ ...inputs, [field.key]: n })}
          />
        );
      })}
    </div>
  );
}

function NumberFieldControl({
  field,
  value,
  onChange,
}: {
  field: NumberField;
  value: number;
  onChange: (n: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={field.key} className="text-sm font-medium">
          {field.label}
        </label>
        <span className="font-mono text-[11px] uppercase tracking-wider text-subtle">
          {UNIT_LABEL[field.unit] ?? field.unit}
        </span>
      </div>
      <Input
        id={field.key}
        inputMode="decimal"
        autoComplete="off"
        value={text}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => {
          const t = e.target.value;
          setText(t);
          if (t.trim() === "" || t === "-" || t.endsWith(".") || t.endsWith(",")) return;
          const n = Number(t.replace(",", "."));
          if (Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => {
          const n = Number(text.replace(",", "."));
          if (Number.isFinite(n)) {
            onChange(n);
            setText(String(n));
          } else {
            setText(String(value));
          }
        }}
        className="font-mono tabular-nums"
      />
      {field.presets && field.presets.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {field.presets.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={cn(
                "h-8 rounded-full border px-2.5 font-mono text-xs transition-colors duration-150",
                value === p.value
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border text-muted hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}
      {field.hint ? <p className="text-xs text-muted">{field.hint}</p> : null}
    </div>
  );
}
