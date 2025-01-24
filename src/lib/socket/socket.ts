import { io } from "socket.io-client"

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL
const VITE_DEVELOPMENT = import.meta.env.VITE_APP_ENV !== 'production'

export const socket = io(VITE_BASE_URL, {
    autoConnect: false,
    withCredentials: !VITE_DEVELOPMENT,
    transports: ['websocket'],
    // auth: authFunction,
    multiplex: false
})