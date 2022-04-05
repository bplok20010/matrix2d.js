import { Matrix2D } from "../src/main";

function makeTransform2(object) {
  return {
    x: object.tx ?? 0,
    y: object.ty ?? 0,
    rotation: object.rotation ?? 0,
    scaleX: object.scaleX ?? 1,
    scaleY: object.scaleY ?? 1,
  };
}

describe("decompose", () => {
  it("should decompose a translation-only matrix", () => {
    const mtx = new Matrix2D();
    const tx = 20;
    const ty = 30;
    mtx.translate(tx, ty);

    expect(mtx.decompose()).toMatchObject(makeTransform2({ tx, ty }));
  });

  it("should decompose a rotation-only matrix", () => {
    const mtx = new Matrix2D();
    mtx.rotate(45);
    expect(mtx.decompose()).toMatchObject(makeTransform2({ rotation: 45 }));
  });

  it("should decompose a scale-only matrix", () => {
    const scaleX = 2;
    const scaleY = 1.5;
    const mtx = new Matrix2D();
    mtx.scale(scaleX, scaleY);
    expect(mtx.decompose()).toMatchObject(makeTransform2({ scaleX, scaleY }));
  });

  it("should decompose a flip-x-only matrix", () => {
    const mtx = new Matrix2D();

    mtx.flipX();

    expect(mtx.decompose(true)).toMatchObject(makeTransform2({ scaleY: -1 }));
  });

  it("should decompose a flip-y-only matrix", () => {
    const mtx = new Matrix2D();

    mtx.flipY();

    expect(mtx.decompose(false, true)).toMatchObject(makeTransform2({ scaleX: -1 }));
  });

  it("should decompose a complex matrix without flips", () => {
    const tx = 100;
    const ty = -234;
    const scaleX = 2;
    const scaleY = 1;
    const rotation = (Math.PI * 0.75) / Matrix2D.DEG_TO_RAD;

    const mtx = new Matrix2D();
    mtx.translate(tx, ty);
    mtx.scale(scaleX, scaleY);
    mtx.rotate(rotation);

    expect(mtx.decompose()).toMatchObject(makeTransform2({ tx, ty, scaleX, scaleY, rotation }));
  });

  it("should decompose a complex matrix with flips", () => {
    const tx = 100;
    const ty = -234;
    const scaleX = 1;
    const scaleY = 1;
    const rotation = (Math.PI * 0.75) / Matrix2D.DEG_TO_RAD;

    const mtx = new Matrix2D();
    mtx.translate(tx, ty);
    mtx.scale(scaleX, scaleY);
    mtx.flipX();
    mtx.flipY();
    mtx.rotate(rotation);

    expect(mtx.decompose(true, true)).toMatchObject(
      makeTransform2({ tx, ty, scaleX: -scaleX, scaleY: -scaleY, rotation })
    );
  });

  it("should decompose an all-zero matrix", () => {
    const mtx = new Matrix2D(0, 0, 0, 0, 0, 0);

    expect(mtx.decompose()).toMatchObject(
      makeTransform2({ tx: 0, ty: 0, scaleX: 0, scaleY: 0, rotation: 0 })
    );
  });

  it("should decompose a matrix with a and c equals to zero while d is positive", () => {
    const mtx = new Matrix2D();

    const sx = 0;
    const sy = 1;
    const matrix = mtx.scale(sx, sy);
    expect(matrix.a).toBeCloseTo(0);
    expect(matrix.c).toBeCloseTo(0);
    expect(matrix.d).toEqual(1);
    expect(mtx.decompose()).toMatchObject(makeTransform2({ scaleX: sx, scaleY: sy }));
  });

  it("should decompose a matrix with a and c equals to zero while d is negative", () => {
    const mtx = new Matrix2D();

    const sx = 0;
    const sy = 1;
    const rotation = Math.PI / Matrix2D.DEG_TO_RAD;
    mtx.scale(sx, sy);
    const matrix = mtx.rotate(rotation);
    expect(matrix.a).toBeCloseTo(0);
    expect(matrix.c).toBeCloseTo(0);
    expect(matrix.d).toEqual(-1);
    expect(matrix.decompose()).toMatchObject(makeTransform2({ scaleX: sx, scaleY: sy, rotation }));
  });

  it.each([0 + 45 / 2, 45, 45 + 45 / 2, 90, 90 + 45 / 2, 180, 180 + 45 / 2, 270, 270 + 45 / 2])(
    "should decompose into an equivalent TSR matrix, rotated by %d DEG",
    rotation => {
      const tx = 40;
      const ty = 80;
      const scaleX = 2;
      const scaleY = 4;

      const matrix = new Matrix2D();
      matrix.translate(tx, ty);
      matrix.scale(scaleX, scaleY);
      matrix.rotate(rotation);

      const decomposed = matrix.decompose();
      const matrix2 = new Matrix2D();
      matrix2.translate(decomposed.x, decomposed.y);
      matrix2.scale(decomposed.scaleX, decomposed.scaleY);
      matrix2.rotate(decomposed.rotation);

      const point1 = matrix.transformPoint(42, 42);
      const point2 = matrix2.transformPoint(42, 42);

      expect(point2.x).toBeCloseTo(point1.x, 10);
      expect(point2.y).toBeCloseTo(point1.y, 10);
    }
  );
});
