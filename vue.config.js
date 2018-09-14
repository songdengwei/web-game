const CompressionPlugin = require('compression-webpack-plugin'); //gzip压缩

module.exports = {
  // baseUrl:
  //   process.env.NODE_ENV === "production"
  //     ? "/online/dist/"
  //     : "https://api.douban.com",
  // outputDir: "./dist"
  // runtimeCompiler: process.env.NODE_ENV === "development", // 运行时+编译器
  productionSourceMap: false, // 生产环境不生成source map
  lintOnSave: false,
  devServer: {
    port: 8085, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // https: true, // https协议，自签名证书
    // compress: true, // 启动gzip压缩服务
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    proxy: {
      '/api': {
        target: 'http://api.douban.com',
        changeOrigin: true,
        headers: {
          host: 'api.douban.com',
        },
      },
    }, // 配置多个代理
  },
  css: {
    sourceMap: true,
  },
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css$/,
        threshold: 0,
        minRatio: 0.8,
      }),
    ],
  },
  //chainWebpack: (config) => {
  // GraphQL Loader
  // config.module
  //   .rule('lint')
  //   .test(/\.ts$/)
  //   .pre()
  //   .include.add('src')
  //   .end()
  //   // Even create named uses (loaders)
  //   .use('eslint')
  //   .loader('eslint-loader')
  //   .options({
  //     formatter: require('eslint-friendly-formatter'),
  //   });

  // .rule('ts')
  // .test(/\.(js|vue|ts)$/)
  // .use('eslint-loader')
  // .loader('eslint-loader')
  // .end();
  //},
};
console.log(process.env.NODE_ENV);
