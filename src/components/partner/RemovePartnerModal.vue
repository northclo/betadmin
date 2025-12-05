<template>
  <a-modal
    :open="open"
    :title="isUser ? trlang.remove_current_user : trlang.remove_current_partner"
    :ok-text="trlang.remove"
    :cancel-text="trlang.cancel"
    @ok="remove"
    @cancel="$emit('update:open', false)"
    :confirm-loading="loading"
  >
    <a-layout class="mt-5">
      <a-typography-text class="mb-2" v-if="!isUser">
        {{
          trlang.if_there_are_sub_partners_and_users_then_it_is_not_possible_to_delete
        }}
      </a-typography-text>
      <a-typography-text class="mb-2" v-else>
        {{ trlang.confirm_delete_user }}
      </a-typography-text>

      <a-layout class="border-t border-b" v-if="!isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_id }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text>{{ dataSource.id }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-t border-b" v-if="isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.user_nickname || trlang.user_nickname_label }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text>{{ dataSource.nickname }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b" v-if="!isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_nickname }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text>{{ dataSource.nickname }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b" v-if="!isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_info }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text class="text-dark-brown">
            {{ dataSource.money ? dataSource.money.toLocaleString() : 0 }}{{ trlang.global_currency }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b" v-if="!isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.sub_partners }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text
            >{{ dataSource.subs ? dataSource.subs.toLocaleString() : 0 }} {{ trlang.num }}</a-typography-text
          >
        </a-layout-content>
      </a-layout>

      <a-layout class="border-b" v-if="!isUser">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.users }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="p-2">
          <a-typography-text>
            {{ dataSource.members ? dataSource.members.toLocaleString() : 0 }}
            {{ dataSource.members > 1 ? trlang.people : trlang.person }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { computed, defineProps, inject, ref } from 'vue';
import { deleteData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
  fetchData: Function,
});

const emit = defineEmits(['update:open']);

const loading = ref(false);

const isUser = computed(() => props.dataSource?.role === 'user');

const remove = async () => {
  if (!isUser.value && (props.dataSource.subs > 0 || props.dataSource.members > 0)) {
    return message.error(trlang.value.it_is_not_possible_to_delete);
  }

  if (isUser.value && !props.dataSource.userId) {
    return message.error(trlang.value.user_not_found);
  }

  try {
    loading.value = true;
    let result;
    
    if (isUser.value) {
      result = await deleteData(
        `${apiLink.delete_member}/${props.dataSource.userId}`
      );
    } else {
      result = await deleteData(
        `${apiLink.delete_partner}?id=${props.dataSource.id}`
      );
    }

    if (result.status) {
      message.success(trlang.value.deleted_successful);
      props.fetchData();
      emit('update:open', false);
    }
  } catch (error) {
    console.error(`Error removing ${isUser.value ? 'user' : 'partner'}:`, error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loading.value = false;
  }
};
</script>
