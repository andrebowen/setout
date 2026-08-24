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
} from "./format.ts";

export const stairsFields: Field[] = [
  { kind: "section", label: "Flight" },
  {
    kind: "number",
    key: "totalRise",
    label: "Total rise",
    unit: "m",
    defaultValue: 2.7,
    min: 0,
    step: 0.01,
    hint: "Finished floor to finished floor",
  },
  {
    kind: "number",
    key: "totalGoing",
    label: "Total going",
    unit: "m",
    defaultValue: 0,
    min: 0,
    step: 0.01,
    hint: "Leave 0 to size going from 2R+G",
  },
  {
    kind: "number",
    key: "width",
    label: "Clear width",
    unit: "m",
    defaultValue: 1,
    min: 0.6,
    step: 0.05,
  },
  {
    kind: "number",
    key: "targetRiser",
    label: "Target riser",
    unit: "mm",
    defaultValue: 175,
    min: 115,
    max: 190,
    step: 1,
    presets: [
      { label: "160", value: 160 },
      { label: "170", value: 170 },
      { label: "175", value: 175 },
      { label: "180", value: 180 },
    ],
  },
];

const MIN_RISER = 115;
const MAX_RISER = 190;
const MIN_GOING = 240;
const MAX_GOING = 355;
const MIN_2RG = 550;
const MAX_2RG = 700;

export function computeStairs(inputs: Inputs): CalcOutput {
  const totalRise = num(inputs.totalRise);
  const totalGoingIn = num(inputs.totalGoing);
  const width = num(inputs.width, 1);
  const targetRiser = num(inputs.targetRiser, 175);

  const riseMm = totalRise * 1000;
  if (riseMm <= 0) {
    return emptyOutput("Enter total rise");
  }

  let nRisers = Math.max(2, Math.round(riseMm / Math.max(targetRiser, 1)));
  let riser = riseMm / nRisers;
  while (riser > MAX_RISER + 1e-6) {
    nRisers += 1;
    riser = riseMm / nRisers;
  }
  while (riser < MIN_RISER - 1e-6 && nRisers > 2) {
    nRisers -= 1;
    riser = riseMm / nRisers;
  }

  const nGoings = nRisers - 1;
  let going: number;
  let goingMode: "fixed" | "auto";
  if (totalGoingIn > 0 && nGoings > 0) {
    going = (totalGoingIn * 1000) / nGoings;
    goingMode = "fixed";
  } else {
    const target2RG = 650;
    going = target2RG - 2 * riser;
    going = Math.min(MAX_GOING, Math.max(MIN_GOING, going));
    goingMode = "auto";
  }

  const twoRG = 2 * riser + going;
  const pitch = (Math.atan(riser / going) * 180) / Math.PI;
  const totalGoing = (nGoings * going) / 1000;
  const stringer = (nGoings * Math.hypot(going, riser)) / 1000;
  const treadArea = nGoings * (going / 1000) * width;
  const riserArea = nRisers * (riser / 1000) * width;

  const flags: CalcOutput["flags"] = [];
  const riserOk = riser >= MIN_RISER - 0.05 && riser <= MAX_RISER + 0.05;
  const goingOk = going >= MIN_GOING - 0.05 && going <= MAX_GOING + 0.05;
  const twoOk = twoRG >= MIN_2RG - 0.05 && twoRG <= MAX_2RG + 0.05;

  if (riserOk && goingOk && twoOk) {
    flags.push({
      tone: "ok",
      text: "Riser, going and 2R+G sit inside typical NCC domestic ranges.",
    });
  }
  if (!riserOk) {
    flags.push({
      tone: "bad",
      text: `Riser ${formatMm(riser, 1)} is outside 115–190 mm.`,
    });
  }
  if (!goingOk) {
    flags.push({
      tone: goingMode === "fixed" ? "bad" : "warn",
      text: `Going ${formatMm(going, 1)} is outside 240–355 mm.`,
    });
  }
  if (!twoOk) {
    flags.push({
      tone: "warn",
      text: `2R+G is ${formatMm(twoRG, 1)} (typical 550–700 mm).`,
    });
  }
  if (nRisers > 18) {
    flags.push({
      tone: "warn",
      text: `${nRisers} risers — a landing is usually required after 18.`,
    });
  }

  return {
    headline: `${formatNumber(nRisers, 0)} risers @ ${formatMm(riser, 1)} · going ${formatMm(going, 1)}`,
    kpis: [
      { label: "Risers", value: formatNumber(nRisers, 0) },
      { label: "Riser", value: formatMm(riser, 1) },
      { label: "Going", value: formatMm(going, 1) },
      { label: "Pitch", value: formatDeg(pitch) },
    ],
    flags,
    sections: [
      {
        title: "Geometry",
        rows: [
          { label: "Number of risers", value: formatCount(nRisers, "risers"), tone: "strong" },
          { label: "Number of goings / treads", value: formatCount(nGoings, "treads") },
          {
            label: "Riser",
            value: formatMm(riser, 1),
            tone: riserOk ? "ok" : "warn",
            hint: "Typical 115–190 mm",
          },
          {
            label: "Going",
            value: formatMm(going, 1),
            tone: goingOk ? "ok" : "warn",
            hint:
              goingMode === "auto"
                ? "Auto-sized so 2R+G ≈ 650 mm"
                : "From the total going you entered",
          },
          {
            label: "2R + G",
            value: formatMm(twoRG, 1),
            tone: twoOk ? "ok" : "warn",
            hint: "Typical 550–700 mm",
          },
          { label: "Pitch", value: formatDeg(pitch) },
          { label: "Total going", value: formatM(totalGoing, 3), tone: "strong" },
        ],
      },
      {
        title: "Cutting list",
        rows: [
          {
            label: "Stringer length (nosing line)",
            value: formatM(stringer, 3),
            tone: "strong",
            hint: "Two stringers. Add extra for landings and plumb cuts.",
          },
          { label: "Treads", value: formatCount(nGoings, "pcs") },
          { label: "Risers (if closed)", value: formatCount(nRisers, "pcs") },
          { label: "Tread area (allow)", value: formatM2(treadArea) },
          { label: "Riser area (allow)", value: formatM2(riserArea) },
          { label: "Clear width", value: formatM(width, 2) },
        ],
      },
    ],
    order: [
      { item: "Stringers", qty: `2 pcs · ${formatM(stringer, 3)}` },
      { item: "Treads", qty: formatCount(nGoings, "pcs") },
      { item: "Risers", qty: formatCount(nRisers, "pcs") },
    ],
    notes: [
      "Ranges shown are typical NCC domestic figures (115–190 mm riser, 240–355 mm going, 2R+G 550–700 mm). Confirm against the current code, the drawing and the certifier.",
      "First riser is from the lower floor; number of treads is one less than risers in a single straight flight.",
      "Check headroom (usually 2.0 m min) and a landing if the flight is long.",
    ],
    diagram: {
      type: "stairs",
      totalRise,
      totalGoing,
      riser: riser / 1000,
      going: going / 1000,
      nRisers,
    },
  };
}
