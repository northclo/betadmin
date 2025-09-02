<template>
  <a-layout class="bg-white pt-5 pb-5">
    <a-layout
      class="bg-white d-flex flex-row justify-between items-center px-5 sticky-header"
    >
      <a-typography-text class="text-dark-grey fs-1">
        {{ trlang.game_settings }}
      </a-typography-text>
      <a-button
        class="bg-main text-white d-flex justify-center items-center"
        @click="handleSave"
      >
        <SaveOutlined />
        {{ trlang.save }}
      </a-button>
    </a-layout>

    <a-layout class="bg-white px-5">
      <PowerballGame ref="powerballRef" />
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, ref } from "vue";
import { routeLink } from "@/utils/route-link";
import PowerballGame from "@/components/game-setting/PowerballGame.vue";
import { SaveOutlined } from "@ant-design/icons-vue";

export default {
  name: routeLink.admin_account.name,
  components: { PowerballGame, SaveOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const powerballRef = ref(null);

    const handleSave = () => {
      powerballRef.value.saveData();
    };

    return { trlang, handleSave, powerballRef };
  },
};
</script>
