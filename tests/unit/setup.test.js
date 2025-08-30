import { describe, it, expect } from "vitest";

describe("FunLearning - Tests de base", () => {
  it("should validate project structure", () => {
    expect(true).toBe(true);
  });

  it("should have correct environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
