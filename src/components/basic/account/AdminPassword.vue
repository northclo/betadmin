<template>
  <a-layout class="bg-white p-2">
    <a-typography-text class="text-dark-gray font-bold p-2 fs-4 mb-2 border-bottom">
      <RightCircleFilled />
      {{ trlang.change_administrator_password }}
    </a-typography-text>

    <p class="text-helper mb-1">
      {{ trlang.you_are_the_administrator }}
      {{ trlang.please_keep_your_password_secure }}
    </p>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="adminId" disabled />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="password" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.confirm_administrator_password }}
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

import { checkValidEmail } from '@/helpers/Common.js';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ id: '', passwordChangedAt: null }),
  },
});

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const adminId = ref('');
const password = ref('');
const confirmPassword = ref('');

watch(
  () => props.data,
  (value) => {
    adminId.value = value?.id ?? '';
    password.value = '';
    confirmPassword.value = '';
  },
  { immediate: true, deep: true },
);

const buildPayload = () => {
  const id = adminId.value.trim();
  const payload = { id };
  const newPassword = password.value.trim();
  if (newPassword) {
    payload.password = newPassword;
  }
  return payload;
};

const validate = () => {
  const errors = [];
  const id = adminId.value.trim();
  const newPassword = password.value.trim();
  const confirm = confirmPassword.value.trim();

  if (!id) {
    errors.push(trlang.value.please_enter_administrator_id);
  } else if (!checkValidEmail(id)) {
    errors.push(trlang.value.administrator_id_must_be_valid_email);
  }

  if (newPassword || confirm) {
    if (newPassword.length < 8) {
      errors.push(trlang.value.administrator_password_min_length);
    }
    if (newPassword !== confirm) {
      errors.push(trlang.value.administrator_password_mismatch);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: buildPayload(),
  };
};

const reset = () => {
  password.value = '';
  confirmPassword.value = '';
};

defineExpose({ validate, reset });
</script>
