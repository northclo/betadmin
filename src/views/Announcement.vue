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
                <a-select-option value="system_notice">{{ trlang.system_notice }}</a-select-option>
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
          <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
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
          <a-button type="primary" class="bg-main text-white" @click="handleCreate">
            {{ trlang.create_announcement }}
          </a-button>
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
          <template v-if="column.dataIndex === 'category'">
            <a-tag :color="categoryColor(record.category)">
              {{ trlang[record.category] || record.category }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'published_at'">
            {{ record.published_at ? formatDate(record.published_at) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleView(record)">{{ trlang.view }}</a-button>
              <a-button type="link" @click="handleEdit(record)">{{ trlang.edit }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete || 'Are you sure you want to delete this announcement?'"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger>{{ trlang.delete }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingRecord ? trlang.edit_announcement : trlang.create_announcement"
      :ok-text="trlang.save"
      :cancel-text="trlang.cancel"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="handleCancel"
      :width="800"
    >
      <a-form :model="formData" layout="vertical" ref="formRef">
        <a-form-item
          :label="trlang.title"
          name="title"
          :rules="[{ required: true, message: trlang.title_required || 'Title is required' }]"
        >
          <a-input v-model:value="formData.title" :placeholder="trlang.title_placeholder" />
        </a-form-item>
        <a-form-item
          :label="trlang.description"
          name="description"
          :rules="[{ required: true, message: trlang.description_required || 'Description is required' }]"
        >
          <a-textarea
            v-model:value="formData.description"
            :placeholder="trlang.description_placeholder"
            :rows="6"
          />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.category" name="category">
              <a-select v-model:value="formData.category">
                <a-select-option value="system_notice">{{ trlang.system_notice }}</a-select-option>
                <a-select-option value="maintenance">{{ trlang.maintenance }}</a-select-option>
                <a-select-option value="event">{{ trlang.event }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.status" name="status">
              <a-select v-model:value="formData.status">
                <a-select-option value="draft">Draft</a-select-option>
                <a-select-option value="published">Published</a-select-option>
                <a-select-option value="archived">Archived</a-select-option>
                <a-select-option value="hidden">Hidden</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="trlang.image || 'Image'">
          <a-input v-model:value="formData.image" :placeholder="trlang.image_url_placeholder || 'Image URL (optional)'" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- View Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      :title="viewingRecord?.title"
      :footer="null"
      :width="800"
    >
      <div v-if="viewingRecord">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item :label="trlang.category">
            <a-tag :color="categoryColor(viewingRecord.category)">
              {{ trlang[viewingRecord.category] || viewingRecord.category }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.status">
            <a-tag :color="statusColor(viewingRecord.status)">
              {{ viewingRecord.status }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.author">
            {{ viewingRecord.author }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.published_at">
            {{ viewingRecord.published_at ? formatDate(viewingRecord.published_at) : '-' }}
          </a-descriptions-item>
        </a-descriptions>
        <div style="margin-top: 24px;">
          <a-typography-title :level="5">{{ trlang.description }}</a-typography-title>
          <a-typography-paragraph>{{ viewingRecord.description }}</a-typography-paragraph>
        </div>
        <div v-if="viewingRecord.image" style="margin-top: 24px;">
          <img :src="viewingRecord.image" alt="Announcement image" style="max-width: 100%; height: auto;" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData, postData, putData, deleteData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "AnnouncementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const saving = ref(false);
const modalVisible = ref(false);
const viewModalVisible = ref(false);
const editingRecord = ref(null);
const viewingRecord = ref(null);
const formRef = ref(null);

const filters = ref({
  range: [dayjs().subtract(30, "day"), dayjs()],
  category: "all",
  keyword: "",
});

const formData = ref({
  title: "",
  description: "",
  category: "system_notice",
  status: "draft",
  image: "",
});

const columns = computed(() => [
  { title: trlang.value.post_id ?? "ID", dataIndex: "id", key: "id", width: 120, ellipsis: true },
  { title: trlang.value.title ?? "Title", dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.category ?? "Category", dataIndex: "category", key: "category", width: 140 },
  { title: trlang.value.author ?? "Author", dataIndex: "author", key: "author", width: 160 },
  { title: trlang.value.published_at ?? "Published At", dataIndex: "published_at", key: "published_at", width: 200 },
  { title: trlang.value.status ?? "Status", dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.actions ?? "Actions", dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

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

const statusColor = (value) => {
  switch (value) {
    case "published":
      return "green";
    case "draft":
      return "default";
    case "archived":
      return "gray";
    case "hidden":
      return "red";
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

  if (filters.value.category && filters.value.category !== "all") {
    params.append("category", filters.value.category);
  }

  if (filters.value.keyword && filters.value.keyword.trim()) {
    params.append("keyword", filters.value.keyword.trim());
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
    const res = await getData(`${apiLink.get_announcement_list}?${buildQuery()}`);

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
    console.error("Error fetching announcements:", error);
    message.error("Failed to fetch announcements");
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
    range: [dayjs().subtract(30, "day"), dayjs()],
    category: "all",
    keyword: "",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleCreate = () => {
  editingRecord.value = null;
  formData.value = {
    title: "",
    description: "",
    category: "system_notice",
    status: "draft",
    image: "",
  };
  modalVisible.value = true;
};

const handleEdit = (record) => {
  editingRecord.value = record;
  formData.value = {
    title: record.title || "",
    description: record.description || "",
    category: record.category || "system_notice",
    status: record.status || "draft",
    image: record.image || "",
  };
  modalVisible.value = true;
};

const handleView = (record) => {
  viewingRecord.value = record;
  viewModalVisible.value = true;
};

const handleSave = async () => {
  try {
    await formRef.value.validate();
    saving.value = true;

    const payload = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      category: formData.value.category,
      status: formData.value.status,
      image: formData.value.image.trim() || null,
    };

    let res;
    if (editingRecord.value) {
      res = await putData(`${apiLink.update_announcement}/${editingRecord.value.id}`, payload);
    } else {
      res = await postData(apiLink.create_announcement, payload);
    }

    if (res.status) {
      message.success(res.message || (editingRecord.value ? "Announcement updated successfully" : "Announcement created successfully"));
      modalVisible.value = false;
      fetchData();
    }
  } catch (error) {
    if (error.errorFields) {
      // Form validation error
      return;
    }
    console.error("Error saving announcement:", error);
    message.error("Failed to save announcement");
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  modalVisible.value = false;
  editingRecord.value = null;
  formData.value = {
    title: "",
    description: "",
    category: "system_notice",
    status: "draft",
    image: "",
  };
};

const handleDelete = async (announcementId) => {
  try {
    const res = await deleteData(`${apiLink.delete_announcement}/${announcementId}`);
    if (res.status) {
      message.success(res.message || "Announcement deleted successfully");
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting announcement:", error);
    message.error("Failed to delete announcement");
  }
};

onMounted(() => {
  fetchData();
});
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
