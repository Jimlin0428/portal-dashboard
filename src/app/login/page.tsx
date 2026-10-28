'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  Send,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<'password' | 'magic-link' | 'signup'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError ? '驗證逾時或登入失敗，請重新登入' : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  // 密碼登入
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || '登入失敗，請確認帳號與密碼');
        setIsLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發生未知錯誤';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  // Magic Link 登入
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (error) {
        setErrorMessage(error.message || '傳送 Magic Link 失敗');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('登入連結已寄送至您的信箱，請點擊郵件中的連結完成登入！');
      setIsLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發生未知錯誤';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  // 註冊帳號
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          data: {
            allowed_tools: ['pmba_schedule', 'line_meeting', 'compound_interest'], // 預設給予 3 項試用權限
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || '註冊失敗');
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setSuccessMessage('註冊成功！若有啟用信箱驗證，請至信箱確認開通。');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '發生未知錯誤';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* 品牌 Logo 與標題 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 mb-4">
          <LayoutGrid className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          中央訂閱工具入口
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          單一帳號通行旗下所有專業分析與學習工具
        </p>
      </div>

      {/* 登入卡片 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* 模式切換 Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('password');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'password'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            密碼登入
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('magic-link');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'magic-link'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            建立新帳號
          </button>
        </div>

        {/* 錯誤提示 */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 成功提示 */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 表單內容 */}
        <form
          onSubmit={
            mode === 'password'
              ? handlePasswordLogin
              : mode === 'magic-link'
              ? handleMagicLink
              : handleSignUp
          }
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              電子郵件 (Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {mode !== 'magic-link' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                密碼 (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md shadow-indigo-500/20 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'magic-link' ? (
              <>
                <Send className="w-4 h-4" />
                <span>寄送 Magic Link 免密碼登入</span>
              </>
            ) : mode === 'signup' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>立即註冊並進入儀表板</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>登入儀表板</span>
              </>
            )}
          </button>
        </form>

        {/* 跨網域 SSO 說明小標籤 */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            登入後會透過根網域 Cookie 授權存取所有子系統
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            載入登入介面中...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
