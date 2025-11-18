<template>
  <a-modal
    :open="open"
    :title="trlang.cash_increase_decrease"
    :ok-text="trlang.process"
    :cancel-text="trlang.cancel"
    @ok="process"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="bg-white mt-5">
      <a-typography-text class="text-dark-gray fs-3">
        {{ trlang.cash_increase_decrease }}
      </a-typography-text>

      <a-layout class="bg-white mt-2">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white">
            {{ trlang.target_member_id }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-typography-text>{{ dataSource.nickname }}</a-typography-text>
          <a-typography-text> ({{ dataSource.id }}) </a-typography-text>
          <a-typography-text class="bg-gray text-white px-2">
            {{ dataSource.role }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.target_member_holding_money
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-typography-text>{{ dataSource.holdingMoney }}</a-typography-text>
          <a-typography-text>{{ dataSource.betMoneyUnit }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.input_amount
          }}</a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-radio-group v-model:value="amountRange" :options="amountRangeOption" />
          <a-input v-model:value="amount" class="input-md" />
          <a-typography-text>{{ dataSource.betMoneyUnit }}</a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { message } from "ant-design-vue";
import { computed, defineProps, inject, ref } from "vue";
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
const amountRangeOption = ref(["+", "-"]);
const amount = ref(null);

const process = async () => {
  if (!amount.value || isNaN(Number(amount.value)) || Number(amount.value) === 0) {
    return message.error(trlang.value.input_amount);
  }

  const increaseAmount =
    amountRange.value === "+" ? Number(amount.value) : -Number(amount.value);

  const result = await postData(apiLink.cash_increase, {
    role: props.dataSource.role,
    id: props.dataSource.id,
    amount: increaseAmount,
    currency: props.dataSource.betMoneyUnit,
  });

  if (result.status) {
    if (amountRange.value == "+") message.success(trlang.value.cash_increased_successful);
    if (amountRange.value == "-") message.success(trlang.value.cash_decreased_successful);
    props.fetchData();
    emit("update:open", false);
  }
};
</script>
