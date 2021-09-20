const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const path = require("path");

module.exports = {
    mode: "production",
    entry: "./lib/main.js",
    target: "node",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new LicenseWebpackPlugin({
            outputFilename: "licenses_for_use"
        })
    ]
};
