<template>
  <a-layout class="bg-white mt-5">
    <a-typography-text
      class="text-dark-gray font-bold p-2 fs-4 mb-2"
      style="border-bottom: 1px solid black"
    >
      <RightCircleFilled />
      {{ trlang.change_administrator_password }}
    </a-typography-text>

    <a-typography-text class="text-yellow">
      {{ trlang.you_are_the_administrator }}
      {{ trlang.please_keep_your_password_secure }}
    </a-typography-text>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_id }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="adminId" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.administrator_password }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input-password v-model:value="password" />
      </a-layout-content>
    </a-layout>
    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.confirm_administrator_password }}
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
  name: "AdminAccountPassword",
  components: { RightCircleFilled },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const adminId = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const fetchData = async () => {
      adminId.value = "Running Ball";
      password.value = "Running";
      confirmPassword.value = "@copywriter";
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      adminId,
      password,
      confirmPassword,
    };
  },
};
</script>
