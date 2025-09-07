<template>
  <a-row class="h-100vh">
    <!-- Left Panel -->
    <a-col :span="12" class="flex justify-center items-center">
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
        <a-button type="primary" class="w-100" @click="login">
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

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { postData } from "@/helpers/Axios";
import { apiLink } from "@/utils/api-link";
import { routeLink } from "@/utils/route-link";
import { checkValidEmail } from "@/helpers/Common.js";

/* Router */
const router = useRouter();

/* Inject translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive states */
const email = ref("");
const password = ref("");
const remember = ref(false);

/* Load saved email/password on mount */
onMounted(() => {
  const savedEmail = localStorage.getItem("email");
  const savedPassword = localStorage.getItem("password");

  if (savedEmail && savedPassword) {
    email.value = savedEmail;
    password.value = savedPassword;
    remember.value = true;
  }
});

/* Login method */
const login = async () => {
  if (!email.value || !password.value) {
    message.error(trlang.value.fill_email_password);
    return;
  }

  if (!checkValidEmail(email.value)) {
    message.error(trlang.value.not_correct_email);
    return;
  }

  const res = await postData(apiLink.login, {
    email: email.value.toLowerCase(),
    password: password.value,
  });

  if (res.status) {
    localStorage.setItem("token", res.data.token);

    if (remember.value) {
      localStorage.setItem("email", email.value);
      localStorage.setItem("password", password.value);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }

    router.push(routeLink.dashboard.link);
  }
};
</script>
