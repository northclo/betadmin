<template>
  <a-collapse-panel class="bg-white">
    <!-- Header -->
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.membership_setting }}
      </a-typography-text>
    </template>

    <!-- Membership Registration Toggle -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.use_membership_registration }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2 flex-wrap">
        <a-button
          v-for="item in useMembership"
          :key="item.key"
          :class="item.key === useMembershipKey ? 'bg-main text-white' : ''"
          @click="useMembershipKey = item.key"
        >
          <CheckOutlined v-if="item.key === useMembershipKey" /> {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <!-- Membership Approval -->
    <a-layout class="bg-white">
      <a-layout-sider
        class="bg-gray border flex justify-center items-center p-2 setting-sider"
      >
        <a-typography-text class="text-white text-center">
          {{ trlang.whether_membership_registration_is_approved }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column">
        <a-layout class="flex flex-row gap-2 bg-white items-center">
          <a-switch v-model:checked="check" class="w-fit" />
          <a-typography-text>
            {{ check ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout>
        <a-typography-text class="text-yellow mt-2">
          {{
            trlang.if_you_set_approval_for_membership_registration_the_pending_message_will_appear_at_the_top_of_the_screen_when_registering
          }}
        </a-typography-text>
        <a-typography-text class="text-yellow">
          {{
            trlang.if_you_change_your_mind_please_edit_the_notification_message_for_membership_registration_text_below
          }}
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <!-- Notification Message -->
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_signing_up_for_membership }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea v-model:value="notificationMessage" :rows="4" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";

/* Props */
const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

/* Reactive state */
const useMembership = ref([]);
const useMembershipKey = ref(0);
const check = ref(true);
const notificationMessage = ref("");

// Initialize membership options
const initMembershipOptions = () => {
  const options = [
    `${trlang.value.use} (${trlang.value.recommender_required})`,
    `${trlang.value.use} (${trlang.value.select_referrer})`,
    `${trlang.value.use} (${trlang.value.do_not_use_referrer})`,
    `${trlang.value.use} (${trlang.value.not_in_use})`,
  ];
  useMembership.value = options.map((text, idx) => ({ key: idx, text }));
};

// Load data from parent
const loadData = (data) => {
  if (!data?.membership) return;
  useMembershipKey.value = data.membership.registration ?? 0;
  check.value = data.membership.approval ?? true;
  notificationMessage.value = data.membership.message || "";
};

// Watch for changes
watch(() => props.dataSource, loadData, { immediate: true });

// Expose state for parent
defineExpose({
  getState: () => ({
    registration: useMembershipKey.value,
    approval: check.value,
    message: notificationMessage.value,
  }),
});

onBeforeMount(initMembershipOptions);
</script>
