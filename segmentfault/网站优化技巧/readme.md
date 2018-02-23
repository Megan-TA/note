# 技巧

## 总结平时工作中使用的一些web前端页面性能优化技巧

1. link相关；

> link标签下的rel="canonical"属性 为了帮助搜索引擎解决当前网站存在多个版本 指定规范链接 解决内容重复的收录；

> 预先获取, 可保证最快速度呈现想要呈现的内容；

        主要有三类：

        1. 链接预先获取；

        2. DNS 预先获取；

        3. 预先渲染；

        只需要在链接上增加rel="prefetch",rel="dns-prefetch"，或者 rel="prerender" 标记。

2. 书写HTML时候结构语义化；

    > 方便爬虫抓取和搜索引擎；

    > 方便团队维护；

    > 有利于盲人屏幕阅读器；

3. 资源的合并与压缩;

4. 尽量做好js css的规划 减少http请求数；

5. 图片采用雪碧图、svg等方法，减少http请求数量； 格式采用png8 同样的PNG8格式相对来比GIF小；

6. html中 id留给js使用 js添加的样式最好加上js_等前缀区分；

7. 懒加载图片和js；

8. 合理设置HTTP缓存与CDN内容分发；

9. 外部脚本置底；

    > 这是因为外部脚本加载时会阻塞其他资源；

    > script标签设置defer属性执行异步，但存在一些兼容问题；

10. 动态切图；




相关参考链接:

[link rel=”canonical”标签的用法](http://blog.csdn.net/joyhen/article/details/43233563)