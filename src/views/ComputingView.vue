<template>
  <div style="text-align: center">
    <a-button :loading="buttonLoading" @click="() => beginScheduler(true)" type="primary">开始调度</a-button>
  </div>
  <div class="wrapper">
    <div>
      <h2>任务列表</h2>
      <a-table
          :columns="taskColumns"
          :data-source="taskData"
          :loading="loading"
          style="width: 800px"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'type'">{{ TASK_TYPE[text] }}</template>
          <template v-if="column.dataIndex === 'status'">
            <a-tag v-if="text === 0" color="default">
              {{ TASK_STATUS[text] }}
            </a-tag>
            <a-tag v-if="text === 1" color="success">
              {{ TASK_STATUS[text] }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </div>
    <a-divider style="height: 660px; margin: 0 30px" type="vertical"/>
    <div>
      <h2>调度列表</h2>
      <a-table
          style="width: 800px"
          :columns="schedulerColumns"
          :data-source="schedulerData"
          :loading="buttonLoading"
      >
        <template #bodyCell="{ column,record }">
          <template v-if="column.dataIndex === 'action' && record.taskList?.length">
            <a-button @click="() => showDrawer(record)" type="link">查看详情</a-button>
          </template>
          <template v-if="column.dataIndex === 'cpu_usage' || column.dataIndex === 'mem_usage'">
            <a-progress :percent="getPercent(record.nodePo?.[column.dataIndex])"/>
          </template>
          <span v-else>
          {{ record.nodePo?.[column.dataIndex] }}
        </span>
        </template>
      </a-table>
    </div>
  </div>
  <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="root-class-name"
      title="详情"
      placement="right"
      @after-open-change="afterOpenChange"
  >
    <h2>关联的任务列表</h2>
    <a-table
        :columns="taskColumns"
        :data-source="drawTaskData"
        style="width: 100%"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'type'">{{ TASK_TYPE[text] }}</template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="text === 0" color="default">
            {{ TASK_STATUS[text] }}
          </a-tag>
          <a-tag v-if="text === 1" color="success">
            {{ TASK_STATUS[text] }}
          </a-tag>
        </template>
      </template>
    </a-table>
    <h2>调度资源变化情况</h2>
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap">
      <div class="pie" ref="pieCpuRef"></div>
      <div class="pie" ref="pieMemRef"></div>
    </div>
  </a-drawer>
  <div style="display: flex; justify-content: space-around; margin-top: 20px">
    <div class="cloud" ref="cloudRef"></div>
    <div class="net" ref="netRef"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { nextTick, onMounted, ref } from "vue";
import { getComputeTask, getNetWorkScheduler, getNodeInfo, schedulerRun } from "@/api/api";
import { isSuccess } from "@/utils";
import { message } from 'ant-design-vue';
import { TASK_STATUS, TASK_TYPE, taskColumns, schedulerColumns } from "@/constants";


const [messageApi] = message.useMessage();

const loading = ref(false)
const buttonLoading = ref(false)
const cloudRef = ref<HTMLElement | null>(null);
const netRef = ref<HTMLElement | null>(null);
const pieCpuRef = ref<HTMLElement | null>(null);
const pieMemRef = ref<HTMLElement | null>(null);
const taskData = ref([])
const schedulerData = ref([])
const drawTaskData = ref([])
const open = ref(false)
const pieList = ref<HTMLElement | null>(null);

const pieCpuData = ref([])
const pieMemData = ref([])


onMounted(() => {
  getTask()
  beginScheduler(false)
  drawCloud()
  drawNet()
  // drawPie()
})

const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};

const showDrawer = (record) => {
  console.log(schedulerData.value)
  open.value = true;
  nextTick(() => {

    const {cpu_usage, mem_usage} = record.nodePo
    const cpuInit = Math.floor(cpu_usage * 100)
    const cpuRemain = (100 - cpuInit) / 2
    const memInit = Math.floor(mem_usage * 100)
    const memRemain = (100 - cpuInit) / 2
    drawPie(pieCpuRef.value, 'CPU使用率', [{value: cpuInit, name: '原来'}, {value: cpuRemain, name: '空闲'}, {value: cpuRemain, name: '重分配'}])
    drawPie(pieMemRef.value, '内存使用率', [{value: memInit, name: '原来'}, {value: memRemain, name: '空闲'}, {value: memRemain, name: '重分配'}])
    drawTaskData.value = record.taskList
  });
}

const getPercent = (percent) => {
  return Math.floor(percent * 100)
}


const getTask = async () => {
  loading.value = true
  const result = await getComputeTask().catch(e => e)
  loading.value = false
  if (!isSuccess(result)) {
    return messageApi.error(result.message || '请求失败')
  }
  console.log(result.data)
  taskData.value = result.data
}

const beginScheduler = async (isClick = false) => {
  buttonLoading.value = true
  const result = isClick ? await schedulerRun().catch(e => e) : await getNodeInfo().catch(e => e)
  buttonLoading.value = false
  if (!isSuccess(result)) {
    return messageApi.error(result.message || '请求失败')
  }
  console.log(result.data)
  schedulerData.value = result.data
  // pieCpuData.value = result.data.map(item => {
  //   return {
  //     value: item.nodePo?.cpu_usage,
  //     name: item.nodePo?.info
  //   }
  // })
  // pieMemData.value = result.data.map(item => {
  //   return {
  //     value: item.nodePo?.mem_usage,
  //     name: item.nodePo?.info
  //   }
  // })
}

function drawCloud() {
  const cloudChart = echarts.init(cloudRef.value!);
// 绘制图表
  cloudChart.setOption({
    title: {
      text: '云资源状态图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [50, 30, 24, 18, 65, 47, 96],
        type: 'line'
      }
    ]
  });
}

function drawNet() {
  const netChart = echarts.init(netRef.value!);
// 绘制图表
  netChart.setOption({
    title: {
      text: '网络资源状态图',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [15, 23, 24, 28, 95, 47, 60],
        type: 'line'
      }
    ]
  });
}

function drawPie(outRef, title, data) {
  const pieChart = echarts.init(outRef);
// 绘制图表
  pieChart.setOption({
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false
    },

    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '50%',
        data,
        label: {
          formatter: '{b} ({d}%)', // 显示饼图上的标签，包括名称和百分比
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
}

</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.cloud, .net {
  width: 600px;
  height: 400px;
}

.pie {
  width: 480px;
  height: 400px;
}
</style>

<style>
.ant-drawer-content-wrapper {
  width: 1100px !important;
}
</style>
