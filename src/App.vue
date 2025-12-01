<template>
  <div id="app">
    <div v-if="routerReady && isAuthPage">
      <router-view />
    </div>
    <a-layout
      v-else-if="routerReady && !isAuthPage"
      class="app-shell h-100vh flex flex-row"
      style="position: relative; z-index: 1;"
    >
      <LeftLayout v-if="!isMobile" class="flex-0 h-100vh" />
      <a-drawer
        v-else
        placement="left"
        :open="showSidebar"
        :width="320"
        @close="showSidebar = false"
        class="mobile-sider"
      >
        <LeftLayout />
      </a-drawer>
      <a-layout class="flex-1 h-100vh overflow-y-auto main-content">
        <NotificationBar />
        <HeaderMenu
          :show-menu-toggle="isMobile"
          @toggle-sidebar="showSidebar = true"
        />
        <a-layout-content class="w-100 min-w-100 max-w-fit p-5 content-wrapper">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { reactive, provide, onMounted, onBeforeUnmount, computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import LeftLayout from "./components/LeftLayout.vue";
import HeaderMenu from "./components/HeaderMenu.vue";
import NotificationBar from "./components/NotificationBar.vue";
import { getData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";

const route = useRoute();
const router = useRouter();
const store = useStore();
const routerReady = ref(false);
const isAuthPage = computed(() => route.path.startsWith("/auth"));

router
  .isReady()
  .then(() => {
    routerReady.value = true;
  })
  .catch((error) => {
    console.error("Router failed to initialize before mount", error);
    routerReady.value = true;
  });

const state = reactive({
  currentLang: "en",
  translations: {},
});

const isMobile = ref(false);
const showSidebar = ref(false);
const windowWidth = ref(window.innerWidth);

async function loadLanguage(lang) {
  try {
    const langmodule = await import(`@/lang/${lang}.js`);
    state.translations = langmodule.default;
  } catch (e) {
    console.error(`Failed to load language ${lang}`, e);
  }
}

provide("langState", state);

let resizeTimer = null;
const updateViewport = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(() => {
    windowWidth.value = window.innerWidth;
    isMobile.value = window.innerWidth <= 992;
    if (!isMobile.value) {
      showSidebar.value = false;
    }
  }, 150);
};

const loadPermissions = async () => {
  const token = localStorage.getItem("token");
  if (token && !isAuthPage.value) {
    try {
      const res = await getData(apiLink.admin_account);
      if (res.status && res.data) {
        if (res.data.permissions) {
          store.commit("setPermissions", res.data.permissions);
        }
        if (res.data.role) {
          store.commit("setPartnerRole", res.data.role);
        }
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
    }
  }
};

onMounted(() => {
  loadLanguage(state.currentLang);
  updateViewport();
  window.addEventListener("resize", updateViewport);
  loadPermissions();
});

onBeforeUnmount(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  window.removeEventListener("resize", updateViewport);
});

watch(
  () => route.path,
  () => {
    showSidebar.value = false;
  }
);

</script>
