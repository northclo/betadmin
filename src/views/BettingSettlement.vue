<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.betting_settlement_profit }}
      </a-typography-title>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.duration">
              <a-range-picker
                v-model:value="filters.dateRange"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :placeholder="[trlang.start_date, trlang.end_date]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner">
              <a-tree-select
                v-model:value="filters.partnerId"
                :tree-data="partnerTreeOptions"
                :placeholder="trlang.select_partner"
                allow-clear
                tree-default-expand-all
                :field-names="{ children: 'children', label: 'title', value: 'value' }"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="3">
            <a-form-item class="mb-0" :label="trlang.include_sub_partners">
              <a-checkbox v-model:checked="filters.includeSubPartners" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-form-item class="mb-0">
              <a-space>
                <a-button type="primary" class="bg-main text-white" :loading="loading" @click="fetchData">
                  {{ trlang.search }}
                </a-button>
                <a-button @click="resetFilters">
                  {{ trlang.reset }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="paginationConfig"
      :row-key="record => record.id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'no'">
          <a-typography-text>
            {{ record.isSum ? '' : (paginationConfig.current - 1) * paginationConfig.pageSize + index }}
          </a-typography-text>
        </template>
        <template v-else-if="column.key === 'date'">
          <a-typography-text>
            {{ record.isSum ? 'SUM' : (record.date ? dayjs(record.date).format('YYYY-MM-DD') : '-') }}
          </a-typography-text>
        </template>
        <template v-else-if="['total_betting_amount', 'win_betting_amount', 'losing_amount', 'betting_profit', 
                              'company_profit', 'charge_total_amount', 'charge_amount', 'partner_increase',
                              'exchange_total_amount', 'withdraw', 'partner_decrease'].includes(column.key)">
          <a-typography-text :class="getAmountClass(record, column.key)">
            {{ formatAmount(record[column.key], record, column.key) }}
          </a-typography-text>
        </template>
        <template v-else-if="column.key === 'betting_p'">
          <a-typography-text>
            {{ formatNumber(record.betting_p) }} P
          </a-typography-text>
        </template>
        <template v-else-if="column.key === 'partner_rate'">
          <a-typography-text>
            {{ formatPercentage(record.partner_rate) }}%
          </a-typography-text>
        </template>
      </template>
    </a-table>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "BettingSettlementView" });

import { ref, computed, inject, onMounted } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

import { getData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { usePagination } from "@/composables/usePagination";

const langState = inject("langState");
const trlang = computed(() => {
  if (!langState || !langState.translations) {
    return {};
  }
  return langState.translations;
});

const loading = ref(false);
const filters = ref({
  dateRange: null,
  partnerId: null,
  includeSubPartners: false,
});

const partnerTreeOptions = ref([]);
const tableData = ref([]);
const { paginationConfig, setTotal } = usePagination(20);

const columns = computed(() => [
  { 
    title: trlang.value.no_column, 
    dataIndex: "no", 
    key: "no", 
    width: 80, 
    align: "center",
    fixed: "left"
  },
  { 
    title: trlang.value.date, 
    dataIndex: "date", 
    key: "date", 
    width: 120,
    fixed: "left"
  },
  { 
    title: trlang.value.total_betting_amount, 
    dataIndex: "total_betting_amount", 
    key: "total_betting_amount", 
    width: 150,
    align: "right"
  },
  { 
    title: trlang.value.win_betting_amount, 
    dataIndex: "win_betting_amount", 
    key: "win_betting_amount", 
    width: 150,
    align: "right"
  },
  { 
    title: trlang.value.losing_amount, 
    dataIndex: "losing_amount", 
    key: "losing_amount", 
    width: 150,
    align: "right"
  },
  { 
    title: trlang.value.betting_profit, 
    dataIndex: "betting_profit", 
    key: "betting_profit", 
    width: 150,
    align: "right"
  },
  { 
    title: trlang.value.betting_p, 
    dataIndex: "betting_p", 
    key: "betting_p", 
    width: 120,
    align: "right"
  },
  { 
    title: trlang.value.partner_rate, 
    dataIndex: "partner_rate", 
    key: "partner_rate", 
    width: 120,
    align: "right"
  },
  { 
    title: trlang.value.company_profit, 
    dataIndex: "company_profit", 
    key: "company_profit", 
    width: 150,
    align: "right"
  },
  {
    title: trlang.value.charge,
    key: "charge",
    children: [
      { 
        title: trlang.value.charge_total_amount, 
        dataIndex: "charge_total_amount", 
        key: "charge_total_amount", 
        width: 150,
        align: "right"
      },
      { 
        title: trlang.value.charge_amount, 
        dataIndex: "charge_amount", 
        key: "charge_amount", 
        width: 150,
        align: "right"
      },
      { 
        title: trlang.value.partner_increase, 
        dataIndex: "partner_increase", 
        key: "partner_increase", 
        width: 150,
        align: "right"
      },
    ],
  },
  {
    title: trlang.value.exchange,
    key: "exchange",
    children: [
      { 
        title: trlang.value.exchange_total_amount, 
        dataIndex: "exchange_total_amount", 
        key: "exchange_total_amount", 
        width: 150,
        align: "right"
      },
      { 
        title: trlang.value.withdraw, 
        dataIndex: "withdraw", 
        key: "withdraw", 
        width: 150,
        align: "right"
      },
      { 
        title: trlang.value.partner_decrease, 
        dataIndex: "partner_decrease", 
        key: "partner_decrease", 
        width: 150,
        align: "right"
      },
    ],
  },
]);

const formatAmount = (value, record, key) => {
  if (value == null || value === undefined) return "0";
  const numericValue = Number.isFinite(value) ? Number(value) : 0;
  const formatted = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericValue);
  
  const count = getCountForField(record, key);
  if (count !== null && count > 0 && numericValue !== 0) {
    return `${formatted} (${count})`;
  }
  return `${formatted}`;
};

