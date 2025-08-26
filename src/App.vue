<template>
  <div id="app">
    <div v-if="isAuthPage">
      <!-- Render login page only -->
      <router-view />
    </div>
    <a-layout v-else id="components-layout-demo-custom-trigger">
      <LeftLayout />
      <a-layout>
        <HeaderMenu />
        <a-layout-content style="min-height: 80vh;" class="main-container">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { reactive, provide, onMounted } from 'vue'
import LeftLayout from './components/LeftLayout.vue'
import HeaderMenu from './components/HeaderMenu.vue'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'App',
  data() {
    return {
      currentLang: 'en',
      translations: {}
    }
  },
  components: {
    LeftLayout,
    HeaderMenu
  },
  setup() {
    const route = useRoute()

    const isAuthPage = computed(() => route.path.startsWith('/admin'))

    return { isAuthPage }
  },
  methods: {
    async loadLanguage(lang) {
      try {
        const langmodule = await import(`@/lang/${lang}.js`);
        this.translations = langmodule.default;
      } catch (e) {
        console.error(`Failed to load language ${lang}`, e)
      }
    }
  },
  provide() {
    return {
      langState: this // we provide `this` so children can access both currentLang and translations
    }
  },
  mounted() {
    this.loadLanguage(this.currentLang)
  }
};

const state = reactive({
  currentLang: 'en',
  translations: {}
})

async function loadLanguage(lang) {
  try {
    const langmodule = await import(`@/lang/${lang}.js`)
    state.translations = langmodule.default
  } catch (e) {
    console.error(`Failed to load language ${lang}`, e)
  }
}

provide('langState', state)

onMounted(() => {
  loadLanguage(state.currentLang)
})

</script>