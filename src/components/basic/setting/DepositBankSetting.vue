<template>
  <a-collapse-panel key="8">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold leading-0 fs-4">
        {{ trlang.deposit_bank_setting }}
      </a-typography-text>
    </template>

    <a-layout>
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_bank_list }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <div class="flex flex-column gap-2">
          <div
            v-for="(bank, index) in depositBanks"
            :key="index"
            class="flex flex-row gap-2 items-center"
          >
            <a-input
              v-model:value="depositBanks[index]"
              class="flex-1"
              :placeholder="trlang.bank_name"
            />
            <a-button
              type="primary"
              danger
              class="remove-bank-btn"
              @click="removeBank(index)"
              :disabled="depositBanks.length <= 1"
            >
              <DeleteOutlined />
            </a-button>
          </div>
          <a-button
            type="dashed"
            class="w-full"
            @click="addBank"
          >
            <PlusOutlined />
            {{ trlang.add_bank }}
          </a-button>
        </div>
        <p class="text-dark-brown text-helper mt-2">
          * {{ trlang.deposit_bank_list_helper }}
        </p>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from 'vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const depositBanks = ref(['']);

const loadData = (data) => {
  if (data.deposit_banks && Array.isArray(data.deposit_banks) && data.deposit_banks.length > 0) {
    depositBanks.value = [...data.deposit_banks];
  } else {
    depositBanks.value = [''];
  }
};

watch(() => props.dataSource, loadData, { immediate: true });

const addBank = () => {
  depositBanks.value.push('');
};

const removeBank = (index) => {
  if (depositBanks.value.length > 1) {
    depositBanks.value.splice(index, 1);
  }
};

defineExpose({
  getState: () => ({
    depositBanks: depositBanks.value.filter(bank => bank && bank.trim() !== ''),
  }),
});
</script>

