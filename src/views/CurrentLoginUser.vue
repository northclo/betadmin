<template>
  <a-layout class="bg-white px-5 sticky-header">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.current_loggedin_users }}
    </a-typography-text>
  </a-layout>

  <a-layout class="p-2 flex flex-column gap-2">
    <!-- Filters -->
    <a-layout-header class="bg-white flex justify-between shadow px-5">
      <a-layout class="bg-white flex flex-row items-center gap-2">
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
        <a-button type="primary" @click="fetchData">{{
          trlang.search
        }}</a-button>
      </a-layout>
      <a-layout class="bg-white flex flex-row items-center justify-end gap-2">
        <a-typography-text>{{ trlang.user_status }}</a-typography-text>
        <a-select
          v-model:value="searchField"
          :options="searchFieldOptions"
          class="input-lg"
        />
      </a-layout>
    </a-layout-header>

    <!-- Table -->
    <a-layout-content class="bg-white p-2 shadow">
      <a-table
        :columns="currentLoginUserColumn"
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

          <template v-if="column.key === 'disconnect'">
            <LogoutOutlined class="cursor-pointer" />
          </template>

          <!-- IP -->
          <template v-if="column.key === 'ip_address'">
            <a-typography-text>{{ record.ip_address }}</a-typography-text>
            <a-button
              class="bg-gray text-white ms-2"
              @click="changeBlockIp(record.ip_address, record.block_ip)"
            >
              {{ record.block_ip ? trlang.allow_ip : trlang.block_ip }}
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
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { currentLoginUserColumn } from '@/utils/table-column/current-login-user.js';
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
    const res = await getData(`${apiLink.get_current_loggedin_user}`);

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
