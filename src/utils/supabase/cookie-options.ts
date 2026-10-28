import { CookieOptions } from '@supabase/ssr';

/**
 * 取得跨子網域共享 Session 用的 Cookie 設定
 * 當 NEXT_PUBLIC_ROOT_DOMAIN 設定為 yourdomain.com 時，
 * cookie domain 會設定為 .yourdomain.com，使所有子網域均可讀取該認證 Cookie。
 * 若在本地 (localhost) 開發，則自動略過 domain 設定避免瀏覽器阻擋。
 */
export function getCrossDomainCookieOptions(): CookieOptions {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim();
  const isProd = process.env.NODE_ENV === 'production';

  // 判斷是否為真實網域（非 localhost 或 127.0.0.1）
  const hasValidDomain =
    rootDomain &&
    !rootDomain.includes('localhost') &&
    !rootDomain.includes('127.0.0.1');

  const domain = hasValidDomain
    ? `.${rootDomain.replace(/^\./, '')}`
    : undefined;

  return {
    domain,
    path: '/',
    sameSite: 'lax',
    secure: isProd,
    maxAge: 60 * 60 * 24 * 30, // 30 天持久化
  };
}
