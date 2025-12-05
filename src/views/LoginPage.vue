<template>
  <div class="login-page-container">
    <a-row class="login-row h-100vh" :gutter="0">
      <a-col 
        :xs="24" 
        :sm="24" 
        :md="24" 
        :lg="24" 
        :xl="24" 
        class="login-form-col flex justify-center items-center"
      >
        <a-card class="login-card w-100">
          <a-space direction="vertical" size="middle" class="w-100">
            <div class="text-center login-header">
              <a-typography-title :level="titleLevel" class="login-title">
                {{ trlang.welcome_back }}
              </a-typography-title>
              <a-typography-text class="login-subtitle">{{ trlang.enter_detail }}</a-typography-text>
            </div>

            <div class="login-field">
              <a-typography-text class="login-label">{{ trlang.id }}</a-typography-text>
              <a-input 
                v-model:value="userId" 
                :placeholder="trlang.input_id" 
                class="mt-2 login-input" 
                size="large"
              />
            </div>

            <div class="login-field">
              <a-typography-text class="login-label">{{ trlang.password }}</a-typography-text>
              <a-input-password
                v-model:value="password"
                :placeholder="trlang.input_password"
                class="mt-2 login-input"
                size="large"
              />
            </div>

            <div v-if="captchaShow" class="login-field">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="captcha" @click="loadCaptcha" class="captcha-container mb-2" />
              <a-input
                v-model:value="captchaInput"
                :placeholder="trlang.enter_captcha"
                class="login-input"
                size="large"
                required
              />
            </div>

            <div v-if="retry" class="retry-message flex flex-column">
              <a-typography-text class="text-danger">
                {{ trlang.your_login_attempt_has_failed_3_times_or_more }}
              </a-typography-text>
              <a-typography-text class="text-danger">
                {{ trlang.please_try_again_later }}:
                {{
                  Math.floor(retryRemainedTime / 60)
                    ? Math.floor(retryRemainedTime / 60) + trlang.min
                    : ''
                }}
                {{
                  retryRemainedTime % 60
                    ? (retryRemainedTime % 60) + trlang.sec
                    : ''
                }}
              </a-typography-text>
            </div>

            <div class="w-100">
              <a-checkbox v-model:checked="remember" class="remember-checkbox">
                {{ trlang.remember_me }}
              </a-checkbox>
            </div>

            <a-button 
              class="w-100 login-button bg-primary text-white" 
              @click="login" 
              size="large"
              type="primary"
            >
              {{ trlang.login }}
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getData, postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';

/* Responsive state */
const windowWidth = ref(window.innerWidth);
const titleLevel = computed(() => {
  if (windowWidth.value <= 480) return 3;
  if (windowWidth.value <= 768) return 3;
  return 2;
});

let resizeTimer = null;
const updateWindowWidth = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(() => {
    windowWidth.value = window.innerWidth;
  }, 150);
};

const router = useRouter();
const store = useStore();
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const userId = ref('');
const password = ref('');
const remember = ref(false);
const captchaShow = ref(false);
const captcha = ref('');
const captchaText = ref('');
const captchaInput = ref('');
const retry = ref(false);
const retryRemainedTime = ref(0);

let retryTimer = null;

/* Helpers */
const getCaptcha = async () => {
  const response = await getData(apiLink.get_captcha);
  if (response && response.status && response.data) {
    captchaText.value = response.data.text;
    captcha.value = response.data.data;
    captchaShow.value = true;
  } else {
    captchaShow.value = false;
  }
};

const loadCaptcha = () => {
  getCaptcha();
};

const handleLoginFailed = () => {
  const failed = Number(localStorage.getItem('login_failed')) || 0;
  localStorage.setItem('login_failed', failed + 1);
  localStorage.setItem('last_login_failed_time', Date.now());

  if (failed >= 2 && !retry.value) {
    retry.value = true;
    retryRemainedTime.value = 120;
  }

  getCaptcha();
};

const initRetryState = () => {
  const lastFailed =
    Number(localStorage.getItem('last_login_failed_time')) || 0;
  const loginFailed = Number(localStorage.getItem('login_failed')) || 0;
  const diff = (Date.now() - lastFailed) / 1000;

  if (diff < 120 && loginFailed > 2) {
    retry.value = true;
    retryRemainedTime.value = Math.floor(120 - diff);
  }

  retryTimer = setInterval(() => {
    if (retry.value && retryRemainedTime.value > 0) {
      retryRemainedTime.value -= 1;
    } else {
      retry.value = false;
    }
  }, 1000);
};

const saveCredentials = () => {
  if (remember.value) {
    localStorage.setItem('userId', userId.value);
    localStorage.setItem('password', password.value);
  } else {
    localStorage.removeItem('userId');
    localStorage.removeItem('password');
  }
};

/* Load saved data on mount */
onMounted(() => {
  const savedUserId = localStorage.getItem('userId');
  const savedPassword = localStorage.getItem('password');

  if (savedUserId && savedPassword) {
    userId.value = savedUserId;
    password.value = savedPassword;
    remember.value = true;
  }

  initRetryState();
  getCaptcha();
  updateWindowWidth();
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  if (retryTimer) clearInterval(retryTimer);
  if (resizeTimer) clearTimeout(resizeTimer);
  window.removeEventListener('resize', updateWindowWidth);
});

/* Login method */
const login = async () => {
  if (retry.value) return;

  if (!userId.value || !password.value) {
    return message.error(trlang.value.fill_id_password);
  }
  if (captchaShow.value && captchaText.value !== captchaInput.value) {
    handleLoginFailed();
    return message.error(trlang.value.captcha_is_wrong);
  }

  const res = await postData(apiLink.login, {
    id: userId.value,
    password: password.value,
  });

  if (res && res.status) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user_id', res.data.id);
    
    if (res.data.permissions) {
      store.commit('setPermissions', res.data.permissions);
    }
    
    if (res.data.role) {
      store.commit('setPartnerRole', res.data.role);
    }
    
    saveCredentials();
    localStorage.removeItem('login_failed');
    router.push(routeLink.dashboard.link);
  } else {
    handleLoginFailed();
  }
};
</script>

<style scoped>
/* Login Page Container */
.login-page-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.login-row {
  margin: 0 !important;
  min-height: 100vh;
  padding: 16px 0;
}

/* Login Form Column */
.login-form-col {
  padding: 16px;
  background: var(--page-bg-color);
}

.login-card {
  max-width: 480px;
  width: 100%;
  background: var(--glass-bg) !important;
  border: 1px solid var(--glass-border-light) !important;
  border-radius: 12px !important;
}

.login-card :deep(.ant-card-body) {
  padding: 32px;
}

.login-header {
  margin-bottom: 12px;
}

.login-title {
  color: var(--text-primary-color) !important;
  margin-bottom: 8px !important;
  font-weight: 700;
  font-size: 28px;
}

.login-subtitle {
  color: var(--text-secondary-color) !important;
  font-size: 14px;
}

.login-field {
  width: 100%;
}

.login-label {
  color: var(--text-primary-color) !important;
  font-weight: 500;
  font-size: 14px;
  padding-left: 4px;
  margin-bottom: 4px;
}

.login-input {
  width: 100%;
  border-radius: 8px;
}

.login-input :deep(.ant-input),
.login-input :deep(.ant-input-password) {
  border-radius: 8px;
}

.captcha-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.retry-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.remember-checkbox {
  color: var(--text-secondary-color) !important;
  font-size: 14px;
}

.remember-checkbox :deep(.ant-checkbox-wrapper) {
  color: var(--text-secondary-color) !important;
}

.login-button {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
}


</style>
