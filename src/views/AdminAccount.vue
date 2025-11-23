<template>
  <a-layout class="flex flex-row justify-between items-center mb-4">
    <a-typography-title :level="3">
      {{ trlang.change_administrator_information }}
    </a-typography-title>
    <a-button
      class="bg-main text-white flex justify-center items-center"
      :loading="saving"
      @click="saveAccount"
    >
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-layout>
    <a-spin :spinning="loading">
      <AdminPassword ref="adminPasswordRef" :data="adminAccount" />
    </a-spin>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { routeLink } from '@/utils/route-link';
import { apiLink } from '@/utils/api-link';
import { getData, postData } from '@/helpers/Axios.js';
import { SaveOutlined } from '@ant-design/icons-vue';
import AdminPassword from '@/components/basic/account/AdminPassword.vue';

export default {
  name: routeLink.admin_account.name,
  components: { SaveOutlined, AdminPassword },
  setup() {
    const langState = inject('langState');
    const trlang = computed(() => langState?.translations || {});

    const adminAccount = ref({ id: '', passwordChangedAt: null });

    const adminPasswordRef = ref(null);

    const saving = ref(false);
    const loading = ref(false);

    const fetchAccount = async () => {
      loading.value = true;
      try {
        const res = await getData(apiLink.admin_account);
        if (res.status && res.data) {
          adminAccount.value = {
            id: res.data.admin?.id ?? '',
            passwordChangedAt: res.data.admin?.passwordChangedAt ?? null,
          };
        }
      } catch (error) {
        console.error('Error fetching admin account:', error);
        message.error(error.message || trlang.value.failed_to_fetch_data);
      } finally {
        loading.value = false;
      }
    };

    const sanitizePayload = (payload) => {
      if (!payload) return null;
      const result = { ...payload };
      if (!result.password) {
        delete result.password;
      }
      return result;
    };

    const saveAccount = async () => {
      const adminValidation = adminPasswordRef.value?.validate?.();

      const errors = [];
      [adminValidation]
        .filter(Boolean)
        .forEach((validation) => {
          if (!validation.valid) {
            validation.errors.forEach((error) => errors.push(error));
          }
        });

      if (errors.length) {
        errors.forEach((error) => message.error(error));
        return;
      }

      const payload = {};

      if (adminValidation?.data) {
        const adminPayload = sanitizePayload(adminValidation.data);
        if (adminPayload) {
          payload.admin = adminPayload;
        }
      }

      if (!payload.admin) {
        message.error(trlang.value.please_fill_at_least_one_field);
        return;
      }

      saving.value = true;
      try {
        const res = await postData(apiLink.admin_account, payload);
        if (res.status) {
          message.success(trlang.value.saved_successful);
          adminPasswordRef.value?.reset?.();
          await fetchAccount();
        }
      } catch (error) {
        console.error('Error saving admin account:', error);
        message.error(error.message || trlang.value.operation_failed);
      } finally {
        saving.value = false;
      }
    };

    onMounted(fetchAccount);

    return {
      trlang,
      adminAccount,
      adminPasswordRef,
      saveAccount,
      saving,
      loading,
    };
  },
};
</script>
