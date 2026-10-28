import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '中央訂閱工具入口 | Central Dashboard',
  description: '整合 Supabase 跨子網域 Session 共享之中央訂閱工具入口儀表板',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
