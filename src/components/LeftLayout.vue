<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    class="h-100vh overflow-y-scroll"
  >
    <a-menu
      theme="dark"
      mode="inline"
      :default-selected-keys="[selNavItem]"
      :default-open-keys="[openNavItem]"
      :inline-collapsed="collapsed"
    >
      <!-- Loop through menu config -->
      <template v-for="item in menuItems" :key="item.key">
        <!-- If submenu -->
        <a-sub-menu v-if="item.children" :key="item.key">
          <template #title>
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.key">
            <router-link :to="child.to">
              {{ child.label }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>

        <!-- If single menu item -->
        <a-menu-item v-else :key="item.key">
          <component :is="item.icon" v-if="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { menuList } from "@/utils/menu-list";

// Inject the provided state
const langState = inject("langState");
const translations = computed(() => langState.translations);

const collapsed = ref(false);
const selNavItem = ref("");
const openNavItem = ref("");

// Menu config
const menuItems = computed(() => menuList(translations));
</script>
