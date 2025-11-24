<template>
  <a-layout>
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.partner_member_information }}
    </a-typography-text>

    <a-layout class="mt-2 border-b border-t" v-if="currentPartnerDisplay && !isEdit">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.current_partner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-typography-text class="flex items-center">
          {{ currentPartnerDisplay }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout :class="(currentPartnerDisplay && !isEdit) ? 'border-b' : 'border-b border-t mt-2'">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_distiction }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-typography-text class="flex items-center">
          {{ nextRoleLabel }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 flex-wrap">
          <a-input v-model:value="partnerId" class="w-100" />
          <a-button :loading="checkingPartnerId" @click="testPartnerId">{{ trlang.test }}</a-button>
          <a-typography-text class="flex items-center text-dark-brown">
            {{
              trlang.the_first_letter_must_be_english_and_must_be_3_to_10_characters_long
            }}
          </a-typography-text>
        </a-layout>
        <a-checkbox v-model:checked="serialNumber" class="mt-2" v-if="!isEdit">{{
          trlang.serial_number_multi_registration
        }}</a-checkbox>
        <a-layout class="flex flex-row gap-2 mt-2 flex-wrap" v-if="!isEdit">
          <a-typography-text class="flex items-center">
            {{ trlang.start }}:
          </a-typography-text>
          <a-input-number v-model:value="startTime" :disabled="!serialNumber" class="input-sm" :min="0" v-if="!isEdit" />
          <a-typography-text class="flex items-center">~</a-typography-text>
          <a-typography-text class="flex items-center">
            {{ trlang.end }}:
          </a-typography-text>
          <a-input-number v-model:value="endTime" :disabled="!serialNumber" class="input-sm" :min="0" v-if="!isEdit" />
          <a-typography-text class="flex items-center text-dark-brown">
            {{
              trlang.multiple_ids_and_nicknames_can_be_registered_with_numbers_added_to_the_end
            }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_nickname }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-column gap-2">
          <a-input v-model:value="nickname" class="w-100" />
          <div class="flex items-center gap-2">
            <a-button :loading="checkingNickname" @click="testNickname">{{ trlang.test }}</a-button>
            <a-typography-text class="flex items-center text-dark-brown">
              {{ trlang.number_3_to_10_characters_including_English_numbers }}
            </a-typography-text>
          </div>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2">
          <a-input-password v-model:value="password" class="w-100" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
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

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_account }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row items-center gap-2 bg-none">
          <a-select v-model:value="bank" class="w-100" :options="bankOption" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_number }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input 
            v-model:value="account" 
            class="w-100" 
            type="number" 
            :step="1" 
            @input="handleBankNumberInput"
            @keypress="handleBankNumberKeypress"
          />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_owner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="name" class="w-100" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.exchange_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input-password v-model:value="exchangePassword" class="w-100" />
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { message } from "ant-design-vue";
import { testStartEnglish, testEnglishNumberDashUnderscore } from "@/helpers/Common.js";
import { getData, postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { getNextPartnerRole, getPartnerRoleTranslationKey } from "@/utils/partner-utils";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = [...new Set(codes)].map((code) => ({ value: code }));

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  partnerData: {
    type: Object,
    default: null,
  },
  parentRole: {
    type: String,
    default: null,
  },
  currentPartnerData: {
    type: String,
    default: null,
  },
});

/* State */
const partnerId = ref("");
const serialNumber = ref(false);
const startTime = ref(null);
const endTime = ref(null);
const nickname = ref("");
const password = ref("");
const activeCode = ref("+81");
const phoneNumber1 = ref("");
const phoneNumber2 = ref("");
const bank = ref("");
const account = ref("");
const name = ref("");
const exchangePassword = ref(null);
const bankOption = ref([]);
const checkingPartnerId = ref(false);
const checkingNickname = ref(false);

const nextRole = computed(() => {
  if (props.isEdit && props.partnerData?.role) {
    return props.partnerData.role;
  }
  if (props.parentRole) {
    return getNextPartnerRole(props.parentRole);
  }
  return 'branch_office';
});

const currentPartnerDisplay = computed(() => {
  if (props.isEdit && props.partnerData?.nickname) {
    return props.partnerData.nickname;
  }
  if (props.currentPartnerData) {
    return props.currentPartnerData;
  }
  return null;
});

