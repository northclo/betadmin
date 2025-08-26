import { createStore } from 'vuex'
import { setStore, getStore } from '@/config/utils'

const user = getStore('user')
const currency = getStore('currency')
const pass = getStore('pass')

export default createStore({
  state: {
    loginAdmin: user,
    selectedCurrency: currency,
    loginPassword: pass,
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginAdmin = user
      setStore('user', user)
    },
    setCurrency(state, currency) {
      state.selectedCurrency = currency
      setStore('currency', currency)
    },
    setLoginPass(state, pass) {
      state.loginPassword = pass
      setStore('pass', pass)
    },
  },
  getters: {
    getLoginUserInfo: (state) => state.loginAdmin,
    getCurrencyInfo: (state) => state.selectedCurrency,
    getLoginPass: (state) => state.loginPassword,
  },
  actions: {}
})