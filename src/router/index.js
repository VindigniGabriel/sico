import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/components/auth/Login.vue'
import Register from '@/views/RegisterClient.vue'
import List from '@/views/List.vue'
import Quote from '@/views/Quote.vue'
import CustomerSupport from '@/views/CustomerSupport.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/registerclient/:id',
      name: 'registerclient',
      component: Register
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/quote',
      name: 'Quote',
      component: Quote
    },
    {
      path: '/customerSupport',
      name: 'CustomerSupport',
      component: CustomerSupport
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
