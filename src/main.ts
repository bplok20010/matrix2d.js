/*!
 * Matrix2D from CreateJS
 * https://github.com/bplok20010/matrix2d.js
 *
 * CreateJS
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

export interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export type MatrixArray = [a: number, b: number, c: number, d: number, tx: number, ty: number];

export type Transform = MatrixArray;

export interface Point {
  x: number;
  y: number;
}

export interface IDecomposeValue {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

function isUndefined(value: any) {
  return typeof value === "undefined";
}

function isObject(value: any) {
  return value != null && typeof value === "object";
}

function isPointObject(value: any): value is Point {
  return isObject(value) && "x" in value && "y" in value;
}

export type MatrixValue = Matrix;

export const EPSILON = 0.000001;

const matrixRegex =
  /^matrix\(\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*\)$/i;

export function multiply(m1: MatrixValue, m2: MatrixValue): MatrixValue {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}

export function transform(matrices: MatrixValue[]): MatrixValue {
  if (matrices.length === 1) {
    return matrices[0];
  }
  if (matrices.length === 2) {
    return multiply(matrices[0], matrices[1]);
  }

  return matrices.reduce((m1, m2) => multiply(m1, m2));
}

/**
 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
 *
 * This matrix can be visualized as:
 *
 * 	[ a  c  tx
 * 	  b  d  ty
 * 	  0  0  1  ]
 *
 * Note the locations of b and c.
 *
 * @class Matrix2D
 * @param {Number} [a=1] Specifies the a property for the new matrix.
 * @param {Number} [b=0] Specifies the b property for the new matrix.
 * @param {Number} [c=0] Specifies the c property for the new matrix.
 * @param {Number} [d=1] Specifies the d property for the new matrix.
 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
 * @constructor
 **/
export class Matrix2D implements Matrix {
  /**
   * Multiplier for converting degrees to radians. Used internally by Matrix2D.
   * @property DEG_TO_RAD
   * @static
   * @final
   * @type Number
   * @readonly
   **/
  static DEG_TO_RAD: number = Math.PI / 180;

  /**
   * An identity matrix, representing a null transformation.
   * @property identity
   * @static
   * @type Matrix2D
   * @readonly
   **/
  static identity: Matrix2D = new Matrix2D();

  static equals(m1: MatrixValue, m2: MatrixValue, exact = true) {
    if (exact) {
      return (
        m1.tx === m2.tx &&
        m1.ty === m2.ty &&
        m1.a === m2.a &&
        m1.b === m2.b &&
        m1.c === m2.c &&
        m1.d === m2.d
      );
    }

    let a0 = m1.a,
      a1 = m1.b,
      a2 = m1.c,
      a3 = m1.d,
      a4 = m1.tx,
      a5 = m1.ty;
    let b0 = m2.a,
      b1 = m2.b,
      b2 = m2.c,
      b3 = m2.d,
      b4 = m2.tx,
      b5 = m2.ty;
    return (
      Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
      Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
      Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
    );
  }

