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
        <a-select v-model:value="maxAmount" class="input-lg" @change="changeMaxAmount">
          <a-select-option
            v-for="item in maxAmountOption"
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
        <a-typography-text class="flex items-center text-yellow">
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
          <a-typography-text class="flex items-center text-yellow">
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
        <a-input v-model:value="endTime" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.verify_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="endTime" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.nickname }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="endTime" class="input-lg" />
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
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
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
        <a-select v-model:value="maxAmount" class="input-lg" @change="changeMaxAmount">
          <a-select-option
            v-for="item in maxAmountOption"
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
        <a-input v-model:value="endTime" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bank_owner }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="endTime" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.withdrawal_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-input v-model:value="endTime" class="input-lg" />
      </a-layout-content>
    </a-layout>

    <a-layout class="flex bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.management_memo }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-textarea :rows="2" v-model:value="inactiveMessage" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="flex items-center text-white">
          {{ trlang.partner_rate }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 flex flex-column gap-2">
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.dapol }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.danpol }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text>{{ trlang.number_match }}: </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref } from "vue";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import { testEnglishNumberNoSpecialCharacter } from "@/helpers/Common";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  open: Boolean,
});

const codes = getCountries().map((country) => `+${getCountryCallingCode(country)}`);
const uniqueCodes = [...new Set(codes)].map((code) => ({ value: code }));

const userName = ref("");
const activeCode = ref("+81");

const register = () => {
  console.log("Register user logic here");
};

const testUserName = () => {
  testEnglishNumberNoSpecialCharacter(userName);
};
</script>
