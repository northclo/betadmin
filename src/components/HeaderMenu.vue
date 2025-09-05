<template>
  <a-layout-header class="bg-white d-flex items-center header-content">
    <a-layout class="bg-white d-flex flex-row gap-2">
      <a-dropdown v-for="menu in menus" :key="menu.key">
        <div
          class="d-flex flex-column items-center cursor-pointer"
          @click="clickMenu(menu.to)"
        >
          <component :is="menu.icon" class="header-icon" />
          <a-typography-text class="header-label text-main font-bold">
            {{ trlang[menu.label] }}
          </a-typography-text>
        </div>
        <template #overlay v-if="menu.children">
          <a-menu>
            <a-menu-item v-for="child in menu.children" :key="child.key">
              <a :href="child.to">{{ trlang[child.label] }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-layout>
    <a-dropdown>
      <a class="ant-dropdown-link font-bold text-main" @click.prevent>
        <a-avatar>
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:;" class="text-red" @click="logout">{{
              trlang.logout
            }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-header>
</template>

<script>
import { inject, computed, ref, onMounted } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";
import router from "@/Router";
import { routeLink } from "@/utils/route-link";
import { menuList } from "@/utils/menu-list";

export default {
  name: "HeaderMenu",
  components: { UserOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const menus = ref([]);

    const logout = () => {
      localStorage.removeItem("token");
      router.push(routeLink.login.link);
    };

    const clickMenu = (link) => {
      if (link) {
        router.push(link);
      }
    };

    onMounted(() => {
      menus.value = menuList();
    });

    return { trlang, menus, logout, clickMenu };
  },
};

// const isMobile = ref(window.innerWidth < 1000);

// const handleResize = () => {
//   isMobile.value = window.innerWidth < 1000;
// };

// onMounted(() => {
//   window.addEventListener("resize", handleResize);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", handleResize);
// });

// defineProps({ collapsed: Boolean });
</script>
