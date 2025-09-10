<template>
  <a-table
    :rowSelection="rowSelection"
    :columns="columns"
    :dataSource="dataSource"
    rowKey="key"
    class="w-100"
    :scroll="dataSource.length ? { x: 'max-content' } : undefined"
    :pagination="paginationConfig"
    @change="handleTableChange"
  >
    <template #emptyText>
      <a-spin v-if="loading" />
      <span v-else>{{ trlang.no_data }}</span>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'no'">
        {{ index + 1 }}
      </template>
      <template v-if="column.key === 'actions'">
        <a-space class="gap-0">
          <a-button
            type="default"
            size="small"
            class="border-0 text-main shadow-none bg-none"
            @click="editRow(record)"
          >
            {{ trlang.edit }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            type="default"
            size="small"
            class="border-0 text-red shadow-none bg-none"
            @click="deleteRow(record)"
          >
            {{ trlang.delete }}
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { ref, computed, reactive, inject } from 'vue';
import { defineProps, defineEmits } from 'vue';

defineOptions({ name: 'BaseTable' });

const props = defineProps({
  columns: { type: Array, required: true },
  dataSource: { type: Array, default: () => [] },
  editRow: { type: Function },
  deleteRow: { type: Function },
  loading: { type: Boolean, required: true },
  checkbox: { type: Boolean, default: false },
});

const emit = defineEmits(['update:selectedRows', 'update:selectedRowKeys']);
const langState = inject('langState');
const trlang = computed(() => langState.translations);

const currentPage = ref(1);
const pageSize = ref(10);

const paginationConfig = ref({
  current: currentPage.value,
  pageSize: pageSize.value,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  locale: { items_per_page: '/ page' },
});

const handleTableChange = (pagination) => {
  currentPage.value = pagination.current;
  pageSize.value = pagination.pageSize;
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
};

const selectedRowKeys = ref([]);
const selectedRows = ref([]);

const rowSelection = props.checkbox
  ? reactive({
      selectedRowKeys: selectedRowKeys.value,
      onChange: (keys, rows) => {
        selectedRowKeys.value = keys;
        rowSelection.selectedRowKeys = keys;
        selectedRows.value = rows;

        emit('update:selectedRowKeys', keys);
        emit('update:selectedRows', rows);
      },
    })
  : {};
</script>
