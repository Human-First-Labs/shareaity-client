import { isBrowser, createBrowserClient, createServerClient } from "@supabase/ssr"


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