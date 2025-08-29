<template>
    <a-table :rowSelection="rowSelection" :columns="columnsWithActions" :dataSource="dataSource" rowKey="key"
        class="w-100" :scroll="dataSource.length ? { x: 'max-content' } : undefined" :pagination="paginationConfig"
        @change="handleTableChange">
        <template #emptyText>
            <a-spin v-if="loading" />
            <span v-else>{{ trlang.common.no_data }}</span>
        </template>
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
                <a-space class="gap-0">
                    <a-button type="default" size="small" class="border-0 text-main shadow-none transparent-background"
                        @click="editRow(record)">
                        {{ trlang.common.edit }}
                    </a-button>
                    <a-divider type="vertical" />
                    <a-button type="default" size="small" class="border-0 text-red shadow-none transparent-background"
                        @click="deleteRow(record)">
                        {{ trlang.common.delete }}
                    </a-button>
                </a-space>
            </template>
        </template>
    </a-table>
</template>

<script>
import { ref, computed, reactive } from "vue";

export default {
    name: "BaseTable",
    props: {
        columns: { type: Array, required: true },
        dataSource: { type: Array, default: () => [] },
        editRow: { type: Function, required: true },
        deleteRow: { type: Function, required: true },
        loading: { type: Boolean, required: true }
    },
    emits: ['update:selectedRows', "update:selectedRowKeys"],
    inject: ['langState'],
    computed: {
        trlang() {
            return this.langState.translations;
        }
    },
    setup(props, { emit }) {
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

        const selectedRowKeys = ref([]);
        const selectedRows = ref([]);

        const rowSelection = reactive({
            selectedRowKeys: selectedRowKeys.value,
            onChange: (keys, rows) => {
                selectedRowKeys.value = keys;
                rowSelection.selectedRowKeys = keys;
                selectedRows.value = rows;

                emit('update:selectedRowKeys', keys);
                emit("update:selectedRows", rows);
            },
        });

        // Automatically add actions column if not exists
        const columnsWithActions = computed(() => {
            const hasActions = props.columns.some((col) => col.key === "actions");
            return hasActions ? props.columns : [...props.columns, { title: "Actions", key: "actions" }];
        });

        return {
            paginationConfig,
            columnsWithActions,
            currentPage,
            pageSize,
            rowSelection,
            selectedRowKeys,
            selectedRows,
            handleTableChange,
        };
    },
};
</script>
