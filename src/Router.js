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
const LoginInformation = () => import('@/views/LoginInformation.vue');
const GameManagement = () => import('@/views/GameManagement.vue');
const CurrentLoginUserPage = () => import('@/views/CurrentLoginUser.vue');
const DashboardView = () => import('@/views/Dashboard.vue');
const AdminMenuManagement = () => import('@/views/AdminMenuManagement.vue');
const BettingSettlementView = () => import('@/views/BettingSettlement.vue');
const ChargingManagementView = () => import('@/views/ChargingManagement.vue');
const ExchangeManagementView = () => import('@/views/ExchangeManagement.vue');
const MoneyUsageLogView = () => import('@/views/MoneyUsageLog.vue');
const PointUsageLogView = () => import('@/views/PointUsageLog.vue');
const AnnouncementView = () => import('@/views/Announcement.vue');
const CustomerServiceCenterView = () => import('@/views/CustomerServiceCenter.vue');

const routes = [
  {
    path: routeLink.login.link,
    name: routeLink.login.name,
    component: LoginPage,
    meta: { guestOnly: true },
  },
  {
    path: routeLink.forgot_password.link,
    name: routeLink.forgot_password.name,
    component: ForgotPassword,
    meta: { guestOnly: true },
  },
  {
    path: routeLink.reset_password.link,
    name: routeLink.reset_password.name,
    component: ResetPassword,
    meta: { guestOnly: true },
  },
  {
    path: routeLink.site_setting.link,
    name: routeLink.site_setting.name,
    component: SiteSetting,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.member_list.link,
    name: routeLink.member_list.name,
    component: MemberList,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.admin_account.link,
    name: routeLink.admin_account.name,
    component: AdminAccount,
    meta: { requiresAuth: true },
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
  {
    path: routeLink.login_information.link,
    name: routeLink.login_information.name,
    component: LoginInformation
  },
  {
    path: routeLink.game_management.link,
    name: routeLink.game_management.name,
    component: GameManagement
  },
  {
    path: routeLink.current_login_user.link,
    name: routeLink.current_login_user.name,
    component: CurrentLoginUserPage
  },
  {
    path: routeLink.admin_menu.link,
    name: routeLink.admin_menu.name,
    component: AdminMenuManagement,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.betting_settlement.link,
    name: routeLink.betting_settlement.name,
    component: BettingSettlementView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.charging_management.link,
    name: routeLink.charging_management.name,
    component: ChargingManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.exchange_management.link,
    name: routeLink.exchange_management.name,
    component: ExchangeManagementView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.money_usage_log.link,
    name: routeLink.money_usage_log.name,
    component: MoneyUsageLogView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.point_usage_log.link,
    name: routeLink.point_usage_log.name,
    component: PointUsageLogView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.announcement.link,
    name: routeLink.announcement.name,
    component: AnnouncementView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.customer_service_center.link,
    name: routeLink.customer_service_center.name,
    component: CustomerServiceCenterView,
    meta: { requiresAuth: true },
  },
  {
    path: routeLink.dashboard.link,
    name: routeLink.dashboard.name,
    component: DashboardView,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta?.requiresAuth && !token) {
    return next({ path: routeLink.login.link });
  }

  if (to.meta?.guestOnly && token) {
    return next({ path: routeLink.dashboard.link });
  }

  return next();
});

export default router;
