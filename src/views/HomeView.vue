<template>
  <a-layout style="min-height: 100vh; min-width: 1860px">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <a-menu @click="handleClick" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark"
              mode="inline">
        <a-sub-menu key="biz">
          <template #title>
            <span>
              <AppstoreOutlined/>
              <span>业务类型</span>
            </span>
          </template>
          <a-menu-item key="computing">
            <RouterLink to="/computing">
              <AreaChartOutlined/>
              <span>重算力型</span>
            </RouterLink>
          </a-menu-item>
          <a-menu-item key="delay">
            <RouterLink to="/delay">
              <FieldTimeOutlined/>
              <span>时延敏感型</span>
            </RouterLink>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="log-manage">
          <template #title>
            <span>
              <DatabaseOutlined/>
              <span>日志管理</span>
            </span>
          </template>
          <a-menu-item key="log">
            <RouterLink to="/log">
              <CloudServerOutlined/>
              <span>调度日志</span>
            </RouterLink>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="content-header">云网融合资源编排调度</a-layout-header>
      <a-layout-content style="margin:16px">
        <RouterView/>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        ©2023 Created by Tongji
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router'
import {
  FieldTimeOutlined,
  AppstoreOutlined,
  AreaChartOutlined,
  DatabaseOutlined,
  CloudServerOutlined
} from '@ant-design/icons-vue';
import { ref, watch } from 'vue';

const collapsed = ref<boolean>(false);
const openKeys = ref<string[]>(['biz']);
const selectedKeys = ref<string[]>(['computing']);

const router = useRouter()

watch(
    () => router.currentRoute.value.name,
    (value) => {
      console.log(value)
      if (value === 'computing' || value === 'delay') {
        openKeys.value = ['biz']
      } else {
        openKeys.value = ['log-manage']
      }
      selectedKeys.value = [value]
    },
    {immediate: true},
)

function handleClick(info) {
  console.log(info)
}
</script>
<style scoped>
.logo {
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  text-align: center;
}

.site-layout .site-layout-background {
  background: #fff;
}

.content-header {
  font-size: 24px;
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>

<style>
.ant-layout-sider-trigger {
  position: absolute !important;
}
</style>
