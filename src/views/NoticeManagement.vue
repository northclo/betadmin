<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.notice_management }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.notice_management_description }}
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
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.search_type">
              <a-select v-model:value="filters.searchType" allow-clear>
                <a-select-option value="title">{{ trlang.title }}</a-select-option>
                <a-select-option value="content">{{ trlang.content }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword_filter">
              <a-input class="search-input" v-model:value="filters.keyword" :placeholder="trlang.search_placeholder" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-select v-model:value="filters.partnerId" allow-clear :placeholder="trlang.all_partners">
                <a-select-option value="all">{{ trlang.all_partners }}</a-select-option>
                <a-select-option v-for="partner in partnerList" :key="partner.id" :value="partner.id">
                  {{ partner.nickname || partner.id }}
                </a-select-option>
              </a-select>
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
      <span class="fs-4 font-semibold">{{ trlang.notice_list }}</span>
      <a-button type="primary" class="bg-main text-white" @click="handleCreate">
        {{ trlang.add_notice_message }}
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
          <template v-else-if="column.dataIndex === 'partner'">
            {{ record.partner || trlang.all_partners }}
          </template>
          <template v-else-if="column.dataIndex === 'date'">
            {{ record.date ? formatDate(record.date) : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'actions'">
            <a-space>
              <a-button type="link" @click="handleEdit(record)">{{ trlang.edit }}</a-button>
              <a-popconfirm
                :title="trlang.confirm_delete"
                @confirm="handleDelete(record.id)"
                :ok-button-props="{ loading: deleting }"
              >
                <a-button type="link" danger>{{ trlang.delete }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-layout-content>

    <a-modal
      v-model:open="modalVisible"
      :title="editingRecord ? trlang.edit_notice_message : trlang.add_notice_message"
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
          <a-input v-model:value="formData.title" :placeholder="trlang.title_placeholder" />
        </a-form-item>
        <a-form-item
          :label="trlang.content"
          name="content"
          :rules="[{ required: true, message: trlang.content_required }]"
        >
          <a-textarea
            v-model:value="formData.content"
            :placeholder="trlang.content_placeholder"
            :rows="6"
          />
        </a-form-item>
        <a-form-item :label="trlang.choose_partner">
          <a-select 
            v-model:value="formData.partnerIds" 
            mode="multiple"
            allow-clear 
            :placeholder="trlang.choose_partner"
            style="width: 100%"
          >
            <a-select-option v-for="partner in partnerList" :key="partner.id" :value="partner.id">
              {{ partner.nickname || partner.id }}
            </a-select-option>
          </a-select>
          <a-typography-text type="danger" style="display: block; margin-top: 8px;">
            {{ trlang.if_not_choose_partner_then_all_partners }}
          </a-typography-text>
        </a-form-item>
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

defineOptions({ name: "NoticeManagementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const searchLoading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const modalVisible = ref(false);
const editingRecord = ref(null);
const formRef = ref(null);
const partnerList = ref([]);

const filters = ref({
  range: [dayjs().subtract(30, "day"), dayjs()],
  searchType: "title",
  keyword: "",
  partnerId: "",
});

const formData = ref({
  title: "",
  content: "",
  partnerIds: [],
  start_date: null,
  end_date: null,
});

const columns = computed(() => [
  { title: trlang.value.no_column, dataIndex: "no", key: "no", width: 80 },
  { title: trlang.value.title, dataIndex: "title", key: "title", ellipsis: true },
  { title: trlang.value.partner, dataIndex: "partner", key: "partner", width: 150 },
  { title: trlang.value.date, dataIndex: "date", key: "date", width: 180 },
  { title: trlang.value.actions, dataIndex: "actions", key: "actions", width: 200 },
]);

const tableData = ref([]);
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
};

const buildQuery = () => {
  const params = new URLSearchParams({
    page: paginationConfig.value.current.toString(),
    limit: paginationConfig.value.pageSize.toString(),
  });

  if (filters.value.searchType && filters.value.searchType.trim()) {
    params.append("searchType", filters.value.searchType.trim());
  }

  if (filters.value.keyword && filters.value.keyword.trim()) {
    params.append("keyword", filters.value.keyword.trim());
  }

  if (filters.value.partnerId && filters.value.partnerId !== "all" && filters.value.partnerId.trim()) {
    params.append("partnerId", filters.value.partnerId.trim());
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

const fetchPartnerList = async () => {
  try {
    const res = await getData(apiLink.get_game_partner);
    if (res.status && res.data) {
      const flattenPartners = (partner) => {
        const partners = [];
        if (partner && partner.id) {
          partners.push({
            id: partner.id,
            nickname: partner.nickname || partner.id,
          });
          if (partner.subs && Array.isArray(partner.subs)) {
            partner.subs.forEach(sub => {
              partners.push(...flattenPartners(sub));
            });
          }
        }
        return partners;
      };

      const allPartners = [];
      if (Array.isArray(res.data)) {
        res.data.forEach(partner => {
          allPartners.push(...flattenPartners(partner));
        });
      } else {
        allPartners.push(...flattenPartners(res.data));
      }

      partnerList.value = allPartners;
    } else {
      partnerList.value = [];
    }
  } catch (error) {
    console.error("Error fetching partner list:", error);
    partnerList.value = [];
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_notice_message_list}?${buildQuery()}`);

    if (res.status) {
      const payload = res.data || {};
      const items = payload.list || payload.items || [];
      
      tableData.value = items;
      
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
    console.error("Error fetching notices:", error);
    message.error(error.message || trlang.value.failed_to_fetch_notices);
    tableData.value = [];
    setTotal(0);
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
    searchType: "title",
    keyword: "",
    partnerId: "",
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleCreate = () => {
  editingRecord.value = null;
  formData.value = {
    title: "",
    content: "",
    partnerIds: [],
    start_date: null,
    end_date: null,
  };
  modalVisible.value = true;
};

const handleEdit = (record) => {
  editingRecord.value = record;
  formData.value = {
    title: record.title || "",
    content: record.content || "",
    partnerIds: record.partner_ids && Array.isArray(record.partner_ids) ? record.partner_ids : [],
    start_date: record.start_date ? dayjs(record.start_date) : null,
    end_date: record.end_date ? dayjs(record.end_date) : null,
  };
  modalVisible.value = true;
};

const handleSave = async () => {
  try {
    await formRef.value.validate();
    
    const hasStartDate = formData.value.start_date !== null && formData.value.start_date !== undefined;
    const hasEndDate = formData.value.end_date !== null && formData.value.end_date !== undefined;
    
    if ((hasStartDate && !hasEndDate) || (!hasStartDate && hasEndDate)) {
      message.error(trlang.value.both_start_and_end_date_required);
      return;
    }
    
    if (hasStartDate && hasEndDate) {
      if (formData.value.start_date.isAfter(formData.value.end_date)) {
        message.error(trlang.value.start_date_must_be_before_end_date);
        return;
      }
    }
    
    saving.value = true;

    const payload = {
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      partnerIds: formData.value.partnerIds && Array.isArray(formData.value.partnerIds) ? formData.value.partnerIds : [],
    };

    if (hasStartDate) {
      payload.start_date = dayjs(formData.value.start_date).toISOString();
    }
    
    if (hasEndDate) {
      payload.end_date = dayjs(formData.value.end_date).toISOString();
    }

    let res;
    if (editingRecord.value) {
      res = await putData(`${apiLink.update_notice_message}/${editingRecord.value.id}`, payload);
    } else {
      res = await postData(apiLink.create_notice_message, payload);
    }

    if (res.status) {
      message.success(res.message || (editingRecord.value ? trlang.value.notice_updated_successfully : trlang.value.notice_created_successfully));
      modalVisible.value = false;
      fetchData();
    } else {
      message.error(res.message || trlang.value.failed_to_save_notice);
    }
  } catch (error) {
    if (error.errorFields) {
      return;
    }
    console.error("Error saving notice:", error);
    message.error(error.message || trlang.value.failed_to_save_notice);
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
    partnerIds: [],
    start_date: null,
    end_date: null,
  };
};

const handleDelete = async (noticeId) => {
  deleting.value = true;
  try {
    const res = await deleteData(`${apiLink.delete_notice_message}/${noticeId}`);
    if (res.status) {
      message.success(res.message || trlang.value.notice_deleted_successfully);
      fetchData();
    } else {
      message.error(res.message || trlang.value.failed_to_delete_notice);
    }
  } catch (error) {
    console.error("Error deleting notice:", error);
    message.error(error.message || trlang.value.failed_to_delete_notice);
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchPartnerList();
  fetchData();
});
</script>

<style scoped>
.notice-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.notice-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

</style>

