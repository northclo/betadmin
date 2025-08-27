import { createRouter, createWebHistory } from "vue-router";

import { routeLink } from "./utils/route-link.js";

const Login = () => import("@/views/Login.vue");
const ForgotPassword = () => import("@/views/ForgotPassword.vue");
const ResetPassword = () => import("@/views/ResetPassword.vue");

const routes = [
  {
    path: routeLink.login.link,
    name: routeLink.login.name,
    component: Login,
  },
  {
    path: routeLink.forgot_password.link,
    name: routeLink.forgot_password.name,
    component: ForgotPassword,
  },
  {
    path: routeLink.reset_password.link,
    name: routeLink.reset_password.name,
    component: ResetPassword,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  linkActiveClass: "active",
});

export default router;
