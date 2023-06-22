const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry   : './src/index.ts', // 入口文件路径
	mode    : 'development',
	devtool : 'source-map',
	output  : {
		path     : path.resolve(__dirname, 'dist'), // 打包输出目录
		filename : 'bundle.js' // 输出文件名
	},
	resolve : {
		extensions : [ '.ts', '.js' ] // 支持的文件扩展名
	},
	module : {
		rules : [
			{
				test    : /\.ts$/, // 匹配所有.ts文件
				exclude : /node_modules/, // 排除node_modules目录
				use     : {
					loader : 'ts-loader' // 使用ts-loader处理TypeScript代码
				}
			}
		]
	},
	plugins : [
		new CleanWebpackPlugin() // 清除输出目录
	]
};
