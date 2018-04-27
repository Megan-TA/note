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
        * This is a dummy function to check if the function name has been altered by minification.
        * If the function has been minified and NODE_ENV !== 'production', warn the user.
        */
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
            * Adds a change listener. It will be called any time an action is dispatched,
            * and some part of the state tree may potentially have changed. You may then
            * call `getState()` to read the current state tree inside the callback.
            *
            * You may call `dispatch()` from a change listener, with the following
            * caveats:
            *
            * 1. The subscriptions are snapshotted just before every `dispatch()` call.
            * If you subscribe or unsubscribe while the listeners are being invoked, this
            * will not have any effect on the `dispatch()` that is currently in progress.
            * However, the next `dispatch()` call, whether nested or not, will use a more
            * recent snapshot of the subscription list.
            *
            * 2. The listener should not expect to see all state changes, as the state
            * might have been updated multiple times during a nested `dispatch()` before
            * the listener is called. It is, however, guaranteed that all subscribers
            * registered before the `dispatch()` started will be called with the latest
            * state by the time it exits.
            *
            * @param {Function} listener A callback to be invoked on every dispatch.
            * @returns {Function} A function to remove this change listener.
            */

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
            * Interoperability point for observable/reactive libraries.
            * @returns {observable} A minimal observable of state changes.
            * For more information, see the observable proposal:
            * https://github.com/tc39/proposal-observable
            */
            /**
            * 貌似一个类似观察者的方法，调用subscribe的api
            *
            *
            */
            function observable() {
                const outerSubscribe = subscribe
                return {
                    /**
                    * The minimal observable subscription method.
                    * @param {Object} observer Any object that can be used as an observer.
                    * The observer object should have a `next` method.
                    * @returns {subscription} An object with an `unsubscribe` method that can
                    * be used to unsubscribe the observable from the store, and prevent further
                    * emission of values from the observable.
                    */
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
> ## compose.js

    工具方法 供 applyMiddleware中使用  
    实现方式用的数组reduce方法实现一个柯里化函数

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

    ```
        import compose from './compose'

        /**
        * Creates a store enhancer that applies middleware to the dispatch method
        * of the Redux store. This is handy for a variety of tasks, such as expressing
        * asynchronous actions in a concise manner, or logging every action payload.
        *
        * See `redux-thunk` package as an example of the Redux middleware.
        *
        * Because middleware is potentially asynchronous, this should be the first
        * store enhancer in the composition chain.
        *
        * Note that each middleware will be given the `dispatch` and `getState` functions
        * as named arguments.
        *
        * @param {...Function} middlewares The middleware chain to be applied.
        * @returns {Function} A store enhancer applying the middleware.
        */
        export default function applyMiddleware(...middlewares) {
            return createStore => (...args) => {
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
                const chain = middlewares.map(middleware => middleware(middlewareAPI))
                dispatch = compose(...chain)(store.dispatch)

                return {
                    ...store,
                    dispatch
                }
            }
        }

    ```
