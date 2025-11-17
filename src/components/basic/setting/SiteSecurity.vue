<template>
  <a-collapse-panel key="2" class="bg-white">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 lh-0">
        {{ trlang.site_security_setting }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.use_security_code_when_loggin_in }}
        </a-typography-text>
      </a-layout-sider>

      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="security" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ security ? trlang.active : trlang.deactive }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from 'vue';

/* Props */
const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
  },
});

/* Inject language translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const security = ref(false);

watch(
  () => props.dataSource,
  (newVal) => {
    security.value = newVal.security ?? true;
  },
  { immediate: true }
);

defineExpose({
  getState: () => ({ security: security.value }),
});
</script>
