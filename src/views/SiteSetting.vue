<template>
  <a-layout class="bg-white pt-5 pb-5">
    <!-- Sticky Header -->
    <a-layout
      class="bg-white d-flex flex-row justify-between items-center px-5 sticky-header"
    >
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.site_setting }}
      </a-typography-text>
      <a-button
        class="bg-main text-white d-flex justify-center items-center"
        @click="saveData"
      >
        <SaveOutlined />
        {{ trlang.save }}
      </a-button>
    </a-layout>

    <!-- Scrollable Content -->
    <a-collapse class="bg-white px-5 border-0">
      <SiteActivationSetting
        v-if="dataSource"
        :dataSource="dataSource"
        ref="siteActivationRef"
      />
      <SiteSecuritySetting
        v-if="dataSource"
        :dataSource="dataSource"
        ref="siteSecurityRef"
      />
      <SiteTextSetting v-if="dataSource" :dataSource="dataSource" ref="siteTextRef" />
      <MembershipSetting v-if="dataSource" :dataSource="dataSource" ref="membershipRef" />
      <ChargeSetting v-if="dataSource" :dataSource="dataSource" ref="chargeRef" />
      <CurrencyExchangeSetting
        v-if="dataSource"
        :dataSource="dataSource"
        ref="exchangeRef"
      />
      <BankCardSetting v-if="dataSource" :dataSource="dataSource" ref="bankCardRef" />
      <CustomerCenterSetting
        v-if="dataSource"
        :dataSource="dataSource"
        ref="customerCenterRef"
      />
    </a-collapse>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { SaveOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { routeLink } from "@/utils/route-link";
import { apiLink } from "@/utils/api-link";
import { getData, postData } from "@/helpers/Axios.js";

import SiteActivationSetting from "@/components/site-setting/SiteActivation.vue";
import SiteSecuritySetting from "@/components/site-setting/SiteSecurity.vue";
import SiteTextSetting from "@/components/site-setting/SiteText.vue";
import MembershipSetting from "@/components/site-setting/MembershipSetting.vue";
import ChargeSetting from "@/components/site-setting/ChargeSetting.vue";
import CurrencyExchangeSetting from "@/components/site-setting/CurrencyExchange.vue";
import BankCardSetting from "@/components/site-setting/BankCard.vue";
import CustomerCenterSetting from "@/components/site-setting/CustomerCenter.vue";

/* Page Name */
defineOptions({ name: routeLink.site_setting.name });

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Data */
const dataSource = ref(null);

/* Child refs */
const siteActivationRef = ref(null);
const siteSecurityRef = ref(null);
const siteTextRef = ref(null);
const membershipRef = ref(null);
const chargeRef = ref(null);
const exchangeRef = ref(null);
const bankCardRef = ref(null);
const customerCenterRef = ref(null);

/* Fetch Data */
const fetchData = async () => {
  const res = await getData(apiLink.site_setting);
  if (res.status && res.data.length > 0) {
    dataSource.value = res.data[0];
  }
};

/* Save Data */
const saveData = async () => {
  const payload = {
    siteActivation: siteActivationRef.value?.getState(),
    siteSecurity: siteSecurityRef.value?.getState().isActive,
    siteText: siteTextRef.value?.getState(),
    membership: membershipRef.value?.getState(),
    charge: chargeRef.value?.getState(),
    exchange: exchangeRef.value?.getState(),
    customerCenter: customerCenterRef.value?.getState().check,
  };

  const res = await postData(apiLink.site_setting, payload);
  if (res.status) {
    message.success(trlang.value.saved_successful);
  }
};

onMounted(fetchData);
</script>
