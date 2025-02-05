import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_PROJECT_ID } from '$env/static/public'
import type { LayoutLoad } from './$types'
import { layoutLoad } from '$lib/supabase/util'

const PUBLIC_SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`

export const load: LayoutLoad = async ({ data, depends, fetch }) => {

  return await layoutLoad({
    cookies: data.cookies,
    depends,
    fetch,
    supabaseApiKey: PUBLIC_SUPABASE_API_KEY,
    supabaseUrl: PUBLIC_SUPABASE_URL
  })
}