<template>
  <div class="forgot-password-page-container">
    <a-row class="forgot-password-row h-100vh" :gutter="0">
      <a-col 
        :xs="24" 
        :sm="24" 
        :md="12" 
        :lg="12" 
        :xl="12" 
        class="forgot-password-form-col flex justify-center items-center"
      >
        <a-card class="forgot-password-card w-100">
          <a-space direction="vertical" size="middle" class="w-100">
            <div class="text-center forgot-password-header">
              <a-typography-title :level="titleLevel" class="forgot-password-title">
                {{ trlang.forgot_password }}
              </a-typography-title>
            </div>

            <div class="forgot-password-field">
              <a-typography-text class="forgot-password-label">{{ trlang.email }}</a-typography-text>
              <a-input 
                v-model:value="email" 
                :placeholder="trlang.input_email" 
                class="mt-2 forgot-password-input"
                size="large"
              />
            </div>

            <a-typography-text class="forgot-password-hint">
              {{ trlang.you_will_get_verify_with_email }}
            </a-typography-text>

            <a-button 
              type="primary" 
              class="w-100 forgot-password-button" 
              @click="sendVerify" 
              :loading="loading"
              size="large"
            >
              {{ trlang.send_verify }}
            </a-button>

            <div class="text-center mt-2">
              <router-link to="/auth/login">
                <a-button type="link" class="back-to-login-link">{{ trlang.back_to_login }}</a-button>
              </router-link>
            </div>
          </a-space>
        </a-card>
      </a-col>

      <a-col 
        :xs="0" 
        :sm="0" 
        :md="12" 
        :lg="12" 
        :xl="12" 
        class="forgot-password-image-col login-image"
        :style="{ backgroundImage: 'url(/images/auth.png)' }"
      />
    </a-row>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

import { checkValidEmail } from "@/helpers/Common.js";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";

