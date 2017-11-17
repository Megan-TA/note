function MVVM (options) {
	// 暴露一些公用方法 用来区分用户/系统属性 用$区分
	var that = this
	this.$options = options
	this.$data = this.$options.data
	this.$exp = this.$options.exp
	this.$el = this.$options.el
	this.$el.innerHTML = this.$data[this.$exp]
	Object.keys(this.$data).forEach(function (key){
		that._proxy(key)
	})
	observer(this.$data)
	new Watcher(this.$data, this.$exp, function (value) {
		options.el.innerHTML = value
	})
}

MVVM.prototype = {
	// 属性代理 实现vm.age访问相当于vm.$data.age
	// 默认实例修改数值需要通过vm.$data方式
	_proxy: function (key) {
		var that = this
		Object.defineProperty(this, key, {
			configurable: false,
			enumerable: true,
			get: function () {
				return that.$data[key]
			},
			set: function (newVal) {
				that.$data[key] = newVal
			}
		})
	}
}