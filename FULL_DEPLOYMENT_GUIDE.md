# 🚀 完整上线部署指南 - 从本地到生产

**适用场景**: 您的所有代码现在都在本地，需要完整部署到线上
**预计时间**: 1-2 小时
**难度**: 中等

---

## 🎯 总体流程图

```
1️⃣ GitHub 上传代码（10 分钟）
   ↓
2️⃣ Supabase 创建数据库（15 分钟）
   ↓
3️⃣ 各服务账号注册和配置（30 分钟）
   ↓
4️⃣ Vercel 部署（15 分钟）
   ↓
5️⃣ 上线后配置（10 分钟）
   ↓
6️⃣ 测试验证（5 分钟）
```

---

## 1️⃣ 步骤 1: 上传代码到 GitHub（10 分钟）

### 1.1 检查当前状态

打开终端（Terminal），确认在项目目录：

```bash
cd /Users/johntian/invoice-ai
pwd
# 应该显示: /Users/johntian/invoice-ai
```

检查是否已经有 Git：

```bash
git status
```

**如果显示 "Not a git repository"**，需要初始化：

```bash
git init
```

### 1.2 创建 .gitignore 文件（确保不提交敏感信息）

检查项目根目录是否有 `.gitignore` 文件：

```bash
ls -la | grep .gitignore
```

如果没有，创建一个：

```bash
nano .gitignore
```

粘贴以下内容：

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

保存并退出（`Ctrl+O`, `Enter`, `Ctrl+X`）

### 1.3 提交本地代码

```bash
# 添加所有文件
git add .

# 查看将要提交的文件（确认没有敏感文件）
git status

# 提交
git commit -m "Initial commit: AI Invoice Generator"
```

### 1.4 在 GitHub 创建仓库

**方式 A: 通过网页创建（推荐）**

1. 打开浏览器，访问：https://github.com
2. 登录您的账号
3. 点击右上角 **"+"** → **"New repository"**
4. 填写信息：
   ```
   Repository name*: invoice-ai
   Description: AI-powered invoice generator
   Public/Private: 选择 Private（私有，推荐）
   ⚠️ 不要勾选 "Add a README file"
   ⚠️ 不要勾选 "Add .gitignore"
   ```
5. 点击 **"Create repository"**

**创建后**，GitHub 会显示一个页面，保存这个 URL：
```
https://github.com/yourusername/invoice-ai.git
```

### 1.5 推送代码到 GitHub

回到终端，运行：

```bash
# 添加 GitHub remote（替换成您的用户名）
git remote add origin https://github.com/yourusername/invoice-ai.git

# 推送代码
git branch -M main
git push -u origin main
```

如果提示输入用户名和密码：
- **Username**: 您的 GitHub 用户名
- **Password**: 使用 **Personal Access Token**，不是密码

**创建 Personal Access Token**：
1. GitHub → 右上角头像 → Settings
2. 左侧最下边 → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**
5. Note: `invoice-ai`
6. Expiration: 选择过期时间
7. 勾选 `repo`（完整的 repo 权限）
8. 点击 **"Generate token"**
9. 复制显示的 token（只显示一次！）
10. 粘贴到终端的密码输入

### 1.6 验证上传成功

访问：`https://github.com/yourusername/invoice-ai`

您应该能看到所有代码文件都在这里了！

### ✅ 步骤 1 完成！

```bash
✅ 代码已上传到 GitHub
✅ 仓库地址: https://github.com/yourusername/invoice-ai
```

---

## 2️⃣ 步骤 2: 在 Supabase 创建数据库（15 分钟）

### 2.1 注册/登录 Supabase

1. 打开浏览器：https://supabase.com
2. 点击 **"Start your project"** 或 **"Sign In"**
3. 可以用 GitHub 账号登录（推荐）

### 2.2 创建 Supabase 项目

1. 登录后，点击 **"New Project"**
2. 填写信息：

   **Organization**:
   ```
   如果没有组织，点击 "New organization"
   Name: personal（或任意名字）
   Plan: Free
   ```

   **Project**:
   ```
   Name: invoice-ai
   Database Password: (设置一个强密码，记住它！)
   Region: Southeast Asia (Singapore)
     ↑ 选择离用户近的地区，速度快
   Pricing plan: Free
   ```

3. 点击 **"Create new project"**

4. 等待 1-2 分钟，项目创建完成

### 2.3 执行数据库迁移脚本

**重要！** 这一步创建必要的数据库表。

