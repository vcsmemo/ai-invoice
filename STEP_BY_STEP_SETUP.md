# 📝 从头开始 - 环境变量配置手把手指南

**预计时间**: 30-40 分钟
**难度**: 中等
**前提**: 需要注册这些服务的账号（大部分可以免费注册）

---

## 🎯 准备工作

### 开始前您需要：

1. **一个记事本/文本编辑器** - 用来临时保存密钥
2. **这些账号**（如果没有，先注册，都是免费的）：
   - ✅ Supabase 账号
   - ✅ Anthropic 账号
   - ✅ Google 账号
   - ✅ Stripe 账号
   - ✅ Resend 账号

3. **信用卡**（用于 Stripe，但测试模式不收费）

---

## 📋 步骤 1: Supabase 配置（5 分钟）

### 1.1 登录 Supabase

```
打开浏览器，访问: https://supabase.com
点击右上角 "Sign In" 或 "Start your project"
```

### 1.2 创建项目

如果您还没有项目：

1. 点击 "New Project"
2. 填写信息：
   ```
   Organization: (选择或创建，免费)
   Name: invoice-ai
   Database Password: (设置一个密码，记住它！)
   Region: Southeast Asia (Singapore) ← 离中国近，速度快
   Pricing plan: Free
   ```
3. 点击 "Create new project"
4. 等待 1-2 分钟，项目创建完成

### 1.3 获取 API Keys

1. **在项目页面**，找到左侧菜单
2. 点击最下边的 **齿轮图标 (Settings)**
3. 点击 **API**

您会看到一个页面，有 3 个重要信息：

#### 🔑 信息 1: Project URL
```
找到这个框:
┌─────────────────────────────────────┐
│ Project URL                          │
│ https://xxxxxxxxxxx.supabase.co      │ ← 复制这个
└─────────────────────────────────────┘

点击右侧的复制按钮
粘贴到您的记事本，标记为:
SUPABASE_URL = https://xxxxxxxxxxx.supabase.co
```

#### 🔑 信息 2: anon public key
```
向下滚动，找到:
┌─────────────────────────────────────┐
│ anon/public                          │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ← 复制这个
└─────────────────────────────────────┘

点击复制按钮
粘贴到记事本:
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 🔑 信息 3: service_role key
```
继续向下，找到:
┌─────────────────────────────────────┐
│ service_role (secret)                │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ← 复制这个
└─────────────────────────────────────┘

⚠️ 警告: 这个 key 很敏感，不要泄露！

粘贴到记事本:
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ✅ 步骤 1 完成！

您的记事本现在应该有：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
```

---

## 📋 步骤 2: Anthropic 配置（3 分钟）

### 2.1 登录 Anthropic Console

```
打开浏览器，访问: https://console.anthropic.com
点击 "Sign In" 或 "Sign Up"
```

### 2.2 获取 API Key

1. **登录后**，您会看到控制台首页
2. 找到左侧菜单，点击 **API Keys**

3. 点击 **"Create Key"** 按钮

4. 填写信息：
   ```
   Name: invoice-ai-production
   (或者任何您想的名字)
   ```

5. 点击 **"Create key"**

6. **重要！** 会弹出一个窗口，显示您的 API key：
   ```
   ┌─────────────────────────────────────┐
   │ sk-ant-api03-xxxxxxxxxxxxx          │ ← 立即复制！
   │                                     │
   │ ⚠️ Make sure to copy it now.        │
   │    You won't be able to see it      │
   │    again.                           │
   └─────────────────────────────────────┘

   点击 "Copy" 按钮
   ```

7. 粘贴到您的记事本：
   ```bash
   ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
   ```

### ✅ 步骤 2 完成！

记事本更新：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
```

---

## 📋 步骤 3: NextAuth Secret 生成（1 分钟）

这是最简单的一步！

### 3.1 生成随机字符串

**方式 A: 使用命令行（如果您有 Mac/Linux）**

1. 打开 **终端** (Terminal)
2. 粘贴这个命令，按回车：
   ```bash
   openssl rand -base64 32
   ```

3. 会输出一串随机字符：
   ```bash
   kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
   ```

