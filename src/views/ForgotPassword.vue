<template>
  <a-row class="h-100vh">
    <!-- Left Panel -->
    <a-col :span="12" class="d-flex justify-center align-center">
      <a-space direction="vertical" size="middle" class="w-100 max-w-fit">
        <!-- Title -->
        <div>
          <a-typography-title level="2">{{ trlang.forgot_password }}</a-typography-title>
        </div>

        <!-- Email Input -->
        <div>
          <a-typography-text>{{ trlang.email }}</a-typography-text>
          <a-input v-model:value="email" :placeholder="trlang.input_email" />
        </div>

        <!-- Info Text -->
        <a-typography-text class="fs-5">{{
          trlang.you_will_get_verify_with_email
        }}</a-typography-text>

        <!-- Send Verification Button -->
        <a-button type="primary" class="w-100" @click="sendVerify" :loading="loading">
          {{ trlang.send_verify }}
        </a-button>

        <!-- Back to Login -->
        <div class="text-end mt-2">
          <router-link to="/auth/login">
            <a-button type="link">{{ trlang.back_to_login }}</a-button>
          </router-link>
        </div>
      </a-space>
    </a-col>

    <!-- Right Panel -->
    <a-col :span="12" class="login-image"></a-col>
  </a-row>
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
    };
  },
  computed: {
    trlang() {
      return this.langState.translations;
    },
  },
  methods: {
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
      const res = await postData(apiLink.forgot_password, { email: this.email });

      if (res.status) {
        message.success(this.trlang.sent_verification_link);
      }
    },
  },
};
</script>
