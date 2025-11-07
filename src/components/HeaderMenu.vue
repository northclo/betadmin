<template>
  <div class="header-wrapper">
    <a-layout-header class="flex items-center header-content">
      <a-layout class="flex flex-row gap-2">
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
  </div>
</template>

<script>
import { inject, computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/Router";
import { routeLink } from "@/utils/route-link";
import { menuList } from "@/utils/menu-list";
import { useOnlineStatus } from '@/composables/useOnlineStatus';

export default {
  name: "HeaderMenu",
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);
    const route = useRoute();
    const currentRoute = computed(() => route.path);

    useOnlineStatus(localStorage.getItem('token'));

    const menus = ref([]);

    const logout = () => {
      localStorage.removeItem("token");
      router.push(routeLink.login.link);
    };

    const clickMenu = (link) => {
      if (link && typeof link === 'string') {
        router.push(link);
      }
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

    return { trlang, menus, logout, clickMenu, currentRoute, isActiveMenu };
  },
};
</script>
