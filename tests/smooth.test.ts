import { Matrix2D } from "../src/main";

describe("smoothMatrix", () => {
  it("should round to the 10th digit (default)", () => {
    const m1 = { a: 0.00000000001, b: 0, c: 0.00000000008, d: 0, tx: 0, ty: 0 };
    const m2 = { a: 0, b: 0, c: 0.0000000001, d: 0, tx: 0, ty: 0 };
    expect(Matrix2D.fromMatrix(m1).smooth()).toMatchObject(m2);
  });
  it("should not round", () => {
    const m1 = { a: 0.0000000001, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    expect(Matrix2D.fromMatrix(m1).smooth()).toMatchObject(m1);
  });
  it("should round to the 10th digit (default (2))", () => {
    const m1 = { a: 0.00000000007, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    const m2 = { a: 0.0000000001, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    expect(Matrix2D.fromMatrix(m1).smooth()).toMatchObject(m2);
  });
  it("should round to the first digit", () => {
    const m1 = { a: 0.1, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    const m2 = { a: 0, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    expect(Matrix2D.fromMatrix(m1).smooth(1)).toMatchObject(m2);
  });
  it("should round to the first digit (2)", () => {
    const m1 = { a: 0.8, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    const m2 = { a: 1, b: 0, c: 0, d: 0, tx: 0, ty: 0 };
    expect(Matrix2D.fromMatrix(m1).smooth(1)).toMatchObject(m2);
  });
});
