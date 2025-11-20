<template>
  <a-modal
    :open="open"
    :title="trlang.send_a_note"
    :ok-text="trlang.registration"
    :cancel-text="trlang.cancel"
    @ok="sendNote"
    @cancel="$emit('update:open', false)"
    :confirm-loading="loading"
  >
    <a-layout class="mt-5">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.title
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-input v-model:value="title" />
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.author
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-typography-text>{{ trlang.administrator }}</a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.recipient
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex items-center gap-2">
        <a-typography-text> {{ trlang.distributor_id }}: </a-typography-text>
        <a-typography-text> {{ dataSource.id }}: </a-typography-text>
        <a-typography-text class="text-dark-brown">
          ({{ trlang.including_subordinates }})
        </a-typography-text>
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">{{
          trlang.detail
        }}</a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <a-textarea :rows="5" v-model:value="noteMessage" allow-clear />
      </a-layout-content>
    </a-layout>

    <a-layout class="border-b">
      <a-layout-sider class="border p-2 setting-sider">
        <a-typography-text class="text-white">
          {{ trlang.expiration_period }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2 flex flex-column">
        <a-select
          ref="select"
          v-model:value="expire"
          class="w-100"
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
import { computed, defineProps, inject, onMounted, ref, watch } from 'vue';
import { postData } from '@/helpers/Axios.js';
import { apiLink } from '@/utils/api-link';
import { message } from 'ant-design-vue';

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const props = defineProps({
  open: Boolean,
  dataSource: Object,
});

const emit = defineEmits(['update:open']);

const title = ref('');
const noteMessage = ref('');
const expire = ref('');
const expireOptions = ref([]);
const loading = ref(false);

const initOption = () => {
  expireOptions.value = [
    { value: '0', label: trlang.value.no_period_set },
    { value: '1 day', label: trlang.value.one_day },
    { value: '3 days', label: trlang.value.three_days },
    { value: '1 week', label: trlang.value.a_week },
    { value: 'moon', label: trlang.value.full_moon },
    { value: '1 month', label: trlang.value.one_month },
    { value: '1 hour', label: trlang.value.one_hour },
    { value: '3 hours', label: trlang.value.three_hours },
    { value: '6 hours', label: trlang.value.six_hours },
    { value: '12 hours', label: trlang.value.twelve_hours },
    { value: '30 minutes', label: trlang.value.thirty_minutes },
    { value: '5 minutes', label: trlang.value.five_minutes },
  ];
  expire.value = '0';
};

const resetForm = () => {
  title.value = '';
  noteMessage.value = '';
  expire.value = '0';
};

onMounted(() => {
  initOption();
});

watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const sendNote = async () => {
  if (!title.value) return message.error(trlang.value.please_input_title);
  if (!noteMessage.value)
    return message.error(trlang.value.please_input_message);

  try {
    loading.value = true;
    const result = await postData(apiLink.send_partner_message, {
      id: props.dataSource.id,
      title: title.value,
      content: noteMessage.value,
      expire: expire.value,
      type: 'groupMessage',
    });

    if (result.status) {
      message.success(trlang.value.sent_successful);
      resetForm();
      emit('update:open', false);
    } else {
      message.error(result.message || trlang.value.operation_failed);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    message.error(error.message || trlang.value.operation_failed);
  } finally {
    loading.value = false;
  }
};
</script>