4. 复制这串字符

**方式 B: 使用在线生成器**

1. 访问：https://generate-secret.vercel.app/32
2. 页面会自动生成一个 secret
3. 点击 "Copy" 按钮

### 3.2 保存到记事本

```bash
NEXTAUTH_SECRET = kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
```

### ✅ 步骤 3 完成！

记事本更新：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
NEXTAUTH_SECRET = kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
```

---

## 📋 步骤 4: Google OAuth 配置（10 分钟）

这是最复杂的步骤，慢慢来！

### 4.1 访问 Google Cloud Console

```
打开浏览器，访问: https://console.cloud.google.com
```

### 4.2 创建项目

1. 点击顶部的项目选择器（可能是 "Select a project" 下拉框）
2. 点击 **"NEW PROJECT"**
3. 填写：
   ```
   Project name: invoice-ai
   Organization: (可以不选)
   ```
4. 点击 **"CREATE"**
5. 等待项目创建（大约 10 秒）

### 4.3 启用 Google+ API

1. 在左侧菜单，找到 **"APIs & Services"**
2. 点击 **"Library"**
3. 在搜索框输入：**"Google+ API"** 或 **"Google Identity"**
4. 点击结果，然后点击 **"ENABLE"** 按钮

### 4.4 配置 OAuth 同意屏幕

1. 左侧菜单 → **APIs & Services** → **OAuth consent screen**
2. 选择 **"External"** → 点击 **"Create"**
3. 填写信息（只有 * 的必填）：
   ```
   App name*: AI Invoice Generator
   User support email*: (您的邮箱)
   Developer contact information*: (您的邮箱)
   ```
4. 点击 **"SAVE AND CONTINUE"**
5. 其他页面（Scopes, Test users）直接点击 **"SAVE AND CONTINUE"**
6. 最后点击 **"BACK TO DASHBOARD"**

### 4.5 创建 OAuth 凭证

1. 左侧菜单 → **APIs & Services** → **Credentials**
2. 点击顶部 **"+ CREATE CREDENTIALS"** 按钮
3. 选择 **"OAuth client ID"**

### 4.6 配置 OAuth 客户端

1. **Application type** 选择：**"Web application"**
2. **Name** 填写：`AI Invoice Generator`

3. **Authorized redirect URIs** 部分：
   点击 **"ADD URI"** 按钮，添加：
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   ⚠️ **注意**：
   - 这是本地开发用的
   - 部署到 Vercel 后，您需要回来添加生产环境的 URL
   - 格式必须完全一致，包括 http:// 和路径

4. 点击 **"CREATE"**

### 4.7 保存凭据

创建后会弹出一个窗口，显示：
```bash
┌────────────────────────────────────────┐
│ Your OAuth Client ID                   │
├────────────────────────────────────────┤
│ Client ID:                             │
│ 123456789-abcdefghijklmnop.apps.googleu │
│ sercontent.com                         │ ← 复制这个
│                                        │
│ Client Secret:                         │
│ GOCSPX-XXXXXXXXXXXXXXXXXXX             │ ← 复制这个
└────────────────────────────────────────┘
```

1. 点击 **Client ID** 旁边的 "Copy" 按钮
2. 复制 **Client Secret**
3. 粘贴到记事本：
   ```bash
   GOOGLE_CLIENT_ID = 123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = GOCSPX-XXXXXXXXXXXXXXXXXXX
   ```

### ✅ 步骤 4 完成！

记事本更新：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
NEXTAUTH_SECRET = kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
GOOGLE_CLIENT_ID = 123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxxxxxxxxxx
```

---

## 📋 步骤 5: Stripe 配置（5 分钟）

### 5.1 登录 Stripe

```
打开浏览器，访问: https://dashboard.stripe.com
点击 "Sign in" 或 "Start now" → "Skip account onboarding"
(先不创建完整账号，直接进入测试模式)
```

### 5.2 获取 API Keys

1. 确保在 **Test mode**（右上角开关）
2. 左侧菜单 → **Developers** → **API keys**

您会看到两个 key：

