import Vue from 'vue' 
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/iconfont/iconfont.css'  //引入阿里矢量图标
import './less/global.less'  //less全局变量
import axios from 'axios'

//创建一个axios实例并赋值在Vue的原型上，
//则所有组件都可访问这个axios实例
Vue.prototype.$http = axios.create({ 
  // baseURL: 'http://192.168.43.13:3000/'
  baseURL: process.env.VUE_APP_API_URL || '/api/' //根据服务器域名动态决定url
})
Vue.prototype.$bus = new Vue()  //注册事件总线
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
