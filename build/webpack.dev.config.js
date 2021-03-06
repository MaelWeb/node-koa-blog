const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.config');
const Html = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const outputPath = path.join(__dirname, '../dist/client/');
const templateSrc = path.join(__dirname, '../src/client/page/');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

// process.traceDeprecation = true;

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    mode: "development",
    entry: {
        admin: [
            'eventsource-polyfill',
            'webpack-hot-middleware/client',
            './client/page/admin/index.js',
        ],
        blog: [
            'eventsource-polyfill',
            'webpack-hot-middleware/client',
            './client/page/blog/index.js',
        ]
    },
    output: {
        path: outputPath,
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: "js/[name].[chunkhash:8].js"
    },
    plugins: [
        new Html({
            filename: 'admin.html',
            alwaysWriteToDisk: true,
            template: path.join(templateSrc, '/admin/index.html'),
            title: '<%= title || "游走在技术与艺术边缘地带的前端攻城狮" %>',
            chunks: ["admin"],
        }),
        new Html({
            filename: 'blog.html',
            alwaysWriteToDisk: true,
            template: path.join(templateSrc, '/blog/index.html'),
            html: '<%- html %>',
            script: '<%- JSON.stringify(ServerData) %>',
            title: '<%= title || "游走在技术与艺术边缘地带的前端攻城狮" %>',
            chunks: ["blog"],
        }),
         // 插入dll库
        new HtmlWebpackIncludeAssetsPlugin({
            files: '*.html',
            assets: [{ path: 'lib', glob: '*.dll.js', globPath: 'dist/client/lib/' }],
            append: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackHarddiskPlugin()
    ]
})