'use client';

import React from 'react';
import { Lock, Sparkles, CheckCircle2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { ToolItem } from '@/types';
import { ToolIcon } from './ToolIcon';
import { resolveToolUrl } from '@/config/tools';

interface UnlockModalProps {
  tool: ToolItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTemporaryUnlock?: (toolId: string) => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  tool,
  isOpen,
  onClose,
  onTemporaryUnlock,
}) => {
  if (!isOpen || !tool) return null;

  const targetUrl = resolveToolUrl(tool);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* 背景光暈裝飾 */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="關閉"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 頂部圖示與標題 */}
        <div className="flex items-start gap-4 mb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 shrink-0">
            <ToolIcon name={tool.iconName} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {tool.title}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                <Lock className="w-3 h-3" />
                未解鎖
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono break-all">
              目標位址: {targetUrl}
            </p>
          </div>
        </div>

        {/* 工具詳細介紹 */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {tool.description}
        </p>

        {/* 核心亮點 */}
        {tool.highlights && tool.highlights.length > 0 && (
          <div className="mb-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              解鎖後可享特權
            </h4>
            <ul className="space-y-2">
              {tool.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 訂閱說明提示 */}
        <div className="p-3.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-700 dark:text-indigo-300 mb-6 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
          <span>
            此工具屬於指定授權工具。若您已購買該方案，管理員會在 Supabase
            資料庫的 <code className="font-mono bg-indigo-100 dark:bg-indigo-900/60 px-1 py-0.5 rounded">user_metadata.allowed_tools</code> 為您開通。
          </span>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`mailto:service@yourdomain.com?subject=${encodeURIComponent(
              `申請開通工具權限: ${tool.title} (${tool.id})`
            )}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            聯絡管理員開通訂閱
          </a>

          {onTemporaryUnlock && (
            <button
              onClick={() => {
                onTemporaryUnlock(tool.id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="僅在本次瀏覽中模擬開通以預覽介面"
            >
              模擬即時開通 (預覽測試)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
