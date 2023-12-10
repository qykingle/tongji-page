import { createRouter, createWebHashHistory } from 'vue-router'
import TaskManage from '../views/TaskManage.vue'
import TaskTypeManage from '../views/TaskTypeManage.vue'
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
