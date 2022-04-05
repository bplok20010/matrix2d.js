import { Matrix2D } from "../src/main";

const precision = 0.000001;

describe("skew", () => {
  it("should return a skew matrix", () => {
    // example https://msdn.microsoft.com/en-us/library/system.windows.media.matrix.skew(v=vs.110).aspx#Anchor_1
    const m = { a: 5, b: 10, c: 15, d: 20, e: 25, f: 30 };
    const mtx = new Matrix2D();
    mtx.skew(45, 180);
    mtx.append(m.a, m.b, m.c, m.d, m.e, m.f);

    expect(Math.abs(mtx.a - 15)).toBeLessThanOrEqual(precision);
    expect(Math.abs(mtx.b - 10)).toBeLessThanOrEqual(precision);
    expect(Math.abs(mtx.c - 35)).toBeLessThanOrEqual(precision);
    expect(Math.abs(mtx.d - 20)).toBeLessThanOrEqual(precision);
    expect(Math.abs(mtx.e - 55)).toBeLessThanOrEqual(precision);
    expect(Math.abs(mtx.f - 30)).toBeLessThanOrEqual(precision);
  });

  it("should transform a point on X axis", () => {
    const mtx = new Matrix2D();
    mtx.skew(10, 0);
    const pointI = mtx.transformPoint(5, 4);
    // https://jsfiddle.net/t1yLa3ed/1/
    expect(Math.abs(pointI.x - 5.70530792283386)).toBeLessThanOrEqual(precision);
    expect(Math.abs(pointI.y - 4)).toBeLessThanOrEqual(precision);
  });

  it("should transform a point on Y axis", () => {
    const mtx = new Matrix2D();
    mtx.skew(0, 10);
    const point = { x: 5, y: 4 };
    const pointI = mtx.transformPoint(5, 4);
    // https://jsfiddle.net/t1yLa3ed/2/
    expect(Math.abs(pointI.x - 5)).toBeLessThanOrEqual(precision);
    expect(Math.abs(pointI.y - 4.8816349035423245)).toBeLessThanOrEqual(precision);
  });
});
