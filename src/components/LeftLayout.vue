<template>
  <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible v-if="!isLoginPage">
    <h3 class="admin-dashboard-title">
      {{ translations.admin_dashboard_title }}
    </h3>
    <div class="admin-main-functions">
      
    </div>
    <a-menu
      theme="dark"
      mode="inline"
      :default-selected-keys="[selNavItem]"
      :default-open-keys="[openNavItem]"
      :inline-collapsed="collapsed"
    >
      <!-- Users -->
      <a-sub-menu key="users">
        <template #title>
          <UserOutlined />
          <span>Users</span>
        </template>
        <a-menu-item key="users">
          <router-link to="/admin/users">{{ translations.game_menu }}</router-link>
        </a-menu-item>
        <a-menu-item key="adduser">
          <router-link to="/admin/adduser">Add User</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { 
  UserOutlined, 
} from '@ant-design/icons-vue'

// Inject the provided state
const langState = inject('langState');
const translations = computed(() => langState.translations);

const collapsed = ref(false)
const isLoginPage = ref(false)
const selNavItem = ref('admindashboard')
const openNavItem = ref('users')
</script>