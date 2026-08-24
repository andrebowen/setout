import type { CalcOutput, Field, Inputs } from "./types.ts";
import {
  emptyOutput,
  formatCount,
  formatDeg,
  formatM,
  formatM2,
  formatMm,
  formatNumber,
  num,
  str,
  countInclusive,
} from "./format.ts";

export const corrugatedFields: Field[] = [
  { kind: "section", label: "Building" },
  {
    kind: "number",
    key: "buildingLength",
    label: "Building length",
    unit: "m",
    defaultValue: 12,
    min: 0,
    step: 0.1,
    hint: "Ridge / eaves direction",
  },
  {
    kind: "number",
    key: "buildingWidth",
    label: "Span",
    unit: "m",
    defaultValue: 8,
    min: 0,
    step: 0.1,
    hint: "Wall to wall across the pitch",
  },
  {
    kind: "select",
    key: "roofType",
    label: "Roof type",
    defaultValue: "gable",
    options: [
      { value: "gable", label: "Gable" },
      { value: "skillion", label: "Skillion" },
    ],
  },
  {
    kind: "number",
    key: "pitch",
    label: "Pitch",
    unit: "deg",
    defaultValue: 22.5,
    min: 1,
    max: 60,
    step: 0.5,
    presets: [
      { label: "5°", value: 5 },
      { label: "15°", value: 15 },
      { label: "22.5°", value: 22.5 },
      { label: "25°", value: 25 },
      { label: "30°", value: 30 },
    ],
  },
  { kind: "section", label: "Overhangs & sheet" },
  {
    kind: "number",
    key: "eaveOverhang",
    label: "Eave overhang",
    unit: "m",
    defaultValue: 0.45,
    min: 0,
    step: 0.05,
  },
  {
    kind: "number",
    key: "gableOverhang",
    label: "Gable overhang",
    unit: "m",
    defaultValue: 0.05,
    min: 0,
    step: 0.05,
  },
  {
    kind: "number",
    key: "cover",
    label: "Effective cover",
    unit: "mm",
    defaultValue: 762,
    min: 200,
    step: 1,
    presets: [
      { label: "700", value: 700 },
      { label: "762", value: 762 },
      { label: "820", value: 820 },
    ],
    hint: "Corrugated / Custom Orb 762 mm",
  },
  {
    kind: "number",
    key: "battenSpacing",
    label: "Batten centres",
    unit: "mm",
    defaultValue: 900,
    min: 200,
    step: 50,
  },
  {
    kind: "number",
    key: "waste",
    label: "Waste",
    unit: "%",
    defaultValue: 5,
    min: 0,
    max: 25,
    step: 1,
  },
];

export const pitchFields: Field[] = [
  {
    kind: "select",
    key: "mode",
    label: "Work from",
    defaultValue: "rise-run",
    options: [
      { value: "rise-run", label: "Rise and run" },
      { value: "rise-span", label: "Rise and span" },
      { value: "angle", label: "Pitch angle" },
    ],
  },
  {
    kind: "number",
    key: "rise",
    label: "Rise to ridge",
    unit: "m",
    defaultValue: 1.8,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["rise-run", "rise-span"] },
  },
  {
    kind: "number",
    key: "run",
    label: "Run (half span)",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["rise-run"] },
  },
  {
    kind: "number",
    key: "span",
    label: "Total span",
    unit: "m",
    defaultValue: 8,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["rise-span", "angle"] },
  },
  {
    kind: "number",
    key: "angle",
    label: "Pitch",
    unit: "deg",
    defaultValue: 22.5,
    min: 1,
    max: 60,
    step: 0.5,
    showWhen: { key: "mode", in: ["angle"] },
    presets: [
      { label: "15°", value: 15 },
      { label: "22.5°", value: 22.5 },
      { label: "25°", value: 25 },
      { label: "30°", value: 30 },
      { label: "45°", value: 45 },
    ],
  },
  {
    kind: "number",
    key: "overhang",
    label: "Eave overhang",
    unit: "m",
    defaultValue: 0.45,
    min: 0,
    step: 0.05,
  },
];

