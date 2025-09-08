<template>
  <a-modal
    :open="open"
    :title="trlang.register_user"
    :ok-text="trlang.registration"
    :cancel-text="trlang.cancel"
    @ok="register"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="flex bg-white mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-select v-model:value="partner" class="input-lg">
          <a-select-option
            v-for="item in partnerOptions"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.user_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="userName" class="input-md" />
        <a-button @click="testUserName">{{ trlang.test }}</a-button>
        <a-typography-text class="flex items-center text-dark-brown">
          {{ trlang.num_4_12_english_letters_and_numbers_no_special_characters }}
        </a-typography-text>
        <a-checkbox v-model:checked="checked" class="mt-2">{{
          trlang.serial_number_multi_registration
        }}</a-checkbox>
        <a-layout class="bg-white flex flex-row gap-2 mt-2 flex-wrap">
          <a-typography-text class="flex items-center">
            {{ trlang.start }}:
          </a-typography-text>
          <a-input v-model:value="startTime" class="input-sm" />
          <a-typography-text class="flex items-center">~</a-typography-text>
          <a-typography-text class="flex items-center">
            {{ trlang.end }}:
          </a-typography-text>
          <a-input v-model:value="endTime" class="input-sm" />
          <a-typography-text class="flex items-center text-dark-brown">
            {{
              trlang.multiple_ids_and_nicknames_can_be_registered_with_numbers_added_to_the_end
            }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="password" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.verify_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="verifyPassword" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.nickname }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="nickname" class="input-lg" />
        <a-button @click="testNickname">{{ trlang.test }}</a-button>
        <a-typography-text class="text-dark-brown">
          {{ trlang.num_2_10_characters_in_combination_of_english_and_numbers }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.phone_number }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row items-center gap-2 bg-white">
          <a-select
            v-model:value="activeCode"
            show-search
            class="input-sm"
            :options="uniqueCodes"
          />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input v-model:value="phoneNumber1" class="input-sm" />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input v-model:value="phoneNumber2" class="input-sm" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-select v-model:value="bankName" class="input-lg">
          <a-select-option
            v-for="item in bankNameOptions"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_number }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="bankNumber" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_owner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="bankOwner" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.withdrawal_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="withdrawalPassword" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.management_memo }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-textarea :rows="2" v-model:value="memo" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="flex items-center text-white">
          {{ trlang.partner_rate }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column gap-2">
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
          <a-input v-model:value="simpleBetRate" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input v-model:value="combinedBetRate" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input v-model:value="matchNumberBetRate" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { testEnglishNumberWithoutSpecialCharacter } from "@/helpers/Common.js";
import { message } from "ant-design-vue";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  open: Boolean,
});

const emit = defineEmits(["update:open"]);

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = [...new Set(codes)].map((code) => ({ value: code }));

const partner = ref("");
const partnerOptions = ref([]);
const userName = ref("");
const checked = ref(false);
const startTime = ref(null);
const endTime = ref(null);
const password = ref("");
const verifyPassword = ref("");
const nickname = ref("");
const activeCode = ref("+81");
const phoneNumber1 = ref("");
const phoneNumber2 = ref("");
const bankName = ref("");
const bankNameOptions = ref([]);
const bankNumber = ref("");
const bankOwner = ref("");
const withdrawalPassword = ref("");
const memo = ref("");
const simpleBetRate = ref(null);
const combinedBetRate = ref(null);
const matchNumberBetRate = ref(null);

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

  const payload = {
    partner: partner.value,
    userName: userName.value,
    checked: checked.value,
    startTime: startTime.value,
    endTime: endTime.value,
    password: password.value,
    nickname: nickname.value,
    phoneNumber: activeCode.value + phoneNumber1.value + phoneNumber2.value,
    bankName: bankName.value,
    bankNumber: bankNumber.value,
    bankOwner: bankOwner.value,
    withdrawalPassword: withdrawalPassword.value,
    memo: memo.value,
    simpleBetRate: simpleBetRate.value,
    combinedBetRate: combinedBetRate.value,
    matchNumberBetRate: matchNumberBetRate.value,
  };

  const result = await postData(apiLink.register_user, payload);

  if (result.status) {
    message.success(trlang.value.registered_successful);
    emit("update:open", false);
  }
};
</script>
