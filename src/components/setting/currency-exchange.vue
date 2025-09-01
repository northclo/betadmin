<template>
  <a-layout class="bg-white mt-2">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.currency_exchange_setting }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.exchange_amount }}
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
        <a-select
          ref="select"
          v-model:value="maxAmount"
          style="width: 120px"
          @focus="focus"
          @change="changeExchangeAmount"
        >
          <a-select-option
            v-for="item in maxAmountOption"
            :key="item.key"
            :value="item.amount"
          >
            {{ item.amount }}
          </a-select-option>
        </a-select>
        <a-typography-text class="d-flex items-center text-yellow">
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
            <a-layout-content class="border p-2 d-flex gap-2 bg-white">
              <a-textarea :rows="4" v-model:value="timezoneText" allow-clear />
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
      <a-layout-content class="border p-2 d-flex flex-column items-start gap-2">
        <a-button
          v-for="item in restrictBtn"
          :key="item.key"
          :class="item.key === activeRestrictBtn ? 'bg-main text-white' : ''"
          @click="updateRestrictionBtn(item.key)"
        >
          <CheckOutlined v-if="item.key === activeRestrictBtn" />
          {{ item.text }}
        </a-button>
        <a-layout class="w-100">
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="restrictionExchangeCheck" class="w-fit me-2" />
              <a-typography-text
                class="d-flex item-center text-white"
                style="width: 45px"
              >
                {{ restrictionExchangeCheck ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 d-flex gap-2 bg-white flex-wrap">
              <a-typography-text class="d-flex items-center">
                {{ trlang.since_the_last_exchange }}
              </a-typography-text>
              <a-input v-model:value="restrictionExchangeAmount" style="width: 80px" />
              <a-typography-text class="d-flex items-center">
                {{ trlang.request_for_currency_exchange_cannot_be_made_within_10minutes }}
              </a-typography-text>
            </a-layout-content>
          </a-layout>
          <a-layout class="w-100">
            <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
              <a-switch v-model:checked="restrictionChargeCheck" class="w-fit me-2" />
              <a-typography-text
                class="d-flex item-center text-white"
                style="width: 45px"
              >
                {{ restrictionChargeCheck ? trlang.use : trlang.no_use }}
              </a-typography-text>
            </a-layout-sider>
            <a-layout-content class="border p-2 d-flex gap-2 bg-white flex-wrap">
              <a-typography-text class="d-flex items-center">
                {{ trlang.since_the_last_charge }}
              </a-typography-text>
              <a-input v-model:value="restrictionChargeAmount" style="width: 80px" />
              <a-typography-text class="d-flex items-center">
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
        <a-textarea :rows="4" v-model:value="completeMessage" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onBeforeMount, onMounted, ref } from "vue";
import { RightCircleFilled, CheckOutlined } from "@ant-design/icons-vue";

export default {
  name: "CurrencyExchangeSetting",
  components: { RightCircleFilled, CheckOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const minAmount = ref(0);
    const maxAmount = ref(0);
    const maxAmountOption = ref([]);
    const timezoneCheck = ref(true);
    const timezoneText = ref("");
    const startTime = ref(0);
    const endTime = ref(0);
    const restrictBtn = ref([]);
    const activeRestrictBtn = ref(0);
    const restrictionExchangeCheck = ref(true);
    const restrictionExchangeAmount = ref(0);
    const restrictionChargeCheck = ref(true);
    const restrictionChargeAmount = ref(0);
    const completeMessage = ref("");

    const getComponentData = () => {
      const _restrictBtn = [
        trlang.value
          .additional_applications_are_not_possible_during_currency_exchange_application,
        trlang.value.same_amount_cannot_be_requested_during_currency_exchange_application,
        trlang.value.additional_applications_allowed_during_currency_exchange_application,
      ];
      restrictBtn.value = _restrictBtn.map((element, idx) => ({
        key: idx,
        text: element,
      }));

      const _maxAmountOption = [1000, 10000, 100000];
      maxAmountOption.value = _maxAmountOption.map((element, idx) => ({
        key: idx,
        amount: element + " USD",
      }));
    };

    const fetchData = async () => {
      minAmount.value = 10;
      maxAmount.value = 10000 + " USD";
      activeRestrictBtn.value = 0;
      startTime.value = 6;
      endTime.value = 22;
      timezoneText.value = "Your location is not available";
      restrictionExchangeAmount.value = 20;
      restrictionChargeAmount.value = 10;
      completeMessage.value = "exchange successful";
    };

    const updateRestrictionBtn = (key) => {
      activeRestrictBtn.value = key;
    };

    onMounted(() => {
      fetchData();
    });

    onBeforeMount(() => {
      getComponentData();
    });

    return {
      trlang,
      minAmount,
      maxAmount,
      maxAmountOption,
      timezoneCheck,
      startTime,
      endTime,
      timezoneText,
      restrictBtn,
      activeRestrictBtn,
      restrictionExchangeCheck,
      restrictionExchangeAmount,
      restrictionChargeCheck,
      restrictionChargeAmount,
      completeMessage,
      updateRestrictionBtn,
    };
  },
};
</script>
