'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutGrid, CheckCircle2, User, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface NavbarProps {
  userEmail?: string;
  unlockedCount: number;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  userEmail,
  unlockedCount,
  totalCount,
}) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('登出失敗:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const percentage = Math.round((unlockedCount / totalCount) * 100) || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo 與主標題 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              中央訂閱工具入口
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Central Dashboard & Tools Hub
            </p>
          </div>
        </div>

        {/* 右側資訊區塊 */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* 已解鎖數量統計徽章 */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <span>已解鎖</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {unlockedCount}
              </span>
              <span className="text-slate-400">/</span>
              <span>{totalCount}</span>
            </div>
            {/* 圓形或微型進度條 */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden hidden md:block">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* 使用者 Email */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="max-w-[160px] truncate font-medium">
              {userEmail || '使用者'}
            </span>
          </div>

          {/* 登出按鈕 */}
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition"
            title="登出帳號"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">登出</span>
          </button>
        </div>
      </div>
    </header>
  );
};
