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
      <a-layout-content class="d-flex gap-2 border p-2 flex-wrap">
        <a-typography-text class="d-flex items-center text-yellow">
          {{ trlang.minimum }}
        </a-typography-text>
        <a-input v-model:value="minAmount" style="width: 80px" />
        <a-typography-text class="d-flex items-center text-yellow">
          {{ trlang.from }}
        </a-typography-text>
        <a-typography-text class="d-flex items-center">
          {{ trlang.one_use_or_more }}
        </a-typography-text>
        <a-select v-model:value="maxAmount" style="width: 120px">
          <a-select-option
            v-for="item in maxAmountOption"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
        <a-typography-text class="d-flex items-center text-yellow">
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
      <a-layout-content class="border p-2 d-flex flex-column items-start gap-2">
        <a-layout class="w-100">
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="timezoneCheck" class="w-fit me-2" />
              <a-typography-text
                class="d-flex item-center text-white"
                style="width: 45px"
              >
                {{ timezoneCheck ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 bg-white">
              <a-layout class="bg-white d-flex flex-row gap-2 flex-wrap">
                <a-typography-text class="d-flex items-center">
                  {{ trlang.start }}
                </a-typography-text>
                <a-input v-model:value="startTime" style="width: 80px" />
                <a-typography-text class="d-flex items-center">~</a-typography-text>
                <a-typography-text class="d-flex items-center">
                  {{ trlang.end }}
                </a-typography-text>
                <a-input v-model:value="endTime" style="width: 80px" />
              </a-layout>
              <a-typography-text class="d-flex items-center text-yellow">
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
            <a-layout-content class="border p-2 d-flex gap-2 bg-white">
              <a-textarea :rows="4" v-model:value="timezoneText" allow-clear />
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
        <a-textarea :rows="4" v-model:value="completeMessage" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* State */
const minAmount = ref(0);
const maxAmount = ref("");
const maxAmountOption = ref([]);
const timezoneCheck = ref(true);
const timezoneText = ref("");
const startTime = ref(0);
const endTime = ref(0);
const completeMessage = ref("");

/* Init select options */
const initOptions = () => {
  maxAmountOption.value = [1000, 10000, 100000].map((amt, idx) => ({
    key: idx,
    amount: amt + " USD",
  }));
};

/* Load from props */
const loadData = (data) => {
  if (!data?.charge) return;
  const ch = data.charge;
  minAmount.value = ch.minAmount ?? 0;
  maxAmount.value = ch.maxAmount
    ? ch.maxAmount + " USD"
    : maxAmountOption.value[0]?.amount;
  timezoneCheck.value = ch.timezoneAvailable ?? true;
  startTime.value = ch.startTime ?? 0;
  endTime.value = ch.endTime ?? 0;
  timezoneText.value = ch.impossibleMessage ?? "";
  completeMessage.value = ch.completeMessage ?? "";
};

watch(() => props.dataSource, loadData, { immediate: true });

/* Expose state to parent */
defineExpose({
  getState: () => ({
    minAmount: minAmount.value,
    maxAmount: Number(maxAmount.value.replace(" USD", "")),
    timezoneAvailable: timezoneCheck.value,
    startTime: startTime.value,
    endTime: endTime.value,
    impossibleMessage: timezoneText.value,
    completeMessage: completeMessage.value,
  }),
});

onBeforeMount(initOptions);
</script>
