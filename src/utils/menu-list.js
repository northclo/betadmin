import {
  HomeOutlined,
  UserOutlined,
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  SwapOutlined,
  PrinterOutlined,
} from "@ant-design/icons-vue";
import { routeLink } from "@/utils/route-link";

export const menuList = () => {
  return [
    {
      key: "main",
      label: "main_page",
      icon: HomeOutlined,
      to: routeLink.dashboard.link,
    },
    {
      key: "basic",
      label: "basic_management",
      icon: UserOutlined,
      children: [
        {
          key: "site_setting",
          label: "site_setting",
          to: routeLink.site_setting.link,
        },
        {
          key: "admin_acc_manage",
          label: "administrator_account_management",
          to: routeLink.admin_account.link,
        },
        {
          key: "menu_manage",
          label: "administrator_menu_management",
          to: routeLink.admin_menu.link,
        },
      ],
    },
    {
      key: "game_partner",
      label: "game_partner",
      icon: WalletOutlined,
      children: [
        {
          key: "partner_manage",
          label: "partner_management",
          to: routeLink.game_partner.link,
        },
        {
          key: "game_setting",
          label: "game_settings",
          to: routeLink.game_setting.link
        },
      ],
    },
    {
      key: "site_statistics",
      label: "site_statistics",
      icon: BarChartOutlined,
      children: [
        {
          key: "bet_settle",
          label: "betting_settlement_profit",
          to: routeLink.betting_settlement.link,
        },
      ],
    },
    {
      key: "member_manage",
      label: "member_management",
      icon: TeamOutlined,
      children: [
        {
          key: "member_list",
          label: "member_list",
          to: routeLink.member_list.link,
        },
        {
          key: "login_info",
          label: "login_information",
          to: routeLink.login_information.link,
        },
        {
          key: "current_user",
          label: "current_users",
          to: routeLink.current_login_user.link,
        },
      ],
    },
    {
      key: "game_manage",
      label: "game_management",
      icon: SettingOutlined,
      to: routeLink.game_management.link
    },
    {
      key: "bet_list",
      label: "betting_list",
      icon: WalletOutlined,
      to: routeLink.betting_list.link,
    },
    {
      key: "charge_exchange",
      label: "charging_exchange_management",
      icon: SwapOutlined,
      children: [
        {
          key: "charge_manage",
          label: "charging_management",
          to: routeLink.charging_management.link,
        },
        {
          key: "exchange_manage",
          label: "currency_exchange_management",
          to: routeLink.exchange_management.link,
        },
        {
          key: "money_log",
          label: "money_usage_log",
          to: routeLink.money_usage_log.link,
        },
        {
          key: "point_log",
          label: "points_usage_log",
          to: routeLink.point_usage_log.link,
        },
      ],
    },
    {
      key: "bulletin",
      label: "bulletin_board_management",
      icon: WalletOutlined,
      children: [
        {
          key: "announcement",
          label: "announcement",
          to: routeLink.announcement.link,
        },
        {
          key: "customer_service_center",
          label: "custom_service_center",
          to: routeLink.customer_service_center.link,
        },
        {
          key: "popup_manage",
          label: "popup_management",
          to: routeLink.popup_management.link,
        },
        {
          key: "notice_manage",
          label: "notice_management",
          to: routeLink.notice_management.link,
        },
      ],
    },
    {
      key: "real_time_bet",
      label: "real_time_betting",
      icon: PrinterOutlined,
      to: routeLink.real_time_betting.link,
    },
  ];
};
