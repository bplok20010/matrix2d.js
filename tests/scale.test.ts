import { Matrix2D } from "../src/main";

describe("scale", () => {
  it("should return a scale matrix", () => {
    const mtx = new Matrix2D();
    const m = mtx.scale(20, 40);
    expect(m).toMatchObject({
      a: 20,
      c: 0,
      tx: 0,
      b: 0,
      d: 40,
      ty: 0,
    });
    expect(mtx.transformPoint(0, 0)).toEqual({ x: 0, y: 0 });
    expect(mtx.transformPoint(50, 80)).toEqual({ x: 1000, y: 3200 });
  });

  it("should use sy=sx as default", () => {
    const mtx = new Matrix2D();
    const m = mtx.scale(20);
    expect(m).toMatchObject({
      a: 20,
      c: 0,
      e: 0,
      b: 0,
      d: 20,
      f: 0,
    });
    expect(mtx.transformPoint(0, 0)).toEqual({ x: 0, y: 0 });
    expect(
      mtx.transformPoint(0, 0, {
        x: 100,
        y: 100,
      })
    ).toEqual({ x: -1900, y: -1900 });
    expect(mtx.transformPoint(50, 80)).toEqual({ x: 1000, y: 1600 });
  });

  it("should scale points about specified origin", () => {
    /*
    <rect x="-50" y="-50" width="200" height="200" fill="green" />
    <rect x="0" y="0" width="100" height="100" fill="black" />
    <circle cx="50" cy="50" r="10" fill="red" />
   */
    const mtx = new Matrix2D();
    const m = mtx.scale(2, 2, 50, 50);
    expect(m).toMatchObject({
      a: 2,
      c: 0,
      tx: -50,
      b: 0,
      d: 2,
      ty: -50,
    });

    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 0, y: 100 },
      { x: 100, y: 100 },
    ];
    expect(mtx.transformPoints(points)).toEqual([
      { x: -50, y: -50 },
      { x: 150, y: -50 },
      { x: -50, y: 150 },
      { x: 150, y: 150 },
    ]);
  });
});
