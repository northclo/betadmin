<template>
  <a-layout class="bg-white pt-5 pb-5">
    <a-layout
      class="bg-white d-flex flex-row justify-between items-center px-5 sticky-header"
    >
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.partner_registration }}
      </a-typography-text>
    </a-layout>
  </a-layout>

  <a-collapse class="bg-white px-5 border-0">
    <PartnerMemberInformation
      v-if="dataSource"
      :dataSource="dataSource"
      ref="memberInformationRef"
    />
    <CurrencyRollingSetting />
    <PartnerRateSetting />
    <PartnerPermissionSetting />
    <PartnerGameSetting />
  </a-collapse>

  <a-layout class="bg-white p-5 d-flex flex-row justify-center items-center gap-2">
    <a-button class="bg-dark-gray text-white">
      <CheckCircleOutlined />
      {{ trlang.register }}
    </a-button>
    <a-button class="bg-dark-gray text-white" @click="closeRegister">
      <CloseCircleOutlined />
      {{ trlang.close }}
    </a-button>
  </a-layout>
</template>

<script>
import { computed, inject, ref } from "vue";
import { routeLink } from "@/utils/route-link";
import { useRouter } from "vue-router";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import PartnerMemberInformation from "@/components/partner/registration/PartnerMemberInformation.vue";
import CurrencyRollingSetting from "@/components/partner/registration/CurrencyRollingSetting.vue";
import PartnerRateSetting from "@/components/partner/registration/PartnerRateSetting.vue";
import PartnerPermissionSetting from "@/components/partner/registration/PartnerPermissionSetting.vue";
import PartnerGameSetting from "@/components/partner/registration/PartnerGameSetting.vue";

export default {
  name: routeLink.game_partner_add_branch.name,
  components: {
    PartnerMemberInformation,
    CurrencyRollingSetting,
    PartnerRateSetting,
    PartnerPermissionSetting,
    PartnerGameSetting,
    CheckCircleOutlined,
    CloseCircleOutlined,
  },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const router = useRouter();

    const dataSource = ref([]);
    const memberInformationRef = ref(null);

    const closeRegister = () => {
      router.push(routeLink.game_partner.link);
    };

    return { trlang, dataSource, closeRegister, memberInformationRef };
  },
};
</script>
