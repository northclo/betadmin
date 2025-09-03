<template>
  <div id="app">
    <div v-if="isAuthPage">
      <router-view />
    </div>
    <a-layout v-else class="h-100vh d-flex flex-row">
      <LeftLayout class="flex-0 h-100vh" />
      <a-layout class="flex-1 h-100vh overflow-y-auto">
        <HeaderMenu />
        <a-layout-content class="p-2 w-100 min-w-100 max-w-fit">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { reactive, provide, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import LeftLayout from "./components/LeftLayout.vue";
import HeaderMenu from "./components/HeaderMenu.vue";

const route = useRoute();
const isAuthPage = computed(() => route.path.startsWith("/auth"));

// language state
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

onMounted(() => {
  loadLanguage(state.currentLang);
});
</script>
