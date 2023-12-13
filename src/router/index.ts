import { createRouter, createWebHashHistory } from 'vue-router'
import TaskManage from '../views/TaskManage.vue'
import TaskTypeManage from '../views/TaskTypeManage.vue'
import ResourceManage from '../views/ResourceManage.vue'
import ResourceTypeManage from '../views/ResourceTypeManage.vue'
import AlgorithmDocker from '../views/AlgorithmDocker.vue'
import AlgorithmImage from '../views/AlgorithmImage.vue'
import AlgorithmScheduler from '../views/AlgorithmScheduler.vue'

import Log from '../views/Log.vue'

export const routesConfig = [
    {
        path: '/',
        name: 'home',
        redirect: '/task/taskManage'
    },
    {
        path: '/task',
        name: 'task',
        meta: {
            title: '任务管理',
            icon: 'icon-task-manage'
        },
        children: [
            {
                path: '/task/taskTypeManage',
                name: 'taskTypeManage',
                component: TaskTypeManage,
                meta: {
                    title: '任务类型',
                }
            },
            {
                path: '/task/taskManage',
                name: 'taskManage',
                component: TaskManage,
                meta: {
                    title: '任务',
                }
            },
        ],
    },
    {
        path: '/resource',
        name: 'resource',
        meta: {
            title: '资源管理',
            icon: 'icon-dingjiaziyuanwei'
        },
        children: [
            {
                path: '/resource/resourceTypeManage',
                name: 'resourceTypeManage',
                component: ResourceTypeManage,
                meta: {
                    title: '资源类型',
                }
            },
            {
                path: '/resource/resourceManage',
                name: 'resourceManage',
                component: ResourceManage,
                meta: {
                    title: '资源',
                }
            },
        ],
    },
    {
        path: '/algorithm',
        name: 'algorithm',
        meta: {
            title: '算法管理',
            icon: 'icon-suanfayanshi'
        },
        children: [
            {
                path: '/algorithm/algorithmDocker',
                name: 'algorithmDocker',
                component: AlgorithmDocker,
                meta: {
                    title: '算法部署',
                }
            },
            {
                path: '/algorithm/algorithmImage',
                name: 'algorithmImage',
                component: AlgorithmImage,
                meta: {
                    title: '算法镜像',
                }
            },
            {
                path: '/algorithm/algorithmScheduler',
                name: 'algorithmScheduler',
                component: AlgorithmScheduler,
                meta: {
                    title: '调度运行',
                }
            }
        ],
    },
    {
        path: '/log',
        name: 'log',
        component: Log,
        meta: {
            title: '日志管理',
            icon: 'icon-log-manage'
        },
        children: [
            {
                path: '/log/taskLog',
                name: 'taskLog',
                component: Log,
                meta: {
                    title: '任务日志',
                }
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesConfig
})

export default router
