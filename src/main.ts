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

export interface Point {
  x: number;
  y: number;
}

export interface Transform {
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

interface MatrixValue {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number; // e
  ty: number; // f
}

const matrixRegex =
  /^matrix\(\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*\)$/i;

export function multiply(m1: MatrixValue, m2: MatrixValue): Matrix {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
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

  /**
   * @deprecated
   * Convert matrix array([a,b,c,d,tx,ty]) to object
   * @param {Number[]} matrix
   * @returns {Matrix} matrix object.
   */
  static toMatrix(matrix: MatrixArray): Matrix {
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
   * @param {Matrix} matrix
   * @returns {Matrix2D}
   */
  static fromMatrix(matrix: Matrix): Matrix2D {
    return new Matrix2D(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * alias fromMatrix
   * @static
   * @returns {Matrix2D}
   */
  static fromObject(matrix: Matrix): Matrix2D {
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

  /**
   * @static
   * @param {Matrix} m1
   * @param {Matrix} m2
   * @returns {Matrix}
   */
  static multiply(m1: Matrix, m2: Matrix): Matrix {
    return multiply(m1, m2);
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
  appendMatrix(matrix: Matrix): Matrix2D {
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
  prependMatrix(matrix: Matrix): Matrix2D {
    return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
  }
  /**
   * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
   * For example, you can use this to generate a matrix representing the transformations of a display object:
   *
   * 	var mtx = new Matrix2D();
   * 	mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
   * @method appendTransform
   * @param {Number} x
   * @param {Number} y
   * @param {Number} scaleX
   * @param {Number} scaleY
   * @param {Number} rotation
   * @param {Number} skewX
   * @param {Number} skewY
   * @param {Number} regX Optional.
   * @param {Number} regY Optional.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  appendTransform(
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    rotation: number,
    skewX: number,
    skewY: number,
    regX: number = 0,
    regY: number = 0
  ): Matrix2D {
    let cos = 1;
    let sin = 0;

    if (rotation % 360) {
      const r = rotation * Matrix2D.DEG_TO_RAD;
      cos = Math.cos(r);
      sin = Math.sin(r);
    }

    if (skewX || skewY) {
      // TODO: can this be combined into a single append operation?
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
    } else {
      this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
    }

    if (regX || regY) {
      // append the registration offset:
      this.tx -= regX * this.a + regY * this.c;
      this.ty -= regX * this.b + regY * this.d;
    }
    return this;
  }
  /**
   * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
   * For example, you could calculate the combined transformation for a child object using:
   *
   * 	var o = myDisplayObject;
   * 	var mtx = new Matrix2D();
   * 	do  {
   * 		// prepend each parent's transformation in turn:
   * 		mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
   * 	} while (o = o.parent);
   *
   * 	Note that the above example would not account for {{#crossLink "DisplayObject/transformMatrix:property"}}{{/crossLink}}
   * 	values. See {{#crossLink "Matrix2D/prependMatrix"}}{{/crossLink}} for an example that does.
   * @method prependTransform
   * @param {Number} x
   * @param {Number} y
   * @param {Number} scaleX
   * @param {Number} scaleY
   * @param {Number} rotation
   * @param {Number} skewX
   * @param {Number} skewY
   * @param {Number} regX Optional.
   * @param {Number} regY Optional.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependTransform(
    x: number,
    y: number,
    scaleX: number,
    scaleY: number,
    rotation: number,
    skewX: number,
    skewY: number,
    regX: number = 0,
    regY: number = 0
  ): Matrix2D {
    let cos = 1;
    let sin = 0;

    if (rotation % 360) {
      const r = rotation * Matrix2D.DEG_TO_RAD;
      cos = Math.cos(r);
      sin = Math.sin(r);
    }

    if (regX || regY) {
      // prepend the registration offset:
      this.tx -= regX;
      this.ty -= regY;
    }
    if (skewX || skewY) {
      // TODO: can this be combined into a single prepend operation?
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
      this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
    } else {
      this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
    }
    return this;
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

    // or this.append(x, x, y, y, 0, 0);
    this.a *= x;
    this.b *= x;
    this.c *= y!;
    this.d *= y!;
    //this.tx *= x;
    //this.ty *= y;

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
  transformPoint(point: Point): Point;
  /**
   * Transforms a point according to this matrix.
   * @method transformPoint
   * @param {Number} x The x component of the point to transform.
   * @param {Number} y The y component of the point to transform.
   * @param {Point} origin the transform base point
   * @return {Point}
   **/
  transformPoint(x: number, y: number): Point;
  /**
   * @deprecated
   * @param x
   * @param y
   * @param origin
   */
  transformPoint(x: number, y: number, origin: Point): Point;
  transformPoint(x: number | Point, y?: number, origin?: Point): Point {
    if (isPointObject(x)) {
      y = x.y;
      x = x.x;
    }

    const hasOriginPoint = !isUndefined(origin);

    if (hasOriginPoint) {
      x = x - origin!.x;
      y = y! - origin!.y;
    }

    const pt = {} as Point;
    pt.x = x * this.a + y! * this.c + this.tx;
    pt.y = x * this.b + y! * this.d + this.ty;

    if (hasOriginPoint) {
      pt.x += origin!.x;
      pt.y += origin!.y;
    }

    return pt as Point;
  }
  /**
   * @deprecated
   * @param points
   * @param origin
   * @returns
   */
  transformPoints(points: Point[], origin?: Point) {
    return points.map((point) => this.transformPoint(point.x, point.y, origin as any));
  }
  /**
   * alias transformPoint
   * Transforms a point with origin point according to this matrix.
   * @deprecated
   * @method transformPoint
   * @param {Number} x The x component of the point to transform.
   * @param {Number} y The y component of the point to transform.
   * @param {Point} origin the transform base point
   * @return {Point}
   **/
  transformPointWithOrigin(x: number, y: number, origin: Point): Point {
    return this.transformPoint(x, y, origin);
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
  decompose(flipX: boolean = false, flipY: boolean = false): Transform {
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
   * Returns a matrix object as {a,b,c,d,tx,cy}
   * @returns {Matrix}
   */
  toMatrix(): Matrix {
    const { a, b, c, d, tx, ty } = this;
    return { a, b, c, d, tx, ty };
  }

  /**
   * alias toMatrix
   * @returns {Matrix}
   */
  toObject(): Matrix {
    return this.toMatrix();
  }

  /**
   * Returns a matrix array as [a,b,c,d,tx,cy]
   * @method toArray
   * @returns {MatrixArray}
   */
  toArray(): MatrixArray {
    const { a, b, c, d, tx, ty } = this;
    return [a, b, c, d, tx, ty];
  }

  /**
   * Returns a matrix string as matrix(a,b,c,d,tx,cy)
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  toString(): string {
    return `matrix(${this.toArray().join(",")})`;
  }
}

export default Matrix2D;
