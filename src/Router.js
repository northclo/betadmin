import { createRouter, createWebHistory } from 'vue-router';

const LoginView = () => import('./views/LoginView.vue');

const routes = [
  {
    path: '/admin/loginview',
    name: 'LoginView',
    component: LoginView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active'
});

export default router;