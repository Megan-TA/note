## React-imvc

> ## 简介

    react-imvc 是一套基于react基础上，默认利用`renderToString`方法，实现的服务端同构方案，一份代码可以跑在客户端和服务端。

> ## package.json

    看下`gulpfile.js`文件  定了`babel`和`copy`以及`watch`任务 就是编译下jsx为js之后拷贝到./publish目录下

    安装了`rimraf`包，用来以指令方式删除`publish`文件夹

> ## config目录

    1. index.js


get点：

    process.cwd()  是执行node启动命令的目录
    __direname  是执行的js所在目录

> ## bin目录

  结合package.json的bin下对象 "react-imvc": "./bin/scripts.js" 可以看到在当前包的基础上开发的项目可以使用类似 'react-imvc start --config=xxxxxx.js'的形式启动

  其中需要注意的是 在 'react-imvc start --config=xxxxxx.js'指令中，process.argv[1] 并不是`start`，而是`./bin/scripts.js`，process.argv[2]才是`start`

  第一行 `#!/usr/bin/env node` 表示程序会自动执行

> ## start目录

node服务端启动一些配置

在package.json 默认加载./index.js  这个文件暴露了 start和build两个接口

1. babel.js

get点：

    babel-register 将ES5语法转成es5，目测是为了兼容node低版本对es6支持不全的考虑

2. index.js

疑惑点：

SSR 是什么配置

get点：

- helmet 

一款express在response的header中加入一些策略来保护网站安全的中间件

详细阅读文章 [为你的网站带上帽子 — 使用 helmet 保护 Express 应用](https://juejin.im/post/5a24fd8f51882509e5438247)
- compression

开启Gzip压缩


> ## scripts目录

    规定了`start`、`build`、`test`默认三种模式
    

> ## build目录

1. createWebpackServerConfig.js

    动态配置webpack的依赖项目，通过遍历package.json文件当中的`dependencies`和`devDependencies`的value放入一个空数组，再依次遍历数组的值挂载到名为`map`空对象，最后将这个对象挂载到webpack的`externals`属性上。输出webpack的配置对象;

2. createWebpackClientConfig.js

    动态确定webpack配置，暴露一个接受对象的参数，最后整合 plugins、entry

    注意：默认在`entry`的入口属性的`vendor`中，引入`../component`以及`../controller`这两个很重要，一个引用了一些默认的组件，还有一个对外展示的`controller`层，这也是最终整合外部项目`imvc`层概念的一个重要环节。

get点：

    - webpack-bundle-analyzer // 分析打包后的各个文件体积大小情况
    - optimize-js-plugin

3. webpack.stats.plugin.js

4. createGulpTask.js

压缩html、img、js、拷贝、输出等任务

5. setup-dev-env.js

    利用weboack-dev-middleware插件分别配置客户端和服务端资源

get点：

- webpack-dev-middleware   在服务端以走`内存`的方式`监听资源`的变更`自动打包`输出

webpack默认不是有监听事件为什么还需要这个呢？答案在于此插件采用内存方式 打包速度足够快

可以阅读[webpack-dev-middleware详解](https://juejin.im/entry/59806132f265da3e1e5bd613)

- memory-fs  一个简单的内存文件系统

- notifier  调用系统提示功能


6. index.js

> ## entry目录

1. client.js

    动态配置一些服务端启动的配置文件，包括`上下文context`,`预加载内容preload`、`routes`、`viewEngine`等

    其中引用了 作者另外发布淘宝镜像的包
    [create-app](https://npm.taobao.org/package/create-app)

    一次配置 服务端同构的实现

    属性配置了[data-preload]的标签内容会被优先加载

2. server.js

> ## polyfill目录

1. index.js

    借用作者注释

    /**
    * babel-polyfil 给 Array.prototype 补了 symbol 属性
    * webpackJsonp 函数用 for in 遍历模块数组
    * 用 typeof obj === 'object' 判断数组
    * 把 symbol 属性里的对象，当做数组调用 slice 方法，在 IE8 下报错
    * 将 symbol key 删除
    */

> ## util目录

1. index.js

    - getFlatList 降维数组，输出一位数组
    - toJSON 用promise方法抛出异常 利用node自带json()方法将返回的字符串转换成json
    - toText 和toJSON相反，输出字符串
    - timeoutReject 利用Promise.race将原请求的promise实例和抛出异常的promise实例组合成新的promise实例来抛出错误
    - isAbsoluteUrl 判断是否是外网路径
    - mapValues 
    - isThenable 判断是否是一个promise
    - setValueByPath 给对象通过相对路径的key设置value
    - getValueByPath 给对象通过相对路径的key找到value

    get点：

    [key, ...rest] = [1,2,3,4,5]  这样key代表数组第一个值 ...rest代表数组剩余数值的结合

    源码如下：

    ```
    const setValue = (obj, [key, ...rest], value) => {
      obj = Array.isArray(obj) ? obj.concat() : Object.assign({}, obj);
      obj[key] = rest.length > 0 ? setValue(obj[key], rest, value) : value;
      return obj;
    }
    ```

> ## controller目录

默认对外输出一个`Controller`的对象，这里面就配置了一些针对用户自定义设置的属性做一些初始化工作，比如：
```
Model,
initialState,
actions,
context,
location,
SSR,
Loading
```
其中Loading是一个空div在`context.isServer && !!!SSR`出现，支持自定义loading组件

发现一个未处理的事情 第371行未处理

```
/**
* 动态获取最终的 actions
*/
if (this.getFinalActions) {
    actions = this.getFinalActions(actions)
}
```


> ## 启动开发流程（start）:

外部项目在npm上下载`react-imvc`包之后，在`package.json`中加入启动命令`react-imvc start --config=xxxxx.js`，其中`xxxxx.js`是自定义配置，比如如下一个配置

```
const config = {
  layout: "layout",
  routes: "routes",
  env: 'env',
  port: 3000,
  basename: "",
  restapi: "",
  title: "",
  description: "",
  keywords: "",
  context: {
    env: env
  },
  entry: {
    vendor: ["moment", "rome", "antd", "lodash"]
  }
}
```
之后在`react-imvc`项目下接受到指令传过来的`start`参数启动`start/index.js`文件，在这个文件中做了如下几件事：
* 获取用户自定义的配置对象与本身的默认配置项合并为新的`options`；
* 根据配置项启动nodejs服务；
* 根据外部项目配置`src/index.js`子目录下路由经过外部的`create-app`资源走服务端同构后输出静态模板文件并配合`webpack`实现文件改动的监听；

外部项目建议分为`hmvc`结构，结构如下：





> ## 参考资料
  1. [react-imvc github](https://github.com/Lucifier129/react-imvc)
  2. [为你的网站带上帽子 — 使用 helmet 保护 Express 应用](https://juejin.im/post/5a24fd8f51882509e5438247)
  3. [webpack-dev-middleware详解](https://juejin.im/entry/59806132f265da3e1e5bd613) 