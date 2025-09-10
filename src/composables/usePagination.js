import { ref } from "vue";

export function usePagination(initialPageSize = 10) {
    const paginationConfig = ref({
        current: 1,
        pageSize: initialPageSize,
        total: 0,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        locale: { items_per_page: "/ page" },
    });

    const handleTableChange = (pagination) => {
        paginationConfig.value.current = pagination.current;
        paginationConfig.value.pageSize = pagination.pageSize;
    };

    const setTotal = (total) => {
        paginationConfig.value.total = total;
    };

    return {
        paginationConfig,
        handleTableChange,
        setTotal,
    };
}
