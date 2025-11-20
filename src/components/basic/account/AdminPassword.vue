<template>
  <a-layout>
    <a-typography-text class="text-dark-gray font-bold fs-4 mb-4">
      <RightCircleFilled />
      {{ trlang.change_administrator_password }}
    </a-typography-text>

    <p class="text-helper mb-1">
      {{ trlang.you_are_the_administrator }}
      {{ trlang.please_keep_your_password_secure }}
    </p>

    <a-layout class="bg-none">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-input v-model:value="adminId" disabled />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-input-password v-model:value="password" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.confirm_administrator_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-input-password v-model:value="confirmPassword" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { RightCircleFilled } from '@ant-design/icons-vue';

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
  const newPassword = password.value.trim();
  const payload = { id };
  if (newPassword) {
    payload.password = newPassword;
  }
  return payload;
};

const validate = () => {
  const errors = [];
  const newPassword = password.value.trim();
  const confirm = confirmPassword.value.trim();

  if (!newPassword && !confirm) {
    return {
      valid: true,
      errors: [],
      data: null,
    };
  }

  if (!newPassword) {
    errors.push(trlang.value.administrator_password_required);
  } else if (newPassword.length < 6) {
    errors.push(trlang.value.administrator_password_min_length);
  }

  if (!confirm) {
    errors.push(trlang.value.please_confirm_administrator_password);
  } else if (newPassword && newPassword !== confirm) {
    errors.push(trlang.value.administrator_password_mismatch);
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
