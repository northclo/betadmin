<template>
  <div>
    <div class="d-flex h-100vh">
      <div class="justify-center h-100 w-50">
        <a-space direction="vertical" size="middle" class="w-100" style="max-width: 280px;">
          <div>
            <a-typography-title :level="2">
              {{ trlang.welcome_back }}
            </a-typography-title>
            <div>
              <a-typography-text>
                {{ trlang.enter_detail }}
              </a-typography-text>
            </div>
          </div>
          <div class="text-start">
            <a-typography-text>{{ trlang.email }}</a-typography-text>
            <a-input v-model:value="email" :placeholder="trlang.input_email" />
          </div>
          <div class="text-start">
            <a-typography-text>{{ trlang.password }}</a-typography-text>
            <a-input-password v-model:value="password" :placeholder="trlang.input_password" />
          </div>
          <div class="w-100 d-flex justify-between">
            <a-checkbox v-model:checked="remember">{{ trlang.remember_me }}</a-checkbox>
            <router-link to="/auth/forgot-password">
              <button class="transparent-background border-0 text-main fs-5 cursor-pointer">
                {{ trlang.forgot_password }}
              </button>
            </router-link>
          </div>
          <button class="w-100 pt-2 pb-2 radius-2 cursor-pointer main-background text-white" @click="login">
            {{ trlang.login }}
          </button>
          <div class="d-flex text-center w-100 justify-center">
            <a-typography-text class="fs-5">
              {{ trlang.not_have_account }}
            </a-typography-text>
            <router-link to="/auth/register">
              <button class="transparent-background border-0 text-main fs-5 cursor-pointer">
                {{ trlang.register_now }}
              </button>
            </router-link>
          </div>
        </a-space>
      </div>
      <div class="w-50 login-image"></div>
    </div>
  </div>
</template>

<script>

import { message } from 'ant-design-vue';

import { checkValidEmail } from '@/helpers/Common.js';
import { postData } from '@/helpers/Axios';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';

export default {
  name: routeLink.login.name,
  inject: ['langState'],
  data() {
    return {
      email: "",
      password: "",
      checked: false,
      loading: false
    };
  },
  computed: {
    trlang() {
      return this.langState.translations
    },
  },
  created() {
    // get email and password from localstorage
    let savedEmail = localStorage.getItem('email');
    let savedPassword = localStorage.getItem('password');

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
        message.error(this.trlang.fill_email_password)
        return;
      }

      // check email style
      if (!checkValidEmail(this.email)) {
        message.error(this.trlang.not_correct_email)
        return;
      }

      this.loading = true;

      let res = await postData(apiLink.login, {
        email: this.email.toLowerCase(),
        password: this.password,
      })

      if (res.status) {
        // Example: store token in localStorage
        localStorage.setItem("token", res.data.token);

        if (this.remember) {
          localStorage.setItem('email', this.email);
          localStorage.setItem("password", this.password)
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('password');
        }

        // Redirect after login
        this.$router.push(routeLink.dashboard.link);
      }
    }
  }
}
</script>
