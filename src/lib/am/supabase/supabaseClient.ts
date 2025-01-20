import { createClient } from '@supabase/supabase-js'

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY

export const supabase = createClient(`https://${SUPABASE_PROJECT_ID}.supabase.co`, SUPABASE_API_KEY)

export const getSupabaseToken = async () => {
    const storageKey = `sb-${SUPABASE_PROJECT_ID}-auth-token`;
    const sessionDataString = localStorage.getItem(storageKey);
    const sessionData = JSON.parse(sessionDataString || "null");
    const token = sessionData?.access_token;

    return token;
}