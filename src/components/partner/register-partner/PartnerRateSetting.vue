<template>
  <a-layout class="bg-white mt-5">
    <!-- Header -->
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_rate_setting }}
    </a-typography-text>

    <a-layout class="bg-white mt-2">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="d-flex items-center text-white">
          {{ trlang.partner_rate }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex flex-column gap-2">
        <a-layout class="bg-white d-flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white d-flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white d-flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
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
