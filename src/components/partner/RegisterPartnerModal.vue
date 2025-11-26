<template>
  <a-modal :open="open" :title="trlang.partner_registration" :ok-text="trlang.register" :cancel-text="trlang.cancel"
    @ok="register" @cancel="handleCancel" :confirm-loading="loading">
    <PartnerMemberInformation ref="memberInfoRef" :parent-role="parentRole" :current-partner-data="currentPartnerData" />
    <CurrencyRollingSetting ref="currencyRollingRef" />
    <PartnerRateSetting ref="rateSettingRef" :parent-rates="parentRates" />
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

const parentRole = computed(() => {
  return props.dataSource?.role || null;
});

const currentPartnerData = computed(() => {
  if (props.dataSource?.nickname) {
    return props.dataSource.nickname;
  }
  
  return null;
});

const parentRates = computed(() => {
  if (props.dataSource) {
    return {
      simple_bet_rate: props.dataSource.simpleBetRate,
      combined_bet_rate: props.dataSource.combinedBetRate,
      match_num_bet_rate: props.dataSource.matchNumberBetRate,
    };
  }
  return null;
});

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

    if (memberInfo.serialNumber) {
      if (memberInfo.startTime === null || memberInfo.startTime === undefined) {
        stopWithError("start_number_required");
        return;
      }
      if (memberInfo.endTime === null || memberInfo.endTime === undefined) {
        stopWithError("end_number_required");
        return;
      }
      if (memberInfo.endTime <= memberInfo.startTime) {
        stopWithError("end_number_must_be_greater");
        return;
      }
    }

    const rateErrors = rateSettingRef.value?.validate?.() || [];
    if (rateErrors.length > 0) {
      message.error(rateErrors[0]);
      loading.value = false;
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
      role: memberInfo.role,
      checked: memberInfo.serialNumber,
      startTime: memberInfo.startTime,
      endTime: memberInfo.endTime,
    };

    if (props.dataSource && props.dataSource.id) {
      payload.parentPartnerId = props.dataSource.id;
    }

    const result = await postData(apiLink.register_partner, payload);

    if (result.status) {
      if (memberInfo.serialNumber && result.data) {
        const created = result.data.created || 0;
        const total = result.data.total || 0;
        if (result.data.errors && result.data.errors.length > 0) {
          const partnersCreatedText = trlang.value.partners_created_with_total?.replace('{0}', created).replace('{1}', total) || `${created}/${total} partners created`;
          message.error(
            `${trlang.value.registered_successful}: ${partnersCreatedText}. ${trlang.value.some_errors_occurred}.`
          );
        } else {
          const partnersCreatedText = trlang.value.partners_created?.replace('{0}', created) || `${created} partner(s) created`;
          message.success(
            `${trlang.value.registered_successful}: ${partnersCreatedText}.`
          );
        }
      } else {
        message.success(trlang.value.registered_successful);
      }
      resetForm();
      emit('update:open', false);
      if (props.fetchData) {
        props.fetchData();
      }
    }
  } catch (error) {
    console.error("Error registering partner:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loading.value = false;
  }
};
</script>
