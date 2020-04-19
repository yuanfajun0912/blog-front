import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决两次访问相同路由地址报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 懒加载
const Home = () => import('views/Home.vue')
const Tags = () => import('views/Tags.vue')
const Timeline = () => import('views/Timeline.vue')
const LeaveMessages = () => import('views/LeaveMessages.vue')
const About = () => import('views/About.vue')
const Detail = () => import('views/Detail.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    meta: { title: '主页 | 念风' }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '主页 | 念风' }
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags,
    meta: { title: '标签 | 念风' }
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline,
    meta: { title: '时间线 | 念风' }
  },
  {
    path: '/leavemessages',
    name: 'LeaveMessages',
    component: LeaveMessages,
    meta: { title: '留言板 | 念风' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我 | 念风' }
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: Detail,
    meta: { title: '细节 | 念风' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes, 
})
// 全局导航守卫，使得title随着路由跳转而改变
const defaultTitle = '念风'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || defaultTitle
  next()
})
export default router
