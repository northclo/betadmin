<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.current_loggedin_users }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.date_range">
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
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-select
                v-model:value="filters.searchField"
                :options="searchFieldOptions"
              />
            </a-form-item>
          </a-col>
          <a-col class="flex" :xs="24" :md="4">
            <a-form-item class="mb-0 flex items-end">
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
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.user_status">
              <a-select
                v-model:value="filters.userStatus"
                :options="userStatusOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="7" class="actions">
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
      <a-table
        :columns="currentLoginUserColumn"
        :data-source="dataSource"
        :row-key="rowKey"
        class="w-100"
        :loading="loading"
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
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>

          <template v-if="column.key === 'id'">
            <a-typography-text class="me-2">{{
              record.user_nickname
            }}</a-typography-text>
          </template>

          <template v-if="column.key === 'partner'">
            <a-typography-text>
              {{ record.partner?.nickname || '-' }}
            </a-typography-text>
          </template>

          <template v-if="column.key === 'ip_address'">
            <a-typography-text>{{
              record.last_login_history?.ip_address
            }}</a-typography-text>
            <a-typography-text
              v-if="record.blockedIp"
              class="ms-2"
              :style="{
                color: '#2563eb !important',
                background: '#e0f2ff !important',
                padding: '2px 8px',
                borderRadius: '4px'
              }"
            >
              {{ trlang.block_ip }}
            </a-typography-text>
          </template>

          <template v-if="column.key === 'location'">
            {{ record.last_login_history?.location }}
          </template>

          <template v-if="column.key === 'device'">
            {{ record.last_login_history?.device }}
          </template>

          <template v-if="column.key === 'money_point'">
            <div class="flex flex-column">
              <a-typography-text class="text-red"
                >{{ record.own_money.toLocaleString() }}{{ trlang.global_currency }}</a-typography-text
              >
              <a-typography-text
                >{{ record.point.toLocaleString() }}{{ trlang.points_unit }}</a-typography-text
              >
            </div>
          </template>

          <template v-if="column.key === 'import_money'">
            {{ record.total_import_amount || 0 }}{{ trlang.global_currency }}
          </template>

          <template v-if="column.key === 'exchange_money'">
            {{ record.total_exchange_amount || 0 }}{{ trlang.global_currency }}
          </template>

          <template v-if="column.key === 'final_import_date'">
            <div v-if="record.last_import_date" class="flex flex-column">
              <a-typography-text>
                {{ record.last_import_date.split('T')[0] }} {{ record.last_import_date.split('T')[1]?.split('.')[0] }}
              </a-typography-text>
            </div>
            <span v-else>-</span>
          </template>

          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column">
              <a-typography-text>
              {{ record.createdAt.split('T')[0] }} {{ record.createdAt.split('T')[1].split('.')[0] }}
              </a-typography-text>
            </div>
          </template>

          <template v-if="column.key === 'connect_date'">
            <div v-if="record.last_login_history?.createdAt" class="flex flex-column">
              <a-typography-text>
                {{ record.last_login_history.createdAt.split('T')[0] }}
                {{
                  record.last_login_history.createdAt
                    .split('T')[1]
                    ?.split('.')[0]
                }}
              </a-typography-text>
            </div>
            <span v-else>-</span>
          </template>

          <template v-if="column.key === 'mobile'">
            <a-typography-text>{{ record.last_login_history?.mobile ? 'Y' : 'N' }}</a-typography-text>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { currentLoginUserColumn as baseCurrentLoginUserColumn } from '@/utils/table-column/current-login-user.js';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';
import { message } from "ant-design-vue";

defineOptions({
  name: routeLink.current_login_user.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  range: null,
  searchField: '',
  search: '',
  userStatus: '',
});

const searchFieldOptions = ref([]);
const userStatusOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const currentLoginUserColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "User ID": trlang.value.user_id,
    "Partner": trlang.value.partner_column,
    "IP": trlang.value.ip,
    "Location": trlang.value.location,
    "Device": trlang.value.device,
    "Mobile": trlang.value.mobile,
    "Money(Point)": trlang.value.money_point,
    "Import Money": trlang.value.import_money,
    "Exchange Money": trlang.value.exchange_money,
    "Final Import Date": trlang.value.final_import_date,
    "Connect Date": trlang.value.connect_date,
    "Created Date": trlang.value.created_date,
  };
  return baseCurrentLoginUserColumn.map(col => ({
    ...col,
    title: titleMap[col.title] || col.title
  }));
});

const rowKey = (record) => record.key || record.user_id;

const initOptions = () => {
  filters.value.searchField = '';
  searchFieldOptions.value = [
    { value: '', label: trlang.value.all },
    { value: 'user_nickname', label: trlang.value.user_nickname_label },
    { value: 'user_id', label: trlang.value.user_id_label },
    { value: 'partner', label: trlang.value.partner },
    { value: 'ip_address', label: trlang.value.ip },
    { value: 'location', label: trlang.value.location },
    { value: 'organ', label: trlang.value.organ },
  ];

  filters.value.userStatus = '';
  userStatusOptions.value = [
    { value: '', label: trlang.value.all_users_label },
    { value: 'wait', label: trlang.value.wait },
    { value: 'normal', label: trlang.value.normal },
    { value: 'stop', label: trlang.value.stop },
    { value: 'cancel', label: trlang.value.cancel },
    { value: 'danger', label: trlang.value.danger },
    { value: 'tester', label: trlang.value.tester },
  ];
};

const buildQuery = () => {
  const params = new URLSearchParams({
    searchField: filters.value.searchField || '',
    search: filters.value.search || '',
    userStatus: filters.value.userStatus || '',
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
      `${apiLink.get_current_loggedin_user}?${buildQuery()}`
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
      dataSource.value = [];
      setTotal(0);
    }
  } catch (error) {
    console.error('Error fetching current login users:', error);
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
    range: null,
    searchField: '',
    search: '',
    userStatus: '',
  };
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
