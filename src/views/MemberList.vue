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
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.duration
        }}</a-typography-text>
        <a-select
          v-model:value="duration"
          :options="durationOptions"
          class="input-lg"
          @change="handleFilterChange"
        />
        <a-typography-text>{{ trlang.start_date }}</a-typography-text>
        <a-date-picker
          v-model:value="startDate"
          class="input-lg"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleFilterChange"
        />
        <a-typography-text>~</a-typography-text>
        <a-typography-text>{{ trlang.end_date }}</a-typography-text>
        <a-date-picker
          v-model:value="endDate"
          class="input-lg"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.user_status
        }}</a-typography-text>
        <a-select
          v-model:value="userStatus"
          :options="userStatusOptions"
          class="input-md"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.partner
        }}</a-typography-text>
        <a-select
          v-model:value="partner"
          :options="partnerOptions"
          class="input-lg"
          @change="handleFilterChange"
        />
        <a-typography-text>{{ trlang.include_sub }}</a-typography-text>
        <a-checkbox v-model:checked="includeSub" @change="handleFilterChange" />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.keyword
        }}</a-typography-text>
        <a-select
          v-model:value="searchField"
          :options="searchFieldOptions"
          class="input-lg"
          @change="handleFilterChange"
        />
        <a-input
          v-model:value="search"
          placeholder="Search..."
          class="input-lg"
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
      <div class="flex items-center gap-2">
        <a-typography-text class="">
          {{ trlang.current_loggedin_users }}
        </a-typography-text>
        <a-checkbox
          v-model:checked="currentLoggedinUser"
          @change="handleFilterChange"
        />
      </div>
      <a-button @click="refreshPage">{{ trlang.refresh_page }}</a-button>
      <div class="flex items-center gap-2">
        <a-typography-text class="">
          {{ trlang.consider_users }}
        </a-typography-text>
        <a-checkbox v-model:checked="considerUser" @change="handleFilterChange" />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">
          {{ trlang.sort }}
        </a-typography-text>
        <a-select
          v-model:value="sort"
          :options="sortOptions"
          class="input-lg"
          @change="handleFilterChange"
        />
      </div>
    </a-layout-header>

    <a-layout-content class="table-panel">
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
                    record.own_partners.length == 0
                      ? record.partners
                        ? record.partners[0].nickname
                        : record.user_nickname
                      : record.own_partners[0].nickname
                  }}
                </span>
                ({{
                  record.own_partners.length == 0
                    ? record.partners
                      ? record.partners[0].partner_id
                      : record.user_nickname
                    : record.own_partners[0].partner_id
                }})
              </a-typography-text>
              <a-typography-text class="bg-gray text-white px-2 w-fit radius-2">
                {{
                  record.own_partners.length == 0
                    ? record.partners
                      ? trlang[record.partners[0].role]
                      : ''
                    : trlang[record.own_partners[0].role]
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'partner'">
            {{
              record.own_partners.length == 0
                ? record.partners
                  ? record.partners[0].nickname
                  : ''
                : record.own_partners[0].nickname
            }}
          </template>
          <template v-if="column.key === 'status'">
            {{ trlang[record.user_status] }}
          </template>
          <template v-if="column.key === 'owned_money'">
            <div class="flex flex-column">
              <a-typography-text class="text-red">
                {{ record.own_money.toLocaleString() }}USD
              </a-typography-text>
              <a-typography-text>
                {{ record.point.toLocaleString() }}P
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
            {{ record.own_money.toLocaleString() }}P
          </template>
          <template v-if="column.key === 'last_import_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ record.last_import_time?.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{ record.last_import_time?.split('T')[1].split('.')[0] }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'connect_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ record.login_history?.createdAt.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{
                  record.login_history?.createdAt.split('T')[1].split('.')[0]
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ record.createdAt.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{ record.createdAt.split('T')[1].split('.')[0] }}
              </a-typography-text>
            </div>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { memberListColumn } from '@/utils/table-column/member-list.js';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.login_information.name,
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

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

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

const buildQuery = () => {
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
    sort: sort.value || '',
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  return params.toString();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(
      `${apiLink.get_member_list}?${buildQuery()}`
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
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = () => {
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

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
