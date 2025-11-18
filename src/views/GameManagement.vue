<template>
  <a-layout class="panel-heading">
    <a-typography-text class="panel-heading__title">
      {{ trlang.game_management }}
    </a-typography-text>
  </a-layout>

  <a-layout class="panel-body">
    <a-layout-header class="panel-toolbar flex items-center gap-2">
      <a-typography-text class="filter-label p-2">
        {{ trlang.game_process }}
      </a-typography-text>
      <a-select v-model:value="gameProcess" :options="gameProcessOptions" class="input-lg" @change="fetchData" />
      <a-typography-text class="filter-label p-2">
        {{ trlang.keyword }}
      </a-typography-text>
      <a-select v-model:value="searchField" :options="searchFieldOptions" class="input-lg" />
      <a-input v-model:value="search" :placeholder="trlang.search_placeholder" class="input-lg" @press-enter="fetchData">
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary" @click="fetchData">
        {{ trlang.search }}
      </a-button>
    </a-layout-header>

    <a-layout-content class="table-panel">
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
        @change="handleTableChange">
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'round_id'">
            <a-layout class="bg-none">
              <a-typography-text class="text-main font-bold">
                {{ record.total_no }}
              </a-typography-text>
              <a-typography-text>{{ record.today_no }}</a-typography-text>
            </a-layout>
          </template>

          <template v-else-if="column.key === 'game_time'">
            <a-layout class="bg-none">
              <a-typography-text>{{ record.startTime }}</a-typography-text>
              <a-typography-text class="text-red">
                {{ loadRemainedTime(record.remainedTime) }}
              </a-typography-text>
            </a-layout>
          </template>

          <template v-else-if="column.key === 'result_list'">
            <a-typography-text>
              {{ JSON.stringify(record.list).slice(1, -1) }}
            </a-typography-text>
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
import { ref, onMounted, computed, inject, watch } from 'vue';
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

const searchField = ref('total_no');
const search = ref('');
const gameProcess = ref('');
const searchFieldOptions = ref([]);
const gameProcessOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

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
  gameProcessOptions.value = [
    { value: '', label: `:: ${trlang.value.all_process} ::` },
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
  const searchValue = search.value?.toString().trim() ?? '';
  if (searchValue && Number.isNaN(Number(searchValue))) {
    message.error(trlang.value.invalid_data);
    return;
  }
  
  loading.value = true;
  try {
    const page = paginationConfig.value.current;
    const pageSize = paginationConfig.value.pageSize;
    
    const params = new URLSearchParams();
    if (gameProcess.value) params.append('status', gameProcess.value);
    if (searchValue) {
      params.append('searchField', searchField.value);
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
        }
      } else {
        dataSource.value = res.data || [];
      }
    } else {
      dataSource.value = [];
      setTotal(0);
      if (res.message) {
        message.error(res.message);
      }
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  fetchData
);

const loadRemainedTime = (time) => {
  if (time < 0) return '';
  const parts = [];
  const days = Math.floor(time / 86400000);
  const hours = Math.floor((time / 3600000) % 24);
  const mins = Math.floor((time / 60000) % 60);
  const secs = Math.floor((time / 1000) % 60);
  if (days) parts.push(`${days}${trlang.value.day}`);
  if (hours) parts.push(`${hours}${trlang.value.hour}`);
  if (mins) parts.push(`${mins}${trlang.value.min}`);
  if (secs) parts.push(`${secs}${trlang.value.sec}`);
  return `${trlang.value.remain} ${parts.join(' ')}`;
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
