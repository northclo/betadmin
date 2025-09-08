<template>
  <a-collapse-panel key="1" class="bg-white">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.site_activation_setting }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.site_activation }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2 items-center">
        <a-switch v-model:checked="siteActivation" class="w-fit" />
        <a-typography-text>
          {{ siteActivation ? trlang.active : trlang.deactive }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.how_to_display_when_site_is_disabled }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2 items-center flex-wrap">
        <a-button
          v-for="item in disableStyleOptions"
          :key="item.key"
          :class="item.key === disableStyle ? 'bg-main text-white' : ''"
          @click="disableStyle = item.key"
        >
          <CheckOutlined v-if="item.key === disableStyle" /> {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_site_is_deactivated }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea v-model:value="deactiveMessage" :rows="4" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const siteActivation = ref(true);
const disableStyleOptions = ref([]);
const disableStyle = ref(null);
const deactiveMessage = ref('');

// Initialize display options
const getDisplayOptions = () => {
  disableStyleOptions.value = [
    { key: 'simple_text', text: trlang.value.simple_text },
    { key: 'login_box', text: trlang.value.login_box },
    { key: 'page_not_found', text: trlang.value.page_not_found_404 },
  ];
};

onBeforeMount(getDisplayOptions);

// Sync with dataSource
watch(
  () => props.dataSource,
  (newVal) => {
    if (!newVal) return;
    siteActivation.value = newVal.site_activation;
    disableStyle.value = newVal.disable_style;
    deactiveMessage.value = newVal.deactive_message;
  },
  { immediate: true }
);

// Expose state for parent
defineExpose({
  getState: () => ({
    siteActivation: siteActivation.value,
    disableStyle: disableStyle.value,
    deactiveMessage: deactiveMessage.value,
  }),
});
</script>
