<template>
  <a-row class="h-100vh">
    <!-- Left Panel -->
    <a-col :span="12" class="d-flex justify-center align-center">
      <a-space direction="vertical" size="middle" class="w-100 max-w-fit">
        <div>
          <a-typography-title level="2">{{ trlang.reset_password }}</a-typography-title>
        </div>

        <!-- Password Input -->
        <div>
          <a-typography-text>{{ trlang.password }}</a-typography-text>
          <a-input-password
            v-model:value="password"
            :placeholder="trlang.input_password"
          />
        </div>

        <!-- Confirm Password Input -->
        <div>
          <a-typography-text>{{ trlang.confirm_password }}</a-typography-text>
          <a-input-password
            v-model:value="confirm_password"
            :placeholder="trlang.input_password"
          />
        </div>

        <!-- Reset Button -->
        <a-button
          type="primary"
          class="w-100 mt-5"
          @click="resetPassword"
          :loading="loading"
        >
          {{ trlang.reset_password }}
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
import { useRoute } from "vue-router";

import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";

const route = useRoute();

export default {
  name: routeLink.forgot_password.name,
  inject: ["langState"],
  data() {
    return {
      password: "",
      confirm_password: "",
      loading: false,
    };
  },
  computed: {
    trlang() {
      return this.langState.translations;
    },
  },
  methods: {
    async resetPassword() {
      // check if input password and confirm password
      if (!this.password || !this.confirm_password) {
        message.error(this.trlang.fill_password);
        return;
      }

      // check if password and confirm password are same
      if (this.password != this.confirm_password) {
        message.error(this.trlang.wrong_password);
        return;
      }

      // get token from query
      const token = route.query.token;

      const res = await postData(`${apiLink.reset_password}/${token}`, {
        password: this.password,
      });

      if (res.status) {
        // when password reset successful, if password is saved in localstorage, change the saved password
        if (localStorage.getItem("password")) {
          localStorage.setItem("password", this.password);
        }

        message.success(this.trlang.password_reset_successful);

        // Redirect after send verify request
        this.$router.push(routeLink.login.link);
      }
    },
  },
};
</script>
