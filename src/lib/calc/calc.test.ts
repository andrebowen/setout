import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeBalustrade } from "./balustrade.ts";
import { computeConcrete } from "./concrete.ts";
import { computeDecking } from "./decking.ts";
import { computeCorrugated, computePitch } from "./roof.ts";
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
      bearerSpacing: 1800,
      postSpacing: 1800,
      waste: 10,
      screwsPerJoist: 2,
    });
    assert.match(out.headline, /28 boards/);
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
