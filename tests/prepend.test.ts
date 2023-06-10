import { Matrix2D } from "../src/main";

describe("prepend", () => {
  const m1 = {
    a: 1,
    c: 0,
    e: 40,
    b: 0,
    d: 1,
    f: 40,
  };
  const m2 = {
    a: 2,
    c: 0,
    e: 0,
    b: 0,
    d: 2,
    f: 0,
  };

  const m12 = {
    a: 2,
    c: 0,
    e: 40,
    b: 0,
    d: 2,
    f: 40,
  };
  const m123 = {
    a: 2,
    c: 0,
    e: 40,
    b: 0,
    d: 2,
    f: 40,
  };

  it("should return m1", () => {
    const mtx = new Matrix2D(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
    expect(mtx).toMatchObject(m1);
    const mtx2 = new Matrix2D();
    mtx2.prepend(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
    expect(mtx2).toMatchObject(m1);
  });

  it("should return m1 * m2 = m12 ", () => {
    const mtx = new Matrix2D(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
    mtx.prepend(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
    expect(mtx).toMatchObject(m12);
  });

  it("should return E * m3 * m2 * m1 = E * m123", () => {
    const m1 = {
      a: 1,
      c: 0,
      e: 40,
      b: 0,
      d: 1,
      f: 40,
    };
    const m2 = {
      a: 2,
      c: 0,
      e: 0,
      b: 0,
      d: 2,
      f: 0,
    };
    const m3 = {
      a: 1,
      c: 0,
      e: -40,
      b: 0,
      d: 1,
      f: -40,
    };
    const mtx = new Matrix2D();
    mtx.prepend(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
    mtx.prepend(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
    mtx.prepend(m3.a, m3.b, m3.c, m3.d, m3.e, m3.f);

    expect(mtx).toMatchObject(m123);
  });
});
