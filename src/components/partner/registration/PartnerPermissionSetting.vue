<template>
  <a-collapse-panel key="2" class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 lh-0">
        {{ trlang.partner_permissions_settings }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.partner_page_access_rights
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center">
          {{ isActive ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.permission_to_create_sub_partners
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center">
          {{ isActive ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.member_creation_authority
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center">
          {{ isActive ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.authority_to_change_subordinate_partner_settlement_rates
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center">
          {{ isActive ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.sub_partner_money_change_authority }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center">
          {{ isActive ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
  },
});

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive toggle state */
const isActive = ref(false);

/* Sync state with props */
watch(
  () => props.dataSource?.siteSecurity,
  (newVal) => {
    isActive.value = Boolean(newVal);
  },
  { immediate: true }
);

/* Expose state for parent access */
defineExpose({
  getState: () => ({ isActive: isActive.value }),
});
</script>
