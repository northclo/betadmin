<template>
  <a-collapse-panel class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.charge_setting }}
      </a-typography-text>
    </template>

    <!-- Recharge Amount -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.recharge_amount }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex gap-2 border p-2 flex-wrap">
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.minimum }}
        </a-typography-text>
        <a-input v-model:value="chargeMin" style="width: 80px" />
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.from }}
        </a-typography-text>
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
        <a-typography-text class="flex items-center text-yellow">
          {{ trlang.rechargeable_with }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <!-- Charging Time Zone -->
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
              <a-typography-text class="flex items-center text-yellow">
                {{ trlang.please_enter_the_charging_time_zone }}
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
                v-model:value="chargeImpossibleTimezoneMessage"
                allow-clear
              />
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <!-- Completion Message -->
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

const chargeMin = ref(null);
const chargeMax = ref('');
const chargeMaxOption = ref([]);
const chargeTimezone = ref(true);
const chargeImpossibleTimezoneMessage = ref('');
const chargeStartTime = ref(null);
const chargeEndTime = ref(null);
const chargeCompleteMessage = ref('');

const initOptions = () => {
  chargeMaxOption.value = [1000, 10000, 100000].map((amt, idx) => ({
    key: idx,
    amount: amt + ' USD',
  }));
};

const loadData = (data) => {
  chargeMin.value = data.charge_min ?? null;
  chargeMax.value = data.charge_max
    ? data.charge_max + ' USD'
    : chargeMaxOption.value[0]?.amount;
  chargeTimezone.value = data.charge_timezone ?? true;
  chargeStartTime.value = data.charge_start_time ?? null;
  chargeEndTime.value = data.charge_end_time ?? null;
  chargeImpossibleTimezoneMessage.value = data.charge_impossible_timezone_message ?? '';
  chargeCompleteMessage.value = data.charge_complete_message ?? '';
};

watch(() => props.dataSource, loadData, { immediate: true });

defineExpose({
  getState: () => ({
    chargeMin: chargeMin.value,
    chargeMax: Number(chargeMax.value.replace(' USD', '')),
    chargeTimezone: chargeTimezone.value,
    chargeStartTime: chargeStartTime.value,
    chargeEndTime: chargeEndTime.value,
    chargeImpossibleTimezoneMessage: chargeImpossibleTimezoneMessage.value,
    chargeCompleteMessage: chargeCompleteMessage.value,
  }),
});

onBeforeMount(initOptions);
</script>
