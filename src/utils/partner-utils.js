export const getNextPartnerRole = (parentRole) => {
  if (!parentRole) {
    return 'branch_office';
  }

  const roleMap = {
    'headquater': 'branch_office',
    'branch_office': 'regional_office',
    'regional_office': 'agency',
    'agency': 'distributor',
    'distributor': 'store',
    'store': null,
  };

  return roleMap[parentRole] || null;
};

export const getPartnerRoleTranslationKey = (role) => {
  if (!role) {
    return 'branch_office';
  }

  const translationMap = {
    'headquater': 'headquater',
    'branch_office': 'branch_office',
    'regional_office': 'regional_office',
    'agency': 'agency',
    'distributor': 'distributor',
    'store': 'store',
  };

  return translationMap[role] || 'branch_office';
};

