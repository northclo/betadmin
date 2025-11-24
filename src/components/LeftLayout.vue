<template>
  <a-layout-sider :trigger="null" collapsible class="left-rail">
    <div class="left-rail__wrap">
      <header class="left-rail__hero">
        <span class="left-rail__eyebrow">{{ trlang.betting_settlement_profit }}</span>
        <div class="left-rail__hero-value">
          <span class="num">{{ formatNumber(summaryData.bettingSettlementProfit) }}</span>
          <span class="unit">{{ trlang.global_currency }}</span>
        </div>
        <p class="left-rail__meta">
          {{ trlang.user_points }} <strong>{{ formatNumber(summaryData.userPoints) }}</strong> {{ trlang.points_unit }}
        </p>
      </header>

      <section class="left-rail__section">
        <div class="left-rail__label">{{ trlang.current_site_users }}</div>
        <div class="left-rail__metric">
          <span>{{ formatNumber(summaryData.currentSiteUsers) }}</span>
          <small>{{ trlang.users }}</small>
        </div>
        <a-select
          class="left-rail__select"
          v-model:value="activeOption"
          size="small"
          :loading="loading"
        >
          <a-select-option v-for="item in options" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </section>

      <section class="left-rail__section">
        <div class="left-rail__pillset">
          <div class="pill">
            <span>{{ trlang.deposit }}</span>
            <strong>{{ formatNumber(summaryData.todayDeposit) }}</strong>
          </div>
          <div class="pill">
            <span>{{ trlang.withdrawal }}</span>
            <strong>{{ formatNumber(summaryData.todayWithdrawal) }}</strong>
          </div>
        </div>
      </section>

      <a-spin :spinning="loading" :tip="trlang.loading">
        <section
          v-for="group in summaryBlocks"
          :key="group.key"
          class="left-rail__section left-rail__section--list"
        >
          <header>{{ group.title }}</header>
          <ul>
            <li v-for="item in group.items" :key="item.label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </li>
          </ul>
        </section>
      </a-spin>

      <section class="left-rail__section left-rail__section--list">
        <ul>
          <li v-for="item in totalStats" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </li>
        </ul>
      </section>
    </div>
  </a-layout-sider>
</template>

<script>
import { ref, inject, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";

export default {
  name: "LeftLayout",
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const activeOption = ref('entire');
    const loading = ref(false);
    
    const options = computed(() => [
      { value: 'entire', label: trlang.value.entire },
      { value: 'minigames', label: trlang.value.minigames },
    ]);
    const summaryData = ref({
      bettingSettlementProfit: 0,
      userPoints: 0,
      currentSiteUsers: 0,
      todayDeposit: 0,
      todayWithdrawal: 0,
      entireGame: {
        battingGan: 0,
        betting: 0,
        hit: 0,
        bettingP: 0,
        revenue: 0,
      },
      minigames: {
        battingGan: 0,
        hit: 0,
        bettingP: 0,
        revenue: 0,
      },
    });

    const formatNumber = (num) => {
      if (num === null || num === undefined) return '0';
      return Number(num).toLocaleString('en-US');
    };

    const fetchSidebarSummary = async () => {
      try {
        loading.value = true;
        const result = await getData(apiLink.get_sidebar_summary);
        if (result.status && result.data) {
          summaryData.value = {
            bettingSettlementProfit: result.data.bettingSettlementProfit || 0,
            userPoints: result.data.userPoints || 0,
            currentSiteUsers: result.data.currentSiteUsers || 0,
            todayDeposit: result.data.todayDeposit || 0,
            todayWithdrawal: result.data.todayWithdrawal || 0,
            entireGame: result.data.entireGame || {
              battingGan: 0,
              betting: 0,
              hit: 0,
              bettingP: 0,
              revenue: 0,
            },
            minigames: result.data.minigames || {
              battingGan: 0,
              hit: 0,
              bettingP: 0,
              revenue: 0,
            },
          };
        }
      } catch (error) {
        console.error("Error fetching sidebar summary:", error);
        message.error(error.message || trlang.value.failed_to_fetch_data);
      } finally {
        loading.value = false;
      }
    };

    const summaryBlocks = computed(() => {
      const gameData = activeOption.value === 'entire' 
        ? summaryData.value.entireGame 
        : summaryData.value.minigames;

      if (activeOption.value === 'entire') {
        return [
          {
            key: 'entire',
            title: trlang.value.the_entire_game,
            items: [
              { label: trlang.value.batting_gan, value: formatNumber(gameData.battingGan) },
              { label: trlang.value.betting, value: formatNumber(gameData.betting) },
              { label: trlang.value.hit, value: formatNumber(gameData.hit) },
              { label: trlang.value.betting_p, value: formatNumber(gameData.bettingP) },
              { label: trlang.value.revenue, value: formatNumber(gameData.revenue) },
            ],
          },
        ];
      } else {
        return [
          {
            key: 'mini',
            title: trlang.value.minigames,
            items: [
              { label: trlang.value.batting_gan, value: formatNumber(gameData.battingGan) },
              { label: trlang.value.hit, value: formatNumber(gameData.hit) },
              { label: trlang.value.betting_p, value: formatNumber(gameData.bettingP) },
              { label: trlang.value.revenue, value: formatNumber(gameData.revenue) },
            ],
          },
        ];
      }
    });

    const totalStats = computed(() => [
      { label: trlang.value.total, value: formatNumber(summaryData.value.bettingSettlementProfit) },
    ]);

    onMounted(() => {
      fetchSidebarSummary();
    });

    return {
      trlang,
      options,
      activeOption,
      summaryBlocks,
      totalStats,
      summaryData,
      formatNumber,
      loading,
    };
  },
};
</script>
