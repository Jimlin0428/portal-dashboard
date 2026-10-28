# 中央訂閱工具入口儀表板 (Central Dashboard)

這是一個以 **Next.js (App Router)**、**TypeScript**、**Tailwind CSS** 與 **Supabase Auth (@supabase/ssr)** 為核心技術打造的「中央訂閱工具入口儀表板 (Central Dashboard)」。

本專案支援**跨子網域 (Cross-subdomain Cookie SSO)**，使用者只要在此儀表板登入一次，所屬子網域（如 `pmba-schedule.yourdomain.com`、`vaultbill.yourdomain.com` 等）即可共享同一組認證 Session。

---

## 🌟 核心功能特色

1. **認證與跨子網域 Cookie (Cross-Subdomain SSO)**：
   - 使用 `@supabase/ssr` 實作標準伺服器/用戶端認證。
   - 保留 `cookieOptions` 設定空間，自動讀取 `NEXT_PUBLIC_ROOT_DOMAIN`（例如 `.yourdomain.com`），在生產環境中實現跨子網域 Session 共享，而在本地開發 (`localhost`) 自動降級兼容。
   - 支援 Email/密碼登入、Magic Link 免密碼登入與註冊。
   - Next.js `middleware.ts` 全域守衛：未登入訪問 `/dashboard` 自動導向 `/login`，登入後自動轉跳。
2. **工具清單配置 (`src/config/tools.ts`)**：
   - 預設收錄 6 大實用工具：
     - `pmba_schedule`: PM 課表 (臺大 PMBA 課程進度與時程規劃)
     - `line_meeting`: 會議邀請小工具 (LINE LIFF 快速發布與統計)
     - `compound_interest`: 複利投資模擬器 (資產配置與複利回測試算)
     - `vault_bill`: VaultBill 信用卡帳單分析 (多銀行帳單解析與圖表)
     - `digital_garden`: PMBA 核心專業選修知識庫 (數位筆記花園)
     - `bazi_family`: 八字命盤與家庭關係圖譜 (個人命盤結構與生剋分析)
   - 具備完整 TypeScript 型別定義與子網域動態解析器。
3. **動態權限與卡片渲染**：
   - 即時讀取 Supabase 使用者的 `user_metadata.allowed_tools`。
   - **已解鎖狀態**：高對比明亮風格，顯示「啟用中」微光徽章，提供「進入系統」按鈕另開分頁。
   - **未解鎖狀態**：低彩度灰暗風格，右上角顯示鎖頭圖示，提供「立即解鎖 / 訂閱」按鈕並彈出詳細訂閱說明 Modal。
   - 支援分類篩選（全部、商務/課業、財務工具、生活/個人）與關鍵字全文搜尋。
   - 提供「模擬切換權限」快速預覽按鈕，本機測試無痛體驗。

---

## 📁 專案目錄結構

```text
my-dashboard/
├── .env.example               # 環境變數範例檔
├── .env.local                 # 本機開發環境變數 (不納入版控)
├── .gitignore                 # Git 忽略設定
├── next.config.mjs            # Next.js 配置
├── package.json               # 專案依賴與腳本
├── postcss.config.mjs         # PostCSS 配置
├── tailwind.config.ts         # Tailwind CSS 配置
├── tsconfig.json              # TypeScript 編譯配置
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts   # Supabase OAuth / Magic Link Callback
│   │   │   └── signout/
│   │   │       └── route.ts   # 登出清除 Cookie 路由
│   │   ├── dashboard/
│   │   │   └── page.tsx       # 儀表板首頁 (伺服器端讀取權限)
│   │   ├── login/
│   │   │   └── page.tsx       # 登入 / 註冊 / Magic Link 整合頁
│   │   ├── globals.css        # 全域樣式與 Tailwind 指令
│   │   ├── layout.tsx         # 根佈局
│   │   └── page.tsx           # 首頁自動導向
│   ├── components/
│   │   ├── DashboardClient.tsx# 用戶端主儀表板 (搜尋、篩選、狀態控制)
│   │   ├── Navbar.tsx         # 頂部導航列 (Email、統計徽章、登出)
│   │   ├── ToolCard.tsx       # 工具卡片 (已解鎖 / 未解鎖動態渲染)
│   │   ├── ToolIcon.tsx       # Lucide 圖示動態映射
│   │   └── UnlockModal.tsx    # 訂閱與解鎖詳細資訊彈窗
│   ├── config/
│   │   └── tools.ts           # 6 大工具清單與 URL 動態解析函式
│   ├── types/
│   │   └── index.ts           # TypeScript 資料型別定義
│   └── utils/
│       └── supabase/
│           ├── client.ts          # 瀏覽器端 Supabase Client
│           ├── cookie-options.ts  # 跨子網域 Cookie 配置
│           ├── middleware.ts      # 中間層 Session 更新邏輯
│           └── server.ts          # 伺服器端 Supabase Client
└── README.md
```

