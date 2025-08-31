<template>
  <a-layout class="bg-white p-5">
    <a-typography-text class="text-dark-grey fs-1">
      {{ trlang.site_setting }}
    </a-typography-text>

    <SiteActivationSetting />
    <SiteSecuritySetting />
    <SiteTextSetting />
    <MembershipSetting />
    <CurrencyExchangeSetting />
    <CustomerCenterSetting />
  </a-layout>
</template>

<script>
import { computed, inject } from "vue";
import { routeLink } from "@/utils/route-link";
import SiteActivationSetting from "@/components/setting/site-activation.vue";
import SiteSecuritySetting from "@/components/setting/site-security.vue";
import SiteTextSetting from "@/components/setting/site-text.vue";
import MembershipSetting from "@/components/setting/membership.vue";
import CurrencyExchangeSetting from "@/components/setting/currency-exchange.vue";
import CustomerCenterSetting from "@/components/setting/customer-center.vue";

export default {
  name: routeLink.site_setting.name,
  components: {
    SiteActivationSetting,
    SiteSecuritySetting,
    SiteTextSetting,
    MembershipSetting,
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
