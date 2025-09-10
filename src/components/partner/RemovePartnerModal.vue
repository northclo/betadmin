<template>
  <a-modal
    :open="open"
    :title="trlang.remove_current_partner"
    :ok-text="trlang.remove"
    :cancel-text="trlang.cancel"
    @ok="remove"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="bg-white mt-5">
      <a-typography-text>
        {{
          trlang.if_there_are_sub_partners_and_users_then_it_is_not_possible_to_delete
        }}
      </a-typography-text>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_id }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <a-typography-text>{{ dataSource.id }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_nickname }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <a-typography-text>{{ dataSource.nickname }}</a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.partner_info }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <a-typography-text>{{ trlang.betting }}</a-typography-text>
          <a-typography-text class="ms-5">
            {{ dataSource.holdingMoney }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.sub_partners }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <a-typography-text
            >{{ dataSource.subs }} {{ trlang.num }}</a-typography-text
          >
        </a-layout-content>
      </a-layout>

      <a-layout class="bg-white">
        <a-layout-sider class="bg-gray border p-2 setting-sider">
          <a-typography-text class="text-white text-center">
            {{ trlang.users }}
          </a-typography-text>
        </a-layout-sider>
        <a-layout-content class="border p-2">
          <a-typography-text>
            {{ dataSource.members }}
            {{ dataSource.members > 1 ? trlang.people : trlang.person }}
          </a-typography-text>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { computed, defineProps, inject } from 'vue';
import { deleteData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
  fetchData: Function,
});

const emit = defineEmits(['update:open']);

const remove = async () => {
  if (props.dataSource.subs > 0 || props.dataSource.members > 0)
    return message.error(trlang.value.it_is_not_possible_to_delete);

  const result = await deleteData(
    `${apiLink.delete_partner}?id=${props.dataSource.id}&role=${props.dataSource.role}`
  );

  if (result.status) {
    props.fetchData();
    emit('update:open', false);
    message.success(trlang.value.deleted_successful);
  }
};
</script>
