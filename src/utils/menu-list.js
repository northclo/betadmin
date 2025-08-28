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

export const menuList = (trlang) => {
  return [
    {
      key: "main",
      label: trlang.value.main_page,
      icon: HomeOutlined,
    },
    {
      key: "basic",
      label: trlang.value.basic_management,
      icon: UserOutlined,
      children: [
        {
          key: "site_setting",
          label: trlang.value.site_setting,
          to: "/basic/setting",
        },
        {
          key: "admin_acc_manage",
          label: trlang.value.administrator_account_management,
          to: "/basic/admin",
        },
        {
          key: "menu_manage",
          label: trlang.value.administrator_menu_management,
          to: "/basic/menu",
        },
      ],
    },
    {
      key: "game_partner",
      label: trlang.value.game_partner,
      icon: WalletOutlined,
      children: [
        {
          key: "partner_manage",
          label: trlang.value.partner_management,
          to: "/partner",
        },
        {
          key: "game_setting",
          label: trlang.value.game_settings,
          to: "/game-setting",
        },
      ],
    },
    {
      key: "site_statistics",
      label: trlang.value.site_statistics,
      icon: BarChartOutlined,
      children: [
        {
          key: "bet_settle",
          label: trlang.value.betting_settlement_profit_new,
          to: "/bet-settle",
        },
      ],
    },
    {
      key: "member_manage",
      label: trlang.value.member_management,
      icon: TeamOutlined,
      children: [
        {
          key: "member_list",
          label: trlang.value.member_list,
          to: routeLink.member_list.link,
        },
        {
          key: "login_info",
          label: trlang.value.login_information,
          to: "/member-login",
        },
        {
          key: "current_user",
          label: trlang.value.current_users,
          to: "/current-member",
        },
      ],
    },
    {
      key: "game_manage",
      label: trlang.value.game_management,
      icon: SettingOutlined,
    },
    {
      key: "bet_list",
      label: trlang.value.betting_list,
      icon: WalletOutlined,
    },
    {
      key: "charge_exchange",
      label: trlang.value.charging_exchange_management,
      icon: SwapOutlined,
      children: [
        {
          key: "charge_manage",
          label: trlang.value.charging_management,
          to: "/charge-manage",
        },
        {
          key: "exchange_manage",
          label: trlang.value.currency_exchange_management,
          to: "/exchange-manage",
        },
        {
          key: "money_log",
          label: trlang.value.money_usage_log,
          to: "/money-log",
        },
        {
          key: "point_log",
          label: trlang.value.points_usage_log,
          to: "/point-log",
        },
      ],
    },
    {
      key: "bulletin",
      label: trlang.value.bulletin_board_management,
      icon: WalletOutlined,
      children: [
        {
          key: "announcement",
          label: trlang.value.announcement,
          to: "/announcement",
        },
        {
          key: "customer_service_center",
          label: trlang.value.custom_service_center,
          to: "/service-center",
        },
        {
          key: "popup_manage",
          label: trlang.value.popup_management,
          to: "/popup-manage",
        },
        {
          key: "note_manage",
          label: trlang.value.note_management,
          to: "/note-manage",
        },
      ],
    },
    {
      key: "real_time_bet",
      label: trlang.value.real_time_betting,
      icon: PrinterOutlined,
    },
  ];
};
