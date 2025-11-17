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
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
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
                <a-select-option value="jpy">JPY</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8" class="actions">
            <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">{{ trlang.reset }}</a-button>
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
        :pagination="paginationConfig"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'original_amount'">
            <span v-if="record.original_amount && record.from_currency">
              {{ formatCurrency(record.original_amount, record.from_currency) }}
            </span>
            <span v-else>-</span>
          </template>
          <template v-if="column.dataIndex === 'amount'">
            <span v-if="record.original_amount && record.from_currency && (record.to_currency || record.currency)">
              {{ formatCurrency(record.original_amount, record.from_currency) }} →
              {{ formatCurrency(record.amount, record.to_currency || record.currency) }}
            </span>
            <span v-else>
              {{ formatCurrency(record.amount, record.currency) }}
            </span>
          </template>
          <template v-else-if="column.dataIndex === 'exchange_rate'">
            <span v-if="record.exchange_rate !== null && record.exchange_rate !== undefined">
              {{ Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(record.exchange_rate) }}
            </span>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">{{ trlang[record.status] || record.status }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button 
                v-if="record.status === 'pending'"
                type="primary" 
                size="small"
                @click="handleAction(record, 'approve')"
              >
                {{ trlang.approve }}
              </a-button>
              <a-button 
                v-if="record.status === 'pending'"
                danger 
                size="small"
                @click="handleAction(record, 'reject')"
              >
                {{ trlang.reject }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData, postData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "ExchangeManagementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  status: "all",
  currency: null,
});

const summaryData = ref({
  total_requests: 0,
  pending_requests: 0,
  completed_amount: 0,
  average_exchange_rate: "",
});

const summaryCards = computed(() => [
  {
    key: "total_requests",
    title: trlang.value.exchange_total_requests,
    value: summaryData.value.total_requests,
  },
  {
    key: "pending_requests",
    title: trlang.value.pending_requests,
    value: summaryData.value.pending_requests,
  },
  {
    key: "completed_amount",
    title: trlang.value.completed_amount,
    value: formatCurrency(summaryData.value.completed_amount),
  },
  {
    key: "average_rate",
    title: trlang.value.average_exchange_rate,
    value: summaryData.value.average_exchange_rate,
  },
]);

const columns = computed(() => [
  { title: trlang.value.request_id, dataIndex: "id", key: "id", width: 140 },
  { title: trlang.value.member, dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.currency_type || trlang.value.currency, dataIndex: "currency", key: "currency", width: 120 },
  { title: trlang.value.from, dataIndex: "from_currency", key: "from_currency", width: 120 },
  { title: trlang.value.to || trlang.value.currency, dataIndex: "to_currency", key: "to_currency", width: 120 },
  { title: trlang.value.exchange_amount || trlang.value.amount, dataIndex: "original_amount", key: "original_amount", width: 180 },
  { title: trlang.value.amount, dataIndex: "amount", key: "amount", width: 200 },
  { title: trlang.value.average_exchange_rate, dataIndex: "exchange_rate", key: "exchange_rate", width: 140 },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.submitted_at, dataIndex: "submitted_at", key: "submitted_at", width: 200 },
  { title: trlang.value.processed_by, dataIndex: "processed_by", key: "processed_by", width: 160 },
  { title: trlang.value.action, dataIndex: "action", key: "action", width: 150 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

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

const formatCurrency = (value, currencyCode) => {
  if (!value && value !== 0) return "$0";
  const code = (currencyCode || "USD").toUpperCase();
  try {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }
};

const buildQuery = () => {
  const params = new URLSearchParams({
    status: filters.value.status || "all",
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  if (filters.value.range && filters.value.range.length === 2) {
    if (filters.value.range[0]) {
      params.append("startDate", dayjs(filters.value.range[0]).format("YYYY-MM-DD"));
    }
    if (filters.value.range[1]) {
      params.append("endDate", dayjs(filters.value.range[1]).format("YYYY-MM-DD"));
    }
  }

  if (filters.value.currency) {
    params.append("currency", filters.value.currency);
  }

  return params.toString();
};

const buildSummaryQuery = () => {
  const params = new URLSearchParams();

  if (filters.value.range && filters.value.range.length === 2) {
    if (filters.value.range[0]) {
      params.append("startDate", dayjs(filters.value.range[0]).format("YYYY-MM-DD"));
    }
    if (filters.value.range[1]) {
      params.append("endDate", dayjs(filters.value.range[1]).format("YYYY-MM-DD"));
    }
  }

  if (filters.value.status) {
    params.append("status", filters.value.status);
  }
  if (filters.value.currency) {
    params.append("currency", filters.value.currency);
  }

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_exchange_list}?${buildQuery()}`);

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
    console.error("Error fetching exchange data:", error);
    message.error(trlang.value.failed_to_fetch_exchange_data);
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  try {
    const res = await getData(`${apiLink.get_exchange_summary}?${buildSummaryQuery()}`);

    if (res.status) {
      summaryData.value = res.data || {
        total_requests: 0,
        pending_requests: 0,
        completed_amount: 0,
        average_exchange_rate: "0 ₩/$",
      };
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
};

const handleAction = async (record, action) => {
  try {
    const transactionId = record._id;

    if (!transactionId) {
      message.error(trlang.value.transaction_id_not_found);
      return;
    }

    const res = await postData(apiLink.update_exchange_status, {
      transactionId,
      action,
    });

    if (res.status) {
      const successMessage = action === "approve" 
        ? trlang.value.exchange_transaction_approved_successfully
        : trlang.value.exchange_transaction_rejected_successfully;
      message.success(res.message || successMessage);
      await fetchData();
      await fetchSummary();
    }
  } catch (error) {
    console.error("Error updating exchange transaction:", error);
    message.error(trlang.value.failed_to_update_exchange_transaction);
  }
};

const handleFilterChange = () => {
  paginationConfig.value.current = 1;
  fetchData();
  fetchSummary();
};

const resetFilters = () => {
  filters.value = {
    range: [dayjs().subtract(7, "day"), dayjs()],
    status: "all",
    currency: null,
  };
  paginationConfig.value.current = 1;
  fetchData();
  fetchSummary();
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

