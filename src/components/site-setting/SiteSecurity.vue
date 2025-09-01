<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.site_security_setting }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.use_security_code_when_loggin_in }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-switch v-model:checked="check" class="w-fit" />
        <a-typography-text class="d-flex item-center">
          {{ check ? trlang.active : trlang.deactive }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";

export default {
  name: "SiteSecuritySetting",
  components: { RightCircleFilled },
  props: {
    dataSource: {
      type: Object,
      required: true,
    },
  },
  setup(props, { expose }) {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const check = ref(true);

    // ✅ Watch for dataSource changes
    watch(
      () => props.dataSource,
      (newVal) => {
        if (newVal) {
          check.value = newVal.siteSecurity;
        }
      },
      { immediate: true }
    );

    expose({
      getState: () => ({
        check: check.value,
      }),
    });

    return { trlang, check };
  },
};
</script>
