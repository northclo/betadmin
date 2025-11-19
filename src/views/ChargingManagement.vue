<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.charging_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.charging_management_description }}
      </a-typography-text>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.request_range">
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.request_status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="pending">{{ trlang.pending }}</a-select-option>
                <a-select-option value="completed">{{ trlang.completed }}</a-select-option>
                <a-select-option value="cancelled">{{ trlang.cancelled }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="searchLoading" @click="handleFilterChange">
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
        row-key="id"
        @change="handleTableChange"
      >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          {{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}
        </template>
        <template v-else-if="column.dataIndex === 'amount'">
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
                :loading="actionLoading[record._id || record.id] === 'approve'"
                :disabled="actionLoading[record._id || record.id] !== undefined"
                @click="handleAction(record, 'approve')"
              >
                {{ trlang.approve }}
              </a-button>
              <a-button 
                v-if="record.status === 'pending'"
                danger 
                size="small"
                :loading="actionLoading[record._id || record.id] === 'reject'"
                :disabled="actionLoading[record._id || record.id] !== undefined"
                @click="handleAction(record, 'reject')"
              >
                {{ trlang.reject }}
              </a-button>
            </a-space>
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
import { getData, postData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "ChargingManagementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const summaryLoading = ref(false);
const searchLoading = ref(false);
const actionLoading = ref({});
const filters = ref({
  range: null,
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
    title: trlang.value.total_requests,
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
    key: "average_processing",
    title: trlang.value.average_processing_time,
    value: formatMinutesLabel(summaryData.value.average_processing_time),
  },
]);

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.member, dataIndex: "member_nickname", key: "member_nickname", width: 160 },
  { title: trlang.value.amount, dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.submitted_at, dataIndex: "submitted_at", key: "submitted_at", width: 200 },
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

const formatCurrency = (value) => {
  const numeric = typeof value === "number" ? value : 0;
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const formatMinutesLabel = (value) => {
  if (typeof value === "string" && value.endsWith("m")) {
    const num = value.slice(0, -1);
    return `${num}${trlang.value.min}`;
  }
  if (typeof value === "number") {
    return `${value}${trlang.value.min}`;
  }
  return value;
};
const buildQuery = () => {
  const params = new URLSearchParams({
    status: filters.value.status || "all",
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

  return params.toString();
};

const buildSummaryQuery = () => {
  const params = new URLSearchParams();

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
  } catch (error) {
    console.error("Error fetching charging list:", error);
    message.error(trlang.value.failed_to_fetch_charging_list);
  } finally {
    loading.value = false;
  }
};

const fetchSummary = async () => {
  summaryLoading.value = true;
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
    message.error(trlang.value.failed_to_fetch_summary_data);
  } finally {
    summaryLoading.value = false;
  }
};

const handleAction = async (record, action) => {
  const recordId = record._id || record.id;
  const transactionId = record._id || record.id?.replace("REQ-", "");

  if (!transactionId) {
    message.error(trlang.value.transaction_id_not_found);
    return;
  }

  actionLoading.value[recordId] = action;

  try {
    const res = await postData(apiLink.update_charging_status, {
      transactionId,
      action,
    });

    if (res.status) {
      const successMessage = res.message || (action === "approve" ? trlang.value.transaction_approved_successfully : trlang.value.transaction_rejected_successfully);
      message.success(successMessage);
      await fetchData();
      await fetchSummary();
    } else {
      message.error(res.message || trlang.value.failed_to_update_transaction);
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    message.error(trlang.value.failed_to_update_transaction);
  } finally {
    delete actionLoading.value[recordId];
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

const resetFilters = () => {
  filters.value = {
    range: null,
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

