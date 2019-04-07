const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");

const srcDir = "client";
const dstDir = "dst/static";

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";

    return {
        entry: {
            "index": path.resolve(srcDir, "ts", "index.tsx"),
            "babel-polyfill": "@babel/polyfill",
        },
        devtool: isProduction ? false : "source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        module: {
            rules: [{
                test: /\.tsx?$/, use: ["babel-loader", "ts-loader"]
            }, {
                enforce: "pre",
                test: /\.tsx?$/,
                use: [{
                    loader: 'tslint-loader',
                    options: {
                        typeCheck: true,
                    },
                }],
            }]
        },
        output: {
            path: path.resolve(__dirname, dstDir),
            filename: `js/[name]${isProduction ? "-[chunkhash]" : ""}.js`,
            publicPath: "/",
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    "NODE_ENV": JSON.stringify(argv.mode),
                },
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.join(__dirname, srcDir, "template/index.html"),
            }),
            new WebpackBuildNotifierPlugin(),
        ],
        performance: {
            maxEntrypointSize: 500000,
        },
        watchOptions: {
            poll: true
        },
    };
};
