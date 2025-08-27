import { createRouter, createWebHistory } from "vue-router";

const LoginView = () => import("./views/LoginView.vue");
const ForgotPasswordView = () => import("./views/ForgotPassword.vue");

const routes = [
  {
    path: "/auth/loginview",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/auth/forgot-password",
    name: "ForgotPasswordView",
    component: ForgotPasswordView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
