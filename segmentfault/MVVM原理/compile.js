// 模板指定解析
function Compile (el, vm) {
	this.$vm = vm
	this.$el = this.isElementNode(el) ? el : document.querySelector(el)

	if (this.$el) {
		// 转成文档碎片
		this.$fragment = this.node2Frament(this.$el)
		this.init()
		this.$el.appendChild(this.$frament)
	}
}
Compile.prototype = {
	node2Frament: function (el) {
		var frament = document.createDocumentFragment()
		var child
		while (child = el.firstChild) {
			frament.appendChild(child)
		}
		return fragment
	},
	init: function () {
		this.compileElement(this.$fragment);
	},
	compileElement: function (el) {
		var childNodes = el.childNodes
		var that = this

		[].split.call(childNodes).forEach(function (node) {
			var text = node.textContent
			var reg = //
			if (that.isElementNode(node)) {
				that.compile(node)
			} else if (that.isTextNode(node)) {

			}

			if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
		})
	},
	compile: function (node) {
		var nodeAttrs = node.attributes
		var that = this
		[].slice.call(nodeAttrs).forEach(function (item) {
			
		})
	},
	// 元素类型
	isElementNode: function (node) {
		return node.nodeType == 1
	},
	// 文本类型
	isTextNode: function (node) {
		return node.nodeType == 3
	}
}