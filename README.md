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
export declare class Matrix2D implements Matrix {
  /**
   * Multiplier for converting degrees to radians. Used internally by Matrix2D.
   * @property DEG_TO_RAD
   * @static
   * @final
   * @type Number
   * @readonly
   **/
  static DEG_TO_RAD: number;
  /**
   * An identity matrix, representing a null transformation.
   * @property identity
   * @static
   * @type Matrix2D
   * @readonly
   **/
  static identity: Matrix2D;
  /**
   * @deprecated
   * Convert matrix array([a,b,c,d,tx,ty]) to object
   * @param {Number[]} matrix
   * @returns {Matrix} matrix object.
   */
  static toMatrix(matrix: MatrixArray): Matrix;
  /**
   * @static
   * @param {Matrix} matrix
   * @returns {Matrix2D}
   */
  static fromMatrix(matrix: Matrix): Matrix2D;
  /**
   * alias fromMatrix
   * @static
   * @returns {Matrix2D}
   */
  static fromObject(matrix: Matrix): Matrix2D;
  /**
   * @static
   * @returns {Matrix2D}
   */
  static fromArray(matrix: MatrixArray): Matrix2D;
  /**
   * Parse a string formatted as matrix(a,b,c,d,tx,ty)
   * @static
   * @param {String} string  String with an affine matrix
   * @returns {Matrix2D}
   */
  static fromString(string: string): Matrix2D;
  /**
   * @static
   * @param {Matrix} m1
   * @param {Matrix} m2
   * @returns {Matrix}
   */
  static multiply(m1: Matrix, m2: Matrix): Matrix;
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
  appendMatrix(matrix: Matrix): Matrix2D;
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
  prependMatrix(matrix: Matrix): Matrix2D;
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
  /**
   * @deprecated
   * @param points
   * @param origin
   * @returns
   */
  transformPoints(points: Point[], origin?: Point): Point[];
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
  transformPointWithOrigin(x: number, y: number, origin: Point): Point;
  /**
   * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
   * may not match the transform properties you used to generate the matrix, though they will produce the same visual
   * results.
   * @method decompose
   * @param  {Boolean} flipX Whether the matrix contains vertical flip, i.e. mirrors on x-axis
   * @param  {Boolean} flipY Whether the matrix contains horizontal flip, i.e. mirrors on y-axis
   * @return {Object} The target, or a new generic object with the transform properties applied.
   */
  decompose(flipX?: boolean, flipY?: boolean): Transform;
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
   * Returns a matrix object as {a,b,c,d,tx,cy}
   * @returns {Matrix}
   */
  toMatrix(): Matrix;
  /**
   * alias toMatrix
   * @returns {Matrix}
   */
  toObject(): Matrix;
  /**
   * Returns a matrix array as [a,b,c,d,tx,cy]
   * @method toArray
   * @returns {MatrixArray}
   */
  toArray(): MatrixArray;
  /**
   * Returns a matrix string as matrix(a,b,c,d,tx,cy)
   * @method toString
   * @return {String} a string representation of the instance.
   **/
  toString(): string;
}
export default Matrix2D;

export interface Matrix {
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
export interface Transform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}
interface MatrixValue {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}
```

## Thanks

- [CreateJS Matrix2D](https://www.createjs.com/docs/easeljs/classes/Matrix2D.html) - [Github](https://github.com/CreateJS/CreateJS)
- [transformation-matrix](https://github.com/chrvadala/transformation-matrix)
