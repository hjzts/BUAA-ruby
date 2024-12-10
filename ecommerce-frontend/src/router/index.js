import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/products',
    component: () => import('../views/Products.vue')
  },
  {
    path: '/products/:id',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/cart',
    component: () => import('../views/Cart.vue')
  },
  {
    path: '/orders',
    component: () => import('../views/Orders.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router