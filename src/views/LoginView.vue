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
              <a-typography-text class="fs-5">
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
          <button class="w-100 pt-2 pb-2 mt-5 radius-2 cursor-pointer main-background text-white" @click="login">
            {{ trlang.login }}
          </button>
          <div class="w-100 d-flex justify-between">
            <a-checkbox v-model:checked="checked">{{ trlang.remember_me }}</a-checkbox>
            <a href="/auth/register">
              <button class="transparent-background border-0 text-main fs-5 cursor-pointer">
                {{ trlang.forgot_password }}
              </button>
            </a>
          </div>
          <div class="d-flex text-center w-100 justify-center">
            <a-typography-text class="fs-5">
              {{ trlang.not_have_account }}
            </a-typography-text>
            <a href="/auth/register">
              <button class="transparent-background border-0 text-main fs-5 cursor-pointer">
                {{ trlang.register_now }}
              </button>
            </a>
          </div>
        </a-space>
      </div>
      <div class="w-50">asdfasdf</div>
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
        message.error(this.trlang.input_email_password)
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

        console.log('response :>> ', response);

        // Example: store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Redirect after login
        this.$router.push("/");
      } catch (error) {
        console.log('error.response :>> ', error.response);
        message.error('something went wrong')
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
