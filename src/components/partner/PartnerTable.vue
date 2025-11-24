<template>
  <a-table :columns="columns" :data-source="displayData" :pagination="false" :showHeader="true" class="partner-table">
    <template #emptyText>
      <a-spin v-if="loading" /> <span v-else>{{ trlang.no_data }}</span>
    </template>
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'no'">
        <a-typography-text>{{ index + 1 }}</a-typography-text>
      </template>
      <template v-if="column.key === 'headquater'">
        <a-layout v-if="record.role === 'headquater'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
      </template>
      <template v-if="column.key === 'branch_office'">
        <a-layout v-if="record.role === 'branch_office'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
        <a-typography-text v-if="record.role === 'headquater'" class="text-main">
          {{ record.subs === 0 ? '' : record.subs }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'regional_office' && record.role !== 'user'">
        <a-layout v-if="record.role === 'regional_office'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
        <a-typography-text v-if="record.role === 'branch_office'" class="text-main">
          {{ record.subs === 0 ? '' : record.subs }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'agency' && record.role !== 'user'">
        <a-layout v-if="record.role === 'agency'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
        <a-typography-text v-if="record.role === 'regional_office'" class="text-main">
          {{ record.subs === 0 ? '' : record.subs }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'distributor' && record.role !== 'user'">
        <a-layout v-if="record.role === 'distributor'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
        <a-typography-text v-if="record.role === 'agency'" class="text-main">
          {{ record.subs === 0 ? '' : record.subs }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'store' && record.role !== 'user'">
        <a-layout v-if="record.role === 'store'" class="bg-light-pink flex items-center gap-2">
          <a-typography-text>{{ record.id }}</a-typography-text>
          <a-tag 
            v-if="record.subs > 0 || record.members > 0"
            :color="isExpanded(record.id) ? 'blue' : 'default'"
            style="cursor: pointer;"
            @click.stop="toggleExpand(record.id)"
          >
            <MinusOutlined v-if="isExpanded(record.id)" />
            <PlusOutlined v-else />
            {{ isExpanded(record.id) ? trlang.close : trlang.expand }} ({{ record.subs + record.members }})
          </a-tag>
        </a-layout>
        <a-typography-text v-if="record.role === 'distributor'" class="text-main">
          {{ record.subs === 0 ? '' : record.subs }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'users'">
        <a-layout v-if="record.role === 'user'" class="bg-light-pink">
          <a-typography-text>{{ record.id }}</a-typography-text>
        </a-layout>
        <a-typography-text v-else class="text-dark-brown">
          {{ record.members === 0 ? '' : record.members }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'nickname'">
        <a-typography-text> {{ record.nickname }} </a-typography-text>
      </template>
      <template v-if="column.key === 'money'">
        <a-layout class="bg-none text-end">
          <a-typography-text class="text-dark-brown text-end">
            {{ record.money }}{{ trlang.global_currency }}
          </a-typography-text>
          <a-typography-text>{{ record.point }}{{ trlang.points_unit }}</a-typography-text>
        </a-layout>
      </template>
      <template v-if="column.key === 'benefit'">
        <a-layout class="bg-none">
          <a-typography-text>
            {{ trlang.oeuo }}
            <span class="text-dark-brown">{{ record.simpleBetRate }}%</span>
          </a-typography-text>
          <a-typography-text>
            {{ trlang.combined }}
            <span class="text-dark-brown">{{ record.combinedBetRate }}%</span>
          </a-typography-text>
          <a-typography-text>
            {{ trlang.number }}
            <span class="text-dark-brown">{{ record.matchNumberBetRate }}%</span>
          </a-typography-text>
        </a-layout>
      </template>
      <template v-if="column.key === 'number_of_members'">
        <a-typography-text>
          {{ record.members + 1 }}
        </a-typography-text>
      </template>
      <template v-if="column.key === 'function'">
        <a-layout class="bg-none flex flex-row justify-center items-center flex-wrap gap-2">
          <a-button v-if="record.role !== 'headquater' && record.role !== 'user'" class="actions-button bg-gray text-white"
            @click="$emit('openSettingModal', record)">
            <CheckCircleOutlined /> {{ trlang.setting }}
          </a-button>
          <a-button v-if="record.role === 'user'" class="actions-button bg-gray text-white"
            @click="$emit('openMemberSettingModal', record)">
            <CheckCircleOutlined /> {{ trlang.member_settings }}
          </a-button>
          <a-button v-if="record.role !== 'headquater' && record.role !== 'user'" class="actions-button bg-gray text-white"
            @click="$emit('openGroupMessageModal', record)">
            <CheckCircleOutlined /> {{ trlang.group_message }}
          </a-button>
          <a-button v-if="canChangeMoney && record.role !== 'headquater'" class="actions-button bg-gray text-white"
            @click="$emit('openCashModal', record)">
            <CheckCircleOutlined /> {{ trlang.cash_increase_decrease }}
          </a-button>
          <a-button v-if="record.role !== 'headquater'" class="actions-button bg-gray text-white"
            @click="$emit('openRemoveModal', record)">
            <CheckCircleOutlined /> {{ trlang.delete }}
          </a-button>
          <a-button 
            v-if="
              canCreateSubPartner &&
              record.role !== 'headquater' &&
              record.role !== 'store' &&
              record.role !== 'user'
            " 
            class="actions-button bg-gray text-white" 
            @click="$emit('openAddSubModal', record)"
          >
            <CheckCircleOutlined /> {{ trlang.add_sub }}
          </a-button>
          <a-button 
            v-if="canCreateUser && record.role !== 'user'" 
            class="actions-button bg-green text-white" 
            @click="$emit('openRegisterUser', record)"
          >
            <UserAddOutlined /> {{ trlang.member_registration }}
          </a-button>
        </a-layout>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import { computed, defineProps, inject, ref, watch } from 'vue';
import { CheckCircleOutlined, UserAddOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { usePermissions } from '@/composables/usePermissions';

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const { canCreateSubPartner, canCreateUser, canChangeMoney } = usePermissions();

const props = defineProps({
  columns: Array,
  dataSource: Array,
  loading: Boolean,
  fetchData: Function,
});

const expandedPartners = ref(new Set());
const displayData = ref([]);

const toggleExpand = (partnerId) => {
  if (expandedPartners.value.has(partnerId)) {
    expandedPartners.value.delete(partnerId);
  } else {
    expandedPartners.value.add(partnerId);
  }
  updateDisplayData();
};

const isExpanded = (partnerId) => {
  return expandedPartners.value.has(partnerId);
};

const updateDisplayData = () => {
  if (!props.dataSource || props.dataSource.length === 0) {
    displayData.value = [];
    return;
  }

  const result = [];
  const roleHierarchy = {
    headquater: 0,
    branch_office: 1,
    regional_office: 2,
    agency: 3,
    distributor: 4,
    store: 5,
    user: 6,
  };

  const getRoleLevel = (role) => roleHierarchy[role] ?? 999;

  let currentParentStack = [];

  props.dataSource.forEach((partner) => {
    const partnerLevel = getRoleLevel(partner.role);
    
    while (currentParentStack.length > 0) {
      const lastParent = currentParentStack[currentParentStack.length - 1];
      const lastParentLevel = getRoleLevel(lastParent.role);
      
      if (partnerLevel <= lastParentLevel) {
        currentParentStack.pop();
      } else {
        break;
      }
    }

    let shouldShow = true;
    
    if (currentParentStack.length > 0) {
      const immediateParent = currentParentStack[currentParentStack.length - 1];
      shouldShow = isExpanded(immediateParent.id);
    }

    if (shouldShow) {
      const partnerWithLevel = {
        ...partner,
        _level: currentParentStack.length,
        _parentId: currentParentStack.length > 0 ? currentParentStack[currentParentStack.length - 1].id : null,
      };
      result.push(partnerWithLevel);

      if ((partner.subs > 0 || partner.members > 0) && partner.role !== 'user') {
        currentParentStack.push(partner);
      }
    }
  });

  displayData.value = result;
};

watch(() => props.dataSource, (newData) => {
  if (newData && newData.length > 0) {
    newData.forEach((partner) => {
      if ((partner.subs > 0 || partner.members > 0) && partner.role !== 'user') {
        expandedPartners.value.add(partner.id);
      }
    });
  }
  updateDisplayData();
}, { immediate: true, deep: true });

const expandAll = () => {
  if (!props.dataSource) return;
  props.dataSource.forEach((partner) => {
    if ((partner.subs > 0 || partner.members > 0) && partner.role !== 'user') {
      expandedPartners.value.add(partner.id);
    }
  });
  updateDisplayData();
};

const collapseAll = () => {
  expandedPartners.value.clear();
  updateDisplayData();
};

defineExpose({
  expandAll,
  collapseAll,
});
</script>
<style scoped>
.actions-button {
  padding: 2px 4px;
  border-radius: 6px !important;
}
</style>