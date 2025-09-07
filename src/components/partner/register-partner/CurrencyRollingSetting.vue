<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.currency_rolling_settings }}
    </a-typography-text>

    <a-layout class="bg-none mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-switch v-model:checked="check" class="w-fit" />
        <a-typography-text class="flex items-center text-white ms-2">
          {{ check ? trlang.use : trlang.no_use }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center flex-wrap gap-2">
        <a-typography-text>
          {{ trlang.the_last_deposit_approved_amount }}
        </a-typography-text>
        <a-input v-model:value="amount" class="input-sm" />
        <a-typography-text>
          {{ trlang.withdrawal_request_is_not_possible_when_betting_less_than_percent }}
        </a-typography-text>
        <a-typography-text class="text-dark-brown">
          ( {{ trlang.check_if_the_ongoing_betting_amount_is_included }} )
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose } from "vue";

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive toggle state */
const check = ref(false);
const amount = ref("");

/* Expose state for parent access */
defineExpose({
  getState: () => ({ check: check.value, amount: amount.value }),
});
</script>
