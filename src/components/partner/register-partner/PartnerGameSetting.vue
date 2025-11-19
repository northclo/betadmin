<template>
  <a-layout class="mt-5">
    <a-typography-text class="text-dark-gray fs-4 font-semibold">
      {{ trlang.partner_game_settings }}
    </a-typography-text>

    <a-layout class="flex flex-row justify-center items-center gap-2 mt-2">
      <a-typography-text>
        {{ trlang.setup_as_other_partner_setting }}
      </a-typography-text>
      <a-tree-select v-model:value="activeSetting" class="input-xl" :tree-data="partnerOptions" :field-names="{
        label: 'nickname',
        value: 'partner_id',
        children: 'subs',
      }" tree-default-expand-all show-search />
      <a-button class="text-white" @click="changeActivePartner">{{ trlang.get_settings }}</a-button>
    </a-layout>

    <a-typography-text class="text-dark-brown mt-2">
      {{ trlang.if_there_is_empty_or_0_value_then_it_means_not_used }}
    </a-typography-text>

    <a-layout class="flex flex-row border-t border-b">
      <a-layout>
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.dividend_type }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-select ref="select" v-model:value="dividendType" class="input-md" :options="dividendTypeOptions" />
        </a-layout-content>
      </a-layout>

      <a-layout>
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.deadline }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="deadline" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.seconds }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.cancel_bet }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex flex-column">
        <a-layout class="flex flex-row">
          <a-button
            v-for="item in cancelBetOption"
            :key="item.key"
            :class="item.value === cancelBet ? 'bg-main text-white' : ''"
            @click="setCancelBet(item.value)"
          >
            <CheckOutlined v-if="item.value === cancelBet" />
            {{ item.text }}
          </a-button>
        </a-layout>
        <a-layout class="flex flex-row items-center flex-wrap gap-2 mt-2">
          <a-typography-text class="text-dark-brown">
            {{ trlang.possible_to_cancel }}:
          </a-typography-text>
          <a-typography-text class="text-dark-brown">
            {{ trlang.end_time }}
          </a-typography-text>
          <a-input-number v-model:value="cancelBetEndTime" class="input-sm" :min="0" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.seconds_before_per_one_round }}
          </a-typography-text>
          <a-input-number v-model:value="cancelBetMaxTime" class="input-sm" :min="0" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.times_per_day }}
          </a-typography-text>
          <a-input-number v-model:value="cancelBetPerday" class="input-sm" :min="0" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.times }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="flex flex-row border-b">
      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bet_unit }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center flex-wrap gap-2">
          <a-select ref="select" v-model:value="betUnit" class="input-md" :options="betUnitOption" />
        </a-layout-content>
      </a-layout>

      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_bet_min }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneTimeBetMin" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="flex flex-row border-b">
      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_bet_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneTimeBetMax" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_earning_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneTimeEarningMax" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="flex flex-row border-b">
      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_bet_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneRoundBetMax" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_earning_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneRoundEarningMax" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="flex flex-row border-b">
      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_bet_max_per_slot }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneRoundBetMaxPerSlot" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_earning_max_per_slot }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center gap-2">
          <a-input-number v-model:value="oneRoundEarningMaxPerSlot" class="input-sm" :min="0" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.all_rounds_bet_max }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-input-number v-model:value="allRoundsBetMax" class="input-sm" :min="0" />
        <a-typography-text>{{ trlang.usd }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.setting }}
        </a-typography-text>
      </a-layout-sider>

      <a-layout-content class="p-2">
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.bet_type }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="p-2 flex items-center justify-center border">
            <a-typography-text class="text-white text-center">
              {{ trlang.all_rounds_bet_max_per_slot }}
            </a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 flex items-center justify-center border">
            <a-typography-text class="text-white">
              {{ trlang.public }}
            </a-typography-text>
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.oedv }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotOedv" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotOedvPublic" />
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.unov }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotUnov" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotUnovPublic" />
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.oeuo }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotOeuo" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotOeuoPublic" />
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -3)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotMatch13" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotMatch13Public" />
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -4)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotMatch14" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotMatch14Public" />
          </a-layout-content>
        </a-layout>
        <a-layout class="">
          <a-layout-sider class="p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -6)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input-number v-model:value="slotMatch16" class="input-sm" :min="0" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="slotMatch16Public" />
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose, onMounted, watch } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  partnerData: {
    type: Object,
    default: null,
  },
});

