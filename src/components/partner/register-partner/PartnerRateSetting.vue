<template>
  <a-layout class="mt-5">
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.partner_rate_setting }}
    </a-typography-text>

    <a-layout class="mt-2 border-t border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="flex items-center text-white">
          {{ trlang.partner_rate }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex flex-column gap-2">
        <a-layout class="flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
          <a-input-number v-model:value="dapol" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input-number v-model:value="danpol" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input-number v-model:value="numberMatch" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose, watch } from "vue";
import { usePermissions } from "@/composables/usePermissions.js";

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  partnerData: {
    type: Object,
    default: null,
  },
});

const { canChangeSettlementRate } = usePermissions();

const canEditRates = computed(() => {
  return canChangeSettlementRate.value;
});

/* Reactive toggle state */
const dapol = ref(null);
const danpol = ref(null);
const numberMatch = ref(null);

const loadData = () => {
  if (props.partnerData) {
    dapol.value = props.partnerData.simple_bet_rate ?? null;
    danpol.value = props.partnerData.combined_bet_rate ?? null;
    numberMatch.value = props.partnerData.match_num_bet_rate ?? null;
  }
};

watch(() => props.partnerData, (newData) => {
  if (newData) {
    loadData();
  }
}, { immediate: true });

const reset = () => {
  dapol.value = null;
  danpol.value = null;
  numberMatch.value = null;
};

defineExpose({
  getState: () => ({
    dapol: dapol.value,
    danpol: danpol.value,
    numberMatch: numberMatch.value,
  }),
  reset,
});
</script>
