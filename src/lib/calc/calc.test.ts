import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeBalustrade } from "./balustrade.ts";
import { computeConcrete } from "./concrete.ts";
import { computeDecking } from "./decking.ts";
import { computeFraming } from "./framing.ts";
import {
  computeArcSetout,
  computeCheckSquare,
  computeCutList,
  computeEqualSpacing,
  computeLevelling,
  computeMitreAngle,
  computeSlope,
  computeTriangle,
} from "./measuring.ts";
import { computeCorrugated, computePitch } from "./roof.ts";
import { computeSiteVolume } from "./site.ts";
import { computeStairs } from "./stairs.ts";
import { calculators, defaultsFor, getCalculator } from "./catalog.ts";

describe("catalog", () => {
  it("registers unique slugs and default inputs", () => {
    const slugs = calculators.map((c) => c.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const calc of calculators) {
      const inputs = defaultsFor(calc.fields);
      const out = calc.compute(inputs);
      assert.ok(out.headline.length > 0);
    }
  });

  it("looks up by slug", () => {
    assert.equal(getCalculator("stairs")?.name, "Stairs");
    assert.equal(getCalculator("missing"), undefined);
  });
});

describe("decking", () => {
  it("counts boards across a 6 × 4 m deck", () => {
    const out = computeDecking({
      length: 6,
      width: 4,
      boardWidth: 140,
      boardGap: 5,
      stockLength: 5.4,
      joistSpacing: 450,
      waste: 10,
      screwsPerJoist: 2,
    });
    assert.match(out.headline, /35 stock lengths/);
    assert.equal(out.kpis[0]?.value, "24 m²");
    const stock = out.sections[0]?.rows.find((r) => r.label.startsWith("Stock"));
    assert.equal(stock?.value, "35 pcs");
  });
});

describe("stairs", () => {
  it("sizes a 2.7 m rise to a legal-looking flight", () => {
    const out = computeStairs({
      totalRise: 2.7,
      totalGoing: 0,
      width: 1,
      targetRiser: 175,
    });
    assert.equal(out.kpis[0]?.value, "15");
    assert.match(out.kpis[1]?.value ?? "", /180/);
    assert.ok(out.flags?.some((f) => f.tone === "ok"));
  });
});

describe("corrugated + pitch", () => {
  it("orders gable sheets for a 12 × 8 m building", () => {
    const out = computeCorrugated({
      buildingLength: 12,
      buildingWidth: 8,
      pitch: 22.5,
      eaveOverhang: 0.45,
      gableOverhang: 0.05,
      cover: 762,
      waste: 5,
      roofType: "gable",
      battenSpacing: 900,
    });
    assert.match(out.headline, /sheets/);
    assert.ok((out.order?.length ?? 0) >= 4);
  });

  it("computes rafter from rise and run", () => {
    const out = computePitch({
      mode: "rise-run",
      rise: 1.8,
      run: 4,
      overhang: 0.45,
    });
    assert.match(out.kpis[0]?.value ?? "", /24/);
    assert.match(out.headline, /rafter/);
  });
});

describe("concrete + balustrade", () => {
  it("volumes a 6 × 4 × 100 mm slab", () => {
    const out = computeConcrete({
      shape: "slab",
      length: 6,
      width: 4,
      thickness: 100,
      waste: 10,
      bagKg: 20,
    });
    assert.match(out.headline, /2\.64 m³/);
  });

  it("puts posts at both ends", () => {
    const out = computeBalustrade({
      length: 8,
      height: 1,
      postSpacing: 1200,
      infill: "verticals",
      maxGap: 125,
      balusterWidth: 40,
    });
    assert.equal(out.kpis[0]?.value, "8");
  });
});

describe("site-volume", () => {
  it("computes cut/spoil and truck loads for an 8 × 0.45 × 0.6 m trench", () => {
    const out = computeSiteVolume({
      material: "excavation",
      length: 8,
      width: 0.45,
      depth: 0.6,
      bulkage: 25,
      truck: 8,
    });
    // 8*0.45*0.6 = 2.16 m³ in situ, *1.25 bulkage = 2.7 m³ loose, /8 t truck = 1 load
    assert.match(out.headline, /2\.16 m³ in situ/);
    assert.equal(out.kpis[2]?.value, "1");
  });

  it("volumes a 4 × 2 m × 75 mm gravel path with 10% allowance", () => {
    const out = computeSiteVolume({
      material: "gravel",
      length: 4,
      width: 2,
      depthMm: 75,
      allowance: 10,
    });
    assert.match(out.headline, /0\.66 m³/);
    assert.equal(out.kpis[3]?.value, "53");
  });

  it("orders tonnes for a 6 × 3 m driveway at 40 mm compacted", () => {
    const out = computeSiteVolume({ material: "asphalt", length: 6, width: 3, depthMm: 40, waste: 5 });
    // 6*3*0.04 = 0.72 m³ * 2.4 t/m³ = 1.728 t, +5% waste = 1.8144 t
    assert.match(out.headline, /1\.81 t/);
  });
});

