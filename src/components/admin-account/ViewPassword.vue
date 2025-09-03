<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-gray font-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.change_view_manager_password }}
    </a-typography-text>

    <a-typography-text class="text-yellow">
      {{ trlang.this_is_the_view_manager }}
      {{ trlang.please_keep_your_password_secure }}
    </a-typography-text>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.view_manager_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="viewManagerId" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.view_manager_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="password" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.confirm_view_manager_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="confirmPassword" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { RightCircleFilled } from "@ant-design/icons-vue";

export default {
  name: "AdminAccountViewPassword",
  components: { RightCircleFilled },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const viewManagerId = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const fetchData = async () => {
      viewManagerId.value = "Running Ball";
      password.value = "Running";
      confirmPassword.value = "@copywriter";
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      viewManagerId,
      password,
      confirmPassword,
    };
  },
};
</script>
