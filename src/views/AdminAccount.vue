<template>
  <a-layout class="bg-white pt-5 pb-5">
    <a-layout class="bg-white d-flex flex-row justify-between items-center px-5">
      <a-typography-text class="text-dark-grey fs-1">
        {{ trlang.change_administrator_information }}
      </a-typography-text>
      <a-button class="bg-main text-white">{{ trlang.save }}</a-button>
    </a-layout>

    <a-layout class="bg-white px-5">
      <AdminAccountPassword />
      <AdminAccountViewPassword />
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject } from "vue";
import { routeLink } from "@/utils/route-link";
import AdminAccountPassword from "@/components/admin-account/Password.vue";
import AdminAccountViewPassword from "@/components/admin-account/ViewPassword.vue";

export default {
  name: routeLink.admin_account.name,
  components: { AdminAccountPassword, AdminAccountViewPassword },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    return { trlang };
  },
};
</script>
