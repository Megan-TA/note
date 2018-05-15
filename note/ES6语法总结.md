# ES6语法总结

> ## Class

1. class内部方法都是扩展在函数的原型链上;

2. class内部方法无法遍历（Object.keys），而ES5构造函数原型链的方法可以遍历；

3. class的方法名字可以是表达式（用[]圈起来）；

4. 不存在变量提升；

5. static 静态属性 且不会被实例获取到，可以被继承到；

6. get/set 对某个方法拦截；

7. new.target 可以用来判断类是使用哪个方法调用（可用来指定必须new或者extends击沉调用形式）；

8. extends 继承 

子类继承父类，必须使用super方法

这是因为ES6继承和ES5继承有本质区别：

ES5继承是 先创造子类的实例对象this，再将父类方法添加到this上

ES6继承是 先通过super方法创造父类的实例对象this，再在子类的构造函数动态新增属性来修改this

---

> ## Set/WeakSet 和  Map/WeakMap

### Set

1. Set是一组没有重复值的数据结构（多个NaN默认是相同的，只能添加一个）；

2. Set构造函数的方法：

* size
* delete;
* has;
* clear;

3. Set实例方法：

* add()
* keys()
* values()
* entries()
* forEach()
* ...

4. Array.from() 可以将Set结构转换为数组；


### WeakSet

1. WeakSet成员只能是数组或者类似数组的对象；

2. 不可遍历；

3. 没有size；

3. 因为其中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，不再引用对象时会自动销毁，不会出现内存泄露；


### Map

1. 解决Object结构只提供的“字符串--值”的对应，Map结构提供“值--值”的对应，是一个更完善的Hash结构实现；

2. 实例的属性和操作方法

* size
* set
* get 
* has
* delete
* clear

遍历方法

* keys()
* values()
* entries()
* forEach()

---

> ## Object

* Object.is(x, y)

    代替 === 和 == 判断两个数值是否相等;

注意：

```javascript
    +0 == -0    // true
    +0 === -0    // true
    Object.is(+0, -0)   // false
    Object.is({}, {})   // false
```

* Object.assign(target, obj1, obj2)

    1. 默认合并参数是一个对象，如果不是对象的话 只能接受 字符串  不接受 boolean 数字；
    2. 浅拷贝；

注意：

```javascript
Object.assign({}, 'abc')  => {0: "a", 1: "b", 2: "c"}
Object.assign({}, 'abc', true)  => {0: "a", 1: "b", 2: "c"}
Object.assign({}, 'abc', true, 10)  => {0: "a", 1: "b", 2: "c"}
```

---

> ## Promise

Promise处理异步编程的一种解决方案，简单来说就是一个容器，里面存放着异步之后的事件结果。

缺点：

* 无法中途取消
* 如果不设置回调函数，内部抛出的错误不会反应到外部
* 当处于pending状态时候 不知道是发展到哪一个阶段

注意点：

* promise.prototype.then

promise的then是定义在原型对象上的，方法有两个参数，分别指定`resolved`和`reject`状态的回调函数，其中`rejected`不是必选的。

```javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

* promise.prototype.catch

如果`catch`和`then`的第二个回调参数共存的情况下，默认是返回then的`rejected`结果，不会执行`catch`方法。而且`catch`返回的结果可以被后续的再次定义的`catch`方法所捕获。

* promise.prototype.finally

不管`promise`的状态是什么，最终都会执行`finally`方法，不接受参合参数，需要指定最终的回调。

`finally`方法本质是`then`方法的特例。

```javascript
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```
可以看出`finally`其实就是`then`写了成功与失败状态两个回调集合。

另外`finally`方法总是会返回原来的值。

```javascript
// resolve 的值是 undefined
Promise.resolve(2).then(() => {}, () => {})

// resolve 的值是 2
Promise.resolve(2).finally(() => {})

// reject 的值是 undefined
Promise.reject(3).then(() => {}, () => {})

// reject 的值是 3
Promise.reject(3).finally(() => {})
```

* promise.prototype.all

用于将多个`promise`实例包装成一个新的`promise`实例。

接受一个类数组的参数（必须有`iterator`接口），

多个实例的状态全为`fulfilled`，最终的状态为`fulfilled`，其中一个为`rejected`，则为`rejected`，但是一旦参数的`promise`实例定义了`catch`方法，最终这个实例输出的状态在`all`方法中还是会被认为`fulfilled`。

```javascript
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]

// 一旦去掉p2的catch方法，all方法会返回 Error: 报错了
```

* promise.prototype.race

与`all`方法相反，接受参数相同，其中一个实例状态发生变化，则最终状态就是这个实例变化后的状态；

```javascript
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error)
// 如果5秒后fetch没有获取到结果，则返回rejected状态
```

* Promise.resolve

用于将一个普通对象包装成`promise`对象。

* Promise.reject

用于返回一个状态为`rejected`的`promise`实例。
