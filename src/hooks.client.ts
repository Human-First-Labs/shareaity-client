import { PUBLIC_API_URL, PUBLIC_APP_ENV } from "$env/static/public";
import type { ServerInit, Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { Socket, io } from "socket.io-client";

const HTTPS_ONLY = PUBLIC_APP_ENV === 'local'

let websocket: Socket

export const init: ServerInit = () => {
  websocket = io(PUBLIC_API_URL, {
      withCredentials: HTTPS_ONLY,
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
};

const socket:Handle = ({ event, resolve }) => {
  event.locals.websocket = websocket

  return resolve(event)
}

export const handle: Handle = sequence(socket)