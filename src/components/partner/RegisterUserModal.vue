<template>
  <a-modal
    :open="open"
    :title="trlang.register_user"
    :ok-text="trlang.registration"
    :cancel-text="trlang.cancel"
    @ok="register"
    @cancel="$emit('update:open', false)"
    :confirm-loading="loading"
  >
    <a-layout class="flex mt-2 border-b border-t">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-tree-select
          v-model:value="partner"
          class="w-100"
          :tree-data="partnerTreeOptions"
          :placeholder="trlang.select_partner"
          allow-clear
          tree-default-expand-all
          :field-names="{ children: 'children', label: 'title', value: 'value' }"
        />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex border-b">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.user_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input v-model:value="userName" class="input-md" />
        <a-button @click="testUserName">{{ trlang.test }}</a-button>
        <a-typography-text class="flex items-center text-dark-brown">
          {{ trlang.num_4_12_english_letters_and_numbers_no_special_characters }}
        </a-typography-text>
        <a-checkbox v-model:checked="checked" class="mt-2">{{
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

    <a-layout class="flex border-b">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.email }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input v-model:value="email" class="input-lg" />
        <div class="flex items-center gap-2">
          <a-button @click="testEmail">{{ trlang.test }}</a-button>
          <a-typography-text class="text-dark-brown">
            {{ trlang.email_format_required }}
          </a-typography-text>
        </div>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex border-b">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input-password v-model:value="password" class="w-100" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex border-b">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.verify_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input-password v-model:value="verifyPassword" class="w-100" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex border-b">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.nickname }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input v-model:value="nickname" class="w-100" />
        <div class="flex items-center gap-2">
          <a-button @click="testNickname">{{ trlang.test }}</a-button>
          <a-typography-text class="text-dark-brown">
            {{ trlang.num_2_10_characters_in_combination_of_english_and_numbers }}
          </a-typography-text>
        </div>
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
          <a-input-number v-model:value="phoneNumber1" class="input-sm" :min="0" />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input-number v-model:value="phoneNumber2" class="input-sm" :min="0" />
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
        <a-input v-model:value="bankNumber" class="w-100" />
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
          {{ trlang.exchange_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 p-2 flex-wrap">
        <a-input-password v-model:value="exchangePassword" class="w-100" />
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
          <a-input-number v-model:value="simpleBetRate" class="input-sm" :min="0" :max="100" :precision="2" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input-number v-model:value="combinedBetRate" class="input-sm" :min="0" :max="100" :precision="2" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input-number v-model:value="matchNumberBetRate" class="input-sm" :min="0" :max="100" :precision="2" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref, onMounted, watch } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { testEnglishNumberWithoutSpecialCharacter, checkValidEmail } from "@/helpers/Common.js";
import { message } from "ant-design-vue";
import { postData, getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
  fetchData: Function,
});

const emit = defineEmits(["update:open"]);

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = [...new Set(codes)].map((code) => ({ value: code }));

const partner = ref("");
const partnerTreeOptions = ref([]);
const userName = ref("");
const checked = ref(false);
const startTime = ref(null);
const endTime = ref(null);
const password = ref("");
const verifyPassword = ref("");
const nickname = ref("");
const activeCode = ref("+81");
const phoneNumber1 = ref(null);
const phoneNumber2 = ref(null);
const bankName = ref("");
const bankNameOptions = ref([]);
const bankNumber = ref("");
const bankOwner = ref("");
const email = ref("");
const exchangePassword = ref("");
const memo = ref("");
const simpleBetRate = ref(null);
const combinedBetRate = ref(null);
const matchNumberBetRate = ref(null);
const loading = ref(false);

const testUserName = () => {
  if (testEnglishNumberWithoutSpecialCharacter(4, 12, userName.value)) {
    message.success(trlang.value.correct);
  } else {
    message.error(trlang.value.invalid_username);
  }
};

const testNickname = () => {
  if (testEnglishNumberWithoutSpecialCharacter(2, 10, nickname.value)) {
    message.success(trlang.value.correct);
  } else {
    message.error(trlang.value.invalid_nickname);
  }
};

const testEmail = async () => {
  if (!email.value || !email.value.trim()) {
    return message.error(trlang.value.please_input_email);
  }
  
  if (!checkValidEmail(email.value.trim())) {
    return message.error(trlang.value.invalid_email_format);
  }

  try {
    const result = await postData(apiLink.check_user_availability, {
      type: 'email',
      value: email.value.trim()
    });

    if (result.data?.available) {
      message.success(trlang.value.available);
    } else {
      message.error(result.message || trlang.value.email_already_exists);
    }
  } catch (error) {
    console.error("Error checking email:", error);
    message.error(trlang.value.error_checking_email || trlang.value.invalid_email_format);
  }
};

const convertPartnerToTree = (partner, level = 0) => {
  if (!partner || !partner.id) return null;
  
  const node = {
    title: `${partner.nickname}`,
    value: partner.id,
    children: []
  };

  if (partner.subs && Array.isArray(partner.subs) && partner.subs.length > 0) {
    node.children = partner.subs
      .map(sub => convertPartnerToTree(sub, level + 1))
      .filter(Boolean);
  }

  return node;
};

const fetchPartnerList = async () => {
  try {
    const res = await getData(apiLink.get_game_partner);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      partnerTreeOptions.value = res.data
        .map(partner => convertPartnerToTree(partner))
        .filter(Boolean);
    } else if (res.data && res.data.id) {
      const tree = convertPartnerToTree(res.data);
      partnerTreeOptions.value = tree ? [tree] : [];
    } else {
      partnerTreeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching partner list:", error);
    partnerTreeOptions.value = [];
  }
};

const fetchBankList = async () => {
  try {
    const res = await getData(apiLink.site_setting);
    if (res.status && res.data && res.data.deposit_banks && Array.isArray(res.data.deposit_banks)) {
      bankNameOptions.value = res.data.deposit_banks
        .filter(bank => bank && bank.trim() !== '')
        .map((bankName) => ({
          value: bankName,
          label: bankName,
        }));
    } else {
      bankNameOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching bank list:", error);
    bankNameOptions.value = [];
  }
};

watch(() => props.open, (newVal) => {
  if (newVal) {
    fetchPartnerList();
    fetchBankList();
    partner.value = "";
    userName.value = "";
    checked.value = false;
    startTime.value = null;
    endTime.value = null;
    password.value = "";
    verifyPassword.value = "";
    nickname.value = "";
    phoneNumber1.value = null;
    phoneNumber2.value = null;
    bankName.value = "";
    bankNumber.value = "";
    bankOwner.value = "";
    email.value = "";
    exchangePassword.value = "";
    memo.value = "";
    simpleBetRate.value = null;
    combinedBetRate.value = null;
    matchNumberBetRate.value = null;
  }
});

onMounted(() => {
  fetchPartnerList();
  fetchBankList();
});

const register = async () => {
  if (!testEnglishNumberWithoutSpecialCharacter(4, 12, userName.value)) {
    return message.error(trlang.value.invalid_username);
  }

  if (!testEnglishNumberWithoutSpecialCharacter(2, 10, nickname.value)) {
    return message.error(trlang.value.invalid_nickname);
  }

  if (!password.value || password.value !== verifyPassword.value) {
    return message.error(trlang.value.wrong_password);
  }

  if (!nickname.value) {
    return message.error(trlang.value.please_input_nickname);
  }

  if (!email.value || !email.value.trim()) {
    return message.error(trlang.value.please_input_email);
  }

  if (!checkValidEmail(email.value.trim())) {
    return message.error(trlang.value.invalid_email_format);
  }

  if (!exchangePassword.value || !exchangePassword.value.trim()) {
    return message.error(trlang.value.please_input_exchange_password);
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

  try {
    loading.value = true;
    const payload = {
      partner: partner.value,
      userName: userName.value,
      checked: checked.value,
      startTime: startTime.value,
      endTime: endTime.value,
      password: password.value,
      nickname: nickname.value,
      email: email.value.trim(),
      phoneNumber: activeCode.value + (phoneNumber1.value || '') + (phoneNumber2.value || ''),
      bankName: bankName.value,
      bankNumber: bankNumber.value,
      bankOwner: bankOwner.value,
      exchangePassword: exchangePassword.value,
      memo: memo.value,
      simpleBetRate: simpleBetRate.value,
      combinedBetRate: combinedBetRate.value,
      matchNumberBetRate: matchNumberBetRate.value,
    };

    const result = await postData(apiLink.register_user, payload);

    if (result.status) {
      message.success(trlang.value.registered_successful);
      props.fetchData();
      emit("update:open", false);
    } else {
      message.error(result.message || trlang.value.registration_failed);
    }
  } catch (error) {
    console.error("Error registering user:", error);
    message.error(error.message || trlang.value.registration_failed);
  } finally {
    loading.value = false;
  }
};
</script>
