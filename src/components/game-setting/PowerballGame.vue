<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
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
      <a-layout-content class="border p-2 d-flex gap-2">
        <a-switch v-model:checked="activate" class="w-fit" />
        <a-typography-text class="d-flex item-center">
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
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-switch v-model:checked="duplicateCheck" class="w-fit" />
          <a-typography-text class="d-flex item-center">
            {{ duplicateCheck ? trlang.activate : trlang.disable }}
          </a-typography-text>
        </a-layout>
        <a-layout class="bg-white d-flex flex-row items-center gap-2">
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
      <a-layout-content class="d-flex">
        <a-typography-text
          class="w-50 bg-gray text-white d-flex justify-center items-center border"
        >
          A
        </a-typography-text>
        <a-typography-text
          class="w-50 bg-gray text-white d-flex justify-center items-center border"
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
      <a-layout-content class="d-flex">
        <a-layout
          class="w-50 d-flex flex-row justify-center items-center border p-2 gap-2"
        >
          <a-input v-model:value="item.valueA" class="text-end" style="width: 80px" />%
        </a-layout>
        <a-layout
          class="w-50 d-flex flex-row justify-center items-center border p-2 gap-2"
        >
          <a-input v-model:value="item.valueB" class="text-end" style="width: 80px" />%
        </a-layout>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onBeforeMount, onMounted, ref } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";

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
    const adminId = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const options = ref([]);

    const fetchData = async () => {
      adminId.value = "Running Ball";
      password.value = "Running";
      confirmPassword.value = "@copywriter";
    };

    onMounted(() => {
      fetchData();
    });

    onBeforeMount(() => {
      options.value = [
        {
          name: trlang.value.odd,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.even,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.under,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.over,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.odd_under,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.odd_over,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.even_under,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.even_over,
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.match_number + " (1 - 3)",
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.match_number + " (1 - 4)",
          valueA: 19,
          valueB: 21,
        },
        {
          name: trlang.value.match_number + " (1 - 6)",
          valueA: 19,
          valueB: 21,
        },
      ];

      inactiveMessage.value = "The Game paused time is between 20.00 ~ 24.00";
    });

    return {
      trlang,
      adminId,
      password,
      confirmPassword,
      options,
      activate,
      inactiveMessage,
      duplicateCheck,
      duplicate,
    };
  },
};
</script>
