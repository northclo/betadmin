<template>
  <a-modal :open="open" :title="trlang.partner_registration" :ok-text="trlang.register" :cancel-text="trlang.cancel"
    @ok="register" @cancel="handleCancel" :confirm-loading="loading">
    <PartnerMemberInformation ref="memberInfoRef" />
    <CurrencyRollingSetting ref="currencyRollingRef" />
    <PartnerRateSetting ref="rateSettingRef" />
    <PartnerPermissionSetting ref="permissionSettingRef" />
    <PartnerGameSetting ref="gameSettingRef" />
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref } from "vue";
import { message } from "ant-design-vue";
import PartnerMemberInformation from "@/components/partner/register-partner/PartnerMemberInformation.vue";
import CurrencyRollingSetting from "@/components/partner/register-partner/CurrencyRollingSetting.vue";
import PartnerRateSetting from "@/components/partner/register-partner/PartnerRateSetting.vue";
import PartnerPermissionSetting from "@/components/partner/register-partner/PartnerPermissionSetting.vue";
import PartnerGameSetting from "@/components/partner/register-partner/PartnerGameSetting.vue";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  fetchData: {
    type: Function,
    default: () => {},
  },
});

const emit = defineEmits('update:open');

const memberInfoRef = ref(null);
const currencyRollingRef = ref(null);
const rateSettingRef = ref(null);
const permissionSettingRef = ref(null);
const gameSettingRef = ref(null);
const loading = ref(false);

const handleCancel = () => {
  emit('update:open', false);
};

const register = async () => {
  try {
    loading.value = true;

    const memberInfo = memberInfoRef.value?.getState?.() || {};
    const currencyRolling = currencyRollingRef.value?.getState?.() || {};
    const rateSetting = rateSettingRef.value?.getState?.() || {};
    const permissionSetting = permissionSettingRef.value?.getState?.() || {};
    const gameSetting = gameSettingRef.value?.getState?.() || {};

    if (!memberInfo.partnerId || !memberInfo.partnerId.trim()) {
      return message.error(trlang.value.please_input_partner_id);
    }

    if (!memberInfo.nickname || !memberInfo.nickname.trim()) {
      return message.error(trlang.value.please_input_nickname);
    }

    if (!memberInfo.password || !memberInfo.password.trim()) {
      return message.error(trlang.value.please_input_password);
    }

    const payload = {
      partnerId: memberInfo.partnerId,
      nickname: memberInfo.nickname,
      password: memberInfo.password,
      name: memberInfo.name,
      phoneNumber: memberInfo.phoneNumber,
      bank: memberInfo.bank,
      account: memberInfo.account,
      exchangePassword: memberInfo.exchangePassword,
      currencyRolling: currencyRolling,
      dapol: rateSetting.dapol,
      danpol: rateSetting.danpol,
      numberMatch: rateSetting.numberMatch,
      permissions: permissionSetting,
      gameSetting: gameSetting,
    };

    const result = await postData(apiLink.register_partner, payload);

    if (result.status) {
      message.success(trlang.value.registered_successful);
      emit('update:open', false);
      if (props.fetchData) {
        props.fetchData();
      }
    } else {
      message.error(result.message || trlang.value.registration_failed);
    }
  } catch (error) {
    console.error("Error registering partner:", error);
    message.error(error.message || trlang.value.registration_failed);
  } finally {
    loading.value = false;
  }
};
</script>
