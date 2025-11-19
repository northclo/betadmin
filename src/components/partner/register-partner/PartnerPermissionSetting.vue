<template>
  <a-layout class="mt-5">
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.partner_permissions_settings }}
    </a-typography-text>

    <a-layout class="mt-2 border-t border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.partner_page_access_rights
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-switch v-model:checked="partnerPageAccess" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ partnerPageAccess ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.permission_to_create_sub_partners
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-switch v-model:checked="subPartnerCreate" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ subPartnerCreate ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.member_creation_authority
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-switch v-model:checked="memberCreate" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ memberCreate ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.authority_to_change_subordinate_partner_settlement_rates
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-switch v-model:checked="partnerSettlement" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ partnerSettlement ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.sub_partner_money_change_authority }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-switch v-model:checked="moneyChange" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ moneyChange ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose, watch } from "vue";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  partnerData: {
    type: Object,
    default: null,
  },
});

const partnerPageAccess = ref(false);
const subPartnerCreate = ref(false);
const memberCreate = ref(false);
const partnerSettlement = ref(false);
const moneyChange = ref(false);

const loadData = () => {
  if (props.partnerData) {
    partnerPageAccess.value = props.partnerData.partner_access_permission ?? false;
    subPartnerCreate.value = props.partnerData.sub_partner_creation_permission ?? false;
    memberCreate.value = props.partnerData.user_creation_permission ?? false;
    partnerSettlement.value = props.partnerData.sub_partner_settlement_rate ?? false;
    moneyChange.value = props.partnerData.sub_partner_money_change ?? false;
  }
};

watch(() => props.partnerData, (newData) => {
  if (newData) {
    loadData();
  }
}, { immediate: true });

const reset = () => {
  partnerPageAccess.value = false;
  subPartnerCreate.value = false;
  memberCreate.value = false;
  partnerSettlement.value = false;
  moneyChange.value = false;
};

defineExpose({
  getState: () => ({
    partnerPageAccess: partnerPageAccess.value,
    subPartnerCreate: subPartnerCreate.value,
    memberCreate: memberCreate.value,
    partnerSettlement: partnerSettlement.value,
    moneyChange: moneyChange.value,
  }),
  reset,
});
</script>
