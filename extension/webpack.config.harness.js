const path = require("path");
const webpack = require("webpack");

module.exports = env => {

    return {
        context: path.join(__dirname, "./"),
        devtool: "source-map",
        entry: {
            index: "./harness/index.ts",
        },
        module: {
            rules: [{
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.harness.json"
                    }
                }
            }]
        },
        output: {
            path: path.join(__dirname, "./harness"),
            filename: "[name].bundle.js"
        },
        plugins: [],
        resolve: {
            extensions: [".ts", ".js"]
        }
    }
};
