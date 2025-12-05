<template>
  <a-layout>
    <div>
      <a-typography-title :level="3">
        {{ trlang.dashboard }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.dashboard_welcome }}
      </a-typography-text>
    </div>

    <!-- <a-row :gutter="[16, 16]">
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
    </a-row> -->

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
import { message } from "ant-design-vue";

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

// const titleLevel = computed(() => {
//   if (windowWidth.value <= 480) return 4;
//   if (windowWidth.value <= 768) return 3;
//   return 2;
// });

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
    message.error(error.message || trlang.value.failed_to_fetch_data);
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
    message.error(error.message || trlang.value.failed_to_fetch_data);
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
    message.error(error.message || trlang.value.failed_to_fetch_data);
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
      data: [trlang.value.all_loggedin],
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
    message.error(error.message || trlang.value.failed_to_fetch_data);
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
.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.metric-card :deep(.ant-card-head) {
  min-height: 48px !important;
  padding: 0 16px !important;
}

.metric-card :deep(.ant-card-head-title) {
  font-weight: 600;
  font-size: 16px;
}

.metric-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 16px !important;
}

.metric-card :deep(.ant-card-body::after),
.metric-card :deep(.ant-card-body::before) {
  content: none !important;
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
  gap: 8px;
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

.chart-card {
  min-height: 300px;
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
</style>

