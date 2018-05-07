# 上下文和作用域以及闭包

1. 作用域是在运行代码时确定某些特定部分中变量、函数和对象的可访问性；

```
function foo() {
  console.log(a);
}
 
function bar() {
  let a = 3;
  foo();
}
 
let a = 2;
 
bar()       // 2
```

内部的`foo`函数是一个全局函数，作用域是外部的`window`，在`window`下查找到`a`为2

2. 上下文是指`this`在同一作用域内的值；

上下文分为两个阶段，一个是创建阶段，一个是执行阶段；

创建阶段的上下文就是全局上下文，在静态分析阶段做的代码检查确定的变量、函数和对象，

执行阶段的上下文就是在执行某个具体函数的局部上下文，上下文又被称作做`执行环境`

看如下例子：

![第一步](https://img-blog.csdn.net/20171014200849332)
![第二步](https://img-blog.csdn.net/20171014203006496)
![第三步](https://img-blog.csdn.net/20171014203932726)

3. 闭包就是一个函数返回的内部函数既能访问其内部作用域链又能访问外部作用域链；

```
var b = 40
function test () {
    var a = 10
    return function show () {
        console.log(a)
        console.log(b)
    }
}
var a = 20
var TestEntity = test()
TestEntity()    // 10  40
```

只有在执行`test`内部函数`show`时，此时`show`是一个包含`test`和外部作用域的函数，通过原型链一层一层向上遍历，才能确定具体的变量a的值为10，内部函数没有变量b，则在最外层的全局作用域查找，若有b返回b的值，没有则为undefined。


> ## 参考资料

1. [javascript执行上下文、作用域与闭包（第五篇）---一个例子的理解](https://blog.csdn.net/iamchuancey/article/details/78236839)