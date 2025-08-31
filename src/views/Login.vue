<template>
  <a-row class="h-100vh">
    <!-- Left Panel -->
    <a-col :span="12" class="d-flex justify-center items-center">
      <a-space direction="vertical" size="middle" class="w-100 max-w-fit">
        <div>
          <a-typography-title level="2">{{ trlang.welcome_back }}</a-typography-title>
          <a-typography-text>{{ trlang.enter_detail }}</a-typography-text>
        </div>

        <!-- Email Input -->
        <div>
          <a-typography-text>{{ trlang.email }}</a-typography-text>
          <a-input v-model:value="email" :placeholder="trlang.input_email" />
        </div>

        <!-- Password Input -->
        <div>
          <a-typography-text>{{ trlang.password }}</a-typography-text>
          <a-input-password
            v-model:value="password"
            :placeholder="trlang.input_password"
          />
        </div>

        <!-- Remember Me + Forgot Password -->
        <a-row class="w-100" justify="space-between" align="middle">
          <a-checkbox v-model:checked="remember">{{ trlang.remember_me }}</a-checkbox>
          <router-link to="/auth/forgot-password">
            <a-button type="link">{{ trlang.forgot_password }}</a-button>
          </router-link>
        </a-row>

        <!-- Login Button -->
        <a-button type="primary" class="w-100" @click="login" :loading="loading">
          {{ trlang.login }}
        </a-button>

        <!-- Register Link -->
        <a-row justify="center" align="middle" class="mt-2">
          <a-typography-text class="fs-5">{{
            trlang.not_have_account
          }}</a-typography-text>
          <router-link to="/auth/register">
            <a-button type="link">{{ trlang.register_now }}</a-button>
          </router-link>
        </a-row>
      </a-space>
    </a-col>

    <!-- Right Panel -->
    <a-col :span="12" class="login-image" />
  </a-row>
</template>

<script>
import { message } from "ant-design-vue";

import { checkValidEmail } from "@/helpers/Common.js";
import { postData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";

export default {
  name: routeLink.login.name,
  inject: ["langState"],
  data() {
    return {
      email: "",
      password: "",
      checked: false,
      loading: false,
    };
  },
  computed: {
    trlang() {
      return this.langState.translations;
    },
  },
  created() {
    // get email and password from localstorage
    let savedEmail = localStorage.getItem("email");
    let savedPassword = localStorage.getItem("password");

    // if exist email and password in localstorage, auto fill in email, password and remember
    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.remember = true;
    }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        message.error(this.trlang.fill_email_password);
        return;
      }

      // check email style
      if (!checkValidEmail(this.email)) {
        message.error(this.trlang.not_correct_email);
        return;
      }

      this.loading = true;

      let res = await postData(apiLink.login, {
        email: this.email.toLowerCase(),
        password: this.password,
      });

      if (res.status) {
        // Example: store token in localStorage
        localStorage.setItem("token", res.data.token);

        if (this.remember) {
          localStorage.setItem("email", this.email);
          localStorage.setItem("password", this.password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        // Redirect after login
        this.$router.push(routeLink.dashboard.link);
      }
    },
  },
};
</script>