#### 🔑 Publishable key
```
┌─────────────────────────────────────┐
│ Publishable key                     │
│ pk_test_51XXXXXXXXXXXXXXXXXXXXX     │ ← 复制这个
└─────────────────────────────────────┘

点击复制，粘贴到记事本:
STRIPE_PUBLISHABLE_KEY = pk_test_51XXXXX
```

#### 🔑 Secret key
```
┌─────────────────────────────────────┐
│ Secret key                          │
│ sk_test_51XXXXXXXXXXXXXXXXXXXXX     │ ← 复制这个
└─────────────────────────────────────┘

点击复制，粘贴到记事本:
STRIPE_SECRET_KEY = sk_test_51XXXXX
```

⚠️ **注意**：Secret key 是敏感信息，不要泄露！

### 5.3 创建 Webhook Endpoint

1. 左侧菜单 → **Developers** → **Webhooks**
2. 点击 **"Add endpoint"** 按钮

3. 填写信息：
   ```
   Endpoint URL:
   http://localhost:3000/api/stripe/webhook

   Events to send to this endpoint:
   点击 "Select events"
   搜索并选择：
   ✅ checkout.session.completed
   ✅ payment_intent.succeeded
   ```

4. 点击 **"Add events"**
5. 点击 **"Add endpoint"**

### 5.4 获取 Webhook Secret

1. 创建后，点击这个新的 endpoint
2. 向下滚动到 **"Signing secret"** 部分
3. 点击 **"Click to reveal"**
4. 复制显示的 secret：
   ```
   whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. 粘贴到记事本：
   ```bash
   STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxxx
   ```

### ✅ 步骤 5 完成！

记事本更新：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
NEXTAUTH_SECRET = kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
GOOGLE_CLIENT_ID = 123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxxxxxxxxxx
STRIPE_SECRET_KEY = sk_test_51XXXXX
STRIPE_PUBLISHABLE_KEY = pk_test_51XXXXX
STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxxx
```

---

## 📋 步骤 6: Resend 配置（2 分钟）

### 6.1 注册 Resend

```
打开浏览器，访问: https://resend.com
点击 "Sign Up"
```

### 6.2 创建 API Key

1. **登录后**，点击左侧 **"API Keys"**
2. 点击 **"Add API Key"** 或 **"Create API Key"**
3. 填写：
   ```
   Name: invoice-ai
   ```
4. 点击 **"Create"**

### 6.3 复制 API Key

会显示一个 API key：
```
re_xxxxxxxxxxxxxxxxxxxxxx
```

1. 点击 **"Copy"**
2. 粘贴到记事本：
   ```bash
   RESEND_API_KEY = re_xxxxxxxxxxxxxx
   ```

### ✅ 步骤 6 完成！

