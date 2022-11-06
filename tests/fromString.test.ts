import { Matrix2D } from "../src/main";

describe("fromString", () => {
  it("should parse a matrix from string", () => {
    expect(Matrix2D.fromString("matrix(1,2,3,4,5,6)")).toMatchObject({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    });
    expect(Matrix2D.fromString("matrix(1 ,    2 , 3 , 4 , 5 , 6 )")).toMatchObject({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    });
    expect(Matrix2D.fromString("MaTrIx(1,2,3,4,5,6)")).toMatchObject({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    });
    expect(Matrix2D.fromString("matrix(1.1,2.2,3.3,4.4,5.5,6.6)")).toMatchObject({
      a: 1.1,
      b: 2.2,
      c: 3.3,
      d: 4.4,
      e: 5.5,
      f: 6.6,
    });
    expect(Matrix2D.fromString("matrix(1.1 ,2.2  ,3.3 ,  4.4,  5.5,  6.6   )")).toMatchObject({
      a: 1.1,
      b: 2.2,
      c: 3.3,
      d: 4.4,
      e: 5.5,
      f: 6.6,
    });
    expect(Matrix2D.fromString("matrix(1,2.2  ,3.3,4.4,5,  6   )")).toMatchObject({
      a: 1,
      b: 2.2,
      c: 3.3,
      d: 4.4,
      e: 5,
      f: 6,
    });

    expect(Matrix2D.fromString("matrix(-1.1,-2.2,-3.3,-4.4,-5.5,-6.6)")).toMatchObject({
      a: -1.1,
      b: -2.2,
      c: -3.3,
      d: -4.4,
      e: -5.5,
      f: -6.6,
    });
    expect(Matrix2D.fromString("matrix(-1,-2,-3,-4,-5,-6)")).toMatchObject({
      a: -1,
      b: -2,
      c: -3,
      d: -4,
      e: -5,
      f: -6,
    });

    expect(
      Matrix2D.fromString("matrix(+43e+21, -43e+21, +43e-21, -43e-21, 43e0, 0e0)")
    ).toMatchObject({
      a: +43e21,
      b: -43e21,
      c: +43e-21,
      d: -43e-21,
      e: 43,
      f: 0,
    });

    expect(Matrix2D.fromString.bind(this, "matrix()")).toThrow();
    expect(Matrix2D.fromString.bind(this, "matrix(1,2,3,4,5)")).toThrow();
    expect(Matrix2D.fromString.bind(this, "matrix(a,b,c,d,e,f)")).toThrow();

    expect(
      Matrix2D.fromString("matrix(6.123233995736766e-17,1,-1,6.123233995736766e-17,440,-350)")
    ).toMatchObject({
      a: 6.123233995736766e-17,
      b: 1,
      c: -1,
      d: 6.123233995736766e-17,
      e: 440,
      f: -350,
    });
  });
});
