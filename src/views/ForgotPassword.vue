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
          <a-typography-text class="fs-5">{{ trlang.you_will_get_verify_with_email }}</a-typography-text>
          <button class="w-100 pt-2 pb-2 radius-2 cursor-pointer main-background text-white" @click="sendVerify">
            {{ trlang.send_verify }}
          </button>
          <div class="text-end">
            <router-link to="/auth/login">
              <button class="transparent-background border-0 text-main fs-5 cursor-pointer">
                {{ trlang.back_to_login }}
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
import { postData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';

export default {
  name: routeLink.forgot_password.name,
  inject: ['langState'],
  data() {
    return {
      email: "",
      loading: false
    };
  },
  computed: {
    trlang() {
      return this.langState.translations
    }
  },
  methods: {
    async sendVerify() {
      if (!this.email) {
        message.error(this.trlang.fill_email)
        return;
      }

      // check email style
      if (!checkValidEmail(this.email)) {
        message.error(this.trlang.not_correct_email)
        return;
      }

      this.loading = true;
      const res = await postData(apiLink.forgot_password, { email: this.email })

      if (res.status) {
        message.success(this.trlang.sent_verification_link)
      }

    }
  }
}
</script>
