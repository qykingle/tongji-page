<template>
  <div style="display: flex; justify-content: space-around">
    <div style="width: 45%">
      选择任务：
      <a-select
          v-model:value="taskId"
          style="width: 180px"
          @change="getTaskData"
          allow-clear
          showSearch
          mode="multiple"
          :options="taskOptions"
      >
      </a-select>
      <a-table
          :columns="taskColumns"
          :data-source="taskData"
          :loading="tableLoading"
          style="margin-top: 12px"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-button @click="() => connectResource(record)" type="link">关联资源</a-button>
          </template>
          <template v-else-if="column.dataIndex === 'attributes_values'">
            <div v-for="(value, key) in record['attributes_values']" :key="value">
              <span>{{ key }}：</span>
              <span>{{ value }}</span>
            </div>
          </template>
          <span v-else>
          {{ text }}
      </span>
        </template>
      </a-table>
    </div>
    <div style="width: 45%">
      选择资源：
      <a-select
          v-model:value="resourceId"
          style="width: 180px"
          @change="getResourceData"
          allow-clear
          showSearch
          mode="multiple"
          :options="resourceOptions"
      >
      </a-select>
      <a-table
          :columns="resourceColumns"
          :data-source="resourceData"
          :loading="resourceTableLoading"
          style="margin-top: 12px"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'action'">
            <a-button @click="()=> modifyConnectTask(record)" type="link">修改关联的任务</a-button>
          </template>
          <template v-else-if="column.dataIndex === 'attributes_values'">
            <div v-for="(value, key) in record['attributes_values']" :key="value">
              <span>{{ key }}：</span>
              <span>{{ value }}</span>
            </div>
          </template>
          <span v-else>
          {{ text }}
      </span>
        </template>
      </a-table>
    </div>
  </div>
  <a-modal ok-text="确认关联" cancel-text="取消" v-model:open="open" title="关联资源" @ok="handleOk">
    选择资源：
    <a-select
        v-model:value="selectedResourceId"
        style="width: 180px"
        @change="getResourceData"
        allow-clear
        showSearch
        :options="resourceOptions"
    >
    </a-select>
  </a-modal>
  <a-modal  cancel-text="取消" v-model:open="connectOpen" title="关联的任务" @ok="handleOk">
    <a-table
        :columns="taskColumns"
        :data-source="connectTaskData"
        :loading="connectTaskLoading"
        style="margin-top: 12px"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-popconfirm
              title="是否确认该任务的关联？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="()=> unConnect(record)"
          >
            <a-button type="link" danger>解除关联</a-button>
          </a-popconfirm>
        </template>
        <template v-else-if="column.dataIndex === 'attributes_values'">
          <div v-for="(value, key) in record['attributes_values']" :key="value">
            <span>{{ key }}：</span>
            <span>{{ value }}</span>
          </div>
        </template>
        <span v-else>
          {{ text }}
      </span>
      </template>
    </a-table>
  </a-modal>
</template>


<script lang="ts" setup>
import { resourceColumns, taskColumns } from "@/constants/constant";
import { computed, onMounted, ref } from "vue";
import { addTaskToResource, fetchAllTasks } from "@/api/task";
import { isSuccess } from "@/utils";
import { message } from "ant-design-vue";
import { cloneDeep, isEmpty } from 'lodash'
import { deleteTaskFromResource, fetchAllResources, fetchTasksByResource } from "@/api/resource";

const tableLoading = ref<boolean>(false);
const resourceTableLoading = ref<boolean>(false);
const resourceData = ref<any[]>([]);
const taskData = ref<any[]>([]);
const connectTaskData = ref<any[]>([]);
const connectTaskLoading = ref<boolean>(false);
const initTaskData = ref<any[]>([]);
const initResourceData = ref<any[]>([]);
const taskId = ref<number>();
const resourceId = ref<number>();
const selectedResourceId = ref<number>();
const selectedTaskId = ref<number>();
const open = ref<boolean>(false);
const connectOpen = ref<boolean>(false);
const modifyConnectTaskId = ref<number>();

const taskOptions = computed(() => {
  return initTaskData.value.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
})
const resourceOptions = computed(() => {
  return initResourceData.value.map(item => {
    return {
      label: item.name,
      value: item.id
    }
  })
})

const getAllTaskData = async () => {
  tableLoading.value = true;
  const result = await fetchAllTasks().catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  taskData.value = result.data
  initTaskData.value = cloneDeep(result.data)
};

const getAllResourceData = async () => {
  tableLoading.value = true;
  const result = await fetchAllResources().catch(e => e);
  tableLoading.value = false;
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败');
  }
  resourceData.value = result.data
  initResourceData.value = cloneDeep(result.data)
};

const getTaskData = (data) => {
  if (isEmpty(data)) {
    taskData.value = initTaskData.value
    return
  }
  taskData.value = initTaskData.value.filter(item => data.includes(item.id))
}

const getResourceData = (data) => {
  if (isEmpty(data)) {
    resourceData.value = initResourceData.value
    return
  }
  resourceData.value = initResourceData.value.filter(item => data.includes(item.id))
}
const handleOk = async () => {
  if (!selectedResourceId.value) return message.error('请选择资源')
  const result = await addTaskToResource({
    resource_id: selectedResourceId.value,
    task_id: selectedTaskId.value
  }).catch(e => e)
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败')
  }
  message.success('关联成功')
  open.value = false
  getAllResourceData()
}
const connectResource = ({id}) => {
  open.value = true
  selectedTaskId.value = id
}
const modifyConnectTask = async ({id}) => {
  // console.log(id)
  modifyConnectTaskId.value = id
  connectOpen.value = true
  connectTaskLoading.value = true
  const result = await fetchTasksByResource(id).catch(e => e)
  connectTaskLoading.value = false
  // console.log(result)
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败')
  }
  connectTaskData.value = result.data
}

const unConnect = async ({id})=> {
  console.log(id)
  const result = await deleteTaskFromResource({
    resource_id: modifyConnectTaskId.value,
    task_id: id
  }).catch(e => e)
  if (!isSuccess(result)) {
    return message.error(result.message || '请求失败')
  }
  message.success('解除关联成功')
  connectOpen.value = false
}

onMounted(() => {
  getAllTaskData();
  getAllResourceData();
});

</script>

<style scoped>
</style>
