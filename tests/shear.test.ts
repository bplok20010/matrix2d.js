import { Matrix2D } from "../src/main";

describe("shear", () => {
  it("should return a scale matrix", () => {
    const m = new Matrix2D();
    m.shear(10, 20);
    expect(m).toEqual({
      a: 1,
      c: 10,
      tx: 0,
      b: 20,
      d: 1,
      ty: 0,
    });
  });

  it("should transform a point", () => {
    const m = new Matrix2D();
    m.shear(10, 20);
    expect(m.transformPoint(0, 30)).toEqual({ x: 300, y: 30 });

    m.reset();
    m.shear(10, 20, 10, 10);
    expect(m.transformPoint(0, 30)).toEqual({ x: 200, y: -170 });

    m.reset();
    m.shear(0, 10);
    expect(m.transformPoint(30, 0)).toEqual({ x: 30, y: 300 });
    m.reset();
    m.shear(20, 10);
    expect(m.transformPoint(30, 15)).toEqual({ x: 330, y: 315 });
  });
});
