const path = require("path");
module.exports = {
  publicPath: './',  //解决打包后页面空白的问题

  devServer: {
    port: 8081,  //修改默认端口号  
  },

  configureWebpack: {  //配置别名
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'less': '@/less',
        'router': '@router',
        'store': '@store',
        'views': '@/views',
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [  //全局less文件
        path.resolve(__dirname, "src/less/global.less")
      ]
    }
  }
}