记事本更新：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
ANTHROPIC_API_KEY = sk-ant-api03-xxxxxxxxxxxxx
NEXTAUTH_SECRET = kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
GOOGLE_CLIENT_ID = 123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-xxxxxxxxxxxxx
STRIPE_SECRET_KEY = sk_test_51XXXXX
STRIPE_PUBLISHABLE_KEY = pk_test_51XXXXX
STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxxx
RESEND_API_KEY = re_xxxxxxxxxxxxxx
```

---

## 📋 步骤 7: 创建 .env.local 文件

现在您有了所有的密钥，把它们放到一个文件里！

### 7.1 找到项目位置

打开终端（Terminal），进入您的项目：
```bash
cd /Users/johntian/invoice-ai
```

### 7.2 创建 .env.local 文件

在终端运行：
```bash
nano .env.local
```

（或者用任何文本编辑器创建这个文件）

### 7.3 粘贴配置

把您记事本里的所有密钥，按这个格式粘贴：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# NextAuth
NEXTAUTH_SECRET=kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_51XXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXX
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxx

# 可选
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 7.4 保存文件

如果用 `nano`：
1. 粘贴完内容
2. 按 `Ctrl + O`（保存）
3. 按 `Enter`（确认）
4. 按 `Ctrl + X`（退出）

如果用其他编辑器：
1. 点击 "Save"
2. 保存为 `.env.local`

### ✅ 步骤 7 完成！

现在您的项目文件夹里有一个 `.env.local` 文件，包含所有配置！

---

## 🧪 步骤 8: 测试本地运行（2 分钟）

### 8.1 启动开发服务器

在终端运行：
```bash
npm run dev
```

### 8.2 访问应用

```
打开浏览器，访问:
http://localhost:3000
```

### 8.3 测试功能

1. **测试登录**
   - 点击 "Sign In"
   - 应该能看到 Google 登录按钮
   - 点击后跳转到 Google

2. **测试 AI 生成**
   - 登录后
   - 输入: "Create invoice for 5 hours at $100/hour"
   - 应该能生成发票

### ❌ 如果有错误

常见错误和解决方法：

**错误 1: "Cannot connect to Supabase"**
```
解决方法:
1. 检查 .env.local 中的 Supabase URL 是否正确
2. 确保以 https:// 开头
3. 确保复制了完整的 URL
```

**错误 2: "Invalid Google OAuth"**
```
解决方法:
1. 检查 GOOGLE_CLIENT_ID 是否正确复制
2. 检查回调 URL 是否完全匹配
```

**错误 3: "Anthropic API error"**
```
解决方法:
1. 检查 ANTHROPIC_API_KEY 是否正确
2. 确保没有多余的空格
```

---

## 🚀 步骤 9: 准备部署到 Vercel

现在本地配置完成了，准备部署！

### 9.1 提交代码到 GitHub（如果还没做）

```bash
# 在终端运行
git add .
git commit -m "Add environment configuration"
git push
```

### 9.2 准备好记事本中的所有密钥

部署到 Vercel 时，您需要再次输入这些密钥。

---

## 📝 部署后需要做的事（重要！）

### ⚠️ 1. 更新 NEXTAUTH_URL

部署到 Vercel 后，您的 URL 会变化，需要更新：

```bash
# 本地开发
NEXTAUTH_URL=http://localhost:3000

# 生产环境（Vercel 提供的域名）
NEXTAUTH_URL=https://invoice-ai.vercel.app

# 或自定义域名
NEXTAUTH_URL=https://yourdomain.com
```

### ⚠️ 2. 更新 Google OAuth 回调 URL

1. 回到 Google Cloud Console
2. APIs & Services → Credentials
3. 点击您的 OAuth 客户端
4. 在 "Authorized redirect URIs" 中添加：
   ```
   https://invoice-ai.vercel.app/api/auth/callback/google
   ```

### ⚠️ 3. 更新 Stripe Webhook

1. 在 Stripe Dashboard 创建新的 webhook endpoint
2. URL 改为：
   ```
   https://invoice-ai.vercel.app/api/stripe/webhook
   ```
3. 获取新的 webhook secret

---

## ✅ 完成检查清单

```bash
✅ Supabase 项目已创建
✅ Supabase API keys 已获取
✅ Anthropic API key 已创建
✅ NextAuth secret 已生成
✅ Google OAuth 客户端已创建
✅ Stripe API keys 已获取
✅ Stripe Webhook 已创建
✅ Resend API key 已创建
✅ .env.local 文件已创建
✅ 本地测试成功
```

---

## 🎯 下一步

### 立即做：
1. ✅ 测试本地应用是否正常运行
2. ✅ 确认所有功能正常

### 部署前：
1. 执行数据库迁移（参考 `DATABASE_MIGRATION.md`）
2. 推送代码到 GitHub
3. 在 Vercel 部署

### 部署后：
1. 更新 NEXTAUTH_URL
2. 更新 Google OAuth 回调
3. 更新 Stripe Webhook

---

## 💡 提示

1. **保存密钥**：把您的记事本保存到安全的地方（密码管理器）
2. **不要泄露**：永远不要把 .env.local 提交到 GitHub
3. **测试模式**：先用 Stripe 测试模式，上线后再切换到正式模式

---

## 🆘 遇到问题？

如果某一步卡住了，告诉我：
- "我在步骤 X 卡住了"
- "我看到了这个错误：[错误信息]"
- "我找不到这个按钮"

我会帮您解决！👍

---

**现在开始配置吧！** 🚀

按照步骤 1 → 2 → 3... 一步步来，不着急！
