import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

import './assets/fonts/iconfont.css'
// 配置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 配置axios请求拦截器，为每次API请求挂载了Authorizetion请求头，这样的话那些有权限的API就可以正常调用成功了
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios=axios

Vue.use(ElementUI)

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
