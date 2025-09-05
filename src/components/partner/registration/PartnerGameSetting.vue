<template>
  <a-collapse-panel key="2" class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 lh-0">
        {{ trlang.partner_game_settings }}
      </a-typography-text>
    </template>

    <a-typography-text class="text-yellow">
      {{ trlang.a_blank_or_0_in_the_amount_field_will_be_treated_as_unused }}
    </a-typography-text>

    <a-layout class="d-flex flex-row">
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.dividend_type }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-select
            ref="select"
            v-model:value="value1"
            style="width: 120px"
            :options="options1"
            @focus="focus"
            @change="handleChange"
          ></a-select>
        </a-layout-content>
      </a-layout>
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.deadline }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.candle }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.cancel_bet }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex flex-column">
        <a-layout class="d-flex flex-row bg-white">
          <a-button>{{ trlang.cancellation_possible }}</a-button>
          <a-button>{{ trlang.non_cancellable }}</a-button>
        </a-layout>
        <a-layout class="d-flex flex-row items-center flex-wrap gap-2 bg-white mt-2">
          <a-typography-text class="text-yellow">
            {{ trlang.cancellation_possible }}:
          </a-typography-text>
          <a-typography-text class="text-yellow">
            {{ trlang.based_on_deadline }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text class="text-yellow">
            {{ trlang.before_the_first_time_one_time }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text class="text-yellow">
            {{ trlang.until_the_meeting_one_day }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text class="text-yellow">
            {{ trlang.cancellation_possible_up_to_the_meeting_date }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="d-flex flex-row">
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.betting_units }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center flex-wrap gap-2">
          <a-select
            ref="select"
            v-model:value="value1"
            class="input-md"
            :options="options1"
          ></a-select>
          <a-typography-text class="text-yellow">
            {{ trlang.you_can_bet_on }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.minimum_bet_on_transaction }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="d-flex flex-row">
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_single_bet_amount }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_single_winning_amount }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="d-flex flex-row">
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_bet_per_round }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_winning_amount_per_round }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="d-flex flex-row">
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_bet_per_round_per_hole }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.maximum_winning_amount_per_round_per_hole }}
          </a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 d-flex items-center gap-2">
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>{{ trlang.usd }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.maximum_cumulative_bet_per_round }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-input v-model:value="value" class="input-sm" />
        <a-typography-text>{{ trlang.usd }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.regular_ball_powerball_3_combinations_limit }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-switch v-model:checked="isActive" class="w-fit" />
          <a-typography-text class="d-flex items-center text-white ms-2">
            {{ isActive ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="d-flex items-center gap-2">
          <a-typography-text>
            {{ trlang.in_a_3_combination_game_per_round }}
          </a-typography-text>
          <a-input v-model:value="value" class="input-sm" />
          <a-typography-text>
            {{ trlang.allowed_up_to_dog_holes }}
          </a-typography-text>
        </a-layout-content>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.setting }}
        </a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2">
        <a-layout>
          <a-layout-sider class="bg-gray p-2 d-flex items-center justify-center border">
            <a-typography-text class="text-white">
              {{ trlang.division }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content class="bg-gray p-2 d-flex items-center justify-center border">
            <a-typography-text class="text-white">
              {{ trlang.maximum_winning_amount_per_round_per_hole }}
            </a-typography-text>
          </a-layout-content>
          <a-layout-sider class="bg-gray p-2 d-flex items-center justify-center border">
            <a-typography-text class="text-white">
              {{ trlang.exposure }}
            </a-typography-text>
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.odev }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.unov }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.oeuo }}
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -3)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -4)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
        <a-layout>
          <a-layout-sider
            class="bg-gray p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-typography-text class="text-white">
              {{ trlang.match }} (1 -6)
            </a-typography-text>
          </a-layout-sider>
          <a-layout-content
            class="bg-white border p-2 d-flex items-center justify-end gap-2"
          >
            <a-input v-model:value="value" class="input-md" />
            <a-typography-text>{{ trlang.usd }}</a-typography-text>
          </a-layout-content>
          <a-layout-sider
            class="bg-white p-2 d-flex items-center justify-center border setting-sider"
          >
            <a-checkbox v-model:checked="checked" />
          </a-layout-sider>
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
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
