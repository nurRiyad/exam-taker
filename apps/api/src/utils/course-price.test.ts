import { describe, expect, it } from "vitest";
import { computeEffectivePriceBdt } from "./course-price";

const base = { basePriceBdt: 1000, discountPercent: null, discountStartAt: null, discountEndAt: null };

describe("computeEffectivePriceBdt", () => {
  it("returns the base price with no discount configured", () => {
    expect(computeEffectivePriceBdt(base, new Date("2026-01-01T00:00:00Z"))).toBe(1000);
  });

  it("applies the discount when now falls within the window", () => {
    const course = {
      ...base,
      discountPercent: 20,
      discountStartAt: "2026-01-01 00:00:00",
      discountEndAt: "2026-01-31 23:59:59",
    };
    expect(computeEffectivePriceBdt(course, new Date("2026-01-15T00:00:00Z"))).toBe(800);
  });

  it("ignores the discount before the window starts", () => {
    const course = {
      ...base,
      discountPercent: 20,
      discountStartAt: "2026-02-01 00:00:00",
      discountEndAt: "2026-02-28 23:59:59",
    };
    expect(computeEffectivePriceBdt(course, new Date("2026-01-15T00:00:00Z"))).toBe(1000);
  });

  it("ignores the discount after the window ends", () => {
    const course = {
      ...base,
      discountPercent: 20,
      discountStartAt: "2026-01-01 00:00:00",
      discountEndAt: "2026-01-10 23:59:59",
    };
    expect(computeEffectivePriceBdt(course, new Date("2026-01-15T00:00:00Z"))).toBe(1000);
  });

  it("treats an open-ended discount (no end date) as active once started", () => {
    const course = { ...base, discountPercent: 10, discountStartAt: "2026-01-01 00:00:00", discountEndAt: null };
    expect(computeEffectivePriceBdt(course, new Date("2030-01-01T00:00:00Z"))).toBe(900);
  });
});
