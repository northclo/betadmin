<template>
  <div class="reset-password-page-container">
    <a-row class="reset-password-row h-100vh" :gutter="0">
      <a-col 
        :xs="24" 
        :sm="24" 
        :md="12" 
        :lg="12" 
        :xl="12" 
        class="reset-password-form-col flex justify-center items-center"
      >
        <a-card class="reset-password-card w-100">
          <a-space direction="vertical" size="middle" class="w-100">
            <div class="text-center reset-password-header">
              <a-typography-title :level="titleLevel" class="reset-password-title">
                {{ trlang.reset_password }}
              </a-typography-title>
            </div>

            <div class="reset-password-field">
              <a-typography-text class="reset-password-label">{{ trlang.password }}</a-typography-text>
              <a-input-password 
                v-model:value="password" 
                :placeholder="trlang.input_password" 
                class="mt-2 reset-password-input"
                size="large"
              />
            </div>

            <div class="reset-password-field">
              <a-typography-text class="reset-password-label">{{ trlang.confirm_password }}</a-typography-text>
              <a-input-password 
                v-model:value="confirm_password" 
                :placeholder="trlang.input_password" 
                class="mt-2 reset-password-input"
                size="large"
              />
            </div>

            <a-button 
              type="primary" 
              class="w-100 reset-password-button" 
              :loading="loading" 
              @click="resetPassword"
              size="large"
            >
              {{ trlang.reset_password }}
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
        class="reset-password-image-col login-image"
        :style="{ backgroundImage: 'url(/images/auth.png)' }"
      />
    </a-row>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";

export default {
  name: routeLink.reset_password.name,
  inject: ["langState"],
  data() {
    return {
      password: "",
      confirm_password: "",
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
    async resetPassword() {
      // check if input password and confirm password
      if (!this.password || !this.confirm_password) {
        message.error(this.trlang.fill_password);
        return;
      }

      // check if password and confirm password are same
      if (this.password !== this.confirm_password) {
        message.error(this.trlang.wrong_password);
        return;
      }

      // get token from query
      const token = this.$route.query.token;

      if (!token) {
        message.error("Invalid reset token");
        return;
      }

      this.loading = true;
      try {
        const res = await postData(`${apiLink.reset_password}/${token}`, {
          password: this.password,
        });

        if (res.status) {
          // when password reset successful, if password is saved in localstorage, change the saved password
          if (localStorage.getItem("password")) {
            localStorage.setItem("password", this.password);
          }

          message.success(this.trlang.password_reset_successful);

          // Redirect after password reset
          this.$router.push(routeLink.login.link);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Reset Password Page Container */
.reset-password-page-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.reset-password-row {
  margin: 0 !important;
  min-height: 100vh;
}

/* Form Column */
.reset-password-form-col {
  padding: 20px;
  background: var(--page-bg-color);
  transition: padding 0.3s ease;
}

.reset-password-card {
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

.reset-password-card :deep(.ant-card-body) {
  padding: 32px;
}

.reset-password-card :deep(.ant-card-head) {
  display: none;
}

.reset-password-header {
  margin-bottom: 8px;
}

.reset-password-title {
  color: var(--text-primary-color) !important;
  margin-bottom: 8px !important;
  font-weight: 700;
  transition: font-size 0.3s ease;
}

.reset-password-field {
  width: 100%;
}

.reset-password-label {
  color: var(--text-primary-color) !important;
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
}

.reset-password-input {
  width: 100%;
  border-radius: 8px;
}

.reset-password-input :deep(.ant-input-password) {
  border-radius: 8px;
  height: 44px;
}

.reset-password-input :deep(.ant-input) {
  border-radius: 8px;
  height: 44px;
}

.reset-password-button {
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
.reset-password-image-col {
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
  .reset-password-card {
    max-width: 520px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 40px;
  }

  .reset-password-title {
    font-size: 32px;
  }
}

/* Desktop (992px - 1199px) */
@media (min-width: 992px) and (max-width: 1199px) {
  .reset-password-card {
    max-width: 480px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 36px;
  }

  .reset-password-title {
    font-size: 28px;
  }
}

/* Tablet / iPad Portrait (768px - 991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .reset-password-form-col {
    padding: 24px;
  }

  .reset-password-card {
    max-width: 460px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 32px;
  }

  .reset-password-title {
    font-size: 26px;
  }
}

/* Mobile Landscape / Small Tablet (576px - 767px) */
@media (min-width: 576px) and (max-width: 767px) {
  .reset-password-form-col {
    padding: 20px;
  }

  .reset-password-card {
    max-width: 100%;
    border-radius: 20px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 28px;
  }

  .reset-password-title {
    font-size: 24px;
  }

  .reset-password-button {
    height: 46px;
    font-size: 15px;
  }
}

/* Mobile Portrait (up to 575px) */
@media (max-width: 575px) {
  .reset-password-form-col {
    padding: 16px;
  }

  .reset-password-card {
    max-width: 100%;
    border-radius: 16px;
    box-shadow: var(--glass-shadow) !important;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 24px 20px;
  }

  .reset-password-header {
    margin-bottom: 16px;
  }

  .reset-password-title {
    font-size: 22px;
    margin-bottom: 6px !important;
  }

  .reset-password-label {
    font-size: 13px;
  }

  .reset-password-input :deep(.ant-input-password),
  .reset-password-input :deep(.ant-input) {
    height: 42px;
    font-size: 14px;
  }

  .reset-password-button {
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
  .reset-password-form-col {
    padding: 12px;
  }

  .reset-password-card {
    border-radius: 14px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 20px 16px;
  }

  .reset-password-title {
    font-size: 20px;
  }

  .reset-password-button {
    height: 42px;
    font-size: 14px;
  }
}

/* Landscape Orientation Adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .reset-password-page-container {
    min-height: auto;
    height: auto;
  }

  .reset-password-row {
    min-height: auto;
    height: auto;
    padding: 16px 0;
  }

  .reset-password-form-col {
    padding: 16px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 20px;
  }

  .reset-password-header {
    margin-bottom: 12px;
  }

  .reset-password-title {
    font-size: 20px;
    margin-bottom: 4px !important;
  }
}

/* Very Small Screens (up to 320px) */
@media (max-width: 320px) {
  .reset-password-form-col {
    padding: 10px;
  }

  .reset-password-card :deep(.ant-card-body) {
    padding: 18px 14px;
  }

  .reset-password-title {
    font-size: 18px;
  }
}

/* Print Styles */
@media print {
  .reset-password-image-col {
    display: none;
  }

  .reset-password-form-col {
    width: 100%;
  }
}

/* Accessibility - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .reset-password-card {
    transition: none;
  }
}
</style>
