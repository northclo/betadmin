<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.charging_management }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.request_range">
              <a-range-picker 
                v-model:value="filters.range" 
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="[trlang.start_date, trlang.end_date]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.request_status">
              <a-select v-model:value="filters.status" allow-clear>
                <a-select-option value="all">{{ trlang.all }}</a-select-option>
                <a-select-option value="pending">{{ trlang.pending }}</a-select-option>
                <a-select-option value="completed">{{ trlang.completed }}</a-select-option>
                <a-select-option value="cancelled">{{ trlang.cancelled }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-select v-model:value="filters.keywordType" allow-clear>
                <a-select-option value="user_nickname">{{ trlang.nickname }}</a-select-option>
                <a-select-option value="user_id">{{ trlang.id }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-input
                v-model:value="filters.keyword"
                class="search-input"
                :placeholder="trlang.search_placeholder"
                allow-clear
                @press-enter="handleFilterChange"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-tree-select
                v-model:value="filters.partnerId"
                :tree-data="partnerTreeOptions"
                :placeholder="trlang.select_partner"
                allow-clear
                tree-default-expand-all
                :field-names="{ children: 'children', label: 'title', value: 'value' }"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.include_sub_partners">
              <a-checkbox v-model:checked="filters.includeSubPartners" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-form-item class="mb-0">
              <a-space>
                <a-button type="primary" class="bg-main text-white" :loading="searchLoading" @click="handleFilterChange">
                  {{ trlang.search }}
                </a-button>
                <a-button @click="resetFilters">
                  {{ trlang.reset }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

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
          <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
        </template>
        <template v-else-if="column.dataIndex === 'user_id'">
          <div>
            <div>{{ record.user_nickname || '-' }}</div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'amount'">
          {{ record.amount }}{{ trlang.global_currency }}
        </template>
        <template v-else-if="column.dataIndex === 'account_amount'">
          {{ record.account_amount ? record.account_amount.toLocaleString() : 0 }}{{ trlang.global_currency }}
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="statusColor(record.status)">{{ trlang[record.status] || record.status }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'comment'">
          <div v-if="editingCommentId !== record._id" @dblclick="handleCommentDoubleClick(record)" style="cursor: pointer; min-height: 24px;">
            {{ record.comment || '' }}
          </div>
          <div 
            v-else 
            :ref="el => { if (el) commentInputRefs[record._id] = el; }"
            style="display: flex; gap: 8px; align-items: center;"
            @click.stop
          >
            <a-input
              v-model:value="editingCommentValue"
              :placeholder="trlang.comment"
              @press-enter="handleCommentSubmit(record)"
              style="flex: 1;"
              @click.stop
            />
            <a-button
              type="primary"
              size="small"
              :loading="commentLoading[record._id]"
              @click.stop="handleCommentSubmit(record)"
            >
              {{ trlang.edit }}
            </a-button>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
            <a-space>
              <a-button 
                v-if="record.status === 'pending'"
                type="primary" 
                size="small"
                :loading="actionLoading[record._id || record.id] === 'approve'"
                :disabled="actionLoading[record._id || record.id] !== undefined"
                @click="handleAction(record, 'approve')"
              >
                {{ trlang.approve }}
              </a-button>
              <a-button 
                v-if="record.status === 'pending'"
                danger 
                size="small"
                :loading="actionLoading[record._id || record.id] === 'reject'"
                :disabled="actionLoading[record._id || record.id] !== undefined"
                @click="handleAction(record, 'reject')"
              >
                {{ trlang.reject }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { computed, inject, ref, onMounted, onBeforeUnmount } from "vue";
import { message } from "ant-design-vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { getData, postData, putData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

defineOptions({ name: "ChargingManagementView" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const searchLoading = ref(false);
const actionLoading = ref({});
const editingCommentId = ref(null);
const editingCommentValue = ref("");
const commentLoading = ref({});
const commentInputRefs = ref({});
const partnerTreeOptions = ref([]);
const filters = ref({
  range: null,
  status: "all",
  keywordType: "user_nickname",
  keyword: "",
  partnerId: null,
  includeSubPartners: false,
});

const columns = computed(() => [
  { title: trlang.value.no_column, key: "no", width: 80 },
  { title: trlang.value.user_id, dataIndex: "user_id", key: "user_id" },
  { title: trlang.value.request_amount, dataIndex: "amount", key: "amount" },
  { title: trlang.value.request_username, dataIndex: "member_nickname", key: "member_nickname" },
  { title: trlang.value.status, dataIndex: "status", key: "status" },
  { title: trlang.value.request_date, dataIndex: "submitted_at", key: "submitted_at" },
  { title: trlang.value.process_date, dataIndex: "processed_at", key: "processed_at" },
  { title: trlang.value.account_amount, dataIndex: "account_amount", key: "account_amount" },
  { title: trlang.value.comment, dataIndex: "comment", key: "comment" },
  { title: trlang.value.action, dataIndex: "action", key: "action" },
]);

const tableData = ref([]);
const { paginationConfig, setTotal } = usePagination(10);

const handleTableChange = (pagination) => {
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
  fetchData();
};

const statusColor = (status) => {
  switch (status) {
    case "completed":
      return "green";
    case "pending":
      return "gold";
    case "cancelled":
      return "red";
    default:
      return "blue";
  }
};

const convertPartnerToTree = (partner) => {
  if (!partner || !partner.id) return null;
  
  const node = {
    title: `${partner.nickname} (${partner.partner_id || partner.id})`,
    value: partner.id,
    children: []
  };

  if (partner.subs && Array.isArray(partner.subs) && partner.subs.length > 0) {
    node.children = partner.subs
      .map(sub => convertPartnerToTree(sub))
      .filter(Boolean);
  }

  return node;
};

const fetchPartnerList = async () => {
  try {
    const res = await getData(apiLink.get_game_partner);
    if (res.status && res.data) {
      if (Array.isArray(res.data)) {
        partnerTreeOptions.value = res.data
          .map(partner => convertPartnerToTree(partner))
          .filter(Boolean);
      } else if (res.data.id) {
        const tree = convertPartnerToTree(res.data);
        partnerTreeOptions.value = tree ? [tree] : [];
      } else {
        partnerTreeOptions.value = [];
      }
    } else {
      partnerTreeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching partner list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    partnerTreeOptions.value = [];
  }
};

const buildQuery = () => {
  const params = new URLSearchParams({
    status: filters.value.status || "all",
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

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

  if (filters.value.keywordType && filters.value.keyword && filters.value.keyword.trim()) {
    params.set('keywordType', filters.value.keywordType);
    params.set('keyword', filters.value.keyword.trim());
  }

  if (filters.value.partnerId) {
    params.set('partnerId', filters.value.partnerId);
    if (filters.value.includeSubPartners) {
      params.set('includeSubPartners', 'true');
    }
  }

  return params.toString();
};


const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(`${apiLink.get_charging_list}?${buildQuery()}`);

    if (res.status) {
      const payload = res.data || {};
      tableData.value = payload.list || [];
      setTotal(payload.total || 0);
    }
  } catch (error) {
    console.error("Error fetching charging list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
  } finally {
    loading.value = false;
  }
};

const handleAction = async (record, action) => {
  const recordId = record._id || record.id;
  const transactionId = record._id || record.id?.replace("REQ-", "");

  if (!transactionId) {
    message.error(trlang.value.transaction_id_not_found);
    return;
  }

  actionLoading.value[recordId] = action;

  try {
    const res = await postData(apiLink.update_charging_status, {
      transactionId,
      action,
    });

    if (res.status) {
      const successMessage = res.message || (action === "approve" ? trlang.value.transaction_approved_successfully : trlang.value.transaction_rejected_successfully);
      message.success(successMessage);
      await fetchData();
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    delete actionLoading.value[recordId];
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
    status: "all",
    keywordType: "user_nickname",
    keyword: "",
    partnerId: null,
    includeSubPartners: false,
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const handleCommentDoubleClick = (record) => {
  editingCommentId.value = record._id;
  editingCommentValue.value = record.comment || "";
};

const handleCommentCancel = () => {
  editingCommentId.value = null;
  editingCommentValue.value = "";
};

const handleCommentSubmit = async (record) => {
  const transactionId = record._id || record.id?.replace("REQ-", "");
  
  if (!transactionId) {
    message.error(trlang.value.transaction_id_not_found);
    handleCommentCancel();
    return;
  }

  commentLoading.value[record._id] = true;
  
  try {
    const res = await putData(`${apiLink.update_charging_comment}/${transactionId}/comment`, {
      comment: editingCommentValue.value,
    });

    if (res.status) {
      message.success(res.message || trlang.value.comment_updated_successfully);
      record.comment = editingCommentValue.value || null;
      editingCommentId.value = null;
      editingCommentValue.value = "";
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    delete commentLoading.value[record._id];
  }
};

const handleClickOutside = (event) => {
  if (editingCommentId.value) {
    const inputContainer = commentInputRefs.value[editingCommentId.value];
    if (inputContainer && !inputContainer.contains(event.target)) {
      handleCommentCancel();
    }
  }
};

onMounted(() => {
  fetchPartnerList();
  fetchData();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

