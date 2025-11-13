<template>
  <a-layout class="panel-heading">
    <a-typography-text class="panel-heading__title">
      {{ trlang.real_time_betting }}
    </a-typography-text>
    <a-typography-text class="panel-heading__subtitle">
      {{ trlang.real_time_betting_description || 'View real-time betting activities' }}
    </a-typography-text>
  </a-layout>

  <a-layout class="panel-body">
    <a-layout-header
      class="panel-toolbar flex items-center flex-wrap gap-5"
    >
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
        <a-switch
          v-model:checked="autoRefresh"
          :checked-children="trlang.auto_refresh || 'Auto Refresh'"
          :un-checked-children="trlang.auto_refresh || 'Auto Refresh'"
        />
        <a-typography-text v-if="autoRefresh">
          {{ trlang.refreshing_in || 'Refreshing in' }} {{ refreshCountdown }}s
        </a-typography-text>
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
                {{ record.total_no ? record.total_no : '-' }}
              </a-typography-text>
              <a-typography-text v-if="record.today_no">
                {{ record.today_no }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'game_time'">
            <div class="flex flex-column">
              <a-typography-text v-if="record.game_start_time">
                {{ new Date(record.game_start_time).toLocaleString() }}
              </a-typography-text>
              <a-typography-text v-else>-</a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'result_list'">
            <a-typography-text>
              {{ record.game_list && record.game_list.length > 0 ? record.game_list.join(',') : '-' }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'odd_even'">
            <a-typography-text>
              {{ record.game_odd !== null ? (record.game_odd ? trlang.odd : trlang.even) : '-' }}
            </a-typography-text>
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
            <a-tag color="processing">
              {{ record.betting_status === 'complete' ? trlang.finish_betting : (trlang[record.betting_status] || record.betting_status) }}
            </a-tag>
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
import { ref, onMounted, onUnmounted, computed, inject, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { bettingListColumn } from '@/utils/table-column/betting-list.js';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';
import { socket } from '@/plugins/socket';

defineOptions({
  name: routeLink.real_time_betting.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

// Filters - Only show progress status bets
const partner = ref('');
const partnerOptions = ref([]);
const includeSub = ref(false);
const bettingType = ref('');
const bettingTypeOptions = ref([]);
const search = ref('');
const searchField = ref('');
const searchFieldOptions = ref([]);

// Auto-refresh
const autoRefresh = ref(true);
const refreshCountdown = ref(10);
let refreshInterval = null;
let countdownInterval = null;

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(20);

const initOptions = () => {
  partnerOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'headquater', label: trlang.value.headquater },
    { value: 'branch_office', label: trlang.value.branch_office },
    { value: 'regional_office', label: trlang.value.regional_office },
    { value: 'agency', label: trlang.value.agency },
    { value: 'distributor', label: trlang.value.distributor },
    { value: 'store', label: trlang.value.store },
  ];
  bettingTypeOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'odd', label: 'Odd' },
    { value: 'even', label: 'Even' },
    { value: 'under', label: 'Under' },
    { value: 'over', label: 'Over' },
    { value: 'odd_under', label: 'Odd Under' },
    { value: 'odd_over', label: 'Odd Over' },
    { value: 'even_under', label: 'Even Under' },
    { value: 'even_over', label: 'Even Over' },
    { value: 'number_13', label: 'Number 13' },
    { value: 'number_14', label: 'Number 14' },
    { value: 'number_16', label: 'Number 16' },
  ];
  searchField.value = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.id },
    { value: 'user_nickname', label: trlang.value.nickname },
    { value: 'total_no', label: trlang.value.total_round_id },
    { value: 'today_no', label: trlang.value.day_round_id },
    { value: 'betting_type', label: trlang.value.betting_type },
  ];
};

const rowKey = (record) => record.betting_id || record._id;

const buildQuery = () => {
  const params = new URLSearchParams({
    // Always filter for progress status (real-time/ongoing bets)
    bettingStatus: 'progress',
    partner: partner.value || '',
    includeSub: includeSub.value ? 'true' : 'false',
    bettingType: bettingType.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
    sort: 'created_date:desc',
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
  partner.value = '';
  includeSub.value = false;
  bettingType.value = '';
  search.value = '';
  loading.value = false;
  paginationConfig.value.current = 1;
  fetchData();
};

// Auto-refresh functionality
const startAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  if (autoRefresh.value) {
    refreshCountdown.value = 10;
    
    countdownInterval = setInterval(() => {
      refreshCountdown.value--;
      if (refreshCountdown.value <= 0) {
        refreshCountdown.value = 10;
      }
    }, 1000);

    refreshInterval = setInterval(() => {
      fetchData();
    }, 10000); // Refresh every 10 seconds
  }
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

// WebSocket listeners for real-time updates
const setupSocketListeners = () => {
  socket.on('start_game', () => {
    if (autoRefresh.value) {
      // Refresh when a new game starts
      fetchData();
    }
  });

  socket.on('end_game', () => {
    if (autoRefresh.value) {
      // Refresh when a game ends
      fetchData();
    }
  });
};

const removeSocketListeners = () => {
  socket.off('start_game');
  socket.off('end_game');
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

watch(
  () => autoRefresh.value,
  (newVal) => {
    if (newVal) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }
);

onMounted(() => {
  initOptions();
  fetchData();
  startAutoRefresh();
  setupSocketListeners();
});

onUnmounted(() => {
  stopAutoRefresh();
  removeSocketListeners();
});
</script>

