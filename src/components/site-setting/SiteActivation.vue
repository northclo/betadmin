<template>
  <a-layout class="bg-white mt-2">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.site_activation_setting }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.site_activation }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex gap-2">
        <a-switch v-model:checked="check" class="w-fit" />
        <a-typography-text class="d-flex item-center">
          {{ check ? trlang.active : trlang.deactive }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.how_to_display_when_site_is_disabled }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-button
          v-for="item in display"
          :key="item.key"
          :class="item.key === displayKey ? 'bg-main text-white' : ''"
          @click="updateActivationDisplay(item.key)"
        >
          <CheckOutlined v-if="item.key === displayKey" />
          {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_site_is_deactivated }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="message" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onBeforeMount, onMounted, ref } from "vue";
import { RightCircleFilled, CheckOutlined } from "@ant-design/icons-vue";

export default {
  name: "SiteActivationSetting",
  components: { RightCircleFilled, CheckOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const check = ref(true);
    const display = ref([]);
    const displayKey = ref(0);
    const message = ref("It is Maintained between 6am ~ 9am");

    const getComponentData = () => {
      const _display = [
        trlang.value.simple_text,
        trlang.value.login_box,
        trlang.value.page_not_found_404,
      ];
      display.value = _display.map((element, idx) => ({
        key: idx,
        text: element,
      }));
    };

    const fetchData = async () => {
      displayKey.value = 0;
    };

    const updateActivationDisplay = (key) => {
      displayKey.value = key;
    };

    onMounted(() => {
      fetchData();
    });

    onBeforeMount(() => {
      getComponentData();
    });

    return {
      trlang,
      check,
      display,
      displayKey,
      message,
      updateActivationDisplay,
    };
  },
};
</script>
