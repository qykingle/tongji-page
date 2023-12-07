import { get } from "@/utils/request";

export const getComputeTask = () => {
    return get({
        url: '/task/compute',
        data: {
            type: 1
        }
    })
}
export const getNetWorkTask = () => {
    return get({
        url: '/task/network',
        data: {}
    })
}


export const getLog = () => {
    return get({
        url: '/log/all',
        data: {}
    })
}

export const getNetWorkInfo = () => {
    return get({
        url: '/network/info',
        data: {}
    })
}
export const getNetWorkScheduler = () => {
    return get({
        url: '/network/scheduler',
        data: {}
    })
}
export const getNodeInfo = () => {
    return get({
        url: '/node/info',
        data: {}
    })
}

export const schedulerRun = () => {
    return get({
        url: '/scheduler/run',
        data: {}
    })
}
