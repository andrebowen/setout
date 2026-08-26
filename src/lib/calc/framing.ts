import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatDeg,
  formatM,
  formatMm,
  formatNumber,
  num,
  str,
  countInclusive,
} from "./format.ts";

export const framingFields: Field[] = [
  { kind: "section", label: "Wall" },
  {
    kind: "number",
    key: "wallLength",
    label: "Wall length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
  },
  {
    kind: "select",
    key: "wallType",
    label: "Wall type",
    defaultValue: "flat",
    options: [
      { value: "flat", label: "Flat" },
      { value: "raked", label: "Raked (studs step in length)" },
    ],
  },
  {
    kind: "number",
    key: "wallHeight",
    label: "Finished height",
    unit: "m",
    defaultValue: 2.4,
    min: 1,
    step: 0.05,
    presets: [
      { label: "2.4", value: 2.4 },
      { label: "2.7", value: 2.7 },
      { label: "3.0", value: 3.0 },
    ],
    showWhen: { key: "wallType", in: ["flat"] },
  },
  {
    kind: "number",
    key: "lowHeight",
    label: "Low end height",
    unit: "m",
    defaultValue: 2.4,
    min: 1,
    step: 0.05,
    showWhen: { key: "wallType", in: ["raked"] },
  },
  {
    kind: "number",
    key: "highHeight",
    label: "High end height",
    unit: "m",
    defaultValue: 3.6,
    min: 1,
    step: 0.05,
    showWhen: { key: "wallType", in: ["raked"] },
  },
  {
    kind: "number",
    key: "studSpacing",
    label: "Stud centres",
    unit: "mm",
    defaultValue: 450,
    min: 300,
    step: 10,
    presets: [
      { label: "450", value: 450 },
      { label: "600", value: 600 },
    ],
  },
  {
    kind: "number",
    key: "plateThickness",
    label: "Plate thickness",
    unit: "mm",
    defaultValue: 35,
    min: 19,
    step: 1,
    presets: [
      { label: "35", value: 35 },
      { label: "45", value: 45 },
      { label: "70", value: 70 },
    ],
  },
  {
    kind: "number",
    key: "topPlates",
    label: "Top plates",
    unit: "count",
    defaultValue: 2,
    min: 1,
    max: 3,
    step: 1,
  },
  {
    kind: "number",
    key: "nogRows",
    label: "Noggin rows",
    unit: "count",
    defaultValue: 1,
    min: 0,
    max: 3,
    step: 1,
  },
  { kind: "section", label: "Openings (extra studs)" },
  {
    kind: "number",
    key: "doors",
    label: "Doors",
    unit: "count",
    defaultValue: 1,
    min: 0,
    step: 1,
    hint: "Adds 2 jack studs each",
  },
  {
    kind: "number",
    key: "windows",
    label: "Windows",
    unit: "count",
    defaultValue: 1,
    min: 0,
    step: 1,
    hint: "Adds 2 jack studs each",
  },
];

