<template>
  <a-layout class="bg-white mt-2">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.customer_center_setting }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.prevent_further_inquiries_when_there_is_no_response }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex flex-column">
        <a-layout class="bg-white d-flex flex-row gap-2">
          <a-switch v-model:checked="check" class="w-fit" />
          <a-typography-text class="d-flex item-center">
            {{ check ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout>
        <a-typography-text class="text-yellow mt-2">
          {{
            trlang.if_you_use_the_Prevent_Additional_Inquiries_feature_and_dont_respond_to_existing_inquiries_members_will_be_prevented_from_posting_additional_messages_to_the_customer_center
          }}
        </a-typography-text>
        <a-typography-text class="text-yellow">
          {{ trlang.please_keep_your_pending_inquiries_under_constant_review }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";

export default {
  name: "CustomerCenterSetting",
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

    const loadData = (data) => {
      if (data && data.customerCenter) {
        check.value = data.customerCenter.preventAdditional ?? true;
      }
    };

    // Watch for changes in parent dataSource
    watch(
      () => props.dataSource,
      (newVal) => loadData(newVal),
      { immediate: true }
    );

    // Expose method to parent to get current state
    expose({
      getState: () => ({
        preventAdditional: check.value,
      }),
    });

    return {
      trlang,
      check,
    };
  },
};
</script>
