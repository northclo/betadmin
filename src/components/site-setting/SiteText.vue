<template>
  <a-collapse-panel key="3" class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold leading-0 fs-4">
        {{ trlang.set_site_text }}
      </a-typography-text>
    </template>

    <!-- Dynamic fields -->
    <div v-for="field in fields" :key="field.key">
      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            field.label
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <component
            :is="field.isTextarea ? 'a-textarea' : 'a-input'"
            v-model:value="field.model.value"
            v-bind="field.isTextarea ? { rows: field.rows || 4, allowClear: true } : {}"
          />
          <!-- Optional helper text -->
          <a-typography-text v-if="field.helperText" class="text-yellow">
            {{ field.helperText }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>
    </div>

    <!-- Disclaimer -->
    <a-typography-text class="text-yellow">
      * {{ trlang.the_applicability_of_this_item_may_vary_depending_on_the_design }}
    </a-typography-text>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const siteName = ref("");
const titlebarText = ref("");
const bottomCopyText = ref("");
const topMessage = ref("");
const depositInfo = ref("");

// Initialize state from dataSource
const loadData = (data) => {
  if (!data?.siteText) return;
  siteName.value = data.siteText.name || "";
  titlebarText.value = data.siteText.titlebar || "";
  bottomCopyText.value = data.siteText.copywriter || "";
  topMessage.value = data.siteText.topNotificationMessage || "";
  depositInfo.value = data.siteText.depositAccount || "";
};

watch(() => props.dataSource, loadData, { immediate: true });

// Fields array to reduce repetition
const fields = [
  { key: "siteName", label: trlang.value.site_name, model: siteName },
  {
    key: "titlebarText",
    label: trlang.value.title_bar_display_text,
    model: titlebarText,
  },
  {
    key: "bottomCopyText",
    label: trlang.value.bottom_copywriter_text,
    model: bottomCopyText,
  },
  {
    key: "topMessage",
    label: trlang.value.notification_message_at_the_top_of_the_site,
    model: topMessage,
    isTextarea: true,
    helperText: `* ${trlang.value.seperated_by_enter}`,
  },
  {
    key: "depositInfo",
    label: trlang.value.deposit_account_information,
    model: depositInfo,
    isTextarea: true,
  },
];

// Expose state to parent
defineExpose({
  getState: () => ({
    name: siteName.value,
    titlebar: titlebarText.value,
    copywriter: bottomCopyText.value,
    topNotificationMessage: topMessage.value,
    depositAccount: depositInfo.value,
  }),
});
</script>
