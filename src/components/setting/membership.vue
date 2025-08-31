<template>
  <a-layout class="bg-white mt-2">
    <a-typography-text
      class="text-dark-grey text-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.membership_setting }}
    </a-typography-text>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.use_membership_registration }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex items-center gap-2">
        <a-button
          v-for="item in useMembership"
          :key="item.key"
          :class="item.key === useMembershipKey ? 'bg-main text-white' : ''"
          @click="updateMembership(item.key)"
        >
          <CheckOutlined v-if="item.key === useMembershipKey" />
          {{ item.text }}
        </a-button>
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border justify-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.whether_membership_registration_is_approved }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 d-flex flex-column">
        <a-layout class="d-flex flex-row gap-2 bg-white">
          <a-switch v-model:checked="check" class="w-fit" />
          <a-typography-text class="d-flex items-center">{{
            check ? trlang.use : trlang.no_use
          }}</a-typography-text>
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
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border text-center p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.notification_message_when_signing_up_for_membership }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="4" v-model:value="notificationMessage" allow-clear />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onBeforeMount, onMounted, ref } from "vue";
import { RightCircleFilled, CheckOutlined } from "@ant-design/icons-vue";

export default {
  name: "MembershipSetting",
  components: { RightCircleFilled, CheckOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const useMembership = ref("");
    const useMembershipKey = ref(0);
    const check = ref(true);
    const notificationMessage = ref("");

    const getComponentData = () => {
      const _useMembership = [
        `${trlang.value.use} (${trlang.value.recommender_required})`,
        `${trlang.value.use} (${trlang.value.select_referrer})`,
        `${trlang.value.use} (${trlang.value.do_not_use_referrer})`,
        `${trlang.value.use} (${trlang.value.not_in_use})`,
      ];
      useMembership.value = _useMembership.map((element, idx) => ({
        key: idx,
        text: element,
      }));
    };

    const fetchData = async () => {
      check.value = true;
      notificationMessage.value = "Thanks for your membership upgrade";
    };

    const updateMembership = (key) => {
      useMembershipKey.value = key;
    };

    onMounted(() => {
      fetchData();
    });

    onBeforeMount(() => {
      getComponentData();
    });

    return {
      trlang,
      check,
      useMembership,
      useMembershipKey,
      updateMembership,
      notificationMessage,
    };
  },
};
</script>
