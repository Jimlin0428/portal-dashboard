import { ToolCategory, ToolItem } from '@/types';

export const CATEGORIES: Record<ToolCategory, { label: string; description: string }> = {
  business: {
    label: '商務 / 課業',
    description: '專為 PMBA 學習、時程排程與跨團隊溝通打造的高效工具',
  },
  finance: {
    label: '財務工具',
    description: '個人資產規劃、複利滾存模型與多信用卡智能記帳解析',
  },
  lifestyle: {
    label: '生活 / 個人',
    description: '東方命盤結構分析、家庭關係圖譜與個人知識管理',
  },
};

/**
 * 根網域取得工具，支援從環境變數 NEXT_PUBLIC_ROOT_DOMAIN 讀取
 */
export const getRootDomain = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_ROOT_DOMAIN || window.location.hostname;
  }
  return process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'yourdomain.com';
};

/**
 * 解析工具對應之實際目標 URL
 */
export const resolveToolUrl = (tool: ToolItem): string => {
  // 1. 若已經有完整的 url，直接回傳，不要在前面補 https://
  if (tool.url) {
    // 防呆：如果開頭已經有 http:// 或 https://，直接回傳；沒有才補
    return tool.url.startsWith('http://') || tool.url.startsWith('https://')
      ? tool.url
      : `https://${tool.url}`;
  }

  // 2. 本地開發環境
  const rootDomain = getRootDomain();
  if (rootDomain.includes('localhost')) {
    return `http://${tool.subdomain || tool.id}.localhost:3000`;
  }

  // 3. 備用子網域拼接
  return `https://${tool.subdomain || tool.id}.${rootDomain}`;
};

export const TOOLS_CONFIG: ToolItem[] = [
  {
    id: 'pmba_schedule',
    title: 'PM 課表',
    description: '臺大 PMBA 課程進度、考試日程與學分時程規劃助手，精準掌握修課進度。',
    category: 'business',
    url: 'https://ntu-pmba-schedule.vercel.app',
    subdomain: 'pmba-schedule',
    isExternal: true, // 改為 true：直接開新分頁進入首頁，不走 SSO Ticket
    iconName: 'CalendarCheck',
    badge: '熱門',
    highlights: ['課堂時程即時同步', '必修與選修學分檢視', 'Google 行事曆匯入支援'],
  },
  {
    id: 'line_meeting',
    title: '會議邀請小工具',
    description: 'LINE 快速發布會議與確認回覆，免去繁瑣的統計投票流程，一鍵預約發布。',
    category: 'business',
    url: 'https://liff.line.me/2012229137-FJRHw4yj?prompt=consent',
    isExternal: true,
    iconName: 'Users',
    badge: 'LINE LIFF',
    highlights: ['LIFF 原生整合', '快速統計回覆率', '免裝額外 App 直接開啟'],
  },
  {
    id: 'compound_interest',
    title: '複利投資模擬器',
    description: '專業資產配置與複利回測試算工具，視覺化展示本金與長期複利增長趨勢。',
    category: 'finance',
    url: 'https://compound-interest-tools.vercel.app',
    subdomain: 'compound',
    isExternal: false, // 走 SSO Ticket
    iconName: 'TrendingUp',
    badge: '投資理財',
    highlights: ['動態定期定額試算', '通膨率與報酬率模擬', '長線報酬圖表輸出'],
  },
  {
    id: 'vault_bill',
    title: 'VaultBill 信用卡帳單分析',
    description: '多銀行帳單解析、消費類別自動歸納與視覺化圖表，打造清晰的個人金流藍圖。',
    category: 'finance',
    url: 'https://vault-bill.vercel.app',
    subdomain: 'vaultbill',
    isExternal: false, // 走 SSO Ticket
    iconName: 'CreditCard',
    badge: '隱私保護',
    highlights: ['多銀行 PDF 電子帳單解析', '消費結構熱力圖分析', '本地解析隱私無憂'],
  },
  {
    id: 'digital_garden',
    title: 'PMBA 核心專業選修知識庫',
    description: '產業分析、個案研究與高階經理人數位筆記花園，累積跨領域知識複利。',
    category: 'lifestyle',
    url: 'https://my-digital-garden.vercel.app', // 改為對外公開的正式網址
    subdomain: 'garden',
    isExternal: true, // 知識庫若為公開頁面，可先設為 true
    iconName: 'BookOpen',
    badge: '精選知識',
    highlights: ['個案研究精華筆記', '雙向鏈結知識圖譜', '快速全文檢索'],
  },
  {
    id: 'bazi_family',
    title: '八字命盤與家庭關係圖譜',
    description: '個人命盤結構、五行喜忌分析與家庭成員生剋互動圖譜，探尋身心平衡。',
    category: 'lifestyle',
    url: 'https://bazi-family-graph.vercel.app',
    subdomain: 'bazi',
    isExternal: false, // 走 SSO Ticket
    iconName: 'Compass',
    badge: '哲思洞察',
    highlights: ['八字四柱動態排盤', '家庭成員生剋關係圖', '大運流年互動引導'],
  },
];
