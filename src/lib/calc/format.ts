export function num(v: number | string | undefined, fallback = 0): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export function str(v: number | string | undefined, fallback = ""): string {
  if (typeof v === "string" && v.length > 0) return v;
  if (typeof v === "number") return String(v);
  return fallback;
}

export function roundTo(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export function ceilTo(n: number, step: number): number {
  if (step <= 0) return n;
  return Math.ceil(n / step - 1e-9) * step;
}

export function formatNumber(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-AU", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatMm(n: number, digits = 0): string {
  return `${formatNumber(n, digits)} mm`;
}

export function formatM(n: number, digits = 3): string {
  return `${formatNumber(n, digits)} m`;
}

export function formatM2(n: number, digits = 2): string {
  return `${formatNumber(n, digits)} m²`;
}

export function formatM3(n: number, digits = 3): string {
  return `${formatNumber(n, digits)} m³`;
}

export function formatL(n: number, digits = 1): string {
  return `${formatNumber(n, digits)} L`;
}

export function formatKg(n: number, digits = 0): string {
  return `${formatNumber(n, digits)} kg`;
}

export function formatDeg(n: number, digits = 1): string {
  return `${formatNumber(n, digits)}°`;
}

export function formatCount(n: number, unit: string): string {
  const rounded = Math.round(n);
  return `${formatNumber(rounded, 0)} ${unit}`;
}

export function countInclusive(lengthMm: number, spacingMm: number): number {
  if (spacingMm <= 0 || lengthMm <= 0) return 2;
  return Math.max(2, Math.ceil(lengthMm / spacingMm - 1e-9) + 1);
}

export function mmToM(mm: number): number {
  return mm / 1000;
}

export function mToMm(m: number): number {
  return m * 1000;
}

export function emptyOutput(message: string): {
  headline: string;
  kpis: [];
  sections: [];
  notes: string[];
  order: [];
  flags: [];
} {
  return {
    headline: message,
    kpis: [],
    sections: [],
    notes: [],
    order: [],
    flags: [],
  };
}
