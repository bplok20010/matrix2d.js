import { Matrix2D } from "../src/main";

describe("translate", () => {
  it("should return a transform matrix", () => {
    const mtx = new Matrix2D();
    mtx.translate(40, 60);
    expect(mtx).toMatchObject({
      a: 1,
      c: 0,
      e: 40,
      b: 0,
      d: 1,
      f: 60,
    });
    expect(mtx.transformPoint(0, 0)).toEqual({ x: 40, y: 60 });
    expect(mtx.transformPoint(50, 80)).toEqual({ x: 90, y: 140 });
  });

  it("should use ty=0 as default", () => {
    const mtx = new Matrix2D();
    mtx.translate(40);
    expect(mtx).toMatchObject({
      a: 1,
      c: 0,
      e: 40,
      b: 0,
      d: 1,
      f: 0,
    });
    expect(mtx.transformPoint(0, 0)).toEqual({ x: 40, y: 0 });
    expect(mtx.transformPoint(50, 80)).toEqual({ x: 90, y: 80 });
  });
});
