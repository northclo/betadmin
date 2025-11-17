<template>
  <a-collapse-panel class="bg-white">
    <template #header>
      <a-typography-text class="font-bold fs-4 leading-0">
        {{ trlang.charge_setting }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.recharge_amount }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <p class="flex items-center text-helper">
          {{ trlang.minimum }}
        </p>
        <a-input v-model:value="chargeMin" type="number" :min="0" style="width: 80px" />
        <p class="flex items-center text-helper">
          {{ trlang.from }}
        </p>
        <a-typography-text class="flex items-center">
          {{ trlang.one_use_or_more }}
        </a-typography-text>
        <a-select v-model:value="chargeMax" style="width: 120px">
          <a-select-option
            v-for="item in chargeMaxOption"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
        <p class="flex items-center text-helper">
          {{ trlang.rechargeable_with }}
        </p>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.charging_time_zone }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column items-start gap-2">
        <a-layout class="w-100">
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="chargeTimezone" class="w-fit me-2" />
              <a-typography-text class="flex item-center text-white" style="width: 45px">
                {{ chargeTimezone ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 bg-white">
              <a-layout class="bg-white flex flex-row gap-2 flex-wrap">
                <a-typography-text class="flex items-center">
                  {{ trlang.start }}
                </a-typography-text>
                <a-input v-model:value="chargeStartTime" style="width: 80px" />
                <a-typography-text class="flex items-center">~</a-typography-text>
                <a-typography-text class="flex items-center">
                  {{ trlang.end }}
                </a-typography-text>
                <a-input v-model:value="chargeEndTime" style="width: 80px" />
              </a-layout>
              <p class="flex items-center text-helper">
                {{ trlang.please_enter_the_charging_time_zone }}
                {{ trlang.enter_in_24hour_format }}
              </p>
            </a-layout-content>
          </a-layout>
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-typography-text class="text-white">
                {{ trlang.impossible_time_zone_display_text }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 flex gap-2 bg-white">
              <a-textarea
                :rows="4"
                v-model:value="chargeImpossibleTimezoneMessage"
                allow-clear
              />
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_charging_is_complete }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="chargeCompleteMessage" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from 'vue';

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const chargeMin = ref('');
const chargeMax = ref('');
const chargeMaxOption = ref([]);
const chargeTimezone = ref(true);
const chargeImpossibleTimezoneMessage = ref('');
const chargeStartTime = ref('');
const chargeEndTime = ref('');
const chargeCompleteMessage = ref('');

const initOptions = () => {
  chargeMaxOption.value = [1000, 10000, 100000].map((amt, idx) => ({
    key: idx,
    amount: amt + ' USD',
  }));
};

const formatTime = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return value.toString();
  const digits = numericValue.toString().padStart(4, '0');
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const loadData = (data) => {
  chargeMin.value =
    data.charge_min !== undefined && data.charge_min !== null
      ? data.charge_min.toString()
      : '';
  chargeMax.value = data.charge_max
    ? `${data.charge_max} USD`
    : chargeMaxOption.value[0]?.amount ?? '';
  chargeTimezone.value = data.charge_timezone ?? true;
  chargeStartTime.value = formatTime(data.charge_start_time);
  chargeEndTime.value = formatTime(data.charge_end_time);
  chargeImpossibleTimezoneMessage.value =
    data.charge_impossible_timezone_message ?? '';
  chargeCompleteMessage.value = data.charge_complete_message ?? '';
};

watch(() => props.dataSource, loadData, { immediate: true });

const isNumericInput = (value) => {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return true;
    return /^-?(\d+\.?\d*|\.\d+)$/.test(trimmed);
  }
  return false;
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  let normalized = typeof value === 'string' ? value : value.toString();
  normalized = normalized.replace(/\s*USD\s*/gi, '');
  normalized = normalized.replace(/[^\d.-]/g, '');
  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const toTimeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const trimmed = value.toString().trim();
  let digits = trimmed;
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    digits = trimmed.replace(':', '');
  }
  if (!/^\d{3,4}$/.test(digits)) {
    return null;
  }
  if (digits.length === 3) {
    digits = `0${digits}`;
  }
  const hours = Number(digits.slice(0, 2));
  const minutes = Number(digits.slice(2, 4));
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return hours * 100 + minutes;
};

const buildState = () => ({
  chargeMin: toNumber(chargeMin.value),
  chargeMax: toNumber(chargeMax.value),
  chargeTimezone: chargeTimezone.value,
  chargeStartTime: chargeTimezone.value ? toTimeNumber(chargeStartTime.value) : null,
  chargeEndTime: chargeTimezone.value ? toTimeNumber(chargeEndTime.value) : null,
  chargeImpossibleTimezoneMessage: chargeImpossibleTimezoneMessage.value,
  chargeCompleteMessage: chargeCompleteMessage.value,
});

const validate = () => {
  const state = buildState();
  const errors = [];

  if (chargeMin.value !== null && chargeMin.value !== undefined && chargeMin.value !== '' && !isNumericInput(chargeMin.value)) {
    errors.push(trlang.value.charge_minimum_must_be_number);
  } else if (state.chargeMin === null || state.chargeMin < 0) {
    errors.push(trlang.value.please_enter_valid_minimum_charge_amount);
  }

  const maxValue = chargeMax.value;
  if (maxValue && typeof maxValue === 'string' && !maxValue.includes('USD')) {
    if (!isNumericInput(maxValue)) {
      errors.push(trlang.value.charge_maximum_must_be_number);
    }
  }
  if (state.chargeMax === null || state.chargeMax <= 0) {
    errors.push(trlang.value.please_enter_valid_maximum_charge_amount);
  }
  if (
    state.chargeMin !== null &&
    state.chargeMax !== null &&
    state.chargeMin > state.chargeMax
  ) {
    errors.push(trlang.value.charge_min_cannot_exceed_charge_max);
  }

  if (state.chargeTimezone) {
    if (state.chargeStartTime === null) {
      errors.push(trlang.value.please_enter_valid_charge_start_time);
    }
    if (state.chargeEndTime === null) {
      errors.push(trlang.value.please_enter_valid_charge_end_time);
    }
    if (
      state.chargeStartTime !== null &&
      state.chargeEndTime !== null &&
      state.chargeStartTime >= state.chargeEndTime
    ) {
      errors.push(trlang.value.charge_start_time_must_be_before_end_time);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: state,
  };
};

defineExpose({
  getState: () => buildState(),
  validate,
});

onBeforeMount(initOptions);
</script>
