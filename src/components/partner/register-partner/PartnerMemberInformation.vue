<template>
  <a-layout>
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.partner_member_information }}
    </a-typography-text>

    <a-layout class="mt-2 border-b border-t">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_distiction }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-typography-text class="flex items-center">
          {{ trlang.branch_office }}
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
          <a-input v-model:value="partnerId" class="input-md" :disabled="isEdit" />
          <a-button :loading="checkingPartnerId" @click="testPartnerId">{{ trlang.test }}</a-button>
          <a-typography-text class="flex items-center text-dark-brown">
            {{
              trlang.the_first_letter_must_be_english_and_must_be_3_to_10_characters_long
            }}
          </a-typography-text>
        </a-layout>
        <a-checkbox v-model:checked="serialNumber" class="mt-2">{{
          trlang.serial_number_multi_registration
        }}</a-checkbox>
        <a-layout class="flex flex-row gap-2 mt-2 flex-wrap">
          <a-typography-text class="flex items-center">
            {{ trlang.start }}:
          </a-typography-text>
          <a-input-number v-model:value="startTime" class="input-sm" :min="0" />
          <a-typography-text class="flex items-center">~</a-typography-text>
          <a-typography-text class="flex items-center">
            {{ trlang.end }}:
          </a-typography-text>
          <a-input-number v-model:value="endTime" class="input-sm" :min="0" />
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
        <a-layout class="flex flex-row gap-2">
          <a-input v-model:value="nickname" class="input-md" />
          <a-button :loading="checkingNickname" @click="testNickname">{{ trlang.test }}</a-button>
          <a-typography-text class="flex items-center text-dark-brown">
            {{ trlang.number_3_to_10_characters_including_English_numbers }}
          </a-typography-text>
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
          <a-input-password v-model:value="password" class="input-md" />
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
          <a-input-number v-model:value="phoneNumber1" class="input-sm" :min="0" />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input-number v-model:value="phoneNumber2" class="input-sm" :min="0" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_bank }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row items-center gap-2 bg-none">
          <a-select v-model:value="bank" class="input-lg" :options="bankOption" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_account }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="account" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.depositors_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="name" class="input-md" />
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
          <a-input-password v-model:value="exchangePassword" class="input-md" />
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
});

/* State */
const partnerId = ref("");
const serialNumber = ref(false);
const startTime = ref(null);
const endTime = ref(null);
const nickname = ref("");
const password = ref("");
const activeCode = ref("+81");
const phoneNumber1 = ref(null);
const phoneNumber2 = ref(null);
const bank = ref("");
const account = ref("");
const name = ref("");
const exchangePassword = ref(null);
const bankOption = ref([]);
const checkingPartnerId = ref(false);
const checkingNickname = ref(false);

/* Init select options */
const initOptions = async () => {
  try {
    const res = await getData(apiLink.site_setting);
    if (res.status && res.data && res.data.deposit_banks && Array.isArray(res.data.deposit_banks)) {
      bankOption.value = res.data.deposit_banks
        .filter(bank => bank && bank.trim() !== '')
        .map((bankName, idx) => ({
          key: idx,
          value: bankName,
          label: bankName,
        }));
    } else {
      bankOption.value = [];
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
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
    const result = await postData(apiLink.check_partner_availability, { type, value });
    if (result.status && result.data?.available) {
      message.success(trlang.value[isPartnerId ? "partner_id_available" : "nickname_available"]);
    } else {
      message.error(result.message || trlang.value[isPartnerId ? "partner_id_unavailable" : "nickname_unavailable"]);
    }
  } catch (error) {
    console.error("Error checking availability:", error);
    message.error(error?.message || trlang.value.registration_failed);
  } finally {
    loadingRef.value = false;
  }
};

const testPartnerId = () => checkAvailability("partnerId");

const testNickname = () => checkAvailability("nickname");

onMounted(initOptions);

const loadData = () => {
  if (props.partnerData) {
    partnerId.value = props.partnerData.partner_id || "";
    nickname.value = props.partnerData.nickname || "";
    bank.value = props.partnerData.bank_id || "";
    account.value = props.partnerData.bank_number || "";
    name.value = props.partnerData.bank_owner_name || "";
    
    if (props.partnerData.phone_number) {
      const phone = props.partnerData.phone_number;
      const codeMatch = phone.match(/^(\+\d+)/);
      if (codeMatch) {
        activeCode.value = codeMatch[1];
        const rest = phone.substring(codeMatch[1].length);
        if (rest.length > 0) {
          phoneNumber1.value = parseInt(rest.substring(0, rest.length / 2)) || null;
          phoneNumber2.value = parseInt(rest.substring(rest.length / 2)) || null;
        }
      }
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
  phoneNumber1.value = null;
  phoneNumber2.value = null;
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
    phoneNumber: activeCode.value + (phoneNumber1.value || '') + (phoneNumber2.value || ''),
    bank: bank.value,
    account: account.value,
    name: name.value,
    exchangePassword: exchangePassword.value,
  }),
  reset,
});
</script>
