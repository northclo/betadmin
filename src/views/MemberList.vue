<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.member_list }}
      </a-typography-title>
    </div>
    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="5">
            <a-form-item class="mb-0" :label="trlang.duration">
              <a-select
                v-model:value="duration"
                :options="durationOptions"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.date_range">
              <a-range-picker
                v-model:value="filters.range"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.user_status">
              <a-select
                v-model:value="userStatus"
                :options="userStatusOptions"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-tree-select
                v-model:value="filters.partnerId"
                :tree-data="partnerTreeOptions"
                :placeholder="trlang.select_partner"
                allow-clear
                tree-default-expand-all
                :field-names="{ children: 'children', label: 'title', value: 'value' }"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.include_sub_partners">
              <a-checkbox v-model:checked="filters.includeSubPartners" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-select
                v-model:value="searchField"
                :options="searchFieldOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.keyword">
              <a-input
                v-model:value="search"
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
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.sort">
              <a-select
                v-model:value="sort"
                :options="sortOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-form-item class="mb-0">
              <a-space>
                <a-button type="primary" class="bg-main text-white" :loading="loadingSearch" @click="handleFilterChange">
                  {{ trlang.search }}
                </a-button>
                <a-button @click="resetFilters">
                  {{ trlang.reset }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <div class="status-summary-bar flex items-center gap-4 mb-4">
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('')"
      >
        <SmileOutlined class="text-gray-500" />
        <span class="text-sm">
          {{ trlang.all_users }} :
          <span class="font-bold text-blue-600">{{ statusCounts.all }}</span>
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('normal')"
      >
        <CheckCircleOutlined class="text-green-600" />
        <span class="text-sm">
          {{ trlang.normal }} :
          <span class="font-bold text-green-600">{{ statusCounts.normal }}</span>
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('wait')"
      >
        <MinusCircleOutlined class="text-gray-500" />
        <span class="text-sm">
          {{ trlang.wait }} :
          <span class="font-bold text-gray-500">{{ statusCounts.wait }}</span>
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('stop')"
      >
        <QuestionCircleOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.stop }} :
          <span class="font-bold text-red-600">{{ statusCounts.stop }}</span>
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('cancel')"
      >
        <CloseCircleOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.cancel }} :
          <span class="font-bold text-red-600">{{ statusCounts.cancel }}</span>
        </span>
      </div>
      <div
        class="status-item flex items-center gap-2 cursor-pointer"
        @click="handleStatusClick('danger')"
      >
        <UserDeleteOutlined class="text-red-600" />
        <span class="text-sm">
          {{ trlang.danger }} :
          <span class="font-bold text-red-600">{{ statusCounts.danger }}</span>
        </span>
      </div>
      <div class="flex-1" />
      <a-button
        class="bg-gray-200 text-gray-700 border-none"
        @click="handleBlockIps"
      >
        {{ trlang.block_ips }}
      </a-button>
    </div>

    <div class="action-buttons-bar flex items-center gap-2 mb-4 flex-wrap">
      <a-button
        size="small"
        class="bg-gray-200 text-gray-700 border-none text-sm"
        :disabled="selectedRowKeys.length === 0"
        @click="handleBulkUpdateStatus('normal')"
        :loading="bulkUpdateLoading === 'normal'"
      >
        {{ trlang.update_selected_user_status_normal }}
      </a-button>
      <a-button
        size="small"
        class="bg-green-500 text-white border-none"
        :disabled="selectedRowKeys.length === 0"
        @click="handleBulkUpdateStatus('stop')"
        :loading="bulkUpdateLoading === 'stop'"
      >
        {{ trlang.update_selected_user_status_normal_stop }}
      </a-button>
      <a-button
        size="small"
        class="bg-green-500 text-white border-none"
        :disabled="selectedRowKeys.length === 0"
        @click="handleBulkUpdateStatus('cancel')"
        :loading="bulkUpdateLoading === 'cancel'"
      >
        {{ trlang.update_selected_user_status_normal_cancel }}
      </a-button>
      <a-button
        size="small"
        class="bg-gray-200 text-gray-700 border-none"
        :disabled="selectedRowKeys.length === 0"
        @click="handleSendNotesToSelected"
        :loading="sendNotesLoading"
      >
        {{ trlang.send_notes_to_selected_users }}
      </a-button>
      <a-button
        size="small"
        class="bg-gray-200 text-gray-700 border-none"
        @click="handleSendNotesToAll"
        :loading="sendNotesLoading"
      >
        {{ trlang.send_notes_to_all_users }}
      </a-button>
      <a-button
        size="small"
        class="bg-gray-200 text-gray-700 border-none"
        :disabled="selectedRowKeys.length === 0"
        @click="handleActiveConsiderUser"
        :loading="considerUserLoading === 'active'"
      >
        {{ trlang.active_selected_user_to_consider }}
      </a-button>
      <a-button
        size="small"
        class="bg-gray-200 text-gray-700 border-none"
        :disabled="selectedRowKeys.length === 0"
        @click="handleDeactiveConsiderUser"
        :loading="considerUserLoading === 'deactive'"
      >
        {{ trlang.deactive_selected_consider_user }}
      </a-button>
    </div>

    <div class="table-wrapper">
      <a-table
        :columns="memberListColumn"
        :data-source="dataSource"
        :row-key="rowKey"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        class="w-100 table-transparent"
        :pagination="paginationConfig"
        @change="handleTableChange"
        :loading="loading"
      >
        <template #emptyText>
          <a-spin v-if="loading" />
          <span v-else>{{ trlang.no_data }}</span>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'no'">
            <a-typography-text>{{ (paginationConfig.current - 1) * paginationConfig.pageSize + index + 1 }}</a-typography-text>
          </template>
          <template v-if="column.key === 'login'">
            <div
              class="flex items-center gap-2"
              :class="record.login_status ? '' : 'text-light-gray'"
            >
              <LogoutOutlined />
              <a-typography-text>
                {{
                  record.login_status ? trlang.connected : trlang.no_connected
                }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'user_id'">
            <div class="flex flex-column">
              <a-typography-text>
                  {{ record.user_name || record.partner_id || '-' }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'partner'">
            <a-typography-text>
              {{ record.partner?.nickname || '-' }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.user_status)">
              {{ trlang[record.user_status] || record.user_status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'owned_money'">
            <a-typography-text class="text-red">
              {{ (record.own_money || 0).toLocaleString() }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'all_import_money'">
            {{
              record.totalImportAmount
                ? record.totalImportAmount.toLocaleString()
                : 0
            }}{{ trlang.global_currency }}
          </template>
          <template v-if="column.key === 'all_exchange_money'">
            {{
              record.totalExchangeAmount
                ? record.totalExchangeAmount.toLocaleString()
                : 0
            }}{{ trlang.global_currency }}
          </template>
          <template v-if="column.key === 'partner_earning'">
            {{
              record.totalPartnerEarning
                ? record.totalPartnerEarning.toLocaleString()
                : 0
            }}{{ trlang.global_currency }}
          </template>
          <template v-if="column.key === 'total_betting_amount'">
            <a-typography-text class="text-main">
              {{
                record.totalBettingAmount
                  ? record.totalBettingAmount.toLocaleString()
                  : 0
              }}{{ trlang.global_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'total_win_number'">
            <a-typography-text class="text-red">
              {{ record.totalWinCount ? record.totalWinCount : 0 }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'total_earning_money'">
            <a-typography-text class="text-dark-main">
              {{
                record.totalEarningAmount
                  ? record.totalEarningAmount.toLocaleString()
                  : 0
              }}{{ trlang.global_currency }}
            </a-typography-text>
          </template>
          <template v-if="column.key === 'betting_provide_point'">
            {{ (record.point || 0).toLocaleString() }}{{ trlang.points_unit }}
          </template>
          <template v-if="column.key === 'connect_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ formatDate(record.login_history?.createdAt).date }}
              </a-typography-text>
              <a-typography-text>
                {{ formatDate(record.login_history?.createdAt).time }}
              </a-typography-text>
            </div>
          </template>
          <template v-if="column.key === 'created_date'">
            <div class="flex flex-column justify-center items-center">
              <a-typography-text class="font-bold">
                {{ formatDate(record.createdAt).date }}
              </a-typography-text>
              <a-typography-text>
                {{ formatDate(record.createdAt).time }}
              </a-typography-text>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-layout>

  <a-modal
    v-model:open="editModalVisible"
    :title="trlang.edit_user"
    @ok="handleSaveEdit"
    @cancel="handleCancelEdit"
    :confirm-loading="loadingEdit"
  >
    <a-form :model="editForm" layout="vertical">
      <a-form-item :label="trlang.user_status">
        <a-select
          v-model:value="editForm.user_status"
          :options="userStatusOptions"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="blockIpModalVisible"
    :title="trlang.block_ip"
    :footer="null"
    width="800px"
    @cancel="handleCloseBlockIpModal"
  >
    <div>
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <p class="text-lg font-semibold">{{ trlang.register_blocking_ip }}</p>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <a-typography-text class="min-w-[120px]">{{ trlang.blocking_ip }}</a-typography-text>
          <a-input
            v-model:value="newBlockedIp"
            :placeholder="trlang.enter_ip_address"
            class="flex-1"
            @press-enter="handleRegisterIp"
          />
          <a-button
            type="primary"
            class="bg-gray-200 text-gray-700 border-none"
            @click="handleRegisterIp"
            :loading="loadingRegisterIp"
          >
            <template #icon><CheckOutlined /></template>
            {{ trlang.register }}
          </a-button>
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2 mb-4">
          <RightOutlined class="text-gray-500" />
          <p class="text-lg font-semibold">{{ trlang.blocked_ip_list }}</p>
        </div>
        <a-table
          :columns="blockedIpColumns"
          :data-source="paginatedBlockedIpList"
          :pagination="blockedIpPaginationConfig"
          :loading="loadingBlockedIps"
          row-key="id"
          @change="handleBlockedIpTableChange"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'no'">
              <a-typography-text>{{ (blockedIpPaginationConfig.current - 1) * blockedIpPaginationConfig.pageSize + index + 1 }}</a-typography-text>
            </template>
            <template v-if="column.key === 'ip'">
              {{ record.ip_address }}
            </template>
            <template v-if="column.key === 'registration_date'">
              {{ formatRegistrationDate(record.registration_date) }}
            </template>
            <template v-if="column.key === 'remove'">
              <a-button
                class="bg-gray-200 text-gray-700 border-none"
                @click="handleRemoveIp(record.id)"
                :loading="loadingRemoveIp[record.id]"
              >
                <template #icon><CheckOutlined /></template>
                {{ trlang.remove }}
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

      <div class="flex justify-center mt-4">
        <a-button
          class="bg-gray-200 text-gray-700 border-none"
          @click="handleCloseBlockIpModal"
        >
          <template #icon><CloseOutlined /></template>
          {{ trlang.close }}
        </a-button>
      </div>
    </div>
  </a-modal>

  <a-modal
    v-model:open="sendNotesModalVisible"
    :title="trlang.send_notes_to_users"
    :ok-text="trlang.send"
    :cancel-text="trlang.cancel"
    @ok="handleSendNotesSubmit"
    @cancel="handleCancelSendNotes"
    :confirm-loading="sendNotesLoading"
  >
    <a-layout class="mt-5">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.title }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-input v-model:value="sendNotesForm.title" />
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.author }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-typography-text>{{ currentPartner?.partner_id || currentPartner?.id || trlang.administrator }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.recipient }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-typography-text>
          {{ sendNotesForm.targetUsers === 'selected' 
            ? `${trlang.send_notes_to_selected_users} (${selectedRowKeys.length} ${trlang.people})`
            : trlang.send_notes_to_all_users }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.detail }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-textarea :rows="5" v-model:value="sendNotesForm.content" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.expiration_period }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex flex-column">
        <a-select
          v-model:value="sendNotesForm.expire"
          class="w-100"
          :options="expireOptions"
        />
        <p class="text-dark-brown mt-1">
          *{{ trlang.when_set_messages_will_be_automatically_deleted_after_the_specified_period }}
        </p>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, computed, inject, watch } from 'vue';
import {
  SearchOutlined,
  LogoutOutlined,
  SmileOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined,
  UserDeleteOutlined,
  RightOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { memberListColumn as baseMemberListColumn } from '@/utils/table-column/member-list.js';
import { getData, putData, deleteData, postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePagination } from '@/composables/usePagination';

defineOptions({
  name: routeLink.member_list.name,
});

const langState = inject('langState');
const trlang = computed(() => langState.translations);

const filters = ref({
  range: null,
  partnerId: null,
  includeSubPartners: false,
});

const duration = ref('');
const durationOptions = ref([]);
const userStatus = ref('');
const userStatusOptions = ref([]);
const partnerTreeOptions = ref([]);
const search = ref('');
const searchField = ref('');
const searchFieldOptions = ref([]);
const sort = ref('');
const sortOptions = ref([]);

const dataSource = ref([]);
const loading = ref(false);
const selectedRowKeys = ref([]);
const statusCounts = ref({
  all: 0,
  normal: 0,
  wait: 0,
  stop: 0,
  cancel: 0,
  danger: 0,
  tester: 0,
});

const blockIpModalVisible = ref(false);
const newBlockedIp = ref('');
const blockedIpListFull = ref([]);
const loadingBlockedIps = ref(false);
const loadingSearch = ref(false);
const loadingRegisterIp = ref(false);
const loadingRemoveIp = ref({});
const editModalVisible = ref(false);
const editForm = ref({
  _id: null,
  user_status: '',
});
const loadingEdit = ref(false);
const bulkUpdateLoading = ref('');
const sendNotesLoading = ref(false);
const considerUserLoading = ref('');
const sendNotesModalVisible = ref(false);
const sendNotesForm = ref({
  title: '',
  content: '',
  targetUsers: 'selected', // 'selected' or 'all'
  expire: '0',
});
const expireOptions = ref([]);
const currentPartner = ref(null);

const blockedIpColumns = computed(() => [
  {
    title: trlang.value.no_column,
    dataIndex: 'no',
    key: 'no',
    width: 80,
    align: 'center',
  },
  {
    title: trlang.value.ip,
    dataIndex: 'ip_address',
    key: 'ip',
  },
  {
    title: trlang.value.registration_date,
    dataIndex: 'registration_date',
    key: 'registration_date',
  },
  {
    title: trlang.value.remove,
    key: 'remove',
    align: 'center',
  },
]);

const { paginationConfig, handleTableChange, setTotal } = usePagination(10);
const { 
  paginationConfig: blockedIpPaginationConfig, 
  handleTableChange: handleBlockedIpTableChange, 
  setTotal: setBlockedIpTotal 
} = usePagination(10);

const memberListColumn = computed(() => {
  const titleMap = {
    "No": trlang.value.no_column,
    "Login": trlang.value.login_column,
    "User Id": trlang.value.user_id,
    "Nickname(Id)": trlang.value.nickname_id,
    "Partner": trlang.value.partner_column,
    "Status": trlang.value.status_column,
    "Owned Money": trlang.value.owned_money,
    "All Import Money": trlang.value.all_import_money,
    "All Exchange Money": trlang.value.all_exchange_money,
    "Partner Earning": trlang.value.partner_earning,
    "Total Betting Amount": trlang.value.total_betting_amount,
    "Total Win Number": trlang.value.total_win_number,
    "Total Earning Money": trlang.value.total_earning_money,
    "Betting Provide Point": trlang.value.betting_provide_point,
    "Connect Date": trlang.value.connect_date,
    "Created Date": trlang.value.created_date,
  };
  return baseMemberListColumn.map(col => ({
    ...col,
    title: titleMap[col.title] || col.title
  }));
});

const initExpireOptions = () => {
  expireOptions.value = [
    { value: '0', label: trlang.value.no_period_set },
    { value: '1 day', label: trlang.value.one_day },
    { value: '3 days', label: trlang.value.three_days },
    { value: '1 week', label: trlang.value.a_week },
    { value: 'moon', label: trlang.value.full_moon },
    { value: '1 month', label: trlang.value.one_month },
    { value: '1 hour', label: trlang.value.one_hour },
    { value: '3 hours', label: trlang.value.three_hours },
    { value: '6 hours', label: trlang.value.six_hours },
    { value: '12 hours', label: trlang.value.twelve_hours },
    { value: '30 minutes', label: trlang.value.thirty_minutes },
    { value: '5 minutes', label: trlang.value.five_minutes },
  ];
};

const initOptions = () => {
  duration.value = 'import_exchange_betting';
  durationOptions.value = [
    {
      value: 'import_exchange_betting',
      label: trlang.value.import_exchange_betting,
    },
    { value: 'created_date', label: trlang.value.created_date },
    { value: 'connected_date', label: trlang.value.connected_date },
    { value: 'last_import_date', label: trlang.value.last_import_date },
    {
      value: 'password_changed_date',
      label: trlang.value.password_changed_date,
    },
  ];
  userStatusOptions.value = [
    { value: 'wait', label: trlang.value.wait },
    { value: 'normal', label: trlang.value.normal },
    { value: 'stop', label: trlang.value.stop },
    { value: 'cancel', label: trlang.value.cancel },
    { value: 'danger', label: trlang.value.danger },
    { value: 'tester', label: trlang.value.tester },
  ];
  searchField.value = 'user_id';
  searchFieldOptions.value = [
    { value: 'user_id', label: trlang.value.id },
    { value: 'user_nickname', label: trlang.value.nickname },
    { value: 'memo', label: trlang.value.memo },
    { value: 'bank_owner', label: trlang.value.bank_owner },
    { value: 'phone_number', label: trlang.value.phone_number },
    { value: 'bank_account', label: trlang.value.bank_account },
    { value: 'recommended_user', label: trlang.value.recommended_user },
    { value: 'cash_remained_over', label: trlang.value.cash_remained_over },
    { value: 'cash_remained_under', label: trlang.value.cash_remained_under },
  ];
  sort.value = 'created_date';
  sortOptions.value = [
    { value: 'created_date', label: trlang.value.created_date },
    { value: 'owned_money', label: trlang.value.owned_money },
    { value: 'owned_point', label: trlang.value.owned_point },
    { value: 'connect_date', label: trlang.value.connect_date },
    { value: 'import_money', label: trlang.value.import_money },
    { value: 'exchange_money', label: trlang.value.exchange_money },
  ];
};

const rowKey = (record) => record.user_id || record.partner?._id;

const onSelectChange = (keys) => {
  selectedRowKeys.value = keys;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'normal':
      return 'green';
    case 'wait':
      return 'default';
    case 'stop':
      return 'red';
    case 'cancel':
      return 'red';
    case 'danger':
      return 'red';
    case 'tester':
      return 'blue';
    default:
      return 'default';
  }
};

const convertPartnerToTree = (partner) => {
  if (!partner || !partner.id) return null;
  
  const node = {
    title: `${partner.nickname} (${partner.partner_id || partner.id})`,
    value: partner.id,
    children: []
  };

  if (partner.subs && Array.isArray(partner.subs) && partner.subs.length > 0) {
    node.children = partner.subs
      .map(sub => convertPartnerToTree(sub))
      .filter(Boolean);
  }

  return node;
};

const fetchPartnerList = async () => {
  try {
    const res = await getData(apiLink.get_game_partner);
    if (res.status && res.data) {
      // Store current partner info (root partner)
      if (Array.isArray(res.data)) {
        // Find headquater or use first partner as root
        const rootPartner = res.data.find(p => p.role === 'headquater') || res.data[0] || null;
        currentPartner.value = rootPartner;
        partnerTreeOptions.value = res.data
          .map(partner => convertPartnerToTree(partner))
          .filter(Boolean);
      } else if (res.data) {
        // Single partner object (root partner)
        currentPartner.value = res.data;
        const tree = convertPartnerToTree(res.data);
        partnerTreeOptions.value = tree ? [tree] : [];
      } else {
        currentPartner.value = null;
        partnerTreeOptions.value = [];
      }
    } else {
      currentPartner.value = null;
      partnerTreeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching partner list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    currentPartner.value = null;
    partnerTreeOptions.value = [];
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) return { date: '-', time: '-' };
  const dateStr = typeof dateValue === 'string' ? dateValue : dateValue.toString();
  if (!dateStr.includes('T')) return { date: dateStr, time: '-' };
  const [date, timePart] = dateStr.split('T');
  if (!timePart) return { date, time: '-' };
  const timeWithoutMs = timePart.split('.')[0];
  const time = timeWithoutMs ? timeWithoutMs.split(':').slice(0, 2).join(':') : '-';
  return { date, time };
};

const formatRegistrationDate = (dateValue) => {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return '-';
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
};

const buildQuery = () => {
  const sortValue = sort.value || 'created_date';
  const formattedSort = sortValue.includes(':') ? sortValue : `${sortValue}:desc`;
  
  const params = new URLSearchParams({
    duration: duration.value || '',
    userStatus: userStatus.value || '',
    searchField: searchField.value || '',
    search: search.value || '',
    sort: formattedSort,
    page: paginationConfig.value.current.toString(),
    pageSize: paginationConfig.value.pageSize.toString(),
  });

  if (filters.value.partnerId) {
    params.set('partnerId', filters.value.partnerId);
  }

  if (filters.value.includeSubPartners) {
    params.set('includeSubPartners', 'true');
  }

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
      `${apiLink.member_list}?${buildQuery()}`
    );

    if (res && res.status) {
      const payload = res.data || {};
      dataSource.value = Array.isArray(payload.list) ? payload.list : [];
      setTotal(typeof payload.total === 'number' ? payload.total : 0);
      if (typeof payload.page === 'number' && payload.page > 0) {
        paginationConfig.value.current = payload.page;
      }
      if (typeof payload.pageSize === 'number' && payload.pageSize > 0) {
        paginationConfig.value.pageSize = payload.pageSize;
      }
      if (payload.statusCounts) {
        statusCounts.value = {
          all: payload.statusCounts.all || 0,
          normal: payload.statusCounts.normal || 0,
          wait: payload.statusCounts.wait || 0,
          stop: payload.statusCounts.stop || 0,
          cancel: payload.statusCounts.cancel || 0,
          danger: payload.statusCounts.danger || 0,
          tester: payload.statusCounts.tester || 0,
        };
      }
    } else {
      dataSource.value = [];
      setTotal(0);
      statusCounts.value = {
        all: 0,
        normal: 0,
        wait: 0,
        stop: 0,
        cancel: 0,
        danger: 0,
        tester: 0,
      };
    }
  } catch (error) {
    console.error('Error fetching member list:', error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    dataSource.value = [];
    setTotal(0);
  } finally {
    loading.value = false;
  }
};

const validateDateRange = () => {
  const range = filters.value.range;
  if (range && Array.isArray(range) && range.length === 2) {
    const [start, end] = range;
    if (start && end) {
      const startDate = dayjs.isDayjs(start) ? start : dayjs(start);
      const endDate = dayjs.isDayjs(end) ? end : dayjs(end);
      if (startDate.isAfter(endDate)) {
        message.error(trlang.value.end_date_must_be_after_start_date);
        return false;
      }
    }
  }
  return true;
};

const handleFilterChange = async () => {
  if (!validateDateRange()) {
    return;
  }
  loadingSearch.value = true;
  paginationConfig.value.current = 1;
  try {
    await fetchData();
  } finally {
    loadingSearch.value = false;
  }
};

const resetFilters = () => {
  duration.value = 'import_exchange_betting';
  filters.value.range = null;
  filters.value.partnerId = null;
  filters.value.includeSubPartners = false;
  userStatus.value = '';
  search.value = '';
  searchField.value = 'user_id';
  sort.value = 'created_date';
  paginationConfig.value.current = 1;
  fetchData();
};

watch(
  () => [paginationConfig.value.current, paginationConfig.value.pageSize],
  () => {
    fetchData();
  }
);

const handleStatusClick = (status) => {
  userStatus.value = status;
  paginationConfig.value.current = 1;
  fetchData();
};

const handleBlockIps = async () => {
  blockIpModalVisible.value = true;
  await fetchBlockedIps();
};

const fetchBlockedIps = async () => {
  loadingBlockedIps.value = true;
  try {
    const res = await getData(apiLink.get_blocked_ips);
    if (res && res.status) {
      blockedIpListFull.value = res.data?.list || [];
      setBlockedIpTotal(blockedIpListFull.value.length);
      blockedIpPaginationConfig.value.current = 1;
    } else {
      blockedIpListFull.value = [];
      setBlockedIpTotal(0);
    }
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    blockedIpListFull.value = [];
    setBlockedIpTotal(0);
  } finally {
    loadingBlockedIps.value = false;
  }
};

const paginatedBlockedIpList = computed(() => {
  const { current, pageSize } = blockedIpPaginationConfig.value;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  return blockedIpListFull.value.slice(start, end);
});

const handleRegisterIp = async () => {
  if (!newBlockedIp.value || !newBlockedIp.value.trim()) {
    message.error(trlang.value.enter_ip_address);
    return;
  }

  const ipAddress = newBlockedIp.value.trim();
  
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ipAddress)) {
    message.error(trlang.value.invalid_ip_address);
    return;
  }

  loadingRegisterIp.value = true;
  try {
    const res = await putData(apiLink.block_ip, {
      ip: ipAddress,
      block: true,
    });

    if (res && res.status) {
      message.success(res.message || trlang.value.ip_blocked_successfully);
      newBlockedIp.value = '';
      await fetchBlockedIps();
    }
  } catch (error) {
    console.error('Error blocking IP:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loadingRegisterIp.value = false;
  }
};

const handleRemoveIp = async (id) => {
  loadingRemoveIp.value[id] = true;
  try {
    const res = await deleteData(`${apiLink.remove_blocked_ip}/${id}`);
    if (res && res.status) {
      message.success(res.message || trlang.value.ip_removed_successfully);
      await fetchBlockedIps();
    }
  } catch (error) {
    console.error('Error removing IP:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loadingRemoveIp.value[id] = false;
  }
};

const handleCloseBlockIpModal = () => {
  blockIpModalVisible.value = false;
  newBlockedIp.value = '';
  blockedIpPaginationConfig.value.current = 1;
};

const handleCancelEdit = () => {
  editModalVisible.value = false;
  editForm.value = {
    _id: null,
    user_status: '',
  };
};

const handleSaveEdit = async () => {
  if (!editForm.value._id) {
    message.error(trlang.value.invalid_user_id);
    return;
  }

  loadingEdit.value = true;
  try {
    const res = await postData(apiLink.member_list, {
      _id: editForm.value._id,
      user_status: editForm.value.user_status,
    });

    if (res && res.status) {
      message.success(res.message || trlang.value.user_updated_successfully);
      editModalVisible.value = false;
      await fetchData();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loadingEdit.value = false;
  }
};

const handleBulkUpdateStatus = async (status) => {
  if (selectedRowKeys.value.length === 0) {
    message.warning(trlang.value.please_select_users);
    return;
  }

  bulkUpdateLoading.value = status;
  try {
    const updatePromises = selectedRowKeys.value.map(userId => 
      postData(apiLink.member_list, {
        _id: userId,
        user_status: status,
      })
    );

    const results = await Promise.allSettled(updatePromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value?.status).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      message.success(trlang.value.users_updated_successfully.replace('{count}', successCount.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
    if (failCount > 0) {
      message.warning(trlang.value.some_users_update_failed.replace('{count}', failCount.toString()));
    }
  } catch (error) {
    console.error('Error bulk updating users:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    bulkUpdateLoading.value = '';
  }
};

const handleSendNotesToSelected = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning(trlang.value.please_select_users);
    return;
  }
  sendNotesForm.value.targetUsers = 'selected';
  sendNotesForm.value.expire = '0';
  sendNotesModalVisible.value = true;
};

const handleSendNotesToAll = () => {
  sendNotesForm.value.targetUsers = 'all';
  sendNotesForm.value.expire = '0';
  sendNotesModalVisible.value = true;
};

const handleCancelSendNotes = () => {
  sendNotesModalVisible.value = false;
  sendNotesForm.value = {
    title: '',
    content: '',
    targetUsers: 'selected',
    expire: '0',
  };
};

const handleActiveConsiderUser = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning(trlang.value.please_select_users);
    return;
  }

  considerUserLoading.value = 'active';
  try {
    const updatePromises = selectedRowKeys.value.map(userId => 
      postData(apiLink.member_list, {
        _id: userId,
        consider_user: true,
      })
    );

    const results = await Promise.allSettled(updatePromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value?.status).length;

    if (successCount > 0) {
      message.success(trlang.value.users_activated_successfully.replace('{count}', successCount.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
  } catch (error) {
    console.error('Error activating consider users:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    considerUserLoading.value = '';
  }
};

const handleDeactiveConsiderUser = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning(trlang.value.please_select_users);
    return;
  }

  considerUserLoading.value = 'deactive';
  try {
    const updatePromises = selectedRowKeys.value.map(userId => 
      postData(apiLink.member_list, {
        _id: userId,
        consider_user: false,
      })
    );

    const results = await Promise.allSettled(updatePromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value?.status).length;

    if (successCount > 0) {
      message.success(trlang.value.users_deactivated_successfully.replace('{count}', successCount.toString()));
      selectedRowKeys.value = [];
      await fetchData();
    }
  } catch (error) {
    console.error('Error deactivating consider users:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    considerUserLoading.value = '';
  }
};

const handleSendNotesSubmit = async () => {
  if (!sendNotesForm.value.title || !sendNotesForm.value.content) {
    message.error(trlang.value.please_input_title_and_message);
    return;
  }

  sendNotesLoading.value = true;
  try {
    const userIds = sendNotesForm.value.targetUsers === 'selected' 
      ? selectedRowKeys.value 
      : null;
    const sendToAll = sendNotesForm.value.targetUsers === 'all';

    if (sendNotesForm.value.targetUsers === 'selected' && (!userIds || userIds.length === 0)) {
      message.warning(trlang.value.please_select_users);
      sendNotesLoading.value = false;
      return;
    }

    const res = await postData(apiLink.send_notes_to_users, {
      userIds: userIds,
      title: sendNotesForm.value.title.trim(),
      content: sendNotesForm.value.content.trim(),
      sendToAll: sendToAll,
      expire: sendNotesForm.value.expire,
    });

    if (res && res.status) {
      message.success(res.message || trlang.value.notes_sent_successfully);
      const wasSelected = sendNotesForm.value.targetUsers === 'selected';
      sendNotesModalVisible.value = false;
      sendNotesForm.value = {
        title: '',
        content: '',
        targetUsers: 'selected',
        expire: '0',
      };
      if (wasSelected) {
        selectedRowKeys.value = [];
      }
      await fetchData();
    }
  } catch (error) {
    console.error('Error sending notes:', error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    sendNotesLoading.value = false;
  }
};

onMounted(() => {
  initOptions();
  initExpireOptions();
  fetchPartnerList();
  fetchData();
});
</script>