---

## 🚀 快速開始

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 配置環境變數

複製 `.env.example` 為 `.env.local`：

```bash
cp .env.example .env.local
```

編輯 `.env.local` 並填入您的 Supabase 專案設定：

```env
# Supabase API 設定 (於 Supabase Dashboard > Project Settings > API 取得)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 跨子網域根網域設定 (例如: yourdomain.com)
# 若在本地開發請填 localhost 或保留預設；生產環境請填寫您的頂級域名，如 yourdomain.com
NEXT_PUBLIC_ROOT_DOMAIN=localhost
```

### 3. 啟動本地開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可瀏覽登入頁面與儀表板。

---

## 🔑 Supabase 使用者授權設定指引

本系統依據 Supabase 使用者的 `user_metadata.allowed_tools` 判斷工具權限。

### 如何為使用者開通工具？
1. 前往 **[Supabase Dashboard](https://supabase.com/dashboard)**。
2. 進入您的專案，點擊左側選單 **Authentication** -> **Users**。
3. 點選目標使用者，找到 **User Metadata** 區塊。
4. 加入或編輯 `allowed_tools` 陣列，例如：
   ```json
   {
     "allowed_tools": [
       "pmba_schedule",
       "line_meeting",
       "compound_interest",
       "vault_bill"
     ]
   }
   ```
5. 點擊 **Save**。使用者重新整理頁面後，對應的工具卡片即會立即切換為「啟用中」並可點擊進入。

> 💡 **提示**：在新使用者透過登入頁的「建立新帳號」註冊時，預設會自動給予 3 項試用工具 (`pmba_schedule`, `line_meeting`, `compound_interest`)。

---

## 🌐 跨子網域 Cookie (Cross-Subdomain SSO) 設定

若要讓使用者在 `dashboard.yourdomain.com` 登入後，在 `pmba-schedule.yourdomain.com` 也能自動讀取到登入 Session：

1. **環境變數**：在 Vercel 或生產環境中將 `NEXT_PUBLIC_ROOT_DOMAIN` 設定為 `yourdomain.com`。
2. **Cookie Domain**：系統會在初始化 Client 與 Server Client 時，自動設定 `domain: ".yourdomain.com"`。
3. **Supabase 重新導向 URL**：
   在 Supabase 控制台的 **Authentication** -> **URL Configuration** 中：
   - **Site URL**: `https://dashboard.yourdomain.com`
   - **Redirect URLs** 加入：
     - `https://dashboard.yourdomain.com/**`
     - `http://localhost:3000/**`

---

## 🚢 推送至 GitHub 與部署至 Vercel

### 1. 初始化 Git 並推送至 GitHub

在專案根目錄執行以下終端機指令：

```bash
# 初始化 Git 倉庫
git init

# 將所有文件加入暫存區
git add .

# 建立初始提交
git commit -m "feat: Initial commit for Central Dashboard with Supabase cross-domain auth"

# 將預設分支切換為 main
git branch -M main

# 新增 GitHub 遠端儲存庫 (請將 <YOUR_GITHUB_USERNAME> 與 <REPO_NAME> 替換為您的實際網址)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git

# 推送代碼至 GitHub
git push -u origin main
```

### 2. 部署至 Vercel

1. 前往 **[Vercel Dashboard](https://vercel.com)** 並點擊 **Add New Project**。
2. 匯入剛剛建立的 GitHub Repository。
3. 在 **Environment Variables** 區塊中新增以下 3 個變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ROOT_DOMAIN` (填寫您的根網域，例如 `yourdomain.com`)
4. 點擊 **Deploy**，部署完成後即可綁定您的自訂網域！
