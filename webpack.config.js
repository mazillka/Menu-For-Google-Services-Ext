const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyVersionPlugin = require("webpack-copy-version-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
	const devMode = argv.mode !== "production";

	return [
		{
			mode: devMode ? "development" : "production",
			entry: {
				contentscript: "./src/js/contentscript.js",
				background: "./src/js/background.js",
				popup: "./src/js/popup.js",
				options: "./src/js/options.js",
			},
			output: {
				filename: "[name].js",
				path: path.resolve(__dirname, "./dist/"),
				clean: true,
				trustedTypes: "default"
			},
			devtool: devMode ? "source-map" : false,
			optimization: {
				minimize: devMode ? false : true,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							format: {
								comments: false,
							},
						},
						extractComments: false,
					}),
					new CssMinimizerPlugin({
						minimizerOptions: {
							preset: [
								"default",
								{
									discardComments: { removeAll: true },
								},
							],
						},
					}),
				],
			},
			module: {
				rules: [
					{
						test: /\.html$/,
						use: [
							{
								loader: "html-loader",
								options: {
									minimize: devMode ? false : true,
								},
							},
						],
					},
					{
						test: /\.(scss|css)$/,
						use: [
							MiniCssExtractPlugin.loader,
							"css-loader",
							{
								loader: "postcss-loader",
								options: {
									postcssOptions: {
										plugins: [require("precss"), require("autoprefixer")],
									},
								},
							},
							"sass-loader",
						],
					},
					// Example for asset modules (images/fonts)
					{
						test: /\.(png|jpe?g|gif|svg|ico)$/i,
						type: "asset/resource",
						generator: {
							filename: "images/[name][ext]",
						},
					},
				],
			},
			plugins: [
				new CleanWebpackPlugin(),
				new CopyVersionPlugin({
					from: "./package.json",
					to: "./src/manifest.json",
				}),
				new CopyWebpackPlugin({
					patterns: [
						{ from: "./src/icons", to: "icons" },
						{ from: "./src/images", to: "images" },
						{ from: "./src/manifest.json", to: "manifest.json" },
					],
				}),
				new HtmlWebPackPlugin({
					template: "./src/html/options.html",
					filename: "./options.html",
					excludeChunks: ["background", "contentscript", "popup"],
				}),
				new HtmlWebPackPlugin({
					template: "./src/html/popup.html",
					filename: "./popup.html",
					excludeChunks: ["background", "contentscript", "options"],
				}),
				new MiniCssExtractPlugin({
					filename: "css/[name].css",
					chunkFilename: "css/[name].css",
				}),
				new ZipPlugin({
					filename: "extension.zip"
				}),
			],
			resolve: {
				extensions: [".js", ".json"],
			},
		},
	];
};
