<template>
  <a-layout class="bg-white px-5">
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
          placeholder="Search..."
          class="input-lg"
          @press-enter="handleFilterChange"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-button type="primary" @click="handleFilterChange">{{
          trlang.search
        }}</a-button>
      </a-layout>
      <a-layout class="bg-white flex flex-row items-center justify-end gap-2">
        <a-typography-text>{{ trlang.user_status }}</a-typography-text>
        <a-select
          v-model:value="userStatus"
          :options="userStatusOptions"
          class="input-lg"
          @change="handleFilterChange"
        />
      </a-layout>
    </a-layout-header>

    <!-- Table -->
    <a-layout-content class="bg-white p-2 shadow">
      <a-table
        :columns="currentLoginUserColumn"
        :data-source="dataSource"
        :row-key="rowKey"
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
            <LogoutOutlined
              class="cursor-pointer"
              @click="logoutUser(record.user_nickname)"
            />
          </template>

          <template v-if="column.key === 'id_nickname'">
            <div class="flex flex-column">
              <div>
                <a-typography-text class="me-2">{{
                  record.user_nickname
                }}</a-typography-text>
                <a-typography-text>({{ record.user_id }})</a-typography-text>
              </div>
              <a-typography-text class="bg-gray text-white px-2 w-fit radius-2">
                {{
                  trlang[
                    record.own_partner
                      ? record.own_partner.role
                      : record.partner?.role
                  ]
                }}
              </a-typography-text>
            </div>
          </template>

          <template v-if="column.key === 'partner'">
            <a-typography-text
              :class="
                record.own_partner || record.partner
                  ? 'bg-yellow border radius-2 px-2'
                  : ''
              "
            >
              {{
                record.own_partner
                  ? record.own_partner.nickname
                  : record.partner?.nickname
              }}
            </a-typography-text>
          </template>

          <!-- IP -->
          <template v-if="column.key === 'ip_address'">
            <a-typography-text>{{
              record.last_login_history?.ip_address
            }}</a-typography-text>
            <a-button
              v-if="record.last_login_history?.ip_address"
              class="bg-gray text-white ms-2"
              @click="
                changeBlockIp(
                  record.last_login_history?.ip_address,
                  record.blockedIp
                )
              "
            >
              {{ record.blockedIp ? trlang.allow_ip : trlang.block_ip }}
            </a-button>
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
                >{{ record.own_money.toLocaleString() }}USD</a-typography-text
              >
              <a-typography-text
                >{{ record.point.toLocaleString() }}P</a-typography-text
              >
            </div>
          </template>

          <template v-if="column.key === 'import_money'">
            {{ record.total_import_amount || 0 }}USD
          </template>

          <template v-if="column.key === 'exchange_money'">
            {{ record.total_exchange_amount || 0 }}USD
          </template>

          <template v-if="column.key === 'user_import'">
            {{ record.user_import_amount || 0 }}USD
          </template>

          <template v-if="column.key === 'final_import_date'">
            <div class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.last_import_date?.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{ record.last_import_date?.split('T')[1].split('.')[0] }}
              </a-typography-text>
            </div>
          </template>

          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column">
              <a-typography-text class="font-bold">{{
                record.createdAt.split('T')[0]
              }}</a-typography-text>
              <a-typography-text>{{
                record.createdAt.split('T')[1].split('.')[0]
              }}</a-typography-text>
            </div>
          </template>

          <template v-if="column.key === 'connect_date'">
            <div class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.last_login_history?.createdAt.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{
                  record.last_login_history?.createdAt
                    .split('T')[1]
                    .split('.')[0]
                }}
              </a-typography-text>
            </div>
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
import { getData, postData, putData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.current_login_user.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const startDate = ref('');
const endDate = ref('');
const searchField = ref('');
const search = ref('');
const searchFieldOptions = ref([]);
const userStatus = ref('');
const userStatusOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);

const rowKey = (record) => record.key || record.user_id;

const initOptions = () => {
  searchField.value = '';
  searchFieldOptions.value = [
    { value: '', label: '--Search term--' },
    { value: 'user_nickname', label: 'User nickname' },
    { value: 'user_id', label: 'User ID' },
    { value: 'partner', label: 'Partner' },
    { value: 'ip_address', label: 'IP' },
    { value: 'location', label: 'Location' },
    { value: 'organ', label: 'Organ' },
  ];

  userStatus.value = '';
  userStatusOptions.value = [
    { value: '', label: 'All users' },
    { value: 'wait', label: 'Wait' },
    { value: 'normal', label: 'Normal' },
    { value: 'stop', label: 'Stop' },
    { value: 'cancel', label: 'Cancel' },
    { value: 'danger', label: 'Danger' },
    { value: 'tester', label: 'Tester' },
  ];
};

const buildQuery = () => {
  const params = new URLSearchParams({
    startDate: startDate.value || '',
    endDate: endDate.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
    userStatus: userStatus.value || '',
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

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

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

const changeBlockIp = async (ip, block) => {
  const result = await putData(apiLink.block_ip, {
    ip,
    block,
  });

  if (result.status) {
    fetchData();
  }
};

const logoutUser = async (user_nickname) => {
  const result = await postData(apiLink.logout_user, {
    user_nickname,
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
