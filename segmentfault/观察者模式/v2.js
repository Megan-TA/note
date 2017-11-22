// 完善版本
let Event = (function () {
    let list = {}
    let key
    let _val
    let publish
    let listener
    let key2
    
    listener = (key, fn) => {
        list[key] = list[key] || []
        list[key].push(fn)
    }

    publish = function () {
        key = arguments[0]
        key2 = arguments[1]
        _val = list[key]
        // 没有订阅类型 或者 没有订阅内容 空处理
        if (!_val || _val.length == 0) return
        _val.forEach((item) => {
            item(key2)
        })
    }

    remove = function (key, fn) {
        let fns = list[key]
        if (!fns) return
        if (!fn) {
            fns.length = 0
        } else {
            fns.forEach((item, index) => {
                if (item.name == fn.name) {
                    fns.splice(index, 1)
                }
            })
        }
    }

    return {
        listener: listener,
        publish: publish,
        remove: remove
    }
})()

Event.listener('click', function name(type) {
    console.log('event: ' + type + ' click')
})

Event.listener('click', function name2(type) {
    console.log('event: ' + type + ' click2')
})

Event.listener('hover', (type) => {
    console.log('event: ' + type + ' hover')
})

Event.publish('click', 'button')