  /**
   * @deprecated
   * Convert matrix array([a,b,c,d,tx,ty]) to object
   * @param {Number[]} matrix
   * @returns {MatrixValue} matrix object.
   */
  static toMatrix(matrix: MatrixArray): MatrixValue {
    return {
      a: matrix[0],
      b: matrix[1],
      c: matrix[2],
      d: matrix[3],
      tx: matrix[4],
      ty: matrix[5],
    };
  }
  /**
   * @static
   * @param {MatrixValue} matrix
   * @returns {Matrix2D}
   */
  static fromMatrix(matrix: MatrixValue | MatrixArray): Matrix2D {
    if (Array.isArray(matrix)) {
      return this.fromArray(matrix);
    }
    return new Matrix2D(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * alias fromMatrix
   * @static
   * @returns {Matrix2D}
   */
  static fromObject(matrix: MatrixValue): Matrix2D {
    return Matrix2D.fromMatrix(matrix);
  }
  /**
   * @static
   * @returns {Matrix2D}
   */
  static fromArray(matrix: MatrixArray): Matrix2D {
    return new Matrix2D(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
  }

  /**
   * @static
   * @returns {Matrix2D}
   */
  static toArray(matrix: MatrixValue, out: MatrixArray = [1, 0, 0, 1, 0, 0]): MatrixArray {
    out[0] = matrix.a;
    out[1] = matrix.b;
    out[2] = matrix.c;
    out[3] = matrix.d;
    out[4] = matrix.tx;
    out[5] = matrix.ty;

    return out;
  }

  /**
   * Parse a string formatted as matrix(a,b,c,d,tx,ty)
   * @static
   * @param {String} string  String with an affine matrix
   * @returns {Matrix2D}
   */
  static fromString(string: string): Matrix2D {
    const parsed = string.match(matrixRegex);
    if (parsed === null || parsed.length < 7) throw new Error(`'${string}' is not a matrix`);
    const matrix = {
      a: parseFloat(parsed[1]),
      b: parseFloat(parsed[2]),
      c: parseFloat(parsed[3]),
      d: parseFloat(parsed[4]),
      tx: parseFloat(parsed[5]),
      ty: parseFloat(parsed[6]),
    };

    return Matrix2D.fromMatrix(matrix);
  }

  static getIdentityMatrixValue() {
    return {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 0,
    };
  }

  /**
   * @static
   * @param {MatrixValue} m1
   * @param {MatrixValue} m2
   * @returns {MatrixValue}
   */
  static multiply(m1: MatrixValue, m2: MatrixValue): MatrixValue {
    return multiply(m1, m2);
  }

  /**
   * @static
   * @param {MatrixValue[]} matrices
   * @returns {MatrixValue}
   */
  static transform(matrices: MatrixValue[]): MatrixValue {
    return transform(matrices);
  }

  static translate(tx: number, ty: number = 0): MatrixValue {
    return {
      a: 1,
      c: 0,
      tx,
      b: 0,
      d: 1,
      ty,
    };
  }

  static rotate(angle: number, cx?: number, cy?: number) {
    angle = angle * Matrix2D.DEG_TO_RAD;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotationMatrix = {
      a: cos,
      c: -sin,
      tx: 0,
      b: sin,
      d: cos,
      ty: 0,
    };

    if (isUndefined(cx) || isUndefined(cy)) {
      return rotationMatrix;
    }

    return transform([this.translate(cx!, cy!), rotationMatrix, this.translate(-cx!, -cy!)]);
  }

  static scale(sx: number, sy?: number, cx?: number, cy?: number) {
    if (isUndefined(sy)) sy = sx;

    const scaleMatrix = {
      a: sx,
      c: 0,
      tx: 0,
      b: 0,
      d: sy!,
      ty: 0,
    };

    if (isUndefined(cx) || isUndefined(cy)) {
      return scaleMatrix;
    }

    return transform([this.translate(cx!, cy!), scaleMatrix, this.translate(-cx!, -cy!)]);
  }

  static shear(shearX: number, shearY: number = 0): MatrixValue {
    return {
      a: 1,
      c: shearX,
      tx: 0,
      b: shearY,
      d: 1,
      ty: 0,
    };
  }

  static skew(skewX: number, skewY: number) {
    skewX = skewX * Matrix2D.DEG_TO_RAD;
    skewY = skewY * Matrix2D.DEG_TO_RAD;

    return {
      a: 1,
      c: Math.tan(skewX),
      tx: 0,
      b: Math.tan(skewY),
      d: 1,
      ty: 0,
    };
  }

  /**
   * Position (0, 0) in a 3x3 affine transformation matrix.
   * @property a
   * @type Number
   **/
  a: number = 1;
  /**
   * Position (0, 1) in a 3x3 affine transformation matrix.
   * @property b
   * @type Number
   **/
  b: number = 0;
  /**
   * Position (1, 0) in a 3x3 affine transformation matrix.
   * @property c
   * @type Number
   **/
  c: number = 0;
  /**
   * Position (1, 1) in a 3x3 affine transformation matrix.
   * @property d
   * @type Number
   **/
  d: number = 1;
  /**
   * Position (2, 0) in a 3x3 affine transformation matrix.
   * @property tx
   * @type Number
   **/
  tx: number = 0;
  /**
   * alias tx
   */
  get e() {
    return this.tx;
  }
  /**
   * Position (2, 1) in a 3x3 affine transformation matrix.
   * @property ty
   * @type Number
   **/
  ty: number = 0;

  /**
   * alias ty
   */
  get f() {
    return this.ty;
  }

  /**
   * [
   *    a c tx
   *    b d ty
   *    0 0  1
   * ]
   * @param a
   * @param b
   * @param c
   * @param d
   * @param tx
   * @param ty
   */
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.setValues(a, b, c, d, tx, ty);
  }
  /**
   * Sets the specified values on this instance.
   * @method setValues
   * @param {Number} [a=1] Specifies the a property for the new matrix.
   * @param {Number} [b=0] Specifies the b property for the new matrix.
   * @param {Number} [c=0] Specifies the c property for the new matrix.
   * @param {Number} [d=1] Specifies the d property for the new matrix.
   * @param {Number} [tx=0] Specifies the tx property for the new matrix.
   * @param {Number} [ty=0] Specifies the ty property for the new matrix.
   * @return {Matrix2D} This instance. Useful for chaining method calls.
   */
  setValues(
    a: number = 1,
    b: number = 0,
    c: number = 0,
    d: number = 1,
    tx: number = 0,
    ty: number = 0
  ): Matrix2D {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  /**
   * Appends the specified matrix properties to this matrix. All parameters are required.
   * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
   * @method append
   * @param {Number} a
   * @param {Number} b
   * @param {Number} c
   * @param {Number} d
   * @param {Number} tx
   * @param {Number} ty
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = a1 * a + c1 * b;
      this.b = b1 * a + d1 * b;
      this.c = a1 * c + c1 * d;
      this.d = b1 * c + d1 * d;
    }
    this.tx = a1 * tx + c1 * ty + this.tx;
    this.ty = b1 * tx + d1 * ty + this.ty;

    return this;
  }
  /**
   * Prepends the specified matrix properties to this matrix.
   * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
   * All parameters are required.
   * @method prepend
   * @param {Number} a
   * @param {Number} b
   * @param {Number} c
   * @param {Number} d
   * @param {Number} tx
   * @param {Number} ty
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D {
    const a1 = this.a;
    const c1 = this.c;
    const tx1 = this.tx;

    this.a = a * a1 + c * this.b;
    this.b = b * a1 + d * this.b;
    this.c = a * c1 + c * this.d;
    this.d = b * c1 + d * this.d;
    this.tx = a * tx1 + c * this.ty + tx;
    this.ty = b * tx1 + d * this.ty + ty;

    return this;
  }
  /**
   * Appends the specified matrix to this matrix.
   * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
   * @method appendMatrix
   * @param {Matrix2D} matrix
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  appendMatrix(matrix: Matrix | MatrixArray): Matrix2D {
    if (Array.isArray(matrix)) {
      return this.append(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
    return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * Prepends the specified matrix to this matrix.
   * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
   * For example, you could calculate the combined transformation for a child object using:
   *
   * 	var o = myDisplayObject;
   * 	var mtx = o.getMatrix();
   * 	while (o = o.parent) {
   * 		// prepend each parent's transformation in turn:
   * 		o.prependMatrix(o.getMatrix());
   * 	}
   * @method prependMatrix
   * @param {Matrix2D} matrix
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependMatrix(matrix: Matrix | MatrixArray): Matrix2D {
    if (Array.isArray(matrix)) {
      return this.prepend(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
    return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * alias appendMatrix
   * @param matrix
   * @returns
   */
  appendTransform(matrix: Transform): Matrix2D {
    return this.append(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
  }
  /**
   * alias prependMatrix
   * @param matrix
   * @returns
   */
  prependTransform(matrix: Transform): Matrix2D {
    return this.prepend(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
  }
  /**
   * Applies a clockwise rotation transformation to the matrix.
   * @method rotate
   * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  rotate(angle: number): Matrix2D;
  rotate(angle: number, cx: number, cy: number): Matrix2D;
  rotate(angle: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);
    angle = angle * Matrix2D.DEG_TO_RAD;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }
    // or this.append(cos, sin, -sin, cos, 0, 0);
    const a1 = this.a;
    const b1 = this.b;

    this.a = a1 * cos + this.c * sin;
    this.b = b1 * cos + this.d * sin;
    this.c = -a1 * sin + this.c * cos;
    this.d = -b1 * sin + this.d * cos;

    if (hasOriginPoint) {
      this.translate(-cx!, -cy!);
    }
    return this;
  }
  /**
   * Applies a skew transformation to the matrix.
   * @method skew
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @param {Number} skewY The amount to skew vertically in degrees.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skew(skewX: number, skewY: number): Matrix2D;
  skew(skewX: number, skewY: number, cx: number, cy: number): Matrix2D;
  skew(skewX: number, skewY: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    skewX = skewX * Matrix2D.DEG_TO_RAD;
    skewY = skewY * Matrix2D.DEG_TO_RAD;

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }

    this.append(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);

    if (hasOriginPoint) {
      this.translate(-cx!, -cy!);
    }

    return this;
  }
  /**
   * Applies a skewX transformation to the matrix.
   * @method skewX
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skewX(skewX: number): Matrix2D;
  skewX(skewX: number, cx: number, cy: number): Matrix2D;
  skewX(skewX: number, cx?: number, cy?: number): Matrix2D {
    return this.skew(skewX, 0, cx!, cy!);
  }
  /**
   * Applies a skewY transformation to the matrix.
   * @method skewY
   * @param {Number} skewY The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skewY(skewY: number): Matrix2D;
  skewY(skewY: number, cx: number, cy: number): Matrix2D;
  skewY(skewY: number, cx?: number, cy?: number) {
    return this.skew(0, skewY, cx!, cy!);
  }

  /**
   * Applies a shear transformation to the matrix.
   * @method shear
   * @param {Number} shearX Shear on axis x
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shear(shearX: number, shearY: number): Matrix2D;
  shear(shearX: number, shearY: number, cx: number, cy: number): Matrix2D;
  shear(shearX: number, shearY: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }

    this.append(1, shearY, shearX, 1, 0, 0);

    if (hasOriginPoint) {
      this.translate(-cx!, -cy!);
    }

    return this;
  }

  /**
   * Applies a shearX transformation to the matrix.
   * @method shearX
   * @param {Number} shearX Shear on axis x
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shearX(shearX: number): Matrix2D;
  shearX(shearX: number, cx: number, cy: number): Matrix2D;
  shearX(shearX: number, cx?: number, cy?: number): Matrix2D {
    return this.shear(shearX, 0, cx!, cy!);
  }
  /**
   * Applies a shearY transformation to the matrix.
   * @method shearY
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shearY(shearY: number): Matrix2D;
  shearY(shearY: number, cx: number, cy: number): Matrix2D;
  shearY(shearY: number, cx?: number, cy?: number): Matrix2D {
    return this.shear(0, shearY, cx!, cy!);
  }

  /**
   * Applies a scale transformation to the matrix.
   * @method scale
   * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
   * @param {Number} y The amount to scale vertically.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  scale(x: number): Matrix2D;
  scale(x: number, y: number): Matrix2D;
  scale(x: number, y: number, cx: number, cy: number): Matrix2D;
  scale(x: number, y?: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (isUndefined(y)) {
      y = x;
    }

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }

    this.a *= x;
    this.b *= x;
    this.c *= y!;
    this.d *= y!;

    if (hasOriginPoint) {
      this.translate(-cx!, -cy!);
    }

    return this;
  }
  /**
   * Applies a scale x transformation to the matrix.
   * @method scaleX
   * @param {Number} x The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  scaleX(x: number): Matrix2D;
  scaleX(x: number, cx: number, cy: number): Matrix2D;
  scaleX(x: number, cx?: number, cy?: number) {
    return this.scale(x, 1, cx!, cy!);
  }
  /**
   * Applies a scale y transformation to the matrix.
   * @method scaleY
   * @param {Number} y The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  scaleY(y: number): Matrix2D;
  scaleY(y: number, cx: number, cy: number): Matrix2D;
  scaleY(y: number, cx?: number, cy?: number) {
    return this.scale(1, y, cx!, cy!);
  }
  /**
   * Translates the matrix on the x and y axes.
   * @method translate
   * @param {Number} x
   * @param {Number} y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  translate(x: number, y: number = 0): Matrix2D {
    this.tx += this.a * x + this.c * y;
    this.ty += this.b * x + this.d * y;
    return this;
  }
  translateX(x: number) {
    return this.translate(x);
  }
  translateY(y: number) {
    return this.translate(0, y);
  }

  /**
   * Applies a clockwise rotation transformation to the matrix.
   * @method prependRotate
   * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependRotate(angle: number): Matrix2D;
  prependRotate(angle: number, cx: number, cy: number): Matrix2D;
  prependRotate(angle: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);
    angle = angle * Matrix2D.DEG_TO_RAD;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    this.prepend(cos, sin, -sin, cos, 0, 0);

    if (hasOriginPoint) {
      this.prependTranslate(cx!, cy!);
    }
    return this;
  }

  /**
   * Applies a skew transformation to the matrix.
   * @method prependSkew
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @param {Number} skewY The amount to skew vertically in degrees.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkew(skewX: number, skewY: number): Matrix2D;
  prependSkew(skewX: number, skewY: number, cx: number, cy: number): Matrix2D;
  prependSkew(skewX: number, skewY: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    skewX = skewX * Matrix2D.DEG_TO_RAD;
    skewY = skewY * Matrix2D.DEG_TO_RAD;

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    this.prepend(1, Math.tan(skewY), Math.tan(skewX), 1, 0, 0);

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    return this;
  }

  /**
   * Applies a skewX transformation to the matrix.
   * @method prependSkewX
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkewX(skewX: number): Matrix2D;
  prependSkewX(skewX: number, cx: number, cy: number): Matrix2D;
  prependSkewX(skewX: number, cx?: number, cy?: number): Matrix2D {
    return this.prependSkew(skewX, 0, cx!, cy!);
  }
  /**
   * Applies a skewY transformation to the matrix.
   * @method prependSkewY
   * @param {Number} skewY The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkewY(skewY: number): Matrix2D;
  prependSkewY(skewY: number, cx: number, cy: number): Matrix2D;
  prependSkewY(skewY: number, cx?: number, cy?: number) {
    return this.prependSkew(0, skewY, cx!, cy!);
  }

  /**
   * Applies a shear transformation to the matrix.
   * @method prependShear
   * @param {Number} shearX Shear on axis x
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShear(shearX: number, shearY: number): Matrix2D;
  prependShear(shearX: number, shearY: number, cx: number, cy: number): Matrix2D;
  prependShear(shearX: number, shearY: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    this.prepend(1, shearY, shearX, 1, 0, 0);

    if (hasOriginPoint) {
      this.prependTranslate(cx!, cy!);
    }

    return this;
  }

  /**
   * Applies a shearX transformation to the matrix.
   * @method prependShearX
   * @param {Number} shearX Shear on axis x
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShearX(shearX: number): Matrix2D;
  prependShearX(shearX: number, cx: number, cy: number): Matrix2D;
  prependShearX(shearX: number, cx?: number, cy?: number): Matrix2D {
    return this.prependShear(shearX, 0, cx!, cy!);
  }
  /**
   * Applies a shearY transformation to the matrix.
   * @method prependShearY
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShearY(shearY: number): Matrix2D;
  prependShearY(shearY: number, cx: number, cy: number): Matrix2D;
  prependShearY(shearY: number, cx?: number, cy?: number): Matrix2D {
    return this.prependShear(0, shearY, cx!, cy!);
  }

  /**
   * Applies a scale transformation to the matrix.
   * @method prependScale
   * @param {Number} x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it.
   * @param {Number} y The amount to scale vertically.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependScale(x: number): Matrix2D;
  prependScale(x: number, y: number): Matrix2D;
  prependScale(x: number, y: number, cx: number, cy: number): Matrix2D;
  prependScale(x: number, y?: number, cx?: number, cy?: number): Matrix2D {
    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (isUndefined(y)) {
      y = x;
    }

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    this.prepend(x, 0, 0, y!, 0, 0);

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }

    return this;
  }
  /**
   * Applies a scale x transformation to the matrix.
   * @method prependScaleX
   * @param {Number} x The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependScaleX(x: number): Matrix2D;
  prependScaleX(x: number, cx: number, cy: number): Matrix2D;
  prependScaleX(x: number, cx?: number, cy?: number) {
    return this.prependScale(x, 1, cx!, cy!);
  }
  /**
   * Applies a scale y transformation to the matrix.
   * @method prependScaleY
   * @param {Number} y The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependScaleY(y: number): Matrix2D;
  prependScaleY(y: number, cx: number, cy: number): Matrix2D;
  prependScaleY(y: number, cx?: number, cy?: number) {
    return this.prependScale(1, y, cx!, cy!);
  }

  /**
   * prepend Translates the matrix on the x and y axes.
   * @method prependTranslate
   * @param {Number} x
   * @param {Number} y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependTranslate(x: number, y: number = 0): Matrix2D {
    this.tx += x;
    this.ty += y;
    return this;
  }
  prependTranslateX(x: number) {
    return this.prependTranslate(x);
  }
  prependTranslateY(y: number) {
    return this.prependTranslate(0, y);
  }

  /**
   * flip the matrix on the y axes and y axes.
   * @method flip
   * @param {Boolean} flipX
   * @param {Boolean} flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  flip(flipX: boolean, flipY: boolean): Matrix2D;
  flip(flipX: boolean, flipY: boolean, cx: number, cy: number): Matrix2D;
  flip(flipX: boolean, flipY: boolean, cx?: number, cy?: number): Matrix2D {
    if (!flipX && !flipY) {
      return this;
    }

    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (hasOriginPoint) {
      this.translate(cx!, cy!);
    }

    this.append(flipY ? -1 : 1, 0, 0, flipX ? -1 : 1, 0, 0);

    if (hasOriginPoint) {
      this.translate(-cx!, -cy!);
    }

    return this;
  }

  /**
   * flip the matrix on the x axes.
   * @method flipX
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipX(): Matrix2D;
  flipX(cx: number, cy: number): Matrix2D;
  flipX(cx?: number, cy?: number): Matrix2D {
    return this.flip(true, false, cx!, cy!);
  }
  /**
   * flip the matrix on the y axes.
   * @method flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipY(): Matrix2D;
  flipY(cx: number, cy: number): Matrix2D;
  flipY(cx?: number, cy?: number): Matrix2D {
    return this.flip(false, true, cx!, cy!);
  }
  /**
   * flip the matrix on the y axes and y axes.
   * @method flipOrigin
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipOrigin(): Matrix2D {
    return this.append(-1, 0, 0, -1, 0, 0);
  }

  /**
   * flip the matrix on the y axes and y axes.
   * @method prependFlip
   * @param {Boolean} flipX
   * @param {Boolean} flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependFlip(flipX: boolean, flipY: boolean): Matrix2D;
  prependFlip(flipX: boolean, flipY: boolean, cx: number, cy: number): Matrix2D;
  prependFlip(flipX: boolean, flipY: boolean, cx?: number, cy?: number): Matrix2D {
    if (!flipX && !flipY) {
      return this;
    }

    const hasOriginPoint = !isUndefined(cx) && !isUndefined(cy);

    if (hasOriginPoint) {
      this.prependTranslate(-cx!, -cy!);
    }

    this.prepend(flipY ? -1 : 1, 0, 0, flipX ? -1 : 1, 0, 0);

    if (hasOriginPoint) {
      this.prependTranslate(cx!, cy!);
    }

    return this;
  }
  /**
   * flip the matrix on the x axes.
   * @method prependFlipX
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipX(): Matrix2D;
  prependFlipX(cx: number, cy: number): Matrix2D;
  prependFlipX(cx?: number, cy?: number): Matrix2D {
    return this.prependFlip(true, false, cx!, cy!);
  }
  /**
   * flip the matrix on the y axes.
   * @method prependFlipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipY(): Matrix2D;
  prependFlipY(cx: number, cy: number): Matrix2D;
  prependFlipY(cx?: number, cy?: number): Matrix2D {
    return this.prependFlip(false, true, cx!, cy!);
  }
  /**
   * flip the matrix on the y axes and y axes.
   * @method flipOrigin
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipOrigin(): Matrix2D {
    return this.prepend(-1, 0, 0, -1, 0, 0);
  }

  /**
   * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
   * @method identity
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  identity(): Matrix2D {
    this.a = this.d = 1;
    this.b = this.c = this.tx = this.ty = 0;
    return this;
  }

  /**
   * alias identity
   * @method reset
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  reset(): Matrix2D {
    return this.identity();
  }

  /**
   * Inverts the matrix, causing it to perform the opposite transformation.
   * @method invert
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  invert(): Matrix2D {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    const tx1 = this.tx;
    const n = a1 * d1 - b1 * c1;

    this.a = d1 / n;
    this.b = -b1 / n;
    this.c = -c1 / n;
    this.d = a1 / n;
    this.tx = (c1 * this.ty - d1 * tx1) / n;
    this.ty = -(a1 * this.ty - b1 * tx1) / n;
    return this;
  }
  /**
   * Returns true if the matrix is an identity matrix.
   * @method isIdentity
   * @return {Boolean}
   **/
  isIdentity(): boolean {
    return (
      this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1
    );
  }
  /**
   * Returns true if this matrix is equal to the specified matrix (all property values are equal).
   * @method equals
   * @param {Matrix2D} matrix The matrix to compare.
   * @return {Boolean}
   **/
  equals(matrix: Matrix): boolean {
    return (
      this.tx === matrix.tx &&
      this.ty === matrix.ty &&
      this.a === matrix.a &&
      this.b === matrix.b &&
      this.c === matrix.c &&
      this.d === matrix.d
    );
  }
  /**
   * Transforms a point according to this matrix.
   * @method transformPoint
   * @param {Point} point
   */
  transformPoint(point: Point, out?: Point): Point;
  /**
   * Transforms a point according to this matrix.
   * @method transformPoint
   * @param {Number} x The x component of the point to transform.
   * @param {Number} y The y component of the point to transform.
   * @param {Point} origin the transform base point
   * @return {Point}
   **/
  transformPoint(x: number, y: number, out?: Point): Point;
  transformPoint(x: number | Point, y?: any, out?: Point): Point {
    if (typeof x !== "number") {
      out = y;
      y = x.y;
      x = x.x;
    }

    // const hasOriginPoint = !isUndefined(origin);

    // if (hasOriginPoint) {
    //   x = x - origin!.x;
    //   y = y! - origin!.y;
    // }

    const pt = out || ({} as Point);
    pt.x = x * this.a + y! * this.c + this.tx;
    pt.y = x * this.b + y! * this.d + this.ty;

    // if (hasOriginPoint) {
    //   pt.x += origin!.x;
    //   pt.y += origin!.y;
    // }

    return pt as Point;
  }
  /**
   * @param points
   * @returns
   */
  transformPoints(points: Point[]) {
    if (arguments.length > 1) {
      console.warn("[Matrix2D] transformPoints(points, origin) is deprecated!");
    }
    return points.map((point) => this.transformPoint(point.x, point.y));
  }
  /**
   * @deprecated
   * alias transformPoint
   * Transforms a point with origin point according to this matrix.
   * @deprecated
   * @method transformPoint
   * @param {Number} x The x component of the point to transform.
   * @param {Number} y The y component of the point to transform.
   * @param {Point} origin the transform base point
   * @return {Point}
   **/
  transformPointWithOrigin(x: number, y: number): Point {
    console.warn("[Matrix2D] transformPointWithOrigin is deprecated!");
    return this.transformPoint(x, y);
  }
  /**
   * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
   * may not match the transform properties you used to generate the matrix, though they will produce the same visual
   * results.
   * @method decompose
   * @param  {Boolean} flipX Whether the matrix contains vertical flip, i.e. mirrors on x-axis
   * @param  {Boolean} flipY Whether the matrix contains horizontal flip, i.e. mirrors on y-axis
   * @return {Object} The target, or a new generic object with the transform properties applied.
   */
  decompose(flipX: boolean = false, flipY: boolean = false): IDecomposeValue {
    // Remove flip from the matrix first - flip could be incorrectly interpreted as
    // rotations (e.g. flipX + flipY = rotate by 180 degrees).
    // Note flipX is a vertical flip, and flipY is a horizontal flip.
    const mtx = this.clone();
    if (flipX) {
      if (flipY) {
        mtx.scale(-1, -1);
      } else {
        mtx.scale(1, -1);
      }
    } else if (flipY) {
      mtx.scale(-1, 1);
    }

    const a = mtx.a;
    const b = mtx.b;
    const c = mtx.c;
    const d = mtx.d;
    let scaleX = 0,
      scaleY = 0,
      rotation = 0;

    if (a !== 0 || c !== 0) {
      const hypotAc = Math.hypot(a, c);
      scaleX = hypotAc;
      scaleY = (a * d - b * c) / hypotAc;
      const acos = Math.acos(a / hypotAc);
      rotation = c > 0 ? -acos : acos;
    } else if (b !== 0 || d !== 0) {
      const hypotBd = Math.hypot(b, d);
      scaleX = (a * d - b * c) / hypotBd;
      scaleY = hypotBd;
      const acos = Math.acos(b / hypotBd);
      rotation = Math.PI / 2 + (d > 0 ? -acos : acos);
    } else {
      scaleX = 0;
      scaleY = 0;
      rotation = 0;
    }

    // put the flip factors back
    if (flipY) {
      scaleX = -scaleX;
    }

    if (flipX) {
      scaleY = -scaleY;
    }

    return {
      x: mtx.tx,
      y: mtx.ty,
      rotation: rotation / Matrix2D.DEG_TO_RAD,
      scaleX,
      scaleY,
    };
  }

  /**
   * Copies all properties from the specified matrix to this matrix.
   * @method copy
   * @param {Matrix2D} matrix The matrix to copy properties from.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  copy(matrix: Matrix): Matrix2D {
    return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * Returns a clone of the Matrix2D instance.
   * @method clone
   * @return {Matrix2D} a clone of the Matrix2D instance.
   **/
  clone(): Matrix2D {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }
  /**
   * Rounds all elements of the given matrix using the given precision
   * @method smooth
   * @param {Number} [precision] A precision to use for Math.round. Defaults to 10000000000 (meaning which rounds to the 10th digit after the comma).
   * @returns {Matrix2D}  This matrix. Useful for chaining method calls.
   */
  smooth(precision: number = 10000000000): Matrix2D {
    this.a = Math.round(this.a * precision) / precision;
    this.b = Math.round(this.b * precision) / precision;
    this.c = Math.round(this.c * precision) / precision;
    this.d = Math.round(this.d * precision) / precision;
    this.tx = Math.round(this.tx * precision) / precision;
    this.ty = Math.round(this.ty * precision) / precision;

    return this;
  }

  /**
   * Returns a string representation of this object.
   * @method toStringDebug
   * @return {String} a string representation of the instance.
   **/
  toStringDebug(): string {
    return (
      "[Matrix2D (a=" +
      this.a +
      " b=" +
      this.b +
      " c=" +
      this.c +
      " d=" +
      this.d +
      " tx=" +
      this.tx +
      " ty=" +
      this.ty +
      ")]"
    );
  }

  /**
   * Returns a matrix object as {a,b,c,d,tx,ty}
   * @returns {MatrixValue}
   */
  toMatrix(out: MatrixValue = {} as any): MatrixValue {
    const { a, b, c, d, tx, ty } = this;

    out.a = a;
    out.b = b;
    out.c = c;
    out.d = d;
    out.tx = tx;
    out.ty = ty;

    return out;
  }

  /**
   * alias toMatrix
   * @returns {MatrixValue}
   */
  toObject(out?: MatrixValue): MatrixValue {
    return this.toMatrix(out);
  }

  /**
   * Returns a matrix array as [a,b,c,d,tx,ty]
   * @method toArray
   * @returns {MatrixArray}
   */
  toArray(out: MatrixArray = [1, 0, 0, 1, 0, 0]): MatrixArray {
    const { a, b, c, d, tx, ty } = this;

    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    out[4] = tx;
    out[5] = ty;

    return out;
  }

  /**
   * Returns a matrix string as matrix(a,b,c,d,tx,ty)
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  toString(): string {
    return `matrix(${this.toArray().join(",")})`;
  }
}

export default Matrix2D;
