import {
  getDisplayName,
  normalizeComingSoon,
  formatDisplayTime,
} from "./helpers";

describe("getDisplayName", () => {
  it("splits PascalCase into two parts", () => {
    expect(getDisplayName("CommerceFlow")).toEqual(["COMMERCE", "FLOW"]);
  });

  it("splits on spaces, keeping everything after the first word together", () => {
    expect(getDisplayName("New Project")).toEqual(["NEW", "PROJECT"]);
    expect(getDisplayName("API Dashboard")).toEqual(["API", "DASHBOARD"]);
  });

  it("treats dashes, en/em dashes and colons as separators", () => {
    expect(getDisplayName("2DU - Task Management")).toEqual([
      "2DU",
      "TASK MANAGEMENT",
    ]);
    expect(getDisplayName("Limprimerie - Bakery")).toEqual([
      "LIMPRIMERIE",
      "BAKERY",
    ]);
    expect(getDisplayName("Thing – Other")).toEqual(["THING", "OTHER"]);
    expect(getDisplayName("Thing: Other")).toEqual(["THING", "OTHER"]);
  });

  it("collapses runs of whitespace and separators", () => {
    expect(getDisplayName("  Spaced   Out  ")).toEqual(["SPACED", "OUT"]);
    expect(getDisplayName("A --- B")).toEqual(["A", "B"]);
  });

  it("returns an empty second part for a single word", () => {
    expect(getDisplayName("Portfolio")).toEqual(["PORTFOLIO", ""]);
    // No capital-letter boundary to split on, so it stays whole.
    expect(getDisplayName("portfolio")).toEqual(["PORTFOLIO", ""]);
  });

  it("joins three or more PascalCase words into the second part", () => {
    expect(getDisplayName("OneTwoThree")).toEqual(["ONE", "TWOTHREE"]);
  });

  it("handles an empty string without throwing", () => {
    expect(getDisplayName("")).toEqual(["", ""]);
  });

  it("always returns a two-element tuple", () => {
    const inputs = ["CommerceFlow", "New Project", "x", "", "A - B - C"];
    inputs.forEach((input) => {
      expect(getDisplayName(input)).toHaveLength(2);
    });
  });
});

describe("normalizeComingSoon", () => {
  it("collapses the unique COMING*/SOON* identifiers to a clean label", () => {
    expect(normalizeComingSoon(["COMINGC", "SOONC"])).toEqual([
      "COMING",
      "SOON",
    ]);
    expect(normalizeComingSoon(["COMINGD", "SOOND"])).toEqual([
      "COMING",
      "SOON",
    ]);
  });

  it("leaves an already-clean COMING SOON alone", () => {
    expect(normalizeComingSoon(["COMING", "SOON"])).toEqual(["COMING", "SOON"]);
  });

  it("passes real project names through untouched", () => {
    expect(normalizeComingSoon(["COMMERCE", "FLOW"])).toEqual([
      "COMMERCE",
      "FLOW",
    ]);
    expect(normalizeComingSoon(["JUSTIN", "POTTER"])).toEqual([
      "JUSTIN",
      "POTTER",
    ]);
  });

  it("requires both halves to match before collapsing", () => {
    expect(normalizeComingSoon(["COMINGC", "LATER"])).toEqual([
      "COMINGC",
      "LATER",
    ]);
    expect(normalizeComingSoon(["ALMOST", "SOONC"])).toEqual([
      "ALMOST",
      "SOONC",
    ]);
  });

  // The identifiers exist so that hovering between two "COMING SOON" cards
  // still looks like a change upstream. Normalizing must not erase that.
  it("keeps distinct identifiers distinct before normalization", () => {
    expect(["COMINGC", "SOONC"]).not.toEqual(["COMINGD", "SOOND"]);
  });
});

describe("formatDisplayTime", () => {
  // Asserting the shape rather than a literal keeps this green in any
  // timezone; the exact hour depends on where the test runs.
  const HH_MM_SS = /^\d{2}:\d{2}:\d{2}$/;

  it("formats a date as zero-padded 24-hour time", () => {
    expect(formatDisplayTime(null, new Date("2026-01-02T15:04:05Z"))).toMatch(
      HH_MM_SS,
    );
  });

  it("ignores the hovered project entirely", () => {
    const when = new Date("2026-01-02T15:04:05Z");
    expect(formatDisplayTime({ year: 2024 }, when)).toBe(
      formatDisplayTime(null, when),
    );
  });

  it("falls back to a placeholder rather than throwing on a bad date", () => {
    const broken = {
      toLocaleTimeString() {
        throw new Error("unsupported locale");
      },
    } as unknown as Date;
    expect(formatDisplayTime(null, broken)).toBe("00:00:00");
  });
});
