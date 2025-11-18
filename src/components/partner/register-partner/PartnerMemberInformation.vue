<template>
  <a-layout class="bg-white">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_member_information }}
    </a-typography-text>

    <a-layout class="bg-white mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_distiction }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-typography-text class="flex items-center">
          {{ trlang.branch_office }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none flex-wrap">
          <a-input v-model:value="partnerId" class="input-md" />
          <a-button @click="testPartnerId">{{ trlang.test }}</a-button>
          <a-typography-text class="flex items-center text-dark-brown">
            {{
              trlang.the_first_letter_must_be_english_and_must_be_3_to_10_characters_long
            }}
          </a-typography-text>
        </a-layout>
        <a-checkbox v-model:checked="serialNumber" class="mt-2">{{
          trlang.serial_number_multi_registration
        }}</a-checkbox>
        <a-layout class="bg-none flex flex-row gap-2 mt-2 flex-wrap">
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

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_nickname }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="nickname" class="input-md" />
          <a-button @click="testNickname">{{ trlang.test }}</a-button>
          <a-typography-text class="flex items-center text-dark-brown">
            {{ trlang.number_3_to_10_characters_including_English_numbers }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="password" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.phone_number }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row items-center gap-2 bg-none">
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

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_bank }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row items-center gap-2 bg-none">
          <a-select v-model:value="bank" class="input-lg" @change="changeMaxAmount">
            <a-select-option
              v-for="item in bankOption"
              :key="item.key"
              :value="item.amount"
            >
              {{ item.amount }}
            </a-select-option>
          </a-select>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_account }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="account" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.depositors_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="name" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.exchange_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-input v-model:value="exchangePassword" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, onBeforeMount } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { message } from "ant-design-vue";
import { testStartEnglish, testEnglishNumberDashUnderscore } from "@/helpers/Common.js";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = [...new Set(codes)].map((code) => ({ value: code }));

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

/* Init select options */
const initOptions = () => {
  bankOption.value = [1000, 10000, 100000].map((amt, idx) => ({
    key: idx,
    amount: `${amt} ${trlang.value.usd_currency}`,
  }));
};

const testPartnerId = () => {
  const result = testStartEnglish(3, 10, partnerId.value);

  if (result) {
    message.success(trlang.value.correct);
  } else {
    message.error(trlang.value.invalid_data);
  }
};

const testNickname = () => {
  const result = testEnglishNumberDashUnderscore(3, 10, nickname.value);

  if (result) {
    message.success(trlang.value.correct);
  } else {
    message.error(trlang.value.invalid_data);
  }
};

onBeforeMount(initOptions);

defineExpose({
  getState: () => ({
    partnerId: partnerId.value,
    serialNumber: serialNumber.value,
    startTime: startTime.value,
    endTime: endTime.value,
    nickname: nickname.value,
    password: password.value,
    phoneNumber: activeCode.value + phoneNumber1.value + phoneNumber2.value,
    bank: bank.value,
    account: account.value,
    name: name.value,
    exchangePassword: exchangePassword.value,
  }),
});
</script>
