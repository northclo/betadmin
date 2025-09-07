<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text class="text-dark-gray fs-3">
      {{ trlang.partner_game_settings }}
    </a-typography-text>

    <a-layout class="bg-white flex flex-row justify-center items-center gap-2">
      <a-typography-text>
        {{ trlang.setup_as_other_partner_setting }}
      </a-typography-text>
      <a-select
        ref="select"
        v-model:value="value1"
        class="input-lg"
        :options="options1"
        @focus="focus"
        @change="handleChange"
      ></a-select>
      <a-button class="bg-gray text-white">{{ trlang.get_settings }}</a-button>
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
          <a-select
            ref="select"
            v-model:value="value1"
            class="input-md"
            :options="options1"
            @focus="focus"
            @change="handleChange"
          ></a-select>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-none">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.deadline }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.seconds }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-none">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.cancel_bet }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 flex flex-column">
        <a-layout class="flex flex-row bg-none">
          <a-button>{{ trlang.possible_to_cancel }}</a-button>
          <a-button>{{ trlang.impossible_to_cancel }}</a-button>
        </a-layout>
        <a-layout class="flex flex-row items-center flex-wrap gap-2 bg-none mt-2">
          <a-typography-text class="text-dark-brown">
            {{ trlang.possible_to_cancel }}:
          </a-typography-text>
          <a-typography-text class="text-dark-brown">
            {{ trlang.end_time }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.seconds_before_per_one_round }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text class="text-dark-brown">
            {{ trlang.times_per_day }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
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
          <a-select
            ref="select"
            v-model:value="betUnit"
            class="input-md"
            :options="betUnitOption"
          ></a-select>
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
          <a-input v-model:oneRoundEarningMax="value" class="input-sm" />
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
import { ref, computed, inject, watch, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
  },
});

/* Inject language translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive toggle state */
const isActive = ref(false);

const options1 = ref([
  {
    value: "jack",
    label: "Jack",
  },
  {
    value: "lucy",
    label: "Lucy",
  },
  {
    value: "disabled",
    label: "Disabled",
  },
  {
    value: "yiminghe",
    label: "Yiminghe",
  },
]);

/* Sync state with props */
watch(
  () => props.dataSource?.siteSecurity,
  (newVal) => {
    isActive.value = Boolean(newVal);
  },
  { immediate: true }
);

/* Expose state for parent access */
defineExpose({
  getState: () => ({ isActive: isActive.value }),
});
</script>
