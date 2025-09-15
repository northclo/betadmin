<template>
  <a-row class="h-100vh">
    <a-col :span="12" class="flex justify-center items-center items-center">
      <a-space direction="vertical" size="middle" class="w-100 max-w-fit">
        <a-typography-title level="2">{{ trlang.forgot_password }}</a-typography-title>

        <div>
          <a-typography-text>{{ trlang.email }}</a-typography-text>
          <a-input v-model:value="email" :placeholder="trlang.input_email" />
        </div>

        <a-typography-text class="fs-5">
          {{ trlang.you_will_get_verify_with_email }}
        </a-typography-text>

        <a-button type="primary" class="w-100" @click="sendVerify" :loading="loading">
          {{ trlang.send_verify }}
        </a-button>

        <div class="text-end mt-2">
          <router-link to="/auth/login">
            <a-button type="link">{{ trlang.back_to_login }}</a-button>
          </router-link>
        </div>
      </a-space>
    </a-col>

    <!-- Right Panel -->
    <a-col :span="12" class="login-image" />
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
