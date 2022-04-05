import { Matrix2D, multiply } from "../src/main";

describe("invert", () => {
  it("invert base", () => {
    // const tx = 100;
    // const ty = 200;
    const scaleX = 2;
    const scaleY = 1.5;
    const rotation = 45;

    const mtx1 = new Matrix2D();
    // mtx1.translate(tx, ty);
    mtx1.scale(scaleX, scaleY);
    mtx1.rotate(rotation);

    const mtx2 = mtx1.clone();
    mtx2.invert();

    mtx2.append(mtx1.a, mtx1.b, mtx1.c, mtx1.d, mtx1.tx, mtx1.ty);

    expect(mtx2.isIdentity()).toEqual(true);
  });
});
