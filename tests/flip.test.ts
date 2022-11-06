import { Matrix2D } from "../src/main";

const point = { x: 42, y: 24 };

describe("flip", () => {
  it("should flip a point on x-axis", () => {
    const mtx = new Matrix2D();
    mtx.flipX();
    expect(mtx.transformPoint(point.x, point.y)).toEqual({ x: 42, y: -24 });

    mtx.reset();
    mtx.flipX(20, 20);
    expect(mtx.transformPoint(point.x, point.y)).toEqual({ x: 42, y: 16 });
  });

  it("should flip a point on y-axis", () => {
    const mtx = new Matrix2D();
    mtx.flipY();
    expect(mtx.transformPoint(point.x, point.y)).toEqual({ x: -42, y: 24 });

    mtx.reset();
    mtx.flipY(20, 20);
    expect(mtx.transformPoint(point.x, point.y)).toEqual({ x: -2, y: 24 });
  });

  it("should flip a point on origin", () => {
    const mtx = new Matrix2D();
    mtx.flipOrigin();
    expect(mtx.transformPoint(point.x, point.y)).toEqual({ x: -42, y: -24 });
  });
});
