<template>
  <div class="header-wrapper">
    <a-layout-header class="flex items-center header-content">
      <div class="header-menu-list-wrapper">
        <a-layout class="flex flex-row header-menu-list">
          <template v-for="menu in menus" :key="menu.key">
            <a-dropdown
              v-if="menu.children && menu.children.length"
              class="menu-dropdown"
              :trigger="['click']"
            >
              <template #default>
                <button
                  class="menu-btn"
                  :class="{ 'menu-btn-active': isActiveMenu(menu) }"
                  @click.stop
                >
                  <component :is="menu.icon" class="header-icon" />
                  <span>{{ trlang[menu.label] }}</span>
                </button>
              </template>
              <template #overlay>
                <a-menu class="dropdown-menu">
                  <a-menu-item
                    v-for="child in menu.children"
                    :key="child.key"
                    @click="clickMenu(child.to)"
                    :class="{ 'ant-menu-item-selected': currentRoute === child.to }"
                  >
                    {{ trlang[child.label] }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <button
              v-else
              class="menu-btn"
              :class="{ 'menu-btn-active': isActiveMenu(menu) }"
              @click="clickMenu(menu.to)"
            >
              <component :is="menu.icon" class="header-icon" />
              <span>{{ trlang[menu.label] }}</span>
            </button>
          </template>
        </a-layout>
      </div>
      <div class="log-out-btn">
        <a href="javascript:;" @click="logout">{{ trlang.logout }}</a>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
import { inject, computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import router from "@/Router";
import { routeLink } from "@/utils/route-link";
import { menuList } from "@/utils/menu-list";
import { MenuOutlined, AppstoreOutlined } from "@ant-design/icons-vue";

export default {
  name: "HeaderMenu",
  components: { MenuOutlined, AppstoreOutlined },
  emits: ["toggleSidebar"],
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);
    const route = useRoute();
    const store = useStore();
    const currentRoute = computed(() => route.path);

    const menus = ref([]);
    const navDrawerOpen = ref(true);

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("permissions");
      localStorage.removeItem("partnerRole");
      store.commit("clearPermissions");
      store.commit("clearPartnerRole");
      navDrawerOpen.value = false;
      router.push(routeLink.login.link);
    };

    const clickMenu = (link) => {
      if (link && typeof link === 'string') {
        router.push(link);
      }
    };

    const handleMenuClick = (link) => {
      navDrawerOpen.value = false;
      clickMenu(link);
    };

    const isActiveMenu = (menu) => {
      if (!menu) return false;
      if (menu.to) {
        return currentRoute.value === menu.to;
      }
      if (menu.children && menu.children.length) {
        return menu.children.some((child) => child.to && currentRoute.value.startsWith(child.to));
      }
      return false;
    };

    const filterMenus = (menuItems) => {
      const isHeadquater = store.getters.isHeadquater;
      const permissions = store.getters.getPermissions;
      const hasPartnerAccessPermission = permissions?.partner_access_permission === true;
      
      return menuItems.map(menu => {
        if (menu.children && menu.children.length) {
          const filteredChildren = menu.children.filter(child => {
            if (child.key === 'site_setting' && !isHeadquater) {
              return false;
            }
            if (child.key === 'partner_manage' && !isHeadquater && !hasPartnerAccessPermission) {
              return false;
            }
            return true;
          });
          if (filteredChildren.length === 0) {
            return null;
          }
          return { ...menu, children: filteredChildren };
        }
        return menu;
      }).filter(menu => menu !== null);
    };

    onMounted(() => {
      menus.value = filterMenus(menuList());
    });

    const singleMenus = computed(() =>
      menus.value.filter((menu) => !menu.children || menu.children.length === 0)
    );
    const parentMenus = computed(() =>
      menus.value.filter((menu) => menu.children && menu.children.length)
    );

    watch(
      () => currentRoute.value,
      () => {
        navDrawerOpen.value = false;
      }
    );

    watch(
      () => [store.getters.isHeadquater, store.getters.getPermissions],
      () => {
        menus.value = filterMenus(menuList());
      },
      { deep: true }
    );

    return {
      trlang,
      menus,
      singleMenus,
      parentMenus,
      navDrawerOpen,
      logout,
      clickMenu,
      handleMenuClick,
      currentRoute,
      isActiveMenu,
    };
  },
};
</script>
