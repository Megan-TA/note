// setTimeout将放入队列之后执行也就是主函数方法都执行完成之后
// 引入state为了解决第一次异步操作成功之后会执行resolve方法
// callbacks的回调函数会优先被执行 这样再then触发callbacks函数
// 的时候
function MyPromise(fn) {
    var value = null,
        callbacks = []

    this.then = function (onFulfilled) {
        callbacks.push(onFulfilled)
        return this
    }

    function resolve(newValue) {
        value = newValue
        setTimeout(function() {
            callbacks.forEach(function (callback) {
                callback(value);
            })
        }, 0)
    }

    fn(resolve)
}

let test = new MyPromise((resolve, reject) => {
    let a = '111'
    resolve(a)
}).then(() => {
   console.log('success')
})