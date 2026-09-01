"use strict";
var SetoutCalc = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/lib/calc/index.ts
  var index_exports = {};
  __export(index_exports, {
    calculators: () => calculators,
    categories: () => categories,
    categoryFromSlug: () => categoryFromSlug,
    categorySlug: () => categorySlug,
    ceilTo: () => ceilTo,
    countInclusive: () => countInclusive,
    defaultsFor: () => defaultsFor,
    emptyOutput: () => emptyOutput,
    formatCount: () => formatCount,
    formatDeg: () => formatDeg,
    formatKg: () => formatKg,
    formatL: () => formatL,
    formatM: () => formatM,
    formatM2: () => formatM2,
    formatM3: () => formatM3,
    formatMm: () => formatMm,
    formatNumber: () => formatNumber,
    getCalculator: () => getCalculator,
    isFieldVisible: () => isFieldVisible,
    isSetoutMath: () => isSetoutMath,
    mToMm: () => mToMm,
    mmToM: () => mmToM,
    num: () => num,
    roundTo: () => roundTo,
    str: () => str
  });

  // src/lib/calc/types.ts
  function isSetoutMath(calc) {
    return calc.kind === "setout";
  }

  // src/lib/calc/format.ts
  function num(v, fallback = 0) {
    if (typeof v === "number") return Number.isFinite(v) ? v : fallback;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
  }
  function str(v, fallback = "") {
    if (typeof v === "string" && v.length > 0) return v;
    if (typeof v === "number") return String(v);
    return fallback;
  }
  function roundTo(n, digits) {
    const f = 10 ** digits;
    return Math.round(n * f) / f;
  }
  function ceilTo(n, step) {
    if (step <= 0) return n;
    return Math.ceil(n / step - 1e-9) * step;
  }
  function formatNumber(n, digits = 2) {
    if (!Number.isFinite(n)) return "\u2014";
    return n.toLocaleString("en-AU", {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0
    });
  }
  function formatMm(n, digits = 0) {
    return `${formatNumber(n, digits)} mm`;
  }
  function formatM(n, digits = 3) {
    return `${formatNumber(n, digits)} m`;
  }
  function formatM2(n, digits = 2) {
    return `${formatNumber(n, digits)} m\xB2`;
  }
  function formatM3(n, digits = 3) {
    return `${formatNumber(n, digits)} m\xB3`;
  }
  function formatL(n, digits = 1) {
    return `${formatNumber(n, digits)} L`;
  }
  function formatKg(n, digits = 0) {
    return `${formatNumber(n, digits)} kg`;
  }
  function formatDeg(n, digits = 1) {
    return `${formatNumber(n, digits)}\xB0`;
  }
  function formatCount(n, unit) {
    const rounded = Math.round(n);
    return `${formatNumber(rounded, 0)} ${unit}`;
  }
  function countInclusive(lengthMm, spacingMm) {
    if (spacingMm <= 0 || lengthMm <= 0) return 2;
    return Math.max(2, Math.ceil(lengthMm / spacingMm - 1e-9) + 1);
  }
  function mmToM(mm) {
    return mm / 1e3;
  }
  function mToMm(m) {
    return m * 1e3;
  }
  function emptyOutput(message) {
    return {
      headline: message,
      kpis: [],
      sections: [],
      notes: [],
      order: [],
      flags: []
    };
  }

  // src/lib/calc/balustrade.ts
  var balustradeFields = [
    { kind: "section", label: "Run" },
    {
      kind: "number",
      key: "length",
      label: "Length",
      unit: "m",
      defaultValue: 8,
      min: 0,
      step: 0.1
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
        { label: "1100", value: 1.1 }
      ],
      hint: "1.0 m typical on decks with a fall over 1 m"
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
        { label: "1800", value: 1800 }
      ]
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
        { value: "rails", label: "Horizontal rails" }
      ]
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
      showWhen: { key: "infill", in: ["verticals", "rails"] }
    },
    {
      kind: "number",
      key: "balusterWidth",
      label: "Baluster width",
      unit: "mm",
      defaultValue: 40,
      min: 8,
      step: 1,
      showWhen: { key: "infill", in: ["verticals"] }
    },
    {
      kind: "number",
      key: "glassWidth",
      label: "Glass panel width",
      unit: "mm",
      defaultValue: 1e3,
      min: 300,
      step: 10,
      showWhen: { key: "infill", in: ["glass"] }
    },
    {
      kind: "number",
      key: "wireSpacing",
      label: "Wire centres",
      unit: "mm",
      defaultValue: 80,
      min: 40,
      step: 5,
      showWhen: { key: "infill", in: ["wire"] }
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
      showWhen: { key: "infill", in: ["rails"] }
    }
  ];
  function computeBalustrade(inputs) {
    const length = num(inputs.length);
    const height = num(inputs.height, 1);
    const postSpacing = num(inputs.postSpacing, 1200);
    const infill = str(inputs.infill, "verticals");
    const maxGap = num(inputs.maxGap, 125);
    const balusterWidth = num(inputs.balusterWidth, 40);
    const glassWidth = num(inputs.glassWidth, 1e3);
    const wireSpacing = num(inputs.wireSpacing, 80);
    const railCount = num(inputs.railCount, 3);
    if (length <= 0) {
      return emptyOutput("Enter balustrade length");
    }
    const nPosts = countInclusive(length * 1e3, postSpacing);
    const actualPost = nPosts > 1 ? length * 1e3 / (nPosts - 1) : 0;
    const bays = nPosts - 1;
    const bayM = length / bays;
    const handrail = length;
    const postLin = nPosts * height;
    const flags = [];
    if (height + 1e-6 < 1) {
      flags.push({
        tone: "warn",
        text: "Height under 1.0 m \u2014 check if this is a stair (often 865 mm) or a deck that needs 1000 mm."
      });
    } else {
      flags.push({
        tone: "ok",
        text: "1.0 m+ is the usual minimum where the fall is more than 1 m."
      });
    }
    const infillRows = [];
    const order = [
      { item: "Posts", qty: formatCount(nPosts, "pcs") },
      { item: "Handrail", qty: formatM(handrail, 2) }
    ];
    if (infill === "verticals") {
      const pitch = balusterWidth + maxGap;
      const perBay = Math.max(1, Math.ceil((bayM * 1e3 - balusterWidth) / pitch - 1e-9));
      const nBalusters = perBay * bays;
      const actualGap = perBay > 0 ? (bayM * 1e3 - perBay * balusterWidth) / (perBay + 1) : maxGap;
      infillRows.push(
        {
          label: "Balusters",
          value: formatCount(nBalusters, "pcs"),
          tone: "strong",
          hint: `${formatNumber(perBay, 0)} per bay`
        },
        {
          label: "Opening (approx.)",
          value: formatMm(actualGap, 0),
          tone: actualGap <= maxGap + 0.5 ? "ok" : "warn",
          hint: `Target max ${formatMm(maxGap)}`
        }
      );
      order.push({ item: "Balusters", qty: formatCount(nBalusters, "pcs") });
      if (actualGap > maxGap + 0.5) {
        flags.push({
          tone: "bad",
          text: `Opening ${formatMm(actualGap, 0)} exceeds the ${formatMm(maxGap)} limit \u2014 tighten centres.`
        });
      }
    } else if (infill === "glass") {
      const nPanels = Math.max(bays, Math.ceil(length * 1e3 / glassWidth - 1e-9));
      infillRows.push({
        label: "Glass panels",
        value: formatCount(nPanels, "pcs"),
        tone: "strong",
        hint: `Aim ${formatMm(glassWidth)} wide \xB7 ${formatM(height, 2)} high. Confirm clamps / spigots.`
      });
      order.push({
        item: `Glass ${formatMm(glassWidth)} \xD7 ${formatM(height, 2)}`,
        qty: formatCount(nPanels, "pcs")
      });
    } else if (infill === "wire") {
      const nWires = Math.max(1, Math.floor(height * 1e3 / wireSpacing) + 1);
      const wireLin = nWires * length;
      infillRows.push(
        {
          label: "Wires",
          value: formatCount(nWires, "runs"),
          tone: "strong",
          hint: `@ ${formatMm(wireSpacing)} centres`
        },
        { label: "Wire linear", value: formatM(wireLin, 2) }
      );
      order.push({ item: "Wire / cable", qty: `${formatCount(nWires, "runs")} \xB7 ${formatM(wireLin, 2)}` });
      if (wireSpacing > 125) {
        flags.push({
          tone: "warn",
          text: "Wire centres over 125 mm may fail the sphere test \u2014 check the system."
        });
      }
    } else {
      const railLin = railCount * length;
      infillRows.push({
        label: "Infill rails",
        value: `${formatNumber(railCount, 0)} \xD7 ${formatM(length, 2)}`,
        tone: "strong",
        hint: formatM(railLin, 2)
      });
      order.push({ item: "Infill rails", qty: formatM(railLin, 2) });
    }
    return {
      headline: `${formatCount(nPosts, "posts")} \xB7 ${formatM(handrail, 2)} handrail`,
      kpis: [
        { label: "Posts", value: formatNumber(nPosts, 0) },
        { label: "Centres", value: formatMm(actualPost, 0) },
        { label: "Handrail", value: formatM(handrail, 2) },
        { label: "Height", value: formatM(height, 2) }
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
              hint: `${formatNumber(bays, 0)} bays @ ${formatMm(actualPost, 0)}`
            },
            { label: "Post height (allow)", value: formatM(height, 2) },
            { label: "Post linear", value: formatM(postLin, 2) },
            { label: "Handrail", value: formatM(handrail, 2), tone: "strong" }
          ]
        },
        { title: "Infill", rows: infillRows }
      ],
      order,
      notes: [
        "Typical domestic: 1000 mm high where the fall exceeds 1 m; 865 mm beside stairs. Openings usually must not pass a 125 mm sphere.",
        "Post centres are a max \u2014 the run is divided evenly so both ends land on a post.",
        "Confirm the system (load, fixings, glass thickness) with the manufacturer and the drawing."
      ],
      diagram: {
        type: "balustrade",
        length,
        height,
        nPosts,
        infill
      }
    };
  }

  // src/lib/calc/concrete.ts
  var concreteFields = [
    {
      kind: "select",
      key: "shape",
      label: "Pour",
      defaultValue: "slab",
      options: [
        { value: "slab", label: "Slab" },
        { value: "strip", label: "Strip footing" },
        { value: "pier-round", label: "Round piers" },
        { value: "pier-square", label: "Square piers" }
      ]
    },
    {
      kind: "number",
      key: "length",
      label: "Length",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.1,
      showWhen: { key: "shape", in: ["slab", "strip"] }
    },
    {
      kind: "number",
      key: "width",
      label: "Width",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.1,
      showWhen: { key: "shape", in: ["slab"] }
    },
    {
      kind: "number",
      key: "footingWidth",
      label: "Trench width",
      unit: "mm",
      defaultValue: 300,
      min: 100,
      step: 10,
      showWhen: { key: "shape", in: ["strip"] }
    },
    {
      kind: "number",
      key: "thickness",
      label: "Thickness",
      unit: "mm",
      defaultValue: 100,
      min: 50,
      step: 5,
      presets: [
        { label: "100", value: 100 },
        { label: "125", value: 125 },
        { label: "150", value: 150 },
        { label: "200", value: 200 },
        { label: "300", value: 300 }
      ],
      showWhen: { key: "shape", in: ["slab", "strip"] }
    },
    {
      kind: "number",
      key: "diameter",
      label: "Diameter",
      unit: "mm",
      defaultValue: 300,
      min: 100,
      step: 10,
      showWhen: { key: "shape", in: ["pier-round"] }
    },
    {
      kind: "number",
      key: "pierLength",
      label: "Length",
      unit: "mm",
      defaultValue: 300,
      min: 100,
      step: 10,
      showWhen: { key: "shape", in: ["pier-square"] }
    },
    {
      kind: "number",
      key: "pierWidth",
      label: "Width",
      unit: "mm",
      defaultValue: 300,
      min: 100,
      step: 10,
      showWhen: { key: "shape", in: ["pier-square"] }
    },
    {
      kind: "number",
      key: "thickness",
      label: "Depth",
      unit: "mm",
      defaultValue: 100,
      min: 50,
      step: 5,
      showWhen: { key: "shape", in: ["pier-round", "pier-square"] }
    },
    {
      kind: "number",
      key: "count",
      label: "Number of piers",
      unit: "count",
      defaultValue: 6,
      min: 1,
      step: 1,
      showWhen: { key: "shape", in: ["pier-round", "pier-square"] }
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 10,
      min: 0,
      max: 30,
      step: 1
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
        { label: "30 kg", value: 30 }
      ],
      hint: "Rule of thumb: 20 kg bag \u2248 0.01 m\xB3"
    }
  ];
  function computeConcrete(inputs) {
    const shape = str(inputs.shape, "slab");
    const length = num(inputs.length);
    const width = num(inputs.width);
    const footingWidth = num(inputs.footingWidth, 300);
    const thickness = num(inputs.thickness, 100);
    const diameter = num(inputs.diameter, 300);
    const pierLength = num(inputs.pierLength, num(inputs.pierSize, 300));
    const pierWidth = num(inputs.pierWidth, pierLength);
    const count = Math.max(1, Math.round(num(inputs.count, 6)));
    const waste = num(inputs.waste, 10);
    const bagKg = num(inputs.bagKg, 20);
    const depthM = thickness / 1e3;
    let net = 0;
    let plan = 0;
    let shapeHint = "";
    if (shape === "slab") {
      if (length <= 0 || width <= 0 || depthM <= 0) {
        return emptyOutput("Enter slab length, width and thickness");
      }
      plan = length * width;
      net = plan * depthM;
      shapeHint = `${formatM(length, 2)} \xD7 ${formatM(width, 2)} \xD7 ${formatMm(thickness)}`;
    } else if (shape === "strip") {
      if (length <= 0 || footingWidth <= 0 || depthM <= 0) {
        return emptyOutput("Enter footing length, width and depth");
      }
      plan = length * (footingWidth / 1e3);
      net = plan * depthM;
      shapeHint = `${formatM(length, 2)} \xD7 ${formatMm(footingWidth)} \xD7 ${formatMm(thickness)}`;
    } else if (shape === "pier-round") {
      if (diameter <= 0 || depthM <= 0) {
        return emptyOutput("Enter pier diameter and depth");
      }
      const r = diameter / 2e3;
      const one = Math.PI * r * r * depthM;
      net = one * count;
      plan = Math.PI * r * r * count;
      shapeHint = `${formatNumber(count, 0)} \xD8${formatMm(diameter)} \xD7 ${formatMm(thickness)}`;
    } else {
      if (pierLength <= 0 || pierWidth <= 0 || depthM <= 0) {
        return emptyOutput("Enter pier length, width and depth");
      }
      const one = pierLength / 1e3 * (pierWidth / 1e3) * depthM;
      net = one * count;
      plan = pierLength / 1e3 * (pierWidth / 1e3) * count;
      shapeHint = `${formatNumber(count, 0)} ${formatMm(pierLength)} \xD7 ${formatMm(pierWidth)} \xD7 ${formatMm(thickness)}`;
    }
    const orderVol = net * (1 + waste / 100);
    const readyMix = ceilTo(orderVol, 0.1);
    const yieldM3 = 0.01 * (bagKg / 20);
    const bags = Math.ceil(orderVol / yieldM3 - 1e-9);
    const meshSheets = shape === "slab" && plan > 0 ? Math.ceil(plan * 1.1 / 14.4 - 1e-9) : 0;
    const barChairs = shape === "slab" ? Math.ceil(plan * 1.2) : 0;
    const flags = [];
    if (orderVol >= 0.4) {
      flags.push({
        tone: "ok",
        text: "Over ~0.4 m\xB3 a truck is usually cheaper than bags. Ready-mix rounds up to the next 0.1 m\xB3."
      });
    }
    const rows = [
      { label: "Net volume", value: formatM3(net, 3) },
      {
        label: `Order with ${formatNumber(waste, 0)}% waste`,
        value: formatM3(readyMix, 3),
        tone: "strong"
      },
      {
        label: `${formatNumber(bagKg, 0)} kg bags (allow)`,
        value: formatCount(bags, "bags"),
        hint: `${formatM3(yieldM3, 3)} yield per bag`
      }
    ];
    if (plan > 0) {
      rows.unshift({ label: "Plan area", value: formatM2(plan) });
    }
    if (meshSheets > 0) {
      rows.push({
        label: "SL72 mesh sheets (allow)",
        value: formatCount(meshSheets, "sheets"),
        hint: "6.0 \xD7 2.4 m sheets, ~10% for laps"
      });
      rows.push({
        label: "Bar chairs (allow)",
        value: formatCount(barChairs, "pcs"),
        hint: "About 1.2 per m\xB2"
      });
    }
    const order = [
      { item: "Concrete", qty: formatM3(readyMix, 3) },
      { item: `${formatNumber(bagKg, 0)} kg bags`, qty: formatCount(bags, "bags") }
    ];
    if (meshSheets > 0) {
      order.push({ item: "Mesh 6.0 \xD7 2.4", qty: formatCount(meshSheets, "sheets") });
      order.push({ item: "Bar chairs", qty: formatCount(barChairs, "pcs") });
    }
    return {
      headline: `${formatM3(readyMix, 3)} to order \xB7 ${shapeHint}`,
      kpis: [
        { label: "Net", value: formatM3(net, 3) },
        { label: "Order", value: formatM3(readyMix, 3) },
        { label: "Bags", value: formatNumber(bags, 0) },
        { label: "Area", value: formatM2(plan) }
      ],
      flags,
      sections: [{ title: "Pour", rows }],
      order,
      notes: [
        "Bag yield is a hardware-store rule of thumb (20 kg \u2248 0.01 m\xB3). Check the bag.",
        "Add edge thickenings, beams and pour losses on top of the flat volume."
      ]
    };
  }

  // src/lib/calc/decking.ts
  var deckingFields = [
    {
      kind: "number",
      key: "length",
      label: "Deck Length",
      unit: "m",
      altUnit: "mm",
      defaultValue: 6,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "width",
      label: "Deck Width",
      unit: "m",
      altUnit: "mm",
      defaultValue: 4,
      min: 0,
      step: 0.1
    },
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
        { label: "190", value: 190 }
      ]
    },
    {
      kind: "number",
      key: "boardGap",
      label: "Gaps",
      unit: "mm",
      defaultValue: 5,
      min: 0,
      step: 1,
      presets: [
        { label: "3", value: 3 },
        { label: "5", value: 5 },
        { label: "8", value: 8 }
      ]
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
        { label: "6.0", value: 6 }
      ]
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 10,
      min: 0,
      max: 40,
      step: 1
    },
    {
      kind: "number",
      key: "joistSpacing",
      label: "Fixing centres",
      unit: "mm",
      defaultValue: 450,
      min: 100,
      step: 10,
      presets: [
        { label: "400", value: 400 },
        { label: "450", value: 450 },
        { label: "600", value: 600 }
      ]
    },
    {
      kind: "number",
      key: "screwsPerJoist",
      label: "Screws per fixing line",
      unit: "count",
      defaultValue: 2,
      min: 1,
      max: 4,
      step: 1
    }
  ];
  function computeDecking(inputs) {
    const length = num(inputs.length);
    const width = num(inputs.width);
    const boardWidth = num(inputs.boardWidth, 140);
    const boardGap = num(inputs.boardGap, 5);
    const stockLength = num(inputs.stockLength, 5.4);
    const joistSpacing = num(inputs.joistSpacing, 450);
    const waste = num(inputs.waste, 10);
    const screwsPerJoist = num(inputs.screwsPerJoist, 2);
    if (length <= 0 || width <= 0) {
      return emptyOutput("Enter deck length and width");
    }
    const area = length * width;
    const coverM = (boardWidth + boardGap) / 1e3;
    const nBoards = Math.max(1, Math.ceil(width / coverM - 1e-9));
    const actualCover = nBoards * coverM;
    const linear = nBoards * length;
    const linearWaste = linear * (1 + waste / 100);
    const nStock = stockLength > 0 ? Math.ceil(linearWaste / stockLength - 1e-9) : 0;
    const nJoists = countInclusive(length * 1e3, joistSpacing);
    const actualJoist = nJoists > 1 ? length * 1e3 / (nJoists - 1) : 0;
    const screws = nBoards * nJoists * screwsPerJoist;
    return {
      headline: `${formatM(linearWaste, 2)} linear with waste`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Rows across", value: formatNumber(nBoards, 0) },
        { label: "Stock", value: formatNumber(nStock, 0) },
        { label: "Screws", value: formatNumber(screws, 0) }
      ],
      sections: [
        {
          title: "Decking boards",
          rows: [
            { label: "Finished area", value: formatM2(area), tone: "strong" },
            {
              label: "Boards across width",
              value: formatCount(nBoards, "pcs"),
              hint: `${formatMm(boardWidth)} board + ${formatMm(boardGap)} gap`
            },
            { label: "Linear metres (net)", value: formatM(linear, 2) },
            {
              label: `Linear with ${formatNumber(waste, 0)}% waste`,
              value: formatM(linearWaste, 2),
              tone: "strong"
            },
            {
              label: `Stock lengths @ ${formatM(stockLength, 2)}`,
              value: formatCount(nStock, "pcs"),
              hint: "Round up. Check yard lengths before you order."
            },
            {
              label: "Covered width",
              value: formatM(actualCover, 3),
              hint: actualCover > width + 2e-3 ? `Last board rips down \u2014 ${formatMm((actualCover - width) * 1e3, 0)} extra cover` : "Boards land on width"
            }
          ]
        },
        {
          title: "Fixing",
          rows: [
            {
              label: "Fixing lines",
              value: formatCount(nJoists, "pcs"),
              hint: `${formatMm(actualJoist, 0)} centres across the length`
            },
            {
              label: "Deck screws",
              value: formatCount(screws, "screws"),
              hint: `${formatNumber(screwsPerJoist, 0)} per board per fixing line. Add 10% spares.`
            }
          ]
        }
      ],
      order: [
        { item: `Decking ${formatMm(boardWidth)}`, qty: formatM(linearWaste, 2) },
        { item: `Stock @ ${formatM(stockLength, 2)}`, qty: formatCount(nStock, "pcs") },
        { item: "Deck screws", qty: formatCount(screws, "screws") }
      ],
      notes: [
        "Boards run the length of the deck, fixing lines run across the width.",
        "Fixing centres should match your frame's actual joist spacing.",
        "Keep a 5\u201310 mm gap to walls and posts for drainage."
      ],
      diagram: {
        type: "deck",
        length,
        width,
        nBoards,
        nJoists
      }
    };
  }

  // src/lib/calc/fitout.ts
  var flooringFields = [
    {
      kind: "number",
      key: "length",
      label: "Room length",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "width",
      label: "Room width",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.1
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
        { label: "190", value: 190 }
      ]
    },
    {
      kind: "number",
      key: "packCoverage",
      label: "Pack coverage",
      unit: "m2",
      defaultValue: 2.17,
      min: 0.5,
      step: 0.01,
      hint: "From the pack. 0 if you order linear only."
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 8,
      min: 0,
      max: 25,
      step: 1
    }
  ];
  function computeFlooring(inputs) {
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
    const coverM = boardWidth / 1e3;
    const nRows = Math.max(1, Math.ceil(width / coverM - 1e-9));
    const linear = nRows * length;
    const linearWaste = linear * (1 + waste / 100);
    const packs = packCoverage > 0 ? Math.ceil(orderArea / packCoverage - 1e-9) : 0;
    return {
      headline: `${formatM2(orderArea)} to order \xB7 ${formatCount(packs, "packs")}`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Order", value: formatM2(orderArea) },
        { label: "Packs", value: formatNumber(packs, 0) },
        { label: "Rows", value: formatNumber(nRows, 0) }
      ],
      sections: [
        {
          title: "Floor",
          rows: [
            { label: "Net area", value: formatM2(area) },
            {
              label: `With ${formatNumber(waste, 0)}% waste`,
              value: formatM2(orderArea),
              tone: "strong"
            },
            {
              label: "Rows across width",
              value: formatCount(nRows, "rows"),
              hint: `${formatMm(boardWidth)} cover`
            },
            { label: "Linear with waste", value: formatM(linearWaste, 2) },
            {
              label: "Packs",
              value: packCoverage > 0 ? formatCount(packs, "packs") : "\u2014",
              tone: "strong",
              hint: packCoverage > 0 ? `${formatM2(packCoverage)} per pack` : "Set pack coverage"
            }
          ]
        }
      ],
      order: [
        { item: "Flooring", qty: formatM2(orderArea) },
        { item: "Packs", qty: packCoverage > 0 ? formatCount(packs, "packs") : "\u2014" }
      ],
      notes: [
        "Add extra waste for herringbone, diagonals, or a lot of cuts around a kitchen.",
        "Leave the pack to acclimatise. Check the manufacturer\u2019s expansion gap."
      ]
    };
  }
  var tilingFields = [
    {
      kind: "number",
      key: "length",
      label: "Length",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "width",
      label: "Width / height",
      unit: "m",
      defaultValue: 3,
      min: 0,
      step: 0.1
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
        { label: "600", value: 600 }
      ]
    },
    {
      kind: "number",
      key: "tileWidth",
      label: "Tile width",
      unit: "mm",
      defaultValue: 600,
      min: 50,
      step: 1
    },
    {
      kind: "select",
      key: "layout",
      label: "Layout",
      defaultValue: "straight",
      options: [
        { value: "straight", label: "Straight" },
        { value: "diagonal", label: "Diagonal / herringbone" }
      ]
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 10,
      min: 0,
      max: 30,
      step: 1
    },
    {
      kind: "number",
      key: "adhesiveRate",
      label: "Adhesive",
      unit: "kg",
      defaultValue: 4.5,
      min: 1,
      step: 0.5,
      hint: "kg per m\xB2. Typical 3\u20136 kg/m\xB2"
    }
  ];
  function computeTiling(inputs) {
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
    const tileM2 = tileLength / 1e3 * (tileWidth / 1e3);
    const nNet = tileM2 > 0 ? area / tileM2 : 0;
    const nOrder = Math.ceil(nNet * (1 + waste / 100) - 1e-9);
    const adhesive = area * adhesiveRate;
    const groutKg = area * 0.4;
    const flags = [];
    if (layout === "diagonal" && wasteIn < 15) {
      flags.push({
        tone: "warn",
        text: "Diagonal layouts usually need at least 15% waste \u2014 applied automatically."
      });
    }
    return {
      headline: `${formatCount(nOrder, "tiles")} \xB7 ${formatM2(area)}`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Tiles", value: formatNumber(nOrder, 0) },
        { label: "Adhesive", value: formatKg(adhesive, 0) },
        { label: "Waste", value: `${formatNumber(waste, 0)}%` }
      ],
      flags,
      sections: [
        {
          title: "Tiles",
          rows: [
            { label: "Net area", value: formatM2(area) },
            {
              label: "Tile size",
              value: `${formatMm(tileLength)} \xD7 ${formatMm(tileWidth)}`,
              hint: formatM2(tileM2, 3)
            },
            { label: "Tiles net", value: formatNumber(nNet, 1) },
            {
              label: `Tiles with ${formatNumber(waste, 0)}% waste`,
              value: formatCount(nOrder, "pcs"),
              tone: "strong"
            }
          ]
        },
        {
          title: "Fixing",
          rows: [
            {
              label: "Adhesive",
              value: formatKg(adhesive, 0),
              hint: `${formatNumber(adhesiveRate, 1)} kg/m\xB2`
            },
            {
              label: "Grout (allow)",
              value: formatKg(groutKg, 1),
              hint: "About 0.4 kg/m\xB2 \u2014 check joint width"
            }
          ]
        }
      ],
      order: [
        { item: `Tiles ${formatMm(tileLength)} \xD7 ${formatMm(tileWidth)}`, qty: formatCount(nOrder, "pcs") },
        { item: "Adhesive", qty: formatKg(adhesive, 0) },
        { item: "Grout", qty: formatKg(groutKg, 1) }
      ],
      notes: [
        "Set out from the centre of the room so cuts land evenly on both sides.",
        "Buy a full extra box if the tile is a special run \u2014 you will not match it later."
      ]
    };
  }
  var paintFields = [
    {
      kind: "number",
      key: "perimeter",
      label: "Wall perimeter",
      unit: "m",
      defaultValue: 20,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "wallHeight",
      label: "Wall height",
      unit: "m",
      defaultValue: 2.4,
      min: 0,
      step: 0.05
    },
    {
      kind: "select",
      key: "includeCeiling",
      label: "Ceiling",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Include ceiling" },
        { value: "no", label: "Walls only" }
      ]
    },
    {
      kind: "number",
      key: "ceilLength",
      label: "Ceiling length",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.1,
      showWhen: { key: "includeCeiling", in: ["yes"] }
    },
    {
      kind: "number",
      key: "ceilWidth",
      label: "Ceiling width",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.1,
      showWhen: { key: "includeCeiling", in: ["yes"] }
    },
    {
      kind: "number",
      key: "doors",
      label: "Doors",
      unit: "count",
      defaultValue: 1,
      min: 0,
      step: 1,
      hint: "Deducts 1.8 m\xB2 each"
    },
    {
      kind: "number",
      key: "windows",
      label: "Windows",
      unit: "count",
      defaultValue: 2,
      min: 0,
      step: 1,
      hint: "Deducts 1.2 m\xB2 each"
    },
    {
      kind: "number",
      key: "coats",
      label: "Coats",
      unit: "count",
      defaultValue: 2,
      min: 1,
      max: 4,
      step: 1
    },
    {
      kind: "number",
      key: "coverage",
      label: "Coverage",
      unit: "m2",
      defaultValue: 14,
      min: 4,
      step: 0.5,
      hint: "m\xB2 per litre per coat"
    }
  ];
  function computePaint(inputs) {
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
      headline: `${formatL(orderL, 1)} \xB7 ${formatM2(total)} \xD7 ${formatNumber(coats, 0)} coats`,
      kpis: [
        { label: "Walls", value: formatM2(wallArea) },
        { label: "Ceiling", value: formatM2(ceilArea) },
        { label: "Paint", value: formatL(orderL, 1) },
        { label: "Coats", value: formatNumber(coats, 0) }
      ],
      sections: [
        {
          title: "Area",
          rows: [
            { label: "Gross wall area", value: formatM2(perimeter * wallHeight) },
            {
              label: "Openings deducted",
              value: formatM2(openings),
              hint: `${formatNumber(doors, 0)} doors + ${formatNumber(windows, 0)} windows`
            },
            { label: "Net walls", value: formatM2(wallArea), tone: "strong" },
            { label: "Ceiling", value: formatM2(ceilArea) },
            { label: "Total paintable", value: formatM2(total) }
          ]
        },
        {
          title: "Paint",
          rows: [
            { label: "Area \xD7 coats", value: formatM2(coatArea) },
            {
              label: "Litres (calc)",
              value: formatL(litres, 2),
              hint: `${formatNumber(coverage, 1)} m\xB2/L`
            },
            {
              label: "Order (round up 0.5 L)",
              value: formatL(orderL, 1),
              tone: "strong"
            }
          ]
        }
      ],
      order: [{ item: "Paint", qty: formatL(orderL, 1) }],
      notes: [
        "Coverage of 14 m\xB2/L is typical for a mid-sheen wall paint on a sealed surface. Rough plaster eats more.",
        "Doors 1.8 m\xB2 and windows 1.2 m\xB2 are allowances \u2014 measure if they are large."
      ]
    };
  }
  var plasterFields = [
    {
      kind: "number",
      key: "length",
      label: "Length",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "width",
      label: "Width / height",
      unit: "m",
      defaultValue: 2.4,
      min: 0,
      step: 0.1,
      hint: "Wall height, or room width for a ceiling"
    },
    {
      kind: "select",
      key: "sheetLength",
      label: "Sheet length",
      defaultValue: "2.4",
      options: [
        { value: "2.4", label: "2400 mm" },
        { value: "2.7", label: "2700 mm" },
        { value: "3.0", label: "3000 mm" }
      ]
    },
    {
      kind: "number",
      key: "sheetWidth",
      label: "Sheet width",
      unit: "m",
      defaultValue: 1.2,
      min: 0.6,
      step: 0.05
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 10,
      min: 0,
      max: 25,
      step: 1
    }
  ];
  function computePlaster(inputs) {
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
      headline: `${formatCount(nOrder, "sheets")} \xB7 ${formatM2(area)}`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Sheets", value: formatNumber(nOrder, 0) },
        { label: "Tape", value: formatM(tape, 1) },
        { label: "Compound", value: formatKg(compound, 0) }
      ],
      sections: [
        {
          title: "Sheets",
          rows: [
            { label: "Net area", value: formatM2(area) },
            {
              label: "Sheet",
              value: `${formatM(sheetLength, 1)} \xD7 ${formatM(sheetWidth, 1)}`,
              hint: formatM2(sheetArea, 2)
            },
            { label: "Sheets net", value: formatNumber(nNet, 2) },
            {
              label: `Sheets with ${formatNumber(waste, 0)}% waste`,
              value: formatCount(nOrder, "pcs"),
              tone: "strong"
            }
          ]
        },
        {
          title: "Stopping",
          rows: [
            {
              label: "Paper tape (allow)",
              value: formatM(tape, 1),
              hint: "About 1.4 m per m\xB2"
            },
            {
              label: "Base compound (allow)",
              value: formatKg(compound, 0),
              hint: "About 0.8 kg/m\xB2 for three coats"
            }
          ]
        }
      ],
      order: [
        {
          item: `Plasterboard ${formatM(sheetLength, 1)} \xD7 ${formatM(sheetWidth, 1)}`,
          qty: formatCount(nOrder, "pcs")
        },
        { item: "Tape", qty: formatM(tape, 1) },
        { item: "Compound", qty: formatKg(compound, 0) }
      ],
      notes: [
        "Run sheets across the joists / studs. Ceilings usually want 13 mm; wet areas use wet-area board.",
        "Compound allowance is for a standard three-coat stop. Back-blocking is extra."
      ]
    };
  }

  // src/lib/calc/framing.ts
  var framingFields = [
    { kind: "section", label: "Wall" },
    {
      kind: "number",
      key: "wallLength",
      label: "Wall length",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.1
    },
    {
      kind: "select",
      key: "wallType",
      label: "Wall type",
      defaultValue: "flat",
      options: [
        { value: "flat", label: "Flat" },
        { value: "raked", label: "Raked (studs step in length)" }
      ]
    },
    {
      kind: "number",
      key: "wallHeight",
      label: "Finished height",
      unit: "m",
      defaultValue: 2.4,
      min: 1,
      step: 0.05,
      presets: [
        { label: "2.4", value: 2.4 },
        { label: "2.7", value: 2.7 },
        { label: "3.0", value: 3 }
      ],
      showWhen: { key: "wallType", in: ["flat"] }
    },
    {
      kind: "number",
      key: "lowHeight",
      label: "Low end height",
      unit: "m",
      defaultValue: 2.4,
      min: 1,
      step: 0.05,
      showWhen: { key: "wallType", in: ["raked"] }
    },
    {
      kind: "number",
      key: "highHeight",
      label: "High end height",
      unit: "m",
      defaultValue: 3.6,
      min: 1,
      step: 0.05,
      showWhen: { key: "wallType", in: ["raked"] }
    },
    {
      kind: "number",
      key: "studSpacing",
      label: "Stud centres",
      unit: "mm",
      defaultValue: 450,
      min: 300,
      step: 10,
      presets: [
        { label: "450", value: 450 },
        { label: "600", value: 600 }
      ]
    },
    {
      kind: "number",
      key: "plateThickness",
      label: "Plate thickness",
      unit: "mm",
      defaultValue: 35,
      min: 19,
      step: 1,
      presets: [
        { label: "35", value: 35 },
        { label: "45", value: 45 },
        { label: "70", value: 70 }
      ]
    },
    {
      kind: "number",
      key: "topPlates",
      label: "Top plates",
      unit: "count",
      defaultValue: 2,
      min: 1,
      max: 3,
      step: 1
    },
    {
      kind: "number",
      key: "nogRows",
      label: "Noggin rows",
      unit: "count",
      defaultValue: 1,
      min: 0,
      max: 3,
      step: 1
    },
    { kind: "section", label: "Openings (extra studs)" },
    {
      kind: "number",
      key: "doors",
      label: "Doors",
      unit: "count",
      defaultValue: 1,
      min: 0,
      step: 1,
      hint: "Adds 2 jack studs each"
    },
    {
      kind: "number",
      key: "windows",
      label: "Windows",
      unit: "count",
      defaultValue: 1,
      min: 0,
      step: 1,
      hint: "Adds 2 jack studs each"
    }
  ];
  function computeFraming(inputs) {
    const wallLength = num(inputs.wallLength);
    const wallType = str(inputs.wallType, "flat");
    const raked = wallType === "raked";
    const lowHeight = num(inputs.lowHeight, 2.4);
    const highHeight = num(inputs.highHeight, 3.6);
    const wallHeight = raked ? highHeight : num(inputs.wallHeight, 2.4);
    const studSpacing = num(inputs.studSpacing, 450);
    const plateThickness = num(inputs.plateThickness, 35);
    const topPlates = Math.max(1, Math.round(num(inputs.topPlates, 2)));
    const nogRows = Math.max(0, Math.round(num(inputs.nogRows, 1)));
    const doors = Math.max(0, Math.round(num(inputs.doors, 0)));
    const windows = Math.max(0, Math.round(num(inputs.windows, 0)));
    if (wallLength <= 0 || wallHeight <= 0 || raked && lowHeight <= 0) {
      return emptyOutput(raked ? "Enter wall length and both heights" : "Enter wall length and height");
    }
    const nStuds = countInclusive(wallLength * 1e3, studSpacing);
    const actual = nStuds > 1 ? wallLength * 1e3 / (nStuds - 1) : 0;
    const extra = doors * 2 + windows * 2;
    const studsTotal = nStuds + extra;
    const plateCount = 1 + topPlates;
    const plateAllow = plateCount * plateThickness / 1e3;
    const plateLin = plateCount * wallLength;
    const nogLin = nogRows * wallLength;
    const lintels = doors + windows;
    const studLength = raked ? (lowHeight + highHeight) / 2 - plateAllow : Math.max(0.3, wallHeight - plateAllow);
    const shortestStud = raked ? Math.max(0.3, lowHeight - plateAllow) : studLength;
    const tallestStud = raked ? Math.max(0.3, highHeight - plateAllow) : studLength;
    const rakeAngle = raked ? Math.atan((highHeight - lowHeight) / wallLength) * (180 / Math.PI) : 0;
    const studLin = raked ? nStuds / 2 * (shortestStud + tallestStud) + extra * studLength : studsTotal * studLength;
    const stepPerStud = raked && nStuds > 1 ? (tallestStud - shortestStud) * 1e3 / (nStuds - 1) : 0;
    return {
      headline: raked ? `${formatCount(studsTotal, "studs")} @ ${formatMm(actual, 0)} \xB7 ${formatM(shortestStud, 3)}\u2013${formatM(tallestStud, 3)} raked` : `${formatCount(studsTotal, "studs")} @ ${formatMm(actual, 0)} \xB7 ${formatM(studLength, 3)} long`,
      kpis: raked ? [
        { label: "Studs", value: formatNumber(studsTotal, 0) },
        { label: "Centres", value: formatMm(actual, 0) },
        { label: "Length range", value: `${formatM(shortestStud, 3)}\u2013${formatM(tallestStud, 3)}` },
        { label: "Rake", value: formatDeg(rakeAngle) }
      ] : [
        { label: "Studs", value: formatNumber(studsTotal, 0) },
        { label: "Centres", value: formatMm(actual, 0) },
        { label: "Stud length", value: formatM(studLength, 3) },
        { label: "Plates", value: formatM(plateLin, 2) }
      ],
      sections: [
        {
          title: "Studs",
          rows: [
            {
              label: "Studs in the run",
              value: formatCount(nStuds, "pcs"),
              hint: `Set out ${formatMm(actual, 0)} centres`
            },
            {
              label: "Extra for openings",
              value: formatCount(extra, "pcs"),
              hint: `${formatNumber(doors, 0)} doors + ${formatNumber(windows, 0)} windows \xD7 2 jacks`
            },
            { label: "Studs to cut", value: formatCount(studsTotal, "pcs"), tone: "strong" },
            raked ? {
              label: "Stud lengths",
              value: `${formatM(shortestStud, 3)} to ${formatM(tallestStud, 3)}`,
              tone: "strong",
              hint: "Every stud is a different length on a raked wall \u2014 mark and cut individually"
            } : {
              label: "Stud length",
              value: formatM(studLength, 3),
              tone: "strong",
              hint: `Height minus ${formatNumber(plateCount, 0)} \xD7 ${formatMm(plateThickness)} plates`
            },
            { label: "Stud linear (allow)", value: formatM(studLin, 2) }
          ]
        },
        ...raked ? [
          {
            title: "Raked studs",
            rows: [
              { label: "Low end stud", value: formatM(shortestStud, 3) },
              { label: "High end stud", value: formatM(tallestStud, 3), tone: "strong" },
              {
                label: "Step per stud",
                value: formatMm(stepPerStud, 1),
                hint: `Each stud ${formatMm(stepPerStud, 1)} longer than the last, low to high`
              },
              {
                label: "Rake angle (top plate bevel)",
                value: formatDeg(rakeAngle),
                hint: "Angle of the top plate off level \u2014 set the saw to this for the rip bevel"
              }
            ]
          }
        ] : [],
        {
          title: "Plates & nogs",
          rows: [
            {
              label: "Plates",
              value: `${formatNumber(plateCount, 0)} \xD7 ${formatM(wallLength, 2)}`,
              tone: "strong",
              hint: raked ? "1 bottom + top plates \u2014 top plate is rip-cut to the rake" : "1 bottom + top plates"
            },
            { label: "Plate linear", value: formatM(plateLin, 2) },
            {
              label: "Noggins",
              value: formatM(nogLin, 2),
              hint: `${formatNumber(nogRows, 0)} row${nogRows === 1 ? "" : "s"} \u2014 cut between studs`
            },
            { label: "Lintels (allow)", value: formatCount(lintels, "pcs") }
          ]
        }
      ],
      order: [
        raked ? { item: "Studs (raked, individually cut)", qty: formatCount(studsTotal, "pcs") } : { item: `Studs @ ${formatM(studLength, 3)}`, qty: formatCount(studsTotal, "pcs") },
        { item: "Plates", qty: formatM(plateLin, 2) },
        { item: "Noggins", qty: formatM(nogLin, 2) },
        { item: "Lintels", qty: formatCount(lintels, "pcs") }
      ],
      notes: [
        "Does not include bracing, trimmers, cripples above/below windows, or a second stud at intersecting walls.",
        "Add 10% extra studs on a messy wall, or count every opening off the drawing.",
        ...raked ? [
          "Raked stud lengths step evenly between the low and high end \u2014 measure and mark each one off the top plate rather than cutting to a single length."
        ] : []
      ]
    };
  }

  // src/lib/calc/measuring.ts
  var checkSquareFields = [
    { kind: "section", label: "Rectangle" },
    {
      kind: "number",
      key: "sideA",
      label: "Side A",
      unit: "mm",
      altUnit: "m",
      defaultValue: 4e3,
      min: 0,
      step: 1
    },
    {
      kind: "number",
      key: "sideB",
      label: "Side B",
      unit: "mm",
      altUnit: "m",
      defaultValue: 3e3,
      min: 0,
      step: 1
    },
    { kind: "section", label: "Measured diagonals" },
    {
      kind: "number",
      key: "diagonal1",
      label: "Diagonal 1",
      unit: "mm",
      altUnit: "m",
      defaultValue: 5e3,
      min: 0,
      step: 1,
      hint: "Corner to corner, one way"
    },
    {
      kind: "number",
      key: "diagonal2",
      label: "Diagonal 2",
      unit: "mm",
      altUnit: "m",
      defaultValue: 5e3,
      min: 0,
      step: 1,
      hint: "Corner to corner, the other way"
    }
  ];
  function computeCheckSquare(inputs) {
    const sideA = num(inputs.sideA);
    const sideB = num(inputs.sideB);
    const diagonal1 = num(inputs.diagonal1);
    const diagonal2 = num(inputs.diagonal2);
    if (sideA <= 0 || sideB <= 0) {
      return emptyOutput("Enter both side lengths");
    }
    const expected = Math.hypot(sideA, sideB);
    const haveBoth = diagonal1 > 0 && diagonal2 > 0;
    const diagDiffMm = haveBoth ? diagonal1 - diagonal2 : 0;
    const absDiff = Math.abs(diagDiffMm);
    const tone = absDiff <= 5 ? "ok" : absDiff <= 15 ? "warn" : "bad";
    const flags = [];
    if (haveBoth) {
      if (tone === "ok") {
        flags.push({ tone: "ok", text: "Diagonals match within 5 mm. Close enough to call it square." });
      } else {
        const longer = diagDiffMm > 0 ? "Diagonal 1" : "Diagonal 2";
        flags.push({
          tone: tone === "bad" ? "bad" : "warn",
          text: `${longer} is ${formatMm(absDiff, 0)} longer. Rack that pair of corners in until the diagonals match.`
        });
      }
    }
    const multiples = [1, 1.5, 2, 3].map((k) => ({
      a: 3e3 * k,
      b: 4e3 * k,
      c: 5e3 * k
    }));
    return {
      headline: haveBoth ? tone === "ok" ? "Square \u2713" : `Out of square by ${formatMm(absDiff, 0)}` : `Expected diagonal ${formatMm(expected, 0)}`,
      kpis: [
        { label: "Expected diagonal", value: formatMm(expected, 0) },
        { label: "Diagonal 1", value: formatMm(diagonal1, 0) },
        { label: "Diagonal 2", value: formatMm(diagonal2, 0) },
        { label: "Out of square", value: haveBoth ? formatMm(absDiff, 0) : "-" }
      ],
      flags,
      sections: [
        {
          title: "Diagonal check",
          rows: [
            { label: "Side A", value: formatMm(sideA, 0) },
            { label: "Side B", value: formatMm(sideB, 0) },
            {
              label: "Expected diagonal (Pythagoras)",
              value: formatMm(expected, 0),
              tone: "strong"
            },
            {
              label: "Diagonal 1 vs Diagonal 2",
              value: haveBoth ? formatMm(diagDiffMm, 0) : "-",
              tone: haveBoth ? tone === "bad" ? "warn" : tone : "default",
              hint: "Equal diagonals = square, regardless of the expected figure above"
            }
          ]
        },
        {
          title: "3-4-5 reference",
          rows: multiples.map((m) => ({
            label: `${formatNumber(m.a, 0)} \u2013 ${formatNumber(m.b, 0)} \u2013 ${formatNumber(m.c, 0)} mm`,
            value: "90\xB0",
            hint: "Measure A and B, the diagonal C confirms the corner"
          }))
        }
      ],
      notes: [
        "The most reliable check is two equal diagonals. The side lengths only need to be roughly right.",
        "3-4-5 (and its multiples) is the fallback when you don't have a clear run for a full diagonal."
      ]
    };
  }
  var equalSpacingFields = [
    {
      kind: "select",
      key: "mode",
      label: "Solve for",
      defaultValue: "target-spacing",
      options: [
        { value: "target-spacing", label: "Nearest to a target spacing" },
        { value: "n-spaces", label: "A fixed number of spaces" },
        { value: "fixed-increment", label: "Fixed increment from a start point" }
      ]
    },
    {
      kind: "number",
      key: "totalLength",
      label: "Total length",
      unit: "m",
      defaultValue: 3.6,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["target-spacing", "n-spaces"] }
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
      hint: "Actual spacing is adjusted so it divides evenly"
    },
    {
      kind: "number",
      key: "nSpaces",
      label: "Number of spaces",
      unit: "count",
      defaultValue: 12,
      min: 1,
      step: 1,
      showWhen: { key: "mode", in: ["n-spaces"] }
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
      showWhen: { key: "mode", in: ["fixed-increment"] }
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
        { label: "600", value: 600 }
      ],
      showWhen: { key: "mode", in: ["fixed-increment"] }
    },
    {
      kind: "number",
      key: "count",
      label: "Number of marks",
      unit: "count",
      defaultValue: 10,
      min: 1,
      step: 1,
      showWhen: { key: "mode", in: ["fixed-increment"] }
    }
  ];
  function computeFixedIncrement(inputs) {
    const startOffset = num(inputs.startOffset, 0);
    const increment = num(inputs.increment, 450);
    const count = Math.max(1, Math.round(num(inputs.count, 10)));
    if (increment <= 0) {
      return emptyOutput("Enter an increment greater than 0");
    }
    const totalRun = startOffset + count * increment;
    const maxRows = 16;
    const markRows = [];
    const shown = Math.min(count + 1, maxRows);
    for (let i = 0; i < shown; i++) {
      markRows.push({ label: `Mark ${i}`, value: formatMm(startOffset + i * increment, 0) });
    }
    if (count + 1 > maxRows) {
      markRows.push({ label: "\u2026", value: `${count + 1 - maxRows} more mark(s) at ${formatMm(increment)} centres` });
    }
    return {
      headline: `${formatCount(count, "marks")} @ ${formatMm(increment)} \xB7 run ${formatMm(totalRun)}`,
      kpis: [
        { label: "Increment", value: formatMm(increment) },
        { label: "Marks", value: formatNumber(count, 0) },
        { label: "Start offset", value: formatMm(startOffset) },
        { label: "Total run", value: formatMm(totalRun) }
      ],
      sections: [{ title: "Running marks", rows: markRows }],
      notes: [
        "Run the tape from one fixed zero rather than jumping start-to-start each time \u2014 that avoids compounding small errors along a long wall or deck.",
        "Mark 0 is the start offset; each following mark adds one increment."
      ]
    };
  }
  function computeEqualSpacing(inputs) {
    const mode = str(inputs.mode, "target-spacing");
    if (mode === "fixed-increment") {
      return computeFixedIncrement(inputs);
    }
    const totalLength = num(inputs.totalLength);
    if (totalLength <= 0) {
      return emptyOutput("Enter a total length");
    }
    let n;
    if (mode === "n-spaces") {
      n = Math.max(1, Math.round(num(inputs.nSpaces, 12)));
    } else {
      const target = Math.max(1, num(inputs.targetSpacing, 300));
      n = Math.max(1, Math.round(totalLength * 1e3 / target));
    }
    const spacingMm = totalLength * 1e3 / n;
    const nMarks = n + 1;
    const maxRows = 12;
    const markRows = [];
    const shown = Math.min(nMarks, maxRows);
    for (let i = 0; i < shown; i++) {
      markRows.push({ label: `Mark ${i + 1}`, value: formatMm(i * spacingMm, 0) });
    }
    if (nMarks > maxRows) {
      markRows.push({ label: "\u2026", value: `${nMarks - maxRows} more mark(s) at the same spacing` });
    }
    return {
      headline: `${formatCount(n, "spaces")} @ ${formatMm(spacingMm, 1)}`,
      kpis: [
        { label: "Spaces", value: formatNumber(n, 0) },
        { label: "Spacing", value: formatMm(spacingMm, 1) },
        { label: "Marks", value: formatNumber(nMarks, 0) },
        { label: "Total length", value: formatM(totalLength, 3) }
      ],
      sections: [
        {
          title: "Result",
          rows: [
            { label: "Number of spaces", value: formatCount(n, "spaces"), tone: "strong" },
            { label: "Actual spacing", value: formatMm(spacingMm, 1), tone: "strong" },
            { label: "Marks (including both ends)", value: formatCount(nMarks, "marks") }
          ]
        },
        { title: "Marks from start", rows: markRows }
      ],
      notes: [
        "Good for pickets, joist bays, screw centres, tile layout lines \u2014 anything divided evenly across a known run.",
        "Marks are measured from the start face, not stacked tape-to-tape."
      ]
    };
  }
  var triangleFields = [
    {
      kind: "select",
      key: "mode",
      label: "Known values",
      defaultValue: "right-legs",
      options: [
        { value: "right-legs", label: "Right triangle \u2014 two legs" },
        { value: "right-hyp", label: "Right triangle \u2014 hypotenuse + leg" },
        { value: "sss", label: "Three sides (SSS)" },
        { value: "sas", label: "Two sides + included angle (SAS)" }
      ]
    },
    {
      kind: "number",
      key: "legA",
      label: "Leg A",
      unit: "m",
      defaultValue: 3,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["right-legs"] }
    },
    {
      kind: "number",
      key: "legB",
      label: "Leg B",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["right-legs"] }
    },
    {
      kind: "number",
      key: "hyp",
      label: "Hypotenuse",
      unit: "m",
      defaultValue: 5,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["right-hyp"] }
    },
    {
      kind: "number",
      key: "leg",
      label: "Known leg",
      unit: "m",
      defaultValue: 3,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["right-hyp"] }
    },
    {
      kind: "number",
      key: "sssA",
      label: "Side A",
      unit: "m",
      defaultValue: 5,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["sss"] }
    },
    {
      kind: "number",
      key: "sssB",
      label: "Side B",
      unit: "m",
      defaultValue: 6,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["sss"] }
    },
    {
      kind: "number",
      key: "sssC",
      label: "Side C",
      unit: "m",
      defaultValue: 7,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["sss"] }
    },
    {
      kind: "number",
      key: "sasA",
      label: "Side A",
      unit: "m",
      defaultValue: 5,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["sas"] }
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
      showWhen: { key: "mode", in: ["sas"] }
    },
    {
      kind: "number",
      key: "sasB",
      label: "Side B",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["sas"] }
    }
  ];
  var RAD = Math.PI / 180;
  var DEG = 180 / Math.PI;
  function computeTriangle(inputs) {
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
        return emptyOutput("Not a valid triangle \u2014 check the three lengths");
      }
      angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * DEG;
      angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * DEG;
      angleC = 180 - angleA - angleB;
    } else {
      a = num(inputs.sasA);
      b = num(inputs.sasB);
      angleC = num(inputs.sasAngleC, 60);
      if (a <= 0 || b <= 0) return emptyOutput("Enter both sides");
      if (angleC <= 0 || angleC >= 180) return emptyOutput("Included angle must be between 0\xB0 and 180\xB0");
      c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angleC * RAD));
      angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * DEG;
      angleB = 180 - angleA - angleC;
    }
    const perimeter = a + b + c;
    const s = perimeter / 2;
    const heronArea = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
    return {
      headline: `a ${formatM(a, 3)} \xB7 b ${formatM(b, 3)} \xB7 c ${formatM(c, 3)}`,
      kpis: [
        { label: "Side C", value: formatM(c, 3) },
        { label: "Angle A", value: formatDeg(angleA) },
        { label: "Angle B", value: formatDeg(angleB) },
        { label: "Angle C", value: formatDeg(angleC) }
      ],
      sections: [
        {
          title: "Sides",
          rows: [
            { label: "Side A", value: formatM(a, 3), tone: "strong" },
            { label: "Side B", value: formatM(b, 3), tone: "strong" },
            { label: "Side C", value: formatM(c, 3), tone: "strong" },
            { label: "Perimeter", value: formatM(perimeter, 3) }
          ]
        },
        {
          title: "Angles",
          rows: [
            { label: "Angle A (opposite side A)", value: formatDeg(angleA) },
            { label: "Angle B (opposite side B)", value: formatDeg(angleB) },
            { label: "Angle C (opposite side C)", value: formatDeg(angleC) },
            { label: "Area", value: formatM2(heronArea) }
          ]
        }
      ],
      notes: [
        "Angles are measured opposite the side of the same letter.",
        "SSS and SAS use the law of cosines \u2014 accurate for any triangle, not just right angles."
      ]
    };
  }
  var mitreAngleFields = [
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
        { label: "90\xB0", value: 90 },
        { label: "135\xB0", value: 135 },
        { label: "120\xB0", value: 120 }
      ],
      hint: "Measured between the two faces \u2014 90\xB0 is a standard square corner"
    },
    {
      kind: "select",
      key: "cornerType",
      label: "Corner type",
      defaultValue: "internal",
      options: [
        { value: "internal", label: "Internal" },
        { value: "external", label: "External" }
      ]
    }
  ];
  function computeMitreAngle(inputs) {
    const cornerAngle = num(inputs.cornerAngle, 90);
    const cornerType = str(inputs.cornerType, "internal");
    if (cornerAngle <= 0 || cornerAngle >= 180) {
      return emptyOutput("Corner angle must be between 0\xB0 and 180\xB0");
    }
    const mitre = cornerAngle / 2;
    return {
      headline: `${formatDeg(mitre)} on each piece`,
      kpis: [
        { label: "Corner angle", value: formatDeg(cornerAngle) },
        { label: "Mitre per side", value: formatDeg(mitre) },
        { label: "Corner type", value: cornerType === "external" ? "External" : "Internal" },
        { label: "Check", value: formatDeg(mitre * 2) }
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
              hint: "Set the mitre saw this many degrees off the 0\xB0 (square) mark"
            },
            { label: "Two mitres should sum to", value: formatDeg(mitre * 2) }
          ]
        }
      ],
      notes: [
        "For a standard 90\xB0 corner this gives the familiar 45\xB0 each side.",
        cornerType === "external" ? "External corner \u2014 the piece runs long past the wall face until it's cut; mark and cut in place if you're not certain of the exact angle." : "Internal corner \u2014 cut a touch long and creep up on the fit; timber and plaster corners are rarely exactly on the number.",
        "This is a flat, in-plane mitre. A raked/compound mitre \u2014 skirting running up a sloped ceiling, or crown moulding \u2014 needs a compound-angle table and isn't covered here."
      ]
    };
  }
  var levellingFields = [
    {
      kind: "number",
      key: "bmRL",
      label: "Benchmark RL",
      unit: "m",
      defaultValue: 100,
      step: 1e-3,
      hint: "Use 100.000 as an arbitrary site datum if there's no known RL"
    },
    {
      kind: "number",
      key: "backsight",
      label: "Backsight (on the BM)",
      unit: "mm",
      defaultValue: 1500,
      min: 0,
      step: 1
    },
    {
      kind: "number",
      key: "foresight",
      label: "Foresight (on the target)",
      unit: "mm",
      defaultValue: 1200,
      min: 0,
      step: 1
    }
  ];
  function computeLevelling(inputs) {
    const bmRL = num(inputs.bmRL, 100);
    const backsightMm = num(inputs.backsight, 1500);
    const foresightMm = num(inputs.foresight, 1200);
    if (backsightMm <= 0) {
      return emptyOutput("Enter the backsight reading on the benchmark");
    }
    const hi = bmRL + backsightMm / 1e3;
    const targetRL = hi - foresightMm / 1e3;
    const diff = targetRL - bmRL;
    const rising = diff >= 0;
    return {
      headline: `Target RL ${formatNumber(targetRL, 3)} \xB7 ${rising ? "rise" : "fall"} ${formatM(Math.abs(diff), 3)}`,
      kpis: [
        { label: "Benchmark RL", value: formatNumber(bmRL, 3) },
        { label: "Height of collimation", value: formatNumber(hi, 3) },
        { label: "Target RL", value: formatNumber(targetRL, 3) },
        { label: rising ? "Rise" : "Fall", value: formatM(Math.abs(diff), 3) }
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
              tone: rising ? "ok" : "warn"
            }
          ]
        }
      ],
      notes: [
        "Single instrument setup \u2014 one backsight, one foresight. HI = BM RL + backsight; target RL = HI \u2212 foresight.",
        "For a multi-point level run, use the target RL here as the next station's benchmark and repeat.",
        "Staff readings are in mm as read off the staff, rise upward on the staff reduces the reading."
      ]
    };
  }
  var slopeFields = [
    {
      kind: "select",
      key: "mode",
      label: "Work from",
      defaultValue: "rise-run",
      options: [
        { value: "rise-run", label: "Rise and run" },
        { value: "ratio", label: "Ratio (1 in X)" }
      ]
    },
    {
      kind: "number",
      key: "rise",
      label: "Rise / fall",
      unit: "mm",
      defaultValue: 100,
      min: 0,
      step: 1,
      showWhen: { key: "mode", in: ["rise-run"] }
    },
    {
      kind: "number",
      key: "run",
      label: "Run",
      unit: "m",
      defaultValue: 10,
      min: 0,
      step: 0.1,
      showWhen: { key: "mode", in: ["rise-run"] }
    },
    {
      kind: "number",
      key: "ratioX",
      label: "1 in",
      unit: "count",
      defaultValue: 100,
      min: 1,
      step: 1,
      showWhen: { key: "mode", in: ["ratio"] }
    },
    {
      kind: "select",
      key: "context",
      label: "Check against",
      defaultValue: "general",
      options: [
        { value: "general", label: "General \u2014 no check" },
        { value: "ramp", label: "Accessible ramp (max 1:14)" },
        { value: "path", label: "Path / walkway (max ~1:20)" },
        { value: "drainage", label: "Gravity drainage (min 1:100)" },
        { value: "paving", label: "Paving fall away from building (min 1:100)" }
      ]
    }
  ];
  function computeSlope(inputs) {
    const mode = str(inputs.mode, "rise-run");
    const context = str(inputs.context, "general");
    let ratioX;
    let percent;
    let angle;
    if (mode === "ratio") {
      ratioX = Math.max(1, num(inputs.ratioX, 100));
      percent = 100 / ratioX;
      angle = Math.atan(1 / ratioX) * DEG;
    } else {
      const riseM = num(inputs.rise, 100) / 1e3;
      const run = num(inputs.run, 10);
      if (run <= 0) return emptyOutput("Enter a run greater than 0");
      if (riseM <= 0) return emptyOutput("Enter a rise or fall greater than 0");
      ratioX = run / riseM;
      percent = riseM / run * 100;
      angle = Math.atan(riseM / run) * DEG;
    }
    const flags = [];
    if (context === "ramp") {
      flags.push(
        ratioX >= 14 ? { tone: "ok", text: "1:14 or flatter \u2014 inside the AS1428.1 accessible-ramp maximum." } : { tone: "bad", text: `1:${formatNumber(ratioX, 1)} is steeper than the 1:14 accessible-ramp maximum.` }
      );
    } else if (context === "path") {
      flags.push(
        ratioX >= 20 ? { tone: "ok", text: "1:20 or flatter \u2014 a comfortable walking grade." } : { tone: "warn", text: `1:${formatNumber(ratioX, 1)} is steeper than the usual 1:20 path guide.` }
      );
    } else if (context === "drainage" || context === "paving") {
      flags.push(
        ratioX <= 100 ? { tone: "ok", text: "1:100 or steeper \u2014 enough fall for gravity drainage." } : { tone: "warn", text: `1:${formatNumber(ratioX, 1)} is flatter than the usual 1:100 minimum \u2014 water may pond.` }
      );
    }
    return {
      headline: `1 in ${formatNumber(ratioX, 1)} \xB7 ${formatNumber(percent, 2)}% \xB7 ${formatDeg(angle)}`,
      kpis: [
        { label: "Ratio", value: `1:${formatNumber(ratioX, 1)}` },
        { label: "Percent", value: `${formatNumber(percent, 2)}%` },
        { label: "Angle", value: formatDeg(angle) },
        { label: "Rise per metre", value: formatMm(percent / 100 * 1e3, 1) }
      ],
      flags,
      sections: [
        {
          title: "Slope",
          rows: [
            { label: "Ratio", value: `1 : ${formatNumber(ratioX, 1)}`, tone: "strong" },
            { label: "Percent grade", value: `${formatNumber(percent, 2)}%`, tone: "strong" },
            { label: "Angle from horizontal", value: formatDeg(angle) },
            { label: "Rise per metre of run", value: formatMm(percent / 100 * 1e3, 1) }
          ]
        }
      ],
      notes: [
        "Figures shown against a context are typical guides, not a substitute for the current code, the drawing, or the certifier.",
        "The same ratio works for a roof pitch, a ramp, a driveway grade or a drainage fall \u2014 only the acceptable range changes."
      ]
    };
  }
  var arcSetoutFields = [
    {
      kind: "select",
      key: "mode",
      label: "Work from",
      defaultValue: "chord-sagitta",
      options: [
        { value: "chord-sagitta", label: "Chord and sagitta (rise)" },
        { value: "radius-angle", label: "Radius and included angle" }
      ]
    },
    {
      kind: "number",
      key: "chord",
      label: "Chord",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["chord-sagitta"] }
    },
    {
      kind: "number",
      key: "sagitta",
      label: "Sagitta (rise at midpoint)",
      unit: "mm",
      defaultValue: 300,
      min: 1,
      step: 1,
      showWhen: { key: "mode", in: ["chord-sagitta"] }
    },
    {
      kind: "number",
      key: "radius",
      label: "Radius",
      unit: "m",
      defaultValue: 3,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["radius-angle"] }
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
      showWhen: { key: "mode", in: ["radius-angle"] }
    },
    {
      kind: "number",
      key: "offsetInterval",
      label: "Offset interval",
      unit: "mm",
      defaultValue: 500,
      min: 10,
      step: 10,
      hint: "Spacing of the peg marks along the chord"
    }
  ];
  function computeArcSetout(inputs) {
    const mode = str(inputs.mode, "chord-sagitta");
    const offsetInterval = Math.max(1, num(inputs.offsetInterval, 500));
    let radius;
    let chord;
    let sagitta;
    if (mode === "radius-angle") {
      radius = num(inputs.radius, 3);
      const angle = num(inputs.angle, 90);
      if (radius <= 0) return emptyOutput("Enter a radius greater than 0");
      if (angle <= 0 || angle >= 180) return emptyOutput("Included angle must be between 0\xB0 and 180\xB0");
      const half = angle * RAD / 2;
      chord = 2 * radius * Math.sin(half);
      sagitta = radius * (1 - Math.cos(half)) * 1e3;
    } else {
      chord = num(inputs.chord, 4);
      sagitta = num(inputs.sagitta, 300);
      if (chord <= 0) return emptyOutput("Enter a chord length greater than 0");
      if (sagitta <= 0) return emptyOutput("Enter a sagitta (rise) greater than 0");
      const sM2 = sagitta / 1e3;
      radius = chord * chord / (8 * sM2) + sM2 / 2;
    }
    const sM = sagitta / 1e3;
    const includedAngle = 2 * Math.asin(Math.min(1, chord / 2 / radius)) * DEG;
    const arcLength = radius * (includedAngle * RAD);
    const chordMm = chord * 1e3;
    const radiusM = radius;
    const nIntervals = Math.max(1, Math.round(chordMm / offsetInterval));
    const actualInterval = chordMm / nIntervals;
    const maxRows = 12;
    const offsetRows = [];
    const shown = Math.min(nIntervals + 1, maxRows);
    for (let i = 0; i < shown; i++) {
      const xMm = i * actualInterval;
      const xFromMid = xMm - chordMm / 2;
      const xFromMidM = xFromMid / 1e3;
      const under = radiusM * radiusM - xFromMidM * xFromMidM;
      const offsetM = Math.sqrt(Math.max(0, under)) - (radiusM - sM);
      offsetRows.push({
        label: `${formatMm(xMm, 0)} along chord`,
        value: formatMm(Math.max(0, offsetM) * 1e3, 0)
      });
    }
    if (nIntervals + 1 > maxRows) {
      offsetRows.push({ label: "\u2026", value: `${nIntervals + 1 - maxRows} more mark(s)` });
    }
    return {
      headline: `R ${formatM(radius, 3)} \xB7 chord ${formatM(chord, 3)} \xB7 sagitta ${formatMm(sagitta, 0)}`,
      kpis: [
        { label: "Radius", value: formatM(radius, 3) },
        { label: "Chord", value: formatM(chord, 3) },
        { label: "Sagitta", value: formatMm(sagitta, 0) },
        { label: "Arc length", value: formatM(arcLength, 3) }
      ],
      sections: [
        {
          title: "Circle",
          rows: [
            { label: "Radius", value: formatM(radius, 3), tone: "strong" },
            { label: "Chord", value: formatM(chord, 3) },
            { label: "Sagitta (rise at midpoint)", value: formatMm(sagitta, 0) },
            { label: "Included angle", value: formatDeg(includedAngle) },
            { label: "Arc length", value: formatM(arcLength, 3), tone: "strong" }
          ]
        },
        { title: "Offsets from chord", rows: offsetRows }
      ],
      notes: [
        "Set a string line along the chord between the two end pegs, then measure the perpendicular offset from the string at each mark to find the curve.",
        "The midpoint offset is the sagitta \u2014 check it first with a spirit level and tape off the string line."
      ]
    };
  }
  var cutListFields = [
    { kind: "section", label: "Stock" },
    {
      kind: "number",
      key: "stockLength",
      label: "Stock length",
      unit: "m",
      defaultValue: 5.4,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "kerf",
      label: "Kerf / saw cut",
      unit: "mm",
      defaultValue: 3,
      min: 0,
      step: 1
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
    { kind: "number", key: "cutQty6", label: "Qty 6", unit: "count", defaultValue: 0, min: 0, step: 1 }
  ];
  function computeCutList(inputs) {
    const stockLength = num(inputs.stockLength, 5.4);
    const kerf = Math.max(0, num(inputs.kerf, 3));
    if (stockLength <= 0) {
      return emptyOutput("Enter a stock length");
    }
    const stockMm = stockLength * 1e3;
    const slots = [1, 2, 3, 4, 5, 6].map((i) => ({
      length: num(inputs[`cutLength${i}`]),
      qty: Math.max(0, Math.round(num(inputs[`cutQty${i}`])))
    }));
    const requested = slots.filter((s) => s.length > 0 && s.qty > 0);
    if (requested.length === 0) {
      return emptyOutput("Enter at least one cut length and quantity");
    }
    const oversize = requested.filter((s) => s.length + kerf > stockMm);
    const usable = requested.filter((s) => s.length + kerf <= stockMm);
    const items = [];
    for (const s of usable) for (let i = 0; i < s.qty; i++) items.push(s.length);
    items.sort((x, y) => y - x);
    const bins = [];
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
    const wastePct = usedMm > 0 ? totalOffcut / usedMm * 100 : 0;
    const flags = [];
    if (oversize.length > 0) {
      const n = oversize.reduce((sum, s) => sum + s.qty, 0);
      flags.push({
        tone: "bad",
        text: `${formatCount(n, "piece(s)")} longer than the stock length \u2014 excluded from the plan.`
      });
    }
    const maxRows = 10;
    const binRows = bins.slice(0, maxRows).map((bin, i) => ({
      label: `Length ${i + 1}`,
      value: bin.cuts.map((c) => formatMm(c)).join(" + "),
      hint: `Offcut ${formatMm(bin.remaining)}`
    }));
    if (bins.length > maxRows) {
      binRows.push({ label: "\u2026", value: `${bins.length - maxRows} more length(s), same method` });
    }
    return {
      headline: `${formatCount(totalStock, "lengths")} \xB7 ${formatNumber(wastePct, 1)}% waste`,
      kpis: [
        { label: "Stock lengths", value: formatNumber(totalStock, 0) },
        { label: "Total pieces", value: formatNumber(totalPieces, 0) },
        { label: "Waste", value: `${formatNumber(wastePct, 1)}%` },
        { label: "Offcut total", value: formatMm(totalOffcut) }
      ],
      flags,
      sections: [{ title: "Cutting plan", rows: binRows }],
      order: [
        { item: `Stock @ ${formatM(stockLength, 2)}`, qty: formatCount(totalStock, "lengths") }
      ],
      notes: [
        "First-fit-decreasing packing \u2014 a good, fast approximation, not always the mathematical optimum.",
        "Kerf is added to every cut including the last one in a length, so real waste is usually a touch less than shown.",
        "Need more than 6 distinct lengths? Run this again for the rest and add the stock counts together."
      ]
    };
  }

  // src/lib/calc/roof.ts
  var corrugatedFields = [
    { kind: "section", label: "Building" },
    {
      kind: "number",
      key: "buildingLength",
      label: "Building length",
      unit: "m",
      defaultValue: 12,
      min: 0,
      step: 0.1,
      hint: "Ridge / eaves direction"
    },
    {
      kind: "number",
      key: "buildingWidth",
      label: "Span",
      unit: "m",
      defaultValue: 8,
      min: 0,
      step: 0.1,
      hint: "Wall to wall across the pitch"
    },
    {
      kind: "select",
      key: "roofType",
      label: "Roof type",
      defaultValue: "gable",
      options: [
        { value: "gable", label: "Gable" },
        { value: "skillion", label: "Skillion" }
      ]
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
        { label: "5\xB0", value: 5 },
        { label: "15\xB0", value: 15 },
        { label: "22.5\xB0", value: 22.5 },
        { label: "25\xB0", value: 25 },
        { label: "30\xB0", value: 30 }
      ]
    },
    { kind: "section", label: "Overhangs & sheet" },
    {
      kind: "number",
      key: "eaveOverhang",
      label: "Eave overhang",
      unit: "m",
      defaultValue: 0.45,
      min: 0,
      step: 0.05
    },
    {
      kind: "number",
      key: "gableOverhang",
      label: "Gable overhang",
      unit: "m",
      defaultValue: 0.05,
      min: 0,
      step: 0.05
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
        { label: "820", value: 820 }
      ],
      hint: "Corrugated / Custom Orb 762 mm"
    },
    {
      kind: "number",
      key: "battenSpacing",
      label: "Batten centres",
      unit: "mm",
      defaultValue: 900,
      min: 200,
      step: 50
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 5,
      min: 0,
      max: 25,
      step: 1
    }
  ];
  var pitchFields = [
    {
      kind: "select",
      key: "mode",
      label: "Work from",
      defaultValue: "rise-run",
      options: [
        { value: "rise-run", label: "Rise and run" },
        { value: "rise-span", label: "Rise and span" },
        { value: "angle", label: "Pitch angle" }
      ]
    },
    {
      kind: "number",
      key: "rise",
      label: "Rise to ridge",
      unit: "m",
      defaultValue: 1.8,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["rise-run", "rise-span"] }
    },
    {
      kind: "number",
      key: "run",
      label: "Run (half span)",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["rise-run"] }
    },
    {
      kind: "number",
      key: "span",
      label: "Total span",
      unit: "m",
      defaultValue: 8,
      min: 0,
      step: 0.01,
      showWhen: { key: "mode", in: ["rise-span", "angle"] }
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
        { label: "15\xB0", value: 15 },
        { label: "22.5\xB0", value: 22.5 },
        { label: "25\xB0", value: 25 },
        { label: "30\xB0", value: 30 },
        { label: "45\xB0", value: 45 }
      ]
    },
    {
      kind: "number",
      key: "overhang",
      label: "Eave overhang",
      unit: "m",
      defaultValue: 0.45,
      min: 0,
      step: 0.05
    }
  ];
  function computeCorrugated(inputs) {
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
    const pitchRad = pitch * Math.PI / 180;
    const factor = 1 / Math.cos(pitchRad);
    const isGable = roofType === "gable";
    const planLength = buildingLength + 2 * gableOverhang;
    const planWidth = buildingWidth + (isGable ? 2 : 1) * eaveOverhang;
    const planArea = planLength * planWidth;
    const slopeRun = isGable ? buildingWidth / 2 + eaveOverhang : buildingWidth + eaveOverhang;
    const slopeLength = slopeRun / Math.cos(pitchRad);
    const roofArea = planArea * factor;
    const orderArea = roofArea * (1 + waste / 100);
    const coverM = cover / 1e3;
    const sheetsAcross = Math.max(1, Math.ceil(planLength / coverM - 1e-9));
    const planes = isGable ? 2 : 1;
    const nSheets = sheetsAcross * planes;
    const sheetLin = nSheets * slopeLength;
    const ridge = isGable ? planLength : 0;
    const barge = isGable ? 4 * slopeLength : 2 * slopeLength;
    const gutter = isGable ? 2 * planLength : planLength;
    const apex = isGable ? 0 : planLength;
    const nBattensPerPlane = countInclusive(slopeLength * 1e3, battenSpacing);
    const battenLin = nBattensPerPlane * planLength * planes;
    const screws = Math.ceil(roofArea * 6);
    return {
      headline: `${formatCount(nSheets, "sheets")} \xB7 ${formatM2(orderArea)} including waste`,
      kpis: [
        { label: "Roof area", value: formatM2(roofArea) },
        { label: "Sheets", value: formatNumber(nSheets, 0) },
        { label: "Sheet length", value: formatM(slopeLength, 3) },
        { label: "Pitch factor", value: formatNumber(factor, 3) }
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
              hint: `\xD7 ${formatNumber(factor, 3)} for ${formatDeg(pitch)}`
            },
            {
              label: `Order with ${formatNumber(waste, 0)}% waste`,
              value: formatM2(orderArea),
              tone: "strong"
            },
            {
              label: "Sheets across eaves",
              value: formatCount(sheetsAcross, "per plane"),
              hint: `${formatMm(cover)} cover \xB7 ${formatNumber(planes, 0)} plane${planes > 1 ? "s" : ""}`
            },
            {
              label: "Sheet length (slope)",
              value: formatM(slopeLength, 3),
              hint: "Order cut-to-length. Confirm mill max length and end-lap if needed."
            },
            { label: "Total sheet linear", value: formatM(sheetLin, 2) }
          ]
        },
        {
          title: "Flashings & fixings",
          rows: [
            {
              label: isGable ? "Ridge capping" : "Apex / barge at high side",
              value: formatM(isGable ? ridge : apex, 2)
            },
            { label: "Barge capping", value: formatM(barge, 2) },
            { label: "Gutter", value: formatM(gutter, 2) },
            {
              label: "Battens",
              value: formatM(battenLin, 2),
              hint: `${formatNumber(nBattensPerPlane, 0)} rows/plane @ ${formatMm(battenSpacing)}`
            },
            {
              label: "Roof screws (allow)",
              value: formatCount(screws, "screws"),
              hint: "About 6 per m\xB2. Every rib at eaves and ridge, every second on intermediates."
            }
          ]
        }
      ],
      order: [
        {
          item: `Corrugated ${formatMm(cover)} \xD7 ${formatM(slopeLength, 3)}`,
          qty: formatCount(nSheets, "sheets")
        },
        { item: isGable ? "Ridge capping" : "Apex flashing", qty: formatM(isGable ? ridge : apex, 2) },
        { item: "Barge capping", qty: formatM(barge, 2) },
        { item: "Gutter", qty: formatM(gutter, 2) },
        { item: "Battens", qty: formatM(battenLin, 2) },
        { item: "Roof screws", qty: formatCount(screws, "screws") }
      ],
      notes: [
        "Custom Orb / corrugated cover is typically 762 mm. Trimdek 762 mm, Kliplok 700 mm.",
        "Sheet length is the slope from ridge/apex to eave including overhang.",
        "Add sarking / insulation equal to pitched area plus laps."
      ],
      diagram: {
        type: "roof",
        span: buildingWidth,
        length: buildingLength,
        pitch,
        roofType
      }
    };
  }
  function computePitch(inputs) {
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
      rise = run * Math.tan(angle * Math.PI / 180);
    } else if (mode === "rise-span") {
      if (span <= 0 || rise <= 0) {
        return emptyOutput("Enter total span and rise to ridge");
      }
      run = span / 2;
      angle = Math.atan(rise / run) * 180 / Math.PI;
    } else {
      if (rise <= 0 || run <= 0) {
        return emptyOutput("Enter rise and run");
      }
      angle = Math.atan(rise / run) * 180 / Math.PI;
    }
    const pitchRad = angle * Math.PI / 180;
    const rafterRun = run + overhang;
    const rafter = rafterRun / Math.cos(pitchRad);
    const plumb = rafterRun * Math.tan(pitchRad);
    const hip = Math.sqrt(rise * rise + 2 * run * run);
    const hipWithOver = Math.sqrt(plumb * plumb + 2 * rafterRun * rafterRun);
    const factor = 1 / Math.cos(pitchRad);
    const ratio = rise > 0 ? run / rise : 0;
    const risePerM = Math.tan(pitchRad) * 1e3;
    const commonPitches = [5, 10, 15, 22.5, 25, 30, 35, 40, 45];
    const nearest = commonPitches.reduce(
      (a, b) => Math.abs(b - angle) < Math.abs(a - angle) ? b : a
    );
    return {
      headline: `${formatDeg(angle)} \xB7 rafter ${formatM(rafter, 3)}`,
      kpis: [
        { label: "Pitch", value: formatDeg(angle) },
        { label: "Rafter", value: formatM(rafter, 3) },
        { label: "Hip / valley", value: formatM(hipWithOver, 3) },
        { label: "Area factor", value: formatNumber(factor, 3) }
      ],
      sections: [
        {
          title: "Triangle",
          rows: [
            { label: "Rise (to ridge)", value: formatM(rise, 3), tone: "strong" },
            { label: "Run (half span)", value: formatM(run, 3) },
            {
              label: "Pitch",
              value: `${formatDeg(angle)}  \xB7  1 in ${formatNumber(ratio, 2)}`,
              tone: "strong"
            },
            {
              label: "Rise per metre run",
              value: formatMm(risePerM, 1)
            },
            {
              label: "Nearest common pitch",
              value: formatDeg(nearest),
              hint: Math.abs(nearest - angle) < 0.15 ? "On a standard pitch" : "Off-standard \u2014 confirm with the drawing"
            }
          ]
        },
        {
          title: "Members",
          rows: [
            {
              label: "Common rafter (incl. overhang)",
              value: formatM(rafter, 3),
              tone: "strong",
              hint: `${formatM(rafterRun, 3)} run including ${formatM(overhang, 2)} overhang`
            },
            { label: "Plumb height over outer wall + overhang", value: formatM(plumb, 3) },
            {
              label: "Hip / valley (to wall line)",
              value: formatM(hip, 3)
            },
            {
              label: "Hip / valley (incl. overhang)",
              value: formatM(hipWithOver, 3),
              hint: "Equal-pitch hip. Birdsmouth and plumb cuts extra."
            },
            {
              label: "Roof area factor",
              value: `\xD7 ${formatNumber(factor, 3)}`,
              hint: "Multiply plan area by this to get pitched area."
            }
          ]
        }
      ],
      order: [
        { item: "Common rafter (slope)", qty: formatM(rafter, 3) },
        { item: "Hip / valley (incl. overhang)", qty: formatM(hipWithOver, 3) }
      ],
      notes: [
        "Rafter length is slope length, not the timber you buy \u2014 add birds-mouth, ridge plumb and eaves cut.",
        "Hip length assumes equal pitch on both planes."
      ],
      diagram: {
        type: "pitch",
        rise,
        run: rafterRun,
        rafter,
        angle
      }
    };
  }

  // src/lib/calc/site.ts
  var fencingFields = [
    {
      kind: "number",
      key: "length",
      label: "Run length",
      unit: "m",
      defaultValue: 20,
      min: 0,
      step: 0.1
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
        { label: "2.1", value: 2.1 }
      ]
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
        { label: "2700", value: 2700 }
      ]
    },
    {
      kind: "number",
      key: "palingWidth",
      label: "Paling width",
      unit: "mm",
      defaultValue: 100,
      min: 50,
      step: 5
    },
    {
      kind: "number",
      key: "palingGap",
      label: "Paling gap",
      unit: "mm",
      defaultValue: 10,
      min: 0,
      step: 1
    },
    {
      kind: "number",
      key: "railCount",
      label: "Rails",
      unit: "count",
      defaultValue: 3,
      min: 2,
      max: 4,
      step: 1
    },
    {
      kind: "select",
      key: "gate",
      label: "Gate",
      defaultValue: "none",
      options: [
        { value: "none", label: "No gate" },
        { value: "single", label: "Single gate" },
        { value: "double", label: "Double gate" }
      ]
    },
    {
      kind: "number",
      key: "gateWidth",
      label: "Gate opening",
      unit: "m",
      defaultValue: 0.9,
      min: 0.7,
      step: 0.05,
      showWhen: { key: "gate", in: ["single", "double"] }
    }
  ];
  function computeFencing(inputs) {
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
    const nPosts = countInclusive(length * 1e3, postSpacing);
    const actual = nPosts > 1 ? length * 1e3 / (nPosts - 1) : 0;
    const cover = (palingWidth + palingGap) / 1e3;
    const nPalings = Math.max(1, Math.ceil(length / cover - 1e-9));
    const railLin = railCount * length;
    const extraGatePosts = gate === "none" ? 0 : gate === "double" ? 1 : 0;
    const postsTotal = nPosts + extraGatePosts;
    const gateNote = gate === "none" ? "No gate" : `${gate === "double" ? "Double" : "Single"} @ ${formatM(gateWidth, 2)}`;
    return {
      headline: `${formatCount(postsTotal, "posts")} \xB7 ${formatCount(nPalings, "palings")}`,
      kpis: [
        { label: "Posts", value: formatNumber(postsTotal, 0) },
        { label: "Centres", value: formatMm(actual, 0) },
        { label: "Palings", value: formatNumber(nPalings, 0) },
        { label: "Rails", value: formatM(railLin, 2) }
      ],
      sections: [
        {
          title: "Posts & rails",
          rows: [
            {
              label: "Posts",
              value: formatCount(postsTotal, "pcs"),
              tone: "strong",
              hint: `Set out ${formatMm(actual, 0)} \xB7 ${gate === "none" ? "ends included" : "plus gate post"}`
            },
            {
              label: "Post length (allow)",
              value: formatM(height + 0.6, 2),
              hint: "Height + 600 mm in the ground"
            },
            {
              label: "Rails",
              value: `${formatNumber(railCount, 0)} \xD7 ${formatM(length, 2)}`,
              tone: "strong"
            },
            { label: "Gate", value: gateNote }
          ]
        },
        {
          title: "Palings",
          rows: [
            {
              label: "Palings",
              value: formatCount(nPalings, "pcs"),
              tone: "strong",
              hint: `${formatMm(palingWidth)} + ${formatMm(palingGap)} gap`
            },
            { label: "Paling height", value: formatM(height, 2) }
          ]
        }
      ],
      order: [
        { item: `Posts @ ${formatM(height + 0.6, 2)}`, qty: formatCount(postsTotal, "pcs") },
        { item: "Rails", qty: formatM(railLin, 2) },
        { item: `Palings ${formatMm(palingWidth)}`, qty: formatCount(nPalings, "pcs") }
      ],
      notes: [
        "Post length allows 600 mm in the ground \u2014 check soil and wind.",
        "A double gate usually wants a drop bolt and an extra post."
      ]
    };
  }
  var brickFields = [
    {
      kind: "number",
      key: "wallLength",
      label: "Wall length",
      unit: "m",
      defaultValue: 8,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "wallHeight",
      label: "Wall height",
      unit: "m",
      defaultValue: 2.4,
      min: 0,
      step: 0.05
    },
    {
      kind: "number",
      key: "openings",
      label: "Openings",
      unit: "m2",
      defaultValue: 2,
      min: 0,
      step: 0.1
    },
    {
      kind: "select",
      key: "leaf",
      label: "Leaf",
      defaultValue: "single",
      options: [
        { value: "single", label: "Single skin (stretcher)" },
        { value: "double", label: "Double skin" }
      ]
    },
    {
      kind: "number",
      key: "waste",
      label: "Waste",
      unit: "%",
      defaultValue: 5,
      min: 0,
      max: 20,
      step: 1
    }
  ];
  function computeBrick(inputs) {
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
      headline: `${formatCount(nOrder, "bricks")} \xB7 ${formatM2(area)}`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Bricks", value: formatNumber(nOrder, 0) },
        { label: "Mortar", value: formatM3(mortarM3, 3) },
        { label: "Per m\xB2", value: formatNumber(perM2, 0) }
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
              hint: `${formatNumber(perM2, 0)} per m\xB2 \xB7 ${leaf === "double" ? "double" : "single"} skin`
            },
            {
              label: `With ${formatNumber(waste, 0)}% waste`,
              value: formatCount(nOrder, "pcs"),
              tone: "strong"
            }
          ]
        },
        {
          title: "Mortar",
          rows: [
            { label: "Mortar (allow)", value: formatM3(mortarM3, 3) },
            {
              label: "Cement bags (allow)",
              value: formatCount(cementBags, "bags"),
              hint: "About 1 bag per 100 bricks, plus sand"
            }
          ]
        }
      ],
      order: [
        { item: "Bricks", qty: formatCount(nOrder, "pcs") },
        { item: "Mortar", qty: formatM3(mortarM3, 3) },
        { item: "Cement", qty: formatCount(cementBags, "bags") }
      ],
      notes: [
        "50 bricks/m\xB2 is the usual stretcher-bond figure for a 230 \xD7 76 mm brick with 10 mm joints.",
        "Order a full extra cube if the brick is a special \u2014 you will not match the batch later."
      ]
    };
  }
  var siteVolumeFields = [
    {
      kind: "select",
      key: "material",
      label: "Material / job",
      defaultValue: "gravel",
      options: [
        { value: "excavation", label: "Excavation (cut / spoil)" },
        { value: "gravel", label: "Gravel / aggregate (fill)" },
        { value: "soil", label: "Soil / garden mix (fill)" },
        { value: "mulch", label: "Mulch (fill)" },
        { value: "asphalt", label: "Asphalt (paving)" }
      ]
    },
    {
      kind: "number",
      key: "length",
      label: "Length",
      unit: "m",
      defaultValue: 4,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "width",
      label: "Width",
      unit: "m",
      defaultValue: 2,
      min: 0,
      step: 0.1
    },
    {
      kind: "number",
      key: "depth",
      label: "Depth",
      unit: "m",
      defaultValue: 0.6,
      min: 0,
      step: 0.05,
      hint: "Trench, footing or pad depth",
      showWhen: { key: "material", in: ["excavation"] }
    },
    {
      kind: "number",
      key: "depthMm",
      label: "Depth",
      unit: "mm",
      defaultValue: 50,
      min: 10,
      step: 5,
      presets: [
        { label: "25", value: 25 },
        { label: "40", value: 40 },
        { label: "50", value: 50 },
        { label: "75", value: 75 },
        { label: "150", value: 150 }
      ],
      hint: "Typical: asphalt 40\u201350 mm compacted, gravel/mulch path 50\u201375 mm, garden soil 100\u2013150 mm",
      showWhen: { key: "material", in: ["gravel", "soil", "mulch", "asphalt"] }
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
      showWhen: { key: "material", in: ["excavation"] }
    },
    {
      kind: "number",
      key: "truck",
      label: "Truck capacity",
      unit: "m3",
      defaultValue: 8,
      min: 1,
      step: 0.5,
      showWhen: { key: "material", in: ["excavation"] }
    },
    {
      kind: "number",
      key: "allowance",
      label: "Compaction allowance",
      unit: "%",
      defaultValue: 10,
      min: 0,
      max: 30,
      step: 5,
      hint: "Loose fill settles \u2014 order extra so the finished depth holds",
      showWhen: { key: "material", in: ["gravel", "soil", "mulch"] }
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
      showWhen: { key: "material", in: ["asphalt"] }
    }
  ];
  var ASPHALT_DENSITY_T_PER_M3 = 2.4;
  var FILL_MATERIALS = {
    gravel: { label: "Gravel", bagLabel: "20 kg bags", bagYieldM3: 0.0125, densityTPerM3: 1.6 },
    soil: { label: "Soil", bagLabel: "25 L bags", bagYieldM3: 0.025, densityTPerM3: 1.3 },
    mulch: { label: "Mulch", bagLabel: "70 L bags", bagYieldM3: 0.07, densityTPerM3: 0.3 }
  };
  function computeExcavationVolume(inputs, area) {
    const depth = num(inputs.depth, 0.6);
    const bulkage = num(inputs.bulkage, 25);
    const truck = num(inputs.truck, 8);
    if (depth <= 0) {
      return emptyOutput("Enter a depth");
    }
    const inSitu = area * depth;
    const loose = inSitu * (1 + bulkage / 100);
    const loads = truck > 0 ? Math.ceil(loose / truck - 1e-9) : 0;
    return {
      headline: `${formatM3(inSitu, 3)} in situ \xB7 ${formatM3(loose, 3)} loose`,
      kpis: [
        { label: "In situ", value: formatM3(inSitu, 3) },
        { label: "Loose", value: formatM3(loose, 3) },
        { label: "Loads", value: formatNumber(loads, 0) },
        { label: "Plan", value: formatM2(area) }
      ],
      sections: [
        {
          title: "Cut",
          rows: [
            { label: "Plan area", value: formatM2(area) },
            { label: "In-situ volume", value: formatM3(inSitu, 3), tone: "strong" },
            {
              label: `Loose with ${formatNumber(bulkage, 0)}% bulkage`,
              value: formatM3(loose, 3),
              tone: "strong"
            },
            {
              label: `Truck loads @ ${formatM3(truck, 1)}`,
              value: formatCount(loads, "loads")
            }
          ]
        }
      ],
      order: [
        { item: "Spoil (loose)", qty: formatM3(loose, 3) },
        { item: "Truck loads", qty: formatCount(loads, "loads") }
      ],
      notes: [
        "Clay often bulks 20\u201330%, rock more. Sand less.",
        "This is a rectangular trench / pad. Batter the sides on deep cuts."
      ]
    };
  }
  function computeAsphaltVolume(inputs, area) {
    const thickness = num(inputs.depthMm, 40);
    const waste = num(inputs.waste, 5);
    if (thickness <= 0) {
      return emptyOutput("Enter a compacted thickness");
    }
    const volume = area * (thickness / 1e3);
    const tonnes = volume * ASPHALT_DENSITY_T_PER_M3;
    const orderTonnes = tonnes * (1 + waste / 100);
    return {
      headline: `${formatNumber(orderTonnes, 2)} t to order`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Volume", value: formatM3(volume, 3) },
        { label: "Tonnes", value: `${formatNumber(tonnes, 2)} t` },
        { label: "Order", value: `${formatNumber(orderTonnes, 2)} t` }
      ],
      sections: [
        {
          title: "Asphalt",
          rows: [
            { label: "Area", value: formatM2(area) },
            { label: "Compacted thickness", value: formatMm(thickness) },
            { label: "Volume", value: formatM3(volume, 3) },
            {
              label: "Tonnes (net)",
              value: `${formatNumber(tonnes, 2)} t`,
              hint: `At ${formatNumber(ASPHALT_DENSITY_T_PER_M3, 1)} t/m\xB3 compacted`
            },
            {
              label: `Order with ${formatNumber(waste, 0)}% waste`,
              value: `${formatNumber(orderTonnes, 2)} t`,
              tone: "strong"
            }
          ]
        }
      ],
      order: [{ item: "Hot mix asphalt", qty: `${formatNumber(orderTonnes, 2)} t` }],
      notes: [
        "2.4 t/m\xB3 is a typical compacted dense-graded hot mix \u2014 confirm with your supplier, mix design varies.",
        "This is compacted thickness, not loose-laid \u2014 asphalt compacts roughly 20\u201325% under the roller."
      ]
    };
  }
  function computeFillVolume(inputs, area, materialKey) {
    const material = FILL_MATERIALS[materialKey] ?? FILL_MATERIALS.gravel;
    const depth = num(inputs.depthMm, 75);
    const allowance = num(inputs.allowance, 10);
    if (depth <= 0) {
      return emptyOutput("Enter a depth");
    }
    const net = area * (depth / 1e3);
    const order = net * (1 + allowance / 100);
    const bags = Math.ceil(order / material.bagYieldM3 - 1e-9);
    const tonnes = order * material.densityTPerM3;
    const flags = [];
    if (order >= 1) {
      flags.push({
        tone: "ok",
        text: "Over ~1 m\xB3, a bulk trailer-load from a landscape yard is usually cheaper than bags."
      });
    }
    return {
      headline: `${formatM3(order, 3)} to order \xB7 ${material.label}`,
      kpis: [
        { label: "Area", value: formatM2(area) },
        { label: "Net", value: formatM3(net, 3) },
        { label: "Order", value: formatM3(order, 3) },
        { label: "Bags", value: formatNumber(bags, 0) }
      ],
      flags,
      sections: [
        {
          title: "Fill",
          rows: [
            { label: "Area", value: formatM2(area) },
            { label: "Depth", value: formatMm(depth) },
            { label: "Net volume", value: formatM3(net, 3) },
            {
              label: `Order with ${formatNumber(allowance, 0)}% allowance`,
              value: formatM3(order, 3),
              tone: "strong"
            },
            {
              label: material.bagLabel,
              value: formatCount(bags, "bags"),
              hint: `${formatM3(material.bagYieldM3, 3)} yield per bag`
            },
            {
              label: "Approx weight",
              value: `${formatNumber(tonnes, 1)} t`,
              hint: `${formatNumber(material.densityTPerM3, 1)} t/m\xB3 loose`
            }
          ]
        }
      ],
      order: [
        { item: material.label, qty: formatM3(order, 3) },
        { item: material.bagLabel, qty: formatCount(bags, "bags") }
      ],
      notes: [
        "Bag yield is a hardware-store rule of thumb \u2014 check the bag, brands vary.",
        "Landscape yards sell gravel, soil and mulch bulk by the m\xB3 or by weight \u2014 ask which they quote.",
        "Compaction allowance covers settling under foot traffic or light vehicles, not structural loading."
      ]
    };
  }
  function computeSiteVolume(inputs) {
    const materialKey = str(inputs.material, "gravel");
    const length = num(inputs.length);
    const width = num(inputs.width);
    if (length <= 0 || width <= 0) {
      return emptyOutput("Enter length and width");
    }
    const area = length * width;
    if (materialKey === "excavation") return computeExcavationVolume(inputs, area);
    if (materialKey === "asphalt") return computeAsphaltVolume(inputs, area);
    return computeFillVolume(inputs, area, materialKey);
  }

  // src/lib/calc/stairs.ts
  var stairsFields = [
    { kind: "section", label: "Flight" },
    {
      kind: "number",
      key: "totalRise",
      label: "Total rise",
      unit: "m",
      defaultValue: 2.7,
      min: 0,
      step: 0.01,
      hint: "Finished floor to finished floor"
    },
    {
      kind: "number",
      key: "totalGoing",
      label: "Total going",
      unit: "m",
      defaultValue: 0,
      min: 0,
      step: 0.01,
      hint: "Leave 0 to size going from 2R+G"
    },
    {
      kind: "number",
      key: "width",
      label: "Clear width",
      unit: "m",
      defaultValue: 1,
      min: 0.6,
      step: 0.05
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
        { label: "180", value: 180 }
      ]
    }
  ];
  var MIN_RISER = 115;
  var MAX_RISER = 190;
  var MIN_GOING = 240;
  var MAX_GOING = 355;
  var MIN_2RG = 550;
  var MAX_2RG = 700;
  function computeStairs(inputs) {
    const totalRise = num(inputs.totalRise);
    const totalGoingIn = num(inputs.totalGoing);
    const width = num(inputs.width, 1);
    const targetRiser = num(inputs.targetRiser, 175);
    const riseMm = totalRise * 1e3;
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
    let going;
    let goingMode;
    if (totalGoingIn > 0 && nGoings > 0) {
      going = totalGoingIn * 1e3 / nGoings;
      goingMode = "fixed";
    } else {
      const target2RG = 650;
      going = target2RG - 2 * riser;
      going = Math.min(MAX_GOING, Math.max(MIN_GOING, going));
      goingMode = "auto";
    }
    const twoRG = 2 * riser + going;
    const pitch = Math.atan(riser / going) * 180 / Math.PI;
    const totalGoing = nGoings * going / 1e3;
    const stringer = nGoings * Math.hypot(going, riser) / 1e3;
    const treadArea = nGoings * (going / 1e3) * width;
    const riserArea = nRisers * (riser / 1e3) * width;
    const flags = [];
    const riserOk = riser >= MIN_RISER - 0.05 && riser <= MAX_RISER + 0.05;
    const goingOk = going >= MIN_GOING - 0.05 && going <= MAX_GOING + 0.05;
    const twoOk = twoRG >= MIN_2RG - 0.05 && twoRG <= MAX_2RG + 0.05;
    if (riserOk && goingOk && twoOk) {
      flags.push({
        tone: "ok",
        text: "Riser, going and 2R+G sit inside typical NCC domestic ranges."
      });
    }
    if (!riserOk) {
      flags.push({
        tone: "bad",
        text: `Riser ${formatMm(riser, 1)} is outside 115\u2013190 mm.`
      });
    }
    if (!goingOk) {
      flags.push({
        tone: goingMode === "fixed" ? "bad" : "warn",
        text: `Going ${formatMm(going, 1)} is outside 240\u2013355 mm.`
      });
    }
    if (!twoOk) {
      flags.push({
        tone: "warn",
        text: `2R+G is ${formatMm(twoRG, 1)} (typical 550\u2013700 mm).`
      });
    }
    if (nRisers > 18) {
      flags.push({
        tone: "warn",
        text: `${nRisers} risers \u2014 a landing is usually required after 18.`
      });
    }
    return {
      headline: `${formatNumber(nRisers, 0)} risers @ ${formatMm(riser, 1)} \xB7 going ${formatMm(going, 1)}`,
      kpis: [
        { label: "Risers", value: formatNumber(nRisers, 0) },
        { label: "Riser", value: formatMm(riser, 1) },
        { label: "Going", value: formatMm(going, 1) },
        { label: "Pitch", value: formatDeg(pitch) }
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
              hint: "Typical 115\u2013190 mm"
            },
            {
              label: "Going",
              value: formatMm(going, 1),
              tone: goingOk ? "ok" : "warn",
              hint: goingMode === "auto" ? "Auto-sized so 2R+G \u2248 650 mm" : "From the total going you entered"
            },
            {
              label: "2R + G",
              value: formatMm(twoRG, 1),
              tone: twoOk ? "ok" : "warn",
              hint: "Typical 550\u2013700 mm"
            },
            { label: "Pitch", value: formatDeg(pitch) },
            { label: "Total going", value: formatM(totalGoing, 3), tone: "strong" }
          ]
        },
        {
          title: "Cutting list",
          rows: [
            {
              label: "Stringer length (nosing line)",
              value: formatM(stringer, 3),
              tone: "strong",
              hint: "Two stringers. Add extra for landings and plumb cuts."
            },
            { label: "Treads", value: formatCount(nGoings, "pcs") },
            { label: "Risers (if closed)", value: formatCount(nRisers, "pcs") },
            { label: "Tread area (allow)", value: formatM2(treadArea) },
            { label: "Riser area (allow)", value: formatM2(riserArea) },
            { label: "Clear width", value: formatM(width, 2) }
          ]
        }
      ],
      order: [
        { item: "Stringers", qty: `2 pcs \xB7 ${formatM(stringer, 3)}` },
        { item: "Treads", qty: formatCount(nGoings, "pcs") },
        { item: "Risers", qty: formatCount(nRisers, "pcs") }
      ],
      notes: [
        "Ranges shown are typical NCC domestic figures (115\u2013190 mm riser, 240\u2013355 mm going, 2R+G 550\u2013700 mm). Confirm against the current code, the drawing and the certifier.",
        "First riser is from the lower floor; number of treads is one less than risers in a single straight flight.",
        "Check headroom (usually 2.0 m min) and a landing if the flight is long."
      ],
      diagram: {
        type: "stairs",
        totalRise,
        totalGoing,
        riser: riser / 1e3,
        going: going / 1e3,
        nRisers
      }
    };
  }

  // src/lib/calc/catalog.ts
  var calculators = [
    {
      slug: "decking",
      name: "Decking",
      short: "Boards, joists, bearers, posts",
      category: "Carpentry",
      compute: computeDecking,
      fields: deckingFields
    },
    {
      slug: "stairs",
      name: "Stairs",
      short: "Risers, goings, stringers",
      category: "Carpentry",
      compute: computeStairs,
      fields: stairsFields
    },
    {
      slug: "wall-framing",
      name: "Wall framing",
      short: "Studs, plates, nogs",
      category: "Carpentry",
      compute: computeFraming,
      fields: framingFields
    },
    {
      slug: "balustrade",
      name: "Balustrade",
      short: "Posts, infill, handrail",
      category: "Carpentry",
      compute: computeBalustrade,
      fields: balustradeFields
    },
    {
      slug: "corrugated",
      name: "Corrugated roof",
      short: "Sheets, slope, flashings",
      category: "Roofing",
      compute: computeCorrugated,
      fields: corrugatedFields
    },
    {
      slug: "pitch",
      name: "Roof pitch",
      short: "Rise, run, rafter, hip",
      category: "Roofing",
      kind: "setout",
      compute: computePitch,
      fields: pitchFields
    },
    {
      slug: "concrete",
      name: "Concrete",
      short: "Slabs, footings, piers, bags",
      category: "Wet trades",
      compute: computeConcrete,
      fields: concreteFields
    },
    {
      slug: "brickwork",
      name: "Brickwork",
      short: "Bricks, mortar, waste",
      category: "Wet trades",
      compute: computeBrick,
      fields: brickFields
    },
    {
      slug: "fencing",
      name: "Fencing",
      short: "Posts, rails, palings",
      category: "Site",
      compute: computeFencing,
      fields: fencingFields
    },
    {
      slug: "site-volume",
      name: "Site volume & tonnage",
      short: "Excavation, gravel, soil, mulch, asphalt",
      category: "Site",
      compute: computeSiteVolume,
      fields: siteVolumeFields
    },
    {
      slug: "flooring",
      name: "Flooring",
      short: "Boards, packs, waste",
      category: "Fit-out",
      compute: computeFlooring,
      fields: flooringFields
    },
    {
      slug: "tiling",
      name: "Tiling",
      short: "Tiles, adhesive, grout",
      category: "Fit-out",
      compute: computeTiling,
      fields: tilingFields
    },
    {
      slug: "paint",
      name: "Paint",
      short: "Walls, coats, litres",
      category: "Fit-out",
      compute: computePaint,
      fields: paintFields
    },
    {
      slug: "plasterboard",
      name: "Plasterboard",
      short: "Sheets, tape, compound",
      category: "Fit-out",
      compute: computePlaster,
      fields: plasterFields
    },
    {
      slug: "check-square",
      name: "Check square",
      short: "3-4-5 & diagonal check",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeCheckSquare,
      fields: checkSquareFields
    },
    {
      slug: "equal-spacing",
      name: "Equal spacing",
      short: "Divide a run, or mark a fixed increment",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeEqualSpacing,
      fields: equalSpacingFields
    },
    {
      slug: "slope",
      name: "Slope & fall",
      short: "Ratio, percent, angle",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeSlope,
      fields: slopeFields
    },
    {
      slug: "arc-setout",
      name: "Arc setout",
      short: "Radius, chord, offsets",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeArcSetout,
      fields: arcSetoutFields
    },
    {
      slug: "levelling",
      name: "Level survey",
      short: "Backsight, foresight, RL",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeLevelling,
      fields: levellingFields
    },
    {
      slug: "triangle",
      name: "Triangle",
      short: "Right, SSS or SAS solver",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeTriangle,
      fields: triangleFields
    },
    {
      slug: "mitre-angle",
      name: "Mitre angle",
      short: "Saw angle from corner",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeMitreAngle,
      fields: mitreAngleFields
    },
    {
      slug: "cut-list",
      name: "Cut list",
      short: "Optimise cuts from stock lengths",
      category: "Setout & Measuring",
      kind: "setout",
      compute: computeCutList,
      fields: cutListFields
    }
  ];
  var categories = [
    "Carpentry",
    "Roofing",
    "Wet trades",
    "Site",
    "Fit-out",
    "Setout & Measuring"
  ];
  function getCalculator(slug) {
    return calculators.find((c) => c.slug === slug);
  }
  function categorySlug(cat) {
    return cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function categoryFromSlug(slug) {
    return categories.find((c) => categorySlug(c) === slug);
  }
  function defaultsFor(fields) {
    const out = {};
    for (const field of fields) {
      if (field.kind === "number") out[field.key] = field.defaultValue;
      if (field.kind === "select") out[field.key] = field.defaultValue;
    }
    return out;
  }
  function isFieldVisible(field, inputs) {
    if (!field.showWhen) return true;
    const v = String(inputs[field.showWhen.key] ?? "");
    return field.showWhen.in.includes(v);
  }
  return __toCommonJS(index_exports);
})();
