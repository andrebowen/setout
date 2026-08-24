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
} from "./format.ts";

export const concreteFields: Field[] = [
  {
    kind: "select",
    key: "shape",
    label: "Pour",
    defaultValue: "slab",
    options: [
      { value: "slab", label: "Slab" },
      { value: "strip", label: "Strip footing" },
      { value: "pier-round", label: "Round piers" },
      { value: "pier-square", label: "Square piers" },
    ],
  },
  {
    kind: "number",
    key: "length",
    label: "Length",
    unit: "m",
    defaultValue: 6,
    min: 0,
    step: 0.1,
    showWhen: { key: "shape", in: ["slab", "strip"] },
  },
  {
    kind: "number",
    key: "width",
    label: "Width",
    unit: "m",
    defaultValue: 4,
    min: 0,
    step: 0.1,
    showWhen: { key: "shape", in: ["slab"] },
  },
  {
    kind: "number",
    key: "footingWidth",
    label: "Trench width",
    unit: "mm",
    defaultValue: 300,
    min: 100,
    step: 10,
    showWhen: { key: "shape", in: ["strip"] },
  },
  {
    kind: "number",
    key: "thickness",
    label: "Thickness / depth",
    unit: "mm",
    defaultValue: 100,
    min: 50,
    step: 5,
    presets: [
      { label: "100", value: 100 },
      { label: "125", value: 125 },
      { label: "150", value: 150 },
      { label: "200", value: 200 },
      { label: "300", value: 300 },
    ],
  },
  {
    kind: "number",
    key: "diameter",
    label: "Diameter",
    unit: "mm",
    defaultValue: 300,
    min: 100,
    step: 10,
    showWhen: { key: "shape", in: ["pier-round"] },
  },
  {
    kind: "number",
    key: "pierSize",
    label: "Pier size",
    unit: "mm",
    defaultValue: 300,
    min: 100,
    step: 10,
    showWhen: { key: "shape", in: ["pier-square"] },
  },
  {
    kind: "number",
    key: "count",
    label: "Number of piers",
    unit: "count",
    defaultValue: 6,
    min: 1,
    step: 1,
    showWhen: { key: "shape", in: ["pier-round", "pier-square"] },
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
    key: "bagKg",
    label: "Bag size",
    unit: "kg",
    defaultValue: 20,
    min: 10,
    step: 5,
    presets: [
      { label: "20 kg", value: 20 },
      { label: "30 kg", value: 30 },
    ],
    hint: "Rule of thumb: 20 kg bag ≈ 0.01 m³",
  },
];

export function computeConcrete(inputs: Inputs): CalcOutput {
  const shape = str(inputs.shape, "slab");
  const length = num(inputs.length);
  const width = num(inputs.width);
  const footingWidth = num(inputs.footingWidth, 300);
  const thickness = num(inputs.thickness, 100);
  const diameter = num(inputs.diameter, 300);
  const pierSize = num(inputs.pierSize, 300);
  const count = Math.max(1, Math.round(num(inputs.count, 6)));
  const waste = num(inputs.waste, 10);
  const bagKg = num(inputs.bagKg, 20);

  const depthM = thickness / 1000;
  let net = 0;
  let plan = 0;
  let shapeHint = "";

  if (shape === "slab") {
    if (length <= 0 || width <= 0 || depthM <= 0) {
      return emptyOutput("Enter slab length, width and thickness");
    }
    plan = length * width;
    net = plan * depthM;
    shapeHint = `${formatM(length, 2)} × ${formatM(width, 2)} × ${formatMm(thickness)}`;
  } else if (shape === "strip") {
    if (length <= 0 || footingWidth <= 0 || depthM <= 0) {
      return emptyOutput("Enter footing length, width and depth");
    }
    plan = length * (footingWidth / 1000);
    net = plan * depthM;
    shapeHint = `${formatM(length, 2)} × ${formatMm(footingWidth)} × ${formatMm(thickness)}`;
  } else if (shape === "pier-round") {
    if (diameter <= 0 || depthM <= 0) {
      return emptyOutput("Enter pier diameter and depth");
    }
    const r = diameter / 2000;
    const one = Math.PI * r * r * depthM;
    net = one * count;
    plan = Math.PI * r * r * count;
    shapeHint = `${formatNumber(count, 0)} Ø${formatMm(diameter)} × ${formatMm(thickness)}`;
  } else {
    if (pierSize <= 0 || depthM <= 0) {
      return emptyOutput("Enter pier size and depth");
    }
    const s = pierSize / 1000;
    const one = s * s * depthM;
    net = one * count;
    plan = s * s * count;
    shapeHint = `${formatNumber(count, 0)} ${formatMm(pierSize)} sq × ${formatMm(thickness)}`;
  }

  const orderVol = net * (1 + waste / 100);
  const yieldM3 = 0.01 * (bagKg / 20);
  const bags = Math.ceil(orderVol / yieldM3 - 1e-9);
  const meshSheets =
    shape === "slab" && plan > 0 ? Math.ceil((plan * 1.1) / 14.4 - 1e-9) : 0;
  const barChairs = shape === "slab" ? Math.ceil(plan * 1.2) : 0;

  const flags: CalcOutput["flags"] = [];
  if (orderVol >= 0.4) {
    flags.push({
      tone: "ok",
      text: "Over ~0.4 m³ a truck is usually cheaper than bags. Round the order up to the next 0.2 m³.",
    });
  }

  const rows = [
    { label: "Net volume", value: formatM3(net, 3) },
    {
      label: `Order with ${formatNumber(waste, 0)}% waste`,
      value: formatM3(orderVol, 3),
      tone: "strong" as const,
    },
    {
      label: `${formatNumber(bagKg, 0)} kg bags (allow)`,
      value: formatCount(bags, "bags"),
      hint: `${formatM3(yieldM3, 3)} yield per bag`,
    },
  ];
  if (plan > 0) {
    rows.unshift({ label: "Plan area", value: formatM2(plan) });
  }
  if (meshSheets > 0) {
    rows.push({
      label: "SL72 mesh sheets (allow)",
      value: formatCount(meshSheets, "sheets"),
      hint: "6.0 × 2.4 m sheets, ~10% for laps",
    });
    rows.push({
      label: "Bar chairs (allow)",
      value: formatCount(barChairs, "pcs"),
      hint: "About 1.2 per m²",
    });
  }

  const order = [
    { item: "Concrete", qty: formatM3(orderVol, 3) },
    { item: `${formatNumber(bagKg, 0)} kg bags`, qty: formatCount(bags, "bags") },
  ];
  if (meshSheets > 0) {
    order.push({ item: "Mesh 6.0 × 2.4", qty: formatCount(meshSheets, "sheets") });
    order.push({ item: "Bar chairs", qty: formatCount(barChairs, "pcs") });
  }

  return {
    headline: `${formatM3(orderVol, 3)} to order · ${shapeHint}`,
    kpis: [
      { label: "Net", value: formatM3(net, 3) },
      { label: "Order", value: formatM3(orderVol, 3) },
      { label: "Bags", value: formatNumber(bags, 0) },
      { label: "Area", value: formatM2(plan) },
    ],
    flags,
    sections: [{ title: "Pour", rows }],
    order,
    notes: [
      "Bag yield is a hardware-store rule of thumb (20 kg ≈ 0.01 m³). Check the bag.",
      "Truck orders are usually in 0.2 m³ steps. Don't under-order a slab.",
      "Add edge thickenings, beams and pour losses on top of the flat volume.",
    ],
  };
}
