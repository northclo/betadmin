<template>
  <a-layout class="bg-white pt-5 pb-5">
    <a-layout class="bg-white d-flex flex-row justify-between items-center px-5">
      <a-typography-text class="text-dark-grey fs-1">
        {{ trlang.game_settings }}
      </a-typography-text>
      <a-button class="bg-main text-white">{{ trlang.save }}</a-button>
    </a-layout>

    <a-layout class="bg-white px-5">
      <PowerballGame />
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject } from "vue";
import { routeLink } from "@/utils/route-link";
import PowerballGame from "@/components/game-setting/PowerballGame.vue";

export default {
  name: routeLink.admin_account.name,
  components: { PowerballGame },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    return { trlang };
  },
};
</script>
