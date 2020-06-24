const webpack = require('webpack'),
	path = require('path'),
	ExtractTextPlugin = require("extract-text-webpack-plugin");

var inProduction = process.env.NODE_ENV === 'production';

function getVersion() {
	return require("./package.json").version;
}

module.exports = {
	mode: 'development',
	entry: {
		subscription: './reader/subscription/main.js',
		translation: './reader/translation/main.js'
	},
	output: {
		path: path.join(__dirname, '../python/zeeguu_reader/static/scripts/dist'),
		filename: '[name]-' + getVersion() + '.js'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				use: 'css-loader'
			})
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: {
				presets: ['env']
			}
		}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/[name]-' + getVersion() + '.css'),
		new webpack.DefinePlugin({"ZEEGUU_API": JSON.stringify(process.env.ZEEGUU_API)})
	],
	stats: {
		colors: true
	},
	devtool: 'source-map'
};

if (inProduction) {
	// Do production specific things here.
}