export function computeCorrugated(inputs: Inputs): CalcOutput {
  const buildingLength = num(inputs.buildingLength);
  const buildingWidth = num(inputs.buildingWidth);
  const pitch = num(inputs.pitch, 22.5);
  const eaveOverhang = num(inputs.eaveOverhang, 0.45);
  const gableOverhang = num(inputs.gableOverhang, 0.05);
  const cover = num(inputs.cover, 762);
  const waste = num(inputs.waste, 5);
  const roofType = str(inputs.roofType, "gable");
  const battenSpacing = num(inputs.battenSpacing, 900);

  if (buildingLength <= 0 || buildingWidth <= 0) {
    return emptyOutput("Enter building length and span");
  }

  const pitchRad = (pitch * Math.PI) / 180;
  const factor = 1 / Math.cos(pitchRad);
  const isGable = roofType === "gable";

  const planLength = buildingLength + 2 * gableOverhang;
  const planWidth = buildingWidth + (isGable ? 2 : 1) * eaveOverhang;
  const planArea = planLength * planWidth;

  const slopeRun = isGable
    ? buildingWidth / 2 + eaveOverhang
    : buildingWidth + eaveOverhang;
  const slopeLength = slopeRun / Math.cos(pitchRad);
  const roofArea = planArea * factor;
  const orderArea = roofArea * (1 + waste / 100);

  const coverM = cover / 1000;
  const sheetsAcross = Math.max(1, Math.ceil(planLength / coverM - 1e-9));
  const planes = isGable ? 2 : 1;
  const nSheets = sheetsAcross * planes;
  const sheetLin = nSheets * slopeLength;

  const ridge = isGable ? planLength : 0;
  const barge = isGable ? 4 * slopeLength : 2 * slopeLength;
  const gutter = isGable ? 2 * planLength : planLength;
  const apex = isGable ? 0 : planLength;

  const nBattensPerPlane = countInclusive(slopeLength * 1000, battenSpacing);
  const battenLin = nBattensPerPlane * planLength * planes;
  const screws = Math.ceil(roofArea * 6);

  return {
    headline: `${formatCount(nSheets, "sheets")} · ${formatM2(orderArea)} including waste`,
    kpis: [
      { label: "Roof area", value: formatM2(roofArea) },
      { label: "Sheets", value: formatNumber(nSheets, 0) },
      { label: "Sheet length", value: formatM(slopeLength, 3) },
      { label: "Pitch factor", value: formatNumber(factor, 3) },
    ],
    sections: [
      {
        title: "Sheets",
        rows: [
          { label: "Plan area", value: formatM2(planArea) },
          {
            label: "Pitched area",
            value: formatM2(roofArea),
            tone: "strong",
            hint: `× ${formatNumber(factor, 3)} for ${formatDeg(pitch)}`,
          },
          {
            label: `Order with ${formatNumber(waste, 0)}% waste`,
            value: formatM2(orderArea),
            tone: "strong",
          },
          {
            label: "Sheets across eaves",
            value: formatCount(sheetsAcross, "per plane"),
            hint: `${formatMm(cover)} cover · ${formatNumber(planes, 0)} plane${planes > 1 ? "s" : ""}`,
          },
          {
            label: "Sheet length (slope)",
            value: formatM(slopeLength, 3),
            hint: "Order cut-to-length. Confirm mill max length and end-lap if needed.",
          },
          { label: "Total sheet linear", value: formatM(sheetLin, 2) },
        ],
      },
      {
        title: "Flashings & fixings",
        rows: [
          {
            label: isGable ? "Ridge capping" : "Apex / barge at high side",
            value: formatM(isGable ? ridge : apex, 2),
          },
          { label: "Barge capping", value: formatM(barge, 2) },
          { label: "Gutter", value: formatM(gutter, 2) },
          {
            label: "Battens",
            value: formatM(battenLin, 2),
            hint: `${formatNumber(nBattensPerPlane, 0)} rows/plane @ ${formatMm(battenSpacing)}`,
          },
          {
            label: "Roof screws (allow)",
            value: formatCount(screws, "screws"),
            hint: "About 6 per m². Every rib at eaves and ridge, every second on intermediates.",
          },
        ],
      },
    ],
    order: [
      {
        item: `Corrugated ${formatMm(cover)} × ${formatM(slopeLength, 3)}`,
        qty: formatCount(nSheets, "sheets"),
      },
      { item: isGable ? "Ridge capping" : "Apex flashing", qty: formatM(isGable ? ridge : apex, 2) },
      { item: "Barge capping", qty: formatM(barge, 2) },
      { item: "Gutter", qty: formatM(gutter, 2) },
      { item: "Battens", qty: formatM(battenLin, 2) },
      { item: "Roof screws", qty: formatCount(screws, "screws") },
    ],
    notes: [
      "Custom Orb / corrugated cover is typically 762 mm. Trimdek 762 mm, Kliplok 700 mm.",
      "Sheet length is the slope from ridge/apex to eave including overhang.",
      "Add sarking / insulation equal to pitched area plus laps.",
    ],
    diagram: {
      type: "roof",
      span: buildingWidth,
      length: buildingLength,
      pitch,
      roofType,
    },
  };
}

