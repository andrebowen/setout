import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatKg,
  formatL,
  formatM,
  formatM2,
  formatMm,
  formatNumber,
  num,
  str,
} from "./format.ts";

export const flooringFields: Field[] = [
  {
    kind: "number",
    key: "length",
    label: "Room length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "width",
    label: "Room width",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "boardWidth",
    label: "Cover width",
    unit: "mm",
    defaultValue: 190,
    min: 50,
    step: 1,
    presets: [
      { label: "90", value: 90 },
      { label: "130", value: 130 },
      { label: "190", value: 190 },
    ],
  },
  {
    kind: "number",
    key: "packCoverage",
    label: "Pack coverage",
    unit: "m2",
    defaultValue: 2.17,
    min: 0.5,
    step: 0.01,
    hint: "From the pack. 0 if you order linear only.",
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 8,
    min: 0,
    max: 25,
    step: 1,
  },
];

export function computeFlooring(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const width = num(inputs.width);
  const boardWidth = num(inputs.boardWidth, 190);
  const packCoverage = num(inputs.packCoverage, 2.17);
  const waste = num(inputs.waste, 8);

  if (length <= 0 || width <= 0) {
    return emptyOutput("Enter room length and width");
  }

  const area = length * width;
  const orderArea = area * (1 + waste / 100);
  const coverM = boardWidth / 1000;
  const nRows = Math.max(1, Math.ceil(width / coverM - 1e-9));
  const linear = nRows * length;
  const linearWaste = linear * (1 + waste / 100);
  const packs =
    packCoverage > 0 ? Math.ceil(orderArea / packCoverage - 1e-9) : 0;

  return {
    headline: `${formatM2(orderArea)} to order · ${formatCount(packs, "packs")}`,
    kpis: [
      { label: "Area", value: formatM2(area) },
      { label: "Order", value: formatM2(orderArea) },
      { label: "Packs", value: formatNumber(packs, 0) },
      { label: "Rows", value: formatNumber(nRows, 0) },
    ],
    sections: [
      {
        title: "Floor",
        rows: [
          { label: "Net area", value: formatM2(area) },
          {
            label: `With ${formatNumber(waste, 0)}% waste`,
            value: formatM2(orderArea),
            tone: "strong",
          },
          {
            label: "Rows across width",
            value: formatCount(nRows, "rows"),
            hint: `${formatMm(boardWidth)} cover`,
          },
          { label: "Linear with waste", value: formatM(linearWaste, 2) },
          {
            label: "Packs",
            value: packCoverage > 0 ? formatCount(packs, "packs") : "—",
            tone: "strong",
            hint: packCoverage > 0 ? `${formatM2(packCoverage)} per pack` : "Set pack coverage",
          },
        ],
      },
    ],
    order: [
      { item: "Flooring", qty: formatM2(orderArea) },
      { item: "Packs", qty: packCoverage > 0 ? formatCount(packs, "packs") : "—" },
    ],
    notes: [
      "Add extra waste for herringbone, diagonals, or a lot of cuts around a kitchen.",
      "Leave the pack to acclimatise. Check the manufacturer’s expansion gap.",
    ],
  };
}

export const tilingFields: Field[] = [
  {
    kind: "number",
    key: "length",
    label: "Length",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "width",
    label: "Width / height",
    unit: "m",
    defaultValue: 3,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "tileLength",
    label: "Tile length",
    unit: "mm",
    defaultValue: 600,
    min: 50,
    step: 1,
    presets: [
      { label: "300", value: 300 },
      { label: "400", value: 400 },
      { label: "600", value: 600 },
    ],
  },
  {
    kind: "number",
    key: "tileWidth",
    label: "Tile width",
    unit: "mm",
    defaultValue: 600,
    min: 50,
    step: 1,
  },
  {
    kind: "select",
    key: "layout",
    label: "Layout",
    defaultValue: "straight",
    options: [
      { value: "straight", label: "Straight" },
      { value: "diagonal", label: "Diagonal / herringbone" },
    ],
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 10,
    min: 0,
    max: 30,
    step: 1,
  },
  {
    kind: "number",
    key: "adhesiveRate",
    label: "Adhesive",
    unit: "kg",
    defaultValue: 4.5,
    min: 1,
    step: 0.5,
    hint: "kg per m². Typical 3–6 kg/m²",
  },
];

