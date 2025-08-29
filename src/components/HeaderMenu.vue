<template>
  <a-layout-header class="white-background d-flex">

    <!-- Mobile Header -->
    <a-layout-content class="d-flex gap-5" v-if="isMobile">
      <a-dropdown>
        <a class="ant-dropdown-link text-bold text-main" @click.prevent>
          {{ trlang.betting_settlement_profit_new }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">User-held money: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">User Points: 0</a>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <a href="javascript:;">Currnet Site Users: 0</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown>
        <a class="ant-dropdown-link text-bold text-main" @click.prevent>
          Game
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">Bating gan: {{ game.batingGan }}</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Betting: {{ game.betting }}</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Hit: {{ game.hit }}</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Betting P: {{ game.bettingP }}</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">revenue: {{ game.revenue }}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown>
        <a class="ant-dropdown-link text-bold text-main" @click.prevent>
          Mini Games
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">Bating gan: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Hit: {{ miniGames.hit }}</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Betting P: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">revenue: 0</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-layout-content>

    <!-- Desktop Header -->
    <a-layout-content class="d-flex gap-5" v-else>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">User-help money</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">User points</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Currnet Site Users</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Deposit</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0{{ trlang.currency }}</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Withdrawal</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0{{ trlang.currency }}</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center"
        style="flex-direction: column; padding: 0px; padding-left: 20px;">
        <a-typography-text class="text-main text-bold">Game</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Bating gan</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Betting</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Hit</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Betting P</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Revenue</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center"
        style="flex-direction: column; padding: 0px; padding-left: 20px;">
        <a-typography-text class="text-main text-bold">Mini Games</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Bating gan</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Hit</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Betting P</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Revenue</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0</a-typography-text>
      </a-layout-header>
    </a-layout-content>

    <a-dropdown>
      <a class="ant-dropdown-link text-bold text-main" @click.prevent>
        <a-avatar>
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:;" class="text-red" @click="logout">{{ trlang.logout }}</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, computed } from "vue";
import { UserOutlined } from "@ant-design/icons-vue";
import { routeLink } from "@/utils/route-link";
import router from "@/Router";

const isMobile = ref(window.innerWidth < 1800);
const game = ref({
  batingGan: 10,
  betting: 200,
  hit: 60,
  bettingP: 15,
  revenue: 62
})
const miniGames = ref({
  batingGan: 0,
  hit: 0,
  bettingP: 0,
  revenue: 0
})

const handleResize = () => {
  isMobile.value = window.innerWidth < 1800;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

defineProps({ collapsed: Boolean });

const langState = inject("langState");
const trlang = computed(() => langState.translations);

const logout = () => {
  localStorage.removeItem("token");
  router.push(routeLink.login.link);
};
</script>
