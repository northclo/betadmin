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
      <template #title>
        <div class="table-title">
          <span>{{ trlang.service_center_ticket_list }}</span>
          <a-button type="primary" class="bg-main text-white" @click="openCreateModal = true">
            {{ trlang.create_ticket }}
          </a-button>
        </div>
      </template>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="{ pageSize: 10 }"
        row-key="id"
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
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link">{{ trlang.view }}</a-button>
              <a-button type="link">{{ trlang.reply }}</a-button>
              <a-button type="link" danger>{{ trlang.delete }}</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="openCreateModal"
      :title="trlang.create_ticket"
      :ok-text="trlang.save"
      :cancel-text="trlang.cancel"
    >
      <p>{{ trlang.placeholder_modal_text }}</p>
    </a-modal>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "CustomerServiceCenterView" });

import { computed, inject, ref } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const openCreateModal = ref(false);

const filters = ref({
  range: [dayjs().subtract(30, "day"), dayjs()],
  status: "all",
  priority: "all",
});

const summaryCards = computed(() => [
  {
    key: "open_tickets",
    title: trlang.value.open_ticket ?? "Open Tickets",
    value: "18",
  },
  {
    key: "in_progress",
    title: trlang.value.in_progress ?? "In Progress",
    value: "6",
  },
  {
    key: "resolved",
    title: trlang.value.resolved ?? "Resolved",
    value: "142",
  },
  {
    key: "avg_response",
    title: trlang.value.average_response_time ?? "Average Response",
    value: "12m",
  },
]);

const columns = computed(() => [
  { title: trlang.value.ticket_id ?? "Ticket ID", dataIndex: "id", key: "id", width: 160 },
  { title: trlang.value.member ?? "Member", dataIndex: "member", key: "member", width: 160 },
  { title: trlang.value.priority ?? "Priority", dataIndex: "priority", key: "priority", width: 140 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.subject ?? "Subject", dataIndex: "subject", key: "subject" },
  { title: trlang.value.updated_at ?? "Updated At", dataIndex: "updated_at", key: "updated_at", width: 200 },
  { title: trlang.value.assigned_to ?? "Assigned To", dataIndex: "assigned_to", key: "assigned_to", width: 160 },
  { title: trlang.value.actions ?? "Actions", dataIndex: "actions", key: "actions", width: 160 },
]);

const tableData = ref([
  {
    id: "TICKET-2042",
    member: "user_118",
    priority: "high",
    status: "open",
    subject: "Unable to change withdrawal password",
    updated_at: "2024-04-21 15:22",
    assigned_to: "agent03",
  },
  {
    id: "TICKET-2041",
    member: "user_203",
    priority: "medium",
    status: "in_progress",
    subject: "Point balance incorrect after event",
    updated_at: "2024-04-21 14:18",
    assigned_to: "agent02",
  },
  {
    id: "TICKET-2040",
    member: "user_532",
    priority: "low",
    status: "resolved",
    subject: "Requesting tutorial materials",
    updated_at: "2024-04-21 12:06",
    assigned_to: "agent01",
  },
]);

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

const fetchData = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 600);
};

const resetFilters = () => {
  filters.value = {
    range: [dayjs().subtract(30, "day"), dayjs()],
    status: "all",
    priority: "all",
  };
};
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
</style>

