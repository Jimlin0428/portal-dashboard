'use client';

import React, { useState } from 'react';
import { ExternalLink, Lock, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { ToolItem } from '@/types';
import { ToolIcon } from './ToolIcon';
import { resolveToolUrl } from '@/config/tools';

interface ToolCardProps {
  tool: ToolItem;
  isUnlocked: boolean;
  onOpenUnlockModal: (tool: ToolItem) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isUnlocked,
  onOpenUnlockModal,
}) => {
  const [loading, setLoading] = useState(false);
  const targetUrl = resolveToolUrl(tool);

  // 處理點擊「進入系統」的 SSO 換證跳轉
  const handleLaunch = async () => {
    // 1. 若為外部工具（如 LINE LIFF），不需 SSO 票券，直接在新分頁開啟
    if (tool.isExternal) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      setLoading(true);

      // 2. 向入口後端申請一次性 SSO Ticket（60 秒有效、單次使用）
      const res = await fetch('/auth/issue-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId: tool.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || '無法取得單點登入通行證');
        setLoading(false);
        return;
      }

      // 3. 取得 Ticket 後，以 window.location.href 直接導向子站核驗端點
      // 避免 window.open 在不同瀏覽器下觸發預取或探針請求導致 Ticket 被重複核銷
      const cleanBaseUrl = targetUrl.replace(/\/+$/, '');
      const ssoRedirectUrl = `${cleanBaseUrl}/api/auth/sso?ticket=${encodeURIComponent(data.ticket)}`;

      window.location.href = ssoRedirectUrl;
    } catch (err) {
      console.error('SSO Jump Error:', err);
      alert('連線失敗，請檢查網路連線或稍後再試');
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 border ${
        isUnlocked
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700'
          : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-90'
      }`}
    >
      <div>
        {/* 卡片頂部：圖示與狀態標籤 */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isUnlocked
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}
          >
            <ToolIcon name={tool.iconName} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            {tool.badge && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tool.badge}
              </span>
            )}

            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                啟用中
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                未解鎖
              </span>
            )}
          </div>
        </div>

        {/* 標題與簡介 */}
        <h3
          className={`text-lg font-bold mb-2 transition-colors ${
            isUnlocked
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-700 dark:text-slate-300'
          }`}
        >
          {tool.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {tool.description}
        </p>

        {/* 亮點標籤 */}
        {tool.highlights && (
          <div className="space-y-1.5 mb-6">
            {tool.highlights.slice(0, 2).map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
              >
                <CheckCircle
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isUnlocked
                      ? 'text-emerald-500'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 卡片底部操作按鈕 */}
      <div className="pt-2">
        {isUnlocked ? (
          <button
            type="button"
            onClick={handleLaunch}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>核發通行證中...</span>
              </>
            ) : (
              <>
                <span>進入系統</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenUnlockModal(tool)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-200/70 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition cursor-pointer"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span>立即解鎖 / 訂閱</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
};
