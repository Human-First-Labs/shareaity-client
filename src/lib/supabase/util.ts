import { isBrowser, createBrowserClient, createServerClient } from "@supabase/ssr"
import type { Handle, HandleFetch } from "@sveltejs/kit";

interface DataArguments {
    depends: (...deps: Array<`${string}:${string}`>) => void, 
    fetch: {
        (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
        (input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
    }
    supabaseUrl: string
    supabaseApiKey: string
    cookies: {
        name: string;
        value: string;
    }[]
}

export const layoutLoad = async (args: DataArguments) => {
    const {depends, fetch, cookies, supabaseUrl, supabaseApiKey } = args

      /**
   * Declare a dependency so the layout can be invalidated, for example, on
   * session refresh.
   */
  depends('supabase:auth')

  const supabase = isBrowser()
    ? createBrowserClient(supabaseUrl, supabaseApiKey, {
        global: {
          fetch,
        },
      })
    : createServerClient(supabaseUrl, supabaseApiKey, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return cookies
          },
        },
      })

  /**
   * It's fine to use `getSession` here, because on the client, `getSession` is
   * safe, and on the server, it reads `session` from the `LayoutData`, which
   * safely checked the session using `safeGetSession`.
   */
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { session, supabase, user }
}

export const generateSupbaseHandler = (args: {
  supabaseUrl: string
  supabaseKey: string
}) => {
  const {supabaseUrl, supabaseKey} = args

  const supabaseHandler: Handle = async ({ event, resolve }) => {
    /**
     * Creates a Supabase client specific to this server request.
     *
     * The Supabase client gets the Auth token from the request cookies.
     */
  
    event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => event.cookies.getAll(),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' })
          })
        },
      },
    })
  
    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
      const {
        data: { user },
        error,
      } = await event.locals.supabase.auth.getUser()
      if (error) {
        // JWT validation has failed
        return { session: null, user: null }
      }
  
      const {
        data: { session },
      } = await event.locals.supabase.auth.getSession()
      if (!session) {
        return { session: null, user: null }
      }
  
      return { session, user }
    }
  
    return resolve(event, {
      filterSerializedResponseHeaders(name) {
        /**
         * Supabase libraries use the `content-range` and `x-supabase-api-version`
         * headers, so we need to tell SvelteKit to pass it through.
         */
        return name === 'content-range' || name === 'x-supabase-api-version'
      },
    })
  }

  return supabaseHandler
}

export const tokenFetchHandle:HandleFetch = async ({request,fetch, event }) => {
  const { session } = await event.locals.safeGetSession()

  const newHeaders = new Headers(request.headers)

  newHeaders.append('authorization', `Bearer ${session?.access_token}`)
  if(event.locals.websocket?.connected && event.locals.websocket?.id){
    newHeaders.append('x-socket-id', event.locals.websocket.id)
  }

  const newRequest = new Request(request.url, {
    ...request,
    headers: newHeaders,
  })

  return fetch(newRequest)
}