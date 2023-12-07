export const TASK_TYPE = {
    1: '计算型',
    2: '时延型',
    0: '其他'
}

export const TASK_STATUS = {
    0: '未分配',
    1: '已分配',
}
export const taskColumns = [
    {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '任务类型',
        dataIndex: 'type',
        key: 'type',
    },

    {
        title: '任务名称',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '内存使用',
        dataIndex: 'mem_usage',
        key: 'mem_usage',
    },
]

export const schedulerColumns = [
    {
        title: '节点ID',
        dataIndex: 'id',
        key: 'id',
    },

    {
        title: '节点名称',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: 'cpu使用率',
        dataIndex: 'cpu_usage',
        key: 'cpu_usage',
    },
    {
        title: '内存使用率',
        dataIndex: 'mem_usage',
        key: 'mem_usage',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

export const newWorkTaskColumns = [
    {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '任务类型',
        dataIndex: 'type',
        key: 'type',
    },

    {
        title: '任务名称',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '延迟（ms）',
        dataIndex: 'latency',
        key: 'latency',
    },
]
export const netWorkSchedulerColumns = [
    {
        title: '节点ID',
        dataIndex: 'id',
        key: 'id',
    },

    {
        title: '节点名称',
        dataIndex: 'info',
        key: 'info',
    },
    {
        title: '延迟（ms）',
        dataIndex: 'latency',
        key: 'latency',
    },
    {
        title: '带宽（M）',
        dataIndex: 'bandwidth',
        key: 'bandwidth',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
    }
]

export const logColumns = [
    {
        title: '时间',
        dataIndex: 'timestmp',
        key: 'timestmp'
    },

    {
        title: '动作',
        dataIndex: 'formatted_message',
        key: 'formatted_message',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'level_string',
        key: 'level_string'
    }
]
