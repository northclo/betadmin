<template>
  <a-collapse-panel key="1" class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.site_activation_setting }}
      </a-typography-text>
    </template>

    <!-- Site Activation Toggle -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.site_activation }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2 items-center">
        <a-switch v-model:checked="check" class="w-fit" />
        <a-typography-text>
          {{ check ? trlang.active : trlang.deactive }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <!-- Display options when site is disabled -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.how_to_display_when_site_is_disabled }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2 items-center flex-wrap">
        <a-button
          v-for="item in display"
          :key="item.key"
          :class="item.key === displayKey ? 'bg-main text-white' : ''"
          @click="displayKey = item.key"
        >
          <CheckOutlined v-if="item.key === displayKey" /> {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <!-- Deactivation Message -->
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
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const check = ref(true);
const display = ref([]);
const displayKey = ref(null);
const deactiveMessage = ref("");

// Initialize display options
const getDisplayOptions = () => {
  const options = [
    trlang.value.simple_text,
    trlang.value.login_box,
    trlang.value.page_not_found_404,
  ];
  display.value = options.map((text, idx) => ({ key: idx, text }));
};

onBeforeMount(getDisplayOptions);

// Sync with dataSource
watch(
  () => props.dataSource,
  (newVal) => {
    if (!newVal) return;
    check.value = newVal.siteActivation.allow;
    displayKey.value = newVal.siteActivation.disable;
    deactiveMessage.value = newVal.siteActivation.deactiveMessage;
  },
  { immediate: true }
);

// Expose state for parent
defineExpose({
  getState: () => ({
    allow: check.value,
    disable: displayKey.value,
    deactiveMessage: deactiveMessage.value,
  }),
});
</script>
