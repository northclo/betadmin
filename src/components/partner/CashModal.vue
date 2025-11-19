<template>
  <a-modal
    :open="open"
    :title="trlang.cash_increase_decrease"
    :ok-text="trlang.process"
    :cancel-text="trlang.cancel"
    @ok="process"
    @cancel="handleCancel"
    :confirm-loading="loading"
  >
    <a-layout class="mt-5">
      <a-layout class="mt-2 border-b border-t">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white">
            {{ trlang.target_member_id }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center justify-end gap-2">
          <a-typography-text>{{ dataSource.nickname }}</a-typography-text>
          <a-typography-text> ({{ dataSource.id }}) </a-typography-text>
          <a-typography-text class="text-white px-2">
            {{ dataSource.role }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.target_member_holding_money
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center justify-end gap-2">
          <a-typography-text>{{ dataSource.holdingMoney }}</a-typography-text>
          <a-typography-text>USD</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b">
        <a-layout-sider class="border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.input_amount
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2 flex items-center justify-end gap-2">
          <a-radio-group v-model:value="amountRange" :options="amountRangeOption" />
          <a-input-number v-model:value="amount" class="input-md" :min="0" :precision="2" />
          <a-typography-text>USD</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { message } from "ant-design-vue";
import { computed, defineProps, inject, ref, watch } from "vue";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
  fetchData: Function,
});

const emit = defineEmits(["update:open"]);

const amountRange = ref("+");
const amountRangeOption = computed(() => [
  { label: trlang.value.increase, value: "+" },
  { label: trlang.value.decrease, value: "-" }
]);
const amount = ref(null);
const loading = ref(false);

const resetForm = () => {
  amountRange.value = "+";
  amount.value = null;
};

const handleCancel = () => {
  emit("update:open", false);
};

watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const process = async () => {
  if (amount.value === null || amount.value === undefined) {
    message.error(trlang.value.input_amount);
    return;
  }

  const numAmount = Number(amount.value);
  
  if (isNaN(numAmount) || !isFinite(numAmount) || numAmount <= 0) {
    message.error(trlang.value.invalid_amount || trlang.value.input_amount);
    return;
  }

  const increaseAmount =
    amountRange.value === "+" ? numAmount : -numAmount;

  try {
    loading.value = true;
    const result = await postData(apiLink.cash_increase, {
      id: props.dataSource.id,
      amount: increaseAmount,
      role: props.dataSource.role,
    });

    if (result.status) {
      if (amountRange.value === "+") {
        message.success(trlang.value.cash_increased_successful);
      } else {
        message.success(trlang.value.cash_decreased_successful);
      }
      resetForm();
      emit("update:open", false);
      if (props.fetchData) {
        props.fetchData();
      }
    } else {
      message.error(result.message || trlang.value.operation_failed || trlang.value.registration_failed);
    }
  } catch (error) {
    console.error("Error processing cash change:", error);
    message.error(error.message || trlang.value.operation_failed || trlang.value.registration_failed);
  } finally {
    loading.value = false;
  }
};
</script>
