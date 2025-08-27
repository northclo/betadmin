<template>
  <div>
    <div class="d-flex h-100vh">
      <div class="justify-center h-100 w-50">
        <a-space direction="vertical" size="middle" class="w-100" style="max-width: 280px;">
          <div>
            <a-typography-title :level="2">
              {{ trlang.forgot_password }}
            </a-typography-title>
          </div>
          <div class="text-start">
            <a-typography-text>{{ trlang.email }}</a-typography-text>
            <a-input v-model:value="email" :placeholder="trlang.input_email" />
          </div>
          <button class="w-100 pt-2 pb-2 radius-2 cursor-pointer main-background text-white" @click="login">
            {{ trlang.login }}
          </button>
        </a-space>
      </div>
      <div class="w-50 login-image"></div>
    </div>
  </div>
</template>

<script>

import { message } from 'ant-design-vue';

import { checkValidEmail } from '@/helpers/commond';
import { api } from '@/helpers/Api'

export default {
  name: 'LoginPage',
  inject: ['langState'],
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  computed: {
    trlang() {
      return this.langState.translations
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
      try {
        let response = await api.login({
          email: this.email,
          password: this.password,
        })

        // Example: store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect after login
        this.$router.push("/");
      } catch (error) {
        message.error(error.response.data.message)
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
