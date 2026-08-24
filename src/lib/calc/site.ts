import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatM,
  formatM2,
  formatM3,
  formatMm,
  formatNumber,
  num,
  str,
  countInclusive,
} from "./format.ts";

export const fencingFields: Field[] = [
  {
    kind: "number",
    key: "length",
    label: "Run length",
    unit: "m",
    defaultValue: 20,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "height",
    label: "Height",
    unit: "m",
    defaultValue: 1.8,
    min: 0.6,
    step: 0.05,
    presets: [
      { label: "1.5", value: 1.5 },
      { label: "1.8", value: 1.8 },
      { label: "2.1", value: 2.1 },
    ],
  },
  {
    kind: "number",
    key: "postSpacing",
    label: "Max post centres",
    unit: "mm",
    defaultValue: 2400,
    min: 1200,
    step: 50,
    presets: [
      { label: "1800", value: 1800 },
      { label: "2400", value: 2400 },
      { label: "2700", value: 2700 },
    ],
  },
  {
    kind: "number",
    key: "palingWidth",
    label: "Paling width",
    unit: "mm",
    defaultValue: 100,
    min: 50,
    step: 5,
  },
  {
    kind: "number",
    key: "palingGap",
    label: "Paling gap",
    unit: "mm",
    defaultValue: 10,
    min: 0,
    step: 1,
  },
  {
    kind: "number",
    key: "railCount",
    label: "Rails",
    unit: "count",
    defaultValue: 3,
    min: 2,
    max: 4,
    step: 1,
  },
  {
    kind: "select",
    key: "gate",
    label: "Gate",
    defaultValue: "none",
    options: [
      { value: "none", label: "No gate" },
      { value: "single", label: "Single gate" },
      { value: "double", label: "Double gate" },
    ],
  },
  {
    kind: "number",
    key: "gateWidth",
    label: "Gate opening",
    unit: "m",
    defaultValue: 0.9,
    min: 0.7,
    step: 0.05,
    showWhen: { key: "gate", in: ["single", "double"] },
  },
];

export function computeFencing(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const height = num(inputs.height, 1.8);
  const postSpacing = num(inputs.postSpacing, 2400);
  const palingWidth = num(inputs.palingWidth, 100);
  const palingGap = num(inputs.palingGap, 10);
  const railCount = Math.max(2, Math.round(num(inputs.railCount, 3)));
  const gate = str(inputs.gate, "none");
  const gateWidth = num(inputs.gateWidth, 0.9);

  if (length <= 0) {
    return emptyOutput("Enter fence length");
  }

  const nPosts = countInclusive(length * 1000, postSpacing);
  const actual = nPosts > 1 ? (length * 1000) / (nPosts - 1) : 0;
  const cover = (palingWidth + palingGap) / 1000;
  const nPalings = Math.max(1, Math.ceil(length / cover - 1e-9));
  const railLin = railCount * length;
  const extraGatePosts = gate === "none" ? 0 : gate === "double" ? 1 : 0;
  const postsTotal = nPosts + extraGatePosts;
  const gateNote =
    gate === "none"
      ? "No gate"
      : `${gate === "double" ? "Double" : "Single"} @ ${formatM(gateWidth, 2)}`;

  return {
    headline: `${formatCount(postsTotal, "posts")} · ${formatCount(nPalings, "palings")}`,
    kpis: [
      { label: "Posts", value: formatNumber(postsTotal, 0) },
      { label: "Centres", value: formatMm(actual, 0) },
      { label: "Palings", value: formatNumber(nPalings, 0) },
      { label: "Rails", value: formatM(railLin, 2) },
    ],
    sections: [
      {
        title: "Posts & rails",
        rows: [
          {
            label: "Posts",
            value: formatCount(postsTotal, "pcs"),
            tone: "strong",
            hint: `Set out ${formatMm(actual, 0)} · ${gate === "none" ? "ends included" : "plus gate post"}`,
          },
          {
            label: "Post length (allow)",
            value: formatM(height + 0.6, 2),
            hint: "Height + 600 mm in the ground",
          },
          {
            label: "Rails",
            value: `${formatNumber(railCount, 0)} × ${formatM(length, 2)}`,
            tone: "strong",
          },
          { label: "Gate", value: gateNote },
        ],
      },
      {
        title: "Palings",
        rows: [
          {
            label: "Palings",
            value: formatCount(nPalings, "pcs"),
            tone: "strong",
            hint: `${formatMm(palingWidth)} + ${formatMm(palingGap)} gap`,
          },
          { label: "Paling height", value: formatM(height, 2) },
        ],
      },
    ],
    order: [
      { item: `Posts @ ${formatM(height + 0.6, 2)}`, qty: formatCount(postsTotal, "pcs") },
      { item: "Rails", qty: formatM(railLin, 2) },
      { item: `Palings ${formatMm(palingWidth)}`, qty: formatCount(nPalings, "pcs") },
    ],
    notes: [
      "Post length allows 600 mm in the ground — check soil and wind.",
      "A double gate usually wants a drop bolt and an extra post.",
    ],
  };
}

export const brickFields: Field[] = [
  {
    kind: "number",
    key: "wallLength",
    label: "Wall length",
    unit: "m",
    defaultValue: 8,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "wallHeight",
    label: "Wall height",
    unit: "m",
    defaultValue: 2.4,
    min: 0,
    step: 0.05,
  },
  {
    kind: "number",
    key: "openings",
    label: "Openings",
    unit: "m2",
    defaultValue: 2,
    min: 0,
    step: 0.1,
  },
  {
    kind: "select",
    key: "leaf",
    label: "Leaf",
    defaultValue: "single",
    options: [
      { value: "single", label: "Single skin (stretcher)" },
      { value: "double", label: "Double skin" },
    ],
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 5,
    min: 0,
    max: 20,
    step: 1,
  },
];

