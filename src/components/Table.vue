<template>
    <a-table row-selection="checkbox" :columns="columnsWithActions" :dataSource="dataSource" rowKey="key" class="w-100"
        :scroll="dataSource.length ? { x: 'max-content' } : undefined" :pagination="paginationConfig"
        @change="handleTableChange">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
                <a-space class="gap-0">
                    <a-button type="default" size="small" class="border-0 text-main shadow-none transparent-background"
                        @click="editRow(record)">Edit</a-button>
                    <a-divider type="vertical" />
                    <a-button type="default" size="small" class="border-0 text-main shadow-none transparent-background"
                        @click="deleteRow(record)">Delete</a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<script>
import { ref, computed } from "vue";

export default {
    name: "BaseTable",
    props: {
        columns: { type: Array, required: true },
        dataSource: { type: Array, default: () => [] },
        editRow: { type: Function, required: true },
        deleteRow: { type: Function, required: true },
    },
    setup(props) {
        const currentPage = ref(1);
        const pageSize = ref(10);

        const paginationConfig = ref({
            current: currentPage.value,
            pageSize: pageSize.value,
            pageSizeOptions: ["10", "20", "50", "100"],
            showSizeChanger: true,
            locale: { items_per_page: "/ page" },
        });

        const handleTableChange = (pagination) => {
            currentPage.value = pagination.current;
            pageSize.value = pagination.pageSize;
            paginationConfig.value.current = pagination.current;
            paginationConfig.value.pageSize = pagination.pageSize;
        };

        // Automatically add actions column if not exists
        const columnsWithActions = computed(() => {
            const hasActions = props.columns.some((col) => col.key === "actions");
            return hasActions ? props.columns : [...props.columns, { title: "Actions", key: "actions" }];
        });

        return {
            paginationConfig,
            handleTableChange,
            columnsWithActions,
            currentPage,
            pageSize,
        };
    },
};
</script>
