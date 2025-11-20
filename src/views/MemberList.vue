<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.member_list }}
      </a-typography-title>
    </div>
    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="5">
            <a-form-item class="mb-0" :label="trlang.duration">
              <a-select
                v-model:value="duration"
                :options="durationOptions"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.date_range">
              <a-range-picker
                v-model:value="filters.range"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.user_status">
              <a-select
                v-model:value="userStatus"
                :options="userStatusOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-select
                v-model:value="partner"
                :options="partnerOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-select
                v-model:value="searchField"
                :options="searchFieldOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.search_placeholder">
              <a-input
                v-model:value="search"
                class="search-input"
                :placeholder="trlang.search_placeholder"
                @press-enter="handleFilterChange"
              >
                <template #prefix>
                  <SearchOutlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.sort">
              <a-select
                v-model:value="sort"
                :options="sortOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-form-item class="mb-0">
              <a-space>
                <a-button type="primary" class="bg-main text-white" :loading="loadingSearch" @click="handleFilterChange">
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

    <div class="status-summary-bar flex items-center gap-4 mb-4">
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('')"
      >
        <SmileOutlined class="text-gray-500" />
        <span class="text-sm">
          {{ trlang.all_users }} :
          <span class="font-bold text-blue-600">{{ statusCounts.all }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('normal')"
      >
        <CheckCircleOutlined class="text-green-600" />
        <span class="text-sm">
          {{ trlang.normal }} :
          <span class="font-bold text-green-600">{{ statusCounts.normal }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('wait')"
      >
        <MinusCircleOutlined class="text-gray-500" />
        <span class="text-sm">
          {{ trlang.wait }} :
          <span class="font-bold text-gray-500">{{ statusCounts.wait }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('stop')"
      >
        <QuestionCircleOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.stop }} :
          <span class="font-bold text-red-600">{{ statusCounts.stop }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('cancel')"
      >
        <CloseCircleOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.cancel }} :
          <span class="font-bold text-red-600">{{ statusCounts.cancel }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('danger')"
      >
        <UserDeleteOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.danger }} :
          <span class="font-bold text-red-600">{{ statusCounts.danger }}</span>
          {{ trlang.ppl }}
        </span>
      </div>
      <div class="flex-1" />
      <a-button
        class="bg-gray-200 text-gray-700 border-none"
        @click="handleBlockIps"
      >
        {{ trlang.block_ips }}
      </a-button>
    </div>

    <div class="table-wrapper">
      <a-table
        :columns="memberListColumn"
        :data-source="dataSource"
        :row-key="rowKey"
        class="w-100 table-transparent"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined"
        :pagination="paginationConfig"
        @change="handleTableChange"
        :row-selection="rowSelection"
        :loading="loading"
      >
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ index + 1 }}</a-typography-text>
          </template>
          <template v-if="column.key === 'login'">
            <div
              class="flex items-center gap-2"
              :class="record.login_status ? '' : 'text-light-gray'"
            >
              <LogoutOutlined />
              <a-typography-text>
                {{
                  record.login_status ? trlang.connected : trlang.no_connected
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'nickname'">
            <div class="flex flex-column">
              <a-typography-text>
                <span class="font-bold">
                  {{
                    record.partners?.[0]?.nickname ||
                    record.user_nickname ||
                    '-'
                  }}
                </span>
                ({{
                  record.partners?.[0]?.partner_id ||
                  record.user_nickname ||
                  '-'
                }})
              </a-typography-text>
              <a-typography-text
                v-if="record.partners?.[0]?.role"
                class="filter-badge px-2 py-1 w-fit"
              >
                {{
                  trlang[record.partners?.[0]?.role] || ''
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'partner'">
            {{
              record.partners?.[0]?.nickname ||
              '-'
            }}
          </template>
          <template v-if="column.key === 'status'">
            {{ trlang[record.user_status] }}
          </template>
          <template v-if="column.key === 'owned_money'">
            <div class="flex flex-column">
              <a-typography-text class="text-red">
                {{ (record.own_money || 0).toLocaleString() }}{{ trlang.usd_currency }}
              </a-typography-text>
              <a-typography-text>
                {{ (record.point || 0).toLocaleString() }}{{ trlang.points_unit }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'all_import_money'">
            {{
              record.totalImportAmount
                ? record.totalImportAmount.toLocaleString()
                : 0
            }}{{ trlang.usd_currency }}
          </template>
          <template v-if="column.key === 'all_exchange_money'">
            {{
              record.totalExchangeAmount
                ? record.totalExchangeAmount.toLocaleString()
                : 0
            }}{{ trlang.usd_currency }}
          </template>
          <template v-if="column.key === 'partner_earning'">
            {{
              record.totalPartnerEarning
                ? record.totalPartnerEarning.toLocaleString()
                : 0
            }}{{ trlang.usd_currency }}
          </template>
          <template v-if="column.key === 'total_betting_amount'">
            <a-typography-text class="text-main">
              {{
                record.totalBettingAmount
                  ? record.totalBettingAmount.toLocaleString()
                  : 0
              }}{{ trlang.usd_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'total_win_number'">
            <a-typography-text class="text-red">
              {{ record.totalWinCount ? record.totalWinCount : 0 }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'total_earning_money'">
            <a-typography-text class="text-dark-main">
              {{
                record.totalEarningAmount
                  ? record.totalEarningAmount.toLocaleString()
                  : 0
              }}{{ trlang.usd_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_provide_point'">
            {{ (record.point || 0).toLocaleString() }}{{ trlang.points_unit }}
          </template>
          <template v-if="column.key === 'last_import_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ formatDate(record.last_import_time).date }}
              </a-typography-text>
              <a-typography-text>
                {{ formatDate(record.last_import_time).time }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'connect_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ formatDate(record.login_history?.createdAt).date }}
              </a-typography-text>
              <a-typography-text>
                {{ formatDate(record.login_history?.createdAt).time }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ formatDate(record.createdAt).date }}
              </a-typography-text>
              <a-typography-text>
                {{ formatDate(record.createdAt).time }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'actions'">
            <a-button
              type="primary"
              size="small"
              @click="handleEdit(record)"
            >
              <template #icon><EditOutlined /></template>
              {{ trlang.edit }}
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </a-layout>

  <a-modal
    v-model:open="editModalVisible"
    :title="trlang.edit_user"
    @ok="handleSaveEdit"
    @cancel="handleCancelEdit"
    :confirm-loading="loadingEdit"
  >
    <a-form :model="editForm" layout="vertical">
      <a-form-item :label="trlang.user_status">
        <a-select
          v-model:value="editForm.user_status"
          :options="userStatusOptions"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="blockIpModalVisible"
    :title="trlang.block_ip"
    :footer="null"
    width="800px"
    @cancel="handleCloseBlockIpModal"
  >
    <div>
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <p class="text-lg font-semibold">{{ trlang.register_blocking_ip }}</p>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <a-typography-text class="min-w-[120px]">{{ trlang.blocking_ip }}</a-typography-text>
          <a-input
            v-model:value="newBlockedIp"
            :placeholder="trlang.enter_ip_address"
            class="flex-1"
            @press-enter="handleRegisterIp"
          />
          <a-button
            type="primary"
            class="bg-gray-200 text-gray-700 border-none"
            @click="handleRegisterIp"
            :loading="loadingRegisterIp"
          >
            <template #icon><CheckOutlined /></template>
            {{ trlang.register }}
          </a-button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <p class="text-lg font-semibold">{{ trlang.blocked_ip_list }}</p>
        </div>
        <a-table
          :columns="blockedIpColumns"
          :data-source="blockedIpList"
          :pagination="{ pageSize: 10 }"
          :loading="loadingBlockedIps"
          row-key="id"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'no'">
              <a-typography-text>{{ index + 1 }}</a-typography-text>
            </template>
            <template v-if="column.key === 'ip'">
              {{ record.ip_address }}
            </template>
            <template v-if="column.key === 'registration_date'">
              {{ formatRegistrationDate(record.registration_date) }}
            </template>
            <template v-if="column.key === 'remove'">
              <a-button
                class="bg-gray-200 text-gray-700 border-none"
                @click="handleRemoveIp(record.id)"
                :loading="loadingRemoveIp[record.id]"
              >
                <template #icon><CheckOutlined /></template>
                {{ trlang.remove }}
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <div class="flex justify-center mt-4">
        <a-button
          class="bg-gray-200 text-gray-700 border-none"
          @click="handleCloseBlockIpModal"
        >
          <template #icon><CloseOutlined /></template>
          {{ trlang.close }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import {
  SearchOutlined,
  LogoutOutlined,
  SmileOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined,
  UserDeleteOutlined,
  RightOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { memberListColumn as baseMemberListColumn } from '@/utils/table-column/member-list.js';
import { getData, putData, deleteData, postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.member_list.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  range: null,
});

const duration = ref('');
const durationOptions = ref([]);
const userStatus = ref('');
const userStatusOptions = ref([]);
const partner = ref('');
const partnerOptions = ref([]);
const search = ref('');
const searchField = ref('');
const searchFieldOptions = ref([]);
const sort = ref('');
const sortOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);
const selectedRowKeys = ref([]);
const statusCounts = ref({
  all: 0,
  normal: 0,
  wait: 0,
  stop: 0,
  cancel: 0,
  danger: 0,
  tester: 0,
});

const blockIpModalVisible = ref(false);
const newBlockedIp = ref('');
const blockedIpList = ref([]);
const loadingBlockedIps = ref(false);
const loadingSearch = ref(false);
const loadingRegisterIp = ref(false);
const loadingRemoveIp = ref({});
const editModalVisible = ref(false);
const editForm = ref({
  _id: null,
  user_status: '',
});
const loadingEdit = ref(false);

const blockedIpColumns = computed(() => [
  {
    title: trlang.value.no_column,
    dataIndex: 'no',
    key: 'no',
    width: 80,
    align: 'center',
  },
  {
    title: trlang.value.ip,
    dataIndex: 'ip_address',
    key: 'ip',
  },
  {
    title: trlang.value.registration_date,
    dataIndex: 'registration_date',
    key: 'registration_date',
  },
  {
    title: trlang.value.remove,
    key: 'remove',
    align: 'center',
  },
]);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const memberListColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "Login": trlang.value.login_column,
    "Nickname(Id)": trlang.value.nickname_id,
    "Partner": trlang.value.partner_column,
    "Status": trlang.value.status_column,
    "Owned Money": trlang.value.owned_money,
    "All Import Money": trlang.value.all_import_money,
    "All Exchange Money": trlang.value.all_exchange_money,
    "Partner Earning": trlang.value.partner_earning,
    "Total Betting Amount": trlang.value.total_betting_amount,
    "Total Win Number": trlang.value.total_win_number,
    "Total Earning Money": trlang.value.total_earning_money,
    "Betting Provide Point": trlang.value.betting_provide_point,
    "Last Import Date": trlang.value.last_import_date,
    "Connect Date": trlang.value.connect_date,
    "Created Date": trlang.value.created_date,
    "Actions": trlang.value.actions,
  };
  return baseMemberListColumn.map(col => ({
    ...col,
    title: titleMap[col.title] || col.title
  }));
});

const initOptions = () => {
  duration.value = 'import_exchange_betting';
  durationOptions.value = [
    {
      value: 'import_exchange_betting',
      label: trlang.value.import_exchange_betting,
    },
    { value: 'created_date', label: trlang.value.created_date },
    { value: 'connected_date', label: trlang.value.connected_date },
    { value: 'last_import_date', label: trlang.value.last_import_date },
    {
      value: 'password_changed_date',
      label: trlang.value.password_changed_date,
    },
  ];
  userStatusOptions.value = [
    { value: 'wait', label: trlang.value.wait },
    { value: 'normal', label: trlang.value.normal },
    { value: 'stop', label: trlang.value.stop },
    { value: 'cancel', label: trlang.value.cancel },
    { value: 'danger', label: trlang.value.danger },
    { value: 'tester', label: trlang.value.tester },
  ];
  partnerOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'headquater', label: trlang.value.headquater },
    { value: 'branch_office', label: trlang.value.branch_office },
    { value: 'regional_office', label: trlang.value.regional_office },
    { value: 'agency', label: trlang.value.agency },
    { value: 'distributor', label: trlang.value.distributor },
    { value: 'store', label: trlang.value.store },
  ];
  searchField.value = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.id },
    { value: 'user_nickname', label: trlang.value.nickname },
    { value: 'memo', label: trlang.value.memo },
    { value: 'bank_owner', label: trlang.value.bank_owner },
    { value: 'phone_number', label: trlang.value.phone_number },
    { value: 'bank_account', label: trlang.value.bank_account },
    { value: 'recommended_user', label: trlang.value.recommended_user },
    { value: 'cash_remained_over', label: trlang.value.cash_remained_over },
    { value: 'cash_remained_under', label: trlang.value.cash_remained_under },
  ];
  sort.value = 'created_date';
  sortOptions.value = [
    { value: 'created_date', label: trlang.value.created_date },
    { value: 'owned_money', label: trlang.value.owned_money },
    { value: 'owned_point', label: trlang.value.owned_point },
    { value: 'connect_date', label: trlang.value.connect_date },
    { value: 'import_money', label: trlang.value.import_money },
    { value: 'exchange_money', label: trlang.value.exchange_money },
  ];
};

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
}));

const rowKey = (record) => record.user_id;

const formatDate = (dateValue) => {
  if (!dateValue) return { date: '-', time: '-' };
  const dateStr = typeof dateValue === 'string' ? dateValue : dateValue.toString();
  if (!dateStr.includes('T')) return { date: dateStr, time: '-' };
  const [date, timePart] = dateStr.split('T');
  const time = timePart ? timePart.split('.')[0] : '-';
  return { date, time };
};

const formatRegistrationDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const buildQuery = () => {
  const sortValue = sort.value || 'created_date';
  const formattedSort = sortValue.includes(':') ? sortValue : `${sortValue}:desc`;
  
  const params = new URLSearchParams({
    duration: duration.value || '',
    userStatus: userStatus.value || '',
    partner: partner.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
    sort: formattedSort,
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

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(
      `${apiLink.member_list}?${buildQuery()}`
    );

    if (res && res.status) {
      const payload = res.data || {};
      dataSource.value = Array.isArray(payload.list) ? payload.list : [];
      setTotal(typeof payload.total === 'number' ? payload.total : 0);
      if (typeof payload.page === 'number' && payload.page > 0) {
        paginationConfig.value.current = payload.page;
      }
      if (typeof payload.pageSize === 'number' && payload.pageSize > 0) {
        paginationConfig.value.pageSize = payload.pageSize;
      }
      if (payload.statusCounts) {
        statusCounts.value = {
          all: payload.statusCounts.all || 0,
          normal: payload.statusCounts.normal || 0,
          wait: payload.statusCounts.wait || 0,
          stop: payload.statusCounts.stop || 0,
          cancel: payload.statusCounts.cancel || 0,
          danger: payload.statusCounts.danger || 0,
          tester: payload.statusCounts.tester || 0,
        };
      }
    } else {
      dataSource.value = [];
      setTotal(0);
      statusCounts.value = {
        all: 0,
        normal: 0,
        wait: 0,
        stop: 0,
        cancel: 0,
        danger: 0,
        tester: 0,
      };
    }
  } catch (error) {
    console.error('Error fetching member list:', error);
    dataSource.value = [];
    setTotal(0);
    const errorMessage = error?.response?.data?.message || error?.message || trlang.value.error_loading_data;
    message.error(errorMessage || trlang.value.error_loading_data);
  } finally {
    loading.value = false;
  }
};

const validateDateRange = () => {
  const range = filters.value.range;
  if (range && Array.isArray(range) && range.length === 2) {
    const [start, end] = range;
    if (start && end) {
      const startDate = dayjs.isDayjs(start) ? start : dayjs(start);
      const endDate = dayjs.isDayjs(end) ? end : dayjs(end);
      if (startDate.isAfter(endDate)) {
        message.warning(trlang.value.end_date_must_be_after_start_date);
        return false;
      }
    }
  }
  return true;
};

const handleFilterChange = async () => {
  if (!validateDateRange()) {
    return;
  }
  loadingSearch.value = true;
  paginationConfig.value.current = 1;
  try {
    await fetchData();
  } finally {
    loadingSearch.value = false;
  }
};

const resetFilters = () => {
  duration.value = 'import_exchange_betting';
  filters.value.range = null;
  userStatus.value = '';
  partner.value = '';
  search.value = '';
  searchField.value = 'user_id';
  sort.value = 'created_date';
  paginationConfig.value.current = 1;
  fetchData();
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

const handleStatusClick = (status) => {
  userStatus.value = status;
  paginationConfig.value.current = 1;
  fetchData();
};

const handleBlockIps = async () => {
  blockIpModalVisible.value = true;
  await fetchBlockedIps();
};

const fetchBlockedIps = async () => {
  loadingBlockedIps.value = true;
  try {
    const res = await getData(apiLink.get_blocked_ips);
    if (res && res.status) {
      blockedIpList.value = res.data?.list || [];
    } else {
      blockedIpList.value = [];
    }
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    blockedIpList.value = [];
    message.error(trlang.value.error_loading_data);
  } finally {
    loadingBlockedIps.value = false;
  }
};

const handleRegisterIp = async () => {
  if (!newBlockedIp.value || !newBlockedIp.value.trim()) {
    message.warning(trlang.value.enter_ip_address);
    return;
  }

  const ipAddress = newBlockedIp.value.trim();
  
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ipAddress)) {
    message.warning(trlang.value.invalid_ip_address);
    return;
  }

  loadingRegisterIp.value = true;
  try {
    const res = await putData(apiLink.block_ip, {
      ip: ipAddress,
      block: true,
    });

    if (res && res.status) {
      message.success(res.message || trlang.value.ip_blocked_successfully);
      newBlockedIp.value = '';
      await fetchBlockedIps();
    } else {
      message.error(res.message || trlang.value.error_blocking_ip);
    }
  } catch (error) {
    console.error('Error blocking IP:', error);
    const errorMessage = error?.response?.data?.message || trlang.value.error_blocking_ip;
    message.error(errorMessage || trlang.value.error_blocking_ip);
  } finally {
    loadingRegisterIp.value = false;
  }
};

const handleRemoveIp = async (id) => {
  loadingRemoveIp.value[id] = true;
  try {
    const res = await deleteData(`${apiLink.remove_blocked_ip}/${id}`);
    if (res && res.status) {
      message.success(res.message || trlang.value.ip_removed_successfully);
      await fetchBlockedIps();
    } else {
      message.error(res.message || trlang.value.error_removing_ip);
    }
  } catch (error) {
    console.error('Error removing IP:', error);
    const errorMessage = error?.response?.data?.message || trlang.value.error_removing_ip;
    message.error(errorMessage || trlang.value.error_removing_ip);
  } finally {
    loadingRemoveIp.value[id] = false;
  }
};

const handleCloseBlockIpModal = () => {
  blockIpModalVisible.value = false;
  newBlockedIp.value = '';
};

const handleEdit = (record) => {
  const userId = record._id ? String(record._id) : record.user_id;
  editForm.value = {
    _id: userId,
    user_status: record.user_status || '',
  };
  editModalVisible.value = true;
};

const handleCancelEdit = () => {
  editModalVisible.value = false;
  editForm.value = {
    _id: null,
    user_status: '',
  };
};

const handleSaveEdit = async () => {
  if (!editForm.value._id) {
    message.error(trlang.value.invalid_user_id);
    return;
  }

  loadingEdit.value = true;
  try {
    const res = await postData(apiLink.member_list, {
      _id: editForm.value._id,
      user_status: editForm.value.user_status,
    });

    if (res && res.status) {
      message.success(res.message || trlang.value.user_updated_successfully);
      editModalVisible.value = false;
      await fetchData();
    } else {
      message.error(res.message || trlang.value.error_updating_user);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = error?.response?.data?.message || trlang.value.error_updating_user;
    message.error(errorMessage);
  } finally {
    loadingEdit.value = false;
  }
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