export default {
  name: routeLink.forgot_password.name,
  inject: ["langState"],
  data() {
    return {
      email: "",
      loading: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    trlang() {
      return this.langState.translations;
    },
    titleLevel() {
      if (this.windowWidth <= 480) return 3;
      if (this.windowWidth <= 768) return 3;
      return 2;
    },
  },
  mounted() {
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    updateWindowWidth() {
      // Throttle resize events for better performance
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.windowWidth = window.innerWidth;
      }, 150);
    },
    async sendVerify() {
      if (!this.email) {
        message.error(this.trlang.fill_email);
        return;
      }

      // check email style
      if (!checkValidEmail(this.email)) {
        message.error(this.trlang.not_correct_email);
        return;
      }

      this.loading = true;
      try {
        const res = await postData(apiLink.forgot_password, { email: this.email });

        if (res.status) {
          message.success(this.trlang.sent_verification_link);
        }
      } catch (error) {
        console.error("Error sending verification:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Forgot Password Page Container */
.forgot-password-page-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.forgot-password-row {
  margin: 0 !important;
  min-height: 100vh;
}

/* Form Column */
.forgot-password-form-col {
  padding: 20px;
  background: var(--page-bg-color);
  transition: padding 0.3s ease;
}

.forgot-password-card {
  max-width: 480px;
  width: 100%;
  background: var(--glass-bg) !important;
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid var(--glass-border-light) !important;
  box-shadow: var(--glass-shadow-strong) !important;
  border-radius: 24px !important;
  transition: all 0.3s ease;
}

.forgot-password-card :deep(.ant-card-body) {
  padding: 32px;
}

.forgot-password-card :deep(.ant-card-head) {
  display: none;
}

.forgot-password-header {
  margin-bottom: 8px;
}

.forgot-password-title {
  color: var(--text-primary-color) !important;
  margin-bottom: 8px !important;
  font-weight: 700;
  transition: font-size 0.3s ease;
}

.forgot-password-field {
  width: 100%;
}

.forgot-password-label {
  color: var(--text-primary-color) !important;
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
}

.forgot-password-input {
  width: 100%;
  border-radius: 8px;
}

.forgot-password-input :deep(.ant-input) {
  border-radius: 8px;
  height: 44px;
}

.forgot-password-hint {
  color: var(--text-secondary-color) !important;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
}

.forgot-password-button {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
}

.back-to-login-link {
  padding: 0;
  height: auto;
  font-size: 14px;
}

/* Image Column */
.forgot-password-image-col {
  min-height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  transition: opacity 0.3s ease;
}

/* Responsive Design */

/* Large Desktop (1200px and above) */
@media (min-width: 1200px) {
  .forgot-password-card {
    max-width: 520px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 40px;
  }

  .forgot-password-title {
    font-size: 32px;
  }
}

/* Desktop (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .forgot-password-card {
    max-width: 480px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 36px;
  }

  .forgot-password-title {
    font-size: 28px;
  }
}

/* Tablet / iPad Portrait (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .forgot-password-form-col {
    padding: 24px;
  }

  .forgot-password-card {
    max-width: 460px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 32px;
  }

  .forgot-password-title {
    font-size: 26px;
  }

  .forgot-password-hint {
    font-size: 13px;
  }
}

/* Mobile Landscape / Small Tablet (576px - 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .forgot-password-form-col {
    padding: 20px;
  }

  .forgot-password-card {
    max-width: 100%;
    border-radius: 20px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 28px;
  }

  .forgot-password-title {
    font-size: 24px;
  }

  .forgot-password-hint {
    font-size: 13px;
  }

  .forgot-password-button {
    height: 46px;
    font-size: 15px;
  }
}

/* Mobile Portrait (up to 575px) */
@media (max-width: 575px) {
  .forgot-password-form-col {
    padding: 16px;
  }

  .forgot-password-card {
    max-width: 100%;
    border-radius: 16px;
    box-shadow: var(--glass-shadow) !important;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 24px 20px;
  }

  .forgot-password-header {
    margin-bottom: 16px;
  }

  .forgot-password-title {
    font-size: 22px;
    margin-bottom: 6px !important;
  }

  .forgot-password-label {
    font-size: 13px;
  }

  .forgot-password-input :deep(.ant-input) {
    height: 42px;
    font-size: 14px;
  }

  .forgot-password-hint {
    font-size: 12px;
  }

  .forgot-password-button {
    height: 44px;
    font-size: 15px;
    border-radius: 8px;
  }

  .back-to-login-link {
    font-size: 13px;
  }
}

/* Extra Small Mobile (up to 375px) */
@media (max-width: 375px) {
  .forgot-password-form-col {
    padding: 12px;
  }

  .forgot-password-card {
    border-radius: 14px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .forgot-password-title {
    font-size: 20px;
  }

  .forgot-password-hint {
    font-size: 11px;
  }

  .forgot-password-button {
    height: 42px;
    font-size: 14px;
  }
}

/* Landscape Orientation Adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .forgot-password-page-container {
    min-height: auto;
    height: auto;
  }

  .forgot-password-row {
    min-height: auto;
    height: auto;
    padding: 16px 0;
  }

  .forgot-password-form-col {
    padding: 16px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 20px;
  }

  .forgot-password-header {
    margin-bottom: 12px;
  }

  .forgot-password-title {
    font-size: 20px;
    margin-bottom: 4px !important;
  }

  .forgot-password-hint {
    font-size: 11px;
  }
}

/* Very Small Screens (up to 320px) */
@media (max-width: 320px) {
  .forgot-password-form-col {
    padding: 10px;
  }

  .forgot-password-card :deep(.ant-card-body) {
    padding: 18px 14px;
  }

  .forgot-password-title {
    font-size: 18px;
  }
}

/* Print Styles */
@media print {
  .forgot-password-image-col {
    display: none;
  }

  .forgot-password-form-col {
    width: 100%;
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .forgot-password-card {
    transition: none;
  }
}
</style>
