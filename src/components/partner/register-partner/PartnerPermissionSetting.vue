<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_permissions_settings }}
    </a-typography-text>

    <a-layout class="bg-none mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.partner_page_access_rights
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="parnterPageAccess" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ parnterPageAccess ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.permission_to_create_sub_partners
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="subPartnerCreate" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ subPartnerCreate ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.member_creation_authority
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="memberCreate" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ memberCreate ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.authority_to_change_subordinate_partner_settlement_rates
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="partnerSettlement" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ partnerSettlement ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.sub_partner_money_change_authority }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-switch v-model:checked="moneyChange" class="w-fit" />
        <a-typography-text class="flex items-center">
          {{ moneyChange ? trlang.possible : trlang.no_possible }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose } from "vue";

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive toggle state */
const parnterPageAccess = ref(false);
const subPartnerCreate = ref(false);
const memberCreate = ref(false);
const partnerSettlement = ref(false);
const moneyChange = ref(false);

/* Expose state for parent access */
defineExpose({
  getState: () => ({
    parnterPageAccess: parnterPageAccess.value,
    subPartnerCreate: subPartnerCreate.value,
    memberCreate: memberCreate.value,
    partnerSettlement: partnerSettlement.value,
    moneyChange: moneyChange.value,
  }),
});
</script>
