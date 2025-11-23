<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.custom_service_center }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.date_range">
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.status">
              <a-select v-model:value="filters.status" allow-clear style="width: 100%">
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="PENDING">{{ trlang.pending }}</a-select-option>
                <a-select-option value="RESOLVED">{{ trlang.resolved }}</a-select-option>
                <a-select-option value="REJECTED">{{ trlang.rejected }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.keyword_filter">
              <a-select v-model:value="filters.searchType">
                <a-select-option value="user_nickname">{{ trlang.nickname }}</a-select-option>
                <a-select-option value="user_id">{{ trlang.id }}</a-select-option>
                <a-select-option value="title">{{ trlang.title }}</a-select-option>
                <a-select-option value="content">{{ trlang.content }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-input v-model:value="filters.keyword" :placeholder="trlang.search_placeholder" />
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

    <div class="flex items-center justify-between mb-4">
      <span class="fs-4 font-semibold">{{ trlang.customer_center }}</span>
      <a-button 
        danger 
        :disabled="selectedRowKeys.length === 0 || bulkDeleteLoading"
        :loading="bulkDeleteLoading"
        @click="handleBulkDelete"
      >
        <template #icon><CloseOutlined /></template>
        {{ trlang.delete_selected_items }}
      </a-button>
    </div>

    <a-layout-content>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="paginationConfig"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>
          <template v-else-if="column.dataIndex === 'title'">
            <div>{{ record.title }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'userId'">
            <div>
              <div>{{ record.userNickname }}</div>
              <div style="color: #999; font-size: 12px;">
                <ArrowLeftOutlined style="margin-right: 4px;" />
                {{ record.userRole === 'partner' ? trlang.partner : trlang.user }}
              </div>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'parentPartner'">
            <a-tag v-if="record.parentPartnerName" color="gold">
              {{ record.parentPartnerName }}
            </a-tag>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.dataIndex === 'firstMessageDate'">
            {{ formatDate(record.firstMessageDate) }}
          </template>
          <template v-else-if="column.dataIndex === 'messageSendDate'">
            {{ formatDate(record.messageSendDate) }}
          </template>
          <template v-else-if="column.dataIndex === 'ipAddress'">
            {{ record.ipAddress || trlang.no_data }}
          </template>
          <template v-else-if="column.dataIndex === 'answerDate'">
            {{ formatDate(record.answerDate) }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="record.status === 'RESOLVED' ? 'blue' : record.status === 'REJECTED' ? 'orange' : 'red'">
              {{ record.status === 'RESOLVED' ? trlang.resolved : record.status === 'REJECTED' ? trlang.rejected : trlang.pending }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button type="link" @click="handleView(record)">{{ trlang.view }}</a-button>
          </template>
        </template>
      </a-table>
    </a-layout-content>

    <a-modal
      v-model:open="viewModalVisible"
      :title="trlang.view_ticket"
      :footer="null"
      width="800px"
    >
      <div v-if="viewingRecord" class="ticket-details">
        <a-form :model="viewingRecord" layout="vertical">
          <a-form-item :label="trlang.title">
            <a-input v-model:value="viewingRecord.title" readonly />
          </a-form-item>
          <a-form-item :label="trlang.id">
            <div class="flex items-center">
              <div>{{ viewingRecord.userNickname }}</div>
              <a-tag v-if="viewingRecord.userRole === 'partner'" color="blue" style="margin-left: 8px;">
                {{ trlang.partner }}
              </a-tag>
              <a-tag v-else color="default" style="margin-left: 8px;">
                {{ trlang.user }}
              </a-tag>
            </div>
          </a-form-item>
          <a-form-item :label="trlang.question">
            <a-textarea v-model:value="viewingRecord.question" :rows="4" readonly />
          </a-form-item>
          <a-form-item :label="trlang.answer">
            <a-textarea v-model:value="answerForm.answer" :rows="6" :placeholder="trlang.enter_answer" />
          </a-form-item>
        </a-form>
        <div class="modal-actions">
          <a-button 
            type="primary" 
            class="bg-main text-white" 
            :loading="resolveLoading"
            :disabled="rejectLoading || deleteLoading"
            @click="handleResolve"
          >
            <template #icon><CheckOutlined /></template>
            {{ trlang.resolve }}
          </a-button>
          <a-button 
            type="default" 
            :loading="rejectLoading"
            :disabled="resolveLoading || deleteLoading"
            @click="handleReject"
          >
            <template #icon><CloseOutlined /></template>
            {{ trlang.reject }}
          </a-button>
          <a-button 
            :disabled="resolveLoading || rejectLoading || deleteLoading"
            @click="handleBack"
          >
            {{ trlang.back }}
          </a-button>
          <a-button 
            danger 
            :loading="deleteLoading"
            :disabled="resolveLoading || rejectLoading"
            @click="handleDelete(viewingRecord.id)"
          >
            <template #icon><DeleteOutlined /></template>
            {{ trlang.delete }}
          </a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "CustomerServiceCenterView" });

import { computed, inject, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { CheckOutlined, CloseOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { getData, postData, putData, deleteData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";
import { usePagination } from "@/composables/usePagination.js";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const searchLoading = ref(false);
const resolveLoading = ref(false);
const rejectLoading = ref(false);
const deleteLoading = ref(false);
const bulkDeleteLoading = ref(false);
const viewModalVisible = ref(false);
const viewingRecord = ref(null);
const selectedRowKeys = ref([]);
const answerForm = ref({
  answer: "",
});

const filters = ref({
  range: null,
  status: "all",
  searchType: "user_nickname",
  keyword: "",
});

const columns = computed(() => [
  { title: trlang.value.no, key: "no", width: 80 },
  { title: trlang.value.title, dataIndex: "title", key: "title", width: 200 },
  { title: trlang.value.id, dataIndex: "userId", key: "userId", width: 200 },
  { title: trlang.value.parent_partner, dataIndex: "parentPartner", key: "parentPartner", width: 150 },
  { title: trlang.value.first_message_date, dataIndex: "firstMessageDate", key: "firstMessageDate", width: 180 },
  { title: trlang.value.message_send_date, dataIndex: "messageSendDate", key: "messageSendDate", width: 180 },
  { title: trlang.value.ip, dataIndex: "ipAddress", key: "ipAddress", width: 150 },
  { title: trlang.value.answer_date, dataIndex: "answerDate", key: "answerDate", width: 180 },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 120 },
  { title: trlang.value.actions, dataIndex: "actions", key: "actions", width: 100 },
]);

const tableData = ref([]);
const { paginationConfig, setTotal } = usePagination(10);

const handleTableChange = (pagination) => {
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
  fetchData();
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("YYYY-MM-DD HH:mm");
};

const buildQuery = () => {
  const params = new URLSearchParams({
    page: paginationConfig.value.current.toString(),
    limit: paginationConfig.value.pageSize.toString(),
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

  if (filters.value.status && filters.value.status !== "all") {
    params.append("status", filters.value.status);
  }

  if (filters.value.searchType) {
    params.append("searchType", filters.value.searchType);
  }

  if (filters.value.keyword && filters.value.keyword.trim()) {
    params.append("keyword", filters.value.keyword.trim());
  }

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_support_list}?${buildQuery()}`);

    if (res.status) {
      const payload = res.data || {};
      tableData.value = payload.list || payload.items || [];
      setTotal(payload.total || 0);
      if (payload.page) {
        paginationConfig.value.current = payload.page;
      }
      if (payload.pageSize || payload.limit) {
        paginationConfig.value.pageSize = payload.pageSize || payload.limit || 10;
      }
    } else {
      tableData.value = [];
      setTotal(0);
    }
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    tableData.value = [];
    setTotal(0);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = async () => {
  paginationConfig.value.current = 1;
  searchLoading.value = true;
  try {
    await fetchData();
  } finally {
    searchLoading.value = false;
  }
};

const resetFilters = () => {
  filters.value = {
    range: null,
    status: "all",
    searchType: "user_nickname",
    keyword: "",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const handleView = async (record) => {
  if (!record || !record.id) {
    message.error(trlang.value.invalid_ticket_id);
    return;
  }
  
  try {
    const res = await getData(`${apiLink.get_support_ticket}/${record.id}`);
    if (res.status) {
      viewingRecord.value = { ...res.data };
      answerForm.value.answer = res.data.answer || "";
      viewModalVisible.value = true;
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
  }
};

const handleResolve = async () => {
  if (!viewingRecord.value) return;

  if (!answerForm.value.answer || !answerForm.value.answer.trim()) {
    message.error(trlang.value.please_enter_answer_before_resolving);
    return;
  }

  resolveLoading.value = true;
  try {
    const updateRes = await putData(
      `${apiLink.update_support_ticket}/${viewingRecord.value.id}`,
      { 
        status: "RESOLVED",
        answer: answerForm.value.answer.trim()
      }
    );

    if (updateRes.status) {
      message.success(trlang.value.ticket_resolved);
      viewModalVisible.value = false;
      viewingRecord.value = null;
      answerForm.value.answer = "";
      await fetchData();
    }
  } catch (error) {
    console.error("Error resolving ticket:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    resolveLoading.value = false;
  }
};

const handleReject = async () => {
  if (!viewingRecord.value) return;

  rejectLoading.value = true;
  try {
    const updateRes = await putData(
      `${apiLink.update_support_ticket}/${viewingRecord.value.id}`,
      { status: "REJECTED" }
    );

    if (updateRes.status) {
      message.success(trlang.value.ticket_rejected);
      viewModalVisible.value = false;
      viewingRecord.value = null;
      answerForm.value.answer = "";
      await fetchData();
    }
  } catch (error) {
    console.error("Error rejecting ticket:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    rejectLoading.value = false;
  }
};

const handleBack = () => {
  viewModalVisible.value = false;
  viewingRecord.value = null;
  answerForm.value.answer = "";
};

const handleDelete = async (ticketId) => {
  if (!ticketId) return;
  
  deleteLoading.value = true;
  try {
    const res = await deleteData(`${apiLink.delete_support_ticket}/${ticketId}`);
    if (res.status) {
      message.success(res.message || trlang.value.ticket_deleted_successfully);
      viewModalVisible.value = false;
      viewingRecord.value = null;
      answerForm.value.answer = "";
      await fetchData();
    }
  } catch (error) {
    console.error("Error deleting ticket:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    deleteLoading.value = false;
  }
};

const handleBulkDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.error(trlang.value.please_select_items_to_delete);
    return;
  }

  bulkDeleteLoading.value = true;
  try {
    const res = await postData(`${apiLink.bulk_delete_support}`, {
      ids: selectedRowKeys.value,
    });

    if (res.status) {
      message.success(res.message || trlang.value.successfully_deleted_items.replace('{count}', selectedRowKeys.value.length.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
  } catch (error) {
    console.error("Error bulk deleting tickets:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    bulkDeleteLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.ticket-details {
  max-height: 70vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
