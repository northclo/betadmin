<template>
  <a-layout class="bg-white px-5">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.current_loggedin_users }}
    </a-typography-text>
  </a-layout>

  <a-layout class="p-2 flex flex-column gap-2">
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
          :placeholder="trlang.search_placeholder"
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
            <div v-if="record.last_import_date" class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.last_import_date.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
                {{ record.last_import_date.split('T')[1]?.split('.')[0] }}
              </a-typography-text>
            </div>
            <span v-else>-</span>
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
            <div v-if="record.last_login_history?.createdAt" class="flex flex-column">
              <a-typography-text class="font-bold">
                {{ record.last_login_history.createdAt.split('T')[0] }}
              </a-typography-text>
              <a-typography-text>
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
import { SearchOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { currentLoginUserColumn as baseCurrentLoginUserColumn } from '@/utils/table-column/current-login-user.js';
import { getData, postData } from '@/helpers/Axios';
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

const currentLoginUserColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "Disconnect": trlang.value.disconnect,
    "ID(Nickname)": trlang.value.id_nickname,
    "Partner": trlang.value.partner_column,
    "IP": trlang.value.ip,
    "Location": trlang.value.location,
    "Device": trlang.value.device,
    "Mobile": trlang.value.mobile,
    "Money(Point)": trlang.value.money_point,
    "Import Money": trlang.value.import_money,
    "Exchange Money": trlang.value.exchange_money,
    "User's Import": trlang.value.user_import,
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
  searchField.value = '';
  searchFieldOptions.value = [
    { value: '', label: trlang.value.search_term },
    { value: 'user_nickname', label: trlang.value.user_nickname_label },
    { value: 'user_id', label: trlang.value.user_id_label },
    { value: 'partner', label: trlang.value.partner },
    { value: 'ip_address', label: trlang.value.ip },
    { value: 'location', label: trlang.value.location },
    { value: 'organ', label: trlang.value.organ },
  ];

  userStatus.value = '';
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
    } else {
      dataSource.value = [];
      setTotal(0);
    }
  } catch (error) {
    console.error('Error fetching current login users:', error);
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


const logoutUser = async (user_nickname) => {
  try {
    const result = await postData(apiLink.logout_user, {
      user_nickname,
    });

    if (result.status) {
      fetchData();
    }
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

onMounted(() => {
  initOptions();
  fetchData();
});
</script>
