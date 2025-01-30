import { PUBLIC_API_URL } from '$env/static/public'
import type { LayoutServerLoad } from './$types'
import type { IUser } from '$lib/types'
import type { SocketEvent } from '$lib/socket/types'

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {

  const result: Response = await fetch(`${PUBLIC_API_URL}/get/my-user`)

  const parsedResult: {
    user: IUser | null,
    socketEvent: SocketEvent | null
  } = await result.json()

  return {
    user: parsedResult.user,
    socketEvent: parsedResult.socketEvent,
    //NEEDED FOR NO FLICKER
    cookies: cookies.getAll()
  }
}