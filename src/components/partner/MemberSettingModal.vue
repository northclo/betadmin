<template>
  <a-modal
    :open="open"
    :title="trlang.member_settings"
    :ok-text="trlang.update"
    :cancel-text="trlang.cancel"
    @ok="update"
    @cancel="$emit('update:open', false)"
    :confirm-loading="loading"
    :width="800"
  >
    <a-spin :spinning="loadingData">
      <a-layout class="flex border-b border-t">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.nickname }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input v-model:value="nickname" class="w-100" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.user_name }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input v-model:value="userName" class="w-100" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.password }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input-password v-model:value="password" class="w-100" :placeholder="trlang.leave_blank_to_keep_current_password" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.exchange_password }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input-password v-model:value="exchangePassword" class="w-100" :placeholder="trlang.leave_blank_to_keep_current_password" />
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.phone_number }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-layout class="flex flex-row items-center gap-2">
            <a-select
              v-model:value="activeCode"
              show-search
              class="input-sm"
              :options="uniqueCodes"
            />
            <a-typography-text class="text-center"> - </a-typography-text>
            <a-input 
              v-model:value="phoneNumber1" 
              class="input-sm" 
              type="text"
              @input="handlePhoneNumber1Input"
              @keypress="handlePhoneNumberKeypress"
              placeholder=""
            />
            <a-typography-text class="text-center"> - </a-typography-text>
            <a-input 
              v-model:value="phoneNumber2" 
              class="input-sm" 
              type="text"
              @input="handlePhoneNumber2Input"
              @keypress="handlePhoneNumberKeypress"
              placeholder=""
            />
          </a-layout>
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bank_name }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-select v-model:value="bankName" class="w-100" :placeholder="trlang.select_bank">
            <a-select-option
              v-for="item in bankNameOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bank_number }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input 
            v-model:value="bankNumber" 
            class="w-100" 
            type="number" 
            :step="1" 
            @input="handleBankNumberInput"
            @keypress="handleBankNumberKeypress"
          />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bank_owner }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input v-model:value="bankOwner" class="w-100" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.management_memo }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-textarea :rows="2" v-model:value="memo" allow-clear />
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="flex items-center text-white">
            {{ trlang.partner_rate }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex flex-column gap-2">
          <a-layout class="flex flex-row items-center gap-2">
            <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
            <a-input-number v-model:value="simpleBetRate" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
            <a-typography-text>%</a-typography-text>
          </a-layout>
          <a-layout class="flex flex-row items-center gap-2">
            <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
            <a-input-number v-model:value="combinedBetRate" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
            <a-typography-text>%</a-typography-text>
          </a-layout>
          <a-layout class="flex flex-row items-center gap-2">
            <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
            <a-input-number v-model:value="matchNumberBetRate" class="input-sm" :min="0" :max="100" :precision="2" :disabled="!canEditRates" />
            <a-typography-text>%</a-typography-text>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-spin>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref, watch, onMounted } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { testEnglishNumberWithoutSpecialCharacter } from "@/helpers/Common.js";
import { message } from "ant-design-vue";
import { postData, getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { usePermissions } from "@/composables/usePermissions.js";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
  fetchData: Function,
});

const emit = defineEmits(["update:open"]);

const { canChangeSettlementRate } = usePermissions();
const canEditRates = computed(() => canChangeSettlementRate.value);

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = ref([...new Set(codes)].map((code) => ({ value: code })));

const getDefaultCountryCode = () => {
  return uniqueCodes.value.length > 0 ? uniqueCodes.value[0].value : "";
};

const nickname = ref("");
const userName = ref("");
const password = ref("");
const exchangePassword = ref("");
const activeCode = ref(getDefaultCountryCode());
const phoneNumber1 = ref("");
const phoneNumber2 = ref("");

const handlePhoneNumber1Input = (e) => {
  const value = e.target ? e.target.value : (typeof e === 'string' ? e : '');
  const numericOnly = value.toString().replace(/[^\d]/g, '');
  phoneNumber1.value = numericOnly;
};

const handlePhoneNumber2Input = (e) => {
  const value = e.target ? e.target.value : (typeof e === 'string' ? e : '');
  const numericOnly = value.toString().replace(/[^\d]/g, '');
  phoneNumber2.value = numericOnly;
};

const handlePhoneNumberKeypress = (e) => {
  if (e.ctrlKey || e.metaKey || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key)) {
    return;
  }
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

const handleBankNumberInput = (e) => {
  const value = e.target ? e.target.value : (typeof e === 'string' ? e : '');
  const numericOnly = value.toString().replace(/[^\d]/g, '');
  bankNumber.value = numericOnly;
};

const handleBankNumberKeypress = (e) => {
  if (e.ctrlKey || e.metaKey || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key)) {
    return;
  }
  if (!/[0-9]/.test(e.key) || e.key === '.' || e.key === ',') {
    e.preventDefault();
  }
};

const bankName = ref("");
const bankNameOptions = ref([]);
const bankNumber = ref("");
const bankOwner = ref("");
const memo = ref("");
const simpleBetRate = ref(null);
const combinedBetRate = ref(null);
const matchNumberBetRate = ref(null);
const loading = ref(false);
const loadingData = ref(false);
const userId = ref(null);

