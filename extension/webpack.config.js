const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = env => {

    const plugins = [];

    if (env && env.production) {
        plugins.push(new UglifyJsWebpackPlugin({
            uglifyOptions: {
                beautify: false,
                ecma: 6,
                compress: true,
                comments: false
            }
        }));
    }

    return {
        context: path.join(__dirname, "./"),
        devtool: undefined,
        entry: {
            background: "./source/background.ts",
            content: "./source/content.ts",
            devtools: "./source/devtools.ts"
        },
        module: {
            rules: [{
                test: /\.ts$/,
                use: {
                    loader: "ts-loader"
                }
            }]
        },
        output: {
            path: path.resolve(__dirname, "./dist/js"),
            filename: "[name].bundle.js"
        },
        plugins: [
            new CopyWebpackPlugin([{
                context: "./assets",
                from: "**/*",
                to: path.join(__dirname, "./dist")
            }, {
                context: "../panel/dist",
                from: "index.html",
                to: path.join(__dirname, "./dist"),
                transform: content => content.toString()
                    .replace(/href="([\w-_.]+\.css)"/g, `href="css/$1"`)
                    .replace(/src="([\w-_.]+\.js)"/g, `src="js/$1"`)
            }, {
                context: "../panel/dist",
                from: "**/*.css",
                to: path.join(__dirname, "./dist/css")
            }, {
                context: "../panel/dist",
                from: "**/*.js",
                to: path.join(__dirname, "./dist/js")
            }]),
            ...plugins
        ],
        resolve: {
            alias: {
                "@devtools": path.resolve(__dirname, "./node_modules/rxjs-spy/devtools"),
            },
            extensions: [".ts", ".js"]
        }
    }
};
