<template>
  <a-layout class="bg-white flex flex-row justify-between items-center px-5">
    <a-typography-text class="text-dark-gray fs-1">
      {{ trlang.game_settings }}
    </a-typography-text>
    <a-button class="bg-main text-white flex justify-center items-center" @click="handleSave">
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-layout class="p-2">
    <PowerballGame ref="powerballRef" :save-data="saveData" />
  </a-layout>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { routeLink } from '@/utils/route-link';
import PowerballGame from '@/components/partner/setting/PowerballGame.vue';
import { SaveOutlined } from '@ant-design/icons-vue';

export default {
  name: routeLink.admin_account.name,
  components: { PowerballGame, SaveOutlined },
  setup() {
    const langState = inject('langState');
    const trlang = computed(() => langState.translations);

    const powerballRef = ref(null);

    const handleSave = () => {
      powerballRef.value.saveData();
    };

    return { trlang, handleSave, powerballRef };
  },
};
</script>
