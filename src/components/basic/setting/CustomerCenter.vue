<template>
  <a-collapse-panel class="bg-white">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.customer_center_setting }}
      </a-typography-text>
    </template>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.prevent_further_inquiries_when_there_is_no_response }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column">
        <a-layout class="bg-white flex flex-row gap-2 items-center">
          <a-switch v-model:checked="customerCenter" class="w-fit" />
          <a-typography-text>
            {{ customerCenter ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout>

        <a-typography-text class="text-dark-brown mt-2">
          {{
            trlang.if_you_use_the_Prevent_Additional_Inquiries_feature_and_dont_respond_to_existing_inquiries_members_will_be_prevented_from_posting_additional_messages_to_the_customer_center
          }}
        </a-typography-text>
        <a-typography-text class="text-dark-brown">
          {{ trlang.please_keep_your_pending_inquiries_under_constant_review }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from 'vue';

const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const customerCenter = ref(true);

const loadData = (data) => {
  customerCenter.value = data.customer_center ?? true;
};

watch(() => props.dataSource, loadData, { immediate: true });

defineExpose({
  getState: () => ({
    customerCenter: customerCenter.value,
  }),
});
</script>
