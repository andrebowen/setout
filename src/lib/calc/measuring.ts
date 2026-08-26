import type { CalcOutput, Field, Inputs, ResultRow } from "./types.ts";
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
} from "./format.ts";

// ---------------------------------------------------------------------------
// Check square — 3-4-5 / diagonal method
// ---------------------------------------------------------------------------

export const checkSquareFields: Field[] = [
  { kind: "section", label: "Rectangle" },
  {
    kind: "number",
    key: "sideA",
    label: "Side A",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.01,
  },
  {
    kind: "number",
    key: "sideB",
    label: "Side B",
    unit: "m",
    defaultValue: 3,
    min: 0,
    step: 0.01,
  },
  { kind: "section", label: "Measured diagonals" },
  {
    kind: "number",
    key: "diagonal1",
    label: "Diagonal 1",
    unit: "m",
    defaultValue: 5,
    min: 0,
    step: 0.001,
    hint: "Corner to corner, one way",
  },
  {
    kind: "number",
    key: "diagonal2",
    label: "Diagonal 2",
    unit: "m",
    defaultValue: 5,
    min: 0,
    step: 0.001,
    hint: "Corner to corner, the other way",
  },
];

export function computeCheckSquare(inputs: Inputs): CalcOutput {
  const sideA = num(inputs.sideA);
  const sideB = num(inputs.sideB);
  const diagonal1 = num(inputs.diagonal1);
  const diagonal2 = num(inputs.diagonal2);

  if (sideA <= 0 || sideB <= 0) {
    return emptyOutput("Enter both side lengths");
  }

  const expected = Math.hypot(sideA, sideB);
  const haveBoth = diagonal1 > 0 && diagonal2 > 0;
  const diagDiffMm = haveBoth ? (diagonal1 - diagonal2) * 1000 : 0;
  const absDiff = Math.abs(diagDiffMm);
  const tone: "ok" | "warn" | "bad" = absDiff <= 5 ? "ok" : absDiff <= 15 ? "warn" : "bad";

  const flags: CalcOutput["flags"] = [];
  if (haveBoth) {
    if (tone === "ok") {
      flags.push({ tone: "ok", text: "Diagonals match within 5 mm — close enough to call it square." });
    } else {
      const longer = diagDiffMm > 0 ? "Diagonal 1" : "Diagonal 2";
      flags.push({
        tone: tone === "bad" ? "bad" : "warn",
        text: `${longer} is ${formatMm(absDiff, 0)} longer — rack that pair of corners in until the diagonals match.`,
      });
    }
  }

  const multiples = [1, 1.5, 2, 3].map((k) => ({
    a: 3 * k,
    b: 4 * k,
    c: 5 * k,
  }));

  return {
    headline: haveBoth
      ? tone === "ok"
        ? "Square ✓"
        : `Out of square by ${formatMm(absDiff, 0)}`
      : `Expected diagonal ${formatM(expected, 3)}`,
    kpis: [
      { label: "Expected diagonal", value: formatM(expected, 3) },
      { label: "Diagonal 1", value: formatM(diagonal1, 3) },
      { label: "Diagonal 2", value: formatM(diagonal2, 3) },
      { label: "Out of square", value: haveBoth ? formatMm(absDiff, 0) : "—" },
    ],
    flags,
    sections: [
      {
        title: "Diagonal check",
        rows: [
          { label: "Side A", value: formatM(sideA, 3) },
          { label: "Side B", value: formatM(sideB, 3) },
          {
            label: "Expected diagonal (Pythagoras)",
            value: formatM(expected, 3),
            tone: "strong",
          },
          {
            label: "Diagonal 1 vs Diagonal 2",
            value: haveBoth ? formatMm(diagDiffMm, 0) : "—",
            tone: haveBoth ? (tone === "bad" ? "warn" : tone) : "default",
            hint: "Equal diagonals = square, regardless of the expected figure above",
          },
        ],
      },
      {
        title: "3-4-5 reference",
        rows: multiples.map((m) => ({
          label: `${formatNumber(m.a, 1)} – ${formatNumber(m.b, 1)} – ${formatNumber(m.c, 1)} m`,
          value: "90°",
          hint: "Measure A and B, the diagonal C confirms the corner",
        })),
      },
    ],
    notes: [
      "The most reliable check is two equal diagonals — the side lengths only need to be roughly right.",
      "3-4-5 (and its multiples) is the fallback when you don't have a clear run for a full diagonal.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Equal spacing & running marks — divide a known run, or step off a fixed
// increment from a start point (folds the former standalone "Running
// measurements" calculator in as a third solve mode, 2026-08-25).
// ---------------------------------------------------------------------------

export const equalSpacingFields: Field[] = [
  {
    kind: "select",
    key: "mode",
    label: "Solve for",
    defaultValue: "target-spacing",
    options: [
      { value: "target-spacing", label: "Nearest to a target spacing" },
      { value: "n-spaces", label: "A fixed number of spaces" },
      { value: "fixed-increment", label: "Fixed increment from a start point" },
    ],
  },
  {
    kind: "number",
    key: "totalLength",
    label: "Total length",
    unit: "m",
    defaultValue: 3.6,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["target-spacing", "n-spaces"] },
  },
  {
    kind: "number",
    key: "targetSpacing",
    label: "Target spacing",
    unit: "mm",
    defaultValue: 300,
    min: 1,
    step: 1,
    showWhen: { key: "mode", in: ["target-spacing"] },
    hint: "Actual spacing is adjusted so it divides evenly",
  },
  {
    kind: "number",
    key: "nSpaces",
    label: "Number of spaces",
    unit: "count",
    defaultValue: 12,
    min: 1,
    step: 1,
    showWhen: { key: "mode", in: ["n-spaces"] },
  },
  {
    kind: "number",
    key: "startOffset",
    label: "Start offset",
    unit: "mm",
    defaultValue: 0,
    min: 0,
    step: 1,
    hint: "Distance from your zero point to the first mark",
    showWhen: { key: "mode", in: ["fixed-increment"] },
  },
  {
    kind: "number",
    key: "increment",
    label: "Increment",
    unit: "mm",
    defaultValue: 450,
    min: 1,
    step: 1,
    presets: [
      { label: "300", value: 300 },
      { label: "450", value: 450 },
      { label: "600", value: 600 },
    ],
    showWhen: { key: "mode", in: ["fixed-increment"] },
  },
  {
    kind: "number",
    key: "count",
    label: "Number of marks",
    unit: "count",
    defaultValue: 10,
    min: 1,
    step: 1,
    showWhen: { key: "mode", in: ["fixed-increment"] },
  },
];

function computeFixedIncrement(inputs: Inputs): CalcOutput {
  const startOffset = num(inputs.startOffset, 0);
  const increment = num(inputs.increment, 450);
  const count = Math.max(1, Math.round(num(inputs.count, 10)));

  if (increment <= 0) {
    return emptyOutput("Enter an increment greater than 0");
  }

  const totalRun = startOffset + count * increment;
  const maxRows = 16;
  const markRows: ResultRow[] = [];
  const shown = Math.min(count + 1, maxRows);
  for (let i = 0; i < shown; i++) {
    markRows.push({ label: `Mark ${i}`, value: formatMm(startOffset + i * increment, 0) });
  }
  if (count + 1 > maxRows) {
    markRows.push({ label: "…", value: `${count + 1 - maxRows} more mark(s) at ${formatMm(increment)} centres` });
  }

  return {
    headline: `${formatCount(count, "marks")} @ ${formatMm(increment)} · run ${formatMm(totalRun)}`,
    kpis: [
      { label: "Increment", value: formatMm(increment) },
      { label: "Marks", value: formatNumber(count, 0) },
      { label: "Start offset", value: formatMm(startOffset) },
      { label: "Total run", value: formatMm(totalRun) },
    ],
    sections: [{ title: "Running marks", rows: markRows }],
    notes: [
      "Run the tape from one fixed zero rather than jumping start-to-start each time — that avoids compounding small errors along a long wall or deck.",
      "Mark 0 is the start offset; each following mark adds one increment.",
    ],
  };
}

export function computeEqualSpacing(inputs: Inputs): CalcOutput {
  const mode = str(inputs.mode, "target-spacing");

  if (mode === "fixed-increment") {
    return computeFixedIncrement(inputs);
  }

  const totalLength = num(inputs.totalLength);

  if (totalLength <= 0) {
    return emptyOutput("Enter a total length");
  }

  let n: number;
  if (mode === "n-spaces") {
    n = Math.max(1, Math.round(num(inputs.nSpaces, 12)));
  } else {
    const target = Math.max(1, num(inputs.targetSpacing, 300));
    n = Math.max(1, Math.round((totalLength * 1000) / target));
  }

  const spacingMm = (totalLength * 1000) / n;
  const nMarks = n + 1;

  const maxRows = 12;
  const markRows: ResultRow[] = [];
  const shown = Math.min(nMarks, maxRows);
  for (let i = 0; i < shown; i++) {
    markRows.push({ label: `Mark ${i + 1}`, value: formatMm(i * spacingMm, 0) });
  }
  if (nMarks > maxRows) {
    markRows.push({ label: "…", value: `${nMarks - maxRows} more mark(s) at the same spacing` });
  }

  return {
    headline: `${formatCount(n, "spaces")} @ ${formatMm(spacingMm, 1)}`,
    kpis: [
      { label: "Spaces", value: formatNumber(n, 0) },
      { label: "Spacing", value: formatMm(spacingMm, 1) },
      { label: "Marks", value: formatNumber(nMarks, 0) },
      { label: "Total length", value: formatM(totalLength, 3) },
    ],
    sections: [
      {
        title: "Result",
        rows: [
          { label: "Number of spaces", value: formatCount(n, "spaces"), tone: "strong" },
          { label: "Actual spacing", value: formatMm(spacingMm, 1), tone: "strong" },
          { label: "Marks (including both ends)", value: formatCount(nMarks, "marks") },
        ],
      },
      { title: "Marks from start", rows: markRows },
    ],
    notes: [
      "Good for pickets, joist bays, screw centres, tile layout lines — anything divided evenly across a known run.",
      "Marks are measured from the start face, not stacked tape-to-tape.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Triangle solver — right / SSS / SAS
// ---------------------------------------------------------------------------

export const triangleFields: Field[] = [
  {
    kind: "select",
    key: "mode",
    label: "Known values",
    defaultValue: "right-legs",
    options: [
      { value: "right-legs", label: "Right triangle — two legs" },
      { value: "right-hyp", label: "Right triangle — hypotenuse + leg" },
      { value: "sss", label: "Three sides (SSS)" },
      { value: "sas", label: "Two sides + included angle (SAS)" },
    ],
  },
  {
    kind: "number",
    key: "legA",
    label: "Leg A",
    unit: "m",
    defaultValue: 3,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["right-legs"] },
  },
  {
    kind: "number",
    key: "legB",
    label: "Leg B",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["right-legs"] },
  },
  {
    kind: "number",
    key: "hyp",
    label: "Hypotenuse",
    unit: "m",
    defaultValue: 5,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["right-hyp"] },
  },
  {
    kind: "number",
    key: "leg",
    label: "Known leg",
    unit: "m",
    defaultValue: 3,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["right-hyp"] },
  },
  {
    kind: "number",
    key: "sssA",
    label: "Side A",
    unit: "m",
    defaultValue: 5,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["sss"] },
  },
  {
    kind: "number",
    key: "sssB",
    label: "Side B",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["sss"] },
  },
  {
    kind: "number",
    key: "sssC",
    label: "Side C",
    unit: "m",
    defaultValue: 7,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["sss"] },
  },
  {
    kind: "number",
    key: "sasA",
    label: "Side A",
    unit: "m",
    defaultValue: 5,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["sas"] },
  },
  {
    kind: "number",
    key: "sasAngleC",
    label: "Included angle (between A and B)",
    unit: "deg",
    defaultValue: 60,
    min: 0,
    max: 179,
    step: 0.5,
    showWhen: { key: "mode", in: ["sas"] },
  },
  {
    kind: "number",
    key: "sasB",
    label: "Side B",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["sas"] },
  },
];

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export function computeTriangle(inputs: Inputs): CalcOutput {
  const mode = str(inputs.mode, "right-legs");

  let a = 0;
  let b = 0;
  let c = 0;
  let angleA = 0;
  let angleB = 0;
  let angleC = 0;

  if (mode === "right-legs") {
    a = num(inputs.legA);
    b = num(inputs.legB);
    if (a <= 0 || b <= 0) return emptyOutput("Enter both legs");
    c = Math.hypot(a, b);
    angleA = Math.atan(a / b) * DEG;
    angleB = 90 - angleA;
    angleC = 90;
  } else if (mode === "right-hyp") {
    c = num(inputs.hyp);
    a = num(inputs.leg);
    if (c <= 0 || a <= 0) return emptyOutput("Enter the hypotenuse and the known leg");
    if (a >= c) return emptyOutput("The leg must be shorter than the hypotenuse");
    b = Math.sqrt(c * c - a * a);
    angleA = Math.asin(a / c) * DEG;
    angleB = 90 - angleA;
    angleC = 90;
  } else if (mode === "sss") {
    a = num(inputs.sssA);
    b = num(inputs.sssB);
    c = num(inputs.sssC);
    if (a <= 0 || b <= 0 || c <= 0) return emptyOutput("Enter all three sides");
    if (a + b <= c || a + c <= b || b + c <= a) {
      return emptyOutput("Not a valid triangle — check the three lengths");
    }
    angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * DEG;
    angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * DEG;
    angleC = 180 - angleA - angleB;
  } else {
    // sas
    a = num(inputs.sasA);
    b = num(inputs.sasB);
    angleC = num(inputs.sasAngleC, 60);
    if (a <= 0 || b <= 0) return emptyOutput("Enter both sides");
    if (angleC <= 0 || angleC >= 180) return emptyOutput("Included angle must be between 0° and 180°");
    c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleC * RAD));
    angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * DEG;
    angleB = 180 - angleA - angleC;
  }

  const perimeter = a + b + c;
  const s = perimeter / 2;
  const heronArea = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

  return {
    headline: `a ${formatM(a, 3)} · b ${formatM(b, 3)} · c ${formatM(c, 3)}`,
    kpis: [
      { label: "Side C", value: formatM(c, 3) },
      { label: "Angle A", value: formatDeg(angleA) },
      { label: "Angle B", value: formatDeg(angleB) },
      { label: "Angle C", value: formatDeg(angleC) },
    ],
    sections: [
      {
        title: "Sides",
        rows: [
          { label: "Side A", value: formatM(a, 3), tone: "strong" },
          { label: "Side B", value: formatM(b, 3), tone: "strong" },
          { label: "Side C", value: formatM(c, 3), tone: "strong" },
          { label: "Perimeter", value: formatM(perimeter, 3) },
        ],
      },
      {
        title: "Angles",
        rows: [
          { label: "Angle A (opposite side A)", value: formatDeg(angleA) },
          { label: "Angle B (opposite side B)", value: formatDeg(angleB) },
          { label: "Angle C (opposite side C)", value: formatDeg(angleC) },
          { label: "Area", value: formatM2(heronArea) },
        ],
      },
    ],
    notes: [
      "Angles are measured opposite the side of the same letter.",
      "SSS and SAS use the law of cosines — accurate for any triangle, not just right angles.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Mitre angle — kept as its own calculator, not a Triangle solve mode
// (Andre's call, 2026-08-25 — it was briefly folded in, then split back out).
// ---------------------------------------------------------------------------

export const mitreAngleFields: Field[] = [
  {
    kind: "number",
    key: "cornerAngle",
    label: "Corner angle",
    unit: "deg",
    defaultValue: 90,
    min: 1,
    max: 179,
    step: 0.5,
    presets: [
      { label: "90°", value: 90 },
      { label: "135°", value: 135 },
      { label: "120°", value: 120 },
    ],
    hint: "Measured between the two faces — 90° is a standard square corner",
  },
  {
    kind: "select",
    key: "cornerType",
    label: "Corner type",
    defaultValue: "internal",
    options: [
      { value: "internal", label: "Internal" },
      { value: "external", label: "External" },
    ],
  },
];

export function computeMitreAngle(inputs: Inputs): CalcOutput {
  const cornerAngle = num(inputs.cornerAngle, 90);
  const cornerType = str(inputs.cornerType, "internal");

  if (cornerAngle <= 0 || cornerAngle >= 180) {
    return emptyOutput("Corner angle must be between 0° and 180°");
  }

  const mitre = cornerAngle / 2;

  return {
    headline: `${formatDeg(mitre)} on each piece`,
    kpis: [
      { label: "Corner angle", value: formatDeg(cornerAngle) },
      { label: "Mitre per side", value: formatDeg(mitre) },
      { label: "Corner type", value: cornerType === "external" ? "External" : "Internal" },
      { label: "Check", value: formatDeg(mitre * 2) },
    ],
    sections: [
      {
        title: "Mitre",
        rows: [
          { label: "Corner angle (as measured)", value: formatDeg(cornerAngle) },
          {
            label: "Cut each piece at, off square",
            value: formatDeg(mitre),
            tone: "strong",
            hint: "Set the mitre saw this many degrees off the 0° (square) mark",
          },
          { label: "Two mitres should sum to", value: formatDeg(mitre * 2) },
        ],
      },
    ],
    notes: [
      "For a standard 90° corner this gives the familiar 45° each side.",
      cornerType === "external"
        ? "External corner — the piece runs long past the wall face until it's cut; mark and cut in place if you're not certain of the exact angle."
        : "Internal corner — cut a touch long and creep up on the fit; timber and plaster corners are rarely exactly on the number.",
      "This is a flat, in-plane mitre. A raked/compound mitre — skirting running up a sloped ceiling, or crown moulding — needs a compound-angle table and isn't covered here.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Levelling (RL) — single instrument setup
// ---------------------------------------------------------------------------

export const levellingFields: Field[] = [
  {
    kind: "number",
    key: "bmRL",
    label: "Benchmark RL",
    unit: "m",
    defaultValue: 100,
    step: 0.001,
    hint: "Use 100.000 as an arbitrary site datum if there's no known RL",
  },
  {
    kind: "number",
    key: "backsight",
    label: "Backsight (on the BM)",
    unit: "mm",
    defaultValue: 1500,
    min: 0,
    step: 1,
  },
  {
    kind: "number",
    key: "foresight",
    label: "Foresight (on the target)",
    unit: "mm",
    defaultValue: 1200,
    min: 0,
    step: 1,
  },
];

export function computeLevelling(inputs: Inputs): CalcOutput {
  const bmRL = num(inputs.bmRL, 100);
  const backsightMm = num(inputs.backsight, 1500);
  const foresightMm = num(inputs.foresight, 1200);

  if (backsightMm <= 0) {
    return emptyOutput("Enter the backsight reading on the benchmark");
  }

  const hi = bmRL + backsightMm / 1000;
  const targetRL = hi - foresightMm / 1000;
  const diff = targetRL - bmRL;
  const rising = diff >= 0;

  return {
    headline: `Target RL ${formatNumber(targetRL, 3)} · ${rising ? "rise" : "fall"} ${formatM(Math.abs(diff), 3)}`,
    kpis: [
      { label: "Benchmark RL", value: formatNumber(bmRL, 3) },
      { label: "Height of collimation", value: formatNumber(hi, 3) },
      { label: "Target RL", value: formatNumber(targetRL, 3) },
      { label: rising ? "Rise" : "Fall", value: formatM(Math.abs(diff), 3) },
    ],
    sections: [
      {
        title: "Level run",
        rows: [
          { label: "Benchmark RL", value: formatNumber(bmRL, 3) },
          { label: "Backsight", value: formatMm(backsightMm) },
          { label: "Height of collimation (HI)", value: formatNumber(hi, 3), tone: "strong" },
          { label: "Foresight", value: formatMm(foresightMm) },
          { label: "Target RL", value: formatNumber(targetRL, 3), tone: "strong" },
          {
            label: rising ? "Rise from BM to target" : "Fall from BM to target",
            value: formatM(Math.abs(diff), 3),
            tone: rising ? "ok" : "warn",
          },
        ],
      },
    ],
    notes: [
      "Single instrument setup — one backsight, one foresight. HI = BM RL + backsight; target RL = HI − foresight.",
      "For a multi-point level run, use the target RL here as the next station's benchmark and repeat.",
      "Staff readings are in mm as read off the staff, rise upward on the staff reduces the reading.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Slope & fall — generic ratio / percent / angle, with common site checks
// ---------------------------------------------------------------------------

export const slopeFields: Field[] = [
  {
    kind: "select",
    key: "mode",
    label: "Work from",
    defaultValue: "rise-run",
    options: [
      { value: "rise-run", label: "Rise and run" },
      { value: "ratio", label: "Ratio (1 in X)" },
    ],
  },
  {
    kind: "number",
    key: "rise",
    label: "Rise / fall",
    unit: "mm",
    defaultValue: 100,
    min: 0,
    step: 1,
    showWhen: { key: "mode", in: ["rise-run"] },
  },
  {
    kind: "number",
    key: "run",
    label: "Run",
    unit: "m",
    defaultValue: 10,
    min: 0,
    step: 0.1,
    showWhen: { key: "mode", in: ["rise-run"] },
  },
  {
    kind: "number",
    key: "ratioX",
    label: "1 in",
    unit: "count",
    defaultValue: 100,
    min: 1,
    step: 1,
    showWhen: { key: "mode", in: ["ratio"] },
  },
  {
    kind: "select",
    key: "context",
    label: "Check against",
    defaultValue: "general",
    options: [
      { value: "general", label: "General — no check" },
      { value: "ramp", label: "Accessible ramp (max 1:14)" },
      { value: "path", label: "Path / walkway (max ~1:20)" },
      { value: "drainage", label: "Gravity drainage (min 1:100)" },
      { value: "paving", label: "Paving fall away from building (min 1:100)" },
    ],
  },
];

export function computeSlope(inputs: Inputs): CalcOutput {
  const mode = str(inputs.mode, "rise-run");
  const context = str(inputs.context, "general");

  let ratioX: number;
  let percent: number;
  let angle: number;

  if (mode === "ratio") {
    ratioX = Math.max(1, num(inputs.ratioX, 100));
    percent = 100 / ratioX;
    angle = Math.atan(1 / ratioX) * DEG;
  } else {
    const riseM = num(inputs.rise, 100) / 1000;
    const run = num(inputs.run, 10);
    if (run <= 0) return emptyOutput("Enter a run greater than 0");
    if (riseM <= 0) return emptyOutput("Enter a rise or fall greater than 0");
    ratioX = run / riseM;
    percent = (riseM / run) * 100;
    angle = Math.atan(riseM / run) * DEG;
  }

  const flags: CalcOutput["flags"] = [];
  if (context === "ramp") {
    flags.push(
      ratioX >= 14
        ? { tone: "ok", text: "1:14 or flatter — inside the AS1428.1 accessible-ramp maximum." }
        : { tone: "bad", text: `1:${formatNumber(ratioX, 1)} is steeper than the 1:14 accessible-ramp maximum.` },
    );
  } else if (context === "path") {
    flags.push(
      ratioX >= 20
        ? { tone: "ok", text: "1:20 or flatter — a comfortable walking grade." }
        : { tone: "warn", text: `1:${formatNumber(ratioX, 1)} is steeper than the usual 1:20 path guide.` },
    );
  } else if (context === "drainage" || context === "paving") {
    flags.push(
      ratioX <= 100
        ? { tone: "ok", text: "1:100 or steeper — enough fall for gravity drainage." }
        : { tone: "warn", text: `1:${formatNumber(ratioX, 1)} is flatter than the usual 1:100 minimum — water may pond.` },
    );
  }

  return {
    headline: `1 in ${formatNumber(ratioX, 1)} · ${formatNumber(percent, 2)}% · ${formatDeg(angle)}`,
    kpis: [
      { label: "Ratio", value: `1:${formatNumber(ratioX, 1)}` },
      { label: "Percent", value: `${formatNumber(percent, 2)}%` },
      { label: "Angle", value: formatDeg(angle) },
      { label: "Rise per metre", value: formatMm((percent / 100) * 1000, 1) },
    ],
    flags,
    sections: [
      {
        title: "Slope",
        rows: [
          { label: "Ratio", value: `1 : ${formatNumber(ratioX, 1)}`, tone: "strong" },
          { label: "Percent grade", value: `${formatNumber(percent, 2)}%`, tone: "strong" },
          { label: "Angle from horizontal", value: formatDeg(angle) },
          { label: "Rise per metre of run", value: formatMm((percent / 100) * 1000, 1) },
        ],
      },
    ],
    notes: [
      "Figures shown against a context are typical guides, not a substitute for the current code, the drawing, or the certifier.",
      "The same ratio works for a roof pitch, a ramp, a driveway grade or a drainage fall — only the acceptable range changes.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Arc / circular setout
// ---------------------------------------------------------------------------

export const arcSetoutFields: Field[] = [
  {
    kind: "select",
    key: "mode",
    label: "Work from",
    defaultValue: "chord-sagitta",
    options: [
      { value: "chord-sagitta", label: "Chord and sagitta (rise)" },
      { value: "radius-angle", label: "Radius and included angle" },
    ],
  },
  {
    kind: "number",
    key: "chord",
    label: "Chord",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["chord-sagitta"] },
  },
  {
    kind: "number",
    key: "sagitta",
    label: "Sagitta (rise at midpoint)",
    unit: "mm",
    defaultValue: 300,
    min: 1,
    step: 1,
    showWhen: { key: "mode", in: ["chord-sagitta"] },
  },
  {
    kind: "number",
    key: "radius",
    label: "Radius",
    unit: "m",
    defaultValue: 3,
    min: 0,
    step: 0.01,
    showWhen: { key: "mode", in: ["radius-angle"] },
  },
  {
    kind: "number",
    key: "angle",
    label: "Included angle",
    unit: "deg",
    defaultValue: 90,
    min: 1,
    max: 179,
    step: 0.5,
    showWhen: { key: "mode", in: ["radius-angle"] },
  },
  {
    kind: "number",
    key: "offsetInterval",
    label: "Offset interval",
    unit: "mm",
    defaultValue: 500,
    min: 10,
    step: 10,
    hint: "Spacing of the peg marks along the chord",
  },
];

export function computeArcSetout(inputs: Inputs): CalcOutput {
  const mode = str(inputs.mode, "chord-sagitta");
  const offsetInterval = Math.max(1, num(inputs.offsetInterval, 500));

  let radius: number;
  let chord: number;
  let sagitta: number;

  if (mode === "radius-angle") {
    radius = num(inputs.radius, 3);
    const angle = num(inputs.angle, 90);
    if (radius <= 0) return emptyOutput("Enter a radius greater than 0");
    if (angle <= 0 || angle >= 180) return emptyOutput("Included angle must be between 0° and 180°");
    const half = (angle * RAD) / 2;
    chord = 2 * radius * Math.sin(half);
    sagitta = radius * (1 - Math.cos(half)) * 1000;
  } else {
    chord = num(inputs.chord, 4);
    sagitta = num(inputs.sagitta, 300);
    if (chord <= 0) return emptyOutput("Enter a chord length greater than 0");
    if (sagitta <= 0) return emptyOutput("Enter a sagitta (rise) greater than 0");
    const sM = sagitta / 1000;
    radius = (chord * chord) / (8 * sM) + sM / 2;
  }

  const sM = sagitta / 1000;
  const includedAngle = 2 * Math.asin(Math.min(1, chord / 2 / radius)) * DEG;
  const arcLength = radius * (includedAngle * RAD);

  const chordMm = chord * 1000;
  const radiusM = radius;
  const nIntervals = Math.max(1, Math.round(chordMm / offsetInterval));
  const actualInterval = chordMm / nIntervals;

  const maxRows = 12;
  const offsetRows: ResultRow[] = [];
  const shown = Math.min(nIntervals + 1, maxRows);
  for (let i = 0; i < shown; i++) {
    const xMm = i * actualInterval;
    const xFromMid = xMm - chordMm / 2;
    const xFromMidM = xFromMid / 1000;
    const under = radiusM * radiusM - xFromMidM * xFromMidM;
    const offsetM = Math.sqrt(Math.max(0, under)) - (radiusM - sM);
    offsetRows.push({
      label: `${formatMm(xMm, 0)} along chord`,
      value: formatMm(Math.max(0, offsetM) * 1000, 0),
    });
  }
  if (nIntervals + 1 > maxRows) {
    offsetRows.push({ label: "…", value: `${nIntervals + 1 - maxRows} more mark(s)` });
  }

  return {
    headline: `R ${formatM(radius, 3)} · chord ${formatM(chord, 3)} · sagitta ${formatMm(sagitta, 0)}`,
    kpis: [
      { label: "Radius", value: formatM(radius, 3) },
      { label: "Chord", value: formatM(chord, 3) },
      { label: "Sagitta", value: formatMm(sagitta, 0) },
      { label: "Arc length", value: formatM(arcLength, 3) },
    ],
    sections: [
      {
        title: "Circle",
        rows: [
          { label: "Radius", value: formatM(radius, 3), tone: "strong" },
          { label: "Chord", value: formatM(chord, 3) },
          { label: "Sagitta (rise at midpoint)", value: formatMm(sagitta, 0) },
          { label: "Included angle", value: formatDeg(includedAngle) },
          { label: "Arc length", value: formatM(arcLength, 3), tone: "strong" },
        ],
      },
      { title: "Offsets from chord", rows: offsetRows },
    ],
    notes: [
      "Set a string line along the chord between the two end pegs, then measure the perpendicular offset from the string at each mark to find the curve.",
      "The midpoint offset is the sagitta — check it first with a spirit level and tape off the string line.",
    ],
  };
}

// ---------------------------------------------------------------------------
// Linear cut list — first-fit-decreasing stock optimiser
// ---------------------------------------------------------------------------

export const cutListFields: Field[] = [
  { kind: "section", label: "Stock" },
  {
    kind: "number",
    key: "stockLength",
    label: "Stock length",
    unit: "m",
    defaultValue: 5.4,
    min: 0,
    step: 0.1,
  },
  {
    kind: "number",
    key: "kerf",
    label: "Kerf / saw cut",
    unit: "mm",
    defaultValue: 3,
    min: 0,
    step: 1,
  },
  { kind: "section", label: "Cut lengths (up to 6)" },
  { kind: "number", key: "cutLength1", label: "Length 1", unit: "mm", defaultValue: 900, min: 0, step: 1 },
  { kind: "number", key: "cutQty1", label: "Qty 1", unit: "count", defaultValue: 4, min: 0, step: 1 },
  { kind: "number", key: "cutLength2", label: "Length 2", unit: "mm", defaultValue: 600, min: 0, step: 1 },
  { kind: "number", key: "cutQty2", label: "Qty 2", unit: "count", defaultValue: 6, min: 0, step: 1 },
  { kind: "number", key: "cutLength3", label: "Length 3", unit: "mm", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutQty3", label: "Qty 3", unit: "count", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutLength4", label: "Length 4", unit: "mm", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutQty4", label: "Qty 4", unit: "count", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutLength5", label: "Length 5", unit: "mm", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutQty5", label: "Qty 5", unit: "count", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutLength6", label: "Length 6", unit: "mm", defaultValue: 0, min: 0, step: 1 },
  { kind: "number", key: "cutQty6", label: "Qty 6", unit: "count", defaultValue: 0, min: 0, step: 1 },
];

type CutBin = { remaining: number; cuts: number[] };

export function computeCutList(inputs: Inputs): CalcOutput {
  const stockLength = num(inputs.stockLength, 5.4);
  const kerf = Math.max(0, num(inputs.kerf, 3));

  if (stockLength <= 0) {
    return emptyOutput("Enter a stock length");
  }

  const stockMm = stockLength * 1000;
  const slots = [1, 2, 3, 4, 5, 6].map((i) => ({
    length: num(inputs[`cutLength${i}`]),
    qty: Math.max(0, Math.round(num(inputs[`cutQty${i}`]))),
  }));
  const requested = slots.filter((s) => s.length > 0 && s.qty > 0);

  if (requested.length === 0) {
    return emptyOutput("Enter at least one cut length and quantity");
  }

  const oversize = requested.filter((s) => s.length + kerf > stockMm);
  const usable = requested.filter((s) => s.length + kerf <= stockMm);

  const items: number[] = [];
  for (const s of usable) for (let i = 0; i < s.qty; i++) items.push(s.length);
  items.sort((x, y) => y - x);

  const bins: CutBin[] = [];
  for (const len of items) {
    const bin = bins.find((b) => b.remaining >= len + kerf);
    if (bin) {
      bin.remaining -= len + kerf;
      bin.cuts.push(len);
    } else {
      bins.push({ remaining: stockMm - (len + kerf), cuts: [len] });
    }
  }

  const totalPieces = items.length;
  const totalStock = bins.length;
  const totalOffcut = bins.reduce((sum, b) => sum + Math.max(0, b.remaining), 0);
  const usedMm = totalStock * stockMm;
  const wastePct = usedMm > 0 ? (totalOffcut / usedMm) * 100 : 0;

  const flags: CalcOutput["flags"] = [];
  if (oversize.length > 0) {
    const n = oversize.reduce((sum, s) => sum + s.qty, 0);
    flags.push({
      tone: "bad",
      text: `${formatCount(n, "piece(s)")} longer than the stock length — excluded from the plan.`,
    });
  }

  const maxRows = 10;
  const binRows: ResultRow[] = bins.slice(0, maxRows).map((bin, i) => ({
    label: `Length ${i + 1}`,
    value: bin.cuts.map((c) => formatMm(c)).join(" + "),
    hint: `Offcut ${formatMm(bin.remaining)}`,
  }));
  if (bins.length > maxRows) {
    binRows.push({ label: "…", value: `${bins.length - maxRows} more length(s), same method` });
  }

  return {
    headline: `${formatCount(totalStock, "lengths")} · ${formatNumber(wastePct, 1)}% waste`,
    kpis: [
      { label: "Stock lengths", value: formatNumber(totalStock, 0) },
      { label: "Total pieces", value: formatNumber(totalPieces, 0) },
      { label: "Waste", value: `${formatNumber(wastePct, 1)}%` },
      { label: "Offcut total", value: formatMm(totalOffcut) },
    ],
    flags,
    sections: [{ title: "Cutting plan", rows: binRows }],
    order: [
      { item: `Stock @ ${formatM(stockLength, 2)}`, qty: formatCount(totalStock, "lengths") },
    ],
    notes: [
      "First-fit-decreasing packing — a good, fast approximation, not always the mathematical optimum.",
      "Kerf is added to every cut including the last one in a length, so real waste is usually a touch less than shown.",
      "Need more than 6 distinct lengths? Run this again for the rest and add the stock counts together.",
    ],
  };
}
