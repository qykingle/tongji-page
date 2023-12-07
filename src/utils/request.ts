import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const request = axios.create({
    baseURL: 'http://103.205.254.82:9999/',
})

export interface HttpOption {
    url: string
    data?: any
    method?: string
    config?: AxiosRequestConfig
}

export interface Response<T = any> {
    data: T
    message: string | null
    status: string
}

function http<T = any>(
    {url, data, method, config}: HttpOption,
) {
    const successHandler = (res: AxiosResponse<Response<T>>) => {
        if (res.data.status === 'Success' || typeof res.data === 'string')
            return res.data
        return Promise.reject(res.data)
    }

    const failHandler = (error: Response<Error>) => {
        throw new Error(error?.message || 'Error')
    }

    method = method || 'GET'

    const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

    return method === 'GET'
        ? request.get(url, {params, ...config}).then(successHandler, failHandler)
        : request.post(url, params, config).then(successHandler, failHandler)
}

export function get<T = any>(
    {url, data, method = 'GET'}: HttpOption,
): Promise<Response<T>> {
    return http<T>({
        url,
        method,
        data,
    })
}

export function post<T = any>(
    {url, data, method = 'POST'}: HttpOption,
): Promise<Response<T>> {
    return http<T>({
        url,
        method,
        data,
    })
}
