<template>
  <a-layout class="bg-white mt-5">
    <!-- Header -->
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.currency_rolling_settings }}
    </a-typography-text>

    <a-layout class="bg-white mt-2">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-switch v-model:checked="isActive" class="w-fit" />
        <a-typography-text class="d-flex items-center text-white ms-2">
          {{ isActive ? trlang.use : trlang.no_use }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center flex-wrap gap-2">
        <a-typography-text>
          {{ trlang.the_last_deposit_approved_amount }}
        </a-typography-text>
        <a-input v-model:value="minAmount" class="input-sm" />
        <a-typography-text>
          {{ trlang.withdrawal_request_is_not_possible_when_betting_less_than_percent }}
        </a-typography-text>
        <a-typography-text class="text-yellow">
          ( {{ trlang.check_if_the_ongoing_betting_amount_is_included }} )
        </a-typography-text>
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
