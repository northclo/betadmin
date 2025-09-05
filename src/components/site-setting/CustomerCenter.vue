<template>
  <a-collapse-panel class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.customer_center_setting }}
      </a-typography-text>
    </template>

    <!-- Prevent Further Inquiries -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.prevent_further_inquiries_when_there_is_no_response }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex flex-column">
        <a-layout class="bg-white d-flex flex-row gap-2 items-center">
          <a-switch v-model:checked="check" class="w-fit" />
          <a-typography-text>
            {{ check ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout>

        <!-- Helper Notes -->
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
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const check = ref(true);

// Load data from parent
const loadData = (data) => {
  if (!data) return;
  check.value = data.customerCenter ?? true;
};

// Watch for changes in parent dataSource
watch(() => props.dataSource, loadData, { immediate: true });

// Expose state to parent
defineExpose({
  getState: () => ({
    check: check.value,
  }),
});
</script>
