<template>
  <a-layout class="bg-white flex flex-row justify-between items-center p-5">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.change_administrator_information }}
    </a-typography-text>
    <a-button
      class="bg-main text-white flex justify-center items-center"
      :loading="saving"
      @click="saveAccount"
    >
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-layout class="p-2">
    <AdminPassword ref="adminPasswordRef" :data="adminAccount" />
    <ViewManagerPassword
      ref="viewManagerPasswordRef"
      :data="viewManagerAccount"
    />
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
import ViewManagerPassword from '@/components/basic/account/ViewManagerPassword.vue';

export default {
  name: routeLink.admin_account.name,
  components: { SaveOutlined, AdminPassword, ViewManagerPassword },
  setup() {
    const langState = inject('langState');
    const trlang = computed(() => langState?.translations || {});

    const adminAccount = ref({ id: '', passwordChangedAt: null });
    const viewManagerAccount = ref({ id: '', passwordChangedAt: null });

    const adminPasswordRef = ref(null);
    const viewManagerPasswordRef = ref(null);

    const saving = ref(false);

    const fetchAccount = async () => {
      const res = await getData(apiLink.admin_account);
      if (res.status && res.data) {
        adminAccount.value = {
          id: res.data.admin?.id ?? '',
          passwordChangedAt: res.data.admin?.passwordChangedAt ?? null,
        };
        viewManagerAccount.value = {
          id: res.data.viewManager?.id ?? '',
          passwordChangedAt: res.data.viewManager?.passwordChangedAt ?? null,
        };
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
      const viewManagerValidation = viewManagerPasswordRef.value?.validate?.();

      const errors = [];
      [adminValidation, viewManagerValidation]
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

      if (viewManagerValidation?.data) {
        const viewManagerPayload = sanitizePayload(viewManagerValidation.data);
        if (viewManagerPayload) {
          payload.viewManager = viewManagerPayload;
        }
      }

      if (!payload.admin && !payload.viewManager) {
        message.error(trlang.value.please_fill_at_least_one_field);
        return;
      }

      saving.value = true;
      try {
        const res = await postData(apiLink.admin_account, payload);
        if (res.status) {
          message.success(trlang.value.saved_successful);
          adminPasswordRef.value?.reset?.();
          viewManagerPasswordRef.value?.reset?.();
          await fetchAccount();
        }
      } finally {
        saving.value = false;
      }
    };

    onMounted(fetchAccount);

    return {
      trlang,
      adminAccount,
      viewManagerAccount,
      adminPasswordRef,
      viewManagerPasswordRef,
      saveAccount,
      saving,
    };
  },
};
</script>
