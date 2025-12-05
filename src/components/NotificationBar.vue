<template>
  <div class="notification-bar">
    <table class="notification-bar-table">
      <tbody>
        <tr>
          <td class="notification-bar-table-title">
            {{ trlang.charge }}
          </td>
          <td class="notification-bar-table-value" :class="{ 'has-new': chargeData.new > 0 }">
            <div class="new-notification cursor-pointer" @click="navigateTo('/charge-management')">
              <div class="star-icon-wrapper" v-if="chargeData.new > 0">
                <svg class="star-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <span>{{ trlang.new }} : {{ chargeData.new }}</span>
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/charge-management')">
              {{ trlang.waiting }}: {{ chargeData.waiting }}
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/charge-management')">
              {{ trlang.completed }}: {{ chargeData.completed }}
            </div>
          </td>
          <td class="notification-bar-table-title">
            {{ trlang.exchange }}
          </td>
          <td class="notification-bar-table-value" :class="{ 'has-new': exchangeData.new > 0 }">
            <div class="new-notification cursor-pointer" @click="navigateTo('/exchange-management')">
              <div class="star-icon-wrapper" v-if="exchangeData.new > 0">
                <svg class="star-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <span>{{ trlang.new }}: {{ exchangeData.new }}</span>
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/exchange-management')">
              {{ trlang.waiting }}: {{ exchangeData.waiting }}
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/exchange-management')">
              {{ trlang.completed }}: {{ exchangeData.completed }}
            </div>
          </td>
          <td class="notification-bar-table-title">
            {{ trlang.custom }}
          </td>
          <td class="notification-bar-table-value" :class="{ 'has-new': customData.new > 0 }">
            <div class="new-notification cursor-pointer" @click="navigateTo('/customer-center')">
              <div class="star-icon-wrapper" v-if="customData.new > 0">
                <svg class="star-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <span>{{ trlang.new }}: {{ customData.new }}</span>
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/customer-center')">
              {{ trlang.waiting }}: {{ customData.waiting }}
            </div>
          </td>
          <td class="notification-bar-table-value">
            <div class="cursor-pointer" @click="navigateTo('/customer-center')">
              {{ trlang.completed }}: {{ customData.completed }}
            </div>
          </td>
          <td>
            <a-button type="primary" @click="navigateTo('/notification', 1)">{{ trlang.view_all }}</a-button>
          </td>
          <td>
            <div>
              <a-checkbox
                v-model:checked="removeSound"
                class="remove-sound-checkbox"
              >
                {{ trlang.remove_sound }}
              </a-checkbox>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { getData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { socket } from "@/plugins/socket.js";

const router = useRouter();
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const navigateTo = (path) => {
  router.push(path);
};

const chargeData = ref({
  new: 0,
  waiting: 0,
  completed: 0
});

const exchangeData = ref({
  new: 0,
  waiting: 0,
  completed: 0
});

const customData = ref({
  new: 0,
  waiting: 0,
  completed: 0
});

const previousChargeNew = ref(-1);
const previousExchangeNew = ref(-1);
const previousCustomNew = ref(-1);

const alarmSettings = ref({
  withdrawalAlarm: { soundFile: "alarm1.mp3", volume: 100 },
  depositAlarm: { soundFile: "alarm2.mp3", volume: 100 },
  customerAlert: { soundFile: "alarm3.mp3", volume: 100 }
});

const fetchChargeNotification = async () => {
  try {
    const res = await getData(apiLink.get_notification_charge);
    if (res.status && res.data) {
      const newCount = res.data.new || 0;
      const previousCount = previousChargeNew.value;
      
      chargeData.value = {
        new: newCount,
        waiting: res.data.waiting || 0,
        completed: res.data.completed || 0
      };

      if (newCount > previousCount && previousCount >= 0) {
        playAlertSound("depositAlarm");
      }
      
      previousChargeNew.value = newCount;
    }
  } catch (error) {
    console.error("Error fetching charge notification:", error);
  }
};

const fetchExchangeNotification = async () => {
  try {
    const res = await getData(apiLink.get_notification_exchange);
    if (res.status && res.data) {
      const newCount = res.data.new || 0;
      const previousCount = previousExchangeNew.value;
      
      exchangeData.value = {
        new: newCount,
        waiting: res.data.waiting || 0,
        completed: res.data.completed || 0
      };

      if (newCount > previousCount && previousCount >= 0) {
        playAlertSound("withdrawalAlarm");
      }
      
      previousExchangeNew.value = newCount;
    }
  } catch (error) {
    console.error("Error fetching exchange notification:", error);
  }
};

const fetchCustomNotification = async () => {
  try {
    const res = await getData(apiLink.get_notification_custom);
    if (res.status && res.data) {
      const newCount = res.data.new || 0;
      const previousCount = previousCustomNew.value;
      
      customData.value = {
        new: newCount,
        waiting: res.data.waiting || 0,
        completed: res.data.completed || 0
      };

      if (newCount > previousCount && previousCount >= 0) {
        playAlertSound("customerAlert");
      }
      
      previousCustomNew.value = newCount;
    }
  } catch (error) {
    console.error("Error fetching custom notification:", error);
  }
};

const fetchAllNotifications = async () => {
  await Promise.all([
    fetchChargeNotification(),
    fetchExchangeNotification(),
    fetchCustomNotification()
  ]);
};

const removeSound = ref(false);

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

const playAlertSound = (alarmType) => {
  if (removeSound.value) {
    return;
  }

  const setting = alarmSettings.value[alarmType];
  if (!setting || !setting.soundFile) {
    return;
  }

  try {
    const audio = new Audio(`/audio/${setting.soundFile}`);
    audio.volume = (setting.volume || 100) / 100;
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  } catch (error) {
    console.error("Error creating audio:", error);
  }
};

const handleNewSupportMessage = (data) => {
  if (!data) {
    return;
  }

  const user_id = localStorage.getItem('user_id');
  if (!user_id) {
    return;
  }

  if (!data.parentPartnerIds || !Array.isArray(data.parentPartnerIds)) {
    return;
  }

  if (!data.parentPartnerIds.includes(user_id)) {
    return;
  }
  fetchCustomNotification();
  playAlertSound("customerAlert");
};

const handleNewChargeRequest = (data) => {
  if (!data) {
    return;
  }

  const user_id = localStorage.getItem('user_id');
  if (!user_id) {
    return;
  }

  if (!data.parentPartnerIds || !Array.isArray(data.parentPartnerIds)) {
    return;
  }

  if (!data.parentPartnerIds.includes(user_id)) {
    return;
  }
  fetchChargeNotification();
  playAlertSound("depositAlarm");
};

const handleNewExchangeRequest = (data) => {
  if (!data) {
    return;
  }

  const user_id = localStorage.getItem('user_id');
  if (!user_id) {
    return;
  }

  if (!data.parentPartnerIds || !Array.isArray(data.parentPartnerIds)) {
    return;
  }

  if (!data.parentPartnerIds.includes(user_id)) {
    return;
  }
  fetchExchangeNotification();
  playAlertSound("withdrawalAlarm");
};

onMounted(() => {
  fetchAlarmSettings();
  fetchAllNotifications();
  socket.on("new_support_message", handleNewSupportMessage);
  socket.on("new_charge_request", handleNewChargeRequest);
  socket.on("new_exchange_request", handleNewExchangeRequest);
});

onBeforeUnmount(() => {
  socket.off("new_support_message", handleNewSupportMessage);
  socket.off("new_charge_request", handleNewChargeRequest);
  socket.off("new_exchange_request", handleNewExchangeRequest);
});

</script>

<style scoped>
.notification-bar {
  background: #1c2336;
  padding: 12px 24px;
  width: 100%;
}

.notification-bar-table {
  border-collapse: collapse;
  margin: 0;
  width: 100%;
  table-layout: auto;
}

.notification-bar-table td {
  padding: 8px 12px;
  border-right: 1px solid #cbd5e1d9;
  border-bottom: 1px solid #cbd5e1d9;
  border-top: 1px solid #cbd5e1d9;
  color: #cbd5e1d9;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.notification-bar-table td:first-child {
  border-left: 1px solid #cbd5e1d9;
}

.notification-bar-table td.notification-bar-table-value:hover {
  background-color: rgba(203, 213, 225, 0.1);
}

.remove-sound-checkbox {
  color: #cbd5e1d9 !important;
}

.notification-bar-table-title {
  font-weight: 600;
  background-color: #cbd5e1d9;
  color: #1c2336 !important;
  white-space: nowrap;
}

.notification-bar-table-value.has-new {
  background-color: #e63946;
  color: #ffffff !important;
}

.new-notification {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.star-icon-wrapper {
  width: 16px;
  height: 16px;
  background-color: #90ee90;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.star-icon {
  width: 12px;
  height: 12px;
  display: block;
}
</style>
