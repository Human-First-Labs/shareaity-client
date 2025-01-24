import axios, { type InternalAxiosRequestConfig } from "axios"
import { getSupabaseToken } from "./supabase/supabase"
import type { SocketEvent } from "./socket/types"
import type { IUser } from "./types"

const VITE_API_URL = import.meta.env.VITE_API_URL

const authToken = async () => {
    const token = await getSupabaseToken()

    if (token) {
        return 'Bearer ' + token
    } else {
        return
    }
}

export const requestInterceptor = async (config: InternalAxiosRequestConfig<unknown>) => {
    const controller = new AbortController()
    const token = await authToken()
    if (token) {
        config.headers.authorization = token
    }

    return {
        ...config,
        signal: controller.signal
    }
}

export const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    timeout: 5000
})

axiosInstance.interceptors.request.use(requestInterceptor)

const getMyUser = async (args: {
    socketId?: string
    eventId?: string
    controller?: AbortController
}) => {
    const { socketId, eventId, controller } = args
    return await axiosInstance.post<{
        user: IUser
        socketEvent: SocketEvent
    }>('/get/my-user', {
        socketId,
        eventId
    }, {
        signal: controller?.signal
    })
}

export const apiSDK = {
    getMyUser
}