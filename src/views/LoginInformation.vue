<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.login_information }}
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
                @change="handleFilterChange"
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

    <div class="flex items-center justify-between mb-4">
      <span class="fs-4 font-semibold">{{ trlang.login_information }}</span>
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
        :columns="loginInformationColumn" 
        :data-source="dataSource" 
        row-key="key" 
        class="w-100"
        :pagination="paginationConfig"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :loading="loading" 
        @change="handleTableChange">
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>
          <template v-if="column.key === 'user_id'">
            <span>
              {{ record.user_nickname }}
            </span>
          </template>
          <template v-if="column.key === 'ip_address'">
            <a-typography-text>{{ record.ip_address }}</a-typography-text>
            <a-typography-text
              v-if="record.block_ip"
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

          <template v-if="column.key === 'mobile'">
            <a-typography-text>{{ record.mobile ? 'Y' : 'N' }}</a-typography-text>
          </template>

          <template v-if="column.key === 'login_time'">
            <a-typography-text>{{ record.login_time ? dayjs(record.login_time).format('YYYY-MM-DD HH:mm') : '' }}</a-typography-text>
          </template>
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
import { loginInformationColumn as baseLoginInformationColumn } from '@/utils/table-column/login-information';
import { getData, postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.login_information.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  range: null,
  searchField: '',
  search: '',
});

const searchFieldOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);
const bulkDeleteLoading = ref(false);
const selectedRowKeys = ref([]);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const loginInformationColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "id": trlang.value.id,
    "IP": trlang.value.ip,
    "location": trlang.value.location,
    "organ": trlang.value.organ,
    "mobile": trlang.value.mobile,
    "login_time": trlang.value.login_time,
  };
  return baseLoginInformationColumn.map(col => ({
    ...col,
    title: titleMap[col.title] || col.title
  }));
});

const initOptions = () => {
  filters.value.searchField = '';
  searchFieldOptions.value = [
    { value: 'user_nickname', label: trlang.value.user_nickname_label },
    { value: 'user_id', label: trlang.value.user_id_label },
    { value: 'distributor', label: trlang.value.distributor_label },
    { value: 'ip_address', label: trlang.value.ip },
    { value: 'location', label: trlang.value.location },
    { value: 'organ', label: trlang.value.organ },
  ];
};

const buildQuery = () => {
  const params = new URLSearchParams({
    searchField: filters.value.searchField || '',
    search: filters.value.search || '',
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
      `${apiLink.get_login_information}?${buildQuery()}`
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
    console.error('Error fetching login information:', error);
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
  };
  paginationConfig.value.current = 1;
  fetchData();
};

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const handleBulkDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.error(trlang.value.please_select_items_to_delete);
    return;
  }

  bulkDeleteLoading.value = true;
  try {
    const res = await postData(`${apiLink.bulk_delete_login_information}`, {
      ids: selectedRowKeys.value,
    });

    if (res.status) {
      message.success(res.message || trlang.value.successfully_deleted_items.replace('{count}', selectedRowKeys.value.length.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
  } catch (error) {
    console.error('Error bulk deleting login information:', error);
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
  fetchData();
});
</script>
