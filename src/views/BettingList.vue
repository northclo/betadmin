<template>
  <a-layout class="panel-heading">
    <a-typography-text class="panel-heading__title">
      {{ trlang.betting_list }}
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
        <a-date-picker
          v-model:value="startDate"
          class="input-lg"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :placeholder="trlang.start_date"
          @change="handleFilterChange"
        />
        <a-typography-text>~</a-typography-text>
        <a-date-picker
          v-model:value="endDate"
          class="input-lg"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :placeholder="trlang.end_date"
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
          trlang.betting_status
        }}</a-typography-text>
        <a-select
          v-model:value="bettingStatus"
          :options="bettingStatusOptions"
          class="input-md"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.betting_type
        }}</a-typography-text>
        <a-select
          v-model:value="bettingType"
          :options="bettingTypeOptions"
          class="input-md"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex items-center gap-2">
        <a-typography-text class="bg-gray text-white p-2 px-5">{{
          trlang.win
        }}</a-typography-text>
        <a-select
          v-model:value="win"
          :options="winOptions"
          class="input-md"
          @change="handleFilterChange"
        />
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
          :placeholder="trlang.search_placeholder"
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
      <a-button @click="refreshPage">{{ trlang.refresh_page }}</a-button>
    </a-layout-header>

    <a-layout-content class="table-panel">
      <a-table
        :columns="bettingListColumn"
        :data-source="dataSource"
        :row-key="rowKey"
        class="w-100 table-transparent"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined"
        :pagination="paginationConfig"
        @change="handleTableChange"
      >
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ index + 1 }}
          </template>
          <template v-if="column.key === 'round'">
            <div class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.total_no ? `#${record.total_no}` : record.game_id ? `#${record.game_id}` : '-' }}
              </a-typography-text>
              <a-typography-text v-if="record.today_no">
                {{ trlang.today_no }}: {{ record.today_no }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'game_time'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text v-if="record.game_start_time">
                {{ new Date(record.game_start_time).toLocaleString() }}
              </a-typography-text>
              <a-typography-text v-else>-</a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'result_list'">
            <div class="flex justify-center items-center gap-1">
              <span v-if="record.game_list && record.game_list.length > 0">
                {{ record.game_list.join(', ') }}
              </span>
              <span v-else>-</span>
            </div>
          </template>
          <template v-if="column.key === 'odd_even'">
            <div class="flex justify-center items-center">
              <a-tag :color="record.game_odd ? 'blue' : 'purple'">
                {{ record.game_odd ? trlang.odd : trlang.even }}
              </a-tag>
            </div>
          </template>
          <template v-if="column.key === 'user'">
            <div class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.user_nickname || '-' }}
              </a-typography-text>
              <a-typography-text class="text-light-gray">
                {{ record.user_email || record.user_name || record.user_id }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'partner'">
            <div class="flex flex-column">
              <a-typography-text>
                {{ record.own_partner_nickname || record.partner_nickname || '-' }}
              </a-typography-text>
              <a-typography-text class="bg-gray text-white px-2 w-fit radius-2" v-if="record.own_partner_role || record.partner_role">
                {{ trlang[record.own_partner_role || record.partner_role] || '' }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'betting_type'">
            <span>{{ record.betting_type || '-' }}</span>
          </template>
          <template v-if="column.key === 'number_sort'">
            <span v-if="record.number_sort && record.number_sort.length > 0">
              {{ record.number_sort.join(', ') }}
            </span>
            <span v-else>-</span>
          </template>
          <template v-if="column.key === 'bet_amount'">
            <a-typography-text class="text-main">
              {{ record.bet_amount ? record.bet_amount.toLocaleString() : 0 }}USD
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_rate'">
            {{ record.betting_rate ? record.betting_rate.toLocaleString() : '-' }}
          </template>
          <template v-if="column.key === 'earning_amount'">
            <a-typography-text :class="record.earning_amount > 0 ? 'text-red' : ''">
              {{ record.earning_amount ? record.earning_amount.toLocaleString() : 0 }}USD
            </a-typography-text>
          </template>
          <template v-if="column.key === 'win'">
            <a-tag :color="record.win ? 'success' : 'error'">
              {{ record.win ? trlang.win : trlang.lose }}
            </a-tag>
          </template>
          <template v-if="column.key === 'betting_status'">
            {{ trlang[record.betting_status] || record.betting_status }}
          </template>
          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ record.createdAt?.split('T')[0] || '-' }}
              </a-typography-text>
              <a-typography-text>
                {{ record.createdAt?.split('T')[1]?.split('.')[0] || '-' }}
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
import { SearchOutlined } from '@ant-design/icons-vue';
import { bettingListColumn as baseBettingListColumn } from '@/utils/table-column/betting-list.js';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.betting_list.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

