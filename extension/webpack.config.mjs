import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebPackPlugin from "html-webpack-plugin";
import CopyVersionPlugin from "webpack-copy-version-plugin";
import ZipPlugin from "zip-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import precss from "precss";
import autoprefixer from "autoprefixer";

export default (env, argv) => {
	const devMode = argv.mode !== "production";

	return [
		{
			mode: argv.mode || "development",
			entry: {
				contentscript: "./src/contentscript.ts",
				background: "./src/background.ts",
				popup: "./src/popup.ts",
				options: "./src/options.ts",
			},
			output: {
				filename: "[name].js",
				path: path.resolve("./dist/"),
				clean: true,
				trustedTypes: "default"
			},
			devtool: devMode ? "source-map" : false,
			optimization: {
				minimize: !devMode,
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
									minimize: !devMode,
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
										plugins: [precss, autoprefixer],
									},
								},
							},
							"sass-loader",
						],
					},
					{
						test: /\.(png|jpe?g|gif|svg|ico)$/i,
						type: "asset/resource",
						generator: {
							filename: "static/images/[name][ext]",
						},
					},
					{
						test: /\.ts$/,
						use: "ts-loader",
						exclude: /node_modules/,
					},
				],
			},
			plugins: [
				new CleanWebpackPlugin(),
				new CopyVersionPlugin({
					from: "./package.json",
					to: "./manifest.json",
				}),
				new CopyWebpackPlugin({
					patterns: [
						{ from: "./static/icons", to: "icons" },
						{ from: "./manifest.json", to: "manifest.json" },
					],
				}),
				new HtmlWebPackPlugin({
					template: "./static/html/options.html",
					filename: "./options.html",
					excludeChunks: ["background", "contentscript", "popup"],
				}),
				new HtmlWebPackPlugin({
					template: "./static/html/popup.html",
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
				extensions: [".ts", ".js", ".json"],
			},
		},
	];
};
