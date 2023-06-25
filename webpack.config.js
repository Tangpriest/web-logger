const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {

	const isProduction = argv.mode === 'production';
	const mode = argv.mode || 'development';
	const devOutputPath = path.resolve(__dirname, 'example/dist');
	const proOutputPath = path.resolve(__dirname, 'dist');
	const devPublicPath = path.resolve(__dirname, 'example')

	const plugins = [
		new CleanWebpackPlugin()
	]

	if (!isProduction) {
		plugins.push(
			new HtmlWebpackPlugin({
				template : './example/index.html'
			})
		)
	}
	
	return ({
		entry   : './src/index.ts',
		mode    :	mode,
		// experiments : {
		// 	outputModule : true
		// },
		devtool : isProduction
			? false
			: 'source-map',
		output : {
			path : isProduction
				? proOutputPath
				: devOutputPath,
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
		plugins   : plugins,
		devServer : {
			static : {
				directory : devPublicPath
			},
			compress : true,
			port     : 3000
		}
	})
};