1. **在项目页面**，左侧菜单找到：
   - 点击最下边的 **齿轮图标 (⚙️ Settings)**
   - 或者直接找 **SQL Editor** 图标

2. 如果找不到 SQL Editor：
   - 左侧菜单 → **Database**
   - 顶部会出现子菜单，点击 **SQL Editor**

3. 点击 **"New query"** 按钮

4. **打开本地文件**：
   ```
   /Users/johntian/invoice-ai/supabase/migrations/002_create_profiles.sql
   ```

5. **复制整个文件内容**，粘贴到 Supabase 的 SQL Editor

6. 点击 **"Run"** ▶️ 按钮（右下角）

7. **确认成功**：
   - 应该显示 "Success. No rows returned"
   - 表示表创建成功

### 2.4 创建 Storage Bucket（用于 Logo 上传）

1. **在 Supabase 项目页面**
2. 左侧菜单 → **Storage**（图标是个桶）
3. 点击 **"New bucket"** 按钮

4. 填写信息：
   ```
   Name: logos
   Public bucket: ✅ 勾选（非常重要！）
   File size limit: 5MB
   Allowed MIME types: (留空，允许所有类型)
   ```

5. 点击 **"Create bucket"**

6. **创建后**，点击 `logos` bucket
7. 确认旁边有个 **🔓 Public** 标志

### 2.5 获取 Supabase API Keys

1. 左侧菜单 → **⚙️ Settings** → **API**

2. **复制以下 3 个信息**（保存到记事本）：

   **Project URL**:
   ```
   点击复制按钮
   保存为: SUPABASE_URL
   示例: https://abcdefgh.supabase.co
   ```

   **anon/public key**:
   ```
   向下滚动，找到 "anon public"
   点击复制
   保存为: SUPABASE_ANON_KEY
   ```

   **service_role key**:
   ```
   继续向下，找到 "service_role"
   ⚠️ 这个很敏感，不要泄露！
   点击复制
   保存为: SUPABASE_SERVICE_KEY
   ```

### ✅ 步骤 2 完成！

```bash
✅ Supabase 项目已创建
✅ 数据库表已创建（profiles, invoices）
✅ Storage bucket 已创建（logos）
✅ API keys 已获取
```

---

## 3️⃣ 步骤 3: 各服务账号注册和配置（30 分钟）

现在您需要获取 5 个服务的 API keys。

### 3.1 Anthropic（Claude AI）- 5 分钟

#### 注册和获取 API Key

1. 访问：https://console.anthropic.com
2. 点击 **"Sign Up"** 或 **"Sign In"**
3. 登录后，左侧菜单 → **API Keys**
4. 点击 **"Create Key"**
5. 填写：
   ```
   Name: invoice-ai-production
   ```
6. 点击 **"Create key"**
7. **立即复制显示的 key**（只显示一次！）
   ```
   sk-ant-api03-xxxxxxxxx
   ```
8. 保存到记事本：`ANTHROPIC_API_KEY`

**注意**：
- 💰 按使用量计费
- 💡 可以设置预算限制避免超额

### 3.2 Google OAuth - 10 分钟（最复杂）

#### 创建 Google Cloud 项目

1. 访问：https://console.cloud.google.com
2. 登录 Google 账号
3. 点击顶部的项目选择器
4. 点击 **"NEW PROJECT"**
5. 填写：
   ```
   Project name: invoice-ai
   ```
6. 点击 **"CREATE"**

#### 启用 Google+ API

1. 左侧菜单 → **APIs & Services** → **Library**
2. 搜索：**"Google+ API"** 或 **"Google Identity"**
3. 点击结果，然后点击 **"ENABLE"**

#### 配置 OAuth 同意屏幕

1. 左侧菜单 → **APIs & Services** → **OAuth consent screen**
2. 选择 **"External"** → **"Create"**
3. 填写：
   ```
   App name*: AI Invoice Generator
   User support email*: (您的邮箱)
   Developer contact*: (您的邮箱)
   ```
4. 点击 **"SAVE AND CONTINUE"**
5. 其他页面直接点击 **"SAVE AND CONTINUE"**

#### 创建 OAuth 凭证

1. 左侧菜单 → **APIs & Services** → **Credentials**
2. 点击 **"+ CREATE CREDENTIALS"**
3. 选择 **"OAuth client ID"**
4. Application type: **"Web application"**
5. Name: `AI Invoice Generator`
6. Authorized redirect URIs:
   ```
   当前添加（本地测试）:
   http://localhost:3000/api/auth/callback/google

   ⚠️ 部署后需要回来添加:
   https://yourdomain.com/api/auth/callback/google
   ```
