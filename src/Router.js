import { createRouter, createWebHistory } from "vue-router";

import { routeLink } from "./utils/route-link.js";

const Login = () => import("@/views/Login.vue");
const ForgotPassword = () => import("@/views/ForgotPassword.vue");
const ResetPassword = () => import("@/views/ResetPassword.vue");
const SiteSetting = () => import('@/views/SiteSetting.vue');
const MemberList = () => import("@/views/MemberList.vue");

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
  {
    path: routeLink.site_setting.link,
    name: routeLink.site_setting.name,
    component: SiteSetting
  },
  {
    path: routeLink.member_list.link,
    name: routeLink.member_list.name,
    component: MemberList,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  linkActiveClass: "active",
});

export default router;
