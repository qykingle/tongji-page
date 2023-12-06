import { get } from "@/utils/request";

export const getDetail = (data: any) => {
    return get({
        url: '/api/detail',
        data
    })
}
