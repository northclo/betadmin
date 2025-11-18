<template>
  <a-collapse-panel class="bg-white">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.currency_exchange_setting }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.exchange_amount }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <P class="flex items-center text-helper">
          {{ trlang.minimum }}
        </P>
        <a-input v-model:value="exchangeMin" type="number" :min="0" style="width: 80px" />
        <P class="flex items-center text-helper">
          {{ trlang.from }}
        </P>
        <a-typography-text class="flex items-center">
          {{ trlang.one_use_or_more }}
        </a-typography-text>
        <a-select
          v-model:value="exchangeMax"
          style="width: 120px"
          @change="changeExchangeMax"
        >
          <a-select-option
            v-for="item in exchangeMaxOption"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
        <P class="flex items-center text-helper">
          {{ trlang.can_be_exchanged_for }}
        </P>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.time_zone_available_for_currency_exchange }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column items-start gap-2">
        <a-layout class="w-100">
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="exchangeTimezone" class="w-fit me-2" />
              <a-typography-text class="flex item-center text-white" style="width: 45px">
                {{ exchangeTimezone ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 bg-white">
              <a-layout class="bg-white flex flex-row gap-2 flex-wrap">
                <a-typography-text class="flex items-center">
                  {{ trlang.start }}
                </a-typography-text>
                <a-input v-model:value="exchangeStartTime" style="width: 80px" />
                <a-typography-text class="flex items-center">{{ trlang.range_separator }}</a-typography-text>
                <a-typography-text class="flex items-center">
                  {{ trlang.end }}
                </a-typography-text>
                <a-input v-model:value="exchangeEndTime" style="width: 80px" />
              </a-layout>
              <p class="flex items-center text-helper">
                {{
                  trlang.please_enter_the_time_zone_where_currency_exchange_is_available
                }}
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
                v-model:value="exchangeImpossibleTimezoneMessage"
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
          {{ trlang.restrictions_on_currency_exchange_applications }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column items-start gap-2">
        <a-button
          v-for="item in exchangeRestrictionOption"
          :key="item.key"
          :class="item.key === exchangeRestriction ? 'bg-main text-white' : ''"
          @click="updateRestrictionBtn(item.key)"
        >
          <CheckOutlined v-if="item.key === exchangeRestriction" />
          {{ item.text }}
        </a-button>

        <a-layout class="w-100">
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="exchangeRestrictionUse" class="w-fit me-2" />
              <a-typography-text class="flex item-center text-white" style="width: 45px">
                {{ exchangeRestrictionUse ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 flex gap-2 bg-white flex-wrap">
              <a-typography-text class="flex items-center">
                {{ trlang.since_the_last_exchange }}
              </a-typography-text>
              <a-input v-model:value="exchangeRestrictionLimit" type="number" :min="1" style="width: 80px" />
              <a-typography-text class="flex items-center">
                {{ trlang.request_for_currency_exchange_cannot_be_made_within_10minutes }}
              </a-typography-text>
            </a-layout-content>
          </a-layout>

          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="chargeRestrictionUse" class="w-fit me-2" />
              <a-typography-text class="flex item-center text-white" style="width: 45px">
                {{ chargeRestrictionUse ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 flex gap-2 bg-white flex-wrap">
              <a-typography-text class="flex items-center">
                {{ trlang.since_the_last_charge }}
              </a-typography-text>
              <a-input v-model:value="chargeRestrictionLimit" type="number" :min="1" style="width: 80px" />
              <a-typography-text class="flex items-center">
                {{ trlang.request_for_currency_exchange_cannot_be_made_within_10minutes }}
              </a-typography-text>
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.exchange_completion_notification_message }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="exchangeCompleteMessage" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const exchangeMin = ref('');
const exchangeMax = ref('');
const exchangeMaxOption = ref([]);
const exchangeTimezone = ref(true);
const exchangeImpossibleTimezoneMessage = ref('');
const exchangeStartTime = ref('');
const exchangeEndTime = ref('');
const exchangeRestrictionOption = ref([]);
const exchangeRestriction = ref(0);
const exchangeRestrictionUse = ref(true);
const exchangeRestrictionLimit = ref('');
const chargeRestrictionUse = ref(true);
const chargeRestrictionLimit = ref('');
const exchangeCompleteMessage = ref('');

const getComponentData = () => {
  exchangeMaxOption.value = [1000, 10000, 100000].map((amount, idx) => ({
    key: idx,
    amount: amount,
  }));

  exchangeRestrictionOption.value = [
    {
      key: 'impossible',
      text:
        trlang.value
          .additional_applications_are_not_possible_during_currency_exchange_application,
    },
    {
      key: 'request',
      text:
        trlang.value.same_amount_cannot_be_requested_during_currency_exchange_application,
    },
    {
      key: 'allow',
      text:
        trlang.value.additional_applications_allowed_during_currency_exchange_application,
    },
  ];
};

const formatTime = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return value.toString();
  const digits = numericValue.toString().padStart(4, '0');
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
};

const loadData = (data) => {
  exchangeMin.value =
    data.exchange_min !== undefined && data.exchange_min !== null
      ? data.exchange_min.toString()
      : '';
  exchangeMax.value = data.exchange_max
    ? data.exchange_max
    : exchangeMaxOption.value[0]?.amount;
  exchangeTimezone.value = data.exchange_timezone ?? true;
  exchangeStartTime.value = formatTime(data.exchange_start_time);
  exchangeEndTime.value = formatTime(data.exchange_end_time);
  exchangeImpossibleTimezoneMessage.value =
    data.exchange_impossible_timezone_message ?? '';
  exchangeRestriction.value = data.exchange_restriction ?? '';
  exchangeRestrictionUse.value = data.exchange_restriction_use ?? true;
  exchangeRestrictionLimit.value =
    data.exchange_restriction_limit !== undefined &&
    data.exchange_restriction_limit !== null
      ? data.exchange_restriction_limit.toString()
      : '';
  chargeRestrictionUse.value = data.charge_restriction_use ?? true;
  chargeRestrictionLimit.value =
    data.charge_restriction_limit !== undefined &&
    data.charge_restriction_limit !== null
      ? data.charge_restriction_limit.toString()
      : '';
  exchangeCompleteMessage.value = data.exchange_complete_message ?? '';
};

watch(() => props.dataSource, loadData, { immediate: true });

const updateRestrictionBtn = (key) => (exchangeRestriction.value = key);
const changeExchangeMax = (val) => (exchangeMax.value = val);

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
  exchangeMin: toNumber(exchangeMin.value),
  exchangeMax: toNumber(exchangeMax.value),
  exchangeTimezone: exchangeTimezone.value,
  exchangeStartTime: exchangeTimezone.value ? toTimeNumber(exchangeStartTime.value) : null,
  exchangeEndTime: exchangeTimezone.value ? toTimeNumber(exchangeEndTime.value) : null,
  exchangeImpossibleTimezoneMessage: exchangeImpossibleTimezoneMessage.value,
  exchangeRestriction: exchangeRestriction.value,
  exchangeRestrictionUse: exchangeRestrictionUse.value,
  exchangeRestrictionLimit: exchangeRestrictionUse.value
    ? toNumber(exchangeRestrictionLimit.value)
    : null,
  chargeRestrictionUse: chargeRestrictionUse.value,
  chargeRestrictionLimit: chargeRestrictionUse.value
    ? toNumber(chargeRestrictionLimit.value)
    : null,
  exchangeCompleteMessage: exchangeCompleteMessage.value,
});

const validate = () => {
  const state = buildState();
  const errors = [];

  if (exchangeMin.value !== null && exchangeMin.value !== undefined && exchangeMin.value !== '' && !isNumericInput(exchangeMin.value)) {
    errors.push(trlang.value.exchange_minimum_must_be_number);
  } else if (state.exchangeMin === null || state.exchangeMin < 0) {
    errors.push(trlang.value.please_enter_valid_minimum_exchange_amount);
  }

  const maxValue = exchangeMax.value;
  if (maxValue && typeof maxValue === 'string') {
    if (!isNumericInput(maxValue)) {
      errors.push(trlang.value.exchange_maximum_must_be_number);
    }
  }
  if (state.exchangeMax === null || state.exchangeMax <= 0) {
    errors.push(trlang.value.please_enter_valid_maximum_exchange_amount);
  }
  if (
    state.exchangeMin !== null &&
    state.exchangeMax !== null &&
    state.exchangeMin > state.exchangeMax
  ) {
    errors.push(trlang.value.exchange_min_cannot_exceed_exchange_max);
  }

  if (state.exchangeTimezone) {
    if (state.exchangeStartTime === null) {
      errors.push(trlang.value.please_enter_valid_exchange_start_time);
    }
    if (state.exchangeEndTime === null) {
      errors.push(trlang.value.please_enter_valid_exchange_end_time);
    }
    if (
      state.exchangeStartTime !== null &&
      state.exchangeEndTime !== null &&
      state.exchangeStartTime >= state.exchangeEndTime
    ) {
      errors.push(trlang.value.exchange_start_time_must_be_before_end_time);
    }
  }

  if (state.exchangeRestrictionUse && state.exchangeRestrictionLimit === null) {
    errors.push(trlang.value.please_enter_valid_exchange_restriction_limit);
  }

  if (state.chargeRestrictionUse && state.chargeRestrictionLimit === null) {
    errors.push(trlang.value.please_enter_valid_charge_restriction_limit);
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

onBeforeMount(getComponentData);
</script>