describe("check-square", () => {
  it("confirms a 3-4-5 rectangle with matching diagonals", () => {
    const out = computeCheckSquare({ sideA: 3, sideB: 4, diagonal1: 5, diagonal2: 5 });
    assert.equal(out.headline, "Square ✓");
    assert.equal(out.kpis[0]?.value, "5 m");
  });

  it("flags a racked frame when diagonals disagree", () => {
    const out = computeCheckSquare({ sideA: 3, sideB: 4, diagonal1: 5.05, diagonal2: 4.98 });
    assert.ok(out.flags?.some((f) => f.tone === "bad" || f.tone === "warn"));
  });
});

describe("equal-spacing", () => {
  it("divides 3.6 m into 300 mm target spacing", () => {
    const out = computeEqualSpacing({ totalLength: 3.6, mode: "target-spacing", targetSpacing: 300 });
    assert.equal(out.kpis[0]?.value, "12");
    assert.equal(out.kpis[1]?.value, "300 mm");
  });

  it("lists cumulative marks from a start offset (fixed-increment mode)", () => {
    const out = computeEqualSpacing({ mode: "fixed-increment", startOffset: 100, increment: 300, count: 2 });
    assert.equal(out.kpis[3]?.value, "700 mm");
    const rows = out.sections[0]?.rows ?? [];
    assert.equal(rows[0]?.value, "100 mm");
    assert.equal(rows[2]?.value, "700 mm");
  });
});

describe("triangle", () => {
  it("solves a 3-4-5 right triangle from two legs", () => {
    const out = computeTriangle({ mode: "right-legs", legA: 3, legB: 4 });
    assert.equal(out.kpis[0]?.value, "5 m");
    assert.equal(out.kpis[3]?.value, "90°");
  });

  it("solves SSS with the law of cosines", () => {
    const out = computeTriangle({ mode: "sss", sssA: 5, sssB: 6, sssC: 7 });
    const perimeterRow = out.sections[0]?.rows.find((r) => r.label === "Perimeter");
    assert.equal(perimeterRow?.value, "18 m");
  });

  it("rejects an impossible triangle", () => {
    const out = computeTriangle({ mode: "sss", sssA: 1, sssB: 1, sssC: 10 });
    assert.match(out.headline, /Not a valid triangle/);
  });
});

describe("mitre-angle", () => {
  it("gives 45° each side for a standard 90° corner", () => {
    const out = computeMitreAngle({ cornerAngle: 90, cornerType: "internal" });
    assert.equal(out.kpis[1]?.value, "45°");
  });
});

describe("levelling", () => {
  it("reduces a target level from one backsight/foresight pair", () => {
    const out = computeLevelling({ bmRL: 100, backsight: 1500, foresight: 1200 });
    assert.match(out.headline, /Target RL 100\.3/);
    assert.equal(out.kpis[1]?.value, "101.5");
  });
});

describe("slope", () => {
  it("converts rise and run to ratio, percent and angle", () => {
    const out = computeSlope({ mode: "rise-run", rise: 100, run: 10, context: "general" });
    assert.match(out.headline, /1 in 100/);
    assert.equal(out.kpis[1]?.value, "1%");
  });

  it("flags a ramp steeper than 1:14", () => {
    const out = computeSlope({ mode: "ratio", ratioX: 10, context: "ramp" });
    assert.ok(out.flags?.some((f) => f.tone === "bad"));
  });
});

describe("arc-setout", () => {
  it("derives radius, sagitta and arc length from radius + angle", () => {
    const out = computeArcSetout({ mode: "radius-angle", radius: 5, angle: 90, offsetInterval: 500 });
    assert.equal(out.kpis[0]?.value, "5 m");
    assert.equal(out.kpis[1]?.value, "7.071 m");
    assert.match(out.headline, /R 5 m/);
  });
});

describe("cut-list", () => {
  it("packs 4×900 + 6×600 onto 5.4 m stock with 3 mm kerf", () => {
    const out = computeCutList({
      stockLength: 5.4,
      kerf: 3,
      cutLength1: 900,
      cutQty1: 4,
      cutLength2: 600,
      cutQty2: 6,
      cutLength3: 0,
      cutQty3: 0,
      cutLength4: 0,
      cutQty4: 0,
      cutLength5: 0,
      cutQty5: 0,
      cutLength6: 0,
      cutQty6: 0,
    });
    assert.equal(out.kpis[0]?.value, "2");
    assert.equal(out.kpis[1]?.value, "10");
    assert.match(out.kpis[2]?.value ?? "", /33\.1%/);
  });
});

describe("framing raked wall", () => {
  it("steps stud lengths evenly between a low and high end", () => {
    const out = computeFraming({
      wallLength: 6,
      wallType: "raked",
      lowHeight: 2.4,
      highHeight: 3.6,
      studSpacing: 450,
      plateThickness: 35,
      topPlates: 2,
      nogRows: 1,
      doors: 0,
      windows: 0,
    });
    assert.match(out.headline, /raked/);
    assert.equal(out.kpis[3]?.value, "11.3°");
    const raked = out.sections.find((s) => s.title === "Raked studs");
    assert.ok(raked);
    const step = raked?.rows.find((r) => r.label === "Step per stud");
    assert.equal(step?.value, "85.7 mm");
  });
});
