<template>
  <a-layout class="money-log-view">
    <header class="money-log-header">
      <a-typography-title :level="3">
        {{ trlang.money_usage_log }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.money_log_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.transaction_range">
              <a-range-picker v-model:value="filters.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.transaction_type">
              <a-select v-model:value="filters.type" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="charge">{{ trlang.charge }}</a-select-option>
                <a-select-option value="exchange">{{ trlang.exchange }}</a-select-option>
                <a-select-option value="bet">{{ trlang.betting }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.member">
              <a-input v-model:value="filters.member" :placeholder="trlang.member_placeholder" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="actions">
          <a-button type="primary" class="bg-main text-white" @click="fetchData">
            {{ trlang.search }}
          </a-button>
          <a-button @click="resetFilters">{{ trlang.reset }}</a-button>
        </div>
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
        :pagination="{ pageSize: 10 }"
        row-key="id"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'amount' || column.dataIndex === 'balance_after'">
            {{ formatCurrency(text) }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag>{{ trlang[text] || text }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "MoneyUsageLogView" });

import { computed, inject, ref } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  type: "all",
  member: "",
});

const summaryCards = computed(() => [
  {
    key: "total_transactions",
    title: trlang.value.total_transactions ?? "Total Transactions",
    value: "245",
  },
  {
    key: "total_inflow",
    title: trlang.value.total_inflow ?? "Total Inflow",
    value: formatCurrency(420000),
  },
  {
    key: "total_outflow",
    title: trlang.value.total_outflow ?? "Total Outflow",
    value: formatCurrency(315000),
  },
  {
    key: "net_change",
    title: trlang.value.net_change ?? "Net Change",
    value: formatCurrency(105000),
  },
]);

const columns = computed(() => [
  { title: trlang.value.transaction_id ?? "Transaction ID", dataIndex: "id", key: "id", width: 160 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.transaction_type ?? "Type", dataIndex: "type", key: "type", width: 140 },
  { title: trlang.value.amount ?? "Amount", dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.balance_after ?? "Balance After", dataIndex: "balance_after", key: "balance_after", width: 160 },
  { title: trlang.value.description ?? "Description", dataIndex: "description", key: "description" },
  { title: trlang.value.processed_at ?? "Processed At", dataIndex: "processed_at", key: "processed_at", width: 200 },
]);

const tableData = ref([
  {
    id: "TX-88412",
    member: "user_023",
    type: "charge",
    amount: 45000,
    balance_after: 178000,
    description: "Charge approved by admin01",
    processed_at: "2024-04-20 11:42",
  },
  {
    id: "TX-88411",
    member: "user_532",
    type: "bet",
    amount: -12000,
    balance_after: 98500,
    description: "Bet settled (Round #2024-04-110)",
    processed_at: "2024-04-20 11:29",
  },
  {
    id: "TX-88410",
    member: "user_203",
    type: "exchange",
    amount: -40000,
    balance_after: 62100,
    description: "Exchange processed by admin03",
    processed_at: "2024-04-20 10:58",
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
    type: "all",
    member: "",
  };
};
</script>

<style scoped>
.money-log-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.money-log-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters-card {
  background: var(--surface-color);
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
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

