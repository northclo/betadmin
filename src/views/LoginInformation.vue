<template>
  <a-layout class="bg-white px-5 sticky-header">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.login_information }}
    </a-typography-text>
  </a-layout>

  <a-layout class="p-2 flex flex-column gap-2">
    <!-- Filters -->
    <a-layout-header class="bg-white flex items-center gap-2 shadow">
      <a-typography-text>{{ trlang.start_date }}</a-typography-text>
      <a-date-picker
        v-model:value="startDate"
        class="input-lg"
        format="YYYY-MM-DD"
        valueFormat="YYYY-MM-DD"
        @change="fetchData"
      />
      <a-typography-text>~</a-typography-text>
      <a-typography-text>{{ trlang.end_date }}</a-typography-text>
      <a-date-picker
        v-model:value="endDate"
        class="input-lg"
        format="YYYY-MM-DD"
        valueFormat="YYYY-MM-DD"
        @change="fetchData"
      />
      <a-select
        v-model:value="searchField"
        :options="searchFieldOptions"
        class="input-lg"
      />
      <a-input
        v-model:value="search"
        placeholder="Search..."
        class="input-lg"
        @pressEnter="fetchData"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <a-button type="primary" @click="fetchData">{{ trlang.search }}</a-button>
    </a-layout-header>

    <!-- Table -->
    <a-layout-content class="bg-white p-2 shadow">
      <a-table
        :columns="loginInformationColumn"
        :dataSource="dataSource"
        rowKey="key"
        class="w-100"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined"
        :pagination="paginationConfig"
        @change="handleTableChange"
      >
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <!-- No -->
          <template v-if="column.key === 'no'">
            {{ index + 1 }}
          </template>

          <!-- User -->
          <template v-if="column.key === 'user_id'">
            <span>
              {{ record.own_partner_nickname || record.user_nickname }}
            </span>
            <span> ({{ record.own_partner_id || record.user_id }}) </span>
            <span
              :class="
                record.own_partner_nickname
                  ? 'bg-gray text-white p-1 radius-1'
                  : ''
              "
            >
              {{
                record.own_partner_nickname
                  ? trlang[record.own_partner_role]
                  : ''
              }}
            </span>
          </template>

          <!-- Distributor -->
          <template v-if="column.key === 'distributor'">
            <a-typography-text
              :class="
                record.own_partner_nickname || record.partner_nickname
                  ? 'bg-yellow border radius-1 flex flex-column'
                  : ''
              "
            >
              {{
                record.own_partner_nickname || record.partner_nickname || '-'
              }}
              <span class="bg-white radius-bottom-1">
                {{ record.own_partner_id ? '' : record.partner_id || '' }}
              </span>
            </a-typography-text>
          </template>

          <!-- IP -->
          <template v-if="column.key === 'ip_address'">
            <a-typography-text>{{ record.ip_address }}</a-typography-text>
            <a-button
              class="bg-gray text-white ms-2"
              @click="changeBlockIp(record.ip_address, record.block_ip)"
            >
              {{ record.block_ip ? trlang.ip_allow : trlang.ip_blocking }}
            </a-button>
          </template>

          <!-- Mobile -->
          <template v-if="column.key === 'mobile'">
            <a-typography-text>{{ record.mobile && 'Y' }}</a-typography-text>
          </template>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { loginInformationColumn } from '@/utils/table-column/login-information';
import { getData, putData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.login_information.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

// Filters
const startDate = ref('');
const endDate = ref('');
const searchField = ref('');
const search = ref('');
const searchFieldOptions = ref([]);

// Table Data
const dataSource = ref([]);
const loading = ref(false);

// ✅ Use pagination composable
const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const initOptions = () => {
  searchFieldOptions.value = [
    { value: '', label: '--Search term--' },
    { value: 'user_nickname', label: 'User nickname' },
    { value: 'user_id', label: 'User ID' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'ip_address', label: 'IP' },
    { value: 'location', label: 'Location' },
    { value: 'organ', label: 'Organ' },
  ];
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getData(
      `${apiLink.get_login_information}?startDate=${startDate.value}&endDate=${endDate.value}&searchField=${searchField.value}&search=${search.value}&page=${paginationConfig.value.current}&limit=${paginationConfig.value.pageSize}`
    );

    if (res.status) {
      dataSource.value = res.data || [];
      if (res.total) setTotal(res.total); // ✅ update total if backend provides
    }
  } finally {
    loading.value = false;
  }
};

// Watch pagination changes -> refetch data
watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  fetchData
);

const changeBlockIp = async (ip, block) => {
  const result = await putData(apiLink.block_ip, {
    ip: ip,
    block: block,
  });

  if (result.status) {
    fetchData();
  }
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
