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
import { computeCorrugated, computePitch, corrugatedFields, pitchFields } from "./roof.ts";
import {
  brickFields,
  computeBrick,
  computeExcavation,
  computeFencing,
  excavationFields,
  fencingFields,
} from "./site.ts";
import { computeStairs, stairsFields } from "./stairs.ts";
import type { Calculator, Field, Inputs } from "./types.ts";

export const calculators: Calculator[] = [
  {
    slug: "decking",
    name: "Decking",
    short: "Boards, joists, bearers, posts",
    category: "Structure",
    featured: true,
    compute: computeDecking,
    fields: deckingFields,
  },
  {
    slug: "corrugated",
    name: "Corrugated roof",
    short: "Sheets, slope, flashings",
    category: "Roof",
    featured: true,
    compute: computeCorrugated,
    fields: corrugatedFields,
  },
  {
    slug: "pitch",
    name: "Roof pitch",
    short: "Rise, run, rafter, hip",
    category: "Roof",
    featured: true,
    compute: computePitch,
    fields: pitchFields,
  },
  {
    slug: "stairs",
    name: "Stairs",
    short: "Risers, goings, stringers",
    category: "Structure",
    featured: true,
    compute: computeStairs,
    fields: stairsFields,
  },
  {
    slug: "balustrade",
    name: "Balustrade",
    short: "Posts, infill, handrail",
    category: "Structure",
    featured: true,
    compute: computeBalustrade,
    fields: balustradeFields,
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
    slug: "framing",
    name: "Wall framing",
    short: "Studs, plates, nogs",
    category: "Structure",
    compute: computeFraming,
    fields: framingFields,
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
    slug: "fencing",
    name: "Fencing",
    short: "Posts, rails, palings",
    category: "Site",
    compute: computeFencing,
    fields: fencingFields,
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
    slug: "excavation",
    name: "Excavation",
    short: "Cut, spoil, truck loads",
    category: "Site",
    compute: computeExcavation,
    fields: excavationFields,
  },
];

export const categories = ["Structure", "Roof", "Wet trades", "Site", "Fit-out"] as const;

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
