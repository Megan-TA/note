## promise实现

1. v1

做了简单的promise封装 

不过在实例化promise对象时候resolve方法应该是一个异步请求

```
//例1
function getUserId() {
    return new Promise(function(resolve) {
        //异步请求
        http.get(url, function(results) {
            resolve(results.id)
        })
    })
}
 
getUserId().then(function(id) {
    //一些处理
})
```
如果此时是一个同步请求 像这样

```
// 例2
function getUserId() {
    return new Promise(function (resolve) {
        resolve(9876);
    });
}
getUserId().then(function (id) {
    // 一些处理
});
```
显然不符合我们预期 我们希望所有then方法执行完之后也就是callbacks塞满回调函数之后再处理resolve 此时怎么处理呢？加入setTimeout

```
function resolve(value) {
    setTimeout(function() {
        callbacks.forEach(function (callback) {
            callback(value);
        });
    }, 0)
}
```
此时看上去符合我们预期 不过仔细一想 如果Promise异步操作已经成功，这时，在异步操作成功之前注册的回调都会执行，但是在Promise异步操作成功这之后调用的then注册的回调就再也不会执行了，这显然不是我们想要的。


2. v2

加入状态



参考资料：
[八段代码彻底掌握Promise](http://blog.csdn.net/crystal6918/article/details/76423193)
[前端大全-promise原理](http://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651552235&idx=1&sn=1aa59348e2fdf6c701fdb06c0cd6ca78&chksm=8025ae2ab752273ce92b8b4a6b6a7eda0cbacc071b2f54d4099196fa5889109b9547f4840b04&mpshare=1&scene=1&srcid=11223EnbItAsc7zeFQYMBweu#rd)