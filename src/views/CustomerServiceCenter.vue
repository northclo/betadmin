<template>
  <a-layout class="service-center-view">
    <header class="service-center-header">
      <a-typography-title :level="3">
        {{ trlang.custom_service_center }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.service_center_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.ticket_range">
              <a-range-picker v-model:value="filters.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.ticket_status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="open">{{ trlang.open_ticket }}</a-select-option>
                <a-select-option value="in_progress">{{ trlang.in_progress }}</a-select-option>
                <a-select-option value="resolved">{{ trlang.resolved }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.priority">
              <a-select v-model:value="filters.priority" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="high">{{ trlang.priority_high }}</a-select-option>
                <a-select-option value="medium">{{ trlang.priority_medium }}</a-select-option>
                <a-select-option value="low">{{ trlang.priority_low }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="actions">
          <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
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
      <template #title>
        <div class="table-title">
          <span>{{ trlang.service_center_ticket_list }}</span>
        </div>
      </template>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="paginationConfig"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">
              {{ trlang[record.status] || record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'priority'">
            <a-tag :color="priorityColor(record.priority)">
              {{ trlang[`priority_${record.priority}`] || record.priority }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'ticket_id'">
            {{ record.ticket_id || record.id }}
          </template>
          <template v-else-if="column.dataIndex === 'updated_at'">
            {{ formatDate(record.updated_at) }}
          </template>
          <template v-else-if="column.dataIndex === 'assigned_to'">
            {{ record.assigned_to || "-" }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleView(record)">{{ trlang.view }}</a-button>
              <a-button type="link" @click="handleReply(record)">{{ trlang.reply }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete || 'Are you sure you want to delete this ticket?'"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger>{{ trlang.delete }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- View Ticket Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      :title="trlang.view_ticket || 'View Ticket'"
      :footer="null"
      width="800px"
    >
      <div v-if="viewingRecord" class="ticket-details">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item :label="trlang.ticket_id || 'Ticket ID'">
            {{ viewingRecord.ticket_id || viewingRecord.id }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.member || 'Member'">
            {{ viewingRecord.member }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.status || 'Status'">
            <a-tag :color="statusColor(viewingRecord.status)">
              {{ trlang[viewingRecord.status] || viewingRecord.status }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.priority || 'Priority'">
            <a-tag :color="priorityColor(viewingRecord.priority)">
              {{ trlang[`priority_${viewingRecord.priority}`] || viewingRecord.priority }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.subject || 'Subject'" :span="2">
            {{ viewingRecord.subject }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.message || 'Message'" :span="2">
            <div style="white-space: pre-wrap;">{{ viewingRecord.message }}</div>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.email || 'Email'">
            {{ viewingRecord.email }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.assigned_to || 'Assigned To'">
            {{ viewingRecord.assigned_to || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.created_at || 'Created At'">
            {{ formatDate(viewingRecord.createdAt) }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.updated_at || 'Updated At'">
            {{ formatDate(viewingRecord.updated_at) }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>{{ trlang.replies || 'Replies' }}</a-divider>
        <div v-if="viewingRecord.replies && viewingRecord.replies.length > 0" class="replies-section">
          <div v-for="(reply, index) in viewingRecord.replies" :key="index" class="reply-item">
            <a-card :bordered="true" size="small">
              <template #title>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span>{{ reply.replied_by_name || reply.replied_by }}</span>
                  <a-tag v-if="reply.is_admin" color="blue">{{ trlang.admin || 'Admin' }}</a-tag>
                </div>
              </template>
              <div style="white-space: pre-wrap;">{{ reply.message }}</div>
              <div style="margin-top: 8px; color: #999; font-size: 12px;">
                {{ formatDate(reply.createdAt) }}
              </div>
            </a-card>
          </div>
        </div>
        <a-empty v-else :description="trlang.no_replies || 'No replies yet'" />
      </div>
    </a-modal>

    <!-- Reply Modal -->
    <a-modal
      v-model:open="replyModalVisible"
      :title="trlang.reply || 'Reply to Ticket'"
      :ok-text="trlang.send || 'Send'"
      :cancel-text="trlang.cancel || 'Cancel'"
      :confirm-loading="replying"
      @ok="handleSendReply"
      @cancel="handleCancelReply"
    >
      <a-form :model="replyForm" layout="vertical">
        <a-form-item
          :label="trlang.reply_message || 'Reply Message'"
          :rules="[{ required: true, message: trlang.reply_message_required || 'Please enter a reply message' }]"
        >
          <a-textarea
            v-model:value="replyForm.message"
            :rows="6"
            :placeholder="trlang.enter_reply_message || 'Enter your reply message...'"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "CustomerServiceCenterView" });

import { computed, inject, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData, postData, deleteData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";
import { usePagination } from "@/composables/usePagination.js";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const replying = ref(false);
const viewModalVisible = ref(false);
const replyModalVisible = ref(false);
const viewingRecord = ref(null);
const replyingRecord = ref(null);
const summaryData = ref({
  open_tickets: 0,
  in_progress: 0,
  resolved: 0,
  average_response_time_formatted: "0m",
});

const filters = ref({
  range: [dayjs().subtract(30, "day"), dayjs()],
  status: "all",
  priority: "all",
});

const replyForm = ref({
  message: "",
});

const summaryCards = computed(() => [
  {
    key: "open_tickets",
    title: trlang.value.open_ticket ?? "Open Tickets",
    value: summaryData.value.open_tickets.toString(),
  },
  {
    key: "in_progress",
    title: trlang.value.in_progress ?? "In Progress",
    value: summaryData.value.in_progress.toString(),
  },
  {
    key: "resolved",
    title: trlang.value.resolved ?? "Resolved",
    value: summaryData.value.resolved.toString(),
  },
  {
    key: "avg_response",
    title: trlang.value.average_response_time ?? "Average Response",
    value: summaryData.value.average_response_time_formatted,
  },
]);

const columns = computed(() => [
  { title: trlang.value.ticket_id ?? "Ticket ID", dataIndex: "ticket_id", key: "ticket_id", width: 160 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.priority ?? "Priority", dataIndex: "priority", key: "priority", width: 140 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.subject ?? "Subject", dataIndex: "subject", key: "subject" },
  { title: trlang.value.updated_at ?? "Updated At", dataIndex: "updated_at", key: "updated_at", width: 200 },
  { title: trlang.value.assigned_to ?? "Assigned To", dataIndex: "assigned_to", key: "assigned_to", width: 160 },
  { title: trlang.value.actions ?? "Actions", dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const statusColor = (status) => {
  switch (status) {
    case "open":
      return "volcano";
    case "in_progress":
      return "gold";
    case "resolved":
      return "green";
    default:
      return "default";
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "blue";
    case "low":
      return "cyan";
    default:
      return "default";
  }
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

  if (filters.value.status && filters.value.status !== "all") {
    params.append("status", filters.value.status);
  }

  if (filters.value.priority && filters.value.priority !== "all") {
    params.append("priority", filters.value.priority);
  }

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

const fetchSummary = async () => {
  try {
    const res = await getData(apiLink.get_support_summary);

    if (res.status) {
      summaryData.value = {
        open_tickets: res.data.open_tickets || 0,
        in_progress: res.data.in_progress || 0,
        resolved: res.data.resolved || 0,
        average_response_time_formatted: res.data.average_response_time_formatted || "0m",
      };
    }
  } catch (error) {
    console.error("Error fetching support summary:", error);
  }
};

const handleFilterChange = () => {
  paginationConfig.value.current = 1;
  fetchData();
};

const resetFilters = () => {
  filters.value = {
    range: [dayjs().subtract(30, "day"), dayjs()],
    status: "all",
    priority: "all",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleView = async (record) => {
  try {
    const res = await getData(`${apiLink.get_support_ticket}/${record.id}`);
    if (res.status) {
      viewingRecord.value = res.data;
      viewModalVisible.value = true;
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    message.error("Failed to fetch ticket details");
  }
};

const handleReply = (record) => {
  replyingRecord.value = record;
  replyForm.value.message = "";
  replyModalVisible.value = true;
};

const handleSendReply = async () => {
  if (!replyForm.value.message || !replyForm.value.message.trim()) {
    message.error(trlang.value.reply_message_required || "Please enter a reply message");
    return;
  }

  replying.value = true;
  try {
    const res = await postData(
      `${apiLink.reply_support_ticket}/${replyingRecord.value.id}/reply`,
      { message: replyForm.value.message.trim() }
    );

    if (res.status) {
      message.success(res.message || "Reply sent successfully");
      replyModalVisible.value = false;
      replyForm.value.message = "";
      replyingRecord.value = null;
      fetchData();
      fetchSummary();
    }
  } catch (error) {
    console.error("Error sending reply:", error);
    message.error("Failed to send reply");
  } finally {
    replying.value = false;
  }
};

const handleCancelReply = () => {
  replyModalVisible.value = false;
  replyForm.value.message = "";
  replyingRecord.value = null;
};

const handleDelete = async (ticketId) => {
  try {
    const res = await deleteData(`${apiLink.delete_support_ticket}/${ticketId}`);
    if (res.status) {
      message.success(res.message || "Ticket deleted successfully");
      fetchData();
      fetchSummary();
    }
  } catch (error) {
    console.error("Error deleting ticket:", error);
    message.error("Failed to delete ticket");
  }
};

onMounted(() => {
  fetchData();
  fetchSummary();
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

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-details {
  max-height: 70vh;
  overflow-y: auto;
}

.replies-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-item {
  margin-bottom: 8px;
}
</style>