7. 点击 **"CREATE"**
8. 复制 **Client ID** 和 **Client Secret** 到记事本：
   ```
   GOOGLE_CLIENT_ID = xxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
   ```

### 3.3 生成 NextAuth Secret - 1 分钟

**使用命令行**（Mac/Linux）：
```bash
openssl rand -base64 32
```

**或在线生成**：
```
访问: https://generate-secret.vercel.app/32
```

复制生成的字符串到记事本：
```
NEXTAUTH_SECRET = xxxxx
```

### 3.4 Stripe - 7 分钟

#### 注册和获取 API Keys

1. 访问：https://dashboard.stripe.com
2. 点击 **"Start now"** → **"Skip account onboarding"**
   （先在测试模式配置）

#### 获取 API Keys

1. 确保右上角是 **Test mode**
2. 左侧菜单 → **Developers** → **API keys**
3. 复制两个 key：

   **Publishable key**:
   ```
   pk_test_51XXXXX
   保存为: STRIPE_PUBLISHABLE_KEY
   ```

   **Secret key**:
   ```
   sk_test_51XXXXX
   保存为: STRIPE_SECRET_KEY
   ```

#### 创建 Webhook Endpoint

1. 左侧菜单 → **Developers** → **Webhooks**
2. 点击 **"Add endpoint"**
3. 填写：
   ```
   Endpoint URL: http://localhost:3000/api/stripe/webhook
   Events:
   ✅ checkout.session.completed
   ✅ payment_intent.succeeded
   ```
4. 点击 **"Add endpoint"**
5. 点击新创建的 endpoint
6. 找到 **"Signing secret"** → **"Click to reveal"**
7. 复制 secret：
   ```
   whsec_xxxxx
   保存为: STRIPE_WEBHOOK_SECRET
   ```

**⚠️ 注意**：部署后需要创建新的 webhook endpoint（生产 URL）

### 3.5 Resend（邮件）- 2 分钟

1. 访问：https://resend.com
2. 点击 **"Sign Up"**
3. 登录后，左侧菜单 → **API Keys**
4. 点击 **"Add API Key"**
5. 填写：
   ```
   Name: invoice-ai
   ```
6. 点击 **"Create"**
7. 复制 API key：
   ```
   re_xxxxx
   保存为: RESEND_API_KEY
   ```

### ✅ 步骤 3 完成！

您的记事本现在应该有所有密钥：

```bash
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_KEY
✅ ANTHROPIC_API_KEY
✅ NEXTAUTH_SECRET
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ STRIPE_SECRET_KEY
✅ STRIPE_PUBLISHABLE_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ RESEND_API_KEY
```

---

## 4️⃣ 步骤 4: 部署到 Vercel（15 分钟）

### 4.1 注册/登录 Vercel

1. 访问：https://vercel.com
2. 点击 **"Sign Up"** 或 **"Log In"**
3. **推荐使用 GitHub 登录**（最简单）

### 4.2 导入 GitHub 仓库

1. 登录后，点击 **"Add New..."** → **"Project"**
2. 会看到您的 GitHub 仓库列表
3. 找到 **"invoice-ai"**，点击 **"Import"**

### 4.3 配置项目

#### 项目信息

```
Project Name: invoice-ai
(自动填充，可以不改)

Framework Preset: Next.js
(应该自动检测)

Root Directory: ./
(不要改)

Build Command: npm run build
(自动填充)

Install Command: npm install
(自动填充)
```

#### 环境变量配置（重点！）

向下滚动到 **"Environment Variables"** 部分：

**逐个添加所有环境变量**：