const formatNumber = (value) => {
  if (value == null || value === undefined) return "0";
  const numericValue = Number.isFinite(value) ? Number(value) : 0;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatPercentage = (value) => {
  if (value == null || value === undefined) return "0";
  const numericValue = Number.isFinite(value) ? Number(value) : 0;
  return numericValue.toFixed(1);
};

const getCountForField = (record, key) => {
  const countKey = `${key}_count`;
  if (record && record[countKey] != null) {
    return record[countKey];
  }
  return null;
};

const getAmountClass = (record, key) => {
  const value = record[key];
  if (value == null || value === undefined) return "";
  
  const numericValue = Number.isFinite(value) ? Number(value) : 0;
  
  if (numericValue < 0) return "text-red";
  if (key === 'losing_amount' && numericValue > 0) return "text-red";
  if (key === 'betting_profit' && numericValue > 0) return "text-red";
  if (key === 'withdraw' && numericValue > 0) return "text-red";
  
  if (key === 'charge_amount' && numericValue > 0) return "text-green";
  
  return "";
};

const buildQueryParams = () => {
  const params = new URLSearchParams();
  const currentPage = paginationConfig.value?.current || 1;
  const pageSize = paginationConfig.value?.pageSize || 20;
  
  params.set("page", `${currentPage}`);
  params.set("pageSize", `${pageSize}`);

  const range = filters.value.dateRange;
  if (range && Array.isArray(range) && range.length === 2) {
    const [start, end] = range;
    if (start) {
      const startDate = dayjs.isDayjs(start) ? start.format('YYYY-MM-DD') : start;
      params.set("startDate", startDate);
    }
    if (end) {
      const endDate = dayjs.isDayjs(end) ? end.format('YYYY-MM-DD') : end;
      params.set("endDate", endDate);
    }
  }

  if (filters.value.partnerId) {
    params.set("partnerId", filters.value.partnerId);
  }

  if (filters.value.includeSubPartners) {
    params.set("includeSubPartners", "true");
  }

  return params.toString();
};


const fetchData = async () => {
  loading.value = true;
  try {
    const query = buildQueryParams();
    const result = await getData(`${apiLink.betting_settlement_profit}?${query}`);

    if (!result.status) {
      tableData.value = [];
      setTotal(0);
      return;
    }

    const data = result.data || {};
    const settlementData = data.settlements || {};
    const items = Array.isArray(settlementData.items) ? settlementData.items : [];

    if (!data || !settlementData) {
      message.error(trlang.value.no_settlement_data);
    }

    setTotal(settlementData.total || 0);
    
    if (settlementData.page) {
      paginationConfig.value.current = settlementData.page;
    }
    if (settlementData.pageSize) {
      paginationConfig.value.pageSize = settlementData.pageSize;
    }

    const dailyData = items.map((item, index) => {
      if (!item || typeof item !== "object") {
        return {
          id: item.isSum ? 'SUM' : `settlement-${index}`,
          date: null,
          total_betting_amount: 0,
          total_betting_amount_count: 0,
          win_betting_amount: 0,
          losing_amount: 0,
          losing_amount_count: 0,
          betting_profit: 0,
          betting_p: 0,
          partner_rate: 0,
          company_profit: 0,
          charge_total_amount: 0,
          charge_amount: 0,
          charge_amount_count: 0,
          partner_increase: 0,
          exchange_total_amount: 0,
          withdraw: 0,
          withdraw_count: 0,
          partner_decrease: 0,
          isSum: item.isSum || false,
        };
      }

      const itemDate = item.date || null;
      const dateId = itemDate ? itemDate : (item.isSum ? 'SUM' : `settlement-${index}`);

      return {
        id: dateId || `settlement-${index}`,
        date: itemDate,
        total_betting_amount: Number.isFinite(item.totalBettingAmount) ? Number(item.totalBettingAmount) : 0,
        total_betting_amount_count: Number.isFinite(item.totalBettingAmount_count) ? Number(item.totalBettingAmount_count) : 0,
        win_betting_amount: Number.isFinite(item.winBettingAmount) ? Number(item.winBettingAmount) : 0,
        losing_amount: Number.isFinite(item.losingAmount) ? Number(item.losingAmount) : 0,
        losing_amount_count: Number.isFinite(item.losingAmount_count) ? Number(item.losingAmount_count) : 0,
        betting_profit: Number.isFinite(item.bettingProfit) ? Number(item.bettingProfit) : 0,
        betting_p: Number.isFinite(item.bettingP) ? Number(item.bettingP) : 0,
        partner_rate: Number.isFinite(item.partnerRate) ? Number(item.partnerRate) : 0,
        company_profit: Number.isFinite(item.companyProfit) ? Number(item.companyProfit) : 0,
        charge_total_amount: Number.isFinite(item.chargeTotalAmount) ? Number(item.chargeTotalAmount) : 0,
        charge_amount: Number.isFinite(item.chargeAmount) ? Number(item.chargeAmount) : 0,
        charge_amount_count: Number.isFinite(item.chargeAmount_count) ? Number(item.chargeAmount_count) : 0,
        partner_increase: Number.isFinite(item.partnerIncrease) ? Number(item.partnerIncrease) : 0,
        exchange_total_amount: Number.isFinite(item.exchangeTotalAmount) ? Number(item.exchangeTotalAmount) : 0,
        withdraw: Number.isFinite(item.withdraw) ? Number(item.withdraw) : 0,
        withdraw_count: Number.isFinite(item.withdraw_count) ? Number(item.withdraw_count) : 0,
        partner_decrease: Number.isFinite(item.partnerDecrease) ? Number(item.partnerDecrease) : 0,
        isSum: item.isSum || false,
      };
    });

    tableData.value = dailyData;
  } catch (error) {
    console.error("Error fetching settlement data:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    tableData.value = [];
    setTotal(0);
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pagination) => {
  paginationConfig.value.current = pagination.current;
  paginationConfig.value.pageSize = pagination.pageSize;
  fetchData();
};

const convertPartnerToTree = (partner) => {
  if (!partner || !partner.id) return null;
  
  const node = {
    title: `${partner.nickname} (${partner.partner_id || partner.id})`,
    value: partner.id,
    children: []
  };

  if (partner.subs && Array.isArray(partner.subs) && partner.subs.length > 0) {
    node.children = partner.subs
      .map(sub => convertPartnerToTree(sub))
      .filter(Boolean);
  }

  return node;
};

const fetchPartnerList = async () => {
  try {
    const res = await getData(apiLink.get_game_partner);
    if (res.status && res.data) {
      if (Array.isArray(res.data)) {
        partnerTreeOptions.value = res.data
          .map(partner => convertPartnerToTree(partner))
          .filter(Boolean);
      } else if (res.data.id) {
        const tree = convertPartnerToTree(res.data);
        partnerTreeOptions.value = tree ? [tree] : [];
      } else {
        partnerTreeOptions.value = [];
      }
    } else {
      partnerTreeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching partner list:", error);
    message.error(error.message || trlang.value.failed_to_fetch_data);
    partnerTreeOptions.value = [];
  }
};

const resetFilters = () => {
  filters.value = {
    dateRange: null,
    partnerId: null,
    includeSubPartners: false,
  };
  paginationConfig.value.current = 1;
  fetchData();
};

onMounted(() => {
  fetchPartnerList();
  fetchData();
});
</script>

