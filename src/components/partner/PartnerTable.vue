<template>
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
        <a-layout v-if="record.role === 'headquater'" class="bg-none headquater-content">
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
        <a-typography-text v-else class="text-dark-brown">
          {{ record.members === 0 ? "" : record.members }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'nickname'">
        <a-typography-text v-if="record.role === 'headquater'" class="bg-none">
          -
        </a-typography-text>
        <a-typography-text v-else> {{ record.nickname }} </a-typography-text>
      </template>
      <template v-if="column.key === 'money'">
        <a-layout class="bg-none text-end">
          <a-typography-text class="text-dark-brown text-end">
            {{ record.money }}{{ record.betMoneyUnit }}
          </a-typography-text>
          <a-typography-text>{{ record.point }}P</a-typography-text>
        </a-layout>
      </template>
      <template v-if="column.key === 'benefit'">
        <a-layout class="bg-none">
          <a-typography-text>
            {{ trlang.oeuo }}
            <span class="text-dark-brown">{{ record.simpleBetRate }}%</span>
          </a-typography-text>
          <a-typography-text>
            {{ trlang.combined }}
            <span class="text-dark-brown">{{ record.combinedBetRate }}%</span>
          </a-typography-text>
          <a-typography-text>
            {{ trlang.number }}
            <span class="text-dark-brown">{{ record.matchNumberBetRate }}%</span>
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
          <a-typography-text class="text-dark-brown text-end">
            {{ record.holdingMoney }}{{ record.betMoneyUnit }}
          </a-typography-text>
          <a-typography-text>{{ record.holdingPoint }}P</a-typography-text>
        </a-layout>
      </template>
      <template v-if="column.key === 'function'">
        <a-layout
          class="bg-none flex flex-row justify-center items-center flex-wrap gap-2"
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
          <a-button
            v-if="record.role !== 'headquater'"
            class="bg-gray text-white"
            @click="$emit('openCash')"
          >
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
            class="bg-green text-white"
            @click="$emit('openRegisterUser')"
          >
            <UserAddOutlined /> {{ trlang.member_registration }}
          </a-button>
        </a-layout>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { computed, defineProps, inject } from "vue";
import { CheckCircleOutlined, UserAddOutlined } from "@ant-design/icons-vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  columns: Array,
  dataSource: Array,
  loading: Boolean,
});

const saveData = () => {
  console.log("-------------");
};
</script>
