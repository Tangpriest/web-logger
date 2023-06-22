const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry   : './src/index.ts',
	mode    : 'development',
	devtool : 'source-map',
	output  : {
		path     : path.resolve(__dirname, 'dist'),
		filename : 'bundle.js'
	},
	resolve : {
		extensions : [ '.ts', '.js' ]
	},
	module : {
		rules : [
			{
				test    : /\.ts$/,
				exclude : /node_modules/,
				use     : {
					loader : 'ts-loader'
				}
			}
		]
	},
	plugins : [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template : './example/index.html'
		})
	],
	devServer : {
		static : {
			directory : path.resolve(__dirname, 'example')
		},
		compress : true,
		port     : 3000
		
	}
};
