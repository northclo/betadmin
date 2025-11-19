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
import { computed, defineProps, inject, ref, watch } from "vue";
import { message } from "ant-design-vue";
import PartnerMemberInformation from "@/components/partner/register-partner/PartnerMemberInformation.vue";
import CurrencyRollingSetting from "@/components/partner/register-partner/CurrencyRollingSetting.vue";
import PartnerRateSetting from "@/components/partner/register-partner/PartnerRateSetting.vue";
import PartnerPermissionSetting from "@/components/partner/register-partner/PartnerPermissionSetting.vue";
import PartnerGameSetting from "@/components/partner/register-partner/PartnerGameSetting.vue";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import {
  testStartEnglish,
  testEnglishNumberDashUnderscore,
} from "@/helpers/Common.js";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: {
    type: Object,
    default: null,
  },
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

const resetForm = () => {
  memberInfoRef.value?.reset?.();
  currencyRollingRef.value?.reset?.();
  rateSettingRef.value?.reset?.();
  permissionSettingRef.value?.reset?.();
  gameSettingRef.value?.reset?.();
};

const handleCancel = () => {
  emit('update:open', false);
};

watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const register = async () => {
  try {
    loading.value = true;

    const memberInfo = memberInfoRef.value?.getState?.() || {};
    const currencyRolling = currencyRollingRef.value?.getState?.() || {};
    const rateSetting = rateSettingRef.value?.getState?.() || {};
    const permissionSetting = permissionSettingRef.value?.getState?.() || {};
    const gameSetting = gameSettingRef.value?.getState?.() || {};

    const stopWithError = (key) => {
      message.error(trlang.value[key] || trlang.value.invalid_data);
      loading.value = false;
    };

    const partnerId = memberInfo.partnerId?.trim();
    if (!partnerId) {
      stopWithError("please_input_partner_id");
      return;
    }
    if (!testStartEnglish(3, 10, partnerId)) {
      stopWithError("invalid_partner_id_format");
      return;
    }

    const nickname = memberInfo.nickname?.trim();
    if (!nickname) {
      stopWithError("please_input_nickname");
      return;
    }
    if (!testEnglishNumberDashUnderscore(3, 10, nickname)) {
      stopWithError("invalid_nickname_format");
      return;
    }

    const password = memberInfo.password?.trim();
    if (!password) {
      stopWithError("please_input_password");
      return;
    }

    const exchangePassword = memberInfo.exchangePassword?.trim();
    if (!exchangePassword) {
      stopWithError("please_input_exchange_password");
      return;
    }

    const bank = typeof memberInfo.bank === "string" ? memberInfo.bank.trim() : memberInfo.bank;
    if (!bank) {
      stopWithError("please_select_bank");
      return;
    }

    const account = memberInfo.account?.trim();
    if (!account) {
      stopWithError("please_input_bank_account");
      return;
    }

    const bankOwnerName = memberInfo.name?.trim();
    if (!bankOwnerName) {
      stopWithError("please_input_bank_owner_name");
      return;
    }

    const payload = {
      partnerId,
      nickname,
      password,
      name: bankOwnerName,
      phoneNumber: memberInfo.phoneNumber,
      bank,
      account,
      exchangePassword,
      currencyRolling,
      dapol: rateSetting.dapol,
      danpol: rateSetting.danpol,
      numberMatch: rateSetting.numberMatch,
      permissions: permissionSetting,
      gameSetting,
    };

    if (props.dataSource && props.dataSource.id) {
      payload.parentPartnerId = props.dataSource.id;
    }

    const result = await postData(apiLink.register_partner, payload);

    if (result.status) {
      message.success(trlang.value.registered_successful);
      resetForm();
      emit('update:open', false);
      if (props.fetchData) {
        props.fetchData();
      }
    } else {
      console.error("Error registering partner:", result.message);
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
