## JS原型

说道JS都必不可少的提到几个重要概念，如闭包，继承，原型等。今天谈谈原型是什么。

在JS中一切皆对象（除了undefined，貌似null也是）

js中每个对象都有`__proto__`属性，可以被称为隐式原型。实例的`__proto__`用于指向父级函数的`prototype`

当我们创建一个构造函数的时候，如下：

    ```
        function test (name) {
            this.name = name
        }
        test.prototype == new test().__proto__
    ```

此时名为test的构造函数有一个额外的专属属性`prototype`，通过这个属性的`constructor`属性能查找到当前对象的构造函数，如下：

    ```
        test.prototype.constructor == test   // true
    ```
既然构造函数通过`prototype`属性的`constructor`属性能找到自身，那么由这个构造函数创建出来的实例是不是也可能通过`constructor`找到自身的构造函数呢？撸代码看下：

    ```
        var a = new Test('我是张三')
        a.constructor == test               // true
    ```

那么现在有个`constructor`的问题，这到底是干嘛用的呢？

原来这个属性是用来保存一个指向Function的引用，可以查找当前对象的父级`Function`，每个对象都可以通过`constructor`一级一级找到最后的大boss => `Function`，如下：

    ```
    a.constructor == test
    test.constructor == Function
    test.prototype.constructor == test

    // 以上都是为true
    ```
这个属性起初是用来判断对象类型的，代码如下：

    ```
        var b = {}
        b.constructor == Object             // true

        function test1 () {}
        test1.constructor == Function       // true

        [].constructor == Array             // true

        true.constructor == Boolean         // true
    ```
看上去还挺还用，很不错是吧？确实如此，但是为什么还会有`instanceof`这个判断类型方法呢？

主要是因为`construcor`属性很容易被修改 WTF，如下：

    ```
        var c = [1,2,3]
        c.constructor = {}
        c.constructor == Array              // false
        c instanceof Array                  // true
    ```

所以呢 判断类型还是建议使用`instanceof`方法。

上一段类似`instanceof`功能的函数

    ```
        // A 需要查询类型的参数  B是需要判断的类型  是B类型的返回true 否则false
        function _instanceof(A, B) {
            A = A.__proto__
            O = B.prototype
            while (true) {
                if (A == null) return false
                if (O == A ) return true
                A = A.__proto__ 
            } 
        }
    ```
---
js里的内置对象Object、Array、Function、Date、Math、Number、String、Boolean、RegExp等都是构造函数对象，可以通过new实例化对象出来。其`__proto__`属性都指向Function.prototype。Function这个特殊对象，是上面其他函数对象的构造函数。

    ```
    Array.__proto__ === Function.prototype // true
    Object.__proto__ === Function.prototype // true

    Array.constructor === Function // true
    Object.constructor === Function // true

    ```

> ### 原型相关方法

js的原型主要实现了属性和方法的继承，既然是继承就有自身属性和继承过来的属性，怎么区分呢？

- hasOwnProperty  用来判断对象上自身是否包含某个属性，不包括原型链上属性

    ```
    var test = {name: '张三'}
    test.prototype = { age: 143}
    test.hasOwnProperty('name')         // true
    test.hasOwnProperty('age')          // false
    ```

- isPrototypeOf  判断当前对象是否在另一个对象的原型链上

    ```
    var a = {name: '张三'}
    var b = {age: '李四'}
    b.__proto__ = a
    a.isPrototypeOf(b)                  // true
    ```

- for in       

    可以用来遍历可枚举的属性 包括原型链（这是for in与一般的遍历不同的区别）

    多吐槽一句`Object.keys`也是返回可枚举的属性为一个数组


> ### 参考资料：
1. [js深入学习绕不开的原型知识](https://juejin.im/post/5a6600d8f265da3e2c383989)