// 模板指定解析
function Compile (el, vm) {
	this.$vm = vm
	// 区分el传递过来的是元素类型还是名称
	this.$el = this.isElementNode(el) ? el : document.querySelector(el)

	if (this.$el) {
		// 转成文档碎片
		this.$fragment = this.node2Frament(this.$el)
		this.init()
		this.$el.appendChild(this.$fragment)
	}
}
Compile.prototype = {
	node2Frament: function (el) {
		var fragment = document.createDocumentFragment()
		var child
		while (child = el.firstChild) {
			fragment.appendChild(child)
		}
		return fragment
	},
	init: function () {
		this.compileElement(this.$fragment);
	},
	// 匹配元素上相关指令
	compileElement: function (el) {
		var childNodes = el.childNodes
		var that = this

		Array.prototype.slice.call(childNodes).forEach(function (node) {
			var text = node.textContent
			// 匹配内部文本是否是{{}}形式的表达式
			var reg = /\{\{(.*)\}\}/

			// 判断是元素就直接进行编译  
			// 文本的话就另做转换处理
			if (that.isElementNode(node)) {
				that.compile(node)
			} else if (that.isTextNode(node) && reg.test(text)) {
				// 处理{{}}形式
				that.compileText(node, RegExp.$1)
			}
			// 由于node.childNodes只匹配最外层元素
			// 如果当前最外层元素下面还有子元素则进行递归
			if (node.childNodes && node.childNodes.length) {
                that.compileElement(node);
            }
		})
	},
	// 匹配到相关指令进行解析 初始化值 添加监听
	compile: function (node) {
		var nodeAttrs = node.attributes
		var that = this
		Array.prototype.slice.call(nodeAttrs).forEach(function (item) {
			var attrName = item.name
			// 判断是否是v-*形式的指令
			if (that.isDirective(attrName)) {
				var exp = item.value

				// 截取v-*后面的* 例如 v-on:'clickBtn' => on:'clickBtn'
				var dir = attrName.substring(2)

				// 根据v-*的名字进行不同操作
				if (that.isEventDirective(dir)) {
					// 处理v-on
					compileUtil.eventHandler(node, that.$vm, exp, dir)
				} else {
					compileUtil[dir] && compileUtil[dir](node, that.$vm, exp)
				}
			}
		})
	},
	compileText: function (node, exp) {
		compileUtil.text(node, this.$vm, exp)
	},
	// 元素类型
	isElementNode: function (node) {
		return node.nodeType == 1
	},
	// 文本类型
	isTextNode: function (node) {
		return node.nodeType == 3
	},
	// 是否是v-开头的属性指令
	isDirective: function (attr) {
		return attr.indexOf('v-') == 0
	},
	// 是否是methods事件指令
	isEventDirective: function (dir) {
		return dir.indexOf('on') == 0
	}
}


var compileUtil = {
	bind: function (node, vm, exp, dir) {
		var updaterFn = updater[dir + 'Updater']

		updaterFn && updaterFn(node, this._getVMVal(vm, exp))
		// 给文档碎片的dom每次匹配到合适的值
		// 再创建一个监听者替换原有的实际dom
		new Watcher(vm, exp, function (value, oldValue) {
			updaterFn && updaterFn(node, value, oldValue)
		})
	},
	// 处理{{}}和v-text两种情况
	text: function (node, vm, exp) {
		this.bind(node, vm, exp, 'text')
	},

	html: function (node, vm, exp) {
		this.bind(node, vm, exp, 'html')
	},

	model: function (node, vm, exp) {
		this.bind(node, vm, exp, 'model')

		var that = this
		var val = this._getVMVal(vm, exp)
		node.addEventListener('input', function (e) {
			var newValue = e.target.value
			if (val === newValue) return 
			that._setVMVal(vm, exp, newValue)
			// val = newValue
		})
	},

	// 事件处理
	eventHandler: function (node, vm, exp, dir) {
		// exp => 'clickBtn'
		// dir => on:click="clickBtn"
		var eventType = dir.split(':')[1]
		var fn = vm.$options.methods && vm.$options.methods[exp]
		if (eventType && fn) {
			node.addEventListener(eventType, fn.bind(vm), false)
		}
	},
	// 获取指令绑定的数值 
	_getVMVal: function (vm, exp) {
		// 有可能当前是一个对象 包含子对象
		dirValArr = exp.split('.')
		dirValArr.forEach(function (item) {
			vm = vm[item]
		})
		return vm
	},
	_setVMVal: function (vm, exp, newValue) {
		var expArr = exp.split('.')
		expArr.forEach(function (k, i) {
			vm[k]= newValue
		})
	}
}

var updater = {
	textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
	},
	htmlUpdater: function (node, value) {
		node.innerHTML = typeof value == 'undefined' ? '' : value
	},
	modelUpdater: function (node, value, oldValue) {
		node.value = typeof value == 'undefined'? '' : value
	}
}