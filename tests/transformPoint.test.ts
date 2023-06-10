import { Matrix2D } from "../src/main";

describe("transformPoint", () => {
  const m1 = {
    // trans(40,40) scale(2,2) trans(-40,-40)
    a: 2,
    c: 0,
    e: -40,
    b: 0,
    d: 2,
    f: -40,
  };
  it("should return a transformed object point 1", () => {
    const mtx = new Matrix2D(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
    expect(Matrix2D.identity.transformPoint(0, 0)).toEqual({ x: 0, y: 0 });
    expect(mtx.transformPoint(30, 30)).toEqual({ x: 20, y: 20 });
    expect(mtx.transformPoint(50, 50)).toEqual({ x: 60, y: 60 });
  });
});

describe("transformPoints", () => {
  const m1 = {
    // trans(40,40) scale(2,2) trans(-40,-40)
    a: 2,
    c: 0,
    e: -40,
    b: 0,
    d: 2,
    f: -40,
  };
  const points = [
    { x: 30, y: 30 },
    { x: 50, y: 50 },
  ];
  const transPoints = [
    { x: 20, y: 20 },
    { x: 60, y: 60 },
  ];
  it("should return transformed points 1", () => {
    const mtx = new Matrix2D(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);

    expect(Matrix2D.identity.transformPoints([{ x: 0, y: 0 }])).toEqual([{ x: 0, y: 0 }]);
    expect(mtx.transformPoints(points)).toEqual(transPoints);
  });
});
