<template>
  <a-layout class="charge-view">
    <header class="charge-header">
      <a-typography-title :level="3">
        {{ trlang.charging_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.charging_management_description }}
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
defineOptions({ name: "ChargingManagementView" });

import { computed, inject, ref } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  status: "all",
});

const summaryCards = computed(() => [
  {
    key: "total_requests",
    title: trlang.value.total_requests ?? "Total Requests",
    value: "125",
  },
  {
    key: "pending_requests",
    title: trlang.value.pending_requests ?? "Pending",
    value: "14",
  },
  {
    key: "completed_amount",
    title: trlang.value.completed_amount ?? "Completed Amount",
    value: formatCurrency(890000),
  },
  {
    key: "average_processing",
    title: trlang.value.average_processing_time ?? "Avg. Processing",
    value: "18m",
  },
]);

const columns = computed(() => [
  { title: trlang.value.request_id ?? "Request ID", dataIndex: "id", key: "id", width: 140 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.amount ?? "Amount", dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.submitted_at ?? "Submitted At", dataIndex: "submitted_at", key: "submitted_at", width: 200 },
  { title: trlang.value.processed_by ?? "Processed By", dataIndex: "processed_by", key: "processed_by", width: 160 },
]);

const tableData = ref([
  {
    id: "REQ-1048",
    member: "user_203",
    amount: 120000,
    status: "completed",
    submitted_at: "2024-04-22 09:14",
    processed_by: "admin01",
  },
  {
    id: "REQ-1047",
    member: "user_147",
    amount: 45000,
    status: "pending",
    submitted_at: "2024-04-22 08:32",
    processed_by: "-",
  },
  {
    id: "REQ-1046",
    member: "user_118",
    amount: 95000,
    status: "cancelled",
    submitted_at: "2024-04-22 07:58",
    processed_by: "admin03",
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
  };
};
</script>

<style scoped>
.charge-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.charge-header {
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

