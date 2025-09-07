import { createRouter, createWebHistory } from "vue-router";

import { routeLink } from "./utils/route-link.js";

const LoginPage = () => import("@/views/LoginPage.vue");
const ForgotPassword = () => import("@/views/ForgotPassword.vue");
const ResetPassword = () => import("@/views/ResetPassword.vue");
const SiteSetting = () => import('@/views/SiteSetting.vue');
const MemberList = () => import("@/views/MemberList.vue");
const AdminAccount = () => import('@/views/AdminAccount.vue');
const GameSetting = () => import('@/views/GameSetting.vue');
const GamePartner = () => import('@/views/GamePartner.vue');

const routes = [
  {
    path: routeLink.login.link,
    name: routeLink.login.name,
    component: LoginPage,
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
  {
    path: routeLink.admin_account.link,
    name: routeLink.admin_account.name,
    component: AdminAccount
  },
  {
    path: routeLink.game_setting.link,
    name: routeLink.game_setting.name,
    component: GameSetting
  },
  {
    path: routeLink.game_partner.link,
    name: routeLink.game_partner.name,
    component: GamePartner
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  linkActiveClass: "active",
});

export default router;
