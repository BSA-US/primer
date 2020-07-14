import { createRouter, createWebHistory } from 'vue-router'
import { Home, About } from '@/views'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})

export default router
