<template>
  <a-modal
    :open="open"
    :title="trlang.send_a_note"
    :ok-text="trlang.registration"
    :cancel-text="trlang.cancel"
    @ok="sendNote"
    @cancel="$emit('update:open', false)"
  >
    <a-layout class="bg-white mt-5">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{ trlang.title }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-input v-model:value="title" />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{ trlang.author }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-typography-text>{{ trlang.administrator }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{ trlang.recipient }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex items-center gap-2">
        <a-typography-text> {{ trlang.distributor_id }}: </a-typography-text>
        <a-typography-text> {{ dataSource.id }}: </a-typography-text>
        <a-typography-text class="text-dark-brown">
          ({{ trlang.including_subordinates }})
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">{{ trlang.detail }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2">
        <a-textarea :rows="5" v-model:value="noteMessage" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="bg-white">
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.expiration_period }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="border p-2 flex flex-column">
        <a-select
          ref="select"
          v-model:value="expire"
          class="input-lg"
          :options="expireOptions"
        />
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
import { computed, defineProps, inject, onMounted, ref } from "vue";
import { postData } from "@/helpers/Axios.js";
import { apiLink } from "@/utils/api-link";
import { message } from "ant-design-vue";

/* Translations */
const langState = inject("langState");
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
});

const emit = defineEmits(["update:open"]);

const title = ref("");
const noteMessage = ref("");
const expire = ref("");
const expireOptions = ref([]);

const initOption = () => {
  expireOptions.value = [
    { value: "0", label: "::No period set::" },
    { value: "1 day", label: "1 day" },
    { value: "3 days", label: "3 days" },
    { value: "a week", label: "a week" },
    { value: "full moon", label: "full moon" },
    { value: "month", label: "month" },
    { value: "1 hour", label: "1 hour" },
    { value: "3 hours", label: "3 hours" },
    { value: "6 hours", label: "6 hours" },
    { value: "12 hours", label: "12 hours" },
    { value: "30 minutes", label: "30 minutes" },
    { value: "5 minutes", label: "5 minutes" },
  ];
  expire.value = "::No period set::";
};

onMounted(() => {
  initOption();
});

const sendNote = async () => {
  console.log("dataSource.value :>> ", props.dataSource.value);
  if (!title.value) return message.error(trlang.value.please_input_title);
  if (!noteMessage.value) return message.error(trlang.value.please_input_message);

  const result = await postData(apiLink.send_partner_message, {
    title: title.value,
    message: message.value,
    expire: expire.value,
    type: "note",
    // receiver: dataSource.value
  });

  if (result.status) {
    message.success(trlang.value.sent_successful);
    emit("update:open", false);
  }
};
</script>
