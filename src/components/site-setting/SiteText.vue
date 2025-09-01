<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.set_site_text }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.site_name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="siteName" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.title_bar_display_text }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="titlebarText" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.bottom_copywriter_text }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="bottomCopyText" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_at_the_top_of_the_site }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="topMessage" allow-clear />
        <a-typography-text class="text-yellow">
          * {{ trlang.seperated_by_enter }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_account_information }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="depositInfo" allow-clear />
      </a-layout-content>
    </a-layout>
    <a-typography-text class="text-yellow">
      * {{ trlang.the_applicability_of_this_item_may_vary_depending_on_the_design }}
    </a-typography-text>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";

export default {
  name: "SiteTextSetting",
  components: { RightCircleFilled },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const siteName = ref("");
    const titlebarText = ref("");
    const bottomCopyText = ref("");
    const topMessage = ref("");
    const depositInfo = ref("");

    const fetchData = async () => {
      siteName.value = "Running Ball";
      titlebarText.value = "Running";
      bottomCopyText.value = "@copywriter";
      topMessage.value = "Hello";
      depositInfo.value = "Deposit";
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      siteName,
      titlebarText,
      bottomCopyText,
      topMessage,
      depositInfo,
    };
  },
};
</script>
