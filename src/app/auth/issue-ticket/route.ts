import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  let response = NextResponse.next();

  // 1. 初始化讀取 Cookie 的 Supabase Client（確認使用者身分）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: '未登入或憑證無效' }, { status: 401 });
  }

  // 2. 取得目標站點 toolId
  const { toolId } = await request.json();
  if (!toolId) {
    return NextResponse.json({ error: '缺少 toolId' }, { status: 400 });
  }

  // 3. 檢查使用者是否有權限
  const allowedTools: string[] = user.user_metadata?.allowed_tools || [];
  if (!allowedTools.includes(toolId)) {
    return NextResponse.json({ error: '尚未開通此工具權限' }, { status: 403 });
  }

  // 4. 以 Service Role 特權寫入單次性 Ticket
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: ticket, error: ticketError } = await adminSupabase
    .from('sso_tickets')
    .insert({
      user_id: user.id,
      target_tool: toolId,
    })
    .select('id')
    .single();

  if (ticketError || !ticket) {
    return NextResponse.json({ error: ticketError?.message || '產生票券失敗' }, { status: 500 });
  }

  return NextResponse.json({ ticket: ticket.id });
}