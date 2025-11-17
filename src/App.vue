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
        <HeaderMenu
          :show-menu-toggle="isMobile"
          @toggle-sidebar="showSidebar = true"
        />
        <a-layout-content class="w-100 min-w-100 max-w-fit p-5 content-wrapper">
          <div class="page-shell">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { reactive, provide, onMounted, computed, ref, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import LeftLayout from "./components/LeftLayout.vue";
import HeaderMenu from "./components/HeaderMenu.vue";
import { socket } from "@/plugins/socket.js";

const route = useRoute();
const router = useRouter();
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

const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error("Error playing alert sound:", error);
  }
};

const handleNewSupportMessage = (data) => {
  playAlertSound();

  const translations = state.translations || {};
  notification.open({
    message: translations.new_support_message || "New Support Message",
    description: `${translations.user || "User"}: ${data.user_nickname || "Unknown"} - ${data.title || ""}`,
    duration: 5,
    placement: "topRight",
    onClick: () => {
      router.push("/service-center");
    },
  });
};

onMounted(() => {
  loadLanguage(state.currentLang);
  updateViewport();
  window.addEventListener("resize", updateViewport);

  if (!isAuthPage.value) {
    socket.on("new_support_message", handleNewSupportMessage);
  }
});

onBeforeUnmount(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  window.removeEventListener("resize", updateViewport);
  
  socket.off("new_support_message", handleNewSupportMessage);
});

watch(
  () => route.path,
  () => {
    showSidebar.value = false;
  }
);

watch(
  () => isAuthPage.value,
  (newVal) => {
    if (!newVal) {
      socket.on("new_support_message", handleNewSupportMessage);
    } else {
      socket.off("new_support_message", handleNewSupportMessage);
    }
  },
  { immediate: true }
);
</script>
