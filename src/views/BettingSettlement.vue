<template>
  <a-layout class="settlement-view">
    <header class="settlement-header">
      <a-typography-title :level="3">
        {{ trlang.betting_settlement_profit }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.betting_settlement_description }}
      </a-typography-text>
    </header>

    <a-card class="filters-card">
      <a-form :model="filters" layout="vertical" @submit.prevent>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.settlement_range">
              <a-range-picker
                v-model:value="filters.range"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-form-item :label="trlang.partner_filter">
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
          <a-col :xs="24" :md="8" class="actions">
            <a-button type="primary" class="bg-main text-white" @click="fetchData">
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
          <a-typography-title :level="2" class="summary-value">
            {{ card.value }}
          </a-typography-title>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="table-card">
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
    </a-card>
  </a-layout>
</template>

<script setup>
defineOptions({ name: "BettingSettlementView" });

import { ref, computed, inject, onMounted } from "vue";
import dayjs from "dayjs";

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
  const allLabel = trlang.value.all ?? "All";
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
    title: trlang.value.total_bet_amount ?? "Total Bet",
    value: formatCurrency(summary.value.totalBetAmount),
  },
  {
    key: "total_payout",
    title: trlang.value.total_payout ?? "Total Payout",
    value: formatCurrency(summary.value.totalPayout),
  },
  {
    key: "total_profit",
    title: trlang.value.total_profit ?? "Profit",
    value: formatCurrency(summary.value.totalProfit),
  },
  {
    key: "settled_rounds",
    title: trlang.value.settled_rounds ?? "Settled Rounds",
    value: (summary.value.settledRounds ?? 0).toLocaleString(),
  },
]);

const columns = computed(() => [
  { title: trlang.value.round_no ?? "Round", dataIndex: "round", key: "round", width: 140 },
  { title: trlang.value.partner_filter ?? "Partner", dataIndex: "partner", key: "partner", width: 180 },
  { title: trlang.value.bet_amount ?? "Bet Amount", dataIndex: "bet_amount", key: "bet_amount", width: 160 },
  { title: trlang.value.payout ?? "Payout", dataIndex: "payout", key: "payout", width: 160 },
  { title: trlang.value.profit ?? "Profit", dataIndex: "profit", key: "profit", width: 160 },
  { title: trlang.value.settled_at ?? "Settled At", dataIndex: "settled_at", key: "settled_at", width: 200 },
]);

const formatCurrency = (value) => {
  const numericValue = Number.isFinite(value) ? value : 0;
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const buildQueryParams = () => {
  const params = new URLSearchParams();
  params.set("page", `${pagination.value.current}`);
  params.set("pageSize", `${pagination.value.pageSize}`);

  const [start, end] = filters.value.range || [];
  if (start && dayjs.isDayjs(start)) {
    params.set("startDate", start.toISOString());
  }
  if (end && dayjs.isDayjs(end)) {
    params.set("endDate", end.toISOString());
  }

  if (filters.value.partner && filters.value.partner !== "all") {
    params.set("partner", filters.value.partner);
  }

  return params.toString();
};

const formatRoundLabel = (item) => {
  const total = item.totalNo != null ? `#${item.totalNo}` : item.gameId ? `#${item.gameId}` : "-";
  if (item.todayNo != null && item.todayNo !== "") {
    return `${total}-${item.todayNo}`;
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
      return;
    }

    const data = result.data || {};
    const summaryData = data.summary || {};
    const settlementData = data.settlements || {};
    const items = Array.isArray(settlementData.items) ? settlementData.items : [];

    summary.value = {
      totalBetAmount: summaryData.totalBetAmount || 0,
      totalPayout: summaryData.totalPayout || 0,
      totalProfit: summaryData.totalProfit || 0,
      settledRounds: summaryData.settledRounds || 0,
    };

    pagination.value.total = settlementData.total || 0;

    tableData.value = items.map((item, index) => {
      const rowKeyParts = [
        item.partnerId,
        item.totalNo ?? item.gameId ?? "",
        item.todayNo ?? "",
      ]
        .filter(Boolean)
        .join("-");

      return {
        id: rowKeyParts || `settlement-${index}`,
        round: formatRoundLabel(item),
        partner: item.partnerName || item.partnerCode || "-",
        bet_amount: item.betAmount || 0,
        payout: item.payout || 0,
        profit: item.profit || 0,
        settled_at: item.settledAt ? dayjs(item.settledAt).format("YYYY-MM-DD HH:mm") : "-",
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

<style scoped>
.settlement-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settlement-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters-card {
  background: var(--surface-color);
}

.actions {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.summary-card {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary-value {
  margin-bottom: 0;
}

.table-card {
  background: var(--surface-color);
}
</style>

