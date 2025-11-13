<template>
  <a-layout class="bg-white mt-2 p-2">
    <a-typography-text class="text-dark-gray font-bold p-2 fs-4 mb-2 border-bottom">
      <RightCircleFilled />
      {{ trlang.change_view_manager_password }}
    </a-typography-text>

    <p class="text-helper mb-1">
      {{ trlang.this_is_the_view_manager }}
      {{ trlang.please_keep_your_password_secure }}
    </p>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.view_manager_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="viewManagerId" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.view_manager_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="password" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.confirm_view_manager_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="confirmPassword" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { RightCircleFilled } from '@ant-design/icons-vue';

import { testEnglishNumberDashUnderscore } from '@/helpers/Common.js';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ id: '', passwordChangedAt: null }),
  },
});

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const viewManagerId = ref('');
const password = ref('');
const confirmPassword = ref('');

watch(
  () => props.data,
  (value) => {
    viewManagerId.value = value?.id ?? '';
    password.value = '';
    confirmPassword.value = '';
  },
  { immediate: true, deep: true },
);

const buildPayload = () => {
  const id = viewManagerId.value.trim();
  const newPassword = password.value.trim();
  const payload = { id };
  if (newPassword) {
    payload.password = newPassword;
  }
  return payload;
};

const validate = () => {
  const errors = [];
  const id = viewManagerId.value.trim();
  const newPassword = password.value.trim();
  const confirm = confirmPassword.value.trim();

  if (!id && !newPassword && !confirm) {
    return {
      valid: true,
      errors: [],
      data: null,
    };
  }

  if (!id) {
    errors.push(trlang.value.please_enter_view_manager_id);
  } else if (!testEnglishNumberDashUnderscore(4, 32, id)) {
    errors.push(trlang.value.view_manager_id_rule);
  }

  if (newPassword || confirm) {
    if (!newPassword) {
      errors.push(trlang.value.view_manager_password_required);
    } else if (newPassword.length < 8) {
      errors.push(trlang.value.view_manager_password_min_length);
    }

    if (!confirm) {
      errors.push(trlang.value.please_confirm_view_manager_password);
    } else if (newPassword !== confirm) {
      errors.push(trlang.value.view_manager_password_mismatch);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? buildPayload() : null,
  };
};

const reset = () => {
  password.value = '';
  confirmPassword.value = '';
};

defineExpose({ validate, reset });
</script>
