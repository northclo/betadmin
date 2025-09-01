<template>
  <a-layout class="bg-white p-5">
    <a-typography-text class="text-dark-grey fs-1">
      {{ trlang.member_list }}
    </a-typography-text>

    <a-layout-header class="bg-white d-flex justify-end items-center gap-2">
      <a-button class="bg-main text-white" @click="openAddModal">
        {{ trlang.add_member }}
      </a-button>
      <a-button class="bg-red text-white" @click="deleteSelectedMembers">
        {{ trlang.delete_member }}
      </a-button>
      <a-button class="bg-main text-white" @click="exportMemberToExcel">
        {{ trlang.export_excel }}
      </a-button>
    </a-layout-header>

    <a-layout-header class="bg-white d-flex justify-end items-center gap-2">
      <a-input
        v-model:value="search"
        placeholder="Search..."
        class="search-input"
        @change="searchMember"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </a-layout-header>

    <a-modal
      v-model:open="open"
      :title="trlang.add_member"
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

    <BaseTable
      :columns="columns"
      :dataSource="dataSource"
      :editRow="editRow"
      :deleteRow="deleteRow"
      :loading="loading"
      @update:selectedRows="onSelectedRows"
      @update:selectedRowKeys="onSelectedRowKeys"
    />
  </a-layout>
</template>

<script>
import { ref, onMounted, computed, inject } from "vue";
import BaseTable from "@/components/Table.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { getData, deleteData, putData, postData } from "@/helpers/Axios";
import { checkValidEmail, exportExcel } from "@/helpers/Common.js";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";
import { memberListColumn } from "@/utils/table-column.js/member-list";
import { message } from "ant-design-vue";

export default {
  name: routeLink.member_list.name,
  components: { BaseTable, SearchOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const dataSource = ref([]);
    const open = ref(false);
    const columns = memberListColumn;
    const checkedRows = ref([]);
    const selectedMembers = ref([]);
    const selectedMemberKeys = ref([]);
    const loading = ref([true]);

    // form fields
    const firstName = ref("");
    const lastName = ref("");
    const userName = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const company = ref("");
    const phoneNumber = ref("");
    const modalState = ref(0); // add: 0, edit: 1
    const updateId = ref("");
    const search = ref("");

    const fetchData = async () => {
      loading.value = true;

      const res = await getData(`${apiLink.member_list}?search=${search.value}`);
      if (res.status) {
        dataSource.value =
          res.data.map((element, idx) => ({
            key: idx,
            ...element,
          })) || [];

        loading.value = false;
      }
    };

    const editRow = (row) => {
      firstName.value = row.firstName;
      lastName.value = row.lastName;
      userName.value = row.userName;
      company.value = row.company;
      email.value = row.email;
      password.value = "";
      confirmPassword.value = "";
      phoneNumber.value = row.phoneNumber;
      updateId.value = row._id;
      modalState.value = 1;

      openModal();
    };

    const openAddModal = () => {
      firstName.value = "";
      lastName.value = "";
      userName.value = "";
      company.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";
      phoneNumber.value = "";
      modalState.value = 0;

      openModal();
    };

    const deleteRow = async (row) => {
      const res = await deleteData(`${apiLink.member_list}/${row._id}`);
      await fetchData();
      if (res.status) {
        message.success(trlang.value.deleted_successful);
      }
    };

    const openModal = () => {
      open.value = true;
    };

    const hideModal = () => {
      modalState.value = 0;
      updateId.value = "";
      open.value = false;
    };

    const addMember = async () => {
      if (!firstName.value) return message.error(trlang.value.first_name_required);
      if (!lastName.value) return message.error(trlang.value.last_name_required);
      if (!userName.value) return message.error(trlang.value.user_name_required);
      if (!email.value) return message.error(trlang.value.email_required);
      if (!checkValidEmail(email.value))
        return message.error(trlang.value.not_correct_email);
      if (!password.value && modalState.value === 0)
        return message.error(trlang.value.password_required);
      if (!confirmPassword.value && modalState.value === 0)
        return message.error(trlang.value.confirm_password_required);
      if (password.value !== confirmPassword.value)
        return message.error(trlang.value.wrong_password);

      if (modalState.value === 0) {
        let res = await putData(apiLink.member_list, {
          firstName: firstName.value,
          lastName: lastName.value,
          userName: userName.value,
          email: email.value,
          password: password.value,
          company: company.value,
          phoneNumber: phoneNumber.value,
        });

        if (res.status) {
          message.success(trlang.value.added_successful);
          hideModal();
          fetchData();
        }
      } else {
        let data = {
          _id: updateId.value,
          firstName: firstName.value,
          lastName: lastName.value,
          userName: userName.value,
          email: email.value,
          company: company.value,
          phoneNumber: phoneNumber.value,
        };

        if (password.value) {
          data.password = password.value;
        }

        let res = await postData(apiLink.member_list, data);

        if (res.status) {
          message.success(trlang.value.changed_successful);
          hideModal();
          fetchData();
        }
      }
    };

    const searchMember = () => {
      fetchData();
    };

    const deleteSelectedMembers = async () => {
      let deleteMemberIds = "";
      selectedMembers.value.forEach((element) => {
        deleteMemberIds += "," + element._id;
      });

      const res = await deleteData(`${apiLink.member_list}/${deleteMemberIds.slice(1)}`);
      await fetchData();
      if (res.status) {
        message.success(trlang.value.deleted_successful);
      }
    };

    const exportMemberToExcel = () => {
      if (selectedMembers.value.length === 0) {
        exportExcel(dataSource.value, trlang.value.member_list, trlang.value.member_list);
      } else {
        exportExcel(
          selectedMembers.value,
          trlang.value.member_list,
          trlang.value.member_list
        );
      }
    };

    const onSelectedRows = (rows) => {
      selectedMembers.value = rows;
    };

    const onSelectedRowKeys = (keys) => {
      selectedMemberKeys.value = keys;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      dataSource,
      columns,
      open,
      search,
      checkedRows,
      editRow,
      deleteRow,
      openModal,
      hideModal,
      fetchData,
      addMember,
      searchMember,
      deleteSelectedMembers,
      exportMemberToExcel,
      onSelectedRowKeys,
      onSelectedRows,
      openAddModal,
      loading,
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
      company,
      phoneNumber,
    };
  },
};
</script>
