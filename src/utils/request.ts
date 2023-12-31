import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

const request = axios.create({
    baseURL: '//81.70.164.10:8750/',
})

export interface HttpOption {
    url: string
    data?: any
    params?: any
    method?: string
    config?: AxiosRequestConfig
}

export interface Response<T = any> {
    data: T
    message: string | null
    status: string
}

function http<T = any>(
    {url, data, method, config, params}: HttpOption,
) {
    const successHandler = (res: AxiosResponse<Response<T>>) => {
        if (res.data.code === 200)
            return res.data
        return Promise.reject(res.data)
    }

    const failHandler = (error: Response<Error>) => {
        throw new Error(error?.message || 'Error')
    }

    method = method || 'GET'

    if (method === 'GET') {
        const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
        return request.get(url, {params, ...config}).then(successHandler, failHandler)
    }

    if (method === 'POST') {
        if (data) {
            return request.post(url, data, config).then(successHandler, failHandler)
        }
        if (params) {
            return request.post(url, null, {params, ...config}).then(successHandler, failHandler)
        }
    }
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
    {url, data, params, method = 'POST'}: HttpOption,
): Promise<Response<T>> {
    return http<T>({
        url,
        method,
        params,
        data,
    })
}
