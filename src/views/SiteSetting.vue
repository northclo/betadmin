<template>
  <a-layout class="bg-white pt-5 pb-5">
    <a-layout class="bg-white d-flex flex-row justify-between items-center px-5">
      <a-typography-text class="text-dark-grey fs-1">
        {{ trlang.site_setting }}
      </a-typography-text>
      <a-button class="bg-main text-white">{{ trlang.save }}</a-button>
    </a-layout>

    <a-layout class="bg-white px-5">
      <SiteActivationSetting />
      <SiteSecuritySetting />
      <SiteTextSetting />
      <MembershipSetting />
      <ChargeSetting />
      <CurrencyExchangeSetting />
      <CustomerCenterSetting />
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject } from "vue";
import { routeLink } from "@/utils/route-link";
import SiteActivationSetting from "@/components/site-setting/SiteActivation.vue";
import SiteSecuritySetting from "@/components/site-setting/SiteSecurity.vue";
import SiteTextSetting from "@/components/site-setting/SiteText.vue";
import MembershipSetting from "@/components/site-setting/Membership.vue";
import ChargeSetting from "@/components/site-setting/Charge.vue";
import CurrencyExchangeSetting from "@/components/site-setting/CurrencyExchange.vue";
import CustomerCenterSetting from "@/components/site-setting/CustomerCenter.vue";

export default {
  name: routeLink.site_setting.name,
  components: {
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

    return { trlang };
  },
};
</script>
