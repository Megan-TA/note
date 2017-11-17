// 订阅中心
function Dep () {
	this.subs = []
}

Dep.prototype = {
	addSubs: function (data) {
		this.subs.push(data)
	},
	notify: function () {
		this.subs.forEach(function (item) {
			item.update()
		})
	}
}