const path = require("path");
module.exports = {
  // config.set('externals', { 
	//   vue: 'Vue', 
	//   'vue-router': 'VueRouter', 
	//   axios: 'axios', 
	//   nprogress: 'NProgress', 
	//   'vue-quill-editor': 'VueQuillEditor' 
	// }),
  // npm run build 后生成的打包文件放在哪里
  outputDir: __dirname + '/../server/front',
  // publicPath: './',  //解决打包后页面空白的问题

  // publicPath: process.env.NODE_ENV === 'production'  // 生产/开发环境的路径问题
  //   ? '/'
  //   : '/',

  devServer: {
    port: 8081,  //修改默认端口号  
  },

  lintOnSave: false,  //关掉eslint

  configureWebpack: {  
    resolve: {
      alias: {  //配置别名
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'less': '@/less',
        'router': '@router',
        'store': '@store',
        'views': '@/views',
      }
    },
    externals: {  // 外链cdn引入vue、element-ui
      'vue': 'Vue',
      'vuex': 'Vuex',
      'element-ui': 'ELEMENT',
      'highlight.js': 'hljs',
      'vue-router': 'VueRouter',
      'axios': 'axios'
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [  //全局less文件
        path.resolve(__dirname, "src/less/global.less")
      ]
    }
  },

  chainWebpack: (config) => {
    /* 添加分析工具*/
    if (process.env.NODE_ENV === 'production') {
        if (process.env.npm_config_report) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                .end();
            config.plugins.delete('prefetch')
        }
    } 
  }
}
