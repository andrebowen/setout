import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatM,
  formatMm,
  formatNumber,
  num,
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
  const wallHeight = num(inputs.wallHeight, 2.4);
  const studSpacing = num(inputs.studSpacing, 450);
  const plateThickness = num(inputs.plateThickness, 35);
  const topPlates = Math.max(1, Math.round(num(inputs.topPlates, 2)));
  const nogRows = Math.max(0, Math.round(num(inputs.nogRows, 1)));
  const doors = Math.max(0, Math.round(num(inputs.doors, 0)));
  const windows = Math.max(0, Math.round(num(inputs.windows, 0)));

  if (wallLength <= 0 || wallHeight <= 0) {
    return emptyOutput("Enter wall length and height");
  }

  const nStuds = countInclusive(wallLength * 1000, studSpacing);
  const actual = nStuds > 1 ? (wallLength * 1000) / (nStuds - 1) : 0;
  const extra = doors * 2 + windows * 2;
  const studsTotal = nStuds + extra;
  const plateCount = 1 + topPlates;
  const plateLin = plateCount * wallLength;
  const studLength = Math.max(0.3, wallHeight - (plateCount * plateThickness) / 1000);
  const studLin = studsTotal * studLength;
  const nogLin = nogRows * wallLength;
  const lintels = doors + windows;

  return {
    headline: `${formatCount(studsTotal, "studs")} @ ${formatMm(actual, 0)} · ${formatM(studLength, 3)} long`,
    kpis: [
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
          {
            label: "Stud length",
            value: formatM(studLength, 3),
            tone: "strong",
            hint: `Height minus ${formatNumber(plateCount, 0)} × ${formatMm(plateThickness)} plates`,
          },
          { label: "Stud linear", value: formatM(studLin, 2) },
        ],
      },
      {
        title: "Plates & nogs",
        rows: [
          {
            label: "Plates",
            value: `${formatNumber(plateCount, 0)} × ${formatM(wallLength, 2)}`,
            tone: "strong",
            hint: "1 bottom + top plates",
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
      { item: `Studs @ ${formatM(studLength, 3)}`, qty: formatCount(studsTotal, "pcs") },
      { item: "Plates", qty: formatM(plateLin, 2) },
      { item: "Noggins", qty: formatM(nogLin, 2) },
      { item: "Lintels", qty: formatCount(lintels, "pcs") },
    ],
    notes: [
      "Does not include bracing, trimmers, cripples above/below windows, or a second stud at intersecting walls.",
      "Add 10% extra studs on a messy wall, or count every opening off the drawing.",
    ],
  };
}
