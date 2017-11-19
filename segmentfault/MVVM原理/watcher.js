// 订阅者
function Watcher (vm, exp, cb) {
	this.vm = vm
	this.exp = exp
	this.cb = cb
	// 为了初始化时调用this.obj[exp]来触发obj中defineProperty里的get方法
	this.value = this.get()
}

Watcher.prototype = {
	// 收到来自Dep监听set变化 来触发更新
	update: function () {
		var newVal = this.vm[this.exp]
		var oldVal = this.value
		if (newVal == oldVal) return
		this.value = newVal
		this.cb.call(this.vm, newVal, oldVal)
		console.log('更新成功   ' +  oldVal + '更新为' + newVal)
	},
	get: function () {

		Dep.target = this
		// 通过数据劫持触发get方法 在Dep数组中存如当前watcher实例
		var oldVal = this.vm[this.exp]
		Dep.target = null
		return oldVal

	}
}