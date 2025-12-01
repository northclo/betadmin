<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.announcement }}
      </a-typography-title>
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
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.category">
              <a-select v-model:value="filters.category" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="system_notice">{{ trlang.system_notice }}</a-select-option>
                <a-select-option value="maintenance">{{ trlang.maintenance }}</a-select-option>
                <a-select-option value="event">{{ trlang.event }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="draft">{{ trlang.draft }}</a-select-option>
                <a-select-option value="published">{{ trlang.published }}</a-select-option>
                <a-select-option value="archived">{{ trlang.archived }}</a-select-option>
                <a-select-option value="hidden">{{ trlang.hidden }}</a-select-option>
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
      <span class="fs-4 font-semibold">{{ trlang.announcement_list }}</span>
      <a-button type="primary" class="bg-main text-white" @click="handleCreate">
        {{ trlang.create_announcement }}
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
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>
          <template v-else-if="column.dataIndex === 'category'">
            <a-tag :color="categoryColor(record.category)">
              {{ trlang[record.category] || record.category }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusColor(record.status)">
              {{ trlang[record.status] || record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'date'">
            {{ record.date ? formatDate(record.date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-button type="link" @click="handleEdit(record)">{{ trlang.edit }}</a-button>
          </template>
        </template>
      </a-table>
    </a-layout-content>

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
          :rules="[{ required: true, message: trlang.title_required }]"
        >
          <a-input v-model:value="formData.title" :placeholder="trlang.title_announcement_placeholder" />
        </a-form-item>
        <a-form-item
          :label="trlang.description"
          name="description"
          :rules="[{ required: true, message: trlang.description_required }]"
        >
          <a-textarea
            v-model:value="formData.description"
            :placeholder="trlang.description_announcement_placeholder"
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
                <a-select-option value="draft">{{ trlang.draft }}</a-select-option>
                <a-select-option value="published">{{ trlang.published }}</a-select-option>
                <a-select-option value="archived">{{ trlang.archived }}</a-select-option>
                <a-select-option value="hidden">{{ trlang.hidden }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { getData, postData, putData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "AnnouncementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const searchLoading = ref(false);
const saving = ref(false);
const modalVisible = ref(false);
const editingRecord = ref(null);
const formRef = ref(null);

const filters = ref({
  range: null,
  category: "all",
  status: "all",
  keyword: "",
});

const formData = ref({
  title: "",
  description: "",
  category: "system_notice",
  status: "draft",
});

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.title, dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.category, dataIndex: "category", key: "category", width: 140 },
  { title: trlang.value.author, dataIndex: "author", key: "author", width: 160 },
  { title: trlang.value.date, dataIndex: "date", key: "date", width: 180 },
  { title: trlang.value.status, dataIndex: "status", key: "status", width: 140 },
  { title: trlang.value.actions, dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, setTotal } = usePagination(10);

const handleTableChange = (pagination) => {
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
  fetchData();
};

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

  if (filters.value.status && filters.value.status !== "all") {
    params.append("status", filters.value.status);
  }

  if (filters.value.keyword && filters.value.keyword.trim()) {
    params.append("keyword", filters.value.keyword.trim());
  }

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

const resetFilters = () => {
  filters.value = {
    range: null,
    category: "all",
    status: "all",
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
  };
  modalVisible.value = true;
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
    };

    let res;
    if (editingRecord.value) {
      res = await putData(`${apiLink.update_announcement}/${editingRecord.value.id}`, payload);
    } else {
      res = await postData(apiLink.create_announcement, payload);
    }

    if (res.status) {
      message.success(res.message || (editingRecord.value ? trlang.value.announcement_updated_successfully : trlang.value.announcement_created_successfully));
      modalVisible.value = false;
      fetchData();
    }
  } catch (error) {
    console.error("Error saving announcement:", error);
    message.error(error.message || trlang.value.operation_failed);
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
  };
};

onMounted(() => {
  fetchData();
});
</script>
