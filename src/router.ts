import * as VueRouter from 'vue-router'
import Home from './pages/Home/Home.vue'
import Setting from './pages/Setting/Setting.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/setting', component: Setting },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

export default router
