# 比数组更快的ArrayBuffer类型数组

默认字C、C++等语言中定义数组是一串 连续 的内存区域，如图所示

![c数组](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib1icOhdJyia66XILFAyBpgK0fI7teFCeIAraQ0yWqMZatmIlhmk8GXAhcKUPJW21hOr8FVzPtxL79aw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

其中保存了4个元素，一个元素占4个字节，一共占用16个字节，可以看出这是连续的

假设上面例子为 Int Arr[4]，分配的内存从1000开始，Arr[1]则是1000 + 4 * 1 = 1004开始读取

而在js中数组是基于哈希映射实现，比如链表。内存分配不是连续的，如图所示：

![js数组](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib1icOhdJyia66XILFAyBpgK0f2z5LspLtMGyr8pN9YwvnjjKia7kpbnojGvbPXUb7NCXXMJYT1y96L9w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

显然C数组实现的连续内存读取效率比js数组的链表查询速度快很多，数组越复杂越是如此。

---

为了处理这种情况，提出了类型化数组（Typed Arrays）比如ArrayBuffer的概念，提供一块连续内存供开发者随意操作。

到底性能有多快呢？参考如下例子：

谷歌版本：65.0

### Array插入

```Array
var LIMIT = 10000000;
var arr = new Array(LIMIT);
console.time("Array insertion time");
for (var i = 0; i< LIMIT; i++) {
   arr[i] = i;
}
console.timeEnd("Array insertion time");
// Array insertion time: 25.60107421875ms

```

### Typed Array 插入

```Typed Array
var LIMIT = 10000000;
var buffer = new ArrayBuffer(LIMIT * 4);
var arr = new Int32Array(buffer);
console.time("ArrayBuffer insertion time");
for (var i = 0; i < LIMIT; i++) {
   arr[i] = i;
}
console.timeEnd("ArrayBuffer insertion time");
// ArrayBuffer insertion time: 28.35400390625ms

```

貌似没有快到哪里！！别急

这是因为现代浏览器经过一系列进化，默认会对js数组中同质（类型完全一样，如['a', '2']）数组分配连续的内存。如果分配不同类型的元素则不会优化处理。

那如果不是同一类型的元素的数组结果如何呢，请参考下方代码：

### Array插入

```Arrary

var LIMIT = 10000000;
var arr = new Array(LIMIT);
arr.push({a: 22});
console.time("Array insertion time");
for (var i = 0; i< LIMIT; i++) {
   arr[i] = i;
}
console.timeEnd("Array insertion time");
// Array insertion time: 795.273193359375ms

```

### Type Array插入

```TypedArray

var LIMIT = 10000000;
var buffer = new ArrayBuffer(LIMIT * 4);
var arr = new Int32Array(buffer);
console.time("ArrayBuffer insertion time");
for (var i = 0; i< LIMIT; i++) {
    arr[i] = i;
}
console.timeEnd("ArrayBuffer insertion time");
// ArrayBuffer insertion time: 24.859130859375ms

```

可以看出插入的性能提高了33倍





> 参考资料

1. [JavaScript 数组的演进及其性能](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651554017&idx=2&sn=86665ccaf4760e06e7e996d598733296&chksm=80255720b752de3691dae5d325a3be202ef2e6e9813ddde9f38b2f6d9a50ec191bc008a3d08f&scene=0#rd)