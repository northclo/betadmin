<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-gray font-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.game_settings_powerball_game }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.activate }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex gap-2">
        <a-switch v-model:checked="activate" class="w-fit" />
        <a-typography-text class="flex item-center">
          {{ activate ? trlang.activate : trlang.disable }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_inactive }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="2" v-model:value="inactiveMessage" allow-clear />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.prevent_duplicate_betting }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-layout class="flex flex-row gap-2 bg-white">
          <a-switch v-model:checked="duplicateCheck" class="w-fit" />
          <a-typography-text class="flex item-center">
            {{ duplicateCheck ? trlang.activate : trlang.disable }}
          </a-typography-text>
        </a-layout>
        <a-layout class="bg-white flex flex-row items-center gap-2">
          <a-typography-text class="text-yellow">
            {{ trlang.when_same_round_same_pick_same_amount }}
          </a-typography-text>
          <a-input v-model:value="duplicate" style="width: 80px" class="text-center" />
          <a-typography-text class="text-yellow">
            {{ trlang.no_duplicate_betting_within_the_first_second }}
          </a-typography-text>
        </a-layout>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white mt-2">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.division }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex">
        <a-typography-text
          class="w-50 bg-gray text-white flex justify-center items-center border"
        >
          A
        </a-typography-text>
        <a-typography-text
          class="w-50 bg-gray text-white flex justify-center items-center border"
        >
          B
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout v-for="item in options" :key="item.key" class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ item.name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="flex">
        <a-layout
          class="w-50 flex flex-row justify-center items-center border p-2 gap-2"
        >
          <a-input v-model:value="item.valueA" class="text-end" style="width: 80px" />%
        </a-layout>
        <a-layout
          class="w-50 flex flex-row justify-center items-center border p-2 gap-2"
        >
          <a-input v-model:value="item.valueB" class="text-end" style="width: 80px" />%
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { getData, postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";

export default {
  name: "AdminAccountPassword",
  components: { RightCircleFilled },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const activate = ref(true);
    const inactiveMessage = ref("");
    const duplicateCheck = ref(true);
    const duplicate = ref(0);
    const options = ref([]);

    const fetchData = async () => {
      const res = await getData(`${apiLink.game_setting}?name=PowerballGame`);
      console.log("res :>> ", res);

      activate.value = res.data.activate;
      inactiveMessage.value = res.data.inactiveMessage;
      duplicateCheck.value = res.data.duplicateBetting;
      duplicate.value = res.data.duplicateBettingLimit;

      options.value = [
        {
          name: trlang.value.odd,
          valueA: res.data["odd"][0],
          valueB: res.data["odd"][1],
        },
        {
          name: trlang.value.even,
          valueA: res.data["even"][0],
          valueB: res.data["even"][1],
        },
        {
          name: trlang.value.under,
          valueA: res.data["under"][0],
          valueB: res.data["under"][1],
        },
        {
          name: trlang.value.over,
          valueA: res.data["over"][0],
          valueB: res.data["over"][1],
        },
        {
          name: trlang.value.odd_under,
          valueA: res.data["oddUnder"][0],
          valueB: res.data["oddUnder"][1],
        },
        {
          name: trlang.value.odd_over,
          valueA: res.data["oddOver"][0],
          valueB: res.data["oddOver"][1],
        },
        {
          name: trlang.value.even_under,
          valueA: res.data["evenUnder"][0],
          valueB: res.data["evenUnder"][1],
        },
        {
          name: trlang.value.even_over,
          valueA: res.data["evenOver"][0],
          valueB: res.data["evenOver"][1],
        },
        {
          name: trlang.value.match_number + " (1 - 3)",
          valueA: res.data["matchNumber1"][0],
          valueB: res.data["matchNumber1"][1],
        },
        {
          name: trlang.value.match_number + " (1 - 4)",
          valueA: res.data["matchNumber2"][0],
          valueB: res.data["matchNumber2"][1],
        },
        {
          name: trlang.value.match_number + " (1 - 6)",
          valueA: res.data["matchNumber3"][0],
          valueB: res.data["matchNumber3"][1],
        },
      ];

      return res;
    };

    const saveData = async () => {
      const payload = {
        activate: activate.value,
        inactiveMessage: inactiveMessage.value,
        duplicateBetting: duplicateCheck.value,
        duplicateBettingLimit: duplicate.value,
        odd: [options.value[0].valueA, options.value[0].valueB],
        even: [options.value[1].valueA, options.value[1].valueB],
        under: [options.value[2].valueA, options.value[2].valueB],
        over: [options.value[3].valueA, options.value[3].valueB],
        oddUnder: [options.value[4].valueA, options.value[4].valueB],
        oddOver: [options.value[5].valueA, options.value[5].valueB],
        evenUnder: [options.value[6].valueA, options.value[6].valueB],
        evenOver: [options.value[7].valueA, options.value[7].valueB],
        matchNumber1: [options.value[8].valueA, options.value[8].valueB],
        matchNumber2: [options.value[9].valueA, options.value[9].valueB],
        matchNumber3: [options.value[10].valueA, options.value[10].valueB],
      };

      const res = await postData(`${apiLink.game_setting}?name=PowerballGame`, payload);

      if (res.status) {
        message.success(trlang.value.saved_successful);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      options,
      activate,
      inactiveMessage,
      duplicateCheck,
      duplicate,
      saveData,
    };
  },
};
</script>
