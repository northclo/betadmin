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
          <a-input v-model:value="nickname" class="input-lg" :disabled="true" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.nickname_cannot_be_changed }}
          </a-typography-text>
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
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.user_name }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input v-model:value="userName" class="input-lg" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.password }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input-password v-model:value="password" class="input-lg" :placeholder="trlang.leave_blank_to_keep_current_password" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.exchange_password }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input-password v-model:value="exchangePassword" class="input-lg" :placeholder="trlang.leave_blank_to_keep_current_password" />
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
          <a-select v-model:value="bankName" class="input-lg" :placeholder="trlang.select_bank">
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
          <a-input v-model:value="bankNumber" class="input-lg" />
        </a-layout-content>
      </a-layout>

      <a-layout class="flex border-b">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bank_owner }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="flex gap-2 p-2 flex-wrap">
          <a-input v-model:value="bankOwner" class="input-lg" />
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
    </a-spin>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref, watch, onMounted } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { checkValidEmail } from "@/helpers/Common.js";
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
const uniqueCodes = ref([...new Set(codes)].map((code) => ({ value: code })));

const getDefaultCountryCode = () => {
  return uniqueCodes.value.length > 0 ? uniqueCodes.value[0].value : "";
};

const nickname = ref("");
const userName = ref("");
const email = ref("");
const password = ref("");
const exchangePassword = ref("");
const activeCode = ref(getDefaultCountryCode());
const phoneNumber1 = ref(null);
const phoneNumber2 = ref(null);
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

const fetchUserData = async () => {
  if (!props.dataSource) {
    return;
  }

  try {
    loadingData.value = true;
    let res;
    
    if (props.dataSource.userId) {
      userId.value = props.dataSource.userId;
      res = await getData(`${apiLink.member_list}?search=${props.dataSource.userId}&searchField=_id`);
    } else if (props.dataSource.id) {
      res = await getData(`${apiLink.member_list}?search=${props.dataSource.id}&searchField=user_nickname`);
    } else {
      message.error(trlang.value.user_not_found);
      return;
    }
    
    if (res.status && res.data && res.data.list && res.data.list.length > 0) {
      const user = res.data.list[0];
      userId.value = user._id;
      nickname.value = user.user_nickname || "";
      userName.value = user.user_name || "";
      email.value = user.user_email || "";
      bankName.value = user.bank_id || "";
      bankNumber.value = user.bank_number || "";
      bankOwner.value = user.bank_owner_name || "";
      memo.value = user.memo_note || "";
      simpleBetRate.value = user.simple_bet_rate || null;
      combinedBetRate.value = user.combined_bet_rate || null;
      matchNumberBetRate.value = user.match_num_bet_rate || null;

      // Parse phone number
      if (user.phone_number) {
        const phone = user.phone_number;
        // Try to extract country code (assuming format like +81-123-4567)
        const match = phone.match(/^(\+\d+)[-]?(\d+)[-]?(\d+)$/);
        if (match) {
          activeCode.value = match[1];
          phoneNumber1.value = parseInt(match[2]) || null;
          phoneNumber2.value = parseInt(match[3]) || null;
        } else {
          activeCode.value = getDefaultCountryCode();
          phoneNumber1.value = null;
          phoneNumber2.value = null;
        }
      } else {
        activeCode.value = getDefaultCountryCode();
        phoneNumber1.value = null;
        phoneNumber2.value = null;
      }

      password.value = "";
      exchangePassword.value = "";
    } else {
      message.error(trlang.value.user_not_found);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    message.error(trlang.value.error_loading_data);
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
    email.value = "";
    password.value = "";
    exchangePassword.value = "";
    activeCode.value = getDefaultCountryCode();
    phoneNumber1.value = null;
    phoneNumber2.value = null;
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

  if (!email.value || !email.value.trim()) {
    return message.error(trlang.value.please_input_email);
  }

  if (!checkValidEmail(email.value.trim())) {
    return message.error(trlang.value.invalid_email_format);
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
      user_email: email.value.trim(),
      user_name: userName.value.trim() || undefined,
      phone_number: activeCode.value + (phoneNumber1.value || '') + (phoneNumber2.value || ''),
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
      payload.exchange_password = exchangePassword.value.trim();
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
    } else {
      message.error(result.message || trlang.value.update_failed);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    message.error(error.message || trlang.value.update_failed);
  } finally {
    loading.value = false;
  }
};
</script>

