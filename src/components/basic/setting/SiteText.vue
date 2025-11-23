<template>
  <a-collapse-panel key="3">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold leading-0 fs-4">
        {{ trlang.set_site_text }}
      </a-typography-text>
    </template>

    <div v-for="field in fields" :key="field.key">
      <a-layout>
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            field.label
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <component
            :is="field.isTextarea ? 'a-textarea' : 'a-input'"
            v-model:value="field.model.value"
            v-bind="field.isTextarea ? { rows: field.rows || 4, allowClear: true } : {}"
          />
          <p v-if="field.helperText" class="text-dark-brown text-helper mt-1">
            {{ field.helperText }}
          </p>
        </a-layout-content>
      </a-layout>
    </div>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from 'vue';

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const siteName = ref('');
const titleBar = ref('');
const copywriter = ref('');
const topNotifyMessage = ref('');
const depositAccount = ref('');

const loadData = (data) => {
  siteName.value = data.site_name || '';
  titleBar.value = data.title_bar || '';
  copywriter.value = data.copywriter || '';
  topNotifyMessage.value = data.top_notify_message || '';
  depositAccount.value = data.deposit_account_information || '';
};

watch(() => props.dataSource, loadData, { immediate: true });

const fields = computed(() => [
  { key: 'siteName', label: trlang.value.site_name, model: siteName },
  {
    key: 'titleBar',
    label: trlang.value.title_bar_display_text,
    model: titleBar,
  },
  {
    key: 'copywriter',
    label: trlang.value.bottom_copywriter_text,
    model: copywriter,
  },
  {
    key: 'topNotifyMessage',
    label: trlang.value.notification_message_at_the_top_of_the_site,
    model: topNotifyMessage,
    isTextarea: true,
  },
  {
    key: 'depositAccount',
    label: trlang.value.deposit_account_information,
    model: depositAccount,
    isTextarea: true,
  },
]);

defineExpose({
  getState: () => ({
    siteName: siteName.value,
    titleBar: titleBar.value,
    copywriter: copywriter.value,
    topNotifyMessage: topNotifyMessage.value,
    depositAccount: depositAccount.value,
  }),
});
</script>
