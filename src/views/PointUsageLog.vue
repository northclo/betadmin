<template>
  <a-layout class="point-log-view">
    <header class="point-log-header">
      <a-typography-title :level="3">
        {{ trlang.points_usage_log }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.point_log_description }}
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
                <a-select-option value="earn">{{ trlang.points_earned }}</a-select-option>
                <a-select-option value="spend">{{ trlang.points_spent }}</a-select-option>
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
          <template v-if="column.dataIndex === 'points' || column.dataIndex === 'balance_after'">
            {{ formatPoints(text) }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag :color="typeColor(text)">{{ trlang[text] || text }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "PointUsageLogView" });

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
    value: "189",
  },
  {
    key: "total_earned",
    title: trlang.value.total_points_earned ?? "Total Earned",
    value: formatPoints(128000),
  },
  {
    key: "total_spent",
    title: trlang.value.total_points_spent ?? "Total Spent",
    value: formatPoints(94000),
  },
  {
    key: "net_points",
    title: trlang.value.net_points ?? "Net Points",
    value: formatPoints(34000),
  },
]);

const columns = computed(() => [
  { title: trlang.value.transaction_id ?? "Transaction ID", dataIndex: "id", key: "id", width: 160 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.transaction_type ?? "Type", dataIndex: "type", key: "type", width: 140 },
  { title: trlang.value.points ?? "Points", dataIndex: "points", key: "points", width: 160 },
  { title: trlang.value.balance_after ?? "Balance After", dataIndex: "balance_after", key: "balance_after", width: 160 },
  { title: trlang.value.description ?? "Description", dataIndex: "description", key: "description" },
  { title: trlang.value.processed_at ?? "Processed At", dataIndex: "processed_at", key: "processed_at", width: 200 },
]);

const tableData = ref([
  {
    id: "PT-55021",
    member: "user_023",
    type: "earn",
    points: 3200,
    balance_after: 15890,
    description: "Bet win reward (Round #2024-04-110)",
    processed_at: "2024-04-20 11:42",
  },
  {
    id: "PT-55020",
    member: "user_118",
    type: "spend",
    points: -1800,
    balance_after: 9200,
    description: "Used for bonus exchange",
    processed_at: "2024-04-20 10:58",
  },
  {
    id: "PT-55019",
    member: "user_781",
    type: "earn",
    points: 950,
    balance_after: 1840,
    description: "Daily login bonus",
    processed_at: "2024-04-20 09:01",
  },
]);

const typeColor = (type) => {
  switch (type) {
    case "earn":
      return "green";
    case "spend":
      return "volcano";
    default:
      return "blue";
  }
};

const formatPoints = (value) => {
  return `${value.toLocaleString()} P`;
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
.point-log-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.point-log-header {
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

