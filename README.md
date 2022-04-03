# matrix2d.js

Matrix2D from [CreateJS](https://github.com/CreateJS/CreateJS)

[Docs](https://www.createjs.com/docs/easeljs/classes/Matrix2D.html)

**扩展 API：**

- `transformPointWithOrigin(x: number,y: number, point: {x: number, y: number})` 变换矩阵应用于坐标时支持自定义基点`point`，示例：

```ts
const mtx = new Matrix2D();
mtx.rotate(45);
const rect = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
};
const p = mtx.transformPointWithOrigin(rect.x, rect.y, {
  x: rect.x + rect.width / 2,
  y: rect.y + = rect.height / 2,
});

// 旋转45角度后的新坐标
console.log(p)
```

## Usage

`npm install --save matrix2d.js`

```ts
import Matrix2D from "matrix2d.js";

const mtx = new Matrix2D();
mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
```
