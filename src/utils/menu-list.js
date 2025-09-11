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
    },
    {
      key: "basic",
      label: "basic_management",
      icon: UserOutlined,
      children: [
        {
          key: "site_setting",
          label: "site_setting",
          to: "/basic/setting",
        },
        {
          key: "admin_acc_manage",
          label: "administrator_account_management",
          to: "/basic/account",
        },
        {
          key: "menu_manage",
          label: "administrator_menu_management",
          to: "/basic/menu",
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
          label: "betting_settlement_profit_new",
          to: "/bet-settle",
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
          to: "/current-member",
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
    },
    {
      key: "charge_exchange",
      label: "charging_exchange_management",
      icon: SwapOutlined,
      children: [
        {
          key: "charge_manage",
          label: "charging_management",
          to: "/charge-manage",
        },
        {
          key: "exchange_manage",
          label: "currency_exchange_management",
          to: "/exchange-manage",
        },
        {
          key: "money_log",
          label: "money_usage_log",
          to: "/money-log",
        },
        {
          key: "point_log",
          label: "points_usage_log",
          to: "/point-log",
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
          to: "/announcement",
        },
        {
          key: "customer_service_center",
          label: "custom_service_center",
          to: "/service-center",
        },
        {
          key: "popup_manage",
          label: "popup_management",
          to: "/popup-manage",
        },
        {
          key: "note_manage",
          label: "note_management",
          to: "/note-manage",
        },
      ],
    },
    {
      key: "real_time_bet",
      label: "real_time_betting",
      icon: PrinterOutlined,
    },
  ];
};