export function computeBrick(inputs: Inputs): CalcOutput {
  const wallLength = num(inputs.wallLength);
  const wallHeight = num(inputs.wallHeight);
  const openings = num(inputs.openings);
  const leaf = str(inputs.leaf, "single");
  const waste = num(inputs.waste, 5);

  if (wallLength <= 0 || wallHeight <= 0) {
    return emptyOutput("Enter wall length and height");
  }

  const area = Math.max(0, wallLength * wallHeight - openings);
  const perM2 = leaf === "double" ? 100 : 50;
  const nNet = area * perM2;
  const nOrder = Math.ceil(nNet * (1 + waste / 100) - 1e-9);
  const mortarM3 = area * (leaf === "double" ? 0.06 : 0.03);
  const cementBags = Math.ceil(nOrder / 100 - 1e-9);

  return {
    headline: `${formatCount(nOrder, "bricks")} · ${formatM2(area)}`,
    kpis: [
      { label: "Area", value: formatM2(area) },
      { label: "Bricks", value: formatNumber(nOrder, 0) },
      { label: "Mortar", value: formatM3(mortarM3, 3) },
      { label: "Per m²", value: formatNumber(perM2, 0) },
    ],
    sections: [
      {
        title: "Bricks",
        rows: [
          { label: "Gross wall", value: formatM2(wallLength * wallHeight) },
          { label: "Openings", value: formatM2(openings) },
          { label: "Net area", value: formatM2(area), tone: "strong" },
          {
            label: "Bricks net",
            value: formatCount(nNet, "pcs"),
            hint: `${formatNumber(perM2, 0)} per m² · ${leaf === "double" ? "double" : "single"} skin`,
          },
          {
            label: `With ${formatNumber(waste, 0)}% waste`,
            value: formatCount(nOrder, "pcs"),
            tone: "strong",
          },
        ],
      },
      {
        title: "Mortar",
        rows: [
          { label: "Mortar (allow)", value: formatM3(mortarM3, 3) },
          {
            label: "Cement bags (allow)",
            value: formatCount(cementBags, "bags"),
            hint: "About 1 bag per 100 bricks, plus sand",
          },
        ],
      },
    ],
    order: [
      { item: "Bricks", qty: formatCount(nOrder, "pcs") },
      { item: "Mortar", qty: formatM3(mortarM3, 3) },
      { item: "Cement", qty: formatCount(cementBags, "bags") },
    ],
    notes: [
      "50 bricks/m² is the usual stretcher-bond figure for a 230 × 76 mm brick with 10 mm joints.",
      "Order a full extra cube if the brick is a special — you will not match the batch later.",
    ],
  };
}

export const excavationFields: Field[] = [
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
    key: "width",
    label: "Width",
    unit: "m",
    defaultValue: 0.45,
    min: 0,
    step: 0.05,
  },
  {
    kind: "number",
    key: "depth",
    label: "Depth",
    unit: "m",
    defaultValue: 0.6,
    min: 0,
    step: 0.05,
  },
  {
    kind: "number",
    key: "bulkage",
    label: "Bulkage",
    unit: "%",
    defaultValue: 25,
    min: 0,
    max: 50,
    step: 5,
    hint: "Loose spoil is bigger than the hole",
  },
  {
    kind: "number",
    key: "truck",
    label: "Truck capacity",
    unit: "m3",
    defaultValue: 8,
    min: 1,
    step: 0.5,
  },
];

export function computeExcavation(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const width = num(inputs.width);
  const depth = num(inputs.depth);
  const bulkage = num(inputs.bulkage, 25);
  const truck = num(inputs.truck, 8);

  if (length <= 0 || width <= 0 || depth <= 0) {
    return emptyOutput("Enter length, width and depth");
  }

  const inSitu = length * width * depth;
  const loose = inSitu * (1 + bulkage / 100);
  const loads = truck > 0 ? Math.ceil(loose / truck - 1e-9) : 0;

  return {
    headline: `${formatM3(inSitu, 3)} in situ · ${formatM3(loose, 3)} loose`,
    kpis: [
      { label: "In situ", value: formatM3(inSitu, 3) },
      { label: "Loose", value: formatM3(loose, 3) },
      { label: "Loads", value: formatNumber(loads, 0) },
      { label: "Plan", value: formatM2(length * width) },
    ],
    sections: [
      {
        title: "Cut",
        rows: [
          { label: "Plan area", value: formatM2(length * width) },
          { label: "In-situ volume", value: formatM3(inSitu, 3), tone: "strong" },
          {
            label: `Loose with ${formatNumber(bulkage, 0)}% bulkage`,
            value: formatM3(loose, 3),
            tone: "strong",
          },
          {
            label: `Truck loads @ ${formatM3(truck, 1)}`,
            value: formatCount(loads, "loads"),
          },
        ],
      },
    ],
    order: [
      { item: "Spoil (loose)", qty: formatM3(loose, 3) },
      { item: "Truck loads", qty: formatCount(loads, "loads") },
    ],
    notes: [
      "Clay often bulks 20–30%, rock more. Sand less.",
      "This is a rectangular trench / pad. Batter the sides on deep cuts.",
    ],
  };
}
