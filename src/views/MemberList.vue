<template>
  <a-layout class="panel-heading">
    <a-typography-text class="panel-heading__title">
      {{ trlang.member_list }}
    </a-typography-text>
  </a-layout>

  <a-layout class="panel-body">
    <a-layout-header
      class="panel-toolbar flex items-center flex-wrap gap-5"
    >
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="filter-label p-2 px-5">{{
          trlang.duration
        }}</a-typography-text>
        <a-select
          v-model:value="duration"
          :options="durationOptions"
          class="input-lg filter-select"
          @change="handleFilterChange"
        />
        <a-typography-text class="date-label">{{ trlang.start_date }}</a-typography-text>
        <a-date-picker
          v-model:value="startDate"
          class="input-lg filter-date-picker"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleFilterChange"
        />
        <a-typography-text class="date-separator">~</a-typography-text>
        <a-typography-text class="date-label">{{ trlang.end_date }}</a-typography-text>
        <a-date-picker
          v-model:value="endDate"
          class="input-lg filter-date-picker"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="filter-label p-2 px-5">{{
          trlang.user_status
        }}</a-typography-text>
        <a-select
          v-model:value="userStatus"
          :options="userStatusOptions"
          class="input-md filter-select"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="filter-label p-2 px-5">{{
          trlang.partner
        }}</a-typography-text>
        <a-select
          v-model:value="partner"
          :options="partnerOptions"
          class="input-lg filter-select"
          @change="handleFilterChange"
        />
        <a-typography-text>{{ trlang.include_sub }}</a-typography-text>
        <a-checkbox v-model:checked="includeSub" @change="handleFilterChange" />
      </div>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="filter-label p-2 px-5">{{
          trlang.keyword
        }}</a-typography-text>
        <a-select
          v-model:value="searchField"
          :options="searchFieldOptions"
          class="input-lg filter-select"
          @change="handleFilterChange"
        />
        <a-input
          v-model:value="search"
          :placeholder="trlang.search_placeholder"
          class="input-lg filter-input"
          @press-enter="handleFilterChange"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-button type="primary" @click="handleFilterChange">
          {{ trlang.search }}
        </a-button>
      </div>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="">
          {{ trlang.current_loggedin_users }}
        </a-typography-text>
        <a-checkbox
          v-model:checked="currentLoggedinUser"
          @change="handleFilterChange"
        />
      </div>
      <a-button @click="refreshPage" class="filter-button">{{ trlang.refresh_page }}</a-button>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="">
          {{ trlang.consider_users }}
        </a-typography-text>
        <a-checkbox v-model:checked="considerUser" @change="handleFilterChange" />
      </div>
      <div class="flex items-center gap-2 filter-group">
        <a-typography-text class="filter-label p-2 px-5">
          {{ trlang.sort }}
        </a-typography-text>
        <a-select
          v-model:value="sort"
          :options="sortOptions"
          class="input-lg filter-select"
          @change="handleFilterChange"
        />
      </div>
    </a-layout-header>

    <div class="status-summary-bar flex items-center gap-4 p-4 mb-4 bg-white rounded">
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

    <a-layout-content class="table-panel">
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
        >
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ index + 1 }}
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
                    record.own_partners?.[0]?.nickname ||
                    record.partners?.[0]?.nickname ||
                    record.user_nickname ||
                    '-'
                  }}
                </span>
                ({{
                  record.own_partners?.[0]?.partner_id ||
                  record.partners?.[0]?.partner_id ||
                  record.user_nickname ||
                  '-'
                }})
              </a-typography-text>
              <a-typography-text
                v-if="record.own_partners?.[0]?.role || record.partners?.[0]?.role"
                class="filter-badge px-2 py-1 w-fit"
              >
                {{
                  trlang[record.own_partners?.[0]?.role] ||
                  trlang[record.partners?.[0]?.role] ||
                  ''
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'partner'">
            {{
              record.own_partners?.[0]?.nickname ||
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
                {{ (record.own_money || 0).toLocaleString() }}USD
              </a-typography-text>
              <a-typography-text>
                {{ (record.point || 0).toLocaleString() }}P
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'all_import_money'">
            {{
              record.totalImportAmount
                ? record.totalImportAmount.toLocaleString()
                : 0
            }}USD
          </template>
          <template v-if="column.key === 'all_exchange_money'">
            {{
              record.totalExchangeAmount
                ? record.totalExchangeAmount.toLocaleString()
                : 0
            }}USD
          </template>
          <template v-if="column.key === 'partner_earning'">
            {{
              record.totalPartnerEarning
                ? record.totalPartnerEarning.toLocaleString()
                : 0
            }}USD
          </template>
          <template v-if="column.key === 'total_betting_amount'">
            <a-typography-text class="text-main">
              {{
                record.totalBettingAmount
                  ? record.totalBettingAmount.toLocaleString()
                  : 0
              }}USD
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
              }}USD
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_provide_point'">
            {{ (record.point || 0).toLocaleString() }}P
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
        </template>
      </a-table>
      </div>
    </a-layout-content>
  </a-layout>

  <a-modal
    v-model:open="blockIpModalVisible"
    :title="trlang.block_ip"
    :footer="null"
    width="800px"
    @cancel="handleCloseBlockIpModal"
  >
    <div class="block-ip-modal">
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <h3 class="text-lg font-semibold">{{ trlang.register_blocking_ip }}</h3>
        </div>
        <div class="flex items-center gap-2">
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
          >
            <template #icon><CheckOutlined /></template>
            {{ trlang.register }}
          </a-button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <h3 class="text-lg font-semibold">{{ trlang.blocked_ip_list }}</h3>
        </div>
        <a-table
          :columns="blockedIpColumns"
          :data-source="blockedIpList"
          :pagination="{ pageSize: 10 }"
          :loading="loadingBlockedIps"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
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
              >
                <template #icon><CheckOutlined /></template>
                {{ trlang.remove }}
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <div class="flex justify-center mt-6">
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
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { memberListColumn as baseMemberListColumn } from '@/utils/table-column/member-list.js';
import { getData, putData, deleteData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.member_list.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

// Filters
const duration = ref('');
const durationOptions = ref([]);
const startDate = ref('');
const endDate = ref('');
const userStatus = ref('');
const userStatusOptions = ref([]);
const partner = ref('');
const partnerOptions = ref([]);
const includeSub = ref(false);
const search = ref('');
const searchField = ref('');
const searchFieldOptions = ref([]);
const currentLoggedinUser = ref(false);
const considerUser = ref(false);
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

const blockedIpColumns = computed(() => [
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
    { value: '', label: trlang.value.all },
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
    startDate: startDate.value || '',
    endDate: endDate.value || '',
    userStatus: userStatus.value || '',
    partner: partner.value || '',
    includeSub: includeSub.value ? 'true' : 'false',
    searchField: searchField.value || '',
    search: search.value || '',
    currentLoggedinUser: currentLoggedinUser.value ? 'true' : 'false',
    considerUser: considerUser.value ? 'true' : 'false',
    sort: formattedSort,
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

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
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    if (start > end) {
      message.warning(trlang.value.end_date_must_be_after_start_date);
      return false;
    }
  }
  return true;
};

const handleFilterChange = () => {
  if (!validateDateRange()) {
    return;
  }
  const isFirstPage = paginationConfig.value.current === 1;
  paginationConfig.value.current = 1;
  if (isFirstPage) {
    fetchData();
  }
};

const refreshPage = () => {
  initOptions();
  startDate.value = '';
  endDate.value = '';
  userStatus.value = '';
  partner.value = '';
  includeSub.value = false;
  search.value = '';
  currentLoggedinUser.value = false;
  considerUser.value = false;
  loading.value = false;
  selectedRowKeys.value = [];
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
  }
};

const handleRemoveIp = async (id) => {
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
  }
};

const handleCloseBlockIpModal = () => {
  blockIpModalVisible.value = false;
  newBlockedIp.value = '';
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
