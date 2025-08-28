<template>
    <div>
        <div class="d-flex h-100vh">
            <div class="justify-center h-100 w-50">
                <a-space direction="vertical" size="middle" class="w-100" style="max-width: 280px;">
                    <div>
                        <a-typography-title :level="2">
                            {{ trlang.reset_password }}
                        </a-typography-title>
                    </div>
                    <div class="text-start">
                        <a-typography-text>{{ trlang.password }}</a-typography-text>
                        <a-input-password v-model:value="password" :placeholder="trlang.input_password" />
                    </div>
                    <div class="text-start">
                        <a-typography-text>{{ trlang.confirm_password }}</a-typography-text>
                        <a-input-password v-model:value="confirm_password" :placeholder="trlang.input_password" />
                    </div>
                    <button class="w-100 pt-2 pb-2 mt-5 radius-2 cursor-pointer main-background text-white"
                        @click="resetPassword">
                        {{ trlang.reset_password }}
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
import { useRoute } from 'vue-router';

import { postData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';
import { routeLink } from '@/utils/route-link';

const route = useRoute();

export default {
    name: routeLink.forgot_password.name,
    inject: ['langState'],
    data() {
        return {
            password: "",
            confirm_password: '',
            loading: false
        };
    },
    computed: {
        trlang() {
            return this.langState.translations
        }
    },
    methods: {
        async resetPassword() {
            // check if input password and confirm password
            if (!this.password || !this.confirm_password) {
                message.error(this.trlang.fill_password)
                return;
            }

            // check if password and confirm password are same
            if (this.password != this.confirm_password) {
                message.error(this.trlang.wrong_password)
                return
            }

            // get token from query
            const token = route.query.token;

            const res = await postData(`${apiLink.reset_password}/${token}`, { password: this.password })

            if (res.status) {
                // when password reset successful, if password is saved in localstorage, change the saved password
                if (localStorage.getItem('password')) {
                    localStorage.setItem('password', this.password)
                }

                message.success(this.trlang.password_reset_successful)

                // Redirect after send verify request
                this.$router.push(routeLink.login.link);
            }

        }
    }
}
</script>
