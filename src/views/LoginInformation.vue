<template>
  <a-layout class="bg-white px-5">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.login_information }}
    </a-typography-text>
  </a-layout>

  <a-layout class="p-2 flex flex-column gap-2">
    <a-layout-header class="bg-white flex items-center gap-2 shadow">
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
    </a-layout-header>

    <a-layout-content class="bg-white p-2 shadow">
      <a-table :columns="loginInformationColumn" :data-source="dataSource" row-key="key" class="w-100"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined" :pagination="paginationConfig"
        @change="handleTableChange">
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            {{ index + 1 }}
          </template>

          <template v-if="column.key === 'user_id'">
            <span>
              {{ record.own_partner_nickname || record.user_nickname }}
            </span>
            <span> ({{ record.own_partner_id || record.user_id }}) </span>
            <span :class="record.own_partner_nickname
              ? 'bg-gray text-white p-1 radius-1'
              : ''
              ">
              {{
                record.own_partner_nickname
                  ? trlang[record.own_partner_role]
                  : ''
              }}
            </span>
          </template>

          <template v-if="column.key === 'distributor'">
            <a-typography-text :class="record.own_partner_nickname || record.partner_nickname
              ? 'bg-yellow border radius-1 flex flex-column'
              : ''
              ">
              {{
                record.own_partner_nickname || record.partner_nickname || '-'
              }}
              <span class="bg-white radius-bottom-1">
                {{ record.own_partner_id ? '' : record.partner_id || '' }}
              </span>
            </a-typography-text>
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
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { loginInformationColumn as baseLoginInformationColumn } from '@/utils/table-column/login-information';
import { getData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.login_information.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const startDate = ref('');
const endDate = ref('');
const searchField = ref('');
const search = ref('');
const searchFieldOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const loginInformationColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "id": trlang.value.id,
    "distributor": trlang.value.distributor_label,
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
  searchField.value = '';
  searchFieldOptions.value = [
    { value: '', label: trlang.value.search_term },
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
    startDate: startDate.value || '',
    endDate: endDate.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

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
