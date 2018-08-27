# canvas

> fillRect(x, y, width, height)

在以坐标（x，y）处开始绘制一个`填充`width和height的矩形

> strokeRect(x, y, width, height)

在以坐标（x，y）处开始绘制一个width和height的`边框`矩形

开始的时候 默认先要移动画笔（`moveTo`）到指定坐标，`beginPath` 指定初始坐标

> lineTo(x, y) 结束的坐标
> stroke()  实线连接起始坐标和结束坐标
> strokeStyle 指定实线的颜色值