const nextRoleLabel = computed(() => {
  const roleKey = getPartnerRoleTranslationKey(nextRole.value);
  return trlang.value[roleKey] || trlang.value.branch_office;
});

const initOptions = async () => {
  try {
    const res = await getData(apiLink.bank_account);
    if (res.status && res.data && Array.isArray(res.data)) {
      bankOption.value = res.data
        .filter(bank => bank && bank._id && bank.bank_name)
        .map((bank) => ({
          key: bank._id.toString(),
          value: bank._id.toString(),
          label: bank.bank_name,
        }));
    } else {
      bankOption.value = [];
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    bankOption.value = [];
  }
};

const checkAvailability = async (type) => {
  const isPartnerId = type === "partnerId";
  const valueRef = isPartnerId ? partnerId : nickname;
  const loadingRef = isPartnerId ? checkingPartnerId : checkingNickname;
  const value = valueRef.value?.trim();

  if (!value) {
    message.error(trlang.value[isPartnerId ? "please_input_partner_id" : "please_input_nickname"]);
    return;
  }

  const validator = isPartnerId ? testStartEnglish : testEnglishNumberDashUnderscore;
  const formatKey = isPartnerId ? "invalid_partner_id_format" : "invalid_nickname_format";

  if (!validator(3, 10, value)) {
    message.error(trlang.value[formatKey]);
    return;
  }

  try {
    loadingRef.value = true;
    const payload = { type, value };
    if (props.isEdit && props.partnerData?._id) {
      payload.excludeId = props.partnerData._id;
    }
    const result = await postData(apiLink.check_partner_availability, payload);
    if (result.status && result.data?.available) {
      message.success(trlang.value[isPartnerId ? "partner_id_available" : "nickname_available"]);
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loadingRef.value = false;
  }
};

const testPartnerId = () => checkAvailability("partnerId");

const testNickname = () => checkAvailability("nickname");

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
  account.value = numericOnly;
};

const handleBankNumberKeypress = (e) => {
  if (e.ctrlKey || e.metaKey || ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key)) {
    return;
  }
  if (!/[0-9]/.test(e.key) || e.key === '.' || e.key === ',') {
    e.preventDefault();
  }
};

onMounted(initOptions);

const loadData = () => {
  if (props.partnerData) {
    partnerId.value = props.partnerData.partner_id || "";
    nickname.value = props.partnerData.nickname || "";
    bank.value = props.partnerData.bank_id || "";
    account.value = props.partnerData.bank_number || "";
    name.value = props.partnerData.bank_owner_name || "";
    
    if (props.partnerData.phone_number && typeof props.partnerData.phone_number === 'object') {
      activeCode.value = props.partnerData.phone_number.active_code || "+81";
      phoneNumber1.value = props.partnerData.phone_number.phone_number_1 || "";
      phoneNumber2.value = props.partnerData.phone_number.phone_number_2 || "";
    } else {
      activeCode.value = "+81";
      phoneNumber1.value = "";
      phoneNumber2.value = "";
    }
    
    password.value = "";
    exchangePassword.value = null;
  }
};

watch(() => props.partnerData, (newData) => {
  if (newData) {
    loadData();
  }
}, { immediate: true });

const reset = () => {
  partnerId.value = "";
  serialNumber.value = false;
  startTime.value = null;
  endTime.value = null;
  nickname.value = "";
  password.value = "";
  activeCode.value = "+81";
  phoneNumber1.value = "";
  phoneNumber2.value = "";
  bank.value = "";
  account.value = "";
  name.value = "";
  exchangePassword.value = null;
};

defineExpose({
  getState: () => ({
    partnerId: partnerId.value,
    serialNumber: serialNumber.value,
    startTime: startTime.value,
    endTime: endTime.value,
    nickname: nickname.value,
    password: password.value,
    phoneNumber: (activeCode.value || phoneNumber1.value || phoneNumber2.value) ? {
      active_code: activeCode.value || '',
      phone_number_1: phoneNumber1.value || '',
      phone_number_2: phoneNumber2.value || ''
    } : undefined,
    bank: bank.value,
    account: account.value,
    name: name.value,
    exchangePassword: exchangePassword.value,
    role: nextRole.value,
  }),
  reset,
});
</script>
