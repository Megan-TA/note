## React-imvc

> build目录

1. createWebpackServerConfig.js

动态配置webpack的依赖项目，通过遍历package.json文件当中的`dependencies`和`devDependencies`的value放入一个空数组，再依次遍历数组的值挂载到名为`map`空对象，最后将这个对象挂载到webpack的`externals`属性上。输出webpack的配置对象;

2. createWebpackClientConfig.js

动态确定webpack配置，暴露一个接受对象的参数，最后整合 plugins、entry、

- webpack-bundle-analyzer // 分析打包后的各个文件体积大小情况
- optimize-js-plugin




3. webpack.stats.plugin.js

> entry目录

1. client.js

动态配置一些服务端启动的配置文件，包括`上下文context`,`预加载内容preload`、`routes`、`viewEngine`等

其中引用了 作者另外发布淘宝镜像的插件
[create-app](https://npm.taobao.org/package/create-app)

一次配置 服务端同构的实现

属性配置了[data-preload]的标签内容会被优先加载

2. server.js

> polyfill目录

1. index.js

借用作者注释

/**
 * babel-polyfil 给 Array.prototype 补了 symbol 属性
 * webpackJsonp 函数用 for in 遍历模块数组
 * 用 typeof obj === 'object' 判断数组
 * 把 symbol 属性里的对象，当做数组调用 slice 方法，在 IE8 下报错
 * 将 symbol key 删除
 */

> util目录

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