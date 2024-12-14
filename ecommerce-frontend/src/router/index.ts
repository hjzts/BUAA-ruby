import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/RegisterView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/ProfileEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/password/change',
      name: 'password-change',
      component: () => import('../views/PasswordChange.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/only-products',
      name: 'only-products',
      component: () => import('../views/products/ProductsGrid.vue')
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/admin/ProductList.vue')
      // meta: { requiresAdmin: true }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/products/ProductList.vue')
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../views/products/ProductDetail.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/home')
  } else {
    next()
  }
})

export default router
