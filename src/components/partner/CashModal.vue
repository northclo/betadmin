<template>
  <a-modal
    :open="open"
    :title="trlang.cash_increase_decrease"
    :ok-text="trlang.process"
    :cancel-text="trlang.cancel"
    @ok="register"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="bg-white mt-5">
      <!-- Header -->
      <a-typography-text class="text-dark-gray fs-3">
        {{ trlang.cash_increase_decrease }}
      </a-typography-text>

      <a-layout class="bg-white mt-2">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white">{{
            trlang.target_member_id
          }}</a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-typography-text>
            {{ isActive ? trlang.possible : trlang.no_possible }}
          </a-typography-text>
          <a-typography-text>
            ({{ isActive ? trlang.possible : trlang.no_possible }})
          </a-typography-text>
          <a-typography-text>
            {{ isActive ? trlang.possible : trlang.no_possible }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.target_member_holding_money
          }}</a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-typography-text>
            {{ isActive ? trlang.possible : trlang.no_possible }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <!-- Sidebar -->
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">{{
            trlang.input_amount
          }}</a-typography-text>
        </a-layout-sider>

        <!-- Main content -->
        <a-layout-content class="border p-2 flex items-center justify-end gap-2">
          <a-radio-group v-model:value="amountRange" :options="amountRangeOption" />
          <a-input v-model:value="value" class="input-md" />
          <a-typography-text class="flex items-center">
            {{ isActive ? trlang.possible : trlang.no_possible }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref } from "vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  open: Boolean,
});

const amountRange = ref("+");
const amountRangeOption = ref(["+", "-"]);

const register = () => {
  console.log("Register user logic here");
};
</script>
