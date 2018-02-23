
# 前端路上坑的点点滴滴

> webpack 3.5.5

	1. 设置全局环境变量 (process.env.NODE_ENV) 来针对不同环境进行配置

	情景：在配置css在dev不做处理 prod环境下需要压缩

	解决:

		通过cross-env设置环境变量

		```
		
		npm install cross-env --save-dev

		// prod.js

		 plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('prod')
                }
            })
        ]

        // base.js

        if (process.env.NODE_ENV == 'prod') {

    	} else {

    	}

        // package.json

        cross-env NODE_ENV=prod webpack --config build/webpack.config.js


		```
	相关链接：

		1. [webpack3.5 使用环境变量](http://www.css88.com/doc/webpack/guides/environment-variables/)
		2. [cross-env](https://www.npmjs.com/package/cross-env)

	2. autoprefixed-loader 

	相关链接：
		1. [autoprefixer-loader](https://www.npmjs.com/package/autoprefixer-loader)

	3. 热模块更新

	相关链接：
		1. [autoprefixer-loader](https://www.npmjs.com/package/autoprefixer-loader)