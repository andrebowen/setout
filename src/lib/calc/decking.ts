import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatM,
  formatM2,
  formatMm,
  formatNumber,
  num,
  countInclusive,
} from "./format.ts";

export const deckingFields: Field[] = [
  { kind: "section", label: "Deck size" },
  {
    kind: "number",
    key: "length",
    label: "Length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
    hint: "Boards run this way",
  },
  {
    kind: "number",
    key: "width",
    label: "Width",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.1,
    hint: "Boards lay across this way",
  },
  { kind: "section", label: "Boards" },
  {
    kind: "number",
    key: "boardWidth",
    label: "Board width",
    unit: "mm",
    defaultValue: 140,
    min: 1,
    step: 1,
    presets: [
      { label: "86", value: 86 },
      { label: "90", value: 90 },
      { label: "140", value: 140 },
      { label: "190", value: 190 },
    ],
  },
  {
    kind: "number",
    key: "boardGap",
    label: "Gap",
    unit: "mm",
    defaultValue: 5,
    min: 0,
    step: 1,
    presets: [
      { label: "3", value: 3 },
      { label: "5", value: 5 },
      { label: "8", value: 8 },
    ],
  },
  {
    kind: "number",
    key: "stockLength",
    label: "Stock length",
    unit: "m",
    defaultValue: 5.4,
    min: 0.3,
    step: 0.1,
    presets: [
      { label: "3.6", value: 3.6 },
      { label: "4.8", value: 4.8 },
      { label: "5.4", value: 5.4 },
      { label: "6.0", value: 6.0 },
    ],
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 10,
    min: 0,
    max: 40,
    step: 1,
  },
  { kind: "section", label: "Structure" },
  {
    kind: "number",
    key: "joistSpacing",
    label: "Joist centres",
    unit: "mm",
    defaultValue: 450,
    min: 100,
    step: 10,
    presets: [
      { label: "400", value: 400 },
      { label: "450", value: 450 },
      { label: "600", value: 600 },
    ],
  },
  {
    kind: "number",
    key: "bearerSpacing",
    label: "Bearer centres",
    unit: "mm",
    defaultValue: 1800,
    min: 300,
    step: 50,
  },
  {
    kind: "number",
    key: "postSpacing",
    label: "Post centres (along)",
    unit: "mm",
    defaultValue: 1800,
    min: 300,
    step: 50,
  },
  {
    kind: "number",
    key: "screwsPerJoist",
    label: "Screws per joist",
    unit: "count",
    defaultValue: 2,
    min: 1,
    max: 4,
    step: 1,
  },
];

export function computeDecking(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const width = num(inputs.width);
  const boardWidth = num(inputs.boardWidth, 140);
  const boardGap = num(inputs.boardGap, 5);
  const stockLength = num(inputs.stockLength, 5.4);
  const joistSpacing = num(inputs.joistSpacing, 450);
  const bearerSpacing = num(inputs.bearerSpacing, 1800);
  const postSpacing = num(inputs.postSpacing, 1800);
  const waste = num(inputs.waste, 10);
  const screwsPerJoist = num(inputs.screwsPerJoist, 2);

  if (length <= 0 || width <= 0) {
    return emptyOutput("Enter deck length and width");
  }

  const area = length * width;
  const coverM = (boardWidth + boardGap) / 1000;
  const nBoards = Math.max(1, Math.ceil(width / coverM - 1e-9));
  const actualCover = nBoards * coverM;
  const linear = nBoards * length;
  const linearWaste = linear * (1 + waste / 100);
  const nStock =
    stockLength > 0 ? Math.ceil(linearWaste / stockLength - 1e-9) : 0;

  const nJoists = countInclusive(length * 1000, joistSpacing);
  const actualJoist = nJoists > 1 ? (length * 1000) / (nJoists - 1) : 0;
  const joistLin = nJoists * width;

  const nBearers = countInclusive(width * 1000, bearerSpacing);
  const actualBearer = nBearers > 1 ? (width * 1000) / (nBearers - 1) : 0;
  const bearerLin = nBearers * length;

  const postsAlong = countInclusive(length * 1000, postSpacing);
  const nPosts = postsAlong * nBearers;
  const screws = nBoards * nJoists * screwsPerJoist;

  return {
    headline: `${formatNumber(nBoards, 0)} boards · ${formatM(linearWaste, 2)} with waste`,
    kpis: [
      { label: "Area", value: formatM2(area) },
      { label: "Boards", value: formatNumber(nBoards, 0) },
      { label: "Linear", value: formatM(linearWaste, 2) },
      { label: "Joists", value: formatNumber(nJoists, 0) },
    ],
    sections: [
      {
        title: "Decking boards",
        rows: [
          { label: "Finished area", value: formatM2(area), tone: "strong" },
          {
            label: "Boards across width",
            value: formatCount(nBoards, "pcs"),
            hint: `${formatMm(boardWidth)} board + ${formatMm(boardGap)} gap`,
          },
          { label: "Linear metres (net)", value: formatM(linear, 2) },
          {
            label: `Linear with ${formatNumber(waste, 0)}% waste`,
            value: formatM(linearWaste, 2),
            tone: "strong",
          },
          {
            label: `Stock lengths @ ${formatM(stockLength, 2)}`,
            value: formatCount(nStock, "pcs"),
            hint: "Round up. Check yard lengths before you order.",
          },
          {
            label: "Covered width",
            value: formatM(actualCover, 3),
            hint:
              actualCover > width + 0.002
                ? `Last board rips down — ${formatMm((actualCover - width) * 1000, 0)} extra cover`
                : "Boards land on width",
          },
        ],
      },
      {
        title: "Joists, bearers & posts",
        rows: [
          {
            label: "Joists",
            value: formatCount(nJoists, "pcs"),
            hint: `Set out ${formatMm(actualJoist, 0)} centres · ${formatM(joistLin, 2)} linear`,
          },
          {
            label: "Bearers",
            value: formatCount(nBearers, "pcs"),
            hint: `Set out ${formatMm(actualBearer, 0)} centres · ${formatM(bearerLin, 2)} linear`,
          },
          {
            label: "Posts",
            value: formatCount(nPosts, "pcs"),
            hint: `${formatNumber(postsAlong, 0)} along × ${formatNumber(nBearers, 0)} bearer lines`,
          },
          {
            label: "Deck screws",
            value: formatCount(screws, "screws"),
            hint: `${formatNumber(screwsPerJoist, 0)} per board per joist. Add 10% spares.`,
          },
        ],
      },
    ],
    order: [
      { item: `Decking ${formatMm(boardWidth)}`, qty: formatM(linearWaste, 2) },
      { item: `Stock @ ${formatM(stockLength, 2)}`, qty: formatCount(nStock, "pcs") },
      { item: "Joists", qty: `${formatCount(nJoists, "pcs")} · ${formatM(joistLin, 2)}` },
      { item: "Bearers", qty: `${formatCount(nBearers, "pcs")} · ${formatM(bearerLin, 2)}` },
      { item: "Posts", qty: formatCount(nPosts, "pcs") },
      { item: "Deck screws", qty: formatCount(screws, "screws") },
    ],
    notes: [
      "Boards run the length of the deck. Joists run across the width.",
      "Confirm joist span tables for your board thickness and species.",
      "Keep a 5–10 mm gap to walls and posts for drainage.",
    ],
    diagram: {
      type: "deck",
      length,
      width,
      nBoards,
      nJoists,
    },
  };
}
