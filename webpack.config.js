const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {

	const isProduction = argv.mode === 'production';
	const mode = argv.mode || 'development';
	
	return ({
		entry   : './src/index.ts',
		mode    :	mode,
		devtool : isProduction
			? false
			: 'source-map',
		output : {
			path     : path.resolve(__dirname, 'example/dist'),
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
	})
};
