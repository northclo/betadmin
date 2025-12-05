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
      <LeftLayout class="flex-0 h-100vh" />
      <a-layout class="flex-1 h-100vh overflow-y-auto main-content">
        <NotificationBar />
        <HeaderMenu />
        <a-layout-content class="w-100 min-w-100 max-w-fit p-5 content-wrapper">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { reactive, provide, onMounted, computed, ref } from "vue";
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

async function loadLanguage(lang) {
  try {
    const langmodule = await import(`@/lang/${lang}.js`);
    state.translations = langmodule.default;
  } catch (e) {
    console.error(`Failed to load language ${lang}`, e);
  }
}

provide("langState", state);

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
  loadPermissions();
});
</script>
