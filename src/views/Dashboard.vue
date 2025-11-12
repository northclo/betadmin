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
      <a-col :xs="24" :lg="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.total_members }}</template>
          <a-typography-title :level="2" class="metric-value">
            {{ summary.totalMembers.toLocaleString() }}
          </a-typography-title>
          <a-typography-text type="secondary">
            {{ trlang.members_active_today }}: {{ summary.activeMembers.toLocaleString() }}
          </a-typography-text>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.total_partner }}</template>
          <a-typography-title :level="2" class="metric-value">
            {{ summary.totalPartners.toLocaleString() }}
          </a-typography-title>
          <a-typography-text type="secondary">
            {{ trlang.new_partners_this_week }}: {{ summary.newPartners.toLocaleString() }}
          </a-typography-text>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card :loading="loading" class="metric-card">
          <template #title>{{ trlang.pending_tasks }}</template>
          <ul class="pending-list">
            <li v-for="item in pendingTasks" :key="item.label">
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
import { ref, computed, inject, onMounted } from "vue";

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const loading = ref(true);
const summary = ref({
  totalMembers: 0,
  activeMembers: 0,
  totalPartners: 0,
  newPartners: 0,
});
const pendingTasks = ref([]);

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
  simulateFetch();
});
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dashboard-grid {
  margin: 0;
}

.metric-card {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-value {
  margin: 0;
}

.pending-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pending-label {
  color: var(--text-secondary-color);
}

.pending-value {
  font-weight: 600;
  float: right;
  color: var(--main-color);
}

</style>

