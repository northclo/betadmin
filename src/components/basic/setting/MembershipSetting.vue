<template>
  <a-collapse-panel>
    <template #header>
      <a-typography-text class="text-dark-gray font-bold fs-4 leading-0">
        {{ trlang.membership_setting }}
      </a-typography-text>
    </template>

    <a-layout>
      <a-layout-sider class="border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.use_membership_registration }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2 flex-wrap">
        <a-button
          v-for="item in membershipRegistrationOptions"
          :key="item.key"
          :class="item.key === membershipRegistration ? 'bg-main text-white' : ''"
          @click="membershipRegistration = item.key"
        >
          <CheckOutlined v-if="item.key === membershipRegistration" /> {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <a-layout>
      <a-layout-sider
        class="border flex justify-center items-center p-2 setting-sider"
      >
        <a-typography-text class="text-white text-center">
          {{ trlang.whether_membership_registration_is_approved }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex flex-column">
        <a-layout class="flex flex-row gap-2 items-center">
          <a-switch v-model:checked="membershipApproval" class="w-fit" />
          <a-typography-text>
            {{ membershipApproval ? trlang.use : trlang.no_use }}
          </a-typography-text>
        </a-layout>
        <p class="text-helper mt-2 mb-1">
          {{
            trlang.if_you_set_approval_for_membership_registration_the_pending_message_will_appear_at_the_top_of_the_screen_when_registering
          }}
        </p>
        <p class="text-helper">
          {{
            trlang.if_you_change_your_mind_please_edit_the_notification_message_for_membership_registration_text_below
          }}
        </p>
      </a-layout-content>
    </a-layout>

    <a-layout>
      <a-layout-sider class="border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_signing_up_for_membership }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-textarea v-model:value="membershipSignupMessage" :rows="4" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, onBeforeMount, defineExpose } from 'vue';
import { CheckOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  dataSource: { type: Object, required: true },
});

/* Translations */
const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const membershipRegistrationOptions = ref([]);
const membershipRegistration = ref(0);
const membershipApproval = ref(true);
const membershipSignupMessage = ref('');

const initMembershipOptions = () => {
  membershipRegistrationOptions.value = [
    {
      key: 'recommender',
      text: `${trlang.value.use} (${trlang.value.recommender_required})`,
    },
    {
      key: 'select_referrer',
      text: `${trlang.value.use} (${trlang.value.select_referrer})`,
    },
    {
      key: 'no_referrer',
      text: `${trlang.value.use} (${trlang.value.do_not_use_referrer})`,
    },
    { key: 'no_use', text: `${trlang.value.use} (${trlang.value.not_in_use})` },
  ];
};

const loadData = (data) => {
  membershipRegistration.value = data.membership_registration ?? 0;
  membershipApproval.value = data.membership_approval ?? true;
  membershipSignupMessage.value = data.membership_signup_message || '';
};

watch(() => props.dataSource, loadData, { immediate: true });

defineExpose({
  getState: () => ({
    membershipRegistration: membershipRegistration.value,
    membershipApproval: membershipApproval.value,
    membershipSignupMessage: membershipSignupMessage.value,
  }),
});

onBeforeMount(initMembershipOptions);
</script>