const fetchBankList = async () => {
  try {
    const res = await getData(apiLink.bank_account);
    if (res.status && res.data && Array.isArray(res.data)) {
      bankNameOptions.value = res.data
        .filter(bank => bank && bank._id && bank.bank_name)
        .map((bank) => ({
          value: bank._id.toString(),
          label: bank.bank_name,
        }));
    } else {
      bankNameOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    bankNameOptions.value = [];
  }
};

const fetchUserData = async () => {
  if (!props.dataSource) {
    return;
  }

  try {
    loadingData.value = true;
    
    if (!props.dataSource.userId) {
      message.error(trlang.value.user_not_found);
      return;
    }

    userId.value = props.dataSource.userId;
    const res = await getData(`${apiLink.get_member_by_id}?id=${props.dataSource.userId}`);
    
    if (res.status && res.data) {
      const user = res.data;
      userId.value = user._id;
      nickname.value = user.user_nickname || "";
      userName.value = user.user_name || "";
      bankName.value = user.bank_id || "";
      bankNumber.value = user.bank_number || "";
      bankOwner.value = user.bank_owner_name || "";
      memo.value = user.memo_note || "";
      simpleBetRate.value = user.simple_bet_rate || null;
      combinedBetRate.value = user.combined_bet_rate || null;
      matchNumberBetRate.value = user.match_num_bet_rate || null;

      if (user.phone_number && typeof user.phone_number === 'object') {
        activeCode.value = user.phone_number.active_code || getDefaultCountryCode();
        phoneNumber1.value = user.phone_number.phone_number_1 || "";
        phoneNumber2.value = user.phone_number.phone_number_2 || "";
      } else {
        activeCode.value = getDefaultCountryCode();
        phoneNumber1.value = "";
        phoneNumber2.value = "";
      }

      password.value = "";
      exchangePassword.value = "";
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
  } finally {
    loadingData.value = false;
  }
};

watch(() => props.open, (newVal) => {
  if (newVal) {
    fetchBankList();
    if (props.dataSource) {
      fetchUserData();
    }
  } else {
    // Reset form when modal closes
    nickname.value = "";
    userName.value = "";
    password.value = "";
    exchangePassword.value = "";
    activeCode.value = getDefaultCountryCode();
    phoneNumber1.value = "";
    phoneNumber2.value = "";
    bankName.value = "";
    bankNumber.value = "";
    bankOwner.value = "";
    memo.value = "";
    simpleBetRate.value = null;
    combinedBetRate.value = null;
    matchNumberBetRate.value = null;
    userId.value = null;
  }
});

onMounted(() => {
  fetchBankList();
});

const update = async () => {
  if (!userId.value) {
    return message.error(trlang.value.user_not_found);
  }

  if (!nickname.value || !nickname.value.trim()) {
    return message.error(trlang.value.please_input_nickname);
  }

  if (!testEnglishNumberWithoutSpecialCharacter(2, 10, nickname.value.trim())) {
    return message.error(trlang.value.invalid_nickname_format);
  }

  if (!userName.value || !userName.value.trim()) {
    return message.error(trlang.value.user_name_required);
  }

  if (!testEnglishNumberWithoutSpecialCharacter(4, 12, userName.value.trim())) {
    return message.error(trlang.value.invalid_user_name_format);
  }

  if (!bankOwner.value || !bankOwner.value.trim()) {
    return message.error(trlang.value.please_input_bank_owner_name);
  }

  if (!bankName.value || !bankName.value.trim()) {
    return message.error(trlang.value.please_select_bank);
  }

  if (!bankNumber.value || !bankNumber.value.trim()) {
    return message.error(trlang.value.please_input_bank_account);
  }

  if (!bankOwner.value || !bankOwner.value.trim()) {
    return message.error(trlang.value.please_input_bank_owner_name);
  }

  if (password.value && password.value.trim().length < 6) {
    return message.error(trlang.value.password_min_length_6);
  }

  try {
    loading.value = true;
    const payload = {
      _id: userId.value,
      user_nickname: nickname.value.trim(),
      user_name: userName.value.trim() || undefined,
      phone_number: (activeCode.value || phoneNumber1.value || phoneNumber2.value) ? {
        active_code: activeCode.value || '',
        phone_number_1: phoneNumber1.value || '',
        phone_number_2: phoneNumber2.value || ''
      } : undefined,
      bank_id: bankName.value.trim(),
      bank_number: bankNumber.value.trim(),
      bank_owner_name: bankOwner.value.trim(),
      memo_note: memo.value || undefined,
      simple_bet_rate: simpleBetRate.value !== null ? Number(simpleBetRate.value) : undefined,
      combined_bet_rate: combinedBetRate.value !== null ? Number(combinedBetRate.value) : undefined,
      match_num_bet_rate: matchNumberBetRate.value !== null ? Number(matchNumberBetRate.value) : undefined,
    };

    if (password.value && password.value.trim()) {
      payload.password = password.value.trim();
    }

    if (exchangePassword.value && exchangePassword.value.trim()) {
      payload.exchange_secure_number = exchangePassword.value.trim();
    }

    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const result = await postData(apiLink.member_list, payload);

    if (result.status) {
      message.success(trlang.value.updated_successful);
      if (props.fetchData) {
        props.fetchData();
      }
      emit("update:open", false);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loading.value = false;
  }
};
</script>

