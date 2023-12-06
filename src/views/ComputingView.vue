<template>
  <div class="wrapper">
    <div class="pie" ref="pieRef"></div>
    <div>
      <div class="cloud" ref="cloudRef"></div>
      <div class="net" ref="netRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from "vue";

const cloudRef = ref<HTMLElement | null>(null);
const netRef = ref<HTMLElement | null>(null);
const pieRef = ref<HTMLElement | null>(null);

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
        data: [150, 230, 224, 218, 135, 147, 260],
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
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  });
}

function drawPie() {
  const pieChart = echarts.init(pieRef.value!);
// 绘制图表
  pieChart.setOption({
    title: {
      text: '饼图数据',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          {value: 1048, name: '原来'},
          {value: 735, name: '空闲'},
          {value: 580, name: '重分配'},
        ],
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

onMounted(() => {
  drawCloud()
  drawNet()
  drawPie()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.cloud, .net {
  width: 600px;
  height: 400px;
}
.pie {
  width: 600px;
  height: 500px;
}
</style>
