<template>
  <a-layout class="bg-white p-2">
    <a-typography-text class="text-dark-gray font-bold p-2 fs-4 mb-2 border-bottom">
      <RightCircleFilled />
      {{ trlang.change_administrator_password }}
    </a-typography-text>

    <a-typography-text class="text-dark-brown">
      {{ trlang.you_are_the_administrator }}
      {{ trlang.please_keep_your_password_secure }}
    </a-typography-text>
    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="adminId" />
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
import { computed, inject, ref } from 'vue';
import { RightCircleFilled } from '@ant-design/icons-vue';

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const adminId = ref('');
const password = ref('');
const confirmPassword = ref('');
</script>
