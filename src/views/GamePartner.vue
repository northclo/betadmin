<template>
  <a-layout class="bg-white p-5">
    <!-- Sticky Header -->
    <a-layout class="bg-white d-flex flex-row justify-between items-center sticky-header">
      <a-typography-text class="text-dark-gray fs-1">
        {{ trlang.partner_management }}
      </a-typography-text>
    </a-layout>

    <!-- Search and Actions -->
    <a-layout class="bg-white pt-5 pb-5 d-flex flex-row justify-between items-center">
      <a-layout-content class="d-flex items-center gap-2">
        <a-typography-text>{{ trlang.id_or_nickname }}</a-typography-text>
        <a-input v-model:value="search" placeholder="Search..." class="search-input">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-button class="bg-gray text-white ms-2" @click="searchPartner">
          {{ trlang.search }}
        </a-button>
        <a-typography-text class="ms-5 me-2">{{ trlang.expand_all }}</a-typography-text>
        <a-checkbox v-model:checked="checked"></a-checkbox>
      </a-layout-content>
      <a-layout-content class="d-flex justify-end">
        <a-button class="bg-gray text-white" @click="registerGamePartner">
          <CheckCircleOutlined />{{ trlang.add_a_branch_office }}
        </a-button>
      </a-layout-content>
    </a-layout>

    <!-- Table -->
    <a-layout class="bg-white" style="overflow: auto">
      <!-- Table Header -->
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

      <!-- Table Rows -->
      <a-layout-content
        v-for="(row, rowIndex) in dataSource"
        :key="rowIndex"
        class="bg-white d-flex flex-row"
        style="min-width: 1500px"
      >
        <a-typography-text
          v-for="subItem in row"
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
          <!-- Function Buttons -->
          <template v-if="subItem.key === 'function'">
            <a-button
              v-for="btnInfo in subItem.label"
              :key="btnInfo.key"
              :class="
                btnInfo.key === 'member_registration'
                  ? 'bg-green text-white'
                  : 'bg-gray text-white'
              "
              @click="btnInfo.onclick || (() => {})"
            >
              <UserAddOutlined v-if="btnInfo.key === 'member_registration'" />
              <CheckCircleOutlined v-else />
              {{ btnInfo.label }}
            </a-button>
          </template>

          <!-- Benefit Column -->
          <template v-else-if="subItem.key === 'benefit'">
            <span v-for="(labelPiece, index) in subItem.label" :key="index">
              <span class="text-dark-gray">{{ trlang[labelPiece.key] }}: </span>
              <span class="text-yellow">{{ labelPiece.value }}</span>
              <span v-if="index !== subItem.label.length - 1">&nbsp;</span>
            </span>
          </template>

          <!-- Other Columns -->
          <template v-else>
            <a-typography-text
              v-for="label in subItem.label"
              :key="label.value"
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

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import {
  SearchOutlined,
  CheckCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { partnerManagementColumns } from "@/utils/table-column/partner-management";
import { useRouter } from "vue-router";
import { routeLink } from "../utils/route-link";
import { getData } from "@/helpers/Axios.js";
import { apiLink } from "../utils/api-link";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const router = useRouter();

/* Reactive states */
const checked = ref(true);
const search = ref("");
const columns = ref([]);
const dataSource = ref([]);

/* Fetch columns and table data */
const fetchData = async () => {
  const gamePartner = await getData(apiLink.game_partner + "?search=" + search.value);
  columns.value = partnerManagementColumns(trlang);

  let _dataSource = [];

  // First row
  _dataSource.push([
    { key: "head_office", label: [{ value: trlang.value.head_office }], width: "720px" },
    { key: "nickname", label: [{ value: "-" }], width: "90px" },
    {
      key: "money",
      label: [{ value: "0USD", color: "yellow" }, { value: "0P" }],
      width: "80px",
    },
    { key: "benefit", label: [], width: "120px" },
    { key: "number_of_members", label: [{ value: "1 person" }], width: "100px" },
    { key: "total_member_holdings", label: [{ value: "0USD" }], width: "100px" },
    {
      key: "function",
      label: [
        { key: "full_message", label: trlang.value.full_message },
        { key: "member_registration", label: trlang.value.member_registration },
      ],
      width: "120px",
    },
  ]);

  // Branch offices
  gamePartner.data.forEach((element) => {
    if (element.type === "branch_office") {
      let _money = element.money.map((m) => ({
        value: m.amount + m.type,
        color: m.type === "USD" ? "yellow" : "",
      }));

      let _holding = element.holding.map((h) => ({
        value: h.amount + h.type,
        color: h.type === "USD" ? "yellow" : "",
      }));

      _dataSource.push([
        {
          key: "branch_office",
          bg_color: "light-pink",
          label: [
            { value: element.nickname },
            { value: `(${element.partnerId})`, color: "dark-gray" },
          ],
          width: "120px",
        },
        {
          key: "regional_office",
          label: element.sub.length ? [{ value: element.sub.length, color: "main" }] : [],
          width: "120px",
        },
        { key: "agency", label: [], width: "120px" },
        { key: "distributor", label: [], width: "120px" },
        { key: "store", label: [], width: "120px" },
        {
          key: "users",
          label: element.member.length
            ? [{ value: element.member.length, color: "pink" }]
            : [],
          width: "120px",
        },
        { key: "nickname", label: [{ value: element.nickname }], width: "90px" },
        { key: "money", label: _money, width: "80px" },
        {
          key: "benefit",
          label: [
            { key: "oeuo", value: element.benefit.oeuo + "%" },
            { key: "combined", value: element.benefit.combined + "%" },
            { key: "number", value: element.benefit.number + "%" },
          ],
          width: "120px",
        },
        {
          key: "number_of_members",
          label: element.member.length
            ? [
                {
                  value:
                    element.member.length === 1
                      ? "1 person"
                      : element.member.length + " people",
                },
              ]
            : [],
          width: "100px",
        },
        { key: "total_member_holdings", label: _holding, width: "100px" },
        {
          key: "function",
          label: [
            { key: "setting", label: trlang.value.setting },
            { key: "cash_increase_decrease", label: trlang.value.cash_increase_decrease },
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
      ]);
    }
  });

  dataSource.value = _dataSource;
};

/* Actions */
const saveData = () => message.success("message success");
const searchPartner = () => fetchData();
const registerGamePartner = () => router.push(routeLink.game_partner_add_branch.link);

/* Load data on mount */
onMounted(() => fetchData());
</script>
