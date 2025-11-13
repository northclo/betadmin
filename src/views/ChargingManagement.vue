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
          <a-col :xs="24" :md="8" class="actions">
            <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
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
        :pagination="paginationConfig"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'amount'">
            {{ formatCurrency(record.amount) }}
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
                {{ trlang.approve || 'Approve' }}
              </a-button>
              <a-button 
                v-if="record.status === 'pending'"
                danger 
                size="small"
                @click="handleAction(record, 'reject')"
              >
                {{ trlang.reject || 'Reject' }}
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

defineOptions({ name: "ChargingManagementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  status: "all",
});

const summaryData = ref({
  total_requests: 0,
  pending_requests: 0,
  completed_amount: 0,
  average_processing_time: "0m",
});

const summaryCards = computed(() => [
  {
    key: "total_requests",
    title: trlang.value.total_requests ?? "Total Requests",
    value: summaryData.value.total_requests,
  },
  {
    key: "pending_requests",
    title: trlang.value.pending_requests ?? "Pending",
    value: summaryData.value.pending_requests,
  },
  {
    key: "completed_amount",
    title: trlang.value.completed_amount ?? "Completed Amount",
    value: formatCurrency(summaryData.value.completed_amount),
  },
  {
    key: "average_processing",
    title: trlang.value.average_processing_time ?? "Avg. Processing",
    value: summaryData.value.average_processing_time,
  },
]);

const columns = computed(() => [
  { title: trlang.value.request_id ?? "Request ID", dataIndex: "id", key: "id", width: 140 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.amount ?? "Amount", dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.submitted_at ?? "Submitted At", dataIndex: "submitted_at", key: "submitted_at", width: 200 },
  { title: trlang.value.processed_by ?? "Processed By", dataIndex: "processed_by", key: "processed_by", width: 160 },
  { title: trlang.value.action ?? "Action", dataIndex: "action", key: "action", width: 150 },
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

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_charging_list}?${buildQuery()}`);

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
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  try {
    const res = await getData(`${apiLink.get_charging_summary}?${buildSummaryQuery()}`);

    if (res.status) {
      summaryData.value = res.data || {
        total_requests: 0,
        pending_requests: 0,
        completed_amount: 0,
        average_processing_time: "0m",
      };
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
};

const handleAction = async (record, action) => {
  try {
    // Extract transaction ID from the record
    // The record._id is the MongoDB ObjectId as string, or we can extract from record.id
    const transactionId = record._id || record.id?.replace("REQ-", "");

    if (!transactionId) {
      message.error("Transaction ID not found");
      return;
    }

    const res = await postData(apiLink.update_charging_status, {
      transactionId,
      action,
    });

    if (res.status) {
      message.success(res.message || `Transaction ${action === "approve" ? "approved" : "rejected"} successfully`);
      await fetchData();
      await fetchSummary();
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    message.error("Failed to update transaction");
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

