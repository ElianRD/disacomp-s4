import { createRouter, createWebHistory } from 'vue-router'
import { authStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/invoices'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/invoices',
    name: 'InvoicesList',
    component: () => import('../views/InvoicesView.vue')
  },
  {
    path: '/invoices/create',
    name: 'InvoiceCreate',
    component: () => import('../views/InvoiceCreateView.vue')
  },
  {
    path: '/products',
    name: 'ProductsList',
    component: () => import('../views/ProductsView.vue')
  },
  {
    path: '/clients',
    name: 'ClientsList',
    component: () => import('../views/ClientsView.vue')
  },
  {
    path: '/users',
    name: 'UsersList',
    component: () => import('../views/UsersView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isPublic = to.meta.public;
  const isAuthenticated = authStore.isAuthenticated;

  if (!isPublic && !isAuthenticated) {
    next('/login');
  } else if (isPublic && isAuthenticated) {
    next('/invoices'); // Evita re-ingresar al login estando logueado
  } else {
    next();
  }
});

export default router
