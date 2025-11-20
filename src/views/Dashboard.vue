<template>
  <a-layout class="dashboard-view">
    <div>
      <a-typography-title :level="3">
        {{ trlang.main_page }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.dashboard_welcome }}
      </a-typography-text>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.total_members }}</template>
          <a-typography-title :level="titleLevel" class="metric-value">
            {{ summary.totalMembers.toLocaleString() }}
          </a-typography-title>
          <a-typography-text type="secondary" class="metric-description">
            {{ trlang.members_active_today }}: {{ summary.activeMembers.toLocaleString() }}
          </a-typography-text>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.total_partner }}</template>
          <a-typography-title :level="titleLevel" class="metric-value">
            {{ summary.totalPartners.toLocaleString() }}
          </a-typography-title>
          <a-typography-text type="secondary" class="metric-description">
            {{ trlang.new_partners_this_week }}: {{ summary.newPartners.toLocaleString() }}
          </a-typography-text>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.pending_tasks }}</template>
          <ul class="pending-list">
            <li v-for="item in pendingTasks" :key="item.label" class="pending-item">
              <span class="pending-label">{{ item.label }}</span>
              <span class="pending-value">{{ item.value }}</span>
            </li>
          </ul>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="dashboard-charts">
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-card class="chart-card">
          <template #title>
            <span class="chart-title">
              <span class="chart-icon">←</span>
              {{ trlang.this_month_loggedin_users }}
            </span>
          </template>
          <div class="chart-wrapper">
            <div v-if="chartLoading" class="chart-loading">
              <a-spin size="large" />
            </div>
            <div class="chart-container" ref="loggedInChartRef" />
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-card class="chart-card">
          <template #title>
            <span class="chart-title">
              <span class="chart-icon">←</span>
              {{ trlang.this_month_charge_exchange }}
            </span>
          </template>
          <div class="chart-wrapper">
            <div v-if="chartLoading" class="chart-loading">
              <a-spin size="large" />
            </div>
            <div class="chart-container" ref="chargeExchangeChartRef" />
          </div>
        </a-card>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script setup>
defineOptions({ name: "AdminDashboardView" });
import { ref, computed, inject, onMounted, onBeforeUnmount, nextTick, watchEffect } from "vue";
import * as echarts from "echarts";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(true);
const chartLoading = ref(true);
const windowWidth = ref(window.innerWidth);
const summary = ref({
  totalMembers: 0,
  activeMembers: 0,
  totalPartners: 0,
  newPartners: 0,
});
const pendingTasks = ref([]);

const loggedInChartRef = ref(null);
const chargeExchangeChartRef = ref(null);
let loggedInChart = null;
let chargeExchangeChart = null;

const chartInitStatus = ref({
  loggedIn: false,
  chargeExchange: false
});

const titleLevel = computed(() => {
  if (windowWidth.value <= 480) return 4;
  if (windowWidth.value <= 768) return 3;
  return 2;
});

let resizeTimer = null;
const updateWindowWidth = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(() => {
    windowWidth.value = window.innerWidth;
    if (loggedInChart) loggedInChart.resize();
    if (chargeExchangeChart) chargeExchangeChart.resize();
  }, 150);
};

const fetchDashboardSummary = async () => {
  try {
    const result = await getData(apiLink.get_dashboard_summary);
    if (result.status && result.data) {
      summary.value = {
        totalMembers: result.data.totalMembers || 0,
        activeMembers: result.data.activeMembers || 0,
        totalPartners: result.data.totalPartners || 0,
        newPartners: result.data.newPartners || 0,
      };

      pendingTasks.value = [
        { label: trlang.value.pending_approvals, value: result.data.pendingApprovals || 0 },
        { label: trlang.value.pending_charges, value: result.data.pendingCharges || 0 },
        { label: trlang.value.support_tickets, value: result.data.supportTickets || 0 },
      ];
    }
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
  } finally {
    loading.value = false;
  }
};

const fetchLoggedInUsersData = async () => {
  try {
    const result = await getData(apiLink.get_monthly_loggedin_users);
    if (result.status && result.data) {
      await nextTick();
      if (loggedInChartRef.value) {
        initLoggedInChart(result.data);
        chartInitStatus.value.loggedIn = true;
      } else {
        console.error("Logged in chart ref not available");
        chartInitStatus.value.loggedIn = true;
      }
    } else {
      console.error("Failed to fetch logged in users data:", result);
      chartInitStatus.value.loggedIn = true;
    }
  } catch (error) {
    console.error("Error fetching logged in users data:", error);
    chartInitStatus.value.loggedIn = true;
  } finally {
    if (chartInitStatus.value.loggedIn && chartInitStatus.value.chargeExchange) {
      chartLoading.value = false;
    }
  }
};

