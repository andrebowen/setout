import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatM,
  formatMm,
  formatNumber,
  num,
  str,
  countInclusive,
} from "./format.ts";

export const balustradeFields: Field[] = [
  { kind: "section", label: "Run" },
  {
    kind: "number",
    key: "length",
    label: "Length",
    unit: "m",
    defaultValue: 8,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "height",
    label: "Height",
    unit: "m",
    defaultValue: 1,
    min: 0.4,
    step: 0.01,
    presets: [
      { label: "865", value: 0.865 },
      { label: "1000", value: 1 },
      { label: "1100", value: 1.1 },
    ],
    hint: "1.0 m typical on decks with a fall over 1 m",
  },
  {
    kind: "number",
    key: "postSpacing",
    label: "Max post centres",
    unit: "mm",
    defaultValue: 1200,
    min: 400,
    step: 50,
    presets: [
      { label: "900", value: 900 },
      { label: "1200", value: 1200 },
      { label: "1500", value: 1500 },
      { label: "1800", value: 1800 },
    ],
  },
  { kind: "section", label: "Infill" },
  {
    kind: "select",
    key: "infill",
    label: "Infill",
    defaultValue: "verticals",
    options: [
      { value: "verticals", label: "Vertical balusters" },
      { value: "glass", label: "Glass panels" },
      { value: "wire", label: "Wire / cable" },
      { value: "rails", label: "Horizontal rails" },
    ],
  },
  {
    kind: "number",
    key: "maxGap",
    label: "Max opening",
    unit: "mm",
    defaultValue: 125,
    min: 20,
    step: 1,
    hint: "125 mm sphere rule is the usual domestic limit",
    showWhen: { key: "infill", in: ["verticals", "rails"] },
  },
  {
    kind: "number",
    key: "balusterWidth",
    label: "Baluster width",
    unit: "mm",
    defaultValue: 40,
    min: 8,
    step: 1,
    showWhen: { key: "infill", in: ["verticals"] },
  },
  {
    kind: "number",
    key: "glassWidth",
    label: "Glass panel width",
    unit: "mm",
    defaultValue: 1000,
    min: 300,
    step: 10,
    showWhen: { key: "infill", in: ["glass"] },
  },
  {
    kind: "number",
    key: "wireSpacing",
    label: "Wire centres",
    unit: "mm",
    defaultValue: 80,
    min: 40,
    step: 5,
    showWhen: { key: "infill", in: ["wire"] },
  },
  {
    kind: "number",
    key: "railCount",
    label: "Rails (excl. handrail)",
    unit: "count",
    defaultValue: 3,
    min: 1,
    max: 8,
    step: 1,
    showWhen: { key: "infill", in: ["rails"] },
  },
];