export function computeTiling(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const width = num(inputs.width);
  const tileLength = num(inputs.tileLength, 600);
  const tileWidth = num(inputs.tileWidth, 600);
  const layout = str(inputs.layout, "straight");
  const wasteIn = num(inputs.waste, 10);
  const adhesiveRate = num(inputs.adhesiveRate, 4.5);

  if (length <= 0 || width <= 0) {
    return emptyOutput("Enter the area length and width");
  }

  const waste = layout === "diagonal" ? Math.max(wasteIn, 15) : wasteIn;
  const area = length * width;
  const tileM2 = (tileLength / 1000) * (tileWidth / 1000);
  const nNet = tileM2 > 0 ? area / tileM2 : 0;
  const nOrder = Math.ceil(nNet * (1 + waste / 100) - 1e-9);
  const adhesive = area * adhesiveRate;
  const groutKg = area * 0.4;

  const flags: CalcOutput["flags"] = [];
  if (layout === "diagonal" && wasteIn < 15) {
    flags.push({
      tone: "warn",
      text: "Diagonal layouts usually need at least 15% waste — applied automatically.",
    });
  }

  return {
    headline: `${formatCount(nOrder, "tiles")} · ${formatM2(area)}`,
    kpis: [
      { label: "Area", value: formatM2(area) },
      { label: "Tiles", value: formatNumber(nOrder, 0) },
      { label: "Adhesive", value: formatKg(adhesive, 0) },
      { label: "Waste", value: `${formatNumber(waste, 0)}%` },
    ],
    flags,
    sections: [
      {
        title: "Tiles",
        rows: [
          { label: "Net area", value: formatM2(area) },
          {
            label: "Tile size",
            value: `${formatMm(tileLength)} × ${formatMm(tileWidth)}`,
            hint: formatM2(tileM2, 3),
          },
          { label: "Tiles net", value: formatNumber(nNet, 1) },
          {
            label: `Tiles with ${formatNumber(waste, 0)}% waste`,
            value: formatCount(nOrder, "pcs"),
            tone: "strong",
          },
        ],
      },
      {
        title: "Fixing",
        rows: [
          {
            label: "Adhesive",
            value: formatKg(adhesive, 0),
            hint: `${formatNumber(adhesiveRate, 1)} kg/m²`,
          },
          {
            label: "Grout (allow)",
            value: formatKg(groutKg, 1),
            hint: "About 0.4 kg/m² — check joint width",
          },
        ],
      },
    ],
    order: [
      { item: `Tiles ${formatMm(tileLength)} × ${formatMm(tileWidth)}`, qty: formatCount(nOrder, "pcs") },
      { item: "Adhesive", qty: formatKg(adhesive, 0) },
      { item: "Grout", qty: formatKg(groutKg, 1) },
    ],
    notes: [
      "Set out from the centre of the room so cuts land evenly on both sides.",
      "Buy a full extra box if the tile is a special run — you will not match it later.",
    ],
  };
}

export const paintFields: Field[] = [
  {
    kind: "number",
    key: "perimeter",
    label: "Wall perimeter",
    unit: "m",
    defaultValue: 20,
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
    kind: "select",
    key: "includeCeiling",
    label: "Ceiling",
    defaultValue: "yes",
    options: [
      { value: "yes", label: "Include ceiling" },
      { value: "no", label: "Walls only" },
    ],
  },
  {
    kind: "number",
    key: "ceilLength",
    label: "Ceiling length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
    showWhen: { key: "includeCeiling", in: ["yes"] },
  },
  {
    kind: "number",
    key: "ceilWidth",
    label: "Ceiling width",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.1,
    showWhen: { key: "includeCeiling", in: ["yes"] },
  },
  {
    kind: "number",
    key: "doors",
    label: "Doors",
    unit: "count",
    defaultValue: 1,
    min: 0,
    step: 1,
    hint: "Deducts 1.8 m² each",
  },
  {
    kind: "number",
    key: "windows",
    label: "Windows",
    unit: "count",
    defaultValue: 2,
    min: 0,
    step: 1,
    hint: "Deducts 1.2 m² each",
  },
  {
    kind: "number",
    key: "coats",
    label: "Coats",
    unit: "count",
    defaultValue: 2,
    min: 1,
    max: 4,
    step: 1,
  },
  {
    kind: "number",
    key: "coverage",
    label: "Coverage",
    unit: "m2",
    defaultValue: 14,
    min: 4,
    step: 0.5,
    hint: "m² per litre per coat",
  },
];

