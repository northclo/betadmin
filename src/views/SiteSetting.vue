<template>
  <a-layout class="bg-white flex flex-row justify-between items-center px-5">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.site_setting }}
    </a-typography-text>
    <a-button class="bg-main text-white flex justify-center items-center" @click="saveData">
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-collapse class="flex flex-column gap-2 p-2 border-0">
    <SiteActivationSetting v-if="dataSource" ref="siteActivationRef" :data-source="dataSource" />
    <SiteSecuritySetting v-if="dataSource" ref="siteSecurityRef" :data-source="dataSource" />
    <SiteTextSetting v-if="dataSource" ref="siteTextRef" :data-source="dataSource" />
    <MembershipSetting v-if="dataSource" ref="membershipRef" :data-source="dataSource" />
    <ChargeSetting v-if="dataSource" ref="chargeRef" :data-source="dataSource" />
    <CurrencyExchangeSetting v-if="dataSource" ref="exchangeRef" :data-source="dataSource" />
    <CustomerCenterSetting v-if="dataSource" ref="customerCenterRef" :data-source="dataSource" />
  </a-collapse>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
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

defineOptions({ name: routeLink.site_setting.name });

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const dataSource = ref(null);
const siteActivationRef = ref(null);
const siteSecurityRef = ref(null);
const siteTextRef = ref(null);
const membershipRef = ref(null);
const chargeRef = ref(null);
const exchangeRef = ref(null);
const customerCenterRef = ref(null);

const fetchData = async () => {
  const res = await getData(apiLink.site_setting);
  if (res.status && res.data) {
    dataSource.value = res.data;
  }
};

const saveData = async () => {
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

  if (!siteActivationState || !siteSecurityState || !siteTextState || !membershipState || !customerCenterState) {
    message.error(trlang.value.failed_to_load_settings);
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
  };

  const res = await postData(apiLink.site_setting, payload);
  if (res.status) {
    message.success(trlang.value.saved_successful);
  }
};

onMounted(fetchData);
</script>
