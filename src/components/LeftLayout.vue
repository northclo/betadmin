<template>
  <a-layout-sider :trigger="null" collapsible class="left-rail">
    <div class="left-rail__wrap">
      <!-- User Owned Amount and User Point Section -->
      <section class="left-rail__balance-section">
        <div class="left-rail__balance-item">
          <div class="left-rail__balance-label">{{ trlang.user_owned_amount }}</div>
          <div class="left-rail__balance-value">{{ formatNumber(summaryData.userOwnedAmount) }}</div>
        </div>
        <div class="left-rail__balance-item">
          <div class="left-rail__balance-label">{{ trlang.user_points }}</div>
          <div class="left-rail__balance-value">{{ formatNumber(summaryData.userPoints) }}</div>
        </div>
      </section>

      <!-- Current Site Login User Section -->
      <section class="left-rail__section left-rail__section--simple">
        <div class="left-rail__simple-row">
          <span class="left-rail__simple-label">{{ trlang.current_site_login_user }}</span>
          <span class="left-rail__simple-value">{{ formatNumber(summaryData.currentSiteUsers) }}</span>
        </div>
      </section>

      <!-- Today Charge and Withdraw amount Section -->
      <section class="left-rail__section left-rail__section--charge-withdraw">
        <header class="left-rail__charge-header">{{ trlang.today_charge_and_withdraw_amount }}</header>
        <div class="left-rail__charge-content">
          <a-tree-select
            class="left-rail__select"
            v-model:value="selectedPartnerId"
            :tree-data="partnerTreeOptions"
            :placeholder="trlang.select_partner"
            allow-clear
            tree-default-expand-all
            :field-names="{ children: 'children', label: 'title', value: 'value' }"
            size="small"
            :loading="loading"
          />

          <div class="left-rail__pillset">
            <div class="pill pill--deposit">
              <span>{{ trlang.deposit }}</span>
              <strong>{{ formatNumber(summaryData.todayDeposit) }}</strong>
            </div>
            <div class="pill pill--withdrawal">
              <span>{{ trlang.withdrawal }}</span>
              <strong>{{ formatNumber(summaryData.todayWithdrawal) }}</strong>
            </div>
          </div>

          <a-spin :spinning="loading" :tip="trlang.loading">
            <section
              v-for="group in summaryBlocks"
              :key="group.key"
              class="left-rail__game-stats"
            >
              <div class="left-rail__game-label">{{ group.title }}</div>
              <ul class="left-rail__game-list">
                <li v-for="item in group.items" :key="item.label">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </li>
              </ul>
            </section>
          </a-spin>
        </div>
      </section>

      <!-- Total Breakdown Section -->
      <section class="left-rail__section left-rail__section--list left-rail__section--total">
        <ul>
          <li>
            <span>{{ trlang.total }}</span>
            <strong>{{ formatNumber(summaryData.userOwnedAmount) }}</strong>
          </li>
          <li v-for="partner in summaryData.partnerBreakdown" :key="partner.nickname">
            <span>{{ partner.nickname }}</span>
            <strong>{{ formatNumber(partner.ownMoney) }}</strong>
          </li>
        </ul>
      </section>
    </div>
  </a-layout-sider>
</template>

<script>
import { ref, inject, computed, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link.js";

export default {
  name: "LeftLayout",
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const selectedPartnerId = ref(null);
    const partnerTreeOptions = ref([]);
    const loading = ref(false);
    const summaryData = ref({
      bettingSettlementProfit: 0,
      userOwnedAmount: 0,
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
      partnerBreakdown: [],
      totalPartnerMoney: 0,
    });

    const formatNumber = (num) => {
      if (num === null || num === undefined) return '0';
      return Number(num).toLocaleString('en-US');
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

    const fetchSidebarSummary = async () => {
      try {
        loading.value = true;
        let url = apiLink.get_sidebar_summary;
        if (selectedPartnerId.value) {
          url += `?partnerId=${selectedPartnerId.value}&includeSubPartners=true`;
        }
        const result = await getData(url);
        if (result.status && result.data) {
          summaryData.value = {
            bettingSettlementProfit: result.data.bettingSettlementProfit || 0,
            userOwnedAmount: result.data.userOwnedAmount || 0,
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
            partnerBreakdown: result.data.partnerBreakdown || [],
            totalPartnerMoney: result.data.totalPartnerMoney || 0,
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
      const entireGameData = summaryData.value.entireGame || {
        battingGan: 0,
        betting: 0,
        hit: 0,
        bettingP: 0,
        revenue: 0,
      };

      const minigamesData = summaryData.value.minigames || {
        battingGan: 0,
        hit: 0,
        bettingP: 0,
        revenue: 0,
      };

      return [
        {
          key: 'entire',
          title: trlang.value.the_entire_game,
          items: [
            { label: trlang.value.batting_gan, value: formatNumber(entireGameData.battingGan) },
            { label: trlang.value.betting, value: formatNumber(entireGameData.betting) },
            { label: trlang.value.hit, value: formatNumber(entireGameData.hit) },
            { label: trlang.value.betting_p, value: formatNumber(entireGameData.bettingP) },
            { label: trlang.value.revenue, value: formatNumber(entireGameData.revenue) },
          ],
        },
        {
          key: 'mini',
          title: trlang.value.minigames,
          items: [
            { label: trlang.value.batting_gan, value: formatNumber(minigamesData.battingGan) },
            { label: trlang.value.hit, value: formatNumber(minigamesData.hit) },
            { label: trlang.value.betting_p, value: formatNumber(minigamesData.bettingP) },
            { label: trlang.value.revenue, value: formatNumber(minigamesData.revenue) },
          ],
        },
      ];
    });

    watch(selectedPartnerId, () => {
      fetchSidebarSummary();
    });

    onMounted(() => {
      fetchPartnerList();
      fetchSidebarSummary();
    });

    return {
      trlang,
      selectedPartnerId,
      partnerTreeOptions,
      summaryBlocks,
      summaryData,
      formatNumber,
      loading,
    };
  },
};
</script>
