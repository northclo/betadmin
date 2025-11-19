<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.betting_settlement_profit }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.betting_settlement_description }}
      </a-typography-text>
    </div>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="6">
            <a-form-item class="mb-0" :label="trlang.settlement_range">
              <a-range-picker
                v-model:value="filters.range"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4">
            <a-form-item class="mb-0" :label="trlang.partner_filter">
              <a-select v-model:value="filters.partner">
                <a-select-option value="all">
                  {{ trlang.all }}
                </a-select-option>
                <a-select-option v-for="partner in partnerOptions" :key="partner.value" :value="partner.value">
                  {{ partner.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="4" class="actions">
            <a-button type="primary" class="bg-main text-white" :loading="loading" @click="fetchData">
              {{ trlang.search }}
            </a-button>
            <a-button @click="resetFilters">
              {{ trlang.reset }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :md="12" :lg="6" v-for="card in summaryCards" :key="card.key">
        <a-card class="summary-card">
          <template #title>{{ card.title }}</template>
          <a-typography-title :level="2" class="mb-0">
            {{ card.value }}
          </a-typography-title>
        </a-card>
      </a-col>
    </a-row>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :pagination="pagination"
      :row-key="record => record.id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'bet_amount' || column.dataIndex === 'payout' || column.dataIndex === 'profit'">
          {{ formatCurrency(text) }}
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

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(false);
const filters = ref({
  range: [dayjs().subtract(7, "day"), dayjs()],
  partner: "all",
});

const summary = ref({
  totalBetAmount: 0,
  totalPayout: 0,
  totalProfit: 0,
  settledRounds: 0,
});

const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
});

const tableData = ref([]);
const rawPartnerOptions = ref([]);

const partnerOptions = computed(() => {
  const allLabel = trlang.value.all;
  const mapped = rawPartnerOptions.value.map((partner) => {
    const fallbackId = partner.id?.slice?.(-6) || "";
    return {
      value: partner.id,
      label: partner.nickname || partner.partnerId || fallbackId || partner.id,
    };
  });
  return [{ value: "all", label: allLabel }, ...mapped];
});

const summaryCards = computed(() => [
  {
    key: "total_bet",
    title: trlang.value.total_bet_amount,
    value: formatCurrency(summary.value.totalBetAmount),
  },
  {
    key: "total_payout",
    title: trlang.value.total_payout,
    value: formatCurrency(summary.value.totalPayout),
  },
  {
    key: "total_profit",
    title: trlang.value.total_profit,
    value: formatCurrency(summary.value.totalProfit),
  },
  {
    key: "settled_rounds",
    title: trlang.value.settled_rounds,
    value: (summary.value.settledRounds ?? 0).toLocaleString(),
  },
]);

const columns = computed(() => [
  { title: trlang.value.no_column, dataIndex: "no", key: "no", width: 80, align: "center" },
  { title: trlang.value.round_no, dataIndex: "round", key: "round", width: 140 },
  { title: trlang.value.partner_filter, dataIndex: "partner", key: "partner", width: 180 },
  { title: trlang.value.bet_amount, dataIndex: "bet_amount", key: "bet_amount", width: 160 },
  { title: trlang.value.payout, dataIndex: "payout", key: "payout", width: 160 },
  { title: trlang.value.profit, dataIndex: "profit", key: "profit", width: 160 },
  { title: trlang.value.settled_at, dataIndex: "settled_at", key: "settled_at", width: 200 },
]);

const formatCurrency = (value) => {
  if (value == null || value === undefined) return "$0";
  const numericValue = Number.isFinite(value) ? Number(value) : 0;
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const buildQueryParams = () => {
  const params = new URLSearchParams();
  const currentPage = pagination.value?.current || 1;
  const pageSize = pagination.value?.pageSize || 20;
  
  params.set("page", `${currentPage}`);
  params.set("pageSize", `${pageSize}`);

  const range = filters.value?.range || [];
  const [start, end] = Array.isArray(range) ? range : [];
  
  if (start && dayjs.isDayjs(start) && start.isValid()) {
    params.set("startDate", start.toISOString());
  }
  if (end && dayjs.isDayjs(end) && end.isValid()) {
    params.set("endDate", end.toISOString());
  }

  const partner = filters.value?.partner;
  if (partner && partner !== "all" && typeof partner === "string") {
    params.set("partner", partner);
  }

  return params.toString();
};

const formatRoundLabel = (item) => {
  if (!item) return "-";
  
  const totalNo = item.totalNo != null ? item.totalNo : null;
  const gameId = item.gameId || null;
  const todayNo = item.todayNo != null && item.todayNo !== "" ? item.todayNo : null;
  
  const total = totalNo != null ? `#${totalNo}` : gameId ? `#${gameId}` : "-";
  
  if (todayNo != null) {
    return `${total}-${todayNo}`;
  }
  return total;
};

const fetchData = async (page = pagination.value.current) => {
  pagination.value.current = page;
  loading.value = true;
  try {
    const query = buildQueryParams();
    const result = await getData(`${apiLink.betting_settlement_profit}?${query}`);

    if (!result.status) {
      message.error(
        result.message || trlang.value.failed_to_load_settlement
      );
      summary.value = {
        totalBetAmount: 0,
        totalPayout: 0,
        totalProfit: 0,
        settledRounds: 0,
      };
      tableData.value = [];
      pagination.value.total = 0;
      return;
    }

    const data = result.data || {};
    const summaryData = data.summary || {};
    const settlementData = data.settlements || {};
    const items = Array.isArray(settlementData.items) ? settlementData.items : [];

    if (!data || (!summaryData && !settlementData)) {
      message.warning(trlang.value.no_settlement_data);
    }

    summary.value = {
      totalBetAmount: summaryData.totalBetAmount || 0,
      totalPayout: summaryData.totalPayout || 0,
      totalProfit: summaryData.totalProfit || 0,
      settledRounds: summaryData.settledRounds || 0,
    };

    pagination.value.total = settlementData.total || 0;

    tableData.value = items.map((item, index) => {
      const rowNumber = (pagination.value.current - 1) * pagination.value.pageSize + index + 1;
      
      if (!item || typeof item !== "object") {
        return {
          id: `settlement-${index}`,
          no: rowNumber,
          round: "-",
          partner: "-",
          bet_amount: 0,
          payout: 0,
          profit: 0,
          settled_at: "-",
        };
      }

      const rowKeyParts = [
        item.partnerId,
        item.totalNo ?? item.gameId ?? "",
        item.todayNo ?? "",
      ]
        .filter(Boolean)
        .join("-");

      let settledAtFormatted = "-";
      if (item.settledAt) {
        const settledDate = dayjs(item.settledAt);
        if (settledDate.isValid()) {
          settledAtFormatted = settledDate.format("YYYY-MM-DD HH:mm");
        }
      }

      return {
        id: rowKeyParts || `settlement-${index}`,
        no: rowNumber,
        round: formatRoundLabel(item),
        partner: item.partnerName || item.partnerCode || "-",
        bet_amount: Number.isFinite(item.betAmount) ? Number(item.betAmount) : 0,
        payout: Number.isFinite(item.payout) ? Number(item.payout) : 0,
        profit: Number.isFinite(item.profit) ? Number(item.profit) : 0,
        settled_at: settledAtFormatted,
      };
    });

    if (Array.isArray(data.partners)) {
      rawPartnerOptions.value = data.partners;

      const selectedExists =
        filters.value.partner === "all" ||
        rawPartnerOptions.value.some((partner) => partner.id === filters.value.partner);

      if (!selectedExists) {
        filters.value.partner = "all";
      }
    }
  } catch (error) {
    console.error("Error fetching settlement data:", error);
    message.error(trlang.value.failed_to_load_settlement);
    summary.value = {
      totalBetAmount: 0,
      totalPayout: 0,
      totalProfit: 0,
      settledRounds: 0,
    };
    tableData.value = [];
    pagination.value.total = 0;
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (paginationConfig) => {
  pagination.value.pageSize = paginationConfig.pageSize;
  pagination.value.current = paginationConfig.current;
  fetchData(pagination.value.current);
};

const resetFilters = () => {
  filters.value = {
    range: [dayjs().subtract(7, "day"), dayjs()],
    partner: "all",
  };
  pagination.value.current = 1;
  fetchData(1);
};

onMounted(() => {
  fetchData();
});
</script>

