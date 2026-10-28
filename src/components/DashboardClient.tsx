'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { ToolItem, CategoryFilter } from '@/types';
import { TOOLS_CONFIG, CATEGORIES } from '@/config/tools';
import { Navbar } from './Navbar';
import { ToolCard } from './ToolCard';
import { UnlockModal } from './UnlockModal';

interface DashboardClientProps {
  initialEmail?: string;
  initialAllowedTools: string[];
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  initialEmail,
  initialAllowedTools,
}) => {
  const [allowedTools, setAllowedTools] = useState<string[]>(initialAllowedTools || []);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTool, setActiveModalTool] = useState<ToolItem | null>(null);

  // 搜尋與分類過濾
  const filteredTools = useMemo(() => {
    return TOOLS_CONFIG.filter((tool) => {
      // 分類比對
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      // 搜尋關鍵字比對
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // 已解鎖統計
  const unlockedCount = useMemo(() => {
    return TOOLS_CONFIG.filter((tool) => allowedTools.includes(tool.id)).length;
  }, [allowedTools]);

  // 暫時模擬解鎖 (供測試預覽用)
  const handleTemporaryUnlock = (toolId: string) => {
    if (!allowedTools.includes(toolId)) {
      setAllowedTools((prev) => [...prev, toolId]);
    }
  };

  // 快速模擬切換：全開通 或 恢復原始
  const handleToggleAll = () => {
    if (allowedTools.length === TOOLS_CONFIG.length) {
      setAllowedTools(initialAllowedTools || []);
    } else {
      setAllowedTools(TOOLS_CONFIG.map((t) => t.id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* 頂部導航列 */}
      <Navbar
        userEmail={initialEmail}
        unlockedCount={unlockedCount}
        totalCount={TOOLS_CONFIG.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* 頁面頂部 Header 介紹與歡迎資訊 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              單一簽入 (SSO) & 跨網域授權中心
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              您的專屬訂閱工具庫
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              透過 Supabase 跨子網域 Session 共享，只要在此登入即可無縫通行旗下所有獨立子系統。
            </p>
          </div>

          {/* 開發測試快速模擬工具條 */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <button
              onClick={handleToggleAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition font-medium"
              title="快速切換體驗全解鎖或原始權限"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {allowedTools.length === TOOLS_CONFIG.length
                ? '恢復原始授權'
                : '模擬解鎖全部'}
            </button>
            {allowedTools !== initialAllowedTools && (
              <button
                onClick={() => setAllowedTools(initialAllowedTools || [])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="重設為 Supabase 原始權限"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 搜尋與分類選單列 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* 分類按鈕組 */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              全部 ({TOOLS_CONFIG.length})
            </button>
            {(Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map((catKey) => {
              const count = TOOLS_CONFIG.filter((t) => t.category === catKey).length;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === catKey
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {CATEGORIES[catKey].label} ({count})
                </button>
              );
            })}
          </div>

          {/* 搜尋輸入框 */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋工具名稱或關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* 工具卡片列表 Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Filter className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
              找不到相符的工具
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              請嘗試調整分類或搜尋關鍵字
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const isUnlocked = allowedTools.includes(tool.id);
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isUnlocked={isUnlocked}
                  onOpenUnlockModal={(t) => setActiveModalTool(t)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 解鎖 / 訂閱彈窗 */}
      <UnlockModal
        tool={activeModalTool}
        isOpen={!!activeModalTool}
        onClose={() => setActiveModalTool(null)}
        onTemporaryUnlock={handleTemporaryUnlock}
      />
    </div>
  );
};
