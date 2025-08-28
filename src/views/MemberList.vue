<template>
    <a-typography-title :level="2" class="p-2" style="color: rgba(0, 0, 0, 0.7);">
        {{ trlang.member_list }}
    </a-typography-title>

    <BaseTable :columns="columns" :dataSource="dataSource" :editRow="editRow" :deleteRow="deleteRow" />
</template>

<script>
import { ref, onMounted } from 'vue';
import { postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';
import { memberListColumn } from '@/utils/table-column.js/member-list';
import BaseTable from '@/components/Table.vue';

export default {
    name: routeLink.member_list.name,
    components: { BaseTable },
    inject: ['langState'],
    computed: {
        trlang() {
            return this.langState.translations;
        },
    },
    setup() {
        const dataSource = ref([]);
        const columns = memberListColumn;

        const fetchData = async () => {
            const res = await postData(apiLink.get_member_list);
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

        const deleteRow = (row) => {
            console.log("Delete:", row);
        };

        onMounted(() => {
            fetchData();
        });

        return {
            dataSource,
            columns,
            editRow,
            deleteRow,
        };
    },
};
</script>