const fetchChargeExchangeData = async () => {
  try {
    const result = await getData(apiLink.get_monthly_charge_exchange);
    if (result.status && result.data) {
      await nextTick();
      if (chargeExchangeChartRef.value) {
        initChargeExchangeChart(result.data);
        chartInitStatus.value.chargeExchange = true;
      } else {
        console.error("Charge exchange chart ref not available");
        chartInitStatus.value.chargeExchange = true;
      }
    } else {
      console.error("Failed to fetch charge exchange data:", result);
      chartInitStatus.value.chargeExchange = true;
    }
  } catch (error) {
    console.error("Error fetching charge exchange data:", error);
    chartInitStatus.value.chargeExchange = true;
  } finally {
    if (chartInitStatus.value.loggedIn && chartInitStatus.value.chargeExchange) {
      chartLoading.value = false;
    }
  }
};

const initLoggedInChart = (data) => {
  if (!loggedInChartRef.value) return;
  
  if (loggedInChart) {
    loggedInChart.dispose();
  }
  
  loggedInChart = echarts.init(loggedInChartRef.value);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [trlang.value.all_loggedin, trlang.value.partner_loggedin],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.days,
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: trlang.value.loggedin_number,
      minInterval: 1
    },
    series: [
      {
        name: trlang.value.all_loggedin,
        type: 'bar',
        data: data.allLoggedIn,
        itemStyle: {
          color: '#5B9BD5'
        }
      },
      {
        name: trlang.value.partner_loggedin,
        type: 'bar',
        data: data.partnerLoggedIn,
        itemStyle: {
          color: '#9B59B6'
        }
      }
    ]
  };
  
  loggedInChart.setOption(option);
};

const initChargeExchangeChart = (data) => {
  if (!chargeExchangeChartRef.value) {
    console.error("Chart ref not available");
    return;
  }
  
  if (!data || !data.days || !Array.isArray(data.days)) {
    console.error("Invalid chart data:", data);
    return;
  }
  
  if (chargeExchangeChart) {
    chargeExchangeChart.dispose();
  }
  
  chargeExchangeChart = echarts.init(chargeExchangeChartRef.value);
  
  const formatValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value;
  };
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result += param.marker + param.seriesName + ': ' + param.value.toLocaleString() + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: [trlang.value.charge, trlang.value.withdrawal],
      bottom: 0,
      itemGap: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.days || [],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: trlang.value.charge_withdraw,
      axisLabel: {
        formatter: function(value) {
          return formatValue(value);
        }
      }
    },
    series: [
      {
        name: trlang.value.charge,
        type: 'bar',
        data: data.charge || [],
        itemStyle: {
          color: '#3498DB'
        }
      },
      {
        name: trlang.value.withdrawal,
        type: 'bar',
        data: data.exchange || [],
        itemStyle: {
          color: '#E67E22'
        }
      }
    ]
  };
  
  chargeExchangeChart.setOption(option);
  
  setTimeout(() => {
    if (chargeExchangeChart) {
      chargeExchangeChart.resize();
    }
  }, 100);
};

const waitForRefs = () => {
  return new Promise((resolve) => {
    if (loggedInChartRef.value && chargeExchangeChartRef.value) {
      resolve(true);
      return;
    }
    
    const stopWatcher = watchEffect(() => {
      if (loggedInChartRef.value && chargeExchangeChartRef.value) {
        stopWatcher();
        resolve(true);
      }
    });
  });
};

onMounted(async () => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
  
  await fetchDashboardSummary();
  
  await nextTick();
  
  const refsReady = await waitForRefs();
  
  if (!refsReady) {
    console.error("Chart refs not available");
    chartLoading.value = false;
    return;
  }
  
  chartInitStatus.value = { loggedIn: false, chargeExchange: false };
  
  try {
    await Promise.all([
      fetchLoggedInUsersData(),
      fetchChargeExchangeData()
    ]);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    chartLoading.value = false;
  }
});

onBeforeUnmount(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  window.removeEventListener("resize", updateWindowWidth);
  if (loggedInChart) {
    loggedInChart.dispose();
  }
  if (chargeExchangeChart) {
    chargeExchangeChart.dispose();
  }
});
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  transition: gap 0.3s ease;
}

.metric-card {
  min-height: 180px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: min-height 0.3s ease;
}

.metric-card :deep(.ant-card-head-title) {
  font-weight: 600;
  font-size: 16px;
  transition: font-size 0.3s ease;
}

.metric-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.metric-value {
  margin: 12px 0 8px 0 !important;
  font-weight: 700;
  transition: font-size 0.3s ease;
}

.metric-description {
  font-size: 14px;
  line-height: 1.5;
  transition: font-size 0.3s ease;
}

