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
        <a-button class="bg-gray text-white" @click="openRegisterPartner = true">
          <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <PartnerTable
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      @saveData="saveData"
      @openRegisterUser="openRegisterUser = true"
      @openCash="openCash = true"
    />
    <RegisterUserModal v-model:open="openRegisterUser" />
    <RegisterPartnerModal v-model:open="openRegisterPartner" />
    <CashModal v-model:open="openCash" />
    <SendNoteModal v-model:open="openNote" />
  </a-layout>
</template>

<script setup>
import { ref, inject, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { SearchOutlined, CheckCircleOutlined } from "@ant-design/icons-vue";
import { partnerManagementColumns } from "@/utils/table-column/partner-management";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "../utils/api-link";

import PartnerTable from "@/components/partner/PartnerTable.vue";
import RegisterUserModal from "@/components/partner/RegisterUserModal.vue";
import RegisterPartnerModal from "@/components/partner/RegisterPartnerModal.vue";
import CashModal from "@/components/partner/CashModal.vue";
import SendNoteModal from "@/components/partner/SendNoteModal.vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Router */

/* Reactive states */
const checked = ref(true);
const search = ref("");
const columns = ref([]);
const dataSource = ref([]);
const loading = ref(true);
const openRegisterUser = ref(false);
const openRegisterPartner = ref(false);
const openCash = ref(false);
const openNote = ref(true);

/* Fetch columns and table data */
const fetchData = async () => {
  try {
    loading.value = true;
    columns.value = partnerManagementColumns(trlang);
    const partners = await getData(apiLink.game_partner + "?search=" + search.value);
    dataSource.value = partners.data;
  } finally {
    loading.value = false;
  }
};

/* Methods */
const saveData = () => message.success("message success");
const searchPartner = () => fetchData();

/* Load data on mount */
onMounted(() => fetchData());
</script>