// Filters
const startDate = ref('');
const endDate = ref('');
const userStatus = ref('');
const userStatusOptions = ref([]);
const partner = ref('');
const partnerOptions = ref([]);
const includeSub = ref(false);
const bettingStatus = ref('');
const bettingStatusOptions = ref([]);
const bettingType = ref('');
const bettingTypeOptions = ref([]);
const win = ref('');
const winOptions = ref([]);
const search = ref('');
const searchField = ref('');
const searchFieldOptions = ref([]);
const sort = ref('');
const sortOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const bettingListColumn = computed(() => baseBettingListColumn.map(col => ({
  ...col,
  title: trlang.value[col.titleKey] || col.titleKey
})));

const initOptions = () => {
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
  bettingStatusOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'wait', label: trlang.value.wait },
    { value: 'progress', label: trlang.value.progress },
    { value: 'complete', label: trlang.value.complete },
    { value: 'cancel', label: trlang.value.cancel },
  ];
  bettingTypeOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'odd', label: trlang.value.odd },
    { value: 'even', label: trlang.value.even },
    { value: 'under', label: trlang.value.under },
    { value: 'over', label: trlang.value.over },
    { value: 'odd_under', label: trlang.value.odd_under },
    { value: 'odd_over', label: trlang.value.odd_over },
    { value: 'even_under', label: trlang.value.even_under },
    { value: 'even_over', label: trlang.value.even_over },
    { value: 'number_13', label: trlang.value.number_13 },
    { value: 'number_14', label: trlang.value.number_14 },
    { value: 'number_16', label: trlang.value.number_16 },
  ];
  winOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'true', label: trlang.value.win },
    { value: 'false', label: trlang.value.lose },
  ];
  searchField.value = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.id },
    { value: 'user_nickname', label: trlang.value.nickname },
    { value: 'game_id', label: trlang.value.game_id },
    { value: 'betting_type', label: trlang.value.betting_type },
    { value: 'total_no', label: trlang.value.total_no },
    { value: 'today_no', label: trlang.value.today_no },
  ];
  sort.value = 'created_date:desc';
  sortOptions.value = [
    { value: 'created_date:desc', label: trlang.value.created_date },
    { value: 'bet_amount:desc', label: trlang.value.bet_amount },
    { value: 'earning_amount:desc', label: trlang.value.earning_amount },
    { value: 'game_id:desc', label: trlang.value.game_id },
    { value: 'total_no:desc', label: trlang.value.total_no },
  ];
};

const rowKey = (record) => record.betting_id || record._id;

const buildQuery = () => {
  const params = new URLSearchParams({
    startDate: startDate.value || '',
    endDate: endDate.value || '',
    userStatus: userStatus.value || '',
    partner: partner.value || '',
    includeSub: includeSub.value ? 'true' : 'false',
    bettingStatus: bettingStatus.value || '',
    bettingType: bettingType.value || '',
    win: win.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
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
  bettingStatus.value = '';
  bettingType.value = '';
  win.value = '';
  search.value = '';
  loading.value = false;
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

