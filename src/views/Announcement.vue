<template>
  <a-layout class="announcement-view">
    <header class="announcement-header">
      <a-typography-title :level="3">
        {{ trlang.announcement }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.announcement_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.post_range">
              <a-range-picker v-model:value="filters.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.category">
              <a-select v-model:value="filters.category" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="system">{{ trlang.system_notice }}</a-select-option>
                <a-select-option value="maintenance">{{ trlang.maintenance }}</a-select-option>
                <a-select-option value="event">{{ trlang.event }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.keyword_filter">
              <a-input v-model:value="filters.keyword" :placeholder="trlang.search_placeholder" allow-clear />
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

    <a-card class="table-card">
      <template #title>
        <div class="table-title">
          <span>{{ trlang.announcement_list }}</span>
          <a-button type="primary" class="bg-main text-white" @click="openCreateModal = true">
            {{ trlang.create_announcement }}
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
          <template v-if="column.dataIndex === 'category'">
            <a-tag :color="categoryColor(record.category)">
              {{ trlang[record.category] || record.category }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link">{{ trlang.view }}</a-button>
              <a-button type="link">{{ trlang.edit }}</a-button>
              <a-button type="link" danger>{{ trlang.delete }}</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="openCreateModal"
      :title="trlang.create_announcement"
      :ok-text="trlang.save"
      :cancel-text="trlang.cancel"
    >
      <p>{{ trlang.placeholder_modal_text }}</p>
    </a-modal>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "AnnouncementView" });

import { computed, inject, ref } from "vue";
import dayjs from "dayjs";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const openCreateModal = ref(false);

const filters = ref({
  range: [dayjs().subtract(30, "day"), dayjs()],
  category: "all",
  keyword: "",
});

const columns = computed(() => [
  { title: trlang.value.post_id ?? "ID", dataIndex: "id", key: "id", width: 120 },
  { title: trlang.value.title ?? "Title", dataIndex: "title", key: "title" },
  { title: trlang.value.category ?? "Category", dataIndex: "category", key: "category", width: 140 },
  { title: trlang.value.author ?? "Author", dataIndex: "author", key: "author", width: 160 },
  { title: trlang.value.published_at ?? "Published At", dataIndex: "published_at", key: "published_at", width: 200 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.actions ?? "Actions", dataIndex: "actions", key: "actions", width: 160 },
]);

const tableData = ref([
  {
    id: "ANN-2024-032",
    title: "Scheduled Maintenance - April 25",
    category: "maintenance",
    author: "admin01",
    published_at: "2024-04-20 14:00",
    status: "published",
  },
  {
    id: "ANN-2024-031",
    title: "New Partner Commission Rates",
    category: "system_notice",
    author: "admin02",
    published_at: "2024-04-18 10:30",
    status: "published",
  },
  {
    id: "ANN-2024-030",
    title: "Spring Event Reward Campaign",
    category: "event",
    author: "admin03",
    published_at: "2024-04-15 09:40",
    status: "hidden",
  },
]);

const categoryColor = (value) => {
  switch (value) {
    case "system_notice":
      return "blue";
    case "maintenance":
      return "orange";
    case "event":
      return "green";
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
    category: "all",
    keyword: "",
  };
};
</script>

<style scoped>
.announcement-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.announcement-header {
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
</style>

