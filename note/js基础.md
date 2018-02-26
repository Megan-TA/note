# js基础

## 1. 解码和编码
> 原因：因为链接里面会有中文或者特殊字符号无法跳转需要进行相关编码解码
> **编码**
>         
    'encodeURI': 整体url编码， 注意参数会被截断;
    
    'encodeURIComponent': 保证参数不会被截断 可以带参数
> **解码**
>
    'decodeURI': 解码
    'decodeURIComponent': 带参数解码
    
---------------------------------

## 2. 序列化和反序列化
>

```
JSON.stringify()        // 序列化
JSON.parse()            // 反序列化
```
> 备注
>>  ajax请求头部信息 
>>> header: {'Content-Type': 'application/json; charset=utf-8;'}

--------------------------------

## 3. 日期
>

```
new Date().getTime()   // 单位  秒
// 获取当前时间   （存在兼容性）
new Date().toLocaleDateString() // 2017/7/24
new Date().toLocaleTimeString() // 下午5:07:33
new Date().toLocaleString()     // 2017/7/24 下午5:07:33
// 若要显示24进制 需要option选项
new Date().toLocaleTimeString("UTC",{ hour12: false })  // 17:20:16
```
-----------------------------

## 4. location



------------------------------

## 5. 锚点定位 scrollIntoView （无兼容问题）
> `document.getElementById('xx').scrollIntoView()`

-------------------------------------

## 6. typeof和instanceof
> ### typeof
>> 会返回一个变量的基本类型，只有以下几种：number,boolean,string,object,function；
>>> ==缺点==： 不适用于来判断数组，因为不管是数组还是对象，都会返回object。
>

```
typeof [1]      // Object
```

> ### instanceof
>> 返回的是一个布尔值   只能用来判断对象和函数
>

```
var a = {};

alert(  a instanceof Object )     // true

var a  = [];

alert(  a instanceof Array )    // true

```

--------------------------------------

## 7.  requestAnimationFrame （RAF）   动画api 兼容Ie 8/9

```
var i = 0

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})()

requestAnimFrame(animloop)

function animloop () {
    document.getElementById('test').style.top = i ++
}

```

> 动画效率之争 

    css3动画高效的原因有以下三点：

        1. 强制使用硬件加速（GPU）；
        2. 使用与RAF类似的机制；
        3. 优化DOM操作 避免内存消耗来减少卡顿；

    同时因为采用GPU， 导致浏览器一直出于高负荷运转，移动端电量损耗和一定卡顿，
    而且css不能完全被js控制
    pc上兼容性

js动画库  （比如 Velocity.js 和 GSAP）



---------------------------------------

## 8. 跨域

1. ### JSONP
> 通过js标签引入一个js文件 这个js文件载入成功之后会执行我们在url参数中指定的函数 并且会吧我们需要的json数据作为参数传入
> 
> 例如：url?item=1&callback=filter
>
> == 原生js实现jsonp的话 定义好callback的函数名称,动态创建js标签 url加上查询的参数写好callback的回调函数名称即可 ==

