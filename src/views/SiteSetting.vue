<template>
  <a-layout class="flex flex-row justify-between items-center mb-4">
    <a-typography-title :level="3">
      {{ trlang.site_setting }}
    </a-typography-title>
    <a-button 
      class="bg-main text-white flex justify-center items-center" 
      @click="saveData"
      :loading="saving"
      :disabled="loading"
    >
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-spin :spinning="loading">
    <a-collapse class="flex flex-column gap-2 border-0">
      <SiteActivationSetting v-if="dataSource" ref="siteActivationRef" :data-source="dataSource" />
      <SiteSecuritySetting v-if="dataSource" ref="siteSecurityRef" :data-source="dataSource" />
      <SiteTextSetting v-if="dataSource" ref="siteTextRef" :data-source="dataSource" />
      <MembershipSetting v-if="dataSource" ref="membershipRef" :data-source="dataSource" />
      <ChargeSetting v-if="dataSource" ref="chargeRef" :data-source="dataSource" />
      <CurrencyExchangeSetting v-if="dataSource" ref="exchangeRef" :data-source="dataSource" />
      <CustomerCenterSetting v-if="dataSource" ref="customerCenterRef" :data-source="dataSource" />
      <DepositBankSetting v-if="dataSource" ref="depositBankRef" :data-source="dataSource" />
    </a-collapse>
  </a-spin>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { SaveOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { routeLink } from '@/utils/route-link';
import { apiLink } from '@/utils/api-link';
import { getData, postData } from '@/helpers/Axios.js';
import SiteActivationSetting from '@/components/basic/setting/SiteActivation.vue';
import SiteSecuritySetting from '@/components/basic/setting/SiteSecurity.vue';
import SiteTextSetting from '@/components/basic/setting/SiteText.vue';
import MembershipSetting from '@/components/basic/setting/MembershipSetting.vue';
import ChargeSetting from '@/components/basic/setting/ChargeSetting.vue';
import CurrencyExchangeSetting from '@/components/basic/setting/CurrencyExchange.vue';
import CustomerCenterSetting from '@/components/basic/setting/CustomerCenter.vue';
import DepositBankSetting from '@/components/basic/setting/DepositBankSetting.vue';

defineOptions({ name: routeLink.site_setting.name });

const router = useRouter();
const store = useStore();

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const dataSource = ref(null);
const loading = ref(false);
const saving = ref(false);
const siteActivationRef = ref(null);
const siteSecurityRef = ref(null);
const siteTextRef = ref(null);
const membershipRef = ref(null);
const chargeRef = ref(null);
const exchangeRef = ref(null);
const customerCenterRef = ref(null);
const depositBankRef = ref(null);

const fetchData = async () => {
  const isHeadquater = store.getters.isHeadquater;
  if (!isHeadquater) {
    message.error(trlang.value.permission_denied);
    router.push(routeLink.dashboard.link);
    return;
  }

  try {
    loading.value = true;
    const res = await getData(apiLink.site_setting);
    if (res.status && res.data) {
      dataSource.value = res.data;
    } else {
      message.error(trlang.value.failed_to_load_settings || 'Failed to load settings');
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    message.error(trlang.value.failed_to_load_settings || 'Failed to load settings');
  } finally {
    loading.value = false;
  }
};

const saveData = async () => {
  try {
    saving.value = true;

    const validationResults = {
      charge: chargeRef.value?.validate?.(),
      exchange: exchangeRef.value?.validate?.(),
    };

    const validationErrors = Object.values(validationResults)
      .filter((result) => result && !result.valid)
      .flatMap((result) => result.errors);

    if (validationErrors.length) {
      validationErrors.forEach((error) => message.error(error));
      return;
    }

    const siteActivationState = siteActivationRef.value?.getState?.();
    const siteSecurityState = siteSecurityRef.value?.getState?.();
    const siteTextState = siteTextRef.value?.getState?.();
    const membershipState = membershipRef.value?.getState?.();
    const customerCenterState = customerCenterRef.value?.getState?.();
    const depositBankState = depositBankRef.value?.getState?.();

    if (!siteActivationState || !siteSecurityState || !siteTextState || !membershipState || !customerCenterState || !depositBankState) {
      message.error(trlang.value.failed_to_load_settings || 'Failed to load settings');
      return;
    }

    const payload = {
      siteActivation: siteActivationState,
      security: siteSecurityState.security ?? true,
      siteText: siteTextState,
      membership: membershipState,
      charge:
        validationResults.charge?.data ?? chargeRef.value?.getState?.() ?? {},
      exchange:
        validationResults.exchange?.data ?? exchangeRef.value?.getState?.() ?? {},
      customerCenter: customerCenterState.customerCenter ?? true,
      depositBanks: depositBankState || { depositBanks: [] },
    };

    const res = await postData(apiLink.site_setting, payload);
    if (res.status) {
      message.success(trlang.value.saved_successful || 'Settings saved successfully');
      await fetchData();
    } else {
      message.error(trlang.value.failed_to_save_settings || 'Failed to save settings');
    }
  } catch (error) {
    console.error('Error saving site settings:', error);
    message.error(trlang.value.failed_to_save_settings || 'Failed to save settings');
  } finally {
    saving.value = false;
  }
};

onMounted(fetchData);
</script>
