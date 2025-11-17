<template>
  <a-layout class="note-view">
    <header class="note-header">
      <a-typography-title :level="3">
        {{ trlang.note_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.note_management_description || "Manage notes sent to partners" }}
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
            <a-form-item :label="trlang.expired_status || 'Expired Status'">
              <a-select v-model:value="filters.expired" allow-clear>
                <a-select-option value="">{{ trlang.all || 'All' }}</a-select-option>
                <a-select-option value="false">{{ trlang.active || 'Active' }}</a-select-option>
                <a-select-option value="true">{{ trlang.expired || 'Expired' }}</a-select-option>
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
          <span>{{ trlang.note_list || 'Note List' }}</span>
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
          <template v-if="column.dataIndex === 'is_expired'">
            <a-tag :color="record.is_expired ? 'red' : 'green'">
              {{ record.is_expired ? (trlang.expired || 'Expired') : (trlang.active || 'Active') }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'expire_at'">
            {{ record.expire_at ? formatDate(record.expire_at) : (trlang.no_expiration || 'No expiration') }}
          </template>
          <template v-else-if="column.dataIndex === 'createdAt'">
            {{ record.createdAt ? formatDate(record.createdAt) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleView(record)">{{ trlang.view || 'View' }}</a-button>
              <a-button type="link" @click="handleEdit(record)">{{ trlang.edit || 'Edit' }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete || 'Are you sure you want to delete this note?'"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger>{{ trlang.delete || 'Delete' }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="trlang.edit_note || 'Edit Note'"
      :ok-text="trlang.save || 'Save'"
      :cancel-text="trlang.cancel || 'Cancel'"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="handleCancel"
      :width="700"
    >
      <a-form :model="formData" layout="vertical" ref="formRef">
        <a-form-item
          :label="trlang.title || 'Title'"
          name="title"
          :rules="[{ required: true, message: trlang.title_required || 'Title is required' }]"
        >
          <a-input v-model:value="formData.title" :placeholder="trlang.title_note_placeholder || 'Enter note title'" />
        </a-form-item>
        <a-form-item
          :label="trlang.detail || 'Content'"
          name="content"
          :rules="[{ required: true, message: trlang.content_note_required || 'Content is required' }]"
        >
          <a-textarea
            v-model:value="formData.content"
            :placeholder="trlang.content_note_placeholder || 'Enter note content'"
            :rows="6"
          />
        </a-form-item>
        <a-form-item :label="trlang.distributor_id || 'Partner ID'">
          <a-input v-model:value="formData.partnerId" :placeholder="trlang.partner_id_placeholder || 'Enter partner ID (optional)'" />
        </a-form-item>
        <a-form-item :label="trlang.expiration_period || 'Expiration Period'">
          <a-select ref="select" v-model:value="formData.expire" class="input-lg" :options="expireOptions" />
          <a-typography-text class="text-dark-brown" style="display: block; margin-top: 8px;">
            *{{ trlang.when_set_messages_will_be_automatically_deleted_after_the_specified_period }}
          </a-typography-text>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- View Modal -->
    <a-modal
      v-model:open="viewModalVisible"
      :title="viewingRecord?.title"
      :footer="null"
      :width="700"
    >
      <div v-if="viewingRecord">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item :label="trlang.title || 'Title'">
            {{ viewingRecord.title }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.sender || 'Sender'">
            {{ viewingRecord.sender || 'Unknown' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.distributor_id || 'Partner ID'">
            {{ viewingRecord.partner_id || (trlang.all_partners || 'All Partners') }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.partner_name || 'Partner Name'">
            {{ viewingRecord.partner_name || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.expiration_period || 'Expiration'">
            <a-tag :color="viewingRecord.is_expired ? 'red' : 'green'">
              {{ viewingRecord.expire_at ? formatDate(viewingRecord.expire_at) : (trlang.no_expiration || 'No expiration') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="trlang.created_at || 'Created At'">
            {{ viewingRecord.createdAt ? formatDate(viewingRecord.createdAt) : '-' }}
          </a-descriptions-item>
        </a-descriptions>
        <div style="margin-top: 24px;">
          <a-typography-title :level="5">{{ trlang.detail || 'Content' }}</a-typography-title>
          <a-typography-paragraph>{{ viewingRecord.content }}</a-typography-paragraph>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData, putData, deleteData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "NoteManagementView" });

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
  expired: "",
  keyword: "",
});

const expireOptions = ref([
  { value: '0', label: '::No period set::' },
  { value: '1 day', label: '1 day' },
  { value: '3 days', label: '3 days' },
  { value: 'a week', label: 'a week' },
  { value: 'full moon', label: 'full moon' },
  { value: 'month', label: 'month' },
  { value: '1 hour', label: '1 hour' },
  { value: '3 hours', label: '3 hours' },
  { value: '6 hours', label: '6 hours' },
  { value: '12 hours', label: '12 hours' },
  { value: '30 minutes', label: '30 minutes' },
  { value: '5 minutes', label: '5 minutes' },
]);

const formData = ref({
  title: "",
  content: "",
  partnerId: "",
  expire: "0",
});

const columns = computed(() => [
  { title: trlang.value.id || "ID", dataIndex: "id", key: "id", width: 120, ellipsis: true },
  { title: trlang.value.title || "Title", dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.sender || "Sender", dataIndex: "sender", key: "sender", width: 150, ellipsis: true },
  { title: trlang.value.distributor_id || "Partner ID", dataIndex: "partner_id", key: "partner_id", width: 150, ellipsis: true },
  { title: trlang.value.expiration_period || "Expiration", dataIndex: "expire_at", key: "expire_at", width: 180 },
  { title: trlang.value.status || "Status", dataIndex: "is_expired", key: "is_expired", width: 100 },
  { title: trlang.value.created_at || "Created At", dataIndex: "createdAt", key: "createdAt", width: 180 },
  { title: trlang.value.actions || "Actions", dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  if (typeof timestamp === 'number') {
    return dayjs(timestamp).format("YYYY-MM-DD HH:mm");
  }
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm");
};

const buildQuery = () => {
  const params = new URLSearchParams({
    page: paginationConfig.value.current.toString(),
    limit: paginationConfig.value.pageSize.toString(),
  });

  if (filters.value.expired && filters.value.expired.trim()) {
    params.append("expired", filters.value.expired.trim());
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
    const res = await getData(`${apiLink.get_note_list}?${buildQuery()}`);

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
    console.error("Error fetching notes:", error);
    message.error("Failed to fetch notes");
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
    expired: "",
    keyword: "",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleEdit = (record) => {
  editingRecord.value = record;
  
  // Convert expire_at timestamp to expire string format
  let expireValue = "0";
  if (record.expire_at) {
    const now = Date.now();
    const expireTime = record.expire_at;
    const diff = expireTime - now;
    
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        expireValue = days === 1 ? "1 day" : days === 3 ? "3 days" : days === 7 ? "a week" : `${days} days`;
      } else if (hours > 0) {
        expireValue = hours === 1 ? "1 hour" : hours === 3 ? "3 hours" : hours === 6 ? "6 hours" : hours === 12 ? "12 hours" : `${hours} hours`;
      } else if (minutes > 0) {
        expireValue = minutes === 30 ? "30 minutes" : minutes === 5 ? "5 minutes" : `${minutes} minutes`;
      }
    }
  }
  
  formData.value = {
    title: record.title || "",
    content: record.content || "",
    partnerId: record.partner_id || "",
    expire: expireValue,
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
      expire: formData.value.expire,
    };

    if (formData.value.partnerId && formData.value.partnerId.trim()) {
      payload.partnerId = formData.value.partnerId.trim();
    }

    const res = await putData(`${apiLink.update_note}/${editingRecord.value.id}`, payload);

    if (res.status) {
      message.success(res.message || "Note updated successfully");
      modalVisible.value = false;
      fetchData();
    }
  } catch (error) {
    if (error.errorFields) {
      // Form validation error
      return;
    }
    console.error("Error saving note:", error);
    message.error("Failed to save note");
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
    partnerId: "",
    expire: "0",
  };
};

const handleDelete = async (noteId) => {
  try {
    const res = await deleteData(`${apiLink.delete_note}/${noteId}`);
    if (res.status) {
      message.success(res.message || "Note deleted successfully");
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    message.error("Failed to delete note");
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.note-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.note-header {
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

