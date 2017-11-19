# note

> 1. MVVM原理

犯得错误:

    1. v-text和{{}}以为是value  实际是key；
    2. node.childNodes只能匹配内部最外层元素 坑
        需要进行递归匹配了；
    3. 文档碎片充当虚拟DOM知识盲点的学习 documentFragment；

相关参考地址:

    1. [vue双向数据实现原理](https://segmentfault.com/a/1190000006599500)
    2. [文档碎片](http://blog.csdn.net/gisdaocaoren/article/details/41694557)