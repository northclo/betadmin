<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.real_time_betting }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.real_time_betting_description }}
      </a-typography-text>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-select
                v-model:value="filters.partner"
                :options="partnerOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.betting_type">
              <a-select
                v-model:value="filters.bettingType"
                :options="bettingTypeOptions"
                allow-clear
              />
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

    <a-layout-content>
      <a-table
        :columns="bettingListColumn"
        :data-source="dataSource"
        :loading="loading"
        :row-key="rowKey"
        class="w-100 table-transparent"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined"
        :pagination="paginationConfig"
        @change="handleTableChange"
      >

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
                {{ record.partner_nickname || '-' }}
              </a-typography-text>
              <a-typography-text class="bg-gray text-white px-2 w-fit radius-2" v-if="record.partner_role">
                {{ trlang[record.partner_role] || '' }}
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
              {{ record.bet_amount ? record.bet_amount.toLocaleString() : 0 }}{{ trlang.usd_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_rate'">
            {{ record.betting_rate ? record.betting_rate.toLocaleString() : '-' }}
          </template>
          <template v-if="column.key === 'earning_amount'">
            <a-typography-text :class="record.earning_amount > 0 ? 'text-red' : ''">
              {{ record.earning_amount ? record.earning_amount.toLocaleString() : 0 }}{{ trlang.usd_currency }}
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
import { message } from 'ant-design-vue';
import { bettingListColumn as baseBettingListColumn } from '@/utils/table-column/betting-list.js';
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

const filters = ref({
  partner: '',
  bettingType: '',
  search: '',
  searchField: 'user_id',
});

const partnerOptions = ref([]);
const bettingTypeOptions = ref([]);
const searchFieldOptions = ref([]);

let fetchDataTimeout = null;

const dataSource = ref([]);
const loading = ref(false);
const searchLoading = ref(false);
const isFetching = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(20);

const bettingListColumn = computed(() => baseBettingListColumn.map(col => ({
  ...col,
  title: trlang.value[col.titleKey] || col.titleKey
})));

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
  filters.value.searchField = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.id },
    { value: 'user_nickname', label: trlang.value.nickname },
    { value: 'game_id', label: trlang.value.game_id },
    { value: 'total_no', label: trlang.value.total_round_id },
    { value: 'today_no', label: trlang.value.day_round_id },
    { value: 'betting_type', label: trlang.value.betting_type },
  ];
};

const rowKey = (record) => record.betting_id || record._id;

const buildQuery = () => {
  const params = new URLSearchParams({
    bettingStatus: 'progress',
    partner: filters.value.partner || '',
    bettingType: filters.value.bettingType || '',
    searchField: filters.value.searchField || '',
    search: filters.value.search || '',
    sort: 'created_date:desc',
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  return params.toString();
};

const fetchData = async (silent = false) => {
  if (isFetching.value) {
    return;
  }

  isFetching.value = true;
  if (!silent) {
    loading.value = true;
  }

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
    } else {
      if (!silent) {
        message.error(res.message || trlang.value.failed_to_fetch_betting_list);
      }
    }
  } catch (error) {
    console.error('Error fetching betting list:', error);
    if (!silent) {
      message.error(trlang.value.failed_to_fetch_betting_list);
    }
    dataSource.value = [];
    setTotal(0);
  } finally {
    loading.value = false;
    isFetching.value = false;
  }
};

const handleFilterChange = async () => {
  if (fetchDataTimeout) {
    clearTimeout(fetchDataTimeout);
  }

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
    partner: '',
    bettingType: '',
    search: '',
    searchField: 'user_id',
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const setupSocketListeners = () => {
  if (!socket.connected) {
    console.warn('Socket not connected, attempting to connect...');
    socket.connect();
  }

  socket.on('connect', () => {
    console.log('Socket connected for real-time betting');
  });

  socket.on('disconnect', () => {
    console.warn('Socket disconnected for real-time betting');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('start_game', (data) => {
    console.log('Game started:', data);
    if (!isFetching.value) {
      fetchData(true);
    }
  });

  socket.on('end_game', (data) => {
    console.log('Game ended:', data);
    if (!isFetching.value) {
      fetchData(true);
    }
  });
};

const removeSocketListeners = () => {
  socket.off('connect');
  socket.off('disconnect');
  socket.off('connect_error');
  socket.off('start_game');
  socket.off('end_game');
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
  setupSocketListeners();
});

onUnmounted(() => {
  removeSocketListeners();
  
  if (fetchDataTimeout) {
    clearTimeout(fetchDataTimeout);
    fetchDataTimeout = null;
  }
});
</script>

