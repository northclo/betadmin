<template>
  <a-layout>
    <a-layout class="sticky-header">
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.partner_management }}
      </a-typography-text>
    </a-layout>
    <a-layout class="px-2">
      <ParnterChart :dataSource="dataSource" :loading="loading" />

      <a-layout class="p-5 bg-white mt-5">
        <a-layout
          class="bg-white pt-5 pb-5 flex flex-row justify-between items-center"
        >
          <a-layout-content class="flex items-center gap-2">
            <a-typography-text>{{ trlang.id_or_nickname }}</a-typography-text>
            <a-input v-model:value="search" class="search-input">
              <template #prefix> <SearchOutlined /> </template>
            </a-input>
            <a-button class="bg-gray text-white ms-2" @click="fetchData">
              {{ trlang.search }}
            </a-button>
            <a-typography-text class="ms-5 me-2">{{
              trlang.expand_all
            }}</a-typography-text>
            <a-checkbox
              v-model:checked="expand"
              @change="fetchData"
            ></a-checkbox>
          </a-layout-content>
          <a-layout-content class="flex justify-end">
            <a-button
              class="bg-gray text-white"
              @click="openRegisterPartner = true"
            >
              <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
            </a-button>
          </a-layout-content>
        </a-layout>

        <PartnerTable
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          @openRegisterUser="openRegisterUser = true"
          :fetchData="fetchData"
          @openCashModal="openCashModal"
          @openNoteModal="openNoteModal"
          @openGroupMessageModal="openGroupMessageModal"
          @openRemoveModal="openRemoveModal"
        />
      </a-layout>
      <RegisterUserModal
        v-model:open="openRegisterUser"
        :dataSource="selectedRecord"
        :fetchData="fetchData"
      />
      <RegisterPartnerModal
        v-model:open="openRegisterPartner"
        :dataSource="selectedRecord"
        :fetchData="fetchData"
      />
      <CashModal
        v-model:open="openCash"
        :dataSource="selectedRecord"
        :fetchData="fetchData"
      />
      <SendNoteModal v-model:open="openNote" :dataSource="selectedRecord" />
      <GroupMessageModal
        v-model:open="openGroupMessage"
        :dataSource="selectedRecord"
      />
      <RemovePartnerModal
        v-model:open="openRemove"
        :dataSource="selectedRecord"
        :fetchData="fetchData"
      />
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { partnerManagementColumns } from '@/utils/table-column/partner-management';
import { getData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';

import ParnterChart from '@/components/partner/PartnerChart.vue';
import PartnerTable from '@/components/partner/PartnerTable.vue';
import RegisterUserModal from '@/components/partner/RegisterUserModal.vue';
import RegisterPartnerModal from '@/components/partner/RegisterPartnerModal.vue';
import CashModal from '@/components/partner/CashModal.vue';
import SendNoteModal from '@/components/partner/SendNoteModal.vue';
import GroupMessageModal from '@/components/partner/GroupMessageModal.vue';
import RemovePartnerModal from '@/components/partner/RemovePartnerModal.vue';

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

/* Router */

/* Reactive states */
const expand = ref(true);
const search = ref('');
const columns = ref([]);
const dataSource = ref([]);
const loading = ref(true);
const openRegisterUser = ref(false);
const openRegisterPartner = ref(false);
const openCash = ref(false);
const openNote = ref(false);
const openGroupMessage = ref(false);
const openRemove = ref(false);
const selectedRecord = ref(null);

/* Fetch columns and table data */
const fetchData = async () => {
  try {
    loading.value = true;
    columns.value = partnerManagementColumns(trlang);
    const partners = await getData(
      apiLink.game_partner + '?search=' + search.value
    );

    if (expand.value) {
      dataSource.value = partners.data;
    } else {
      dataSource.value =
        partners.data.length > 6
          ? [
              ...partners.data.slice(0, 5),
              partners.data[partners.data.length - 1],
            ]
          : partners.data;
    }
  } finally {
    loading.value = false;
  }
};

const openCashModal = (record) => {
  selectedRecord.value = record;
  openCash.value = true;
};

const openNoteModal = (record) => {
  selectedRecord.value = record;
  openNote.value = true;
};

const openGroupMessageModal = (record) => {
  selectedRecord.value = record;
  openGroupMessage.value = true;
};

const openRemoveModal = (record) => {
  selectedRecord.value = record;
  openRemove.value = true;
};

/* Load data on mount */
onMounted(() => fetchData());
</script>
