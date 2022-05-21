const path=require('path');
// const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const htmlplugin=require("html-webpack-plugin");
const copyplugin=require("copy-webpack-plugin");
const webpack=require("webpack");

module.exports={
    entry:'./initial/src/main.ts',
    output:{
        filename:"result.js",
        path:path.resolve(__dirname,'final')
    },
    devServer:{
        contentBase:path.join(__dirname,'final'),
        port:8080,
        open:true
    },
    mode:"development",
    resolve:{
        extensions:['.ts','.js']
    },
    module:{
        rules:[{
            test:/\.ts$/i,
            use:"ts-loader",
            // exclude:/node_modules/
        },
        {
            test:/\.css$/i,
            use:['style-loader','css-loader']
        },
        {
                test: /\.(webp|png|jpe?g|gif|svg|mp3|ogg|mp4|weba|woff2?|eot|ttf|otf)$/,
                loader: "file-loader",
                options:{
                    name:'[name].[ext]',
                    outputPath:"./assets/images/",
                    // publicPath:"./srcimages/",
                    userRelativePaths:true
                }
            }
    ]
    },
    plugins:
        [new htmlplugin({
            title:'PIXI',
            template:'index.html',
            filename:'index.html',
            inject:'body'
        }),
        new copyplugin({
            patterns: [{
            from: './initial/assets/',
            to: './assets'
        }]}),
        // new CleanWebpackPlugin()
        new webpack.ProgressPlugin()
    ]
}