.pending-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: gap 0.3s ease;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
  transition: padding 0.3s ease;
}

.pending-item:last-child {
  border-bottom: none;
}

.pending-label {
  color: var(--text-secondary-color);
  font-size: 14px;
  transition: font-size 0.3s ease;
}

.pending-value {
  font-weight: 600;
  color: var(--main-color);
  font-size: 16px;
  transition: font-size 0.3s ease;
}

/* Responsive Design */

/* Large Desktop (1200px and above) */
@media (min-width: 1200px) {
  .dashboard-view {
    gap: 32px;
  }

  .metric-card {
    min-height: 200px;
  }

  .metric-value {
    font-size: 36px;
  }
}

/* Desktop (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .dashboard-view {
    gap: 28px;
  }

  .metric-card {
    min-height: 190px;
  }

  .metric-value {
    font-size: 32px;
  }
}

/* Tablet / iPad Portrait (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .dashboard-view {
    gap: 24px;
  }

  .metric-card {
    min-height: 170px;
  }

  .metric-card :deep(.ant-card-head-title) {
    font-size: 15px;
  }

  .metric-value {
    font-size: 28px;
    margin: 10px 0 6px 0 !important;
  }

  .metric-description {
    font-size: 13px;
  }

  .pending-list {
    gap: 10px;
  }

  .pending-item {
    padding: 6px 0;
  }

  .pending-label {
    font-size: 13px;
  }

  .pending-value {
    font-size: 15px;
  }
}

/* Mobile Landscape / Small Tablet (576px - 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .dashboard-view {
    gap: 20px;
  }

  .metric-card {
    min-height: 160px;
  }

  .metric-card :deep(.ant-card-head-title) {
    font-size: 14px;
  }

  .metric-value {
    font-size: 26px;
    margin: 8px 0 6px 0 !important;
  }

  .metric-description {
    font-size: 12px;
  }

  .pending-list {
    gap: 10px;
  }

  .pending-item {
    padding: 8px 0;
  }

  .pending-label {
    font-size: 13px;
  }

  .pending-value {
    font-size: 15px;
  }
}

/* Mobile Portrait (up to 575px) */
@media (max-width: 575px) {
  .dashboard-view {
    gap: 16px;
  }

  .metric-card {
    min-height: 150px;
  }

  .metric-card :deep(.ant-card-head-title) {
    font-size: 14px;
  }

  .metric-card :deep(.ant-card-body) {
    padding: 16px;
  }

  .metric-value {
    font-size: 24px;
    margin: 8px 0 4px 0 !important;
  }

  .metric-description {
    font-size: 12px;
  }

  .pending-list {
    gap: 8px;
  }

  .pending-item {
    padding: 6px 0;
    flex-wrap: wrap;
  }

  .pending-label {
    font-size: 12px;
    width: 100%;
    margin-bottom: 4px;
  }

  .pending-value {
    font-size: 14px;
    width: 100%;
    text-align: left;
  }
}

/* Extra Small Mobile (up to 375px) */
@media (max-width: 375px) {
  .dashboard-view {
    gap: 14px;
  }

  .metric-card {
    min-height: 140px;
  }

  .metric-card :deep(.ant-card-body) {
    padding: 14px;
  }

  .metric-value {
    font-size: 22px;
  }

  .metric-description {
    font-size: 11px;
  }

  .pending-list {
    gap: 6px;
  }

  .pending-label {
    font-size: 11px;
  }

  .pending-value {
    font-size: 13px;
  }
}

/* Very Small Screens (up to 320px) */
@media (max-width: 320px) {
  .metric-card {
    min-height: 130px;
  }

  .metric-card :deep(.ant-card-body) {
    padding: 12px;
  }

  .metric-value {
    font-size: 20px;
  }
}

/* Chart Styles */
.dashboard-charts {
  margin-top: 24px;
  width: 100%;
}

.chart-card {
  min-height: 400px;
  height: 100%;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.chart-icon {
  color: #999;
  font-size: 14px;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 350px;
  min-height: 350px;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

@media (max-width: 768px) {
  .chart-wrapper {
    height: 300px;
    min-height: 300px;
  }
  
  .chart-container {
    height: 300px;
    min-height: 300px;
  }
  
  .chart-card {
    min-height: 350px;
  }
}

@media (max-width: 576px) {
  .chart-wrapper {
    height: 250px;
    min-height: 250px;
  }
  
  .chart-container {
    height: 250px;
    min-height: 250px;
  }
  
  .chart-card {
    min-height: 300px;
  }
}

/* Landscape Orientation Adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .metric-card {
    min-height: 140px;
  }

  .dashboard-view {
    gap: 16px;
  }
}
</style>