2. ### 利用iframe并修改document.domain来跨子域

    两个不同域的页面引入iframe标签 同时将两个页面的主域设置成相同的域名

    ![页面1](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib3G96tn5N9s0grjcDZD0Ox669ialYSHxewnD1B4L5UibVqhMnFEfibLhA8vUQu2s9rltB2HZ6UTQ19iag/0?wx_fmt=png)
    ![页面2](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib3G96tn5N9s0grjcDZD0Ox6Kv2iaHanjIzQHDNeia2FsoHSz8AJPkxh0IqickdbPg0CPeFPhoQMpuv5w/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

3. ### window.name （可以配合iframe）

    同源窗口下window.name对所有页面都是共享的
    
    每个页面对window.name都有读写权限  
    
    window.name的值并不会因为新页面而重置

4. widnow.postMessage （存在兼容性IE7/8 不支持）

    ！[页面1](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib3G96tn5N9s0grjcDZD0Ox6z8ibxywKPEusvEA2xS8ialrQ1Oxd0jw0V8C6f7Gicy6Obsyt5bicibxdx5Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

    ！[页面2](http://mmbiz.qpic.cn/mmbiz_png/zPh0erYjkib3G96tn5N9s0grjcDZD0Ox6B9Fpsa9KmNAMibvfSqE8Qv2icpLzzFE6NfvEp8YxWW6JOMTacIzaQzxw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1)

## 9. selection
> 获取鼠标划过文本的对象

> `window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();`

----------------------------------------

## 10. 正则表达式
> 常用规则
* \n  回车
* \t  制表符
* \r  换行符
* \s  空格
* \u4e00-\u9fa5  中文 
* \w 大小写字母_数字
* \b : 独立的部分 （ 起始，结束，空格 ）
* {n, m} 至少出现n次 最多m次
* {n,} 至少n次
* * 任意次
* + 至少一次
* {n} 至少n次
* () 分组符号
* ^ 放在正则的最开始位置，就代表起始的意思，注意  /[^a] /   和       /^[a]/是不一样的，前者是排除的意思，后者是代表首位。
* 正则的最后位置 , 就代表结束的意思

例如：

```
var str = '2013-6-7';
var re1 = /\d-+/g;        // 全局匹配数字，横杠，横杠数量至少为1，匹配结果为：  3- 6-
var re1 = /(\d-）+/g;     // 全局匹配数字，横杠，数字和横杠整体数量至少为1   3-6-
var re2  = /(\d+)(-)/g;   // 全局匹配至少一个数字，匹配一个横杠 匹配结果：2013- 6-

--------------------------
var str = '2013-6-7';
var re = /(\d+)(-)/g;

str = str.replace(re,function($0,$1,$2){
    
    //replace()中如果有子项，
    //第一个参数：$0（匹配成功后的整体结果  2013-  6-）,
    // 第二个参数 : $1(匹配成功的第一个分组，这里指的是\d   2013, 6)
    //第三个参数 : $1(匹配成功的第二个分组，这里指的是-    - - )   
    return $1 + '.';  //分别返回2013.   6.
    
});

```
* [] 表示某个集合中的任意一个
* [^a] 排除a

```
// var re = /\bclassname\b/; 

// 不能这样写，当正则需要用到参数时候，一定要用全称的写法，简写方式会
// 把classname当做一个字符串去匹配。

var re = new RegExp('\\b'+classname+'\\b');  

// 匹配的时候，classname前面必须是起始或者空格，后面也是。 

默认匹配成功就停止，所以就算有重复的也不会再匹配进去了。
```

------------------------------------------

## 11. Object
* **constructor**
> **实例的constructor 永远指向 '构造函数'的 prototype.constructor**
>
```
function A(x){
    this.x = x;
}
var newA = new A(name);

此时：
A.prototype.constructor = newA.constructor;
```

* **hasOwnProperty**
> **判断对象上某个属性属于自身为true, 原型链上为false**
> 
```
function a(){
    this.show = 'x';
}
a.prototype.hide = function(){
    console.log(111111);
}
var z = new a();
z.hasOwnProperty('show');          // true
z.hasOwnProperty('hide');          // false

```

* **isPrototypeOf**
> **判断一个对象是否是另一个对象的原型**
>

```
var monkey = {
    hair : true,
    breathes : function(){
        alert('1')
    }
}
function Human(name){
    this.name = name;
}
// Human的原型链绑定monkey对象
Human.prototype = monkey;

var man = new Human('张三');
monkey.isPrototypeOf(man);      // true

```

* **prototype和__proto__**

prototype是一个函数的内置属性（每个函数都有一个prototype属性）

__proto__ 是一个实例对象的内置属性 js内部通过此属性寻找原型链

#### 举例：
 
```
 var Person = function() {}
 var zhangsan = new Person()
 
 zhansan.__prop__ = Person.prototype
 
 new 的过程拆分成以下三步
 
 1. var p = {}
 2. p.__proto__ = Person.prototype
 3. Person.call(p)
```
---------------------------

## 12. 继承
> **调用另一个对象的方法，以另一个对象替换当前对象的上下文**
>> 缺点
>>> 只能继承父级本身属性，原型链的属性无法继承
* **call**
> 第二个参数可以省略
* **apply**
> 第二个参数必须是数组或者用arguments代替
* **bind**
> bind与call和apply的区别在于 bind是一个函数 不会立即执行  必须在后面再加上一对括号去立即执行
>

```
例子1：

function Add(a,b)
{
    this.add = function(a,b){
        alert(a+b)
    };
    this.xx = 333;
}
function Sub()
{
    this.sub = '张三';
    
    // call方法
    Add.call(this); // call继承Add所有方法(不包含原型链上的方法)
    
    // apply方法  参数不能指定的时候用[]或者arguments代替
    Add.apply(this, []) 
    // 又可以写成
    Add.apply(this, arguments) 
    
    // bind方法
    Add.bind(this)();
}

x = new Sub();
x.add(5,7)                  // 11    

=====================================

例子2：

若只想继承父级构造函数某一个具体方法
需要先将父子对象都实例化后 调用父级的具体方法call

function Add(a,b)
{
    this.add = function(a,b){
        alert(a+b)
    };
    this.xx = 333;
}
function Sub()
{
    this.sub = '张三';
}

newAdd = new Add(7,8);
newSub = new Sub();

// Sub只继承了Add的add方法并执行相关方法

call方法：
newAdd.add.call(newSub, 10, 4);      // 14

apply方法：
newAdd.add.apply(newSub, [10, 4]);   // 14

bind方法：
newAdd.add.bind(newSub, 10, 4)();   // 14

```

> 

>> **注意**
>>> 若想要全部继承父级所有相关属性 得采用==原型链继承==的方式

```
function person(){       
    this.hair = 'black';       
    this.eye = 'black';       
    this.skin = 'yellow';       
    this.view = function(){           
        return this.hair + ',' + this.eye + ',' + this.skin;    
    } 
}
function man(){       
    this.feature = ['beard','strong'];   
}
man.prototype = new person();

```
------------------------------

## 13. cookie sessionStorage localStorage
> **cookie**
* 4k的限制；
* 服务端和客户端传递时都会带上cookie
* 本质上是对字符串的读取 存储内容过多消耗内存空间 导致页面变卡顿；
* 不能被爬虫读取；
* 设置时间之前一直有效，到时间就清除；
> **sessionStorage**
* 临时存储：引入“浏览器窗口”的概念，同源同窗口数据不会销毁，不同浏览器窗口中不能共享，关闭浏览器时候销毁；
* 减少网络流量，即减少数据在服务端和客户端之间的传递；
* 性能更好，即本地读取数据比服务器获取快多了；
> **localStorage**
* 减少网络流量，即减少数据在服务端和客户端之间的传递；
* 体积更大 5M;
* 持久存储在本地，直到手动清除;

> 

```
localStorage.setItem('sss',1111);
localStorage.getItem('sss');
localStorage.removeItem('sss');
localStorage.clear();
```
----------------------------

## 14. 闭包
> 因为js是链式的 一层一层向上级查找 所以外部函数无法访问内部函数;
>> 优点
>>> * 可以读取函数内部的变量;
>>> * 函数在执行完毕不会被销毁 而是一直存在内存中;
>
>> 缺点
>>> * 不会被内存回收 容易出现性能问题 
>

```
function foo(){
    var a = 2;
    
    function bar(){
        console.log(a);
    }
    
    return bar;
}
var newFoo = foo();     
newFoo();               // a

```

------------------------------------

## 15. 深拷贝和浅拷贝
* **浅拷贝**
> **复制对象的副本  指向同一内存区域  对副本的操作会影响父级对象**

* **深拷贝**
> **复制对象的副本  指向不同的内存区域    与父级对象独立**
>

```
// 浅拷贝
var a = { 
    name : 'zhangsan'
}

var b = a;
b.name = 'lisi';

console.log(a.name);    // "lisi"
console.log(b.name);    // "lisi"

// 深拷贝  (更完整的深拷贝还需要再详细优化)
function deepCopy(p, c){
    var c = c || {};
    for(var i in p ){
        // 数组和对象的时候再处理
        if(typeof p[i] === 'object'){
            c[i] = (p[i].constructor === Array) ? [] : {};
            deepCopy(p[i], c[i]);
        }else{
            // 基本类型直接赋值
            c[i] = p[i]
        }
    }
    return c;
}

var parent = {
    number: [1, 2, 3],
    obj: {
        prop: 1
    }
}

var copyParent = deepCopy(parent);
copyParent.number.push(4) 
copyParent.number                   // 1,2,3,4
parent.number                       // 1,2,3
```

---------------------------------------

## 16. 传值类型和引用类型

* **传值类型（基本类型）**
>  值为基本类型时候为深拷贝   
>> 基本类型就是null，undefined，Boolean，string，number 
>>> ==独立不干扰==
* **引用类型**
>  值为对象类型时候为浅拷贝   
>> 值都是对对象的引用，即一个指向对象的指针
>>> ==对副本的操作会影响父级对象==
>

```
// 传值类型
var  a = 1;
function voo(data)
{
    data = 2;
    console.log(data);   // 2
}
voo(a);
console.log(a);    // 1

// 引用类型
var  a = {
    name : "张三"
};
function voo(data)
{
    data.name = "李四";
    console.log(data);   //  Object {name: "李四"}
}
voo(a);
console.log(a);         //  Object {name: "李四"}

// 引用类型不会被基本类型覆盖
var  a = {
    name : "张三"
};
function voo(data)
{
    data = 3；
    console.log(data);   // 3
}
voo(a);
console.log(a);         //  Object {name: "张三"}

// 为了解决引用类型的问题  引入深拷贝的概念  参考上面一个概念

```
---------------------------------------

## 17. 函数作用域提升与预编译 
> 由于js没有其他强类型语言{}这类的块级作用域 只有函数作用域 函数的声明很随意导致各种问题出现
>> 变量预编译 > 函数预编译

```
// 第一条

a();
var a = c = function() {
    console.log(2)
};
a();

function a() {
    console.log(1)
};
a();
(function(b) {
    b(), c()
    var b = c = function a() {
        console.log(3)
    }
    b();
})(a);
c();

// 等价于：
var a;                      // 变量声明提升
function a() {              // 函数声明提升
    console.log(1)          
};
a();                        // 1
a = c = function() {
    console.log(2)
};
                      
a();                        // 2

(function(b) {
    var b
    b()                     // 2
    c()                     // 本来以error  
    // 后来有人指正 原因就在于var b=c=xxx。  
    // c相当于没有加var 不会预编译，这里c直接查找到外部作用域的c
    b = c = function a() {
        console.log(3)
    }
    b();                    // 3
})(a);

c();                        // 3


// 第二条
function fn(){
    function a(){console.log(1)}
    return a;
    function a(){console.log(2)}
}
fn()();                     //2 由于预编译 后面的a覆盖了前面的a

// 第三条
var a=10;
function fn(){
    // 预编译a 赋值undefined，内部作用域存在a这个变量，
    // 所以这里 !a 就是  !undefined，就是true，进入函数a=20;
    if (!a) {
        var a=20
    }
    console.log(a)          //  这里是20 ，
}
fn()

// 第四条
<script>
    console.log(typeof a)   //undefined
    var a='littlebear';
    console.log(a)          //littlebear 
</script>
<script>
    console.log(typeof a)   //string  第二个<script>标签里的a但会往上查找。
    var a=1;
    console.log(a)//1
</script>

// 第五条
<script>
    console.log(typeof a)   //undefined
    console.log(a)   
    // 报错，遇到<script>标签对时，会先对这一块进行预解析，
    // 下面没预解析，所以找不到声明过的a，于是报错了
</script>
<script>
    console.log(typeof a)   //undefined
    var a=1;
    console.log(a)          //1
</script>

// 第六条
<script>
    function fn(a,b){
        console.log(a)      //容易上当 初始化a的时候已经赋值'容易上当' 
        var a=10;
        console.log(a)      //10
    }
    fn('容易上当');
</script>

```
----------------------

## 18. AMD和CMD区别

* CMD 推崇依赖就近，AMD 推崇依赖前置。
> 
```
// CMD
define(function(require, exports, module) {   
    var a = require('./a')   
    a.doSomething()         // 此处略去 100 行   
    var b = require('./b')  // 依赖可以就近书写   
    b.doSomething()         // ... 
    
})
// AMD 默认推荐
define(['./a', './b'], function(a, b) {  
    // 依赖必须一开始就写好    
    a.doSomething()    // 此处略去 100 行    
    b.doSomething()    
})
```
* 对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。
> 不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不同）。CMD 推崇 as lazy as possible.
* AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。
> 比如 AMD 里，require 分全局 require 和局部 require，都叫 require。CMD 里，没有全局 require，而是根据模块系统的完备性，提供 seajs.use 来实现模块系统的加载启动。CMD 里，每个 API 都简单纯粹。

----------------------------

## 19. 常见服务器的状态码
1. ### 304 
> Not Modified
> 
> 客户端有缓冲的文档并发出了一个条件性的请求（一般是提供If-Modified-Since头表示客户只想比指定日期更新的文档）。服务器告诉客户，原来缓冲的文档还可以继续使用。
2. ### 400
> Bad Request
> 
> 表示该请求报文中存在语法错误，导致服务器无法理解该请求。
3. ### 403
> Forbidden
> 
> 该状态码表明对请求资源的访问被服务器拒绝了。
3. ### 500 
> Internal Server Error
> 
> 该状态码表明服务器端在执行请求时发生了错误。
4. 301 永久重定向
5. 302 临时重定向  会出现URL劫持  体现在搜索引擎收录策略上

---------------------------

## 20. 事件冒泡和事件捕获
* 事件冒泡兼容写法

```
if (event.cancelBubble) {
    event.cancelBubble = true
} else {
    event.stopPropagation()
}
```


--------------------------

## 21. 数组
* ### push  
> 向数组末尾添加指定元素

* ### pop
> 移除数组末尾的一个元素 并返回移除的元素

* ### shift
> 移除数组第一项并返回该项

* ### unshift
> 给数组第一项加上一个元素 返回数组长度

* ### join
> 数组按照指定的字符换转成字符串


* ### sort
> 数组按照ASCII排序  所以要完全按照从小到大的顺序排序的话需要指定参数 1 -1 0

* ### slice
> 在不修改目标数组的情况下返回截取的指定元素（ **起始位置，截止位置**）

>  从0开始 ==不包含最后一个数值==

* ### substr

> subdtr接收的是起始位置和==所要返回的字符串长度==

* ### substring

> 默认会将较小的参数作为第一个参数

  参数是正数的情况下 截取规则和slice一样 
  
  当参数为负数的情况下的表现形式不一样

1. slice将负数加上自身长度得到的数值作为参数
  
2. substring将负数当做0处理
  
3. substr仅仅将第一个参数与字符串长度相加后的数值作为第一个参数
```
let test = 'abcdef'
test.slice(0, -1)   // abcde
test.slice(2, -3)   => test.slice(2,3)  // c

test.substring(1, -2) => a
test.substring(2, -3) => ab
```

* ### splice

> 删除 ---------------------（**起始位置，截取个数**）

> 插入 ---------------------（**起始位置，截取个数为0，要插入的项**）

> 替换----------------------（**起始位置，截取个数为1，要插入的项**）

----

## 22.正则

* ()：小括号，叫做分组符。
* \s : 空格
* \S : 非空格
* \d : 数字
* \D : 非数字
* \w : 字符 ( 字母 ，数字，下划线_ )
* \W : 非字符
* .（点）——任意字符
* \. : 真正的点
* \b : 独立的部分 （ 起始，结束，空格 ）
* \B : 非独立的部分
* {n,m}：至少出现n次，最多m次
* {n,} :至少n次
* * :任意次 相当于{0,}
* ？ ：零次或一次 相当于{0,1}
* + ：一次或任意次相当于 {1,}
* {n}： 正好n次
* [] ： 表示某个集合中的任意一个 不能为空

---

> ### 字符串相关的正则方法

* ### match()

> 返回一个包含匹配内容的数组

```
var str = 'abcdef';

var re = /B/i;

str.match(re) // [b]
```

例子2：

```
url = https://dimg.fws.qa.nt.ctripcorp.com/images/2d090m000000062hy59E5.jpg"
url.match(/[^\/]*$/) // 2d090m000000062hy59E5.jpg
url.match(/^[^\/]*/) // https
```

* ### search()
 
> 返回匹配到的第一个内容所在的位置

```
var str = 'abcdef';

var re = /B/i;

str.search(re) // 1

```

* ### replace()
 
> 查找符合正则的字符串并替换成==一个==对应的字符串。返回替换后的内容。

```
var str = "我爱北京天安门，天安门上太阳升。";
var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
var str2 = str.replace(re,'*'); // 我爱**，*上太阳升。

```
并不能解决一个文字*的对应

```
var str = "我爱北京天安门，天安门上太阳升。";
var re = /北京|天安门/g;  //  找到北京 或者天安门 全局匹配
var str2 = str.replace(re,function(str){
            alert(str); 
            //用来测试：参数代表每次搜索到的符合正则的字符，
            //所以第一次str指的是北京 第二次str是天安门 第三次str是天安门
            var result = '';
            for(var i=0;i<str.length;i++){
                result += '*';
            }              
            return result; //所以搜索到了几个字就返回几个* 
        });
alert(str2) 
```

```
var str = '2013-6-7';
var re = /(\d+)(-)/g;

str = str.replace(re,function($0,$1,$2){
        // replace()中如果有子项，
        // 第一个参数 ：$0（匹配成功后的整体结果  2013-  6-）,
        // 第二个参数 : $1(匹配成功的第一个分组，这里指的是\d   2013, 6)
        // 第三个参数 : $2(匹配成功的第二个分组，这里指的是-    - - )   
    return $1 + '.';  //分别返回2013.   6.
});

alert( str );   //2013.6.7
//整个过程就是利用子项把2013- 6- 分别替换成了2013. 6.  最终弹出2013.6.7
```
---

###  正则两个方法

* ### test()

> 匹配到指定内容返回true

* ### ==exec()==

> 返回第一匹配项信息的数组  若没有返回null

> 有两个属性 index input

```
var text = 'mom and dad and baby'
var pattern = /mom( and dad( and baby)?)?/gi
var matches = pattern.exec(text)
mathes.index // 0
mathes.input // mom and dad and baby
mathes[0] // mom and dad and baby
mathes[1] //  and dad and baby
mathes[2] // and baby
```


## 23. 后退监听

> history.back() history.forward() history.replace()触发onpopstate事件

```
window.onpopstate = function () {
    alert('2222')
    history.pushState(null, null, document.URL)
    return false
}
history.pushState(null, null, document.URL)
```

onbeforeunload事件有坑 chrome51版本及以后不能自定义文字 并且 页面载入之后一定要有浏览器行为才能触发

## 24. base64图片及相关验证码

> data:image/gif;base64, (base64地址)

```
if (result == null || result.length == 0) return
result = $.parseJSON(result)
var id = result['id']
var imgUrl = result['base64Buffer']
$('#js-code').attr('src', 'data:image/gif;base64,' + imgUrl)

```  
 
 ## 26. from包裹的元素document事件失效 必须给from加事件
 
 ## 27. 进制转换
 
 > 十进制转十六进制 
 
 ```
 var s = 255
 s.toString(16) // ff
 ```
 
 > 十六进制转十进制
 
 ```
 parseInt('0xFF')   // 255
 ```
 
 ## 28. label绑定事件一定要让事件委托到触发里面的input 
 
 所以事件委托的时候直接监听input
 
 ## 29. 跨域post请求转为options类型
 
 ## 30. Math
 
 1. Math.floor 向下舍入；
 2. Math.ceil  向上舍入;
 3. Math.cos   余弦;
 4. Math.round 四舍五入;
 5. Math.sin   正弦；
 6. Math.tan   正切；
 
