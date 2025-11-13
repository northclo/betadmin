<template>
  <a-layout class="dashboard-view">
    <section class="dashboard-header">
      <a-typography-title :level="3">
        {{ trlang.main_page }}
      </a-typography-title>
      <a-typography-text type="secondary">
        {{ trlang.dashboard_welcome }}
      </a-typography-text>
    </section>

    <a-row :gutter="[16, 16]" class="dashboard-grid">
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

  </a-layout>
</template>

<script setup>
defineOptions({ name: "AdminDashboardView" });
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(true);
const windowWidth = ref(window.innerWidth);
const summary = ref({
  totalMembers: 0,
  activeMembers: 0,
  totalPartners: 0,
  newPartners: 0,
});
const pendingTasks = ref([]);

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
  }, 150);
};

const simulateFetch = () => {
  summary.value = {
    totalMembers: 2840,
    activeMembers: 912,
    totalPartners: 128,
    newPartners: 12,
  };

  pendingTasks.value = [
    { label: trlang.value.pending_approvals, value: 8 },
    { label: trlang.value.pending_charges, value: 5 },
    { label: trlang.value.support_tickets, value: 3 },
  ];

  loading.value = false;
};

onMounted(() => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
  simulateFetch();
});

onBeforeUnmount(() => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  window.removeEventListener("resize", updateWindowWidth);
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

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: gap 0.3s ease;
}

.dashboard-header :deep(.ant-typography-title) {
  margin-bottom: 0 !important;
  font-weight: 700;
  transition: font-size 0.3s ease;
}

.dashboard-header :deep(.ant-typography-text) {
  font-size: 14px;
  transition: font-size 0.3s ease;
}

.dashboard-grid {
  margin: 0;
  width: 100%;
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

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 28px;
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

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 26px;
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

  .dashboard-header {
    gap: 6px;
  }

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 24px;
  }

  .dashboard-header :deep(.ant-typography-text) {
    font-size: 13px;
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

  .dashboard-header {
    gap: 6px;
  }

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 22px;
  }

  .dashboard-header :deep(.ant-typography-text) {
    font-size: 13px;
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

  .dashboard-header {
    gap: 4px;
  }

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 20px;
  }

  .dashboard-header :deep(.ant-typography-text) {
    font-size: 12px;
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

  .dashboard-header :deep(.ant-typography-title) {
    font-size: 18px;
  }

  .dashboard-header :deep(.ant-typography-text) {
    font-size: 11px;
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
  .dashboard-header :deep(.ant-typography-title) {
    font-size: 16px;
  }

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

/* Landscape Orientation Adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .metric-card {
    min-height: 140px;
  }

  .dashboard-view {
    gap: 16px;
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .dashboard-view,
  .dashboard-header,
  .metric-card,
  .metric-value,
  .pending-list,
  .pending-item {
    transition: none;
  }
}
</style>

