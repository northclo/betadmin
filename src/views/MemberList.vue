<template>
    <a-typography-title :level="2" class="ps-5 pe-5 pt-5 pe-2 white-background mb-0 text-dark-grey">
        {{ trlang.member_list }}
    </a-typography-title>

    <a-layout-header class="white-background d-flex justify-end gap-2">
        <a-button class="main-background text-white" @click="openModal">{{ trlang.add_member }}</a-button>
        <a-button class="red-background text-white">{{ trlang.delete_member }}</a-button>
        <a-button class="main-background text-white">{{ trlang.export_excel }}</a-button>
    </a-layout-header>

    <a-modal v-model:open="open" title="Add Member" ok-text="Add" cancel-text="Cancel" @ok="addMember">
        <a-layout class="d-flex gap-5 flex-row white-background mt-2">
            <a-input :addonBefore="trlang.first_name" v-model:value="firstName" placeholder="John*" />
            <a-input :addonBefore="trlang.last_name" v-model:value="lastName" placeholder="Smith*" />
        </a-layout>
        <a-layout class="d-flex gap-5 flex-row white-background mt-2">
            <a-input :addonBefore="trlang.user_name" v-model:value="userName" placeholder="John Smith*" />
            <a-input :addonBefore="trlang.company" v-model:value="company" placeholder="Apple" />
        </a-layout>
        <a-input :addonBefore="trlang.email" v-model:value="email" placeholder="johnsmith@gmail.com*" class="mt-2" />
        <a-input :addonBefore="trlang.password" v-model:value="password" placeholder="1111*" class="mt-2" />
        <a-input :addonBefore="trlang.confirm_password" v-model:value="confirmPassword" placeholder="1111*"
            class="mt-2" />
        <a-input :addonBefore="trlang.phone_number" v-model:value="phoneNumber" placeholder="+1231231231"
            class="mt-2" />
    </a-modal>

    <BaseTable :columns="columns" :dataSource="dataSource" :editRow="editRow" :deleteRow="deleteRow" />
</template>

<script>
import { ref, onMounted } from 'vue';
import BaseTable from '@/components/Table.vue';
import { getData, deleteData, putData } from '@/helpers/Axios';
import { checkValidEmail } from '@/helpers/common';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { memberListColumn } from '@/utils/table-column.js/member-list';
import { message } from 'ant-design-vue';

export default {
    name: routeLink.member_list.name,
    components: { BaseTable },
    inject: ['langState'],
    data() {
        return {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            company: "",
            phoneNumber: ""
        }
    },
    computed: {
        trlang() {
            return this.langState.translations;
        },
    },
    setup() {
        const dataSource = ref([]);
        const open = ref(false)
        const columns = memberListColumn;

        const fetchData = async () => {
            const res = await getData(apiLink.member_list);
            if (res.status) {
                dataSource.value = res.data.map((element, idx) => {
                    return {
                        key: idx,
                        ...element
                    }
                }) || [];
            }
        };

        const editRow = (row) => {
            console.log("Edit:", row);
        };

        const deleteRow = async (row) => {
            const res = await deleteData(`${apiLink.member_list}/${row._id}`);
            fetchData()
            if (res.status) {
                message.success("Deleted user successful")
            }
        };

        const openModal = () => {
            open.value = true;
        }

        const hideModal = () => {
            open.value = false;
        }

        onMounted(() => {
            fetchData();
        });

        return {
            dataSource,
            columns,
            open,
            editRow,
            deleteRow,
            openModal,
            hideModal,
            fetchData
        };
    },
    methods: {
        async addMember() {
            if (!this.firstName) return message.error(this.trlang.first_name_required);
            if (!this.lastName) return message.error(this.trlang.last_name_required);
            if (!this.userName) return message.error(this.trlang.user_name_required);
            if (!this.email) return message.error(this.trlang.email_required);
            if (!checkValidEmail(this.email)) return message.error(this.trlang.not_correct_email)
            if (!this.password) return message.error(this.trlang.password_required);
            if (!this.confirmPassword) return message.error(this.trlang.confirm_password_required);
            if (this.password !== this.confirmPassword) return message.error(this.trlang.wrong_password)

            let res = await putData(apiLink.member_list, {
                firstName: this.firstName,
                lastName: this.lastName,
                userName: this.userName,
                email: this.email,
                password: this.password,
                company: this.company,
                phoneNumber: this.phoneNumber
            })

            if (res.status) {
                message.success(this.trlang.member_added_successful);
                this.hideModal();
                this.fetchData()
            }
        }
    }
};
</script>
