## react-relite

一个短小精悍的操作更简便的类似redux库

简化reduer和actions为一步只需要actions，利用ES6自带的async/await处理异步actions

源码结构非常简洁，一个src目录下四个文件

> utils.js

isFn 判断当前参数是否是一个函数，主要用来判断acitons的值必须是一个纯函数

isThenable 判断是不是Promise，处理异步actions

isObj 判断是否是对象

> createStore.js

核心文件，接受两个参数，一个自定义actions，一个初始state

初始化store时，利用数组reduce方法，遍历传入的actions对象传入一个空对象bindingActions，形成key对应actions的name，value对应当前actions的function。最后绑定此bindingActions对象到store的actions属性中。

在jsx中通过事件绑定的方式绑定acitons的函数，每次通过事件点击等触发actions函数的时候，触发store的actions中的dispath方法（闭包返回store的dispath），在dispath中会有一个标记符号判断当前是否有dispath行为正在触发，没有的话继续下一步。执行对应actions的回调函数返回最新的state。之后对输出的最新的state进行判断是否还有返回的回调函数，若有继续执行返回的函数直至最终输出一个纯对象。如果最新的state是一个promise，挂起等待异步执行完成返回最终state。最后调用replaceState方法，合并返回的最新state与原始的state，最终再触发一次publish方法，依次执行通过subscribe方法订阅的数组中的回调函数，这里一般可以完成打印acitons logger和最终的render重新触发ui渲染。


> 使用规则

将渲染UI的逻辑封装成函数render，通过createStotre(actions. initState)创建一个store变量，通过store的subscribe方法调用render，以便数据发生更新可以重新触发UI层渲染。

参考作者给出的demo:

```
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, createLogger } from 'relite'
import * as actions from './actions'
import Counter from './Counter'

const initialState = {
	count: 0,
	input: '1',
}

const store = createStore(actions, initialState)
const logger = createLogger({
	name: 'counter'
})

store.subscribe(logger)
store.subscribe(render)

render()

function render() {
	ReactDOM.render(
		<Counter {...store.getState()} {...store.actions} />,
		document.getElementById('container')
	)
}
```


> 参考资料：

1. [npm relite](https://github.com/Lucifier129/relite)