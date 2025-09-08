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
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.minimum }}
        </a-typography-text>
        <a-input v-model:value="exchangeMin" style="width: 80px" />
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.from }}
        </a-typography-text>
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
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.can_be_exchanged_for }}
        </a-typography-text>
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
                <a-typography-text class="flex items-center">~</a-typography-text>
                <a-typography-text class="flex items-center">
                  {{ trlang.end }}
                </a-typography-text>
                <a-input v-model:value="exchangeEndTime" style="width: 80px" />
              </a-layout>
              <a-typography-text class="flex items-center text-yellow">
                {{
                  trlang.please_enter_the_time_zone_where_currency_exchange_is_available
                }}
                {{ trlang.enter_in_24hour_format }}
              </a-typography-text>
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
              <a-input v-model:value="exchangeRestrictionLimit" style="width: 80px" />
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
              <a-input v-model:value="chargeRestrictionLimit" style="width: 80px" />
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

const exchangeMin = ref(0);
const exchangeMax = ref('');
const exchangeMaxOption = ref([]);
const exchangeTimezone = ref(true);
const exchangeImpossibleTimezoneMessage = ref('');
const exchangeStartTime = ref(0);
const exchangeEndTime = ref(0);
const exchangeRestrictionOption = ref([]);
const exchangeRestriction = ref(0);
const exchangeRestrictionUse = ref(true);
const exchangeRestrictionLimit = ref(0);
const chargeRestrictionUse = ref(true);
const chargeRestrictionLimit = ref(0);
const exchangeCompleteMessage = ref('');

const getComponentData = () => {
  exchangeMaxOption.value = [1000, 10000, 100000].map((amount, idx) => ({
    key: idx,
    amount: amount + ' USD',
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

const loadData = (data) => {
  exchangeMin.value = data.exchange_min ?? null;
  exchangeMax.value = data.exchange_max
    ? data.exchange_max + ' USD'
    : exchangeMaxOption.value[0]?.amount;
  exchangeTimezone.value = data.exchange_timezone ?? true;
  exchangeStartTime.value = data.exchange_start_time ?? null;
  exchangeEndTime.value = data.exchange_end_time ?? null;
  exchangeImpossibleTimezoneMessage.value =
    data.exchange_impossible_timezone_message ?? '';
  exchangeRestriction.value = data.exchange_restriction ?? '';
  exchangeRestrictionUse.value = data.exchange_restriction_use ?? true;
  exchangeRestrictionLimit.value = data.exchange_restriction_limit ?? null;
  chargeRestrictionUse.value = data.charge_restriction_use ?? true;
  chargeRestrictionLimit.value = data.charge_restriction_limit ?? null;
  exchangeCompleteMessage.value = data.exchange_complete_message ?? '';
};

watch(() => props.dataSource, loadData, { immediate: true });

const updateRestrictionBtn = (key) => (exchangeRestriction.value = key);
const changeExchangeMax = (val) => (exchangeMax.value = val);

defineExpose({
  getState: () => ({
    exchangeMin: exchangeMin.value,
    exchangeMax: Number(exchangeMax.value.replace(' USD', '')),
    exchangeTimezone: exchangeTimezone.value,
    exchangeStartTime: exchangeStartTime.value,
    exchangeEndTime: exchangeEndTime.value,
    exchangeImpossibleTimezoneMessage: exchangeImpossibleTimezoneMessage.value,
    exchangeRestriction: exchangeRestriction.value,
    exchangeRestrictionUse: exchangeRestrictionUse.value,
    exchangeRestrictionLimit: exchangeRestrictionLimit.value,
    chargeRestrictionUse: chargeRestrictionUse.value,
    chargeRestrictionLimit: chargeRestrictionLimit.value,
    exchangeCompleteMessage: exchangeCompleteMessage.value,
  }),
});

onBeforeMount(getComponentData);
</script>
