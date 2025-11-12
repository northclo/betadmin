<template>
  <a-layout class="menu-management-view">
    <header class="menu-header">
      <a-typography-title :level="3">{{ trlang.administrator_menu_management }}</a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.admin_menu_description }}
      </a-typography-text>
    </header>

    <a-card class="menu-card">
      <a-table
        :data-source="menuSource"
        :columns="columns"
        :pagination="{ pageSize: 10 }"
        row-key="key"
      >
        <template #headerCell="{ column }">
          <span>{{ column.title }}</span>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'label'">
            {{ trlang[record.label] || record.label }}
          </template>
          <template v-else-if="column.dataIndex === 'path'">
            <a-typography-text>{{ record.to || "-" }}</a-typography-text>
          </template>
          <template v-else-if="column.dataIndex === 'children'">
            <a-tag v-for="child in record.children" :key="child.key">
              {{ trlang[child.label] || child.label }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "AdminMenuManagementView" });

import { computed, inject } from "vue";
import { menuList } from "@/utils/menu-list";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const columns = [
  { title: trlang.value.menu_title ?? "Title", dataIndex: "label", key: "label" },
  { title: trlang.value.menu_path ?? "Path", dataIndex: "path", key: "path" },
  { title: trlang.value.child_menu ?? "Children", dataIndex: "children", key: "children" },
];

const menuSource = computed(() => menuList());
</script>

<style scoped>
.menu-management-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-card {
  background: var(--surface-color);
}
</style>

