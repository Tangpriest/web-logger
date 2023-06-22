const path = require('path')

module.exports = {
	entry   : './src/index.js', // 入口文件路径
	mode    : 'production',
	devtool : 'source-map',
	output  : {
		path     : path.resolve(__dirname, 'dist'), // 打包输出目录
		filename : 'bundle.js' // 输出文件名
	},
	module : {
		rules : [
			{
				test    : /\.js$/, // 匹配所有.js文件
				exclude : /node_modules/, // 排除node_modules目录
				use     : {
					loader  : 'babel-loader', // 使用babel-loader处理ES6代码
					options : {
						presets : [ '@babel/preset-env' ] // 使用@babel/preset-env进行转译
					}
				}
			}
		]
	}
}
