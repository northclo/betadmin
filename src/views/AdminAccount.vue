<template>
  <a-layout class="bg-white flex flex-row justify-between items-center p-5 sticky-header">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.change_administrator_information }}
    </a-typography-text>
    <a-button class="bg-main text-white flex justify-center items-center">
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-layout class="p-2">
    <AdminPassword />
    <ViewManagerPassword />
  </a-layout>
</template>

<script>
import { computed, inject } from 'vue';
import { routeLink } from '@/utils/route-link';
import { SaveOutlined } from '@ant-design/icons-vue';
import AdminPassword from '@/components/basic/account/AdminPassword.vue';
import ViewManagerPassword from '../components/basic/account/ViewManagerPassword.vue';

export default {
  name: routeLink.admin_account.name,
  components: { SaveOutlined, AdminPassword, ViewManagerPassword },
  setup() {
    const langState = inject('langState');
    const trlang = computed(() => langState.translations);

    return { trlang };
  },
};
</script>
