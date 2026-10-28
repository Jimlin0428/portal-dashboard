import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCrossDomainCookieOptions } from './cookie-options';

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * 用於伺服器端 (Server Components / Server Actions / Route Handlers) 的 Supabase 客戶端
 * 自動配合 Next.js 15 非同步 cookies API 並保留跨子網域 cookieOptions 設定
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
  const defaultCookieOptions = getCrossDomainCookieOptions();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: defaultCookieOptions,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...defaultCookieOptions,
              ...options,
            })
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
