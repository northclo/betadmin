<template>
  <a-layout class="popup-view">
    <header class="popup-header">
      <a-typography-title :level="3">
        {{ trlang.popup_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.popup_management_description || "Manage popup notifications and announcements" }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.post_range || 'Date Range'">
              <a-range-picker v-model:value="filters.range" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.status || 'Status'">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="">{{ trlang.all || 'All' }}</a-select-option>
                <a-select-option value="active">{{ trlang.active || 'Active' }}</a-select-option>
                <a-select-option value="inactive">{{ trlang.inactive || 'Inactive' }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.keyword_filter || 'Keyword'">
              <a-input v-model:value="filters.keyword" :placeholder="trlang.search_placeholder || 'Search...'" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="actions">
          <a-button type="primary" class="bg-main text-white" @click="handleFilterChange">
            {{ trlang.search || 'Search' }}
          </a-button>
          <a-button @click="resetFilters">{{ trlang.reset || 'Reset' }}</a-button>
        </div>
      </a-form>
    </a-card>

    <a-card class="table-card">
      <template #title>
        <div class="table-title">
          <span>{{ trlang.popup_list || 'Popup List' }}</span>
          <a-button type="primary" class="bg-main text-white" @click="handleCreate">
            {{ trlang.create_popup || 'Create Popup' }}
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
          <template v-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">
              {{ record.status === 'active' ? (trlang.active || 'Active') : (trlang.inactive || 'Inactive') }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'start_date'">
            {{ record.start_date ? formatDate(record.start_date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'end_date'">
            {{ record.end_date ? formatDate(record.end_date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'position'">
            <a-tag>{{ record.position || 'center' }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'size'">
            <a-tag>{{ record.size || 'medium' }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleView(record)">{{ trlang.view || 'View' }}</a-button>
              <a-button type="link" @click="handleEdit(record)">{{ trlang.edit || 'Edit' }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete || 'Are you sure you want to delete this popup?'"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger>{{ trlang.delete || 'Delete' }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingRecord ? (trlang.edit_popup || 'Edit Popup') : (trlang.create_popup || 'Create Popup')"
      :ok-text="trlang.save || 'Save'"
      :cancel-text="trlang.cancel || 'Cancel'"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="handleCancel"
      :width="900"
    >
      <a-form :model="formData" layout="vertical" ref="formRef">
        <a-form-item
          :label="trlang.title || 'Title'"
          name="title"
          :rules="[{ required: true, message: trlang.title_required || 'Title is required' }]"
        >
          <a-input v-model:value="formData.title" :placeholder="trlang.title_placeholder || 'Enter popup title'" />
        </a-form-item>
        <a-form-item
          :label="trlang.content || 'Content'"
          name="content"
          :rules="[{ required: true, message: trlang.content_required || 'Content is required' }]"
        >
          <a-textarea
            v-model:value="formData.content"
            :placeholder="trlang.content_placeholder || 'Enter popup content'"
            :rows="6"
          />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.status || 'Status'">
              <a-select v-model:value="formData.status">
                <a-select-option value="active">{{ trlang.active || 'Active' }}</a-select-option>
                <a-select-option value="inactive">{{ trlang.inactive || 'Inactive' }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.display_order || 'Display Order'">
              <a-input-number v-model:value="formData.display_order" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.start_date || 'Start Date'">
              <a-date-picker
                v-model:value="formData.start_date"
                show-time
                style="width: 100%"
                :placeholder="trlang.select_start_date || 'Select start date'"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.end_date || 'End Date'">
              <a-date-picker
                v-model:value="formData.end_date"
                show-time
                style="width: 100%"
                :placeholder="trlang.select_end_date || 'Select end date'"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.position || 'Position'">
              <a-select v-model:value="formData.position">
                <a-select-option value="top">{{ trlang.top || 'Top' }}</a-select-option>
                <a-select-option value="center">{{ trlang.center || 'Center' }}</a-select-option>
                <a-select-option value="bottom">{{ trlang.bottom || 'Bottom' }}</a-select-option>
                <a-select-option value="fullscreen">{{ trlang.fullscreen || 'Fullscreen' }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.size || 'Size'">
              <a-select v-model:value="formData.size">
                <a-select-option value="small">{{ trlang.small || 'Small' }}</a-select-option>
                <a-select-option value="medium">{{ trlang.medium || 'Medium' }}</a-select-option>
                <a-select-option value="large">{{ trlang.large || 'Large' }}</a-select-option>
                <a-select-option value="fullscreen">{{ trlang.fullscreen || 'Fullscreen' }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="trlang.link_url || 'Link URL (Optional)'">
          <a-input v-model:value="formData.link_url" :placeholder="trlang.link_url_placeholder || 'Enter link URL (optional)'" />
        </a-form-item>
        <a-form-item :label="trlang.image || 'Image URL (Optional)'">
          <a-input v-model:value="formData.image" :placeholder="trlang.image_url_placeholder || 'Enter image URL (optional)'" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="formData.is_closable">
            {{ trlang.is_closable || 'User can close this popup' }}
          </a-checkbox>
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
          <a-descriptions-item :label="trlang.status || 'Status'">
            <a-tag :color="statusColor(viewingRecord.status)">
              {{ viewingRecord.status === 'active' ? (trlang.active || 'Active') : (trlang.inactive || 'Inactive') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.display_order || 'Display Order'">
            {{ viewingRecord.display_order || 0 }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.position || 'Position'">
            {{ viewingRecord.position || 'center' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.size || 'Size'">
            {{ viewingRecord.size || 'medium' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.start_date || 'Start Date'">
            {{ viewingRecord.start_date ? formatDate(viewingRecord.start_date) : '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.end_date || 'End Date'">
            {{ viewingRecord.end_date ? formatDate(viewingRecord.end_date) : '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.author || 'Author'">
            {{ viewingRecord.author || 'Unknown' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.is_closable || 'Closable'">
            {{ viewingRecord.is_closable ? (trlang.yes || 'Yes') : (trlang.no || 'No') }}
          </a-descriptions-item>
          <a-descriptions-item v-if="viewingRecord.link_url" :label="trlang.link_url || 'Link URL'">
            <a :href="viewingRecord.link_url" target="_blank">{{ viewingRecord.link_url }}</a>
          </a-descriptions-item>
        </a-descriptions>
        <div style="margin-top: 24px;">
          <a-typography-title :level="5">{{ trlang.content || 'Content' }}</a-typography-title>
          <a-typography-paragraph>{{ viewingRecord.content }}</a-typography-paragraph>
        </div>
        <div v-if="viewingRecord.image" style="margin-top: 24px;">
          <img :src="viewingRecord.image" alt="Popup image" style="max-width: 100%; height: auto;" />
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

defineOptions({ name: "PopupManagementView" });

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
  status: "",
  keyword: "",
});

const formData = ref({
  title: "",
  content: "",
  status: "inactive",
  start_date: null,
  end_date: null,
  display_order: 0,
  position: "center",
  size: "medium",
  link_url: "",
  image: "",
  is_closable: true,
});

const columns = computed(() => [
  { title: trlang.value.id || "ID", dataIndex: "id", key: "id", width: 120, ellipsis: true },
  { title: trlang.value.title || "Title", dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.status || "Status", dataIndex: "status", key: "status", width: 100 },
  { title: trlang.value.start_date || "Start Date", dataIndex: "start_date", key: "start_date", width: 180 },
  { title: trlang.value.end_date || "End Date", dataIndex: "end_date", key: "end_date", width: 180 },
  { title: trlang.value.position || "Position", dataIndex: "position", key: "position", width: 100 },
  { title: trlang.value.size || "Size", dataIndex: "size", key: "size", width: 100 },
  { title: trlang.value.display_order || "Order", dataIndex: "display_order", key: "display_order", width: 80 },
  { title: trlang.value.actions || "Actions", dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const statusColor = (value) => {
  switch (value) {
    case "active":
      return "green";
    case "inactive":
      return "default";
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

  if (filters.value.status && filters.value.status.trim()) {
    params.append("status", filters.value.status.trim());
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
    const res = await getData(`${apiLink.get_popup_list}?${buildQuery()}`);

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
    console.error("Error fetching popups:", error);
    message.error("Failed to fetch popups");
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
    status: "",
    keyword: "",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleCreate = () => {
  editingRecord.value = null;
  formData.value = {
    title: "",
    content: "",
    status: "inactive",
    start_date: null,
    end_date: null,
    display_order: 0,
    position: "center",
    size: "medium",
    link_url: "",
    image: "",
    is_closable: true,
  };
  modalVisible.value = true;
};

const handleEdit = (record) => {
  editingRecord.value = record;
  formData.value = {
    title: record.title || "",
    content: record.content || "",
    status: record.status || "inactive",
    start_date: record.start_date ? dayjs(record.start_date) : null,
    end_date: record.end_date ? dayjs(record.end_date) : null,
    display_order: record.display_order || 0,
    position: record.position || "center",
    size: record.size || "medium",
    link_url: record.link_url || "",
    image: record.image || "",
    is_closable: record.is_closable !== undefined ? record.is_closable : true,
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
      content: formData.value.content.trim(),
      status: formData.value.status,
      display_order: formData.value.display_order || 0,
      position: formData.value.position,
      size: formData.value.size,
      link_url: formData.value.link_url.trim() || null,
      image: formData.value.image.trim() || null,
      is_closable: formData.value.is_closable,
    };

    // Convert dayjs objects to ISO strings
    if (formData.value.start_date) {
      payload.start_date = formData.value.start_date.toISOString();
    } else {
      payload.start_date = null;
    }

    if (formData.value.end_date) {
      payload.end_date = formData.value.end_date.toISOString();
    } else {
      payload.end_date = null;
    }

    let res;
    if (editingRecord.value) {
      res = await putData(`${apiLink.update_popup}/${editingRecord.value.id}`, payload);
    } else {
      res = await postData(apiLink.create_popup, payload);
    }

    if (res.status) {
      message.success(res.message || (editingRecord.value ? "Popup updated successfully" : "Popup created successfully"));
      modalVisible.value = false;
      fetchData();
    }
  } catch (error) {
    if (error.errorFields) {
      // Form validation error
      return;
    }
    console.error("Error saving popup:", error);
    message.error("Failed to save popup");
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  modalVisible.value = false;
  editingRecord.value = null;
  formData.value = {
    title: "",
    content: "",
    status: "inactive",
    start_date: null,
    end_date: null,
    display_order: 0,
    position: "center",
    size: "medium",
    link_url: "",
    image: "",
    is_closable: true,
  };
};

const handleDelete = async (popupId) => {
  try {
    const res = await deleteData(`${apiLink.delete_popup}/${popupId}`);
    if (res.status) {
      message.success(res.message || "Popup deleted successfully");
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting popup:", error);
    message.error("Failed to delete popup");
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.popup-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.popup-header {
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

