import { type Handle, type HandleFetch,  } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_API_KEY, PUBLIC_SUPABASE_PROJECT_ID } from '$env/static/public'
import { generateSupbaseHandler, tokenFetchHandle } from '$lib/supabase/util'

const PUBLIC_SUPABASE_URL = `https://${PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`

const supabase = generateSupbaseHandler({
    supabaseKey:PUBLIC_SUPABASE_API_KEY,
    supabaseUrl: PUBLIC_SUPABASE_URL
})

export const handle: Handle = sequence(supabase)

export const handleFetch:HandleFetch = tokenFetchHandle