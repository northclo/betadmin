<template>
  <a-layout class="exchange-view">
    <header class="exchange-header">
      <a-typography-title :level="3">
        {{ trlang.currency_exchange_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.exchange_management_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.request_range">
              <a-range-picker v-model:value="filters.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.request_status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="pending">{{ trlang.pending }}</a-select-option>
                <a-select-option value="completed">{{ trlang.completed }}</a-select-option>
                <a-select-option value="cancelled">{{ trlang.cancelled }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.currency_type">
              <a-select v-model:value="filters.currency" allow-clear>
                <a-select-option value="krw">KRW</a-select-option>
                <a-select-option value="usd">USD</a-select-option>
                <a-select-option value="jp">JPY</a-select-option>
              </a-select>
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
          <template v-if="column.dataIndex === 'amount'">
            {{ formatCurrency(text) }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(text)">{{ trlang[text] || text }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "ExchangeManagementView" });

import { computed, inject, ref } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  status: "all",
  currency: "krw",
});

const summaryCards = computed(() => [
  {
    key: "total_requests",
    title: trlang.value.exchange_total_requests ?? "Total Requests",
    value: "92",
  },
  {
    key: "pending_requests",
    title: trlang.value.pending_requests ?? "Pending Requests",
    value: "11",
  },
  {
    key: "completed_amount",
    title: trlang.value.completed_amount ?? "Completed Amount",
    value: formatCurrency(670000),
  },
  {
    key: "average_rate",
    title: trlang.value.average_exchange_rate ?? "Avg. Rate",
    value: "1,325 ₩/$",
  },
]);

const columns = computed(() => [
  { title: trlang.value.request_id ?? "Request ID", dataIndex: "id", key: "id", width: 140 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.currency_type ?? "Currency", dataIndex: "currency", key: "currency", width: 120 },
  { title: trlang.value.amount ?? "Amount", dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.submitted_at ?? "Submitted At", dataIndex: "submitted_at", key: "submitted_at", width: 200 },
  { title: trlang.value.processed_by ?? "Processed By", dataIndex: "processed_by", key: "processed_by", width: 160 },
]);

const tableData = ref([
  {
    id: "EX-3021",
    member: "user_092",
    currency: "USD → KRW",
    amount: 180000,
    status: "completed",
    submitted_at: "2024-04-21 16:24",
    processed_by: "admin02",
  },
  {
    id: "EX-3020",
    member: "user_781",
    currency: "KRW → USD",
    amount: 58000,
    status: "pending",
    submitted_at: "2024-04-21 15:42",
    processed_by: "-",
  },
  {
    id: "EX-3019",
    member: "user_118",
    currency: "USD → KRW",
    amount: 124000,
    status: "completed",
    submitted_at: "2024-04-21 14:33",
    processed_by: "admin01",
  },
]);

const statusColor = (status) => {
  switch (status) {
    case "completed":
      return "green";
    case "pending":
      return "gold";
    case "cancelled":
      return "red";
    default:
      return "blue";
  }
};

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
    status: "all",
    currency: "krw",
  };
};
</script>

<style scoped>
.exchange-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.exchange-header {
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

