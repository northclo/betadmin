<template>
  <a-collapse-panel key="8">
    <template #header>
      <a-typography-text class="text-dark-gray font-bold leading-0 fs-4">
        {{ trlang.deposit_bank_setting }}
      </a-typography-text>
    </template>

    <a-layout>
      <a-layout-sider class="bg-gray border p-2 setting-sider">
        <a-typography-text class="text-white text-center">
          {{ trlang.deposit_bank_list }}
        </a-typography-text>
      </a-layout-sider>
      <a-layout-content class="p-2">
        <div class="flex flex-column gap-2">
          <div
            v-for="(bank, index) in bankAccounts"
            :key="bank._id || `new-${index}`"
            class="flex justify-between items-center gap-2 p-2 border rounded"
          >
            <div class="flex items-center gap-2 flex-1">
              <a-button
                type="text"
                size="small"
                @click="moveUp(index)"
                :disabled="index === 0"
                :title="trlang.move_up"
              >
                <ArrowUpOutlined />
              </a-button>
              <a-button
                type="text"
                size="small"
                @click="moveDown(index)"
                :disabled="index === bankAccounts.length - 1"
                :title="trlang.move_down"
              >
                <ArrowDownOutlined />
              </a-button>
              <a-input
                v-if="editingIndex === index"
                v-model:value="editingBankName"
                class="flex-1"
                :placeholder="trlang.bank_name"
                @pressEnter="saveEdit(index)"
                @blur="saveEdit(index)"
                ref="editInputRef"
              />
              <a-typography-text
                v-else
                class="flex-1 cursor-pointer"
                @click="startEdit(index)"
              >
                {{ bank.bank_name }}
              </a-typography-text>
            </div>
            <div class="flex gap-2">
              <a-button
                v-if="editingIndex === index"
                type="primary"
                size="small"
                @click="saveEdit(index)"
              >
                {{ trlang.save }}
              </a-button>
              <a-button
                v-if="editingIndex === index"
                size="small"
                @click="cancelEdit"
              >
                {{ trlang.cancel }}
              </a-button>
              <a-button
                v-if="editingIndex !== index"
                type="primary"
                danger
                size="small"
                @click="removeBank(index)"
                :disabled="bankAccounts.length <= 1"
              >
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
          <div class="flex gap-2">
            <a-input
              v-model:value="newBankName"
              class="flex-1"
              :placeholder="trlang.bank_name"
              @pressEnter="addBank"
            />
            <a-button
              type="dashed"
              @click="addBank"
              :disabled="!newBankName || !newBankName.trim()"
            >
              {{ trlang.add_bank }}
            </a-button>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
  </a-collapse-panel>
</template>

<script setup>
import { ref, computed, inject, watch, defineExpose, nextTick } from 'vue';
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const props = defineProps({
  dataSource: { type: Object, required: true },
});

const langState = inject('langState');
const trlang = computed(() => langState?.translations || {});

const bankAccounts = ref([]);
const newBankName = ref('');
const editingIndex = ref(-1);
const editingBankName = ref('');
const editInputRef = ref(null);

const loadData = (data) => {
  if (!data || !data.bankAccounts) {
    bankAccounts.value = [];
    return;
  }
  
  bankAccounts.value = data.bankAccounts.map(bank => {
    if (typeof bank === 'string') {
      return {
        _id: null,
        bank_name: bank,
      };
    }
    return {
      _id: bank._id ? (typeof bank._id === 'string' ? bank._id : bank._id.toString()) : (bank.id ? (typeof bank.id === 'string' ? bank.id : bank.id.toString()) : null),
      bank_name: bank.bank_name || bank,
    };
  });
  
  if (bankAccounts.value.length === 0) {
    bankAccounts.value = [];
  }
};

const addBank = () => {
  const trimmedName = newBankName.value?.trim();
  if (!trimmedName) {
    message.error(trlang.value.please_input_bank_name);
    return;
  }
  
  const isDuplicate = bankAccounts.value.some(
    bank => bank.bank_name?.trim().toLowerCase() === trimmedName.toLowerCase()
  );
  
  if (isDuplicate) {
    message.error(trlang.value.bank_name_already_exists);
    return;
  }
  
  bankAccounts.value.push({
    _id: null,
    bank_name: trimmedName,
  });
  
  newBankName.value = '';
};

const removeBank = (index) => {
  if (bankAccounts.value.length > 1) {
    bankAccounts.value.splice(index, 1);
    if (editingIndex.value === index) {
      cancelEdit();
    } else if (editingIndex.value > index) {
      editingIndex.value--;
    }
  } else {
    message.error(trlang.value.at_least_one_bank_required);
  }
};

const startEdit = (index) => {
  editingIndex.value = index;
  editingBankName.value = bankAccounts.value[index].bank_name;
  nextTick(() => {
    if (editInputRef.value && editInputRef.value.length > 0) {
      editInputRef.value[0].focus();
    }
  });
};

const saveEdit = (index) => {
  if (editingIndex.value !== index) return;
  
  const trimmedName = editingBankName.value?.trim();
  if (!trimmedName) {
    message.error(trlang.value.please_input_bank_name);
    cancelEdit();
    return;
  }
  
  const isDuplicate = bankAccounts.value.some(
    (bank, idx) => idx !== index && bank.bank_name?.trim().toLowerCase() === trimmedName.toLowerCase()
  );
  
  if (isDuplicate) {
    message.error(trlang.value.bank_name_already_exists);
    cancelEdit();
    return;
  }
  
  bankAccounts.value[index].bank_name = trimmedName;
  cancelEdit();
};

const cancelEdit = () => {
  editingIndex.value = -1;
  editingBankName.value = '';
};

const moveUp = (index) => {
  if (index > 0) {
    const temp = bankAccounts.value[index];
    bankAccounts.value[index] = bankAccounts.value[index - 1];
    bankAccounts.value[index - 1] = temp;
    
    if (editingIndex.value === index) {
      editingIndex.value = index - 1;
    } else if (editingIndex.value === index - 1) {
      editingIndex.value = index;
    }
  }
};

const moveDown = (index) => {
  if (index < bankAccounts.value.length - 1) {
    const temp = bankAccounts.value[index];
    bankAccounts.value[index] = bankAccounts.value[index + 1];
    bankAccounts.value[index + 1] = temp;
    
    if (editingIndex.value === index) {
      editingIndex.value = index + 1;
    } else if (editingIndex.value === index + 1) {
      editingIndex.value = index;
    }
  }
};

watch(() => props.dataSource, loadData, { immediate: true });

defineExpose({
  getState: () => ({
    bankAccounts: bankAccounts.value
      .filter(bank => bank?.bank_name && bank.bank_name.trim() !== '')
      .map(bank => ({
        _id: bank._id,
        bank_name: bank.bank_name.trim(),
      })),
  }),
});
</script>
