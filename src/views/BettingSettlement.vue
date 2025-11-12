<template>
  <a-layout class="settlement-view">
    <header class="settlement-header">
      <a-typography-title :level="3">
        {{ trlang.betting_settlement_profit_new }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.betting_settlement_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.settlement_range">
              <a-range-picker
                v-model:value="filters.range"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.partner_filter">
              <a-select v-model:value="filters.partner" allow-clear>
                <a-select-option value="all">
                  {{ trlang.all }}
                </a-select-option>
                <a-select-option v-for="partner in partnerOptions" :key="partner.value" :value="partner.value">
                  {{ partner.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8" class="actions">
            <a-button type="primary" class="bg-main text-white" @click="fetchData">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">
              {{ trlang.reset }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12" :lg="6" v-for="card in summaryCards" :key="card.key">
        <a-card class="summary-card">
          <template #title>{{ card.title }}</template>
          <a-typography-title :level="2" class="summary-value">
            {{ card.value }}
          </a-typography-title>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="table-card">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'bet_amount' || column.dataIndex === 'payout' || column.dataIndex === 'profit'">
            {{ formatCurrency(text) }}
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "BettingSettlementView" });

import { ref, computed, inject } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  partner: "all",
});

const partnerOptions = [
  { value: "partner-a", label: "Partner A" },
  { value: "partner-b", label: "Partner B" },
  { value: "partner-c", label: "Partner C" },
];

const summaryCards = computed(() => [
  {
    key: "total_bet",
    title: trlang.value.total_bet_amount ?? "Total Bet",
    value: formatCurrency(1850000),
  },
  {
    key: "total_payout",
    title: trlang.value.total_payout ?? "Total Payout",
    value: formatCurrency(1325000),
  },
  {
    key: "total_profit",
    title: trlang.value.total_profit ?? "Profit",
    value: formatCurrency(525000),
  },
  {
    key: "settled_rounds",
    title: trlang.value.settled_rounds ?? "Settled Rounds",
    value: "128",
  },
]);

const columns = computed(() => [
  { title: trlang.value.round_no ?? "Round", dataIndex: "round", key: "round", width: 120 },
  { title: trlang.value.partner_filter ?? "Partner", dataIndex: "partner", key: "partner", width: 160 },
  { title: trlang.value.bet_amount ?? "Bet Amount", dataIndex: "bet_amount", key: "bet_amount", width: 160 },
  { title: trlang.value.payout ?? "Payout", dataIndex: "payout", key: "payout", width: 160 },
  { title: trlang.value.profit ?? "Profit", dataIndex: "profit", key: "profit", width: 160 },
  { title: trlang.value.settled_at ?? "Settled At", dataIndex: "settled_at", key: "settled_at", width: 180 },
]);

const tableData = ref([
  {
    id: 1,
    round: "#2024-04-112",
    partner: "Partner A",
    bet_amount: 25000,
    payout: 18000,
    profit: 7000,
    settled_at: "2024-04-22 10:22",
  },
  {
    id: 2,
    round: "#2024-04-111",
    partner: "Partner B",
    bet_amount: 18000,
    payout: 12000,
    profit: 6000,
    settled_at: "2024-04-22 09:48",
  },
  {
    id: 3,
    round: "#2024-04-110",
    partner: "Partner C",
    bet_amount: 32000,
    payout: 29500,
    profit: 2500,
    settled_at: "2024-04-22 09:14",
  },
]);

const formatCurrency = (value) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const fetchData = async () => {
  loading.value = true;
  setTimeout(() => (loading.value = false), 600);
};

const resetFilters = () => {
  filters.value = {
    range: [dayjs().subtract(7, "day"), dayjs()],
    partner: "all",
  };
};
</script>

<style scoped>
.settlement-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settlement-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters-card {
  background: var(--surface-color);
}

.actions {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.summary-card {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary-value {
  margin-bottom: 0;
}

.table-card {
  background: var(--surface-color);
}
</style>

