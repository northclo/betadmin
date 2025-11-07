<template>
  <a-layout-sider :trigger="null" collapsible class="left-rail">
    <div class="left-rail__wrap">
      <header class="left-rail__hero">
        <span class="left-rail__eyebrow">{{ trlang.betting_settlement_profit_new }}</span>
        <div class="left-rail__hero-value">
          <span class="num">479,450</span>
          <span class="unit">USD</span>
        </div>
        <p class="left-rail__meta">
          {{ trlang.user_points }} <strong>14,000</strong> P
        </p>
      </header>

      <section class="left-rail__section">
        <div class="left-rail__label">{{ trlang.current_site_users }}</div>
        <div class="left-rail__metric">
          <span>14,000</span>
          <small>{{ trlang.users }}</small>
        </div>
        <a-select
          class="left-rail__select"
          v-model:value="activeOption"
          size="small"
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
            <strong>0</strong>
          </div>
          <div class="pill">
            <span>{{ trlang.withdrawal }}</span>
            <strong>0</strong>
          </div>
        </div>
      </section>

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

      <section class="left-rail__section left-rail__section--list">
        <header>{{ trlang.total }}</header>
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

export default {
  name: "LeftLayout",
  setup() {
    // Inject the provided state
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const options = ref([]);
    const activeOption = ref('entire');

    const summaryBlocks = computed(() => [
      {
        key: 'entire',
        title: trlang.value.the_entire_game,
        items: [
          { label: trlang.value.batting_gan, value: '0' },
          { label: trlang.value.betting, value: '0' },
          { label: trlang.value.hit, value: '0' },
          { label: trlang.value.betting_p, value: '0' },
          { label: trlang.value.revenue, value: '0' },
        ],
      },
      {
        key: 'mini',
        title: trlang.value.minigames,
        items: [
          { label: trlang.value.batting_gan, value: '0' },
          { label: trlang.value.hit, value: '0' },
          { label: trlang.value.betting_p, value: '0' },
          { label: trlang.value.revenue, value: '0' },
        ],
      },
    ]);

    const totalStats = computed(() => [
      { label: trlang.value.total, value: '479,450' },
      { label: trlang.value.test_copy, value: '479,450' },
    ]);

    onMounted(() => {
      options.value = [
        { value: 'entire', label: trlang.value.entire },
        { value: 'minigames', label: trlang.value.minigames },
      ];
    });

    return {
      trlang,
      options,
      activeOption,
      summaryBlocks,
      totalStats,
    };
  },
};
</script>
