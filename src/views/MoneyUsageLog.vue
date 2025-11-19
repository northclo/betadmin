<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.money_usage_log }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.money_log_description }}
      </a-typography-text>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.transaction_range">
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.transaction_type">
              <a-select v-model:value="filters.type" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="charge">{{ trlang.charge }}</a-select-option>
                <a-select-option value="exchange">{{ trlang.exchange }}</a-select-option>
                <a-select-option value="bet">{{ trlang.betting }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.member">
              <a-input 
                v-model:value="filters.member" 
                :placeholder="trlang.member_placeholder"
                class="input-lg search-input"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="searchLoading" @click="handleFilterChange">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">{{ trlang.reset }}</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12" :lg="6" v-for="card in summaryCards" :key="card.key">
        <a-card class="summary-card" :loading="summaryLoading">
          <template #title>{{ card.title }}</template>
          <a-typography-title :level="2" class="mb-0">
            {{ card.value }}
          </a-typography-title>
        </a-card>
      </a-col>
    </a-row>

    <a-layout-content>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="paginationConfig"
        row-key="transaction_id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}
          </template>
          <template v-else-if="column.dataIndex === 'amount' || column.dataIndex === 'balance_after'">
            {{ formatCurrency(record[column.dataIndex]) }}
          </template>
          <template v-else-if="column.dataIndex === 'member_nickname'">
            {{ record.member_nickname || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag>{{ trlang[record.type] || record.type }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "MoneyUsageLogView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const summaryLoading = ref(false);
const searchLoading = ref(false);
const filters = ref({
  range: null,
  type: "all",
  member: "",
});

const summaryData = ref({
  total_transactions: 0,
  total_inflow: 0,
  total_outflow: 0,
  net_change: 0,
});

const summaryCards = computed(() => [
  {
    key: "total_transactions",
    title: trlang.value.total_transactions,
    value: summaryData.value.total_transactions,
  },
  {
    key: "total_inflow",
    title: trlang.value.total_inflow,
    value: formatCurrency(summaryData.value.total_inflow),
  },
  {
    key: "total_outflow",
    title: trlang.value.total_outflow,
    value: formatCurrency(summaryData.value.total_outflow),
  },
  {
    key: "net_change",
    title: trlang.value.net_change,
    value: formatCurrency(summaryData.value.net_change),
  },
]);

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.member, dataIndex: "member_nickname", key: "member_nickname", width: 160 },
  { title: trlang.value.transaction_type, dataIndex: "type", key: "type", width: 140 },
  { title: trlang.value.amount, dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.balance_after, dataIndex: "balance_after", key: "balance_after", width: 160 },
  { title: trlang.value.description, dataIndex: "description", key: "description" },
  { title: trlang.value.processed_at, dataIndex: "processed_at", key: "processed_at", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const formatCurrency = (value) => {
  if (!value && value !== 0) return "$0";
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const buildQuery = () => {
  const params = new URLSearchParams({
    type: filters.value.type || "all",
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  const range = filters.value.range;
  if (range && Array.isArray(range) && range.length === 2) {
    const [start, end] = range;
    if (start) {
      const startDate = dayjs.isDayjs(start) ? start.format('YYYY-MM-DD') : start;
      params.set('startDate', startDate);
    }
    if (end) {
      const endDate = dayjs.isDayjs(end) ? end.format('YYYY-MM-DD') : end;
      params.set('endDate', endDate);
    }
  }

  if (filters.value.member) {
    params.append("member", filters.value.member);
  }

  return params.toString();
};

const buildSummaryQuery = () => {
  const params = new URLSearchParams({
    type: filters.value.type || "all",
  });

  if (filters.value.range && filters.value.range.length === 2) {
    if (filters.value.range[0]) {
      params.append("startDate", dayjs(filters.value.range[0]).format("YYYY-MM-DD"));
    }
    if (filters.value.range[1]) {
      params.append("endDate", dayjs(filters.value.range[1]).format("YYYY-MM-DD"));
    }
  }

  if (filters.value.member) {
    params.append("member", filters.value.member);
  }

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_money_usage_list}?${buildQuery()}`);

    if (res.status) {
      const payload = res.data || {};
      tableData.value = payload.list || [];
      setTotal(payload.total || 0);
      if (payload.page) {
        paginationConfig.value.current = payload.page;
      }
      if (payload.pageSize) {
        paginationConfig.value.pageSize = payload.pageSize;
      }
    }
  } catch (error) {
    console.error("Error fetching money usage log:", error);
    message.error(trlang.value.failed_to_fetch_money_usage_log);
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  summaryLoading.value = true;
  try {
    const res = await getData(`${apiLink.get_money_usage_summary}?${buildSummaryQuery()}`);

    if (res.status) {
      summaryData.value = res.data || {
        total_transactions: 0,
        total_inflow: 0,
        total_outflow: 0,
        net_change: 0,
      };
    } else {
      message.error(res.message || trlang.value.failed_to_fetch_summary_data);
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
    const errorMessage = error?.response?.data?.message || error?.message || trlang.value.failed_to_fetch_summary_data;
    message.error(errorMessage);
  } finally {
    summaryLoading.value = false;
  }
};

const handleFilterChange = async () => {
  searchLoading.value = true;
  paginationConfig.value.current = 1;
  try {
    await Promise.all([fetchData(), fetchSummary()]);
  } finally {
    searchLoading.value = false;
  }
};

const resetFilters = async () => {
  filters.value = {
    range: null,
    type: "all",
    member: "",
  };
  paginationConfig.value.current = 1;
  searchLoading.value = true;
  try {
    await Promise.all([fetchData(), fetchSummary()]);
  } finally {
    searchLoading.value = false;
  }
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

onMounted(() => {
  fetchData();
  fetchSummary();
});
</script>
