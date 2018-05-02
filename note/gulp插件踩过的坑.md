# Gulp

---

1. gulp-tmtsprite

[自动合并雪碧图](https://github.com/weixin/gulp-tmtsprite)

支持2倍图 3倍图

举例如下：

准备设计稿切下的原图icon，假设命名为test@2x.png 再将原图缩小一倍保存为同名test.png

在css的引用小图的icon 比如 background-image: url(test.png) no-repeat;

默认插件会在上一层目录的名为slice文件夹下查找icon，输出到sprite目录下

截图如下:

![1](http://wx4.sinaimg.cn/mw1024/006ANKB8gy1fqx0djcxipj30fy0bnaaf.jpg)
![2](http://wx1.sinaimg.cn/mw690/006ANKB8gy1fqx0djsqt1j30qq0fa0v2.jpg)
![3](http://wx3.sinaimg.cn/mw1024/006ANKB8gy1fqx0djfhvhj30o906it9d.jpg)
![4](http://wx3.sinaimg.cn/mw1024/006ANKB8gy1fqx0djlviyj30pg0fu0tj.jpg)
![5](http://wx3.sinaimg.cn/mw1024/006ANKB8gy1fqx0djnl1cj30yq0bnt9y.jpg)
![6](http://wx1.sinaimg.cn/mw1024/006ANKB8gy1fqx0gi7s2gj30qz08kwep.jpg)


2. gulp-lazyimagecss

[自动生成图片宽高](https://github.com/weixin/gulp-lazyimagecss)

1与2配合使用

![配置](D:\Users\chen_huang\Pictures\screen\3.png)

![css-in](D:\Users\chen_huang\Pictures\screen\2.png)

![css-out](D:\Users\chen_huang\Pictures\screen\4.png)

注意：

> css-out 类引用图片属性必须是 background-image

> 此插件不能匹配引用外部http等url路径的图片 默认会在文件目录下查找 提示不存在 

修改办法 在node安装包下找到 gulp-lazyimagecss/index.js下第90行 加上

matchValue[1].indexOf('//') > -1

改完之后是这样子

```
if (
    !matchValue ||
    matchValue[1].indexOf('data:') === 0 ||
    matchValue[1].indexOf('//') > -1
    ) 
    {
        continue;
    }

```