/* Reactive toggle state */
const activeSetting = ref("");
const partnerOptions = ref([]);
const dividendType = ref("");
const dividendTypeOptions = ref([]);
const deadline = ref(null);
const cancelBet = ref(false);
const cancelBetEndTime = ref(null);
const cancelBetMaxTime = ref(null);
const cancelBetPerday = ref(null);
const betUnit = ref("");
const betUnitOption = ref([
  { value: "1", label: "1" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
]);
const cancelBetOption = ref([]);
const oneTimeBetMin = ref(null);
const oneTimeBetMax = ref(null);
const oneTimeEarningMin = ref(null);
const oneTimeEarningMax = ref(null);
const oneRoundBetMax = ref(null);
const oneRoundEarningMax = ref(null);
const oneRoundBetMaxPerSlot = ref(null);
const oneRoundEarningMaxPerSlot = ref(null);
const allRoundsBetMax = ref(null);

const slotOedv = ref(null);
const slotOedvPublic = ref(false);
const slotUnov = ref(null);
const slotUnovPublic = ref(false);
const slotOeuo = ref(null);
const slotOeuoPublic = ref(false);
const slotMatch13 = ref(null);
const slotMatch13Public = ref(false);
const slotMatch14 = ref(null);
const slotMatch14Public = ref(false);
const slotMatch16 = ref(null);
const slotMatch16Public = ref(false);

const fetchData = async () => {
  const result = await getData(apiLink.get_game_partner);
  partnerOptions.value = result.data;

  dividendTypeOptions.value = [
    {
      value: "A",
      label: trlang.value.option_a,
    },
    {
      value: "B",
      label: trlang.value.option_b,
    },
  ];

  cancelBetOption.value = [
    {
      key: "possible",
      value: true,
      text: trlang.value.possible_to_cancel,
    },
    {
      key: "impossible",
      value: false,
      text: trlang.value.impossible_to_cancel,
    },
  ];
};

onMounted(() => {
  fetchData();
});

const findPartnerById = (node) => {
  if (node.partner_id === activeSetting.value) return node;
  if (!node.subs) return null;

  for (const sub of node.subs) {
    const found = findPartnerById(sub);
    if (found) return found;
  }

  return null;
};

const setCancelBet = (value) => {
  cancelBet.value = value;
};

const changeActivePartner = () => {
  const partner = findPartnerById(partnerOptions.value[0]);

  dividendType.value = partner.bet_rate_type || "A";
  cancelBet.value = partner.cancel_bet || false;
  cancelBetEndTime.value = partner.cancel_bet_range
    ? partner.cancel_bet_range.end_time
    : 0 || 0;
  cancelBetMaxTime.value = partner.cancel_bet_range
    ? partner.cancel_bet_range.max_time
    : 0 || 0;
  cancelBetPerday.value = partner.cancel_bet_range
    ? partner.cancel_bet_range.perday_time
    : 0 || 0;
  betUnit.value = partner.bet_money_unit;
  oneTimeBetMin.value = partner.onetime_bet_min;
  oneTimeBetMax.value = partner.onetime_bet_max;
  oneTimeEarningMax.value = partner.onetime_earning_max;
  oneRoundBetMax.value = partner.oneround_bet_max;
  oneRoundEarningMax.value = partner.oneround_earning_max;
  oneRoundBetMaxPerSlot.value = partner.oneround_bet_max_slot;
  oneRoundEarningMaxPerSlot.value = partner.oneround_earning_max_slot;
  allRoundsBetMax.value = partner.all_rounds_bet_max;
};

const loadData = () => {
  if (props.partnerData) {
    dividendType.value = props.partnerData.bet_rate_type || "";
    deadline.value = props.partnerData.deadline ?? null;
    cancelBet.value = props.partnerData.cancel_bet ?? false;
    cancelBetEndTime.value = props.partnerData.cancel_bet_range?.end_time ?? null;
    cancelBetMaxTime.value = props.partnerData.cancel_bet_range?.max_time ?? null;
    cancelBetPerday.value = props.partnerData.cancel_bet_range?.perday_time ?? null;
    betUnit.value = props.partnerData.bet_money_unit || "";
    oneTimeBetMin.value = props.partnerData.onetime_bet_min ?? null;
    oneTimeBetMax.value = props.partnerData.onetime_bet_max ?? null;
    oneTimeEarningMin.value = props.partnerData.onetime_earning_min ?? null;
    oneTimeEarningMax.value = props.partnerData.onetime_earning_max ?? null;
    oneRoundBetMax.value = props.partnerData.oneround_bet_max ?? null;
    oneRoundEarningMax.value = props.partnerData.oneround_earning_max ?? null;
    oneRoundBetMaxPerSlot.value = props.partnerData.oneround_bet_max_slot ?? null;
    oneRoundEarningMaxPerSlot.value = props.partnerData.oneround_earning_max_slot ?? null;
    allRoundsBetMax.value = props.partnerData.all_rounds_bet_max ?? null;

    if (props.partnerData.all_rounds_bet_max_by_slots && Array.isArray(props.partnerData.all_rounds_bet_max_by_slots)) {
      props.partnerData.all_rounds_bet_max_by_slots.forEach(slot => {
        if (slot.bet_type === 'oedv') {
          slotOedv.value = slot.slot_bet_max ?? null;
          slotOedvPublic.value = slot.public ?? false;
        } else if (slot.bet_type === 'unov') {
          slotUnov.value = slot.slot_bet_max ?? null;
          slotUnovPublic.value = slot.public ?? false;
        } else if (slot.bet_type === 'oeuo') {
          slotOeuo.value = slot.slot_bet_max ?? null;
          slotOeuoPublic.value = slot.public ?? false;
        } else if (slot.bet_type === 'match_1_3') {
          slotMatch13.value = slot.slot_bet_max ?? null;
          slotMatch13Public.value = slot.public ?? false;
        } else if (slot.bet_type === 'match_1_4') {
          slotMatch14.value = slot.slot_bet_max ?? null;
          slotMatch14Public.value = slot.public ?? false;
        } else if (slot.bet_type === 'match_1_6') {
          slotMatch16.value = slot.slot_bet_max ?? null;
          slotMatch16Public.value = slot.public ?? false;
        }
      });
    }
  }
};

watch(() => props.partnerData, (newData) => {
  if (newData) {
    loadData();
  }
}, { immediate: true });

const reset = () => {
  activeSetting.value = "";
  dividendType.value = "";
  deadline.value = null;
  cancelBet.value = false;
  cancelBetEndTime.value = null;
  cancelBetMaxTime.value = null;
  cancelBetPerday.value = null;
  betUnit.value = "";
  oneTimeBetMin.value = null;
  oneTimeBetMax.value = null;
  oneTimeEarningMin.value = null;
  oneTimeEarningMax.value = null;
  oneRoundBetMax.value = null;
  oneRoundEarningMax.value = null;
  oneRoundBetMaxPerSlot.value = null;
  oneRoundEarningMaxPerSlot.value = null;
  allRoundsBetMax.value = null;
  slotOedv.value = null;
  slotOedvPublic.value = false;
  slotUnov.value = null;
  slotUnovPublic.value = false;
  slotOeuo.value = null;
  slotOeuoPublic.value = false;
  slotMatch13.value = null;
  slotMatch13Public.value = false;
  slotMatch14.value = null;
  slotMatch14Public.value = false;
  slotMatch16.value = null;
  slotMatch16Public.value = false;
};

defineExpose({
  getState: () => {
    const allRoundsBetMaxBySlots = [];
    
    if (slotOedv.value !== null && slotOedv.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'oedv',
        slot_bet_max: slotOedv.value,
        public: slotOedvPublic.value
      });
    }
    if (slotUnov.value !== null && slotUnov.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'unov',
        slot_bet_max: slotUnov.value,
        public: slotUnovPublic.value
      });
    }
    if (slotOeuo.value !== null && slotOeuo.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'oeuo',
        slot_bet_max: slotOeuo.value,
        public: slotOeuoPublic.value
      });
    }
    if (slotMatch13.value !== null && slotMatch13.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'match_1_3',
        slot_bet_max: slotMatch13.value,
        public: slotMatch13Public.value
      });
    }
    if (slotMatch14.value !== null && slotMatch14.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'match_1_4',
        slot_bet_max: slotMatch14.value,
        public: slotMatch14Public.value
      });
    }
    if (slotMatch16.value !== null && slotMatch16.value !== undefined) {
      allRoundsBetMaxBySlots.push({
        bet_type: 'match_1_6',
        slot_bet_max: slotMatch16.value,
        public: slotMatch16Public.value
      });
    }

    return {
      activeSetting: activeSetting.value,
      dividendType: dividendType.value,
      deadline: deadline.value,
      cancelBet: cancelBet.value,
      cancelBetEndTime: cancelBetEndTime.value,
      cancelBetMaxTime: cancelBetMaxTime.value,
      cancelBetPerday: cancelBetPerday.value,
      betUnit: betUnit.value,
      oneTimeBetMin: oneTimeBetMin.value,
      oneTimeBetMax: oneTimeBetMax.value,
      oneTimeEarningMin: oneTimeEarningMin.value,
      oneTimeEarningMax: oneTimeEarningMax.value,
      oneRoundBetMax: oneRoundBetMax.value,
      oneRoundEarningMax: oneRoundEarningMax.value,
      oneRoundBetMaxPerSlot: oneRoundBetMaxPerSlot.value,
      oneRoundEarningMaxPerSlot: oneRoundEarningMaxPerSlot.value,
      allRoundsBetMax: allRoundsBetMax.value,
      allRoundsBetMaxBySlots: allRoundsBetMaxBySlots,
    };
  },
  reset,
});
</script>
