<template>
  <a-modal :open="open" :title="trlang.partner_registration" :ok-text="trlang.register" :cancel-text="trlang.cancel"
    @ok="register" @cancel="$emit('update:open', false)">
    <PartnerMemberInformation />
    <CurrencyRollingSetting />
    <PartnerRateSetting />
    <PartnerPermissionSetting />
    <PartnerGameSetting />
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject } from "vue";
import PartnerMemberInformation from "@/components/partner/register-partner/PartnerMemberInformation.vue";
import CurrencyRollingSetting from "@/components/partner/register-partner/CurrencyRollingSetting.vue";
import PartnerRateSetting from "@/components/partner/register-partner/PartnerRateSetting.vue";
import PartnerPermissionSetting from "@/components/partner/register-partner/PartnerPermissionSetting.vue";
import PartnerGameSetting from "@/components/partner/register-partner/PartnerGameSetting.vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  open: Boolean,
});

defineEmits('update:open')

const register = () => {
  console.log("Register user logic here");
};
</script>
