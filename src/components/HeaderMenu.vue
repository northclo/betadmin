<template>
  <div class="header-wrapper">
    <a-layout-header class="flex items-center header-content">
      <div class="header-tools">
        <button
          v-if="showMenuToggle"
          class="menu-toggle"
          type="button"
          @click="$emit('toggleSidebar')"
        >
          <MenuOutlined />
        </button>
        <button
          v-if="showMenuToggle"
          class="menu-toggle nav-toggle"
          type="button"
          @click="navDrawerOpen = true"
        >
          <AppstoreOutlined />
        </button>
      </div>
      <a-layout class="flex flex-row gap-2 header-menu-list">
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
                <component :is="menu.icon" class="header-icon" style="margin-right: 8px;" />
                {{ trlang[menu.label] || menu.label }}
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
                  {{ trlang[child.label] || child.label }}
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
            <component :is="menu.icon" class="header-icon" style="margin-right: 8px;" />
            {{ trlang[menu.label] || menu.label }}
          </button>
        </template>
      </a-layout>
      <div class="log-out-btn">
        <a href="javascript:;" @click="logout">{{ trlang.logout }}</a>
      </div>
    </a-layout-header>
    <a-drawer
      v-if="showMenuToggle"
      placement="left"
      :open="navDrawerOpen"
      class="nav-drawer"
      :width="320"
      @close="navDrawerOpen = false"
    >
      <div class="nav-drawer__wrap">
        <a-typography-title :level="4" class="nav-drawer__title">
          {{ trlang.navigation_label }}
        </a-typography-title>
        <div class="nav-drawer__links">
          <a-button
            v-for="menu in singleMenus"
            :key="menu.key"
            block
            class="nav-drawer__link"
            type="text"
            @click="handleMenuClick(menu.to)"
          >
            <component :is="menu.icon" />
            <span>{{ trlang[menu.label] || menu.label }}</span>
          </a-button>
          <a-collapse
            v-if="parentMenus.length"
            ghost
            accordion
            class="nav-drawer__collapse"
          >
            <a-collapse-panel
              v-for="menu in parentMenus"
              :key="menu.key"
              :header="trlang[menu.label] || menu.label"
            >
              <a-button
                v-for="child in menu.children"
                :key="child.key"
                block
                type="text"
                class="nav-drawer__sublink"
                @click="handleMenuClick(child.to)"
              >
                {{ trlang[child.label] || child.label }}
              </a-button>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <a-divider />
        <a-button block type="primary" ghost @click="logout">
          {{ trlang.logout }}
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { inject, computed, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/Router";
import { routeLink } from "@/utils/route-link";
import { menuList } from "@/utils/menu-list";
import { useOnlineStatus } from '@/composables/useOnlineStatus';
import { MenuOutlined, AppstoreOutlined } from "@ant-design/icons-vue";

export default {
  name: "HeaderMenu",
  components: { MenuOutlined, AppstoreOutlined },
  props: {
    showMenuToggle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggleSidebar"],
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);
    const route = useRoute();
    const currentRoute = computed(() => route.path);

    useOnlineStatus(localStorage.getItem('token'));

    const menus = ref([]);
    const navDrawerOpen = ref(false);

    const logout = () => {
      localStorage.removeItem("token");
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

    onMounted(() => {
      menus.value = menuList();
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
