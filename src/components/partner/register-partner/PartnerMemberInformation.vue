<template>
  <a-layout class="bg-white">
    <!-- Header -->
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_member_information }}
    </a-typography-text>

    <a-layout class="bg-white mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.partner_distiction }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="d-flex gap-2 border p-2 flex-wrap">
        <a-typography-text class="d-flex items-center">
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
          <a-button>{{ trlang.test }}</a-button>
          <a-typography-text class="d-flex items-center text-yellow">
            {{
              trlang.the_first_letter_must_be_english_and_must_be_3_to_10_characters_long
            }}
          </a-typography-text>
        </a-layout>
        <a-checkbox v-model:checked="checked" class="mt-2">{{
          trlang.serial_number_multi_registration
        }}</a-checkbox>
        <a-layout class="bg-white d-flex flex-row gap-2 mt-2">
          <a-typography-text class="d-flex items-center">
            {{ trlang.start }}:
          </a-typography-text>
          <a-input v-model:value="startTime" class="input-sm" />
          <a-typography-text class="d-flex items-center">~</a-typography-text>
          <a-typography-text class="d-flex items-center">
            {{ trlang.end }}:
          </a-typography-text>
          <a-input v-model:value="endTime" class="input-sm" />
          <a-typography-text class="d-flex items-center text-yellow">
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
          <a-button>{{ trlang.test }}</a-button>
          <a-typography-text class="d-flex items-center text-yellow">
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
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
        <a-layout class="d-flex flex-row items-center gap-2 bg-white">
          <a-select v-model:value="maxAmount" class="input-sm" @change="changeMaxAmount">
            <a-select-option
              v-for="item in maxAmountOption"
              :key="item.key"
              :value="item.amount"
            >
              {{ item.amount }}
            </a-select-option>
          </a-select>
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
          <a-typography-text class="text-center"> - </a-typography-text>
          <a-input v-model:value="minAmount" class="input-sm" />
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
        <a-layout class="d-flex flex-row items-center gap-2 bg-white">
          <a-select v-model:value="maxAmount" class="input-lg" @change="changeMaxAmount">
            <a-select-option
              v-for="item in maxAmountOption"
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-input v-model:value="minAmount" class="input-md" />
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, onBeforeMount } from "vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* State */
const minAmount = ref(0);
const maxAmount = ref("");
const maxAmountOption = ref([]);
const startTime = ref(0);
const endTime = ref(0);

/* Init select options */
const initOptions = () => {
  maxAmountOption.value = [1000, 10000, 100000].map((amt, idx) => ({
    key: idx,
    amount: amt + " USD",
  }));
};

onBeforeMount(initOptions);
</script>
