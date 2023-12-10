<template>
  <a-table
      :columns="logColumns"
      :data-source="logData"
      :loading="loading"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'timestmp'">
        {{ new Date(text).toLocaleString() }}
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { logColumns } from "@/constants";
import { onMounted, ref } from "vue";
import { getLog } from "@/api/api";
import { isSuccess } from "@/utils";
import { message } from 'ant-design-vue';

const [messageApi] = message.useMessage();
const loading = ref(false)

const logData = ref([])
onMounted(() => {
  getLogInfo()
})

async function getLogInfo() {
  loading.value = true
  const result = await getLog().catch(e => e)
  loading.value = false
  if (!isSuccess(result)) {
    return messageApi.error(result.message || '请求失败')
  }
  logData.value = result.data
}
</script>
