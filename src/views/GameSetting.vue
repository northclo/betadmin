<template>
  <a-layout class="flex flex-row justify-between items-center mb-4">
    <a-typography-title :level="3">
      {{ trlang.game_settings }}
    </a-typography-title>
    <a-button 
      class="text-white flex justify-center items-center" 
      @click="handleSave"
      :loading="saving"
      :disabled="loading"
    >
      <SaveOutlined />
      {{ trlang.save }}
    </a-button>
  </a-layout>

  <a-spin :spinning="loading">
    <PowerballGame ref="powerballRef" @update:loading="loading = $event" @update:saving="saving = $event" />
  </a-spin>
</template>

<script>
import { computed, inject, ref } from 'vue';
import { routeLink } from '@/utils/route-link';
import PowerballGame from '@/components/partner/setting/PowerballGame.vue';
import { SaveOutlined } from '@ant-design/icons-vue';

export default {
  name: routeLink.game_setting.name,
  components: { PowerballGame, SaveOutlined },
  setup() {
    const langState = inject('langState');
    const trlang = computed(() => langState.translations);

    const powerballRef = ref(null);
    const loading = ref(false);
    const saving = ref(false);

    const handleSave = () => {
      if (powerballRef.value && typeof powerballRef.value.saveData === 'function') {
        powerballRef.value.saveData();
      }
    };

    return { trlang, handleSave, powerballRef, loading, saving };
  },
};
</script>
