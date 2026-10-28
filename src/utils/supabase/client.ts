import { createBrowserClient } from '@supabase/ssr';
import { getCrossDomainCookieOptions } from './cookie-options';

/**
 * 用於瀏覽器端 (Client Components) 的 Supabase 客戶端
 * 預設注入跨子網域 cookieOptions
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: getCrossDomainCookieOptions(),
  });
}
