import path from 'path'
import webpack from 'webpack'

import HTMLPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
	entry: './src/client/entry.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[hash].js',
	},

	module: {
		rules: [
			{
				test: /\.tsx?/,
				use: ['ts-loader'],
			},

			{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: { limit: 8192 },
					},
				],
			},

			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},

	resolve: {
		extensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx', '.jsx'],
	},

	plugins: [
		new HTMLPlugin({
			template: path.resolve(__dirname, './src/client/index.html'),
		}),
	],

	devServer: {
		historyApiFallback: true,
		proxy: {
			'/graphql': 'http://localhost:5000/',
		},
	},
}

// @ts-ignore
export default (_, { mode }: { mode?: 'development' | 'production' }) => {
	config.mode = mode

	return config
}
