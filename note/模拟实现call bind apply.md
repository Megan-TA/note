# 继承方法模拟实现

> bind

原生的bind用法

```javascript
var Cat = {
  name: '猫'
}

function Animal (color, age, test) {
  console.log(this.name)
  console.log(color)
  console.log(age)
  console.log(test)
}

var cats = Animal.bind(Cat)
cats()
```

模拟实现如下：

1.利用闭包，不主动执行；

```javascript
Function.prototype.bind2 = function (context) {
    var self = this
    return function () {
        self.apply(context)
    }
}
```

但是此时模拟实现的函数不支持接收参数，修改如下：

---

2.支持自定义参数；

```javascript
Function.prototype.bind2 = function (context) {
    var self = this
    var remainingArg = Array.prototype.slice.call(arguments, 1)
    return function () {
        var bindArgs = Array.prototype.slice.call(arguments)
        self.apply(context, remainingArg.concat(bindArgs))
    }
}

var cats2 = Animal.bind2(Cat, 'yellow')(10)
```

---

但是原生`bind`还有一个功能，可以实例化

```javascript
var cats = Animal.bind(Cat, 'red')
var singleCat = new cats(18, '111')
```

此时内部的this在new的过程中被替换为obj，例子中不会输出`name`的值

---

3.支持实例化

```javascript
Function.prototype.bind2 = function (context) {
    var self = this
    var remainingArg = Array.prototype.slice.call(arguments, 1)
    var temp = function () {}
    temp.prototype = this.prototype
    function bound () {
        var bindArgs = Array.prototype.slice.call(arguments)
        // 构造函数时候，this指向实例，self指向绑定的函数
        // 普通函数时候，this指向window，self指向绑定函数，修改上下文为传入的context
        self.apply(this instanceof self ? this : context, remainingArg.concat(bindArgs))
    }
    bound.prototype = new temp()
    return bound
}
```

---

最后处理下兼容，最终代码如下：

```javascript
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind2 - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var temp = function () {};

    var fbound = function () {
        self.apply(
          this instanceof self
            ? this
            : context,
          args.concat(
            Array.prototype.slice.call(arguments)
          )
        );
    }

    temp.prototype = this.prototype;
    fbound.prototype = new temp();

    return fbound;

}
```

---

> call

利用传入的上下文新增一个属性，并挂载当前函数的`this`到传入参数的上下文中，这样实现`this`指向问题

自执行问题，利用`eval`函数自执行

```javascript
Function.prototype.call2 = function (context) {
  context = context || window
  var arr = []
  for (var i = 1; i < arguments.length; i++) {
    arr.push(arguments[i])
  }
  context.fn = this
  var result = eval('context.fn(' + arr + ')')
  delete context.fn
  return result
}

var hc = {
  name: '123'
}

function test () {
  console.log(this.name)
}

test.call2(hc)

```