export function computeBalustrade(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const height = num(inputs.height, 1);
  const postSpacing = num(inputs.postSpacing, 1200);
  const infill = str(inputs.infill, "verticals");
  const maxGap = num(inputs.maxGap, 125);
  const balusterWidth = num(inputs.balusterWidth, 40);
  const glassWidth = num(inputs.glassWidth, 1000);
  const wireSpacing = num(inputs.wireSpacing, 80);
  const railCount = num(inputs.railCount, 3);

  if (length <= 0) {
    return emptyOutput("Enter balustrade length");
  }

  const nPosts = countInclusive(length * 1000, postSpacing);
  const actualPost = nPosts > 1 ? (length * 1000) / (nPosts - 1) : 0;
  const bays = nPosts - 1;
  const bayM = length / bays;
  const handrail = length;
  const postLin = nPosts * height;

  const flags: CalcOutput["flags"] = [];
  if (height + 1e-6 < 1) {
    flags.push({
      tone: "warn",
      text: "Height under 1.0 m — check if this is a stair (often 865 mm) or a deck that needs 1000 mm.",
    });
  } else {
    flags.push({
      tone: "ok",
      text: "1.0 m+ is the usual minimum where the fall is more than 1 m.",
    });
  }

  const infillRows: CalcOutput["sections"][number]["rows"] = [];
  const order: CalcOutput["order"] = [
    { item: "Posts", qty: formatCount(nPosts, "pcs") },
    { item: "Handrail", qty: formatM(handrail, 2) },
  ];

  if (infill === "verticals") {
    const pitch = balusterWidth + maxGap;
    const perBay = Math.max(1, Math.ceil((bayM * 1000 - balusterWidth) / pitch - 1e-9));
    const nBalusters = perBay * bays;
    const actualGap =
      perBay > 0 ? (bayM * 1000 - perBay * balusterWidth) / (perBay + 1) : maxGap;
    infillRows.push(
      {
        label: "Balusters",
        value: formatCount(nBalusters, "pcs"),
        tone: "strong",
        hint: `${formatNumber(perBay, 0)} per bay`,
      },
      {
        label: "Opening (approx.)",
        value: formatMm(actualGap, 0),
        tone: actualGap <= maxGap + 0.5 ? "ok" : "warn",
        hint: `Target max ${formatMm(maxGap)}`,
      },
    );
    order.push({ item: "Balusters", qty: formatCount(nBalusters, "pcs") });
    if (actualGap > maxGap + 0.5) {
      flags.push({
        tone: "bad",
        text: `Opening ${formatMm(actualGap, 0)} exceeds the ${formatMm(maxGap)} limit — tighten centres.`,
      });
    }
  } else if (infill === "glass") {
    const nPanels = Math.max(bays, Math.ceil((length * 1000) / glassWidth - 1e-9));
    infillRows.push({
      label: "Glass panels",
      value: formatCount(nPanels, "pcs"),
      tone: "strong",
      hint: `Aim ${formatMm(glassWidth)} wide · ${formatM(height, 2)} high. Confirm clamps / spigots.`,
    });
    order.push({
      item: `Glass ${formatMm(glassWidth)} × ${formatM(height, 2)}`,
      qty: formatCount(nPanels, "pcs"),
    });
  } else if (infill === "wire") {
    const nWires = Math.max(1, Math.floor((height * 1000) / wireSpacing) + 1);
    const wireLin = nWires * length;
    infillRows.push(
      {
        label: "Wires",
        value: formatCount(nWires, "runs"),
        tone: "strong",
        hint: `@ ${formatMm(wireSpacing)} centres`,
      },
      { label: "Wire linear", value: formatM(wireLin, 2) },
    );
    order.push({ item: "Wire / cable", qty: `${formatCount(nWires, "runs")} · ${formatM(wireLin, 2)}` });
    if (wireSpacing > 125) {
      flags.push({
        tone: "warn",
        text: "Wire centres over 125 mm may fail the sphere test — check the system.",
      });
    }
  } else {
    const railLin = railCount * length;
    infillRows.push({
      label: "Infill rails",
      value: `${formatNumber(railCount, 0)} × ${formatM(length, 2)}`,
      tone: "strong",
      hint: formatM(railLin, 2),
    });
    order.push({ item: "Infill rails", qty: formatM(railLin, 2) });
  }

  return {
    headline: `${formatCount(nPosts, "posts")} · ${formatM(handrail, 2)} handrail`,
    kpis: [
      { label: "Posts", value: formatNumber(nPosts, 0) },
      { label: "Centres", value: formatMm(actualPost, 0) },
      { label: "Handrail", value: formatM(handrail, 2) },
      { label: "Height", value: formatM(height, 2) },
    ],
    flags,
    sections: [
      {
        title: "Posts & rail",
        rows: [
          {
            label: "Posts",
            value: formatCount(nPosts, "pcs"),
            tone: "strong",
            hint: `${formatNumber(bays, 0)} bays @ ${formatMm(actualPost, 0)}`,
          },
          { label: "Post height (allow)", value: formatM(height, 2) },
          { label: "Post linear", value: formatM(postLin, 2) },
          { label: "Handrail", value: formatM(handrail, 2), tone: "strong" },
        ],
      },
      { title: "Infill", rows: infillRows },
    ],
    order,
    notes: [
      "Typical domestic: 1000 mm high where the fall exceeds 1 m; 865 mm beside stairs. Openings usually must not pass a 125 mm sphere.",
      "Post centres are a max — the run is divided evenly so both ends land on a post.",
      "Confirm the system (load, fixings, glass thickness) with the manufacturer and the drawing.",
    ],
    diagram: {
      type: "balustrade",
      length,
      height,
      nPosts,
      infill,
    },
  };
}
