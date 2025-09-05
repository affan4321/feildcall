import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase config check:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing',
  urlValid: supabaseUrl && !supabaseUrl.includes('your_supabase_project_url_here'),
  keyValid: supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_key_here')
});

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl.includes('your_supabase_project_url_here') || 
    supabaseAnonKey.includes('your_supabase_anon_key_here')) {
  console.error('Supabase configuration error:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing',
    urlValid: supabaseUrl && !supabaseUrl.includes('your_supabase_project_url_here'),
    keyValid: supabaseAnonKey && !supabaseAnonKey.includes('your_supabase_anon_key_here')
  })
  throw new Error('Supabase environment variables are missing or contain placeholder values. Please update your .env file with actual Supabase credentials.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('Supabase client initialized successfully');