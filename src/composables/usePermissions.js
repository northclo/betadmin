import { computed } from 'vue';
import { useStore } from 'vuex';

export function usePermissions() {
  const store = useStore();

  const permissions = computed(() => store.getters.getPermissions);

  const hasPermission = (permissionName) => {
    return store.getters.hasPermission(permissionName);
  };

  const canAccessPartner = computed(() => 
    hasPermission('partner_access_permission')
  );

  const canCreateSubPartner = computed(() => 
    hasPermission('sub_partner_creation_permission')
  );

  const canCreateUser = computed(() => 
    hasPermission('user_creation_permission')
  );

  const canChangeSettlementRate = computed(() => 
    hasPermission('sub_partner_settlement_rate')
  );

  const canChangeMoney = computed(() => 
    hasPermission('sub_partner_money_change')
  );

  const refreshPermissions = async () => {
    try {
      const { getData } = await import('@/helpers/Axios');
      const { apiLink } = await import('@/utils/api-link');
      
      const res = await getData(apiLink.admin_account);
      if (res.status && res.data?.permissions) {
        store.commit('setPermissions', res.data.permissions);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing permissions:', error);
      return false;
    }
  };

  return {
    permissions,
    hasPermission,
    canAccessPartner,
    canCreateSubPartner,
    canCreateUser,
    canChangeSettlementRate,
    canChangeMoney,
    refreshPermissions,
  };
}

