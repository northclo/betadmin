<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.game_management }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.game_process">
              <a-select
                v-model:value="filters.gameProcess"
                :options="gameProcessOptions"
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
          <a-col class="flex" :xs="24" :md="4">
            <a-form-item class="mb-0 flex items-end w-100">
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
          <a-col :xs="24" :md="4" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="loading" @click="handleFilterChange">
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
      <a-space class="p-2">
        <template v-for="status in statusLegend" :key="status.key">
          <a-typography-text>
            <span :class="`prefix-badge ${status.class}`">
              {{ status.key }}
            </span>
            {{ status.label }}
          </a-typography-text>
        </template>
      </a-space>

      <a-table :columns="gameManagementColumn" :data-source="dataSource" row-key="key" class="w-100 table-transparent"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined" :pagination="paginationConfig"
        :loading="loading" @change="handleTableChange">
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ ((paginationConfig.current - 1) * paginationConfig.pageSize + index + 1).toLocaleString() }}</a-typography-text>
          </template>

          <template v-else-if="column.key === 'round_id'">
            <a-layout class="bg-none">
              <a-typography-text class="text-main font-bold">
                {{ record.total_no.toLocaleString() }}
              </a-typography-text>
              <a-typography-text>{{ record.today_no.toLocaleString() }}</a-typography-text>
            </a-layout>
          </template>

          <template v-else-if="column.key === 'game_time'">
            <a-layout class="bg-none">
              <a-typography-text>{{ record.startTime }}</a-typography-text>
            </a-layout>
          </template>

          <template v-else-if="['odd_even', 'under_over'].includes(column.key)">
            <a-row class="bg-none no-padding">
              <a-col v-for="opt in bettingOptions[column.key]" :key="opt.label"
                :class="['flex flex-column pt-2 pb-2', opt.active(record) ? 'bg-purple' : '']" :span="12">
                <a-typography-text>{{ opt.label }}</a-typography-text>
                <a-typography-text>
                  [<span class="text-red">{{ getBettingCount(record, opt.bettingType) }}</span>]
                </a-typography-text>
              </a-col>
            </a-row>
          </template>

          <template v-else-if="['odd_under_over', 'even_under_over'].includes(column.key)">
            <a-row class="bg-none no-padding">
              <a-col v-for="opt in bettingOptions[column.key]" :key="opt.label"
                :class="['flex flex-column pt-2 pb-2', opt.active(record) ? 'bg-purple' : '']" :span="12">
                <a-typography-text>{{ opt.label }}</a-typography-text>
                <a-typography-text>
                  [<span class="text-red">{{ getBettingCount(record, opt.bettingType) }}</span>]
                </a-typography-text>
              </a-col>
            </a-row>
          </template>

          <template v-else-if="column.key === 'game_status'">
            <a-space class="p-2">
              <span v-for="status in statusLegend" :key="status.key" :class="`prefix-badge ${record.status === status.value
                ? status.class
                : 'prefix-badge-inactive'
                }`">
                {{ status.key }}
              </span>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { gameManagementColumn as baseGameManagementColumn } from '@/utils/table-column/game-management';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({ name: routeLink.game_management.name });

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  gameProcess: '',
  searchField: 'total_no',
  search: '',
});

const searchFieldOptions = ref([]);
const gameProcessOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, setTotal } = usePagination(10);

const handleTableChange = (pagination) => {
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
  fetchData();
};

const statusLegend = computed(() => [
  {
    key: 'R',
    value: 'r',
    class: 'prefix-badge-register',
    label: trlang.value.register_game,
  },
  {
    key: 'S',
    value: 's',
    class: 'prefix-badge-start',
    label: trlang.value.under_betting,
  },
  {
    key: 'E',
    value: 'e',
    class: 'prefix-badge-end',
    label: trlang.value.end_betting,
  },
  {
    key: 'F',
    value: 'f',
    class: 'prefix-badge-finish',
    label: trlang.value.finish_betting,
  },
  {
    key: 'C',
    value: 'c',
    class: 'prefix-badge-cancel',
    label: trlang.value.cancel_game,
  },
]);

const bettingOptions = computed(() => ({
  odd_even: [
    { label: trlang.value.odd, active: (r) => r.odd, bettingType: 'odd' },
    { label: trlang.value.even, active: (r) => !r.odd, bettingType: 'even' },
  ],
  under_over: [
    { label: trlang.value.under, active: (r) => r.under, bettingType: 'under' },
    { label: trlang.value.over, active: (r) => !r.under, bettingType: 'over' },
  ],
  odd_under_over: [
    { label: trlang.value.odd_under, active: (r) => r.odd && r.under, bettingType: 'odd_under' },
    { label: trlang.value.odd_over, active: (r) => r.odd && !r.under, bettingType: 'odd_over' },
  ],
  even_under_over: [
    { label: trlang.value.even_under, active: (r) => !r.odd && r.under, bettingType: 'even_under' },
    { label: trlang.value.even_over, active: (r) => !r.odd && !r.under, bettingType: 'even_over' },
  ],
}));

const getBettingCount = (record, bettingType) => {
  if (!record.bettingCounts) return 0;
  return record.bettingCounts[bettingType] || 0;
};

const gameManagementColumn = computed(() => baseGameManagementColumn.map(col => ({
  ...col,
  title: trlang.value[col.titleKey] || col.titleKey
})));

const initOptions = () => {
  filters.value.searchField = 'total_no';
  gameProcessOptions.value = [
    { value: '', label: `${trlang.value.all}` },
    { value: 'register', label: trlang.value.register_game },
    { value: 'under', label: trlang.value.under_betting },
    { value: 'end', label: trlang.value.end_betting },
    { value: 'finish', label: trlang.value.finish_betting },
    { value: 'cancel', label: trlang.value.cancel_game },
  ];
  searchFieldOptions.value = [
    { value: 'total_no', label: trlang.value.total_round_id },
    { value: 'today_no', label: trlang.value.day_round_id },
  ];
};

const fetchData = async () => {
  const searchValue = filters.value.search?.toString().trim() ?? '';
  if (searchValue && !Number.isFinite(Number(searchValue))) {
    message.error(trlang.value.invalid_data);
    return;
  }
  
  loading.value = true;
  try {
    const page = paginationConfig.value.current;
    const pageSize = paginationConfig.value.pageSize;
    
    const params = new URLSearchParams();
    if (filters.value.gameProcess) params.append('status', filters.value.gameProcess);
    if (searchValue) {
      params.append('searchField', filters.value.searchField);
      params.append('search', searchValue);
    }
    params.append('page', page);
    params.append('pageSize', pageSize);
    
    const res = await getData(
      `${apiLink.get_game_management}?${params.toString()}`
    );
    if (res.status) {
      if (res.data && res.data.items) {
        dataSource.value = res.data.items || [];
        if (res.data.pagination && res.data.pagination.total !== undefined) {
          setTotal(res.data.pagination.total);
        } else {
          setTotal(res.data.items.length);
        }
      } else {
        dataSource.value = Array.isArray(res.data) ? res.data : [];
        setTotal(Array.isArray(res.data) ? res.data.length : 0);
      }
    } else {
      dataSource.value = [];
      setTotal(0);
    }
  } catch (error) {
    console.error('Error fetching game management data:', error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    dataSource.value = [];
    setTotal(0);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = () => {
  paginationConfig.value.current = 1;
  fetchData();
};

const resetFilters = () => {
  filters.value = {
    gameProcess: '',
    searchField: 'total_no',
    search: '',
  };
  paginationConfig.value.current = 1;
  fetchData();
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
