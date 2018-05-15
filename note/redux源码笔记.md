## Redux源码解读
---

参考官方地址：[redux](https://github.com/reactjs/redux/tree/master/src)

官网src目录结构如下:

    ```
        ├── utils/
        │     ├── warning.js 
        |     ├── actionTypes.js
        |     ├── isPlainObject.js
        ├── applyMiddleware.js
        ├── bindActionCreators.js
        ├── combineReducers.js
        ├── compose.js
        ├── createStore.js
        ├── index.js # 入口文件

    ```
---
> ## utils

- actionTypes.js

    ```
    /**
    * These are private action types reserved by Redux.
    * For any unknown actions, you must return the current state.
    * If the current state is undefined, you must return the initial state.
    * Do not reference these action types directly in your code.
    */
    const ActionTypes = {
        INIT:
            '@@redux/INIT' +
                Math.random()
                .toString(36)
                .substring(7)
                .split('')
                .join('.'),
        REPLACE:
            '@@redux/REPLACE' +
                Math.random()
                .toString(36)
                .substring(7)
                .split('')
                .join('.')
    }

    export default ActionTypes

    ```
    补充说明

    36进制 =>   0-9  A-F  10-35

    生成形如  1.d.e.m.5.a 类型的初始值

    REPLACE 的type是 为了给 后续动态替换reducer时使用的dispath名称

- warning.js

    ```
        /**
        * Prints a warning in the console if it exists.
        *
        * @param {String} message The warning message.
        * @returns {void}
        */
        export default function warning(message) {
            /* eslint-disable no-console */
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
                console.error(message)
            }
            /* eslint-enable no-console */
            try {
                // This error was thrown as a convenience so that if you enable
                // "break on all exceptions" in your console,
                // it would pause the execution at this line.
                throw new Error(message)
            } catch (e) {} // eslint-disable-line no-empty
        }
    ```

    在支持console的环境下 直接用console.error抛出错误，不支持的环境下newError抛出

- isPlainObject

    ``` 
        /**
        * @param {any} obj The object to inspect.
        * @returns {boolean} True if the argument appears to be a plain object.
        */
        export default function isPlainObject(obj) {
            if (typeof obj !== 'object' || obj === null) return false

            let proto = obj
            while (Object.getPrototypeOf(proto) !== null) {
                proto = Object.getPrototypeOf(proto)
            }

            return Object.getPrototypeOf(obj) === proto
        }
    ```
    判断是否是一级对象

---
>  ## index.js

    redux的入口文件，

    ```
        import createStore from './createStore'
        import combineReducers from './combineReducers'
        import bindActionCreators from './bindActionCreators'
        import applyMiddleware from './applyMiddleware'
        import compose from './compose'
        import warning from './utils/warning'
        import __DO_NOT_USE__ActionTypes from './utils/actionTypes'
        /*
        *   创建一个name为`isCrushed`的函数来检查那么被压缩过后的重复的函数名字，如果这个函数在非生产环境被修改则抛出警告提示
        */
        function isCrushed() {}

        if (
            process.env.NODE_ENV !== 'production' &&
            typeof isCrushed.name === 'string' &&
            isCrushed.name !== 'isCrushed'
        ) {
        warning(
            'You are currently using minified code outside of NODE_ENV === "production". ' +
            'This means that you are running a slower development build of Redux. ' +
            'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
            'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' +
            'to ensure you have the correct code for your production build.'
        )
        }

        export {
            createStore,
            combineReducers,
            bindActionCreators,
            applyMiddleware,
            compose,
            __DO_NOT_USE__ActionTypes
        }

    ```
    先使用es6的import语法导入各个模块 发现__DO_NOT_USE__ActionTypes这个貌似没有，不知是否是官方迭代时候没有去掉。返回各个模块的引用。
---
> ## createStore.js

    ```
        import ActionTypes from './utils/actionTypes'
        import isPlainObject from './utils/isPlainObject'

        /**
        *
        * @param {Function} [reducer] 
        * reducer必须是返回下一步state的函数
        * 
        * @param {any} [preloadedState] 
        * preloadState是可以自定义传入的state初始值，如果
        * reducer是用 `combineReducers`合并之后的函数，preloadedState必须要拥有与合并reducer相
        * 同的key值
        *
        * @param {Function} [enhancer] 
        * enhancer 用来利用第三方插件通过`applyMiddleware`方法来增强store
        *
        * @returns {Store} A Redux store that lets you read the state, dispatch actions
        * and subscribe to changes.
        */
        export default function createStore(reducer, preloadedState, enhancer) {
            /* 
            * 如果第三个参数省略切第二个参数为函数 则认为是应用了中间件增强state
            * 例如： 
            * createStore(reducer, applyMiddleware(
            *    logger
            * ))  
            * 此处应用就是常说的 多态
            *
            */
            if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
                enhancer = preloadedState
                preloadedState = undefined
            }

            if (typeof enhancer !== 'undefined') {
                // 第三个参数中间件必须是函数
                if (typeof enhancer !== 'function') {
                    throw new Error('Expected the enhancer to be a function.')
                }
                // 返回中间件闭包的调用
                // 详细见applyMiddle一层
                return enhancer(createStore)(reducer, preloadedState)
            }
            // reducer必须为函数
            if (typeof reducer !== 'function') {
                throw new Error('Expected the reducer to be a function.')
            }

            let currentReducer = reducer
            let currentState = preloadedState
            let currentListeners = []
            let nextListeners = currentListeners
            let isDispatching = false

            /**
            *   订阅发布模式 依次处理各种回调函数
            *
            */
            function ensureCanMutateNextListeners() {
                if (nextListeners === currentListeners) {
                    nextListeners = currentListeners.slice()
                }
            }

            /**
            * 返回一个getState的闭包 获得当前state的值 如果正处在dispath过程返回一个警告
            *
            * @returns {any}
            */
            function getState() {
                if (isDispatching) {
                    throw new Error(
                        'You may not call store.getState() while the reducer is executing. ' +
                        'The reducer has already received the state as an argument. ' +
                        'Pass it down from the top reducer instead of reading it from the store.'
                    )
                }

                return currentState
            }
            /**
            *  返回一个subscribe的闭包
            *  订阅一个事件
            *
            */
            function subscribe(listener) {
                if (typeof listener !== 'function') {
                    throw new Error('Expected the listener to be a function.')
                }

                if (isDispatching) {
                    throw new Error(
                        'You may not call store.subscribe() while the reducer is executing. ' +
                        'If you would like to be notified after the store has been updated, subscribe from a ' +
                        'component and invoke store.getState() in the callback to access the latest state. ' +
                        'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
                    )
                }

                let isSubscribed = true

                ensureCanMutateNextListeners()
                nextListeners.push(listener)
                
                // 内部返回一个取消当前订阅事件的闭包
                return function unsubscribe() {
                    if (!isSubscribed) {
                        return
                    }

                    if (isDispatching) {
                        throw new Error(
                        'You may not unsubscribe from a store listener while the reducer is executing. ' +
                            'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
                        )
                    }

                    isSubscribed = false

                    ensureCanMutateNextListeners()
                    const index = nextListeners.indexOf(listener)
                    nextListeners.splice(index, 1)
                }
            }

            // 改变state唯一的行为方法
            function dispatch(action) {
                if (!isPlainObject(action)) {
                    throw new Error(
                        'Actions must be plain objects. ' +
                        'Use custom middleware for async actions.'
                    )
                }

                if (typeof action.type === 'undefined') {
                    throw new Error(
                        'Actions may not have an undefined "type" property. ' +
                        'Have you misspelled a constant?'
                    )
                }

                if (isDispatching) {
                    throw new Error('Reducers may not dispatch actions.')
                }

                try {
                    isDispatching = true
                    currentState = currentReducer(currentState, action)
                } finally {
                    isDispatching = false
                }
                // 重新建立一个变量依次执行订阅的事件回调
                const listeners = (currentListeners = nextListeners)
                for (let i = 0; i < listeners.length; i++) {
                    const listener = listeners[i]
                    listener()
                }

                return action
            }

            // 动态替换reducer
            function replaceReducer(nextReducer) {
                if (typeof nextReducer !== 'function') {
                    throw new Error('Expected the nextReducer to be a function.')
                }

                currentReducer = nextReducer
                dispatch({ type: ActionTypes.REPLACE })
            }

            /**
            * 貌似一个类似观察者的方法，调用subscribe的api
            * 内部并未看到哪里使用，猜测可能是用外部流行的订阅库代替现在的订阅方法
            *
            */
            function observable() {
                const outerSubscribe = subscribe
                return {
                    subscribe(observer) {
                        if (typeof observer !== 'object' || observer === null) {
                            throw new TypeError('Expected the observer to be an object.')
                        }

                        function observeState() {
                            if (observer.next) {
                                observer.next(getState())
                            }
                        }

                        observeState()
                        const unsubscribe = outerSubscribe(observeState)
                        return { 
                            unsubscribe 
                        }
                    },

                    [$$observable]() {
                        return this
                    }
                }
            }

            // When a store is created, an "INIT" action is dispatched so that every
            // reducer returns their initial state. This effectively populates
            // the initial state tree.
            dispatch({ type: ActionTypes.INIT })

            return {
                dispatch,
                subscribe,
                getState,
                replaceReducer,
                [$$observable]: observable
            }
        }
    ```
---
> ## combineReducers.js

    将拆分的reducer合并为一个大reducer

    ```
        import ActionTypes from './utils/actionTypes'
        import warning from './utils/warning'
        import isPlainObject from './utils/isPlainObject'

        // action中无state的报错函数
        function getUndefinedStateErrorMessage(key, action) {
            const actionType = action && action.type
            const actionDescription =
                (actionType && `action "${String(actionType)}"`) || 'an action'

            return (
                `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
                `To ignore an action, you must explicitly return the previous state. ` +
                `If you want this reducer to hold no value, you can return null instead of undefined.`
            )
        }
        // 遍历查找reducer函数是否他有有一些不合法的地方
        function getUnexpectedStateShapeWarningMessage(
            inputState,
            reducers,
            action,
            unexpectedKeyCache
        ) {
            const reducerKeys = Object.keys(reducers)
            const argumentName =
                action && action.type === ActionTypes.INIT
                ? 'preloadedState argument passed to createStore'
                : 'previous state received by the reducer'

            if (reducerKeys.length === 0) {
                return (
                    'Store does not have a valid reducer. Make sure the argument passed ' +
                    'to combineReducers is an object whose values are reducers.'
                )
            }

            if (!isPlainObject(inputState)) {
                return (
                    `The ${argumentName} has unexpected type of "` +
                    {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
                    `". Expected argument to be an object with the following ` +
                    `keys: "${reducerKeys.join('", "')}"`
                )
            }

            const unexpectedKeys = Object.keys(inputState).filter(
                key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key]
            )

            unexpectedKeys.forEach(key => {
                unexpectedKeyCache[key] = true
            })

            if (action && action.type === ActionTypes.REPLACE) return

            if (unexpectedKeys.length > 0) {
                return (
                `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
                `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
                `Expected to find one of the known reducer keys instead: ` +
                `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
                )
            }
        }

        function assertReducerShape(reducers) {
            Object.keys(reducers).forEach(key => {
                const reducer = reducers[key]
                const initialState = reducer(undefined, { type: ActionTypes.INIT })

                if (typeof initialState === 'undefined') {
                    throw new Error(
                        `Reducer "${key}" returned undefined during initialization. ` +
                        `If the state passed to the reducer is undefined, you must ` +
                        `explicitly return the initial state. The initial state may ` +
                        `not be undefined. If you don't want to set a value for this reducer, ` +
                        `you can use null instead of undefined.`
                    )
                }

                const type =
                    '@@redux/PROBE_UNKNOWN_ACTION_' +
                        Math.random()
                        .toString(36)
                        .substring(7)
                        .split('')
                        .join('.')
                if (typeof reducer(undefined, { type }) === 'undefined') {
                    throw new Error(
                        `Reducer "${key}" returned undefined when probed with a random type. ` +
                        `Don't try to handle ${
                            ActionTypes.INIT
                        } or other actions in "redux/*" ` +
                        `namespace. They are considered private. Instead, you must return the ` +
                        `current state for any unknown actions, unless it is undefined, ` +
                        `in which case you must return the initial state, regardless of the ` +
                        `action type. The initial state may not be undefined, but can be null.`
                    )
                }
            })
        }

        /**
        * Turns an object whose values are different reducer functions, into a single
        * reducer function. It will call every child reducer, and gather their results
        * into a single state object, whose keys correspond to the keys of the passed
        * reducer functions.
        *
        * @param {Object} reducers An object whose values correspond to different
        * reducer functions that need to be combined into one. One handy way to obtain
        * it is to use ES6 `import * as reducers` syntax. The reducers may never return
        * undefined for any action. Instead, they should return their initial state
        * if the state passed to them was undefined, and the current state for any
        * unrecognized action.
        *
        * @returns {Function} A reducer function that invokes every reducer inside the
        * passed object, and builds a state object with the same shape.
        */
        export default function combineReducers(reducers) {
            const reducerKeys = Object.keys(reducers)
            const finalReducers = {}
            // 遍历检测reduer的key值是否存在 并将为函数类型的reducer缓存
            for (let i = 0; i < reducerKeys.length; i++) {
                const key = reducerKeys[i]

                if (process.env.NODE_ENV !== 'production') {
                    if (typeof reducers[key] === 'undefined') {
                        warning(`No reducer provided for key "${key}"`)
                    }
                }

                if (typeof reducers[key] === 'function') {
                    finalReducers[key] = reducers[key]
                }
            }
            const finalReducerKeys = Object.keys(finalReducers)

            let unexpectedKeyCache
            if (process.env.NODE_ENV !== 'production') {
                unexpectedKeyCache = {}
            }

            let shapeAssertionError
            try {
                assertReducerShape(finalReducers)
            } catch (e) {
                shapeAssertionError = e
            }

            return function combination(state = {}, action) {
                if (shapeAssertionError) {
                    throw shapeAssertionError
                }

                if (process.env.NODE_ENV !== 'production') {
                    const warningMessage = getUnexpectedStateShapeWarningMessage(
                        state,
                        finalReducers,
                        action,
                        unexpectedKeyCache
                    )
                    if (warningMessage) {
                        warning(warningMessage)
                    }
                }

                let hasChanged = false
                const nextState = {}
                // 更新下初始的state为新state
                for (let i = 0; i < finalReducerKeys.length; i++) {
                    const key = finalReducerKeys[i]
                    const reducer = finalReducers[key]
                    const previousStateForKey = state[key]
                    const nextStateForKey = reducer(previousStateForKey, action)
                    if (typeof nextStateForKey === 'undefined') {
                        const errorMessage = getUndefinedStateErrorMessage(key, action)
                        throw new Error(errorMessage)
                    }
                    nextState[key] = nextStateForKey
                    hasChanged = hasChanged || nextStateForKey !== previousStateForKey
                }
                return hasChanged ? nextState : state
            }
        }
    ```


---
> ## compose.js

工具方法 供 applyMiddleware中使用  

实现方式用的数组reduce方法实现一个`自右向左`的执行流，还有另外一个名字`函数饲养`，即两个以上函数通过组合输出一个新函数。

    ```
        /**
        * 将多个函数合并成一个函数，嵌套从右向左执行
        * compose(f, g, h) => f(g(h())) 
        * 执行顺序 h() => g() => f()
        */

        export default function compose(...funcs) {
            if (funcs.length === 0) {
                return arg => arg
            }

            if (funcs.length === 1) {
                return funcs[0]
            }

            return funcs.reduce((a, b) => (...args) => a(b(...args)))
        }
    ```
---
> ## applyMiddleware.js

    要了解中间件这一层概念，前提需要知道在哪里调用中间件方法以及中间件一般长什么样，最后还要熟悉洋葱模型

    先看下代码：
    
    ```
        function f1(next) {
            return function() {
                console.log('f1 start')
                next()
                console.log('f1 end')
            }
        }
        function f2(next) {
            return function() {
                console.log('f2 start')
                next()
                console.log('f2 end')
            }
        }
        function f3(next) {
            return function() {
                console.log('f3 start')
                next()
                console.log('f3 end')
            }
        }
        function f() {
            console.log('heart')
        }

        f1(f2(f3(f)))()

        /**
        * 输出：
        * f1 start
        * f2 start
        * f3 start
        * heart
        * f3 end
        * f2 end
        * f1 end
        */

    ```

    盗图，放两张nodejs框架koa的洋葱模式图加深理解

![koa洋葱圈模型](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)
![中间件执行顺序](https://raw.githubusercontent.com/koajs/koa/a7b6ed0529a58112bac4171e4729b8760a34ab8b/docs/middleware.gif)

    一般中间件写法遵循的写法如下：

    ```
        function middleware1(store) {
            return function(next) {
                return function(action) {
                    console.log('middleware1 开始')
                    next(action)
                    console.log('middleware1 结束')
                }
            }
        }
        function middleware2(store) {
            return function(next) {
                return function(action) {
                    console.log('middleware2 开始')
                    next(action)
                    console.log('middleware2 结束')
                }
            }
        }
        function middleware3(store) {
            return function(next) {
                return function(action) {
                    console.log('middleware3 开始')
                    next(action)
                    console.log('middleware3 结束')
                }
            }
        }
    ```

    好 我们再初始化redux的时候调用中间件，如下：

    ```
        // 初始化创建store的方法
        let store = createStore(
            combineReducers,
            applyMiddleware(
                middleware1,
                middleware2,
                middleware3
            )
        )
    ```

    前提条件都准备好了， 来 我们再看下中间件源码实现：

    ```
        import compose from './compose'

        export default function applyMiddleware(...middlewares) {
            /**
            *   一开始返回createStore没看懂 回头看了下调用方式才发现由于applyMiddeleware包裹
            *   在createStore函数中，createStore看成是一个内部的全局变量，可以直接将
            *   createStore作为参数传递 ...args就是
            *   createStore的三个参数 reducers、preloadState、enchare
            *   可能有人会疑惑，感受下下面代码：
            *   a = (x,y) => { console.log(x) }
            *   b = () => a => (...args) => { let store = a(args);  console.log(store)}
            *   a('测试',b()) =>  '测试'
            *
            */
            return createStore => (...args) => {
                // 此处都是调用的createStore方法 返回一个store的闭包
                const store = createStore(...args)
                let dispatch = () => {
                    throw new Error(
                        `Dispatching while constructing your middleware is not allowed. ` +
                        `Other middleware would not be applied to this dispatch.`
                    )
                }

                const middlewareAPI = {
                    getState: store.getState,
                    dispatch: (...args) => dispatch(...args)
                }
                /**
                * 依次执行中间件函数 返回第一层闭包的chain新数组
                * 即 [
                        function (next) {
                            return function(action) {
                                console.log('middleware1 开始')
                                next(action)
                                console.log('middleware1 结束')
                            }
                        },
                        function (next) {
                            return function(action) {
                                console.log('middleware2 开始')
                                next(action)
                                console.log('middleware2 结束')
                            }
                        },
                        function (next) {
                            return function(action) {
                                console.log('middleware3 开始')
                                next(action)
                                console.log('middleware3 结束')
                            }
                        }
                    ]
                *
                *
                */
                const chain = middlewares.map(middleware => middleware(middlewareAPI))
                /**
                * 结合compose源码分析，compose(a,b,c,d)('测试') => a(b(c(d())))('测试')
                * 执行顺序是 d => c => b => a 但都是一次返回funciton 并没有执行内在逻辑
                * 最后到a函数的时候才会开始执行，依次输出
                * middleware1 开始
                * middleware2 开始
                * middleware3 开始
                * middleware3 结束
                * middleware2 结束
                * middleware1 结束
                */
                dispatch = compose(...chain)(store.dispatch)

                return {
                    ...store,
                    dispatch
                }
            }
        }

    ```


    ```



> ## 参考资料
1. [egg企业级框架](http://eggjs.org/zh-cn/intro/egg-and-koa.html)
2. [Redux, Redux thunk 和 React Redux 源码阅读](https://www.lingchenxuan.com/2017/07/04/Redux,-Redux-thunk-%E5%92%8C-React-Redux-%E6%BA%90%E7%A0%81%E9%98%85%E8%AF%BB/)