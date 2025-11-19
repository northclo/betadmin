import { createStore } from 'vuex'
import { setStore, getStore } from '@/config/utils'

const user = getStore('user')
const currency = getStore('currency')
const pass = getStore('pass')
const permissions = getStore('permissions')
const partnerRole = getStore('partnerRole')

export default createStore({
  state: {
    loginAdmin: user,
    selectedCurrency: currency,
    loginPassword: pass,
    permissions: permissions || {
      partner_access_permission: false,
      sub_partner_creation_permission: false,
      user_creation_permission: false,
      sub_partner_settlement_rate: false,
      sub_partner_money_change: false,
    },
    partnerRole: partnerRole || null,
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
    setPermissions(state, permissions) {
      state.permissions = permissions || {
        partner_access_permission: false,
        sub_partner_creation_permission: false,
        user_creation_permission: false,
        sub_partner_settlement_rate: false,
        sub_partner_money_change: false,
      }
      setStore('permissions', state.permissions)
    },
    clearPermissions(state) {
      state.permissions = {
        partner_access_permission: false,
        sub_partner_creation_permission: false,
        user_creation_permission: false,
        sub_partner_settlement_rate: false,
        sub_partner_money_change: false,
      }
      setStore('permissions', null)
    },
    setPartnerRole(state, role) {
      state.partnerRole = role
      setStore('partnerRole', role)
    },
    clearPartnerRole(state) {
      state.partnerRole = null
      setStore('partnerRole', null)
    },
  },
  getters: {
    getLoginUserInfo: (state) => state.loginAdmin,
    getCurrencyInfo: (state) => state.selectedCurrency,
    getLoginPass: (state) => state.loginPassword,
    getPermissions: (state) => state.permissions,
    getPartnerRole: (state) => state.partnerRole,
    isHeadquater: (state) => state.partnerRole === 'headquater',
    hasPermission: (state) => (permissionName) => {
      return state.permissions[permissionName] === true
    },
  },
  actions: {}
})