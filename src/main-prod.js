import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'

// 引入第三方插件  标签页切换显示进度条和进度条css样式

import NProgress from 'nprogress';



// 引入第三方table插件
import tableTree from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import vueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的style样式


import './assets/fonts/iconfont.css'
// 配置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 配置axios请求拦截器，为每次API请求挂载了Authorizetion请求头，这样的话那些有权限的API就可以正常调用成功了

// 在发送请求的拦截器中， 展示进度条 NProgress.start();
axios.interceptors.request.use(config=>{
  NProgress.start();
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
// 在数据响应成功后 隐藏进度条  NProgress.done();
axios.interceptors.response.use(config=>{
  NProgress.done();
  return config
})
Vue.prototype.$axios=axios

// 注册全局可用的第三方table插件
Vue.component('tree-table',tableTree)

Vue.use(ElementUI)
// 注册富文本编辑器为全局可用组件
Vue.use(vueQuillEditor)

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
