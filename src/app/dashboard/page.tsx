import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { DashboardClient } from '@/components/DashboardClient';

export const metadata = {
  title: '中央儀表板 | Central Dashboard',
  description: '中央訂閱工具入口儀表板與單一簽入通行中心',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // 取得當前使用者驗證資訊
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 若未登入則導向登入頁
  if (!user) {
    redirect('/login');
  }

  // 讀取 Supabase user_metadata 中的 allowed_tools
  const allowedTools: string[] = Array.isArray(user.user_metadata?.allowed_tools)
    ? user.user_metadata.allowed_tools
    : [];

  return (
    <DashboardClient
      initialEmail={user.email}
      initialAllowedTools={allowedTools}
    />
  );
}
