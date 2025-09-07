<template>
  <a-modal
    :open="open"
    :title="trlang.send_a_note"
    :ok-text="trlang.registration"
    :cancel-text="trlang.cancel"
    @ok="register"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="bg-white mt-5">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{ trlang.title }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2">
        <a-input v-model:value="title" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.author
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2">
        <a-input v-model:value="value" class="input-md" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.recipient
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-typography-text> {{ trlang.distributor_id }}: </a-typography-text>
        <a-typography-text> {{ trlang.distributor_id }}: </a-typography-text>
        <a-typography-text class="text-dark-brown">
          ({{ trlang.including_subordinates }})
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.detail
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2">
        <a-textarea :rows="5" v-model:value="inactiveMessage" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <!-- Sidebar -->
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">{{
          trlang.expiration_period
        }}</a-typography-text>
      </a-layout-sider>

      <!-- Main content -->
      <a-layout-content class="border p-2 flex flex-column">
        <a-select
          ref="select"
          v-model:value="value1"
          style="width: 120px"
          @focus="focus"
          @change="handleChange"
        >
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
        <a-typography-text class="text-dark-brown">
          *{{
            trlang.when_set_messages_will_be_automatically_deleted_after_the_specified_period
          }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>

<script setup>
import { computed, defineProps, inject, ref } from "vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

defineProps({
  open: Boolean,
});

const title = ref("");

const register = () => {
  console.log("Register user logic here");
};
</script>
