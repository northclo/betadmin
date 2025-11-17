<template>
  <a-layout class="service-center-view">
    <header class="service-center-header">
      <a-typography-title :level="3">
        {{ trlang.custom_service_center || "Customer Center" }}
      </a-typography-title>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.start_date || 'Start Date'">
              <a-date-picker v-model:value="filters.startDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.end_date || '~End Date'">
              <a-date-picker v-model:value="filters.endDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.search_key_word || 'Search Key Word'">
              <a-input-group compact>
                <a-select v-model:value="filters.searchType" style="width: 40%">
                  <a-select-option value="user_nickname">{{ trlang.user_nickname || "User Nickname" }}</a-select-option>
                  <a-select-option value="user_id">{{ trlang.user_id || "User ID" }}</a-select-option>
                  <a-select-option value="title">{{ trlang.title || "Title" }}</a-select-option>
                  <a-select-option value="content">{{ trlang.content || "Content" }}</a-select-option>
                </a-select>
                <a-input v-model:value="filters.keyword" style="width: 60%" :placeholder="trlang.search_placeholder || 'Enter keyword'" />
              </a-input-group>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="actions">
          <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
            {{ trlang.search || "Search" }}
          </a-button>
          <a-button @click="resetFilters">{{ trlang.reset || "Reset" }}</a-button>
        </div>
      </a-form>
    </a-card>

    <a-card class="table-card">
      <template #title>
        <div class="table-title">
          <span>{{ trlang.customer_center || "Customer Center" }}</span>
        </div>
      </template>
      <template #extra>
        <a-button 
          danger 
          :disabled="selectedRowKeys.length === 0"
          @click="handleBulkDelete"
        >
          <template #icon><CloseOutlined /></template>
          {{ trlang.delete_selected_items || "Delete Selected Items" }}
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="paginationConfig"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'no'">
            {{ record.no }}
          </template>
          <template v-else-if="column.dataIndex === 'title'">
            <div>
              <div>{{ record.title }}</div>
              <a-tag :color="record.status === 'resolved' ? 'blue' : record.status === 'rejected' ? 'orange' : 'red'" style="margin-top: 4px;">
                {{ record.status === 'resolved' ? (trlang.resolved || 'Resolved') : record.status === 'rejected' ? (trlang.rejected || 'Rejected') : (trlang.pending || 'Pending') }}
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'userId'">
            <div>
              <div>{{ record.userNickname }}{{ record.userId && record.userId.length >= 8 ? `(${record.userId.slice(-8)})` : (record.userId ? `(${record.userId})` : '') }}</div>
              <div style="color: #999; font-size: 12px;">
                <ArrowLeftOutlined style="margin-right: 4px;" />
                {{ record.userRole === 'partner' ? (trlang.partner || 'Partner') : (trlang.user || 'User') }}
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
            {{ record.ipAddress || "-" }}
          </template>
          <template v-else-if="column.dataIndex === 'answerDate'">
            {{ formatDate(record.answerDate) }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button type="link" @click="handleView(record)">{{ trlang.view || "View" }}</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="viewModalVisible"
      :title="trlang.view_ticket || 'View Ticket'"
      :footer="null"
      width="800px"
    >
      <div v-if="viewingRecord" class="ticket-details">
        <a-form :model="viewingRecord" layout="vertical">
          <a-form-item :label="trlang.title || 'Title'">
            <a-input v-model:value="viewingRecord.title" readonly />
          </a-form-item>
          <a-form-item :label="trlang.user_id || 'User ID'">
            <a-input-group>
              <a-input v-model:value="viewingRecord.userNickname" readonly />
              <a-tag v-if="viewingRecord.userRole === 'partner'" color="blue" style="margin-left: 8px;">
                {{ trlang.partner || "Partner" }}
              </a-tag>
              <a-tag v-else color="default" style="margin-left: 8px;">
                {{ trlang.user || "User" }}
              </a-tag>
            </a-input-group>
          </a-form-item>
          <a-form-item :label="trlang.question || 'Question'">
            <a-textarea v-model:value="viewingRecord.question" :rows="4" readonly />
          </a-form-item>
          <a-form-item :label="trlang.answer_examples || 'Answer Examples'">
            <a-button>{{ trlang.answer_example || "Answer Example" }}</a-button>
          </a-form-item>
          <a-form-item :label="trlang.partner || 'Partner'">
            <a-input v-model:value="viewingRecord.parentPartnerName" readonly />
          </a-form-item>
          <a-form-item :label="trlang.answer || 'Answer'">
            <a-textarea v-model:value="answerForm.answer" :rows="6" :placeholder="trlang.enter_answer || 'Enter your answer...'" />
          </a-form-item>
        </a-form>
        <div class="modal-actions">
          <a-button type="primary" class="bg-main text-white" @click="handleResolve">
            <template #icon><CheckOutlined /></template>
            {{ trlang.resolve || "Resolve" }}
          </a-button>
          <a-button @click="handleBack">
            <template #icon><CloseOutlined /></template>
            {{ trlang.back || "Back" }}
          </a-button>
          <a-button danger @click="handleDelete(viewingRecord.id)">
            <template #icon><DeleteOutlined /></template>
            {{ trlang.delete || "Delete" }}
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
const viewModalVisible = ref(false);
const viewingRecord = ref(null);
const selectedRowKeys = ref([]);
const answerForm = ref({
  answer: "",
});

const filters = ref({
  startDate: null,
  endDate: null,
  searchType: "user_nickname",
  keyword: "",
});

const columns = computed(() => [
  { title: trlang.value.no || "No.", dataIndex: "no", key: "no", width: 80 },
  { title: trlang.value.title || "Title", dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.user_id || "User ID", dataIndex: "userId", key: "userId", width: 200 },
  { title: trlang.value.parent_partner || "Parent Partner", dataIndex: "parentPartner", key: "parentPartner", width: 150 },
  { title: trlang.value.first_message_date || "First Message Date", dataIndex: "firstMessageDate", key: "firstMessageDate", width: 180 },
  { title: trlang.value.message_send_date || "Message Send Date", dataIndex: "messageSendDate", key: "messageSendDate", width: 180 },
  { title: trlang.value.ip || "IP", dataIndex: "ipAddress", key: "ipAddress", width: 150 },
  { title: trlang.value.answer_date || "Answer Date", dataIndex: "answerDate", key: "answerDate", width: 180 },
  { title: trlang.value.status || "Status", dataIndex: "status", key: "status", width: 100 },
  { title: trlang.value.actions || "Actions", dataIndex: "actions", key: "actions", width: 100 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("YYYY-MM-DD HH:mm");
};

const buildQuery = () => {
  const params = new URLSearchParams({
    page: paginationConfig.value.current.toString(),
    limit: paginationConfig.value.pageSize.toString(),
  });

  if (filters.value.startDate) {
    params.append("startDate", dayjs(filters.value.startDate).format("YYYY-MM-DD"));
  }

  if (filters.value.endDate) {
    params.append("endDate", dayjs(filters.value.endDate).format("YYYY-MM-DD"));
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
    }
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    message.error("Failed to fetch support tickets");
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = () => {
  paginationConfig.value.current = 1;
  fetchData();
};

const resetFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
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
  try {
    const res = await getData(`${apiLink.get_support_ticket}/${record.id}`);
    if (res.status) {
      viewingRecord.value = { ...res.data };
      answerForm.value.answer = "";
      viewModalVisible.value = true;
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    message.error("Failed to fetch ticket details");
  }
};

const handleResolve = async () => {
  if (!viewingRecord.value) return;

  if (!answerForm.value.answer || !answerForm.value.answer.trim()) {
    message.warning(trlang.value.enter_answer || "Please enter an answer before resolving the ticket");
    return;
  }

  loading.value = true;
  try {
    const replyRes = await postData(
      `${apiLink.reply_support_ticket}/${viewingRecord.value.id}/reply`,
      { message: answerForm.value.answer.trim() }
    );
    
    if (!replyRes.status) {
      message.error(replyRes.message || "Failed to send reply");
      loading.value = false;
      return;
    }

    // Update status to resolved
    const updateRes = await putData(
      `${apiLink.update_support_ticket}/${viewingRecord.value.id}`,
      { status: "resolved" }
    );

    if (updateRes.status) {
      message.success(trlang.value.ticket_resolved || "Ticket resolved successfully");
      viewModalVisible.value = false;
      viewingRecord.value = null;
      answerForm.value.answer = "";
      fetchData();
    } else {
      message.error(updateRes.message || "Failed to update ticket status");
    }
  } catch (error) {
    console.error("Error resolving ticket:", error);
    message.error("Failed to resolve ticket");
  } finally {
    loading.value = false;
  }
};

const handleBack = () => {
  viewModalVisible.value = false;
  viewingRecord.value = null;
  answerForm.value.answer = "";
};

const handleDelete = async (ticketId) => {
  if (!ticketId) return;
  
  loading.value = true;
  try {
    const res = await deleteData(`${apiLink.delete_support_ticket}/${ticketId}`);
    if (res.status) {
      message.success(res.message || "Ticket deleted successfully");
      viewModalVisible.value = false;
      viewingRecord.value = null;
      answerForm.value.answer = "";
      fetchData();
    } else {
      message.error(res.message || "Failed to delete ticket");
    }
  } catch (error) {
    console.error("Error deleting ticket:", error);
    message.error("Failed to delete ticket");
  } finally {
    loading.value = false;
  }
};

const handleBulkDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning("Please select items to delete");
    return;
  }

  loading.value = true;
  try {
    const res = await postData(`${apiLink.bulk_delete_support}`, {
      ids: selectedRowKeys.value,
    });

    if (res.status) {
      message.success(res.message || `Successfully deleted ${selectedRowKeys.value.length} item(s)`);
      selectedRowKeys.value = [];
      fetchData();
    } else {
      message.error(res.message || "Failed to delete selected items");
    }
  } catch (error) {
    console.error("Error bulk deleting tickets:", error);
    message.error("Failed to delete selected items");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.service-center-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.service-center-header {
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

.table-card {
  background: var(--surface-color);
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
