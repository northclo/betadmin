<template>
  <a-layout-header class="white-background d-flex">
    <a-layout-content style="gap: 20px; display: flex;">
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
      <a-dropdown style="margin-left: 8px;">
        <a class="ant-dropdown-link text-bold text-main" @click.prevent>
          Game
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">Bating gan: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Betting: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Hit: 0</a>
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
      <a-dropdown style="margin-left: 8px;">
        <a class="ant-dropdown-link text-bold text-main" @click.prevent>
          Mini Games
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">Bating gan: 0</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">Hit: 0</a>
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
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding-right: 0px;">
        <a-typography-text class="text-main text-bold">Deposit</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0{{ trlang.currency }}</a-typography-text>
      </a-layout-header>
      <a-layout-header class="white-background justify-center" style="flex-direction: column; padding: 0px;">
        <a-typography-text class="text-main text-bold">Withdrawal</a-typography-text>
        <a-typography-text class="text-dark-grey text-bold">0{{ trlang.currency }}</a-typography-text>
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
defineProps({
  collapsed: Boolean
});
</script>

<script>
import { UserOutlined } from '@ant-design/icons-vue';
import { routeLink } from '@/utils/route-link'

export default {
  name: 'HeaderPage',
  inject: ['langState'],
  computed: {
    trlang() {
      return this.langState.translations;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push(routeLink.login.link)
    }
  }
} 
</script>
