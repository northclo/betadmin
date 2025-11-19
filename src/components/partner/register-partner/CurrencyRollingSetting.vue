<template>
  <a-layout class="mt-5">
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.currency_rolling_settings }}
    </a-typography-text>

    <a-layout class="mt-2 border-b border-t">
      <a-layout-sider class="border p-2 setting-sider">
        <a-switch v-model:checked="check" class="w-fit mr-2" />
        <a-typography-text class="flex items-center text-white ms-2">
          {{ check ? trlang.use : trlang.no_use }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center flex-wrap gap-2">
        <a-typography-text>
          {{ trlang.the_last_deposit_approved_amount }}
        </a-typography-text>
        <a-input-number v-model:value="amount" class="input-sm" :min="0" :max="100" />
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
import { ref, computed, inject, defineExpose, watch } from "vue";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  partnerData: {
    type: Object,
    default: null,
  },
});

const check = ref(false);
const amount = ref("");

const loadData = () => {
  if (props.partnerData) {
    check.value = props.partnerData.currency_rolling ?? false;
    amount.value = props.partnerData.deposit_approved_amount ?? "";
  }
};

watch(() => props.partnerData, (newData) => {
  if (newData) {
    loadData();
  }
}, { immediate: true });

const reset = () => {
  check.value = false;
  amount.value = "";
};

defineExpose({
  getState: () => ({ check: check.value, amount: amount.value }),
  reset,
});
</script>
