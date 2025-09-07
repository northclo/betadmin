<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_rate_setting }}
    </a-typography-text>

    <a-layout class="bg-white mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="flex items-center text-white">
          {{ trlang.partner_rate }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column gap-2">
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
          <a-input v-model:value="dapol" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input v-model:value="danpol" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input v-model:value="numberMatch" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
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
const dapol = ref(null);
const danpol = ref(null);
const numberMatch = ref(null);

/* Expose state for parent access */
defineExpose({
  getState: () => ({
    dapol: dapol.value,
    danpol: danpol.value,
    numberMatch: numberMatch.value,
  }),
});
</script>
