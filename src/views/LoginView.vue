<template>
  <div style="display:flex;min-height:85vh">
    <div style="width:100%;display:flex;top:0px;margin:auto;">
      <div style="margin:auto;">
        <div style="width:300px;padding-top:20px">
          <a-input
            placeholder="Email"
            v-model:value="loginAdmin.email"
            size="large"
            @change="emailChanged"
          />
          <a-input-password
            style="margin-top:20px"
            placeholder="Password"
            v-model:value="loginAdmin.password"
            size="large"
            @change="emailChanged"
          />

          <a-checkbox style="margin-top:20px;" v-model:checked="isRemember">
            Remember me
          </a-checkbox>

          <a-button
            style="margin-top:10px;width:100%"
            type="primary"
            :disabled="disabled"
            size="large"
            :style="{ fontSize: '20px' }"
            @click="handleLoginClick"
          >
            Log in
          </a-button>

          <div
            style="background-color:#F0EFEF;height:1px;width:100%;margin-top:20px"
          ></div>
          <div
            style="width:100%;margin-top:10px;text-align:center;cursor:pointer"
          >
            New here?
            <font color="#CEB39A" @click="clickSignUp">Sign up</font>
          </div>
          <div
            style="width:100%;margin-top:10px;text-align:center;cursor:pointer"
            @click="openForgotPassword"
          >
            Forgot password?
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { api } from '../helpers/Helpers'

// Store & Router
const store = useStore()
const router = useRouter()

// State
const loginAdmin = reactive({
  email: 'marcos.henrique@toptal.com',
  password: 's3cr3tp4sswo4rd'
})
const isRemember = ref(false)
const disabled = ref(false)

// Methods
function getUserPass() {
  const passInfo = store.state.loginPassword
  if (passInfo?.userEmail && passInfo?.password) {
    loginAdmin.email = passInfo.userEmail
    loginAdmin.password = passInfo.password
  }
}

async function handleLoginClick() {
  const res = await api.login(loginAdmin)
  if (res) {
    const userInfo = {
      loginType: 'api',
      api: {
        auth: 'alyosha',
        user: {
          name: res.name,
          email: loginAdmin.email,
          profileImage: 'testurl',
          accessToken: res.accessToken,
          refreshToken: res.refreshToken
        }
      },
      id: res.userId
    }

    store.commit('setLoginUser', userInfo)

    if (isRemember.value) {
      store.commit('setLoginPass', {
        userEmail: loginAdmin.email,
        password: loginAdmin.password
      })
    } else {
      store.commit('setLoginPass', {
        userEmail: '',
        password: ''
      })
    }

    router.push('/admin/users')
  }
}

function emailChanged() {
  disabled.value = !loginAdmin.email || !loginAdmin.password
}

function clickSignUp() {
  router.push('/admin/signupview')
}

function openForgotPassword() {
  router.push('/admin/forgotview')
}

// Lifecycle
onMounted(() => {
  getUserPass()
  emailChanged()
})
</script>