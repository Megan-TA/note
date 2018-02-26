因为js是单线程 一定也是按照单线程去设计 一切自称多线程都是子线程服从主线程 且不允许操作DOM

js执行栈中只有一个事件循环 可以有多个任务队列

在js执行栈中 又分为同步任务和异步任务

1. 在执行js代码时，同步任务会立刻放在主线程队列，异步任务会放在主线程之外的Event Table并注册函数；

2. 当指定事情完成时，Event table会将注册的函数移入Event Queue；

3. 主线程的任务全部完成后 会再去Event Queue读取对应的异步函数，进入主线程执行；

4. 不断重复这个过程，直到主线程和Event Queue的任务全部完成；

注意：

    如何直到主线程执行栈为空？其实在JS引擎中存在monitoring process进程，类似轮询的方式不断检查主线程是否为空，一旦为空就会去Event Queue检查是否有等待被条用的函数。


### 大概流程图如下

![执行机制](https://user-gold-cdn.xitu.io/2017/11/21/15fdd88994142347?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如果我们对任务更精细的划分，不再是同步任务和异步任务，而是分为  宏任务队列和微任务队列

1. 宏任务 macrotask

    主要包含如下： setTimeout、setInterval、setImmediate、I/O、UI交互事件

2. 微任务 microtask

    主要包含如下： Promise.then、process.nextTick、MutaionObserver

    其中 微任务优先级 process.nextTick > Promise.then
         宏任务优先级 setTimeout > setImmediate

解释如下：

    主任务遇到类似宏任务的时候会将其回调函数注册分发到Event Queue

    遇到微任务会放在本次主流程循环过程结束后先执行

    不断重复

## 流程图如下

![事件循环，宏任务，微任务流程图](https://user-gold-cdn.xitu.io/2017/11/21/15fdcea13361a1ec?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

---

> 根据阮一峰老师的文章 更详细的一次事件循环分为6个阶段，执行过程如下：

    1. timers
    2. I/O callbacks
    3. idle, prepare
    4. poll
    5. check
    6. close callbacks

各个阶段执行的任务描述如下

    （1）timers

    这个是定时器阶段，处理setTimeout()和setInterval()的回调函数。进入这个阶段后，主线程会检查一下当前时间，是否满足定时器的条件。如果满足就执行回调函数，否则就离开这个阶段。

    （2）I/O callbacks

    除了以下操作的回调函数，其他的回调函数都在这个阶段执行。

    setTimeout()和setInterval()的回调函数
    setImmediate()的回调函数
    用于关闭请求的回调函数，比如socket.on('close', ...)

    （3）idle, prepare

    该阶段只供 libuv 内部调用，这里可以忽略。

    （4）Poll

    这个阶段是轮询时间，用于等待还未返回的 I/O 事件，比如服务器的回应、用户移动鼠标等等。

    这个阶段的时间会比较长。如果没有其他异步任务要处理（比如到期的定时器），会一直停留在这个阶段，等待 I/O 请求返回结果。

    （5）check

    该阶段执行setImmediate()的回调函数。

    （6）close callbacks

    该阶段执行关闭请求的回调函数，比如socket.on('close', ...)。

更详细内容可以参考 [阮一峰老师的NODE定时器详解](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651553714&idx=1&sn=d2b76003edbd620ad25d5581b1546652&chksm=8025a873b752216597702cad547240e01a9ad7b1d8cf084684eeb5355ff124bbb8ecaf1e400e&mpshare=1&scene=1&srcid=0226lvpHCgznwupG1SYb2pxb#rd)

---

### （TIPS 人们常说的js定时器不准确是为什么呢？）

如果主流程上的任务执行时间很长 会造成定时器到时间后没法去执行注册的函数 只能等待主线程上的任务执

行完毕 所以就造成js定时器不准确的由来

### （TIPS promise队列和setTimeout队列有什么区别？）

1. promise队列属于微任务队列，setTimeout队列属于宏任务队列;
2. promise实例化时候是同步任务 then任务优先于setTimeout的异步任务；

### 上一段代码测试下

```
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

```

答案是多少呢？不妨思考下并在chrome上测试下哦

---

## 参考资料：
1. [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89#heading-3)

2. [Event Loop的规范和实现](https://zhuanlan.zhihu.com/p/33087629)

3. [Promise的队列与setTimeout的队列有何关联？](https://www.zhihu.com/question/36972010)

4. [阮一峰老师的NODE定时器详解](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651553714&idx=1&sn=d2b76003edbd620ad25d5581b1546652&chksm=8025a873b752216597702cad547240e01a9ad7b1d8cf084684eeb5355ff124bbb8ecaf1e400e&mpshare=1&scene=1&srcid=0226lvpHCgznwupG1SYb2pxb#rd)