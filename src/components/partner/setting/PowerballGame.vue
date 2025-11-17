<template>
  <a-layout class="bg-white p-2">
    <a-typography-text class="text-dark-gray font-bold p-2 fs-4 mb-2 border-bottom">
      <RightCircleFilled />
      {{ trlang.game_settings_powerball_game }}
    </a-typography-text>

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
          <a-input 
            v-model:value="duplicateBettingLimit" 
            type="number" 
            min="0"
            class="text-center input-sm" 
            :disabled="!duplicateBetting || loading"
          />
          <a-typography-text class="text-dark-brown">
            {{ trlang.no_duplicate_betting_within_the_first_second }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

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
          <a-typography-text class="text-white"> {{ trlang.division_a }} </a-typography-text>
        </a-layout>
        <a-typography-text
          class="w-50 bg-gray text-white flex justify-center items-center border"
        >
          {{ trlang.division_b }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout v-for="(item, idx) in options" :key="idx" class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ item.name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex">
        <a-space class="flex-1 justify-center border p-2">
          <a-input 
            v-model:value="item.valueA" 
            type="number" 
            min="0"
            step="0.01"
            class="text-end input-sm" 
            :disabled="loading"
          />
          <a-typography-text>%</a-typography-text>
        </a-space>
        <a-space class="flex-1 justify-center border p-2">
          <a-input 
            v-model:value="item.valueB" 
            type="number" 
            min="0"
            step="0.01"
            class="text-end input-sm" 
            :disabled="loading"
          />
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
const loading = ref(false);
const saving = ref(false);

// Field mapping structure to replace hardcoded array indices
const optionFieldMapping = computed(() => [
  { field: 'odd', labelKey: 'odd' },
  { field: 'even', labelKey: 'even' },
  { field: 'under', labelKey: 'under' },
  { field: 'over', labelKey: 'over' },
  { field: 'odd_under', labelKey: 'odd_under' },
  { field: 'odd_over', labelKey: 'odd_over' },
  { field: 'even_under', labelKey: 'even_under' },
  { field: 'even_over', labelKey: 'even_over' },
  { field: 'match_number1', labelKey: 'match_number', suffixKey: 'match_number_1_3' },
  { field: 'match_number2', labelKey: 'match_number', suffixKey: 'match_number_1_4' },
  { field: 'match_number3', labelKey: 'match_number', suffixKey: 'match_number_1_6' },
]);

// Helper to safely cast to number
const toNumber = (val) => {
  if (val === null || val === undefined || val === '') {
    return 0;
  }
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

const validateNumber = (value, fieldName) => {
  const num = toNumber(value);
  if (num < 0) {
    return { valid: false, error: `${fieldName} ${trlang.value.must_be_non_negative_number}` };
  }
  return { valid: true, value: num };
};

const validateDuplicateBettingLimit = (value) => {
  if (!duplicateBetting.value) {
    return { valid: true, value: 0 };
  }
  return validateNumber(value, trlang.value.duplicate_betting_limit);
};

const fetchData = async () => {
  try {
    loading.value = true;
    const res = await getData(`${apiLink.game_setting}?name=PowerballGame`);

    if (res.status && res.data) {
      activate.value = res.data.activate ?? true;
      inactiveMessage.value = res.data.inactive_message ?? '';
      duplicateBetting.value = res.data.duplicate_betting ?? true;
      duplicateBettingLimit.value = toNumber(res.data.duplicate_betting_limit);

      const optionA = res.data.option?.find((item) => item.name === 'A') || {};
      const optionB = res.data.option?.find((item) => item.name === 'B') || {};

      options.value = optionFieldMapping.value.map((mapping) => {
        const label = mapping.suffixKey
          ? trlang.value[mapping.labelKey] + trlang.value[mapping.suffixKey]
          : trlang.value[mapping.labelKey];
        
        return {
          field: mapping.field,
          name: label,
          valueA: toNumber(optionA[mapping.field]),
          valueB: toNumber(optionB[mapping.field]),
        };
      });
    } else {
      message.error(trlang.value.load_failed);
    }
  } catch (error) {
    console.error('[PowerballGame] Error fetching data:', error);
    message.error(trlang.value.load_failed);
  } finally {
    loading.value = false;
  }
};

const saveData = async () => {
  try {
    const limitValidation = validateDuplicateBettingLimit(duplicateBettingLimit.value);
    if (!limitValidation.valid) {
      message.error(limitValidation.error);
      return;
    }

    const errors = [];
    for (let i = 0; i < options.value.length; i++) {
      const option = options.value[i];
      
      const fieldNameA = `${trlang.value.option_label} ${option.name} ${trlang.value.option_a}`;
      const fieldNameB = `${trlang.value.option_label} ${option.name} ${trlang.value.option_b}`;
      const validationA = validateNumber(option.valueA, fieldNameA);
      const validationB = validateNumber(option.valueB, fieldNameB);
      
      if (!validationA.valid) {
        errors.push(validationA.error);
      }
      if (!validationB.valid) {
        errors.push(validationB.error);
      }
    }

    if (errors.length > 0) {
      message.error(errors[0]);
      return;
    }

    if (!activate.value && !inactiveMessage.value.trim()) {
      message.warning(trlang.value.inactive_message_required);
    }

    saving.value = true;

    const optionA = { name: 'A' };
    const optionB = { name: 'B' };

    options.value.forEach((option) => {
      optionA[option.field] = toNumber(option.valueA);
      optionB[option.field] = toNumber(option.valueB);
    });

    const payload = {
      activate: activate.value,
      inactive_message: inactiveMessage.value || '',
      duplicate_betting: duplicateBetting.value,
      duplicate_betting_limit: limitValidation.value,
      option: [optionA, optionB],
    };

    const res = await postData(`${apiLink.game_setting}?name=PowerballGame`, payload);

    if (res.status) {
      message.success(trlang.value.settings_saved_successfully);
      await fetchData();
    } else {
      message.error(trlang.value.save_failed);
    }
  } catch (error) {
    console.error('[PowerballGame] Error saving data:', error);
    message.error(trlang.value.save_failed);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchData();
});

defineExpose({
  saveData,
});
</script>