export function computePaint(inputs: Inputs): CalcOutput {
  const perimeter = num(inputs.perimeter);
  const wallHeight = num(inputs.wallHeight, 2.4);
  const includeCeiling = str(inputs.includeCeiling, "yes") === "yes";
  const ceilLength = num(inputs.ceilLength);
  const ceilWidth = num(inputs.ceilWidth);
  const doors = Math.max(0, Math.round(num(inputs.doors, 0)));
  const windows = Math.max(0, Math.round(num(inputs.windows, 0)));
  const coats = Math.max(1, Math.round(num(inputs.coats, 2)));
  const coverage = num(inputs.coverage, 14);

  if (perimeter <= 0 || wallHeight <= 0) {
    return emptyOutput("Enter wall perimeter and height");
  }

  const openings = doors * 1.8 + windows * 1.2;
  const wallArea = Math.max(0, perimeter * wallHeight - openings);
  const ceilArea = includeCeiling ? Math.max(0, ceilLength * ceilWidth) : 0;
  const total = wallArea + ceilArea;
  const coatArea = total * coats;
  const litres = coverage > 0 ? coatArea / coverage : 0;
  const orderL = Math.ceil(litres * 2) / 2;

  return {
    headline: `${formatL(orderL, 1)} · ${formatM2(total)} × ${formatNumber(coats, 0)} coats`,
    kpis: [
      { label: "Walls", value: formatM2(wallArea) },
      { label: "Ceiling", value: formatM2(ceilArea) },
      { label: "Paint", value: formatL(orderL, 1) },
      { label: "Coats", value: formatNumber(coats, 0) },
    ],
    sections: [
      {
        title: "Area",
        rows: [
          { label: "Gross wall area", value: formatM2(perimeter * wallHeight) },
          {
            label: "Openings deducted",
            value: formatM2(openings),
            hint: `${formatNumber(doors, 0)} doors + ${formatNumber(windows, 0)} windows`,
          },
          { label: "Net walls", value: formatM2(wallArea), tone: "strong" },
          { label: "Ceiling", value: formatM2(ceilArea) },
          { label: "Total paintable", value: formatM2(total) },
        ],
      },
      {
        title: "Paint",
        rows: [
          { label: "Area × coats", value: formatM2(coatArea) },
          {
            label: "Litres (calc)",
            value: formatL(litres, 2),
            hint: `${formatNumber(coverage, 1)} m²/L`,
          },
          {
            label: "Order (round up 0.5 L)",
            value: formatL(orderL, 1),
            tone: "strong",
          },
        ],
      },
    ],
    order: [{ item: "Paint", qty: formatL(orderL, 1) }],
    notes: [
      "Coverage of 14 m²/L is typical for a mid-sheen wall paint on a sealed surface. Rough plaster eats more.",
      "Doors 1.8 m² and windows 1.2 m² are allowances — measure if they are large.",
    ],
  };
}

export const plasterFields: Field[] = [
  {
    kind: "number",
    key: "length",
    label: "Length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "width",
    label: "Width / height",
    unit: "m",
    defaultValue: 2.4,
    min: 0,
    step: 0.1,
    hint: "Wall height, or room width for a ceiling",
  },
  {
    kind: "select",
    key: "sheetLength",
    label: "Sheet length",
    defaultValue: "2.4",
    options: [
      { value: "2.4", label: "2400 mm" },
      { value: "2.7", label: "2700 mm" },
      { value: "3.0", label: "3000 mm" },
    ],
  },
  {
    kind: "number",
    key: "sheetWidth",
    label: "Sheet width",
    unit: "m",
    defaultValue: 1.2,
    min: 0.6,
    step: 0.05,
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 10,
    min: 0,
    max: 25,
    step: 1,
  },
];

export function computePlaster(inputs: Inputs): CalcOutput {
  const length = num(inputs.length);
  const width = num(inputs.width);
  const sheetLength = num(str(inputs.sheetLength, "2.4"), 2.4);
  const sheetWidth = num(inputs.sheetWidth, 1.2);
  const waste = num(inputs.waste, 10);

  if (length <= 0 || width <= 0) {
    return emptyOutput("Enter length and width / height");
  }

  const area = length * width;
  const sheetArea = sheetLength * sheetWidth;
  const nNet = sheetArea > 0 ? area / sheetArea : 0;
  const nOrder = Math.ceil(nNet * (1 + waste / 100) - 1e-9);
  const tape = area * 1.4;
  const compound = area * 0.8;

  return {
    headline: `${formatCount(nOrder, "sheets")} · ${formatM2(area)}`,
    kpis: [
      { label: "Area", value: formatM2(area) },
      { label: "Sheets", value: formatNumber(nOrder, 0) },
      { label: "Tape", value: formatM(tape, 1) },
      { label: "Compound", value: formatKg(compound, 0) },
    ],
    sections: [
      {
        title: "Sheets",
        rows: [
          { label: "Net area", value: formatM2(area) },
          {
            label: "Sheet",
            value: `${formatM(sheetLength, 1)} × ${formatM(sheetWidth, 1)}`,
            hint: formatM2(sheetArea, 2),
          },
          { label: "Sheets net", value: formatNumber(nNet, 2) },
          {
            label: `Sheets with ${formatNumber(waste, 0)}% waste`,
            value: formatCount(nOrder, "pcs"),
            tone: "strong",
          },
        ],
      },
      {
        title: "Stopping",
        rows: [
          {
            label: "Paper tape (allow)",
            value: formatM(tape, 1),
            hint: "About 1.4 m per m²",
          },
          {
            label: "Base compound (allow)",
            value: formatKg(compound, 0),
            hint: "About 0.8 kg/m² for three coats",
          },
        ],
      },
    ],
    order: [
      {
        item: `Plasterboard ${formatM(sheetLength, 1)} × ${formatM(sheetWidth, 1)}`,
        qty: formatCount(nOrder, "pcs"),
      },
      { item: "Tape", qty: formatM(tape, 1) },
      { item: "Compound", qty: formatKg(compound, 0) },
    ],
    notes: [
      "Run sheets across the joists / studs. Ceilings usually want 13 mm; wet areas use wet-area board.",
      "Compound allowance is for a standard three-coat stop. Back-blocking is extra.",
    ],
  };
}
