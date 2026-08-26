import { computeBalustrade, balustradeFields } from "./balustrade.ts";
import { computeConcrete, concreteFields } from "./concrete.ts";
import { computeDecking, deckingFields } from "./decking.ts";
import {
  computeFlooring,
  computePaint,
  computePlaster,
  computeTiling,
  flooringFields,
  paintFields,
  plasterFields,
  tilingFields,
} from "./fitout.ts";
import { computeFraming, framingFields } from "./framing.ts";
import {
  arcSetoutFields,
  checkSquareFields,
  computeArcSetout,
  computeCheckSquare,
  computeCutList,
  computeEqualSpacing,
  computeLevelling,
  computeMitreAngle,
  computeSlope,
  computeTriangle,
  cutListFields,
  equalSpacingFields,
  levellingFields,
  mitreAngleFields,
  slopeFields,
  triangleFields,
} from "./measuring.ts";
import { computeCorrugated, computePitch, corrugatedFields, pitchFields } from "./roof.ts";
import {
  brickFields,
  computeBrick,
  computeFencing,
  computeSiteVolume,
  fencingFields,
  siteVolumeFields,
} from "./site.ts";
import { computeStairs, stairsFields } from "./stairs.ts";
import type { Calculator, Field, Inputs } from "./types.ts";

export const calculators: Calculator[] = [
  {
    slug: "decking",
    name: "Decking",
    short: "Boards, joists, bearers, posts",
    category: "Carpentry",
    featured: true,
    compute: computeDecking,
    fields: deckingFields,
  },
  {
    slug: "stairs",
    name: "Stairs",
    short: "Risers, goings, stringers",
    category: "Carpentry",
    featured: true,
    compute: computeStairs,
    fields: stairsFields,
  },
  {
    slug: "wall-framing",
    name: "Wall framing",
    short: "Studs, plates, nogs",
    category: "Carpentry",
    compute: computeFraming,
    fields: framingFields,
  },
  {
    slug: "balustrade",
    name: "Balustrade",
    short: "Posts, infill, handrail",
    category: "Carpentry",
    featured: true,
    compute: computeBalustrade,
    fields: balustradeFields,
  },
  {
    slug: "corrugated",
    name: "Corrugated roof",
    short: "Sheets, slope, flashings",
    category: "Roofing",
    featured: true,
    compute: computeCorrugated,
    fields: corrugatedFields,
  },
  {
    slug: "pitch",
    name: "Roof pitch",
    short: "Rise, run, rafter, hip",
    category: "Roofing",
    featured: true,
    compute: computePitch,
    fields: pitchFields,
  },
  {
    slug: "concrete",
    name: "Concrete",
    short: "Slabs, footings, piers, bags",
    category: "Wet trades",
    compute: computeConcrete,
    fields: concreteFields,
  },
  {
    slug: "brickwork",
    name: "Brickwork",
    short: "Bricks, mortar, waste",
    category: "Wet trades",
    compute: computeBrick,
    fields: brickFields,
  },
  {
    slug: "fencing",
    name: "Fencing",
    short: "Posts, rails, palings",
    category: "Site",
    compute: computeFencing,
    fields: fencingFields,
  },
  {
    slug: "site-volume",
    name: "Site volume & tonnage",
    short: "Excavation, gravel, soil, mulch, asphalt",
    category: "Site",
    compute: computeSiteVolume,
    fields: siteVolumeFields,
  },
  {
    slug: "flooring",
    name: "Flooring",
    short: "Boards, packs, waste",
    category: "Fit-out",
    compute: computeFlooring,
    fields: flooringFields,
  },
  {
    slug: "tiling",
    name: "Tiling",
    short: "Tiles, adhesive, grout",
    category: "Fit-out",
    compute: computeTiling,
    fields: tilingFields,
  },
  {
    slug: "paint",
    name: "Paint",
    short: "Walls, coats, litres",
    category: "Fit-out",
    compute: computePaint,
    fields: paintFields,
  },
  {
    slug: "plasterboard",
    name: "Plasterboard",
    short: "Sheets, tape, compound",
    category: "Fit-out",
    compute: computePlaster,
    fields: plasterFields,
  },
  {
    slug: "check-square",
    name: "Check square",
    short: "3-4-5 & diagonal check",
    category: "Setout & Measuring",
    featured: true,
    compute: computeCheckSquare,
    fields: checkSquareFields,
  },
  {
    slug: "equal-spacing",
    name: "Equal spacing",
    short: "Divide a run, or mark a fixed increment",
    category: "Setout & Measuring",
    featured: true,
    compute: computeEqualSpacing,
    fields: equalSpacingFields,
  },
  {
    slug: "slope",
    name: "Slope & fall",
    short: "Ratio, percent, angle",
    category: "Setout & Measuring",
    compute: computeSlope,
    fields: slopeFields,
  },
  {
    slug: "arc-setout",
    name: "Arc setout",
    short: "Radius, chord, offsets",
    category: "Setout & Measuring",
    compute: computeArcSetout,
    fields: arcSetoutFields,
  },
  {
    slug: "levelling",
    name: "Level survey",
    short: "Backsight, foresight, RL",
    category: "Setout & Measuring",
    compute: computeLevelling,
    fields: levellingFields,
  },
  {
    slug: "triangle",
    name: "Triangle",
    short: "Right, SSS or SAS solver",
    category: "Setout & Measuring",
    compute: computeTriangle,
    fields: triangleFields,
  },
  {
    slug: "mitre-angle",
    name: "Mitre angle",
    short: "Saw angle from corner",
    category: "Setout & Measuring",
    compute: computeMitreAngle,
    fields: mitreAngleFields,
  },
  {
    slug: "cut-list",
    name: "Cut list",
    short: "Optimise cuts from stock lengths",
    category: "Setout & Measuring",
    compute: computeCutList,
    fields: cutListFields,
  },
];

export const categories = [
  "Carpentry",
  "Roofing",
  "Wet trades",
  "Site",
  "Fit-out",
  "Setout & Measuring",
] as const;

export function getCalculator(slug: string): Calculator | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function defaultsFor(fields: Field[]): Inputs {
  const out: Inputs = {};
  for (const field of fields) {
    if (field.kind === "number") out[field.key] = field.defaultValue;
    if (field.kind === "select") out[field.key] = field.defaultValue;
  }
  return out;
}

export function isFieldVisible(field: Field, inputs: Inputs): boolean {
  if (!field.showWhen) return true;
  const v = String(inputs[field.showWhen.key] ?? "");
  return field.showWhen.in.includes(v);
}
