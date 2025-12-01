<template>
  <a-modal :open="open" :title="trlang.partner_setting" :ok-text="trlang.update" :cancel-text="trlang.cancel"
    @ok="update" @cancel="handleCancel" :confirm-loading="loading">
    <PartnerMemberInformation ref="memberInfoRef" :is-edit="true" :partner-data="partnerData" />
    <CurrencyRollingSetting ref="currencyRollingRef" :partner-data="partnerData" />
    <PartnerRateSetting ref="rateSettingRef" :partner-data="partnerData" :parent-rates="parentRates" />
    <PartnerPermissionSetting v-if="partnerData && partnerData.role !== 'headquater'" ref="permissionSettingRef" :partner-data="partnerData" />
    <PartnerGameSetting ref="gameSettingRef" :partner-data="partnerData" />
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
import { putData, getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import {
  testEnglishNumberDashUnderscore,
  testStartEnglish,
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
const partnerData = ref(null);
const parentRates = ref(null);

const loadPartnerData = async () => {
  if (!props.dataSource || !props.dataSource.id) {
    return;
  }

  try {
    loading.value = true;
    const res = await getData(`${apiLink.get_partner_by_id}?id=${props.dataSource.id}`);
    if (res.status && res.data) {
      partnerData.value = res.data;
      if (res.data.parentRates) {
        parentRates.value = res.data.parentRates;
      } else {
        parentRates.value = null;
      }
    } else {
      partnerData.value = null;
      parentRates.value = null;
    }
  } catch (error) {
    console.error("Error loading partner data:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    partnerData.value = null;
    parentRates.value = null;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  memberInfoRef.value?.reset?.();
  currencyRollingRef.value?.reset?.();
  rateSettingRef.value?.reset?.();
  permissionSettingRef.value?.reset?.();
  gameSettingRef.value?.reset?.();
  partnerData.value = null;
  parentRates.value = null;
};

const handleCancel = () => {
  emit('update:open', false);
};

watch(() => props.open, (newValue) => {
  if (newValue) {
    loadPartnerData();
  } else {
    resetForm();
  }
});

const update = async () => {
  try {
    loading.value = true;

    if (!props.dataSource || !props.dataSource.id) {
      message.error(trlang.value.partner_not_found);
      loading.value = false;
      return;
    }

    const memberInfo = memberInfoRef.value?.getState?.() || {};
    const currencyRolling = currencyRollingRef.value?.getState?.() || {};
    const rateSetting = rateSettingRef.value?.getState?.() || {};
    const permissionSetting = partnerData.value?.role !== 'headquater' 
      ? (permissionSettingRef.value?.getState?.() || {}) 
      : null;
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

    const password = memberInfo.password?.trim();
    if (password && password.length < 6) {
      stopWithError("password_min_length_6");
      return;
    }

    const rateErrors = rateSettingRef.value?.validate?.() || [];
    if (rateErrors.length > 0) {
      message.error(rateErrors[0]);
      loading.value = false;
      return;
    }
    const payload = {
      id: props.dataSource.id,
      partnerId: partnerId,
      nickname: nickname,
      password: password || undefined,
      exchangePassword: memberInfo.exchangePassword?.trim() || undefined,
      name: bankOwnerName || undefined,
      phoneNumber: memberInfo.phoneNumber || undefined,
      bank: bank || undefined,
      account: account || undefined,
      currencyRolling: currencyRolling || undefined,
      dapol: rateSetting.dapol !== undefined ? rateSetting.dapol : undefined,
      danpol: rateSetting.danpol !== undefined ? rateSetting.danpol : undefined,
      numberMatch: rateSetting.numberMatch !== undefined ? rateSetting.numberMatch : undefined,
      permissions: permissionSetting || undefined,
      gameSetting: gameSetting || undefined,
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const result = await putData(apiLink.update_partner, payload);

    if (result.status) {
      message.success(trlang.value.updated_successful || trlang.value.partner_updated_successfully);
      resetForm();
      emit('update:open', false);
      if (props.fetchData) {
        props.fetchData();
      }
    }
  } catch (error) {
    console.error("Error updating partner:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loading.value = false;
  }
};
</script>

