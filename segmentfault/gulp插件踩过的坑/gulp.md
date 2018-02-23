# Gulp

---

1. gulp-tmtsprite

[自动合并雪碧图](https://github.com/weixin/gulp-tmtsprite)

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
if (!matchValue ||
    matchValue[1].indexOf('data:') === 0 ||
    matchValue[1].indexOf('//') > -1) {
    continue;
}

```




