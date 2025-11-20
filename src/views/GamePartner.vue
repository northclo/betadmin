<template>
  <a-layout>
    <a-layout>
      <a-typography-title :level="3">
        {{ trlang.partner_management }}
      </a-typography-title>
    </a-layout>
    <a-layout class="px-2">
      <PartnerChart :data-source="dataSource" :loading="loading" />

      <a-layout class="mt-5">
        <a-layout class="pt-5 pb-5 flex flex-row justify-between items-center">
          <a-layout-content class="flex items-center gap-2">
            <a-typography-text>{{ trlang.id_or_nickname }}</a-typography-text>
            <a-input v-model:value="search" class="input-lg search-input w-fit">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <a-button class="bg-gray text-white ms-2" @click="fetchData" :loading="searchLoading">
              {{ trlang.search }}
            </a-button>
            <a-typography-text class="ms-5 me-2">
              {{ trlang.expand_all }}
            </a-typography-text>
            <a-checkbox v-model:checked="expand" @change="fetchData" />
          </a-layout-content>
          <a-layout-content class="flex justify-end">
            <a-button 
              v-if="canCreateSubPartner" 
              class="bg-gray text-white" 
              @click="openRegisterPartner = true"
            >
              <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
            </a-button>
          </a-layout-content>
        </a-layout>

        <PartnerTable :columns="columns" :data-source="dataSource" :loading="loading" :fetch-data="fetchData"
          @open-register-user="openRegisterUser = true" @open-cash-modal="openCashModal"
          @open-notice-modal="openNoticeModal" @open-group-message-modal="openGroupMessageModal"
          @open-remove-modal="openRemoveModal" @open-setting-modal="openSettingModal"
          @open-add-sub-modal="openAddSubModal" @open-member-setting-modal="openMemberSettingModal" />
      </a-layout>
      <RegisterUserModal v-model:open="openRegisterUser" :data-source="selectedRecord" :fetch-data="fetchData" />
      <RegisterPartnerModal v-model:open="openRegisterPartner" :data-source="selectedRecord" :fetch-data="fetchData" />
      <PartnerSettingModal v-model:open="openSetting" :data-source="selectedRecord" :fetch-data="fetchData" />
      <MemberSettingModal v-model:open="openMemberSetting" :data-source="selectedRecord" :fetch-data="fetchData" />
      <CashModal v-model:open="openCash" :data-source="selectedRecord" :fetch-data="fetchData" />
      <GroupMessageModal v-model:open="openGroupMessage" :data-source="selectedRecord" />
      <RemovePartnerModal v-model:open="openRemove" :data-source="selectedRecord" :fetch-data="fetchData" />
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, inject, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { partnerManagementColumns } from '@/utils/table-column/partner-management';
import { getData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { usePermissions } from '@/composables/usePermissions';

import PartnerChart from '@/components/partner/PartnerChart.vue';
import PartnerTable from '@/components/partner/PartnerTable.vue';
import RegisterUserModal from '@/components/partner/RegisterUserModal.vue';
import RegisterPartnerModal from '@/components/partner/RegisterPartnerModal.vue';
import PartnerSettingModal from '@/components/partner/PartnerSettingModal.vue';
import MemberSettingModal from '@/components/partner/MemberSettingModal.vue';
import CashModal from '@/components/partner/CashModal.vue';
import GroupMessageModal from '@/components/partner/GroupMessageModal.vue';
import RemovePartnerModal from '@/components/partner/RemovePartnerModal.vue';

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const router = useRouter();
const { canCreateSubPartner, canAccessPartner } = usePermissions();

const expand = ref(true);
const search = ref('');
const columns = ref([]);
const dataSource = ref([]);
const loading = ref(true);
const openRegisterUser = ref(false);
const openRegisterPartner = ref(false);
const openSetting = ref(false);
const openMemberSetting = ref(false);
const openCash = ref(false);
const openNotice = ref(false);
const openGroupMessage = ref(false);
const openRemove = ref(false);
const selectedRecord = ref(null);
const searchLoading = ref(false);

const fetchData = async () => {
  if (!canAccessPartner.value) {
    message.error(trlang.value.permission_denied);
    router.push(routeLink.dashboard.link);
    return;
  }
  try {
    loading.value = true;
    searchLoading.value = true;
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
  } catch (error) {
    console.error('Error fetching partner data:', error);
    message.error(trlang.value.error_loading_data);
    dataSource.value = [];
  } finally {
    loading.value = false;
    searchLoading.value = false;
  }
};

const openCashModal = (record) => {
  selectedRecord.value = record;
  openCash.value = true;
};

const openNoticeModal = (record) => {
  selectedRecord.value = record;
  openNotice.value = true;
};

const openGroupMessageModal = (record) => {
  selectedRecord.value = record;
  openGroupMessage.value = true;
};

const openRemoveModal = (record) => {
  selectedRecord.value = record;
  openRemove.value = true;
};

const openSettingModal = (record) => {
  selectedRecord.value = record;
  openSetting.value = true;
};

const isRegisterPartnerFromAddSub = ref(false);

const openAddSubModal = (record) => {
  selectedRecord.value = record;
  isRegisterPartnerFromAddSub.value = true;
  openRegisterPartner.value = true;
};

const openMemberSettingModal = (record) => {
  selectedRecord.value = record;
  openMemberSetting.value = true;
};

watch(() => openRegisterPartner.value, (newValue) => {
  if (!newValue && isRegisterPartnerFromAddSub.value) {
    if (!openCash.value && !openSetting.value && !openMemberSetting.value && 
        !openGroupMessage.value && !openRemove.value) {
      selectedRecord.value = null;
    }
    isRegisterPartnerFromAddSub.value = false;
  }
});

/* Load data on mount */
onMounted(() => {
  if (!canAccessPartner.value) {
    message.error(trlang.value.permission_denied);
    router.push(routeLink.dashboard.link);
    return;
  }
  fetchData();
});
</script>