1. **Supabase**:
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxxxx.supabase.co
   点击 "Add"

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: eyJhbGc...
   点击 "Add"

   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGc...
   点击 "Add"
   ```

2. **Anthropic**:
   ```
   Name: ANTHROPIC_API_KEY
   Value: sk-ant-api03-xxxxx
   点击 "Add"
   ```

3. **NextAuth**:
   ```
   Name: NEXTAUTH_SECRET
   Value: xxxxx（您生成的随机字符串）
   点击 "Add"

   Name: NEXTAUTH_URL
   Value: https://invoice-ai.vercel.app
   ⚠️ 注意：如果自定义域名，改成您的域名
   点击 "Add"
   ```

4. **Google OAuth**:
   ```
   Name: GOOGLE_CLIENT_ID
   Value: xxxxx.apps.googleusercontent.com
   点击 "Add"

   Name: GOOGLE_CLIENT_SECRET
   Value: GOCSPX-xxxxx
   点击 "Add"
   ```

5. **Stripe**:
   ```
   Name: STRIPE_SECRET_KEY
   Value: sk_test_51XXXXX
   点击 "Add"

   Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   Value: pk_test_51XXXXX
   点击 "Add"

   Name: STRIPE_WEBHOOK_SECRET
   Value: whsec_xxxxx
   点击 "Add"
   ```

6. **Resend**:
   ```
   Name: RESEND_API_KEY
   Value: re_xxxxx
   点击 "Add"
   ```

7. **可选**:
   ```
   Name: NEXT_PUBLIC_SITE_URL
   Value: https://invoice-ai.vercel.app
   点击 "Add"
   ```

**检查清单**：
- ✅ 所有 13 个环境变量都已添加
- ✅ 没有拼写错误
- ✅ 值都正确复制

### 4.4 开始部署

1. 确认所有配置正确
2. 点击底部 **"Deploy"** 按钮
3. 开始部署，显示进度：
   ```
   ⏳ Building...
   ⏳ Deploying...
   ```
4. 等待 2-3 分钟

### 4.5 部署完成

成功后会看到：
```
🎉 Congratulations!

Your deployment is ready.

Preview: https://invoice-ai.vercel.app
```

**复制这个 URL**，这是您的新网站地址！

### ✅ 步骤 4 完成！

```bash
✅ 应用已部署到 Vercel
✅ 网站地址: https://invoice-ai.vercel.app
✅ 可以通过互联网访问了！
```

---

## 5️⃣ 步骤 5: 上线后配置（10 分钟）

### 5.1 更新 Google OAuth 回调 URL

**重要！** 必须添加生产环境的回调 URL。

1. 回到：https://console.cloud.google.com
2. APIs & Services → Credentials
3. 点击您的 OAuth 客户端 ID
4. 在 **"Authorized redirect URIs"** 中：
   ```
   点击 "ADD URI"
   添加: https://invoice-ai.vercel.app/api/auth/callback/google
   （如果用自定义域名，用您的域名）
   ```
5. 点击 **"Save"**

### 5.2 更新 Stripe Webhook Endpoint

测试环境的 webhook 不能用于生产。

1. 回到：https://dashboard.stripe.com
2. 左侧菜单 → **Developers** → **Webhooks**
3. 点击 **"Add endpoint"**
4. 填写：
   ```
   Endpoint URL: https://invoice-ai.vercel.app/api/stripe/webhook

   Events:
   ✅ checkout.session.completed
   ✅ payment_intent.succeeded
   ```
5. 点击 **"Add endpoint"**
6. 获取新的 **Signing secret**
7. **更新 Vercel 环境变量**：
   ```
   访问 Vercel Dashboard
   找到 invoice-ai 项目
   Settings → Environment Variables
   找到 STRIPE_WEBHOOK_SECRET
   更新为新的 secret
   ```

8. **重新部署**：
   ```
   Vercel Dashboard → Deployments
   点击最新部署右侧的 "..." → "Redeploy"
   ```

### 5.3 创建本地 .env.local 文件（可选）

如果您想在本地开发，创建 `.env.local` 文件：

在项目目录运行：
```bash
nano .env.local
```

粘贴所有环境变量（参考步骤 3 获取的值）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXTAUTH_SECRET=xxxxx
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
RESEND_API_KEY=re_xxxxx
```

保存后，本地开发：
```bash
npm run dev
```

### ✅ 步骤 5 完成！

```bash
✅ Google OAuth 已更新
✅ Stripe Webhook 已更新
✅ 应用已重新部署
✅ 本地开发环境已配置（可选）
```

---

## 6️⃣ 步骤 6: 测试验证（5 分钟）

### 6.1 访问您的网站

```
打开浏览器，访问:
https://invoice-ai.vercel.app
```

### 6.2 测试功能清单

#### ✅ 基础功能

```bash
□ 首页加载正常
□ 点击 "Sign In" 能看到 Google 登录
□ Google 登录成功
```

#### ✅ 核心功能

```bash
□ 登录后能看到 "Generate Invoice" 页面
□ 输入: "Create invoice for 5 hours web development at $100/hour"
□ AI 能生成发票
□ 发票显示正确的金额
□ 点击 "Download PDF" 能下载 PDF
```

