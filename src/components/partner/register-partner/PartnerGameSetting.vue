<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_game_settings }}
    </a-typography-text>

    <a-layout class="bg-white flex flex-row justify-center items-center gap-2 mt-2">
      <a-typography-text>
        {{ trlang.setup_as_other_partner_setting }}
      </a-typography-text>
      <a-tree-select v-model:value="activeSetting" class="input-xl" :tree-data="partnerOptions" :field-names="{
        label: 'nickname',
        value: 'partner_id',
        children: 'subs',
      }" tree-default-expand-all show-search />
      <a-button class="bg-gray text-white" @click="changeActivePartner">{{ trlang.get_settings }}</a-button>
    </a-layout>

    <a-typography-text class="text-dark-brown mt-2">
      {{ trlang.if_there_is_empty_or_0_value_then_it_means_not_used }}
    </a-typography-text>

    <a-layout class="bg-white flex flex-row">
      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.dividend_type }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-select ref="select" v-model:value="dividendType" class="input-md" :options="dividendTypeOptions" />
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.deadline }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="deadline" class="input-sm" />
          <a-typography-text>{{ trlang.seconds }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.cancel_bet }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column">
        <a-layout class="flex flex-row bg-none">
          <a-button :class="cancelBet ? 'bg-main text-white' : ''" @click="cancelBet = true">
            {{ trlang.possible_to_cancel }}
          </a-button>
          <a-button :class="!cancelBet ? 'bg-main text-white' : ''" @click="cancelBet = false">
            {{ trlang.impossible_to_cancel }}
          </a-button>
        </a-layout>
        <a-layout class="flex flex-row items-center flex-wrap gap-2 bg-none mt-2">
          <a-typography-text class="text-dark-brown">
            {{ trlang.possible_to_cancel }}:
          </a-typography-text>
          <a-typography-text class="text-dark-brown">
            {{ trlang.end_time }}
          </a-typography-text>
          <a-input v-model:value="cancelBetEndTime" class="input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.seconds_before_per_one_round }}
          </a-typography-text>
          <a-input v-model:value="cancelBetMaxTime" class="input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.times_per_day }}
          </a-typography-text>
          <a-input v-model:value="cancelBetPerday" class="input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.times }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white flex flex-row">
      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.bet_unit }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center flex-wrap gap-2">
          <a-select ref="select" v-model:value="betUnit" class="input-md" :options="betUnitOption" />
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_bet_min }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneTimeBetMin" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-white flex flex-row">
      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_bet_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneTimeBetMax" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.onetime_earning_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneTimeEarningMax" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-white flex flex-row">
      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_bet_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneRoundBetMax" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_earning_max }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneRoundEarningMax" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-white flex flex-row">
      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_bet_max_per_slot }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneRoundBetMaxPerSlot" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.one_round_earning_max_per_slot }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="oneRoundEarningMaxPerSlot" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-none">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.all_rounds_bet_max }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-input v-model:value="allRoundsBetMax" class="input-sm" />
        <a-typography-text>{{ trlang.usd }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-none">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.setting }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2">
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.bet_type }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="bg-gray p-2 flex items-center justify-center border">
            <a-typography-text class="text-white text-center">
              {{ trlang.all_rounds_bet_max_per_slot }}
            </a-typography-text>
          </a-layout-content>
          <a-layout-content class="bg-gray p-2 flex items-center justify-center border">
            <a-typography-text class="text-white">
              {{ trlang.public }}
            </a-typography-text>
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.oedv }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.unov }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.oeuo }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -3)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -4)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
        <a-layout class="bg-none">
          <a-layout-sider class="bg-gray p-2 border setting-sider">
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -6)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="border p-2 flex items-center justify-end gap-2">
            <a-input v-model:value="value" class="input-sm" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-content class="p-2 border flex justify-center items-center">
            <a-checkbox v-model:checked="checked" />
          </a-layout-content>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, defineExpose, onMounted } from "vue";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive toggle state */
const isActive = ref(false);
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
const oneTimeBetMin = ref(null);
const oneTimeBetMax = ref(null);
const oneTimeEarningMax = ref(null);
const oneRoundBetMax = ref(null);
const oneRoundEarningMax = ref(null);
const oneRoundBetMaxPerSlot = ref(null);
const oneRoundEarningMaxPerSlot = ref(null);
const allRoundsBetMax = ref(null);

const fetchData = async () => {
  const result = await getData(apiLink.get_game_partner);
  partnerOptions.value = result.data;

  dividendTypeOptions.value = [
    {
      value: "A",
      label: "A",
    },
    {
      value: "B",
      label: "B",
    },
  ];
};

onMounted(() => {
  fetchData();
});

const findPartnerById = (node) => {
  if (node.partner_id === activeSetting.value) return node; // Check current object
  if (!node.subs) return null; // No children

  for (const sub of node.subs) {
    const found = findPartnerById(sub); // Recursive search
    if (found) return found;
  }

  return null; // Not found
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

/* Expose state for parent access */
defineExpose({
  getState: () => ({ isActive: isActive.value }),
});
</script>
