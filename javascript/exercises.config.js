const webpack = require('webpack'),
path = require('path'),
ExtractTestPlugin = require("extract-text-webpack-plugin");

var inProduction = process.env.NODE_ENV === 'production';

module.exports = {
	entry: {
		exercises: './exercises/app.js'
    },
	output: {		
		path: path.join(__dirname, '../python/zeeguu_exercises/static/js/dist'),
		filename: '[name].js',
	},
	module: {
	 rules: [
		 {
			 test: /\.js$/,
			 loader: 'babel-loader',
		 }
	 ]
	},
	plugins: [
		new webpack.DefinePlugin({"ZEEGUU_API": JSON.stringify(process.env.ZEEGUU_API)})
	],	
	stats: {
		colors: true
	},
	devtool: 'source-map'
};

if(inProduction) {
//
}
