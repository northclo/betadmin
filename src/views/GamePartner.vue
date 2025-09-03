<template>
  <a-layout class="bg-white p-5">
    <!-- Sticky Header -->
    <a-layout class="bg-white d-flex flex-row justify-between items-center sticky-header">
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.partner_management }}
      </a-typography-text>
    </a-layout>

    <a-layout class="bg-white pt-5 pb-5 d-flex flex-row justify-between items-center">
      <a-layout-content class="d-flex items-center gap-2">
        <a-typography-text>
          {{ trlang.id_or_nickname }}
        </a-typography-text>
        <a-input v-model:value="search" placeholder="Search..." class="search-input">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-button class="bg-gray text-white ms-2" @click="searchPartner">{{
          trlang.search
        }}</a-button>
        <a-typography-text class="ms-5 me-2">
          {{ trlang.expand_all }}
        </a-typography-text>
        <a-checkbox v-model:checked="checked"></a-checkbox>
      </a-layout-content>
      <a-layout-content class="d-flex justify-end">
        <a-button class="bg-gray text-white">
          <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white" style="overflow: auto">
      <a-layout-content class="bg-white d-flex flex-row" style="min-width: 1500px">
        <a-typography-text
          v-for="item in columns"
          :key="item.key"
          class="bg-gray text-white border text-center d-flex justify-center items-center p-2"
          :class="item.key === 'function' ? 'flex-1' : ''"
          :style="{ width: item.key === 'function' ? 'auto' : item.width }"
        >
          {{ item.label }}
        </a-typography-text>
      </a-layout-content>
      <a-layout-content
        v-for="item in dataSource"
        :key="item.key"
        class="bg-white d-flex flex-row"
        style="min-width: 1500px"
      >
        <a-typography-text
          v-for="subItem in item"
          :key="subItem.key"
          :class="[
            'border text-center justify-center d-flex p-1',
            subItem.key === 'function' ? 'flex-1 flex-wrap gap-2' : 'flex-column',
            subItem.bg_color ? 'bg-' + subItem.bg_color : '',
            subItem.key === 'money' || subItem.key === 'total_member_holdings'
              ? 'items-end'
              : 'items-center',
          ]"
          :style="{ width: subItem.key === 'function' ? 'auto' : subItem.width }"
        >
          <template v-if="subItem.key === 'function'">
            <a-button
              v-for="btnInfo in subItem.label"
              :key="btnInfo.label"
              :class="
                btnInfo.key === 'member_registration'
                  ? 'bg-green text-white'
                  : 'bg-gray text-white'
              "
              @click="btnInfo.onclick"
            >
              <UserAddOutlined v-if="btnInfo.key === 'member_registration'" />
              <CheckCircleOutlined v-else />
              {{ btnInfo.label }}
            </a-button>
          </template>
          <template v-else>
            <a-typography-text
              v-for="label in subItem.label"
              :key="label"
              :class="label.color ? 'text-' + label.color : ''"
            >
              {{ label.value }}
            </a-typography-text>
          </template>
        </a-typography-text>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import {
  SearchOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import { routeLink } from "@/utils/route-link";
import { partnerManagementColumns } from "@/utils/table-column/partner-management";
import { message } from "ant-design-vue";

export default {
  name: routeLink.site_setting.name,
  components: { SearchOutlined, CheckCircleOutlined, UserAddOutlined },
  setup() {
    const langState = inject("langState");
    const trlang = computed(() => langState.translations);

    const checked = ref(true);
    const search = ref("");
    const columns = ref([]);
    const dataSource = ref([]);

    const fetchData = () => {
      columns.value = partnerManagementColumns(trlang);

      dataSource.value = [
        [
          {
            key: "head_office",
            label: [
              {
                key: "",
                value: trlang.value.head_office,
              },
            ],
            width: "720px",
          },
          {
            key: "nickname",
            label: [
              {
                key: "",
                value: "-",
              },
            ],
            width: "90px",
          },
          {
            key: "money",
            label: [
              {
                color: "yellow",
                value: "0USD",
              },
              {
                value: "0P",
              },
            ],
            width: "80px",
          },
          { key: "benefit", label: [], width: "120px" },
          {
            key: "number_of_members",
            label: [
              {
                value: "1 person",
              },
            ],
            width: "100px",
          },
          {
            key: "total_member_holdings",
            label: [
              {
                value: "0USD",
              },
            ],
            width: "100px",
          },
          {
            key: "function",
            label: [
              { key: "full_message", label: trlang.value.full_message },
              { key: "member_registration", label: trlang.value.member_registration },
            ],
            width: "120px",
          },
        ],
        [
          {
            key: "branch_office",
            bg_color: "light-pink",
            label: [
              {
                value: "BuBonsa",
              },
              {
                color: "dark-gray",
                value: "(BuBonsa)",
              },
            ],
            width: "120px",
          },
          {
            key: "regional_office",
            label: [
              {
                color: "main",
                value: "1",
              },
            ],
            width: "120px",
          },
          {
            key: "agency",
            label: [],
            width: "120px",
          },
          {
            key: "distributor",
            label: [],
            width: "120px",
          },
          {
            key: "store",
            label: [],
            width: "120px",
          },
          {
            key: "users",
            label: [
              {
                color: "pink",
                value: 1,
              },
            ],
            width: "120px",
          },
          {
            key: "nickname",
            label: [
              {
                key: "",
                value: "BuBonsa",
              },
            ],
            width: "90px",
          },
          {
            key: "money",
            label: [
              {
                color: "yellow",
                value: "0USD",
              },
              {
                value: "0P",
              },
            ],
            width: "80px",
          },
          {
            key: "benefit",
            label: [
              {
                value: "OEUO: 3.5%",
              },
              {
                value: "Combined: 3.5%",
              },
              {
                value: "Number: 3.5%",
              },
            ],
            width: "120px",
          },
          {
            key: "number_of_members",
            label: [
              {
                value: "2 people",
              },
            ],
            width: "100px",
          },
          {
            key: "total_member_holdings",
            label: [
              {
                color: "yellow",
                value: "0USD",
              },
              {
                value: "0P",
              },
            ],
            width: "100px",
          },
          {
            key: "function",
            label: [
              { key: "setting", label: trlang.value.setting },
              {
                key: "cash_increase_decrease",
                label: trlang.value.cash_increase_decrease,
              },
              {
                key: "group_message",
                label: trlang.value.group_message,
                onclick: saveData,
              },
              { key: "delete", label: trlang.value.delete },
              { key: "add_sub", label: trlang.value.add_sub },
              { key: "member_registration", label: trlang.value.member_registration },
            ],
            width: "120px",
          },
        ],
      ];
    };

    const saveData = () => {
      message.success("message success");
    };

    const searchPartner = () => {
      message.success(search.value);
    };

    onMounted(() => {
      fetchData();
    });

    return {
      trlang,
      checked,
      search,
      searchPartner,
      columns,
      dataSource,
      saveData,
    };
  },
};
</script>
