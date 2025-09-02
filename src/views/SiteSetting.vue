<template>
  <a-layout class="bg-white pt-5 pb-5">
    <!-- Sticky Header -->
    <a-layout
      class="bg-white d-flex flex-row justify-between items-center px-5 sticky-header"
    >
      <a-typography-text class="text-dark-grey fs-1">
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
    <a-layout class="bg-white px-5">
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
      <CustomerCenterSetting
        v-if="dataSource"
        :dataSource="dataSource"
        ref="customerCenterRef"
      />
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { routeLink } from "@/utils/route-link";
import { message } from "ant-design-vue";
import { SaveOutlined } from "@ant-design/icons-vue";
import SiteActivationSetting from "@/components/site-setting/SiteActivation.vue";
import SiteSecuritySetting from "@/components/site-setting/SiteSecurity.vue";
import SiteTextSetting from "@/components/site-setting/SiteText.vue";
import MembershipSetting from "@/components/site-setting/Membership.vue";
import ChargeSetting from "@/components/site-setting/Charge.vue";
import CurrencyExchangeSetting from "@/components/site-setting/CurrencyExchange.vue";
import CustomerCenterSetting from "@/components/site-setting/CustomerCenter.vue";
import { apiLink } from "@/utils/api-link";
import { getData, postData } from "@/helpers/Axios.js";

export default {
  name: routeLink.site_setting.name,
  components: {
    SaveOutlined,
    SiteActivationSetting,
    SiteSecuritySetting,
    SiteTextSetting,
    MembershipSetting,
    ChargeSetting,
    CurrencyExchangeSetting,
    CustomerCenterSetting,
  },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

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
      if (res.status && res.data.length > 0) {
        dataSource.value = res.data[0];
      }
    };

    const saveData = async () => {
      const activationState = siteActivationRef.value?.getState();
      const securityState = siteSecurityRef.value?.getState();
      const siteTextState = siteTextRef.value?.getState();
      const membershipState = membershipRef.value?.getState();
      const chargeState = chargeRef.value?.getState();
      const exchangeState = exchangeRef.value?.getState();
      const customerCenterState = customerCenterRef.value?.getState();
      const payload = {
        siteActivation: activationState,
        siteSecurity: securityState.check,
        siteText: siteTextState,
        membership: membershipState,
        charge: chargeState,
        exchange: exchangeState,
        customerCenter: customerCenterState.check,
      };
      const res = await postData(apiLink.site_setting, payload);
      if (res.status) {
        message.success(trlang.value.saved_successful);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      dataSource,
      saveData,
      siteActivationRef,
      siteSecurityRef,
      siteTextRef,
      membershipRef,
      chargeRef,
      exchangeRef,
      customerCenterRef,
    };
  },
};
</script>
