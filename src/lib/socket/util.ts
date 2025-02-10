import { io } from "socket.io-client"

export const initializeClientSocket = (args: {
    apiUrl: string,
    https: boolean
}) => {
    const {apiUrl, https} = args

    const websocket = io(apiUrl, {
        withCredentials: https,
        transports: ['websocket'],
        // auth: authFunction,
        multiplex: false
    })
  
    websocket.on('connect', () => {
      console.info('Socket Connected!')
    })
  
    websocket.on('disconnect', () => {
      console.info('Socket Disconnected!')
    })

    return websocket
}