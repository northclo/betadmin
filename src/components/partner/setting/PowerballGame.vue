<template>
  <a-layout class="bg-white p-2">
    <a-typography-text class="text-dark-gray font-bold p-2 fs-4 mb-2 border-bottom">
      <RightCircleFilled />
      {{ trlang.game_settings_powerball_game }}
    </a-typography-text>

    <!-- Activate -->
    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.activate }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2">
        <a-switch v-model:checked="activate" class="w-fit" />
        <a-typography-text class="flex item-center">
          {{ activate ? trlang.activate : trlang.disable }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <!-- Inactive message -->
    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_inactive }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="3" v-model:value="inactiveMessage" allow-clear />
      </a-layout-content>
    </a-layout>

    <!-- Duplicate betting -->
    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.prevent_duplicate_betting }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-none">
          <a-switch v-model:checked="duplicateBetting" class="w-fit" />
          <a-typography-text class="flex item-center">
            {{ duplicateBetting ? trlang.activate : trlang.disable }}
          </a-typography-text>
        </a-layout>
        <a-layout class="bg-none flex flex-row items-center gap-2">
          <a-typography-text class="text-dark-brown">
            {{ trlang.when_same_round_same_pick_same_amount }}
          </a-typography-text>
          <a-input v-model:value="duplicateBettingLimit" class="text-center input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.no_duplicate_betting_within_the_first_second }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <!-- Division -->
    <a-layout class="bg-none mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.division }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex">
        <a-layout
          class="w-50 bg-gray flex flex-row justify-center items-center border p-2"
        >
          <a-typography-text class="text-white"> A </a-typography-text>
        </a-layout>
        <a-typography-text
          class="w-50 bg-gray text-white flex justify-center items-center border"
        >
          B
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <!-- Options -->
    <a-layout v-for="(item, idx) in options" :key="idx" class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ item.name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex">
        <a-space class="flex-1 justify-center border p-2">
          <a-input v-model:value="item.valueA" class="text-end input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-space>
        <a-space class="flex-1 justify-center border p-2">
          <a-input v-model:value="item.valueB" class="text-end input-sm" />
          <a-typography-text>%</a-typography-text>
        </a-space>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { RightCircleFilled } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { getData, postData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link.js';

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const activate = ref(true);
const inactiveMessage = ref('');
const duplicateBetting = ref(true);
const duplicateBettingLimit = ref(0);
const options = ref([]);

// Helper to safely cast to number
const toNumber = (val) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

const fetchData = async () => {
  const res = await getData(`${apiLink.game_setting}?name=PowerballGame`);

  if (res.status) {
    activate.value = res.data.activate;
    inactiveMessage.value = res.data.inactive_message;
    duplicateBetting.value = res.data.duplicate_betting;
    duplicateBettingLimit.value = toNumber(res.data.duplicate_betting_limit);

    const optionA = res.data.option?.find((item) => item.name === 'A') || {};
    const optionB = res.data.option?.find((item) => item.name === 'B') || {};

    options.value = [
      {
        name: trlang.value.odd,
        valueA: toNumber(optionA.odd),
        valueB: toNumber(optionB.odd),
      },
      {
        name: trlang.value.even,
        valueA: toNumber(optionA.even),
        valueB: toNumber(optionB.even),
      },
      {
        name: trlang.value.under,
        valueA: toNumber(optionA.under),
        valueB: toNumber(optionB.under),
      },
      {
        name: trlang.value.over,
        valueA: toNumber(optionA.over),
        valueB: toNumber(optionB.over),
      },
      {
        name: trlang.value.odd_under,
        valueA: toNumber(optionA.odd_under),
        valueB: toNumber(optionB.odd_under),
      },
      {
        name: trlang.value.odd_over,
        valueA: toNumber(optionA.odd_over),
        valueB: toNumber(optionB.odd_over),
      },
      {
        name: trlang.value.even_under,
        valueA: toNumber(optionA.even_under),
        valueB: toNumber(optionB.even_under),
      },
      {
        name: trlang.value.even_over,
        valueA: toNumber(optionA.even_over),
        valueB: toNumber(optionB.even_over),
      },
      {
        name: trlang.value.match_number + ' (1 - 3)',
        valueA: toNumber(optionA.match_number1),
        valueB: toNumber(optionB.match_number1),
      },
      {
        name: trlang.value.match_number + ' (1 - 4)',
        valueA: toNumber(optionA.match_number2),
        valueB: toNumber(optionB.match_number2),
      },
      {
        name: trlang.value.match_number + ' (1 - 6)',
        valueA: toNumber(optionA.match_number3),
        valueB: toNumber(optionB.match_number3),
      },
    ];
  }
};

const saveData = async () => {
  console.log('options.value :>> ', toNumber(options.value[9].valueA));
  const payload = {
    activate: activate.value,
    inactive_message: inactiveMessage.value,
    duplicate_betting: duplicateBetting.value,
    duplicate_betting_limit: toNumber(duplicateBettingLimit.value),
    option: [
      {
        name: 'A',
        odd: toNumber(options.value[0].valueA),
        even: toNumber(options.value[1].valueA),
        under: toNumber(options.value[2].valueA),
        over: toNumber(options.value[3].valueA),
        odd_under: toNumber(options.value[4].valueA),
        odd_over: toNumber(options.value[5].valueA),
        even_under: toNumber(options.value[6].valueA),
        even_over: toNumber(options.value[7].valueA),
        match_number1: toNumber(options.value[8].valueA),
        match_number2: toNumber(options.value[9].valueA),
        match_number3: toNumber(options.value[10].valueA),
      },
      {
        name: 'B',
        odd: toNumber(options.value[0].valueB),
        even: toNumber(options.value[1].valueB),
        under: toNumber(options.value[2].valueB),
        over: toNumber(options.value[3].valueB),
        odd_under: toNumber(options.value[4].valueB),
        odd_over: toNumber(options.value[5].valueB),
        even_under: toNumber(options.value[6].valueB),
        even_over: toNumber(options.value[7].valueB),
        match_number1: toNumber(options.value[8].valueB),
        match_number2: toNumber(options.value[9].valueB),
        match_number3: toNumber(options.value[10].valueB),
      },
    ],
  };

  const res = await postData(`${apiLink.game_setting}?name=PowerballGame`, payload);

  if (res.status) {
    message.success(trlang.value.saved_successful);
  }
};

onMounted(() => {
  fetchData();
});

defineExpose({
  saveData,
});
</script>
