import { Matrix2D } from "../src/main";

describe("rotate", () => {
  it("should return a rotation matrix", () => {
    const mtx = new Matrix2D();
    mtx.rotate(90);
    const precision = 0.00001;
    const point = mtx.transformPoint(50, 80);
    expect(Math.abs(point.x - -80)).toBeLessThanOrEqual(precision);
    expect(Math.abs(point.y - 50)).toBeLessThanOrEqual(precision);
  });
  it("should rotate a point about a specified center 1", () => {
    const mtx = new Matrix2D();
    mtx.rotate(90, 50, 20);
    const point = mtx.transformPoint(100, 40); // yellow
    const precision = 0.00001;
    expect(Math.abs(point.x - 30)).toBeLessThanOrEqual(precision);
    expect(Math.abs(point.y - 70)).toBeLessThanOrEqual(precision);
  });
  it("should rotate a point about a specified center 2", () => {
    const mtx = new Matrix2D();
    mtx.rotate(90);
    const point = mtx.transformPoint(100, 40, {
      x: 50,
      y: 20,
    }); // yellow
    const precision = 0.00001;
    expect(Math.abs(point.x - 30)).toBeLessThanOrEqual(precision);
    expect(Math.abs(point.y - 70)).toBeLessThanOrEqual(precision);
  });
});
