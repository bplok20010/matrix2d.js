# matrix2d.js

Matrix2D ClassUtil

```
[ a  c  tx
  b  d  ty
  0  0  1  ]
```

## Usage

`npm install --save matrix2d.js`

```ts
import Matrix2D from "matrix2d.js";

const mtx = new Matrix2D();

mtx.translate(100, 100);

mtx.rotate(30);

mtx.transformPoint(50, 50); // {x: 118.30127018922194, y: 168.30127018922195}

mtx.toString(); // matrix(0.8660254037844387,0.49999999999999994,-0.49999999999999994,0.8660254037844387,100,100)
```

## Interface

```ts
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
export declare class Matrix2D {
  /**
   * Multiplier for converting degrees to radians. Used internally by Matrix2D.
   * @property DEG_TO_RAD
   * @static
   * @final
   * @type Number
   * @readonly
   **/
  static DEG_TO_RAD: number;
  static RAD_TO_DEG: number;
  /**
   * An identity matrix, representing a null transformation.
   * @property identity
   * @static
   * @type Matrix2D
   * @readonly
   **/
  static identity: Matrix2D;
  static equals(m1: MatrixValue, m2: MatrixValue, exact?: boolean): boolean;
  /**
   * @deprecated
   * Convert matrix array([a,b,c,d,tx,ty]) to object
   * @param {Number[]} matrix
   * @returns {MatrixValue} matrix object.
   */
  static toMatrix(matrix: MatrixArray): MatrixValue;
  /**
   * @static
   * @param {MatrixValue} matrix
   * @returns {Matrix2D}
   */
  static fromMatrix(matrix: MatrixValue | MatrixArray): Matrix2D;
  /**
   * alias fromMatrix
   * @static
   * @returns {Matrix2D}
   */
  static fromObject(matrix: MatrixValue): Matrix2D;
  /**
   * @static
   * @returns {Matrix2D}
   */
  static fromArray(matrix: MatrixArray): Matrix2D;
  /**
   * @static
   * @returns {Matrix2D}
   */
  static toArray(matrix: MatrixValue, out?: MatrixArray): MatrixArray;
  /**
   * Parse a string formatted as matrix(a,b,c,d,tx,ty)
   * @static
   * @param {String} string  String with an affine matrix
   * @returns {Matrix2D}
   */
  static fromString(string: string): Matrix2D;
  static getIdentityMatrixValue(): {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
  };
  static getIdentityMatrix(): Matrix2D;
  /**
   * @static
   * @param {MatrixValue} m1
   * @param {MatrixValue} m2
   * @returns {MatrixValue}
   */
  static multiply(m1: MatrixValue, m2: MatrixValue): MatrixValue;
  /**
   * @static
   * @param {MatrixValue[]} matrices
   * @returns {MatrixValue}
   */
  static concat(matrices: MatrixValue[]): Matrix2D;
  static translate(tx: number, ty?: number): Matrix2D;
  static rotate(angle: number, cx?: number, cy?: number): Matrix2D;
  static scale(sx: number, sy?: number, cx?: number, cy?: number): Matrix2D;
  static shear(shearX: number, shearY?: number): Matrix2D;
  static skew(skewX: number, skewY: number): Matrix2D;
  /**
   * Position (0, 0) in a 3x3 affine transformation matrix.
   * @property a
   * @type Number
   **/
  a: number;
  /**
   * Position (0, 1) in a 3x3 affine transformation matrix.
   * @property b
   * @type Number
   **/
  b: number;
  /**
   * Position (1, 0) in a 3x3 affine transformation matrix.
   * @property c
   * @type Number
   **/
  c: number;
  /**
   * Position (1, 1) in a 3x3 affine transformation matrix.
   * @property d
   * @type Number
   **/
  d: number;
  /**
   * Position (2, 0) in a 3x3 affine transformation matrix.
   * @property tx
   * @type Number
   **/
  tx: number;
  /**
   * alias tx
   */
  get e(): number;
  /**
   * Position (2, 1) in a 3x3 affine transformation matrix.
   * @property ty
   * @type Number
   **/
  ty: number;
  /**
   * alias ty
   */
  get f(): number;
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
  constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
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
  setValues(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number): Matrix2D;
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
  append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
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
  prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix2D;
  /**
   * Appends the specified matrix to this matrix.
   * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
   * @method appendMatrix
   * @param {Matrix2D} matrix
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  appendMatrix(matrix: Matrix | MatrixArray): Matrix2D;
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
  prependMatrix(matrix: Matrix | MatrixArray): Matrix2D;
  /**
   * alias appendMatrix
   * @param matrix
   * @returns
   */
  appendTransform(matrix: Transform): Matrix2D;
  /**
   * alias prependMatrix
   * @param matrix
   * @returns
   */
  prependTransform(matrix: Transform): Matrix2D;
  /**
   * Applies a clockwise rotation transformation to the matrix.
   * @method rotate
   * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  rotate(angle: number): Matrix2D;
  rotate(angle: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skew transformation to the matrix.
   * @method skew
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @param {Number} skewY The amount to skew vertically in degrees.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skew(skewX: number, skewY: number): Matrix2D;
  skew(skewX: number, skewY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skewX transformation to the matrix.
   * @method skewX
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skewX(skewX: number): Matrix2D;
  skewX(skewX: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skewY transformation to the matrix.
   * @method skewY
   * @param {Number} skewY The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  skewY(skewY: number): Matrix2D;
  skewY(skewY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shear transformation to the matrix.
   * @method shear
   * @param {Number} shearX Shear on axis x
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shear(shearX: number, shearY: number): Matrix2D;
  shear(shearX: number, shearY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shearX transformation to the matrix.
   * @method shearX
   * @param {Number} shearX Shear on axis x
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shearX(shearX: number): Matrix2D;
  shearX(shearX: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shearY transformation to the matrix.
   * @method shearY
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  shearY(shearY: number): Matrix2D;
  shearY(shearY: number, cx: number, cy: number): Matrix2D;
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
  /**
   * Applies a scale x transformation to the matrix.
   * @method scaleX
   * @param {Number} x The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  scaleX(x: number): Matrix2D;
  scaleX(x: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a scale y transformation to the matrix.
   * @method scaleY
   * @param {Number} y The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  scaleY(y: number): Matrix2D;
  scaleY(y: number, cx: number, cy: number): Matrix2D;
  /**
   * Translates the matrix on the x and y axes.
   * @method translate
   * @param {Number} x
   * @param {Number} y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  translate(x: number, y?: number): Matrix2D;
  translateX(x: number): Matrix2D;
  translateY(y: number): Matrix2D;
  /**
   * Applies a clockwise rotation transformation to the matrix.
   * @method prependRotate
   * @param {Number} angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependRotate(angle: number): Matrix2D;
  prependRotate(angle: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skew transformation to the matrix.
   * @method prependSkew
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @param {Number} skewY The amount to skew vertically in degrees.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkew(skewX: number, skewY: number): Matrix2D;
  prependSkew(skewX: number, skewY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skewX transformation to the matrix.
   * @method prependSkewX
   * @param {Number} skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkewX(skewX: number): Matrix2D;
  prependSkewX(skewX: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a skewY transformation to the matrix.
   * @method prependSkewY
   * @param {Number} skewY The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependSkewY(skewY: number): Matrix2D;
  prependSkewY(skewY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shear transformation to the matrix.
   * @method prependShear
   * @param {Number} shearX Shear on axis x
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShear(shearX: number, shearY: number): Matrix2D;
  prependShear(shearX: number, shearY: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shearX transformation to the matrix.
   * @method prependShearX
   * @param {Number} shearX Shear on axis x
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShearX(shearX: number): Matrix2D;
  prependShearX(shearX: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a shearY transformation to the matrix.
   * @method prependShearY
   * @param {Number} shearY Shear on axis y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependShearY(shearY: number): Matrix2D;
  prependShearY(shearY: number, cx: number, cy: number): Matrix2D;
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
  /**
   * Applies a scale x transformation to the matrix.
   * @method prependScaleX
   * @param {Number} x The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependScaleX(x: number): Matrix2D;
  prependScaleX(x: number, cx: number, cy: number): Matrix2D;
  /**
   * Applies a scale y transformation to the matrix.
   * @method prependScaleY
   * @param {Number} y The amount to scale horizontally.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependScaleY(y: number): Matrix2D;
  prependScaleY(y: number, cx: number, cy: number): Matrix2D;
  /**
   * prepend Translates the matrix on the x and y axes.
   * @method prependTranslate
   * @param {Number} x
   * @param {Number} y
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependTranslate(x: number, y?: number): Matrix2D;
  prependTranslateX(x: number): Matrix2D;
  prependTranslateY(y: number): Matrix2D;
  /**
   * flip the matrix on the y axes and y axes.
   * @method flip
   * @param {Boolean} flipX
   * @param {Boolean} flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  flip(flipX: boolean, flipY: boolean): Matrix2D;
  flip(flipX: boolean, flipY: boolean, cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the x axes.
   * @method flipX
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipX(): Matrix2D;
  flipX(cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the y axes.
   * @method flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipY(): Matrix2D;
  flipY(cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the y axes and y axes.
   * @method flipOrigin
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  flipOrigin(): Matrix2D;
  /**
   * flip the matrix on the y axes and y axes.
   * @method prependFlip
   * @param {Boolean} flipX
   * @param {Boolean} flipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  prependFlip(flipX: boolean, flipY: boolean): Matrix2D;
  prependFlip(flipX: boolean, flipY: boolean, cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the x axes.
   * @method prependFlipX
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipX(): Matrix2D;
  prependFlipX(cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the y axes.
   * @method prependFlipY
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipY(): Matrix2D;
  prependFlipY(cx: number, cy: number): Matrix2D;
  /**
   * flip the matrix on the y axes and y axes.
   * @method flipOrigin
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  prependFlipOrigin(): Matrix2D;
  /**
   * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
   * @method identity
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  identity(): Matrix2D;
  /**
   * alias identity
   * @method reset
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  reset(): Matrix2D;
  /**
   * Inverts the matrix, causing it to perform the opposite transformation.
   * @method invert
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   **/
  invert(): Matrix2D;
  /**
   * Returns true if the matrix is an identity matrix.
   * @method isIdentity
   * @return {Boolean}
   **/
  isIdentity(): boolean;
  /**
   * Returns true if this matrix is equal to the specified matrix (all property values are equal).
   * @method equals
   * @param {Matrix2D} matrix The matrix to compare.
   * @return {Boolean}
   **/
  equals(matrix: Matrix): boolean;
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
  /**
   * @param points
   * @returns
   */
  transformPoints(points: Point[]): Point[];
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
  transformPointWithOrigin(x: number, y: number): Point;
  /**
   * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
   * may not match the transform properties you used to generate the matrix, though they will produce the same visual
   * results.
   * @method decompose
   * @param  {Boolean} flipX Whether the matrix contains vertical flip, i.e. mirrors on x-axis
   * @param  {Boolean} flipY Whether the matrix contains horizontal flip, i.e. mirrors on y-axis
   * @return {Object} The target, or a new generic object with the transform properties applied.
   */
  decompose(flipX?: boolean, flipY?: boolean): IDecomposeValue;
  /**
   * Copies all properties from the specified matrix to this matrix.
   * @method copy
   * @param {Matrix2D} matrix The matrix to copy properties from.
   * @return {Matrix2D} This matrix. Useful for chaining method calls.
   */
  copy(matrix: Matrix): Matrix2D;
  /**
   * Returns a clone of the Matrix2D instance.
   * @method clone
   * @return {Matrix2D} a clone of the Matrix2D instance.
   **/
  clone(): Matrix2D;
  /**
   * Rounds all elements of the given matrix using the given precision
   * @method smooth
   * @param {Number} [precision] A precision to use for Math.round. Defaults to 10000000000 (meaning which rounds to the 10th digit after the comma).
   * @returns {Matrix2D}  This matrix. Useful for chaining method calls.
   */
  smooth(precision?: number): Matrix2D;
  /**
   * Returns a string representation of this object.
   * @method toStringDebug
   * @return {String} a string representation of the instance.
   **/
  toStringDebug(): string;
  /**
   * Returns a matrix object as {a,b,c,d,tx,ty}
   * @returns {MatrixValue}
   */
  toMatrix(out?: MatrixValue): MatrixValue;
  /**
   * alias toMatrix
   * @returns {MatrixValue}
   */
  toObject(out?: MatrixValue): MatrixValue;
  /**
   * Returns a matrix array as [a,b,c,d,tx,ty]
   * @method toArray
   * @returns {MatrixArray}
   */
  toArray(out?: MatrixArray): MatrixArray;
  /**
   * Returns a matrix string as matrix(a,b,c,d,tx,ty)
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  toString(): string;
}

export interface MatrixValue {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}
export declare type MatrixArray = [
  a: number,
  b: number,
  c: number,
  d: number,
  tx: number,
  ty: number
];
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

export declare const EPSILON = 0.000001;
export declare function multiply(m1: MatrixValue, m2: MatrixValue): MatrixValue;
export declare function transform(matrices: MatrixValue[]): MatrixValue;
```

## Thanks

- [CreateJS Matrix2D](https://www.createjs.com/docs/easeljs/classes/Matrix2D.html) - [Github](https://github.com/CreateJS/CreateJS)
- [transformation-matrix](https://github.com/chrvadala/transformation-matrix)
