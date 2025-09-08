<template>
  <a-collapse-panel key="2" class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 lh-0">
        {{ trlang.bank_card_setting }}
      </a-typography-text>
    </template>

    <!-- Table Header -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.name }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.operation }}
        </a-typography-text>
      </a-layout-sider>
    </a-layout>

    <!-- Bank card rows -->
    <a-layout v-for="item in bankCards" :key="item.key" class="bg-white">
      <a-layout-sider class="bg-white border p-2 setting-sider">
        <a-input v-model:value="item.name" />
      </a-layout-sider>
      <a-layout-sider class="bg-white border p-2 setting-sider">
        <a-typography-text
          class="text-red text-center cursor-pointer"
          @click="deleteBank(item.key)"
        >
          {{ trlang.delete }}
        </a-typography-text>
      </a-layout-sider>
    </a-layout>

    <!-- Add button -->
    <a-button class="bg-main text-white mt-5" @click="addBank">
      {{ trlang.add }}
    </a-button>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose } from "vue";

/* Props */
const props = defineProps({
  dataSource: {
    type: Object,
    required: true,
  },
});

/* Inject translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* State */
const bankCards = ref([]);

/* Load from props */
watch(
  () => props.dataSource?.bankCards,
  (newVal) => {
    bankCards.value = Array.isArray(newVal)
      ? newVal.map((item, idx) => ({ key: idx + 1, name: item.name }))
      : [];
  },
  { immediate: true }
);

/* Methods */
const addBank = () => {
  if (!bankCards.value.length || bankCards.value.at(-1).name.trim() !== "") {
    bankCards.value.push({ key: Date.now(), name: "" });
  }
};

const deleteBank = (deleteKey) => {
  bankCards.value = bankCards.value.filter((item) => item.key !== deleteKey);
};

/* Expose for parent */
defineExpose({
  getState: () => ({
    bankCards: bankCards.value,
  }),
});
</script>
