<template>
  <a-layout class="bg-white p-5">
    <!-- Sticky Header -->
    <a-layout class="bg-white d-flex flex-row justify-between items-center sticky-header">
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.partner_management }}
      </a-typography-text>
    </a-layout>

    <!-- Search and Actions -->
    <a-layout class="bg-white pt-5 pb-5 d-flex flex-row justify-between items-center">
      <a-layout-content class="d-flex items-center gap-2">
        <a-typography-text>{{ trlang.id_or_nickname }}</a-typography-text>
        <a-input v-model:value="search" placeholder="Search..." class="search-input">
          <template #prefix> <SearchOutlined /> </template>
        </a-input>
        <a-button class="bg-gray text-white ms-2" @click="searchPartner">
          {{ trlang.search }}
        </a-button>
        <a-typography-text class="ms-5 me-2">{{ trlang.expand_all }}</a-typography-text>
        <a-checkbox v-model:checked="checked"></a-checkbox>
      </a-layout-content>
      <a-layout-content class="d-flex justify-end">
        <a-button class="bg-gray text-white" @click="registerGamePartner">
          <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <!-- table -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      class="partner-table"
    >
      <template #emptyText>
        <a-spin v-if="loading" /> <span v-else>{{ trlang.no_data }}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'branch_office'">
          <a-layout v-if="record.role === 'branchOffice'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
        </template>
        <template v-if="column.key === 'regional_office' && record.role !== 'user'">
          <a-layout v-if="record.role === 'regionalOffice'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
          <a-typography-text v-if="record.role === 'branchOffice'" class="text-main">
            {{ record.subs === 0 ? "" : record.subs }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'agency' && record.role !== 'user'">
          <a-layout v-if="record.role === 'agency'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
          <a-typography-text v-if="record.role === 'regionalOffice'" class="text-main">
            {{ record.subs === 0 ? "" : record.subs }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'distributor' && record.role !== 'user'">
          <a-layout v-if="record.role === 'distributor'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
          <a-typography-text v-if="record.role === 'agency'" class="text-main">
            {{ record.subs === 0 ? "" : record.subs }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'store' && record.role !== 'user'">
          <a-layout v-if="record.role === 'store'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
          <a-typography-text v-if="record.role === 'distributor'" class="text-main">
            {{ record.subs === 0 ? "" : record.subs }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'users'">
          <a-layout v-if="record.role === 'user'" class="bg-light-pink">
            <a-typography-text> {{ record.nickname }} </a-typography-text>
            <a-typography-text>({{ record.id }})</a-typography-text>
          </a-layout>
          <a-typography-text v-else class="text-pink">
            {{ record.members === 0 ? "" : record.members }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'money'">
          <a-layout class="bg-none text-end">
            <a-typography-text class="text-yellow text-end">
              {{ record.money }}{{ record.betMoneyUnit }}
            </a-typography-text>
            <a-typography-text>{{ record.point }}P</a-typography-text>
          </a-layout>
        </template>
        <template v-if="column.key === 'benefit'">
          <a-layout class="bg-none">
            <a-typography-text>
              {{ trlang.oeuo }}
              <span class="text-yellow">{{ record.simpleBetRate }}%</span>
            </a-typography-text>
            <a-typography-text>
              {{ trlang.combined }}
              <span class="text-yellow">{{ record.combinedBetRate }}%</span>
            </a-typography-text>
            <a-typography-text>
              {{ trlang.number }}
              <span class="text-yellow">{{ record.matchNumberBetRate }}%</span>
            </a-typography-text>
          </a-layout>
        </template>
        <template v-if="column.key === 'number_of_members'">
          <a-typography-text>
            {{
              record.members === 0
                ? "1" + trlang.person
                : record.members + 1 + trlang.people
            }}
          </a-typography-text>
        </template>
        <template v-if="column.key === 'total_member_holdings'">
          <a-layout class="bg-none text-end">
            <a-typography-text class="text-yellow text-end">
              {{ record.holdingMoney }}{{ record.betMoneyUnit }}
            </a-typography-text>
            <a-typography-text>{{ record.holdingPoint }}P</a-typography-text>
          </a-layout>
        </template>
        <template v-if="column.key === 'function'">
          <a-layout
            class="bg-none d-flex flex-row justify-center items-center flex-wrap gap-2"
          >
            <a-button v-if="record.role === 'headquater'" class="bg-gray text-white">
              <CheckCircleOutlined /> {{ trlang.full_message }}
            </a-button>
            <a-button
              v-if="record.role !== 'headquater' && record.role !== 'user'"
              class="bg-gray text-white"
              @click="saveData"
            >
              <CheckCircleOutlined /> {{ trlang.setting }}
            </a-button>
            <a-button v-if="record.role === 'user'" class="bg-gray text-white">
              <CheckCircleOutlined /> {{ trlang.member_settings }}
            </a-button>
            <a-button v-if="record.role !== 'headquater'" class="bg-gray text-white">
              <CheckCircleOutlined /> {{ trlang.cash_increase_decrease }}
            </a-button>
            <a-button
              v-if="record.role !== 'headquater' && record.role !== 'user'"
              class="bg-gray text-white"
            >
              <CheckCircleOutlined /> {{ trlang.group_message }}
            </a-button>
            <a-button v-if="record.role !== 'headquater'" class="bg-gray text-white">
              <CheckCircleOutlined /> {{ trlang.delete }}
            </a-button>
            <a-button
              v-if="
                record.role !== 'headquater' &&
                record.role !== 'store' &&
                record.role !== 'user'
              "
              class="bg-gray text-white"
            >
              <CheckCircleOutlined /> {{ trlang.add_sub }}
            </a-button>
            <a-button v-if="record.role === 'user'" class="bg-gray text-white">
              <CheckCircleOutlined /> {{ trlang.note }}
            </a-button>
            <a-button
              v-if="record.role !== 'user'"
              class="bg-main text-white"
              @click="openRegisterUserModal"
            >
              <UserAddOutlined /> {{ trlang.member_registration }}
            </a-button>
          </a-layout>
        </template>
      </template>
    </a-table>
  </a-layout>

  <a-modal
    v-model:open="openRegisterUser"
    :title="trlang.register_user"
    :ok-text="trlang.save"
    :cancel-text="trlang.cancel"
    @ok="addMember"
  >
    <a-layout class="d-flex gap-5 flex-row bg-white mt-2">
      <a-input
        :addonBefore="trlang.first_name"
        v-model:value="firstName"
        placeholder="John*"
      />
      <a-input
        :addonBefore="trlang.last_name"
        v-model:value="lastName"
        placeholder="Smith*"
      />
    </a-layout>

    <a-layout class="d-flex gap-5 flex-row bg-white mt-2">
      <a-input
        :addonBefore="trlang.user_name"
        v-model:value="userName"
        placeholder="John Smith*"
      />
      <a-input
        :addonBefore="trlang.company"
        v-model:value="company"
        placeholder="Apple"
      />
    </a-layout>

    <a-input
      :addonBefore="trlang.email"
      v-model:value="email"
      placeholder="johnsmith@gmail.com*"
      class="mt-2"
    />
    <a-input
      :addonBefore="trlang.password"
      v-model:value="password"
      placeholder="1111*"
      class="mt-2"
    />
    <a-input
      :addonBefore="trlang.confirm_password"
      v-model:value="confirmPassword"
      placeholder="1111*"
      class="mt-2"
    />
    <a-input
      :addonBefore="trlang.phone_number"
      v-model:value="phoneNumber"
      placeholder="+1231231231"
      class="mt-2"
    />
  </a-modal>
</template>
<script setup>
import { ref, inject, onMounted, computed } from "vue";
import {
  SearchOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { partnerManagementColumns } from "@/utils/table-column/partner-management";
import { useRouter } from "vue-router";
import { routeLink } from "../utils/route-link";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "../utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const router = useRouter();

/* Reactive states */
const checked = ref(true);
const search = ref("");
const columns = ref([]);
const dataSource = ref([]);
const loading = ref(true);
const openRegisterUser = ref(false);

/* Fetch columns and table data */
const fetchData = async () => {
  try {
    loading.value = true;
    columns.value = partnerManagementColumns(trlang);
    let partners = await getData(apiLink.game_partner + "?search=" + search.value);
    dataSource.value = partners.data;
    loading.value = false;
  } catch {
    loading.value = false;
  }
};

const openRegisterUserModal = () => {
  openRegisterUser.value = true;
};

const saveData = () => message.success("message success");
const searchPartner = () => fetchData();
const registerGamePartner = () => router.push(routeLink.game_partner_add_branch.link);

/* Load data on mount */
onMounted(() => fetchData());
</script>
