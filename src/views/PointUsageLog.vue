<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.points_usage_log }}
      </a-typography-title>
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
                :placeholder="[trlang.start_date, trlang.end_date]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.type">
              <a-select v-model:value="filters.fund_type" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="CHARGE">{{ trlang.charge }}</a-select-option>
                <a-select-option value="EXCHANGE">{{ trlang.exchange }}</a-select-option>
                <a-select-option value="BETTING">{{ trlang.betting }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.status">
              <a-select v-model:value="filters.fund_status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="WAIT">{{ trlang.wait }}</a-select-option>
                <a-select-option value="COMPLETE">{{ trlang.complete }}</a-select-option>
                <a-select-option value="CANCEL">{{ trlang.cancel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="searchLoading" @click="handleFilterChange">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">{{ trlang.reset }}</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-layout-content>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="paginationConfig"
        row-key="_id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>
          <template v-else-if="column.dataIndex === 'amount'">
            {{ formatPoints(record[column.dataIndex]) }}
          </template>
          <template v-else-if="column.dataIndex === 'member_nickname'">
            {{ record.member_nickname || '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'type'">
            <a-tag>{{ trlang[record.type] || record.type }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ trlang[record.status] || record.status }}
            </a-tag>
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

defineOptions({ name: "PointUsageLogView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const searchLoading = ref(false);
const filters = ref({
  range: null,
  fund_type: "all",
  fund_status: "all",
});

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.member, dataIndex: "member_nickname", key: "member_nickname", width: 160 },
  { title: trlang.value.type, dataIndex: "type", key: "type", width: 140 },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.points, dataIndex: "amount", key: "amount", width: 160 },
  { title: trlang.value.date, dataIndex: "processed_at", key: "processed_at", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const formatPoints = (value) => {
  const unit = trlang.value.points_unit || "P";
  if (!value && value !== 0) return `0 ${unit}`;
  return `${value.toLocaleString()} ${unit}`;
};

const getStatusColor = (status) => {
  const colorMap = {
    'WAIT': 'orange',
    'COMPLETE': 'green',
    'CANCEL': 'red',
    'PENDING': 'blue',
    'APPROVED': 'green',
    'REJECTED': 'red',
    'PROGRESS': 'cyan'
  };
  return colorMap[status] || 'default';
};

const buildQuery = () => {
  const params = new URLSearchParams({
    fund_type: filters.value.fund_type || "all",
    fund_status: filters.value.fund_status || "all",
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

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_point_usage_list}?${buildQuery()}`);

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
    console.error("Error fetching point usage log:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = async () => {
  searchLoading.value = true;
  paginationConfig.value.current = 1;
  try {
    await fetchData();
  } finally {
    searchLoading.value = false;
  }
};

const resetFilters = async () => {
  filters.value = {
    range: null,
    fund_type: "all",
    fund_status: "all",
  };
  paginationConfig.value.current = 1;
  searchLoading.value = true;
  try {
    await fetchData();
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
});
</script>
