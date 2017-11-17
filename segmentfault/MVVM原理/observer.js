function observer (data) {
	if (!data || typeof data != 'object') return
	Object.keys(data).forEach(function (key) {
		defineReactive(data, key, data[key])
	})
}

// 数据劫持
function defineReactive (obj, key, val) {
	observer(val)
	var dep = new Dep()
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: false,
		get: function () {
			// Dep.target存放每一个Watcher的实例 这样就能知道当前订阅者具体是谁
			Dep.target && dep.addSubs(Dep.target)
			console.info('值为' + val)
			return val
		},
		set: function (newVal) {
			if (newVal == val) return
			console.info('监听到值发生变化  ' + val + '=>' + newVal)
			val = newVal
			dep.notify()
		}
	})
}