import { Matrix2D } from "../src/main";

describe("identity", () => {
  it("should return identity matrix", () => {
    const mtx = Matrix2D.identity;
    expect(typeof mtx).toBe("object");
    expect(mtx).toMatchObject({
      a: 1,
      c: 0,
      e: 0,
      b: 0,
      d: 1,
      f: 0,
    });
  });
});