export function computePitch(inputs: Inputs): CalcOutput {
  const mode = str(inputs.mode, "rise-run");
  const span = num(inputs.span);
  const overhang = num(inputs.overhang, 0.45);
  let rise = num(inputs.rise);
  let run = num(inputs.run);
  let angle = num(inputs.angle, 22.5);

  if (mode === "angle") {
    if (span <= 0 && run <= 0) {
      return emptyOutput("Enter span or run with the pitch angle");
    }
    const half = span > 0 ? span / 2 : run;
    run = half;
    rise = run * Math.tan((angle * Math.PI) / 180);
  } else if (mode === "rise-span") {
    if (span <= 0 || rise <= 0) {
      return emptyOutput("Enter total span and rise to ridge");
    }
    run = span / 2;
    angle = (Math.atan(rise / run) * 180) / Math.PI;
  } else {
    if (rise <= 0 || run <= 0) {
      return emptyOutput("Enter rise and run");
    }
    angle = (Math.atan(rise / run) * 180) / Math.PI;
  }

  const pitchRad = (angle * Math.PI) / 180;
  const rafterRun = run + overhang;
  const rafter = rafterRun / Math.cos(pitchRad);
  const plumb = rafterRun * Math.tan(pitchRad);
  const hip = Math.sqrt(rise * rise + 2 * run * run);
  const hipWithOver = Math.sqrt(plumb * plumb + 2 * rafterRun * rafterRun);
  const factor = 1 / Math.cos(pitchRad);
  const ratio = rise > 0 ? run / rise : 0;
  const risePerM = Math.tan(pitchRad) * 1000;

  const commonPitches = [5, 10, 15, 22.5, 25, 30, 35, 40, 45];
  const nearest = commonPitches.reduce((a, b) =>
    Math.abs(b - angle) < Math.abs(a - angle) ? b : a,
  );

  return {
    headline: `${formatDeg(angle)} · rafter ${formatM(rafter, 3)}`,
    kpis: [
      { label: "Pitch", value: formatDeg(angle) },
      { label: "Rafter", value: formatM(rafter, 3) },
      { label: "Hip / valley", value: formatM(hipWithOver, 3) },
      { label: "Area factor", value: formatNumber(factor, 3) },
    ],
    sections: [
      {
        title: "Triangle",
        rows: [
          { label: "Rise (to ridge)", value: formatM(rise, 3), tone: "strong" },
          { label: "Run (half span)", value: formatM(run, 3) },
          {
            label: "Pitch",
            value: `${formatDeg(angle)}  ·  1 in ${formatNumber(ratio, 2)}`,
            tone: "strong",
          },
          {
            label: "Rise per metre run",
            value: formatMm(risePerM, 1),
          },
          {
            label: "Nearest common pitch",
            value: formatDeg(nearest),
            hint:
              Math.abs(nearest - angle) < 0.15
                ? "On a standard pitch"
                : "Off-standard — confirm with the drawing",
          },
        ],
      },
      {
        title: "Members",
        rows: [
          {
            label: "Common rafter (incl. overhang)",
            value: formatM(rafter, 3),
            tone: "strong",
            hint: `${formatM(rafterRun, 3)} run including ${formatM(overhang, 2)} overhang`,
          },
          { label: "Plumb height over outer wall + overhang", value: formatM(plumb, 3) },
          {
            label: "Hip / valley (to wall line)",
            value: formatM(hip, 3),
          },
          {
            label: "Hip / valley (incl. overhang)",
            value: formatM(hipWithOver, 3),
            hint: "Equal-pitch hip. Birdsmouth and plumb cuts extra.",
          },
          {
            label: "Roof area factor",
            value: `× ${formatNumber(factor, 3)}`,
            hint: "Multiply plan area by this to get pitched area.",
          },
        ],
      },
    ],
    order: [
      { item: "Common rafter (slope)", qty: formatM(rafter, 3) },
      { item: "Hip / valley (incl. overhang)", qty: formatM(hipWithOver, 3) },
    ],
    notes: [
      "Rafter length is slope length, not the timber you buy — add birds-mouth, ridge plumb and eaves cut.",
      "Hip length assumes equal pitch on both planes.",
    ],
    diagram: {
      type: "pitch",
      rise,
      run: rafterRun,
      rafter,
      angle,
    },
  };
}
