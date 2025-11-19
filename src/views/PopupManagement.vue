<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.popup_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.popup_management_description }}
      </a-typography-text>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.post_range">
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="">{{ trlang.all }}</a-select-option>
                <a-select-option value="active">{{ trlang.active }}</a-select-option>
                <a-select-option value="inactive">{{ trlang.inactive }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword_filter">
              <a-input class="search-input" v-model:value="filters.keyword" :placeholder="trlang.search_placeholder" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="searchLoading" @click="handleFilterChange">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">{{ trlang.reset }}</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <div class="flex items-center justify-between mb-4">
      <span class="fs-4 font-semibold">{{ trlang.popup_list }}</span>
      <a-button type="primary" class="bg-main text-white" @click="handleCreate">
        {{ trlang.create_popup }}
      </a-button>
    </div>
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
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">
              {{ record.status === 'active' ? trlang.active : trlang.inactive }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'start_date'">
            {{ record.start_date ? formatDate(record.start_date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'end_date'">
            {{ record.end_date ? formatDate(record.end_date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">{{ trlang.edit }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete_popup"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger :loading="deleting">{{ trlang.delete }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-layout-content>

    <a-modal
      v-model:open="modalVisible"
      :title="editingRecord ? trlang.edit_popup : trlang.create_popup"
      :ok-text="trlang.save"
      :cancel-text="trlang.cancel"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="handleCancel"
      :width="900"
    >
      <a-form :model="formData" layout="vertical" ref="formRef">
        <a-form-item
          :label="trlang.title"
          name="title"
          :rules="[{ required: true, message: trlang.title_required }]"
        >
          <a-input v-model:value="formData.title" :placeholder="trlang.title_popup_placeholder" />
        </a-form-item>
        <a-form-item
          :label="trlang.content"
          name="content"
          :rules="[{ required: true, message: trlang.content_popup_required }]"
        >
          <a-textarea
            v-model:value="formData.content"
            :placeholder="trlang.content_popup_placeholder"
            :rows="6"
          />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.status">
              <a-select v-model:value="formData.status">
                <a-select-option value="active">{{ trlang.active }}</a-select-option>
                <a-select-option value="inactive">{{ trlang.inactive }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.display_order">
              <a-input-number v-model:value="formData.display_order" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :label="trlang.start_date">
              <a-date-picker
                v-model:value="formData.start_date"
                show-time
                style="width: 100%"
                :placeholder="trlang.select_start_date"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="trlang.end_date">
              <a-date-picker
                v-model:value="formData.end_date"
                show-time
                style="width: 100%"
                :placeholder="trlang.select_end_date"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-checkbox v-model:checked="formData.is_closable">
            {{ trlang.is_closable }}
          </a-checkbox>
        </a-form-item>
      </a-form>
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
const searchLoading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const modalVisible = ref(false);
const editingRecord = ref(null);
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
  is_closable: true,
});

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.title, dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 100 },
  { title: trlang.value.start_date, dataIndex: "start_date", key: "start_date", width: 180 },
  { title: trlang.value.end_date, dataIndex: "end_date", key: "end_date", width: 180 },
  { title: trlang.value.order, dataIndex: "display_order", key: "display_order", width: 80 },
  { title: trlang.value.actions, dataIndex: "actions", key: "actions", width: 200 },
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
      tableData.value = payload.list || [];
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
    message.error(trlang.value.failed_to_fetch_popups);
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
    is_closable: record.is_closable !== undefined ? record.is_closable : true,
  };
  modalVisible.value = true;
};

const handleSave = async () => {
  try {
    await formRef.value.validate();
    
    if (formData.value.start_date && formData.value.end_date) {
      if (formData.value.start_date.isAfter(formData.value.end_date)) {
        message.error(trlang.value.start_date_must_be_before_end_date);
        return;
      }
    }
    
    saving.value = true;

    const payload = {
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      status: formData.value.status,
      display_order: formData.value.display_order || 0,
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
      message.success(res.message || (editingRecord.value ? trlang.value.popup_updated_successfully : trlang.value.popup_created_successfully));
      modalVisible.value = false;
      fetchData();
    }
  } catch (error) {
    if (error.errorFields) {
      // Form validation error
      return;
    }
    console.error("Error saving popup:", error);
    message.error(trlang.value.failed_to_save_popup);
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
    is_closable: true,
  };
};

const handleDelete = async (popupId) => {
  deleting.value = true;
  try {
    const res = await deleteData(`${apiLink.delete_popup}/${popupId}`);
    if (res.status) {
      message.success(res.message || trlang.value.popup_deleted_successfully);
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting popup:", error);
    message.error(trlang.value.failed_to_delete_popup);
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>