#### ✅ 设置功能

```bash
□ 点击 "Settings"
□ 能看到设置页面
□ 修改公司名称
□ 点击 "Save Changes" 显示成功
```

#### ✅ 多币种功能

```bash
□ Settings → Currency → 选择 EUR (€)
□ 保存
□ Generate Invoice → 输入同样的内容
□ 检查金额显示为 € 而不是 $
```

#### ✅ 支付功能（可选测试）

```bash
□ 点击 "Upgrade" 或 "Pricing"
□ 选择一个套餐
□ 能跳转到 Stripe Checkout
```

### 6.3 检查 Vercel 日志（如果有错误）

如果任何功能不工作：

1. 访问 Vercel Dashboard
2. 找到 invoice-ai 项目
3. **Deployments** → 点击最新部署
4. 查看 **"Build Logs"** 或 **"Function Logs"**
5. 找到错误信息

### ✅ 步骤 6 完成！

```bash
✅ 所有功能测试通过
✅ 应用成功上线！
```

---

## 🎉 恭喜！您的应用已成功上线！

### 您现在拥有：

```bash
✅ GitHub 仓库: https://github.com/yourusername/invoice-ai
✅ 在线网站: https://invoice-ai.vercel.app
✅ Supabase 数据库: 已配置
✅ 所有第三方服务: 已集成
✅ 完整功能: AI 生成、PDF 下载、多币种、支付
```

---

## 📊 后续优化（可选）

### 1. 配置自定义域名

**在 Vercel**:
1. 项目 → **Settings** → **Domains**
2. 添加您的域名（比如 `invoice-ai.com`）
3. 按照 Vercel 的 DNS 配置说明操作
4. 等待 DNS 传播（5-30 分钟）

### 2. 创建 SEO 图片

参考：`public/images/README.md`

快速方法（2 分钟）：
```
1. 访问 https://favicon.io
2. 生成所有图标
3. 下载并放入 public/ 目录
4. 重新部署
```

### 3. Google Search Console

```
1. 访问 https://search.google.com/search-console
2. 添加您的网站
3. 验证域名
4. 提交 sitemap.xml
```

### 4. 切换 Stripe 到生产模式

当准备接收真实支付时：
```
1. Stripe Dashboard → 切换到 Live mode
2. 获取 live API keys
3. 更新 Vercel 环境变量
4. 重新部署
```

---

## 💰 预计成本

### 月度成本

```
Vercel Pro:    $20/月（必需）
Supabase:      $0/月（免费额度）
Claude API:    $20-50/月（根据使用量）
Resend:        $0/月（免费 3000 封/月）
Stripe:        2.9% + $0.30/交易
─────────────────────────────
总计:          ~$40-70/月
```

### 年度成本

```
Vercel:        $240/年
域名:          $10-15/年
─────────────────────────────
总计:          ~$500-900/年
```

---

## 🆘 常见问题

### Q1: 部署后无法登录？
**A**: 检查 Google OAuth 回调 URL 是否添加了生产环境地址

### Q2: AI 生成失败？
**A**:
1. 检查 ANTHROPIC_API_KEY 是否正确
2. 查看 Vercel Function Logs

### Q3: PDF 下载失败？
**A**: Vercel 免费版可能内存不足，升级到 Pro 计划

### Q4: 图片上传失败？
**A**: 检查 Supabase Storage bucket 是否为 public

### Q5: Stripe 支付失败？
**A**:
1. 检查 webhook secret 是否是生产环境的
2. 查看 Vercel 日志

---

## 📞 需要帮助？

如果某一步卡住：
- 告诉我您在第几步
- 描述遇到的问题或错误信息
- 我会帮您解决！

---

## 🎯 快速参考

### 重要链接

```bash
GitHub: https://github.com/yourusername/invoice-ai
Vercel: https://vercel.com/dashboard
Supabase: https://supabase.com/dashboard
Anthropic: https://console.anthropic.com
Google Cloud: https://console.cloud.google.com
Stripe: https://dashboard.stripe.com
Resend: https://resend.com/dashboard
```

### 环境变量快速检查

```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ ANTHROPIC_API_KEY
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ STRIPE_SECRET_KEY
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ RESEND_API_KEY
✅ NEXT_PUBLIC_SITE_URL
```

---

**🎉 现在开始部署吧！按照 6 个步骤，一步步来！**
