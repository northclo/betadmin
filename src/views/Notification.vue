<template>
  <a-layout>
    <div class="mb-4">
      <a-typography-title :level="3">
        {{ trlang.notification }}
      </a-typography-title>
    </div>

    <!-- Set Alarm Section -->
    <a-card class="alarm-settings-card mb-4">
      <div class="alarm-settings-header">
        <a-typography-title :level="4" class="alarm-settings-title">
          {{ trlang.set_alarm }}
        </a-typography-title>
      </div>
      <a-row :gutter="[24, 16]">
        <a-col :xs="24" :md="8" v-for="alarm in alarmItems" :key="alarm.key">
          <div>
            <div class="alarm-label">{{ trlang[alarm.label] || alarm.label }}</div>
            <div class="alarm-controls">
              <a-form-item class="mb-2">
                <a-select
                  v-model:value="alarmSettings[alarm.key].soundFile"
                  :placeholder="trlang.alarm_selection"
                  style="width: 100%"
                  :options="soundFileOptions"
                  show-search
                  :filter-option="filterSoundOption"
                />
              </a-form-item>
              <a-form-item class="mb-6">
                <div class="volume-control">
                  <span class="volume-label">{{ trlang.volume }}:</span>
                  <a-slider
                    v-model:value="alarmSettings[alarm.key].volume"
                    :min="0"
                    :max="100"
                    :marks="{ 0: '0%', 50: '50%', 100: '100%' }"
                    style="flex: 1; margin: 0 12px;"
                  />
                  <span class="volume-value">{{ alarmSettings[alarm.key].volume }}%</span>
                </div>
              </a-form-item>
              <div class="alarm-buttons">
                <a-button @click="previewSound(alarm.key)" class="mr-2">
                  {{ trlang.preview }}
                </a-button>
                <a-button type="primary" class="bg-main text-white" @click="applyAlarm(alarm.key)" :loading="applying[alarm.key]">
                  {{ trlang.apply }}
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- Notification Counters -->
    <a-row :gutter="[16, 16]" class="notification-counters" justify="center">
      <a-col :xs="12" :sm="4" v-for="counter in notificationCounters" :key="counter.key">
        <div class="counter-circle" :class="counter.colorClass">
          <div class="counter-label">{{ trlang[counter.label] }}</div>
          <div class="counter-value" :class="counter.colorClass">
            {{ (notificationData[counter.key] || 0).toLocaleString() }}
          </div>
        </div>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue";
import { message } from "ant-design-vue";
import { getData, postData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";

defineOptions({ name: "NotificationPage" });

const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const alarmItems = [
  { key: "depositAlarm", label: "deposit_alarm" },
  { key: "withdrawalAlarm", label: "exchange_alarm" },
  { key: "customerAlert", label: "customer_alert" },
];

const soundFileOptions = ref([
  { value: "alarm1.mp3", label: "alarm1.mp3" },
  { value: "alarm2.mp3", label: "alarm2.mp3" },
  { value: "alarm3.mp3", label: "alarm3.mp3" },
  { value: "alarm4.mp3", label: "alarm4.mp3" },
]);

const alarmSettings = ref({
  withdrawalAlarm: { soundFile: "alarm1.mp3", volume: 100 },
  depositAlarm: { soundFile: "alarm2.mp3", volume: 100 },
  customerAlert: { soundFile: "alarm3.mp3", volume: 100 },
});

const applying = ref({});
const notificationData = ref({
  deposit: 0,
  withdrawal: 0,
  customer: 0,
});

const notificationCounters = [
  { key: "deposit", label: "deposit", colorClass: "counter-red" },
  { key: "withdrawal", label: "withdrawal", colorClass: "counter-blue" },
  { key: "customer", label: "customer", colorClass: "counter-green" },
];

const currentAudio = ref(null);

const filterSoundOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const previewSound = (alarmKey) => {
  const setting = alarmSettings.value[alarmKey];
  if (!setting.soundFile) {
    message.error(trlang.value.select_sound_file || "Please select a sound file");
    return;
  }

  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
    currentAudio.value = null;
  }

  try {
    const audio = new Audio(`/audio/${setting.soundFile}`);
    audio.volume = setting.volume / 100;
    
    currentAudio.value = audio;
    
    audio.addEventListener('ended', () => {
      currentAudio.value = null;
    });
    
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
      message.error(trlang.value.failed_to_play_sound || "Failed to play sound");
      currentAudio.value = null;
    });
  } catch (error) {
    console.error("Error creating audio:", error);
    message.error(trlang.value.failed_to_play_sound || "Failed to play sound");
    currentAudio.value = null;
  }
};

const applyAlarm = async (alarmKey) => {
  applying.value[alarmKey] = true;
  try {
    const setting = alarmSettings.value[alarmKey];
    const res = await postData(apiLink.update_alarm_setting, {
      alarmType: alarmKey,
      soundFile: setting.soundFile,
      volume: setting.volume,
    });
    
    if (res.status) {
      message.success(trlang.value.alarm_setting_saved);
    }
  } catch (error) {
    console.error("Error applying alarm setting:", error);
    message.error(error.message || trlang.value.operation_failed || "Operation failed");
  } finally {
    applying.value[alarmKey] = false;
  }
};

const fetchNotificationData = async () => {
  try {
    const [chargeRes, exchangeRes, customRes] = await Promise.all([
      getData(apiLink.get_notification_charge),
      getData(apiLink.get_notification_exchange),
      getData(apiLink.get_notification_custom),
    ]);

    if (chargeRes.status && chargeRes.data) {
      notificationData.value.deposit = chargeRes.data.new || 0;
    }
    if (exchangeRes.status && exchangeRes.data) {
      notificationData.value.withdrawal = exchangeRes.data.new || 0;
    }
    if (customRes.status && customRes.data) {
      notificationData.value.customer = customRes.data.new || 0;
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
  }
};

const fetchAlarmSettings = async () => {
  try {
    const res = await getData(apiLink.get_alarm_settings);
    if (res.status && res.data) {
      alarmSettings.value = res.data;
    }
  } catch (error) {
    console.error("Error fetching alarm settings:", error);
  }
};

onMounted(() => {
  fetchNotificationData();
  fetchAlarmSettings();
});

onBeforeUnmount(() => {
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
    currentAudio.value = null;
  }
});
</script>

<style scoped>
.alarm-settings-card {
  border-radius: 8px !important;
}

.alarm-settings-header {
  margin-bottom: 12px;
}

.alarm-settings-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.alarm-label {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
  font-size: 14px;
}

.alarm-controls {
  width: 100%;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-label {
  min-width: 60px;
  font-size: 14px;
  color: #4b5563;
}

.volume-value {
  min-width: 45px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.alarm-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.notification-counters {
  margin-top: 32px;
}

.counter-circle {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid;
  background: white;
  padding: 20px;
}

.counter-yellow {
  border-color: #fbbf24;
}

.counter-red {
  border-color: #ef4444;
}

.counter-blue {
  border-color: #3b82f6;
}

.counter-green {
  border-color: #10b981;
}

.counter-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: capitalize;
  color: #1f2937;
}

.counter-value {
  font-size: 56px;
  font-weight: bold;
  line-height: 1;
}

.counter-yellow .counter-value {
  color: #fbbf24;
}

.counter-red .counter-value {
  color: #ef4444;
}

.counter-blue .counter-value {
  color: #3b82f6;
}

.counter-green .counter-value {
  color: #10b981;
}
</style>

