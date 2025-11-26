<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.betting_list }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.duration">
              <a-range-picker
                v-model:value="filters.dateRange"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
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
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.include_sub_partners">
              <a-checkbox v-model:checked="filters.includeSubPartners" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-select
                v-model:value="filters.searchField"
                :options="searchFieldOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-input
                v-model:value="filters.search"
                :placeholder="trlang.search_placeholder"
                class="search-input"
                @press-enter="handleFilterChange"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.betting_status">
              <a-select
                v-model:value="filters.bettingStatus"
                :options="bettingStatusOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.sort">
              <a-select
                v-model:value="filters.sort"
                :options="sortOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-form-item class="mb-0">
              <a-space>
                <a-button type="primary" class="bg-main text-white" :loading="loading" @click="handleFilterChange">
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

    <div class="flex items-center justify-between mb-4">
      <span class="fs-4 font-semibold">{{ trlang.betting_list }}</span>
      <a-button 
        danger 
        :disabled="selectedRowKeys.length === 0 || bulkDeleteLoading"
        :loading="bulkDeleteLoading"
        @click="handleBulkDelete"
      >
        <template #icon><CloseOutlined /></template>
        {{ trlang.delete_selected_items }}
      </a-button>
    </div>

    <a-layout-content>
      <a-table
        :columns="bettingListColumn"
        :data-source="dataSource"
        :row-key="rowKey"
        :loading="loading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :expanded-row-keys="expandedRowKeys"
        class="w-100 table-transparent betting-list-table"
        :pagination="paginationConfig"
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
          <template v-if="column.key === 'user_id'">
            <a-typography-text>{{ record.user_nickname || '-' }}</a-typography-text>
          </template>
          <template v-if="column.key === 'partner'">
            <a-typography-text>{{ record.partner_nickname || '-' }}</a-typography-text>
          </template>
          <template v-if="column.key === 'round'">
            <a-typography-text>
              {{ formatRound(record.total_no, record.today_no) }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_history'">
            <a-typography-text>
              {{ formatBettingHistory(record) }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_rate'">
            <a-typography-text>
              {{ record.betting_rate ? record.betting_rate.toLocaleString() : '-' }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'bet_amount'">
            <a-typography-text class="text-main">
              {{ record.bet_amount ? record.bet_amount.toLocaleString() : 0 }}{{ trlang.global_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'win_amount'">
            <a-typography-text :class="(record.earning_amount || 0) > 0 ? 'text-red' : ''">
              {{ record.earning_amount ? record.earning_amount.toLocaleString() : 0 }}{{ trlang.global_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_time'">
            <a-typography-text>
              {{ formatBettingTime(record.createdAt) }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'result'">
            <a-tag :color="getResultColor(record)">
              {{ record.betting_status === 'CANCEL' ? trlang.cancel : (record.win ? trlang.win : trlang.lose) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'detail'">
            <a-button 
              type="primary" 
              size="small"
              @click.stop="handleViewDetail(record)"
            >
              {{ trlang.detail }}
            </a-button>
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <div class="betting-detail-expanded">
            <a-descriptions :column="4" bordered size="small" class="detail-descriptions">
              <a-descriptions-item :label="trlang.game_end_time" :span="2">
                {{ formatGameEndTime(record.game_start_time) }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.round_by_total_no" :span="2">
                {{ record.total_no || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.choose_betting_type" :span="2">
                {{ formatBettingType(record.betting_type) }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.betting_rate" :span="2">
                {{ record.betting_rate || '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.betting_time" :span="2">
                {{ formatBettingTime(record.createdAt) }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.bet_amount" :span="2">
                <a-typography-text class="text-main">
                  {{ record.bet_amount ? record.bet_amount.toLocaleString() : 0 }}
                </a-typography-text>
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.betting_rate" :span="2">
                {{ record.betting_rate ? record.betting_rate.toLocaleString() : '-' }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.win_amount" :span="2">
                <a-typography-text :class="(record.earning_amount || 0) > 0 ? 'text-red' : ''">
                  {{ record.earning_amount ? record.earning_amount.toLocaleString() : 0 }}
                </a-typography-text>
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.real_getting_amount" :span="2">
                {{ record.final_amount ? record.final_amount.toLocaleString() : 0 }}
              </a-descriptions-item>
              <a-descriptions-item :label="trlang.result" :span="2">
                <a-tag :color="getResultColor(record)">
                  {{ record.betting_status === 'CANCEL' ? trlang.cancel : (record.win ? trlang.win : trlang.no_win) }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>

            <div class="detail-footer mt-3">
              <a-typography-text>
                {{ record.user_nickname || '-' }} ({{ record.user_email || '-' }}) 
              </a-typography-text>
            </div>
          </div>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { bettingListColumn as baseBettingListColumn } from '@/utils/table-column/betting-list.js';
import { getData, postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.betting_list.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  dateRange: null,
  partnerId: null,
  includeSubPartners: false,
  bettingStatus: '',
  search: '',
  searchField: '',
  sort: '',
});

const partnerTreeOptions = ref([]);
const bettingStatusOptions = ref([]);
const searchFieldOptions = ref([]);
const sortOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);
const bulkDeleteLoading = ref(false);
const selectedRowKeys = ref([]);
const expandedRowKeys = ref([]);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const bettingListColumn = computed(() => baseBettingListColumn.map(col => ({
  ...col,
  title: trlang.value[col.titleKey] || col.titleKey
})));

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

const initOptions = () => {
  bettingStatusOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'WAIT', label: trlang.value.wait },
    { value: 'PROGRESS', label: trlang.value.progress },
    { value: 'COMPLETE', label: trlang.value.complete },
    { value: 'CANCEL', label: trlang.value.cancel },
  ];
  filters.value.searchField = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.user_id },
    { value: 'all_rounds', label: trlang.value.all_rounds },
  ];
  filters.value.sort = 'created_date:desc';
  sortOptions.value = [
    { value: 'created_date:desc', label: trlang.value.by_date },
    { value: 'bet_amount:desc', label: trlang.value.by_betting_amount },
    { value: 'earning_amount:desc', label: trlang.value.by_win_account },
  ];
};

const rowKey = (record) => record.betting_id || record._id;

const buildQuery = () => {
  const params = new URLSearchParams({
    bettingStatus: filters.value.bettingStatus || '',
    searchField: filters.value.searchField || '',
    search: filters.value.search || '',
    sort: filters.value.sort || '',
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  const range = filters.value.dateRange;
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

  if (filters.value.partnerId) {
    params.set('partnerId', filters.value.partnerId);
  }

  if (filters.value.includeSubPartners) {
    params.set('includeSubPartners', 'true');
  }

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(
      `${apiLink.get_betting_list}?${buildQuery()}`
    );

    if (res.status) {
      const payload = res.data || {};
      dataSource.value = payload.list || [];
      setTotal(payload.total || 0);
      if (payload.page) {
        paginationConfig.value.current = payload.page;
      }
      if (payload.pageSize) {
        paginationConfig.value.pageSize = payload.pageSize;
      }
    }
  } catch (error) {
    console.error("Error fetching betting list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
  } finally {
    loading.value = false;
  }
};

const validateDateRange = () => {
  const range = filters.value.dateRange;
  if (range && Array.isArray(range) && range.length === 2) {
    const start = dayjs.isDayjs(range[0]) ? range[0] : dayjs(range[0]);
    const end = dayjs.isDayjs(range[1]) ? range[1] : dayjs(range[1]);
    if (start.isAfter(end)) {
      message.error(trlang.value.end_date_must_be_after_start_date);
      return false;
    }
  }
  return true;
};

const handleFilterChange = () => {
  if (!validateDateRange()) {
    return;
  }
  paginationConfig.value.current = 1;
  fetchData();
};

const resetFilters = () => {
  filters.value = {
    dateRange: null,
    partnerId: null,
    includeSubPartners: false,
    bettingStatus: '',
    search: '',
    searchField: 'user_id',
    sort: 'created_date:desc',
  };
  paginationConfig.value.current = 1;
  selectedRowKeys.value = [];
  fetchData();
};

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const formatBettingHistory = (record) => {
  if (!record.betting_type) return '-';
  
  const bettingType = record.betting_type;
  const winStatus = record.win ? trlang.value.win : trlang.value.no_win;
  
  let formattedType = bettingType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('+');
  
  return `${formattedType}-${winStatus}`;
};

const formatBettingTime = (dateString) => {
  if (!dateString) return '-';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

const formatRound = (totalNo, todayNo) => {
  if (totalNo === null && todayNo === null) return '-';
  if (totalNo !== null && todayNo !== null) {
    return `${totalNo} / ${todayNo}`;
  }
  if (totalNo !== null) return `${totalNo}`;
  if (todayNo !== null) return `${todayNo}`;
  return '-';
};

const handleViewDetail = (record) => {
  const key = rowKey(record);
  const currentKeys = [...expandedRowKeys.value];
  const index = currentKeys.indexOf(key);
  
  if (index > -1) {
    currentKeys.splice(index, 1);
  } else {
    currentKeys.push(key);
  }
  
  expandedRowKeys.value = currentKeys;
};

const formatGameEndTime = (dateString) => {
  if (!dateString) return '-';
  return dayjs(dateString).format('MM/DD(ddd) HH:mm');
};

const formatBettingType = (bettingType) => {
  if (!bettingType) return '-';
  return bettingType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('+');
};

const getResultColor = (record) => {
  if (record.betting_status === 'CANCEL') return 'default';
  return record.win ? 'success' : 'error';
};

const handleBulkDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.error(trlang.value.please_select_items_to_delete);
    return;
  }

  bulkDeleteLoading.value = true;
  try {
    const res = await postData(`${apiLink.bulk_delete_betting_list}`, {
      ids: selectedRowKeys.value,
    });

    if (res.status) {
      message.success(res.message || trlang.value.successfully_deleted_items.replace('{count}', selectedRowKeys.value.length.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
  } catch (error) {
    console.error("Error bulk deleting betting records:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    bulkDeleteLoading.value = false;
  }
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

onMounted(() => {
  initOptions();
  fetchPartnerList();
  fetchData();
});
</script>

<style scoped>
.betting-detail-expanded {
  padding: 16px;
  background-color: #fafafa;
}

.detail-descriptions {
  background-color: #fff;
}

.detail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
}
</style>