export function computeFraming(inputs: Inputs): CalcOutput {
  const wallLength = num(inputs.wallLength);
  const wallType = str(inputs.wallType, "flat");
  const raked = wallType === "raked";
  const lowHeight = num(inputs.lowHeight, 2.4);
  const highHeight = num(inputs.highHeight, 3.6);
  const wallHeight = raked ? highHeight : num(inputs.wallHeight, 2.4);
  const studSpacing = num(inputs.studSpacing, 450);
  const plateThickness = num(inputs.plateThickness, 35);
  const topPlates = Math.max(1, Math.round(num(inputs.topPlates, 2)));
  const nogRows = Math.max(0, Math.round(num(inputs.nogRows, 1)));
  const doors = Math.max(0, Math.round(num(inputs.doors, 0)));
  const windows = Math.max(0, Math.round(num(inputs.windows, 0)));

  if (wallLength <= 0 || wallHeight <= 0 || (raked && lowHeight <= 0)) {
    return emptyOutput(raked ? "Enter wall length and both heights" : "Enter wall length and height");
  }

  const nStuds = countInclusive(wallLength * 1000, studSpacing);
  const actual = nStuds > 1 ? (wallLength * 1000) / (nStuds - 1) : 0;
  const extra = doors * 2 + windows * 2;
  const studsTotal = nStuds + extra;
  const plateCount = 1 + topPlates;
  const plateAllow = (plateCount * plateThickness) / 1000;
  const plateLin = plateCount * wallLength;
  const nogLin = nogRows * wallLength;
  const lintels = doors + windows;

  // Flat: every stud is the same length. Raked: length steps evenly from the
  // low end to the high end across the run, following the rake line.
  const studLength = raked
    ? (lowHeight + highHeight) / 2 - plateAllow
    : Math.max(0.3, wallHeight - plateAllow);
  const shortestStud = raked ? Math.max(0.3, lowHeight - plateAllow) : studLength;
  const tallestStud = raked ? Math.max(0.3, highHeight - plateAllow) : studLength;
  const rakeAngle = raked ? Math.atan((highHeight - lowHeight) / wallLength) * (180 / Math.PI) : 0;
  const studLin = raked
    ? (nStuds / 2) * (shortestStud + tallestStud) + extra * studLength
    : studsTotal * studLength;
  const stepPerStud =
    raked && nStuds > 1 ? ((tallestStud - shortestStud) * 1000) / (nStuds - 1) : 0;

  return {
    headline: raked
      ? `${formatCount(studsTotal, "studs")} @ ${formatMm(actual, 0)} · ${formatM(shortestStud, 3)}–${formatM(tallestStud, 3)} raked`
      : `${formatCount(studsTotal, "studs")} @ ${formatMm(actual, 0)} · ${formatM(studLength, 3)} long`,
    kpis: raked
      ? [
          { label: "Studs", value: formatNumber(studsTotal, 0) },
          { label: "Centres", value: formatMm(actual, 0) },
          { label: "Length range", value: `${formatM(shortestStud, 3)}–${formatM(tallestStud, 3)}` },
          { label: "Rake", value: formatDeg(rakeAngle) },
        ]
      : [
          { label: "Studs", value: formatNumber(studsTotal, 0) },
          { label: "Centres", value: formatMm(actual, 0) },
          { label: "Stud length", value: formatM(studLength, 3) },
          { label: "Plates", value: formatM(plateLin, 2) },
        ],
    sections: [
      {
        title: "Studs",
        rows: [
          {
            label: "Studs in the run",
            value: formatCount(nStuds, "pcs"),
            hint: `Set out ${formatMm(actual, 0)} centres`,
          },
          {
            label: "Extra for openings",
            value: formatCount(extra, "pcs"),
            hint: `${formatNumber(doors, 0)} doors + ${formatNumber(windows, 0)} windows × 2 jacks`,
          },
          { label: "Studs to cut", value: formatCount(studsTotal, "pcs"), tone: "strong" },
          raked
            ? {
                label: "Stud lengths",
                value: `${formatM(shortestStud, 3)} to ${formatM(tallestStud, 3)}`,
                tone: "strong",
                hint: "Every stud is a different length on a raked wall — mark and cut individually",
              }
            : {
                label: "Stud length",
                value: formatM(studLength, 3),
                tone: "strong",
                hint: `Height minus ${formatNumber(plateCount, 0)} × ${formatMm(plateThickness)} plates`,
              },
          { label: "Stud linear (allow)", value: formatM(studLin, 2) },
        ],
      },
      ...(raked
        ? [
            {
              title: "Raked studs",
              rows: [
                { label: "Low end stud", value: formatM(shortestStud, 3) },
                { label: "High end stud", value: formatM(tallestStud, 3), tone: "strong" as const },
                {
                  label: "Step per stud",
                  value: formatMm(stepPerStud, 1),
                  hint: `Each stud ${formatMm(stepPerStud, 1)} longer than the last, low to high`,
                },
                {
                  label: "Rake angle (top plate bevel)",
                  value: formatDeg(rakeAngle),
                  hint: "Angle of the top plate off level — set the saw to this for the rip bevel",
                },
              ],
            },
          ]
        : []),
      {
        title: "Plates & nogs",
        rows: [
          {
            label: "Plates",
            value: `${formatNumber(plateCount, 0)} × ${formatM(wallLength, 2)}`,
            tone: "strong",
            hint: raked ? "1 bottom + top plates — top plate is rip-cut to the rake" : "1 bottom + top plates",
          },
          { label: "Plate linear", value: formatM(plateLin, 2) },
          {
            label: "Noggins",
            value: formatM(nogLin, 2),
            hint: `${formatNumber(nogRows, 0)} row${nogRows === 1 ? "" : "s"} — cut between studs`,
          },
          { label: "Lintels (allow)", value: formatCount(lintels, "pcs") },
        ],
      },
    ],
    order: [
      raked
        ? { item: "Studs (raked, individually cut)", qty: formatCount(studsTotal, "pcs") }
        : { item: `Studs @ ${formatM(studLength, 3)}`, qty: formatCount(studsTotal, "pcs") },
      { item: "Plates", qty: formatM(plateLin, 2) },
      { item: "Noggins", qty: formatM(nogLin, 2) },
      { item: "Lintels", qty: formatCount(lintels, "pcs") },
    ],
    notes: [
      "Does not include bracing, trimmers, cripples above/below windows, or a second stud at intersecting walls.",
      "Add 10% extra studs on a messy wall, or count every opening off the drawing.",
      ...(raked
        ? [
            "Raked stud lengths step evenly between the low and high end — measure and mark each one off the top plate rather than cutting to a single length.",
          ]
        : []),
    ],
  };
}
