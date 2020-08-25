import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login=()=>import('../components/Login.vue')
const Home=()=>import('../components/Home.vue')
const Welcome=()=>import('../components/Welcome.vue')
const Users=()=>import('../components/user/Users.vue')
const Rights=()=>import('../components/power/Rights.vue')
const Roles=()=>import('../components/power/Roles.vue')
const Category=()=>import('../components/goods/Category.vue')

Vue.use(VueRouter)

  const routes = [
    {
      path:'/',
      redirect: '/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home,
      redirect: '/welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:Users
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/roles',
          component:Roles
        },
        {
          path:'/categories',
          component:Category
        }
      ]
    }
]

const router = new VueRouter({
  routes,
  mode:'history'
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径跳转而来
  // next()是一个函数，表示下一步

  // 判断将要访问的路径是否是login，是的话就下一步
  if(to.path==='/login') return next()
  // 获取token
  const tokenStr=window.sessionStorage.getItem('token');
  // 如果没有有token 就return next()强制跳转到'/login
  if(!tokenStr) return next('/login')
  // 否则就直接进行到下一步
  next()
  
})
export default router
 