<template>
  <a-layout-sider :trigger="null" collapsible class="h-100vh overflow-y-auto left-sider">
    <div style="width: 100%; height: 100px"></div>
    <a-layout class="bg-none">
      <a-typography-text class="text-green text-center fs-4">
        {{ trlang.betting_settlement_profit_new }}
      </a-typography-text>
    </a-layout>
    <a-layout class="flex flex-row justify-between bg-none mt-2">
      <a-typography-text class="bg-none text-white">
        {{ trlang.user_held_money }}
      </a-typography-text>
      <a-typography-text class="bg-none text-white">479,450</a-typography-text>
    </a-layout>
    <a-layout class="flex flex-row justify-between bg-none">
      <a-typography-text class="bg-none text-white">
        {{ trlang.user_points }}
      </a-typography-text>
      <a-typography-text class="bg-none text-white">14,000</a-typography-text>
    </a-layout>
    <a-layout class="flex flex-row justify-between mt-5 bg-none">
      <a-typography-text class="bg-none text-white">
        {{ trlang.current_site_users }}
      </a-typography-text>
      <a-typography-text class="bg-none text-white">14,000</a-typography-text>
    </a-layout>
    <a-layout class="mt-5 p-2">
      <a-layout class="flex flex-row justify-end">
        <a-select ref="select" v-model:value="activeOption" style="width: 70%">
          <a-select-option v-for="item in options" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-layout>
      <a-layout class="flex flex-row justify-between mt-2">
        <a-typography-text class="text-main font-bold">
          {{ trlang.deposit }}
        </a-typography-text>
        <a-typography-text>0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between mb-2">
        <a-typography-text class="text-green font-bold">
          {{ trlang.withdrawal }}
        </a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row items-center gap-2 text-dark-gray">
        <a-typography-text class="text-dark-gray font-bold">
          -{{ trlang.the_entire_game }}
        </a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.batting_gan }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.betting }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.hit }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.betting_p }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.revenue }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row items-center gap-2 text-dark-gray mt-2">
        <a-typography-text class="text-dark-gray font-bold">
          -{{ trlang.minigames }}
        </a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.batting_gan }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.hit }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.betting_p }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.revenue }}</a-typography-text>
        <a-typography-text class="">0</a-typography-text>
      </a-layout>
    </a-layout>
    <a-layout class="mt-5 p-2">
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.total }}</a-typography-text>
        <a-typography-text class="">479,450</a-typography-text>
      </a-layout>
      <a-layout class="flex flex-row justify-between">
        <a-typography-text class="">{{ trlang.test_copy }}</a-typography-text>
        <a-typography-text class="">479,450</a-typography-text>
      </a-layout>
    </a-layout>
  </a-layout-sider>
</template>

<script>
import { ref, inject, computed, onMounted } from "vue";

export default {
  name: "LeftLayout",
  setup() {
    // Inject the provided state
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const options = ref([]);
    const activeOption = ref(trlang.value.entire);

    onMounted(() => {
      options.value = [trlang.value.entire, trlang.value.minigames];
    });

    return {
      trlang,
      options,
      activeOption,
    };
  },
};
</script>
