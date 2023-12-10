<template>
  <a-layout style="min-height: 100vh;min-width: 1350px">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" >
      </div>
      <a-menu @click="handleClick" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" theme="dark"
              mode="inline">
        <a-sub-menu v-for="item in removeHomeRoutes"  :key="item.name">
          <template #title>
            <span>
               <icon-font v-if="item?.meta?.icon" :type="item?.meta?.icon"/>
              <span>{{ item?.meta?.title }}</span>
            </span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.name">
            <RouterLink :to="child.path">
              <icon-font v-if="child?.meta.icon" :type="child?.meta.icon"/>
              <span>{{ child.meta?.title }}</span>
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
  createFromIconfontCN
} from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import { routesConfig } from "@/router";

const collapsed = ref<boolean>(false);
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);

const removeHomeRoutes = routesConfig.filter(item => item.name !== 'home')

const router = useRouter()
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4366479_nwn7pbrbzjo.js',
});

watch(
    () => router.currentRoute.value,
    (value) => {
      const [_, first, second] = value.path.split('/')
      openKeys.value = [first]
      selectedKeys.value = [second]
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
  background: #1e1f22;
}

.content-header {
  font-size: 24px;
  background: #1e1f22;
  font-weight: bold;
  color: #ffffff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>

<style>
.ant-layout-sider-trigger {
  position: absolute !important;
}

.ant-layout-sider, .ant-menu-dark {
  background-color: #1e1f22 !important;
}

.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline, .ant-layout-sider-trigger {
  background-color: #26272a !important;
}

</style>
