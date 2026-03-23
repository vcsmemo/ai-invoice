# 🔧 环境变量配置完全指南

## 🤔 什么是环境变量？

**简单理解**：环境变量就是应用程序的"配置信息"，比如：
- 数据库地址
- API 密钥
- 第三方服务的凭证

**为什么需要**：这些敏感信息不能直接写在代码里，因为：
1. ❌ 不安全（会被盗用）
2. ❌ 无法在不同环境使用（开发/生产）
3. ✅ 环境变量可以安全地存储和更换

---

## 📋 完整环境变量清单

您的应用需要这些环境变量，我会逐一解释：

### 1️⃣ Supabase（数据库）

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2️⃣ Anthropic（Claude AI）

```bash
ANTHROPIC_API_KEY=
```

### 3️⃣ NextAuth（登录认证）

```bash
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 4️⃣ Google OAuth（Google 登录）

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 5️⃣ Stripe（支付）

```bash
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 6️⃣ Resend（邮件）

```bash
RESEND_API_KEY=
```

---

## 🔑 详细配置步骤

### Step 1: Supabase 配置

#### 什么是 Supabase？
Supabase 是一个数据库服务，存储您的用户数据、发票信息等。

#### 如何获取凭证？

**1. 登录 Supabase**
```
https://supabase.com/dashboard
```

**2. 选择或创建项目**
- 如果已有项目，点击进入
- 如果没有，点击 "New Project"

**3. 获取配置信息**
```
左侧菜单 → Settings (齿轮图标) → API
```

您会看到：

```
✅ Project URL
复制这个值 → NEXT_PUBLIC_SUPABASE_URL

✅ anon/public key
复制这个值 → NEXT_PUBLIC_SUPABASE_ANON_KEY

✅ service_role (secret) key
复制这个值 → SUPABASE_SERVICE_ROLE_KEY
```

**示例**：
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**保存到安全位置！**

---

### Step 2: Anthropic 配置

#### 什么是 Anthropic？
Anthropic 是提供 Claude AI 的公司，您的应用用他们的 AI 来生成发票。

#### 如何获取 API Key？

**1. 登录 Anthropic Console**
```
https://console.anthropic.com
```

**2. 创建 API Key**
```
左侧菜单 → API Keys
点击 "Create Key" 按钮
给这个 key 起个名字，比如 "invoice-ai-prod"
点击 "Create key"
```

**3. 复制 Key**
```
⚠️ 只显示一次，立即复制！
格式: sk-ant-api03-xxxxxxxxxxxx
```

**环境变量**：
```bash
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

**注意**：
- ⚠️ 这个 key 只会显示一次，请立即保存
- 💰 Claude API 按使用量计费
- 💡 可以设置使用限额避免超额费用

---

### Step 3: NextAuth 配置

#### 什么是 NextAuth？
NextAuth 是处理用户登录的库。

#### NEXTAUTH_SECRET
这是一个随机字符串，用于加密会话。

**如何生成？**

**方式 1: 使用命令行（推荐）**
```bash
# 打开终端，运行：
openssl rand -base64 32

# 输出示例：
# kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
```

**方式 2: 在线生成**
```
访问: https://generate-secret.vercel.app/32
点击生成，复制结果
```

**环境变量**：
```bash
NEXTAUTH_SECRET=kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
```

#### NEXTAUTH_URL
这是您网站的地址。

**开发环境**（本地测试）：
```bash
NEXTAUTH_URL=http://localhost:3000
```

**生产环境**（部署后）：
```bash
# 如果用 Vercel 提供的域名
NEXTAUTH_URL=https://invoice-ai.vercel.app

# 如果用自定义域名
NEXTAUTH_URL=https://www.aiinvoicegenerators.com
```

---

### Step 4: Google OAuth 配置

#### 什么是 Google OAuth？
让用户可以用 Google 账号登录您的应用。

#### 如何获取凭证？

**1. 创建 Google Cloud 项目**

```
访问: https://console.cloud.google.com
```

**2. 启用 Google+ API**
```
左侧菜单 → APIs & Services → Library
搜索 "Google+ API" 或 "Google Identity"
点击启用
```

**3. 配置 OAuth 同意屏幕**
```
左侧菜单 → APIs & Services → OAuth consent screen
选择 "External" → Create
填写必需信息：
  - App name: AI Invoice Generator
  - User support email: 您的邮箱
  - Developer contact: 您的邮箱
点击 "Save and Continue"
（可以跳过其他步骤，点击 "Save and Continue"）
```

**4. 创建 OAuth 客户端 ID**
```
左侧菜单 → APIs & Services → Credentials
点击 "+ CREATE CREDENTIALS"
选择 "OAuth client ID"
```

**5. 选择应用类型**
```
选择: Web application
```

**6. 配置授权重定向 URI**

**开发环境**（本地测试）：
```
http://localhost:3000/api/auth/callback/google
```

**生产环境**（部署到 Vercel 后）：
```
https://invoice-ai.vercel.app/api/auth/callback/google
或
https://www.aiinvoicegenerators.com/api/auth/callback/google
```

**7. 创建并保存**
```
点击 "Create"
复制显示的 Client ID 和 Client Secret
```

**环境变量**：
```bash
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

**⚠️ 重要**：
- 部署后必须回来添加生产环境的回调 URL！
- 在 OAuth client 页面点击编辑，添加新的 URI

---

### Step 5: Stripe 配置

#### 什么是 Stripe？
Stripe 是处理支付的服务。

#### 如何获取凭证？

**1. 登录 Stripe**
```
https://dashboard.stripe.com
```

**2. 获取 API Keys**
```
左侧菜单 → Developers → API Keys
```

您会看到两个模式：
- **Test mode**（测试，不用真钱）
- **Live mode**（生产，真钱）

**先在 Test mode 测试**：

```
找到 "Publishable key"
复制 → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

找到 "Secret key"
复制 → STRIPE_SECRET_KEY
```

**环境变量**（测试）：
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_SECRET_KEY=sk_test_51xxxxx
```

**上线后换成 Live mode**：
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51xxxxx
STRIPE_SECRET_KEY=sk_live_51xxxxx
```

#### STRIPE_WEBHOOK_SECRET

**1. 创建 Webhook Endpoint**
```
左侧菜单 → Developers → Webhooks
点击 "Add endpoint"
```

**2. 配置端点**
```
Endpoint URL:
- 测试: http://localhost:3000/api/stripe/webhook
- 生产: https://www.aiinvoicegenerators.com/api/stripe/webhook

Events to listen to:
选择这些事件：
✅ checkout.session.completed
✅ payment_intent.succeeded
```

**3. 获取 Signing Secret**
```
创建后，点击 endpoint
在 "Signing secret" 部分
点击 "Reveal"
复制 → STRIPE_WEBHOOK_SECRET
```

**环境变量**：
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

### Step 6: Resend 配置

#### 什么是 Resend？
Resend 是发送邮件的服务（比传统邮件服务更简单）。

#### 如何获取 API Key？

**1. 注册 Resend**
```
https://resend.com
```

**2. 创建 API Key**
```
登录后 → API Keys
点击 "Create API Key"
```

**3. 复制 Key**
```
复制 → RESEND_API_KEY
```

**环境变量**：
```bash
RESEND_API_KEY=re_xxxxx
```

**注意**：
- ✅ 免费额度：3000 封/月
- 💰 超过后按量计费

---

## 📝 完整示例

### 本地开发（.env.local）

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzNDU2NzcsImV4cCI6MjAyNzk4MTY3N30.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMjM0NTY3NywiZXhwIjoyMDI3OTgxNjc3fQ.xxxxx

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# NextAuth
NEXTAUTH_SECRET=kJ8xN3v9Ym2zQ5w8E4t6Yh7g0Nj2M5k8P9q3L6vN1=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxx

# Stripe（测试模式）
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# 可选
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 生产环境（Vercel）

**唯一的区别是**：

```bash
NEXTAUTH_URL=https://invoice-ai.vercel.app
NEXT_PUBLIC_SITE_URL=https://invoice-ai.vercel.app
```

或自定义域名：
```bash
NEXTAUTH_URL=https://www.aiinvoicegenerators.com
NEXT_PUBLIC_SITE_URL=https://www.aiinvoicegenerators.com
```

---

## 🎯 在 Vercel 中配置环境变量

### 方式 1: 在部署时配置（推荐）

1. **导入项目到 Vercel 后**
   ```
   在 "Configure Project" 页面
   展开 "Environment Variables" 部分
   ```

2. **逐个添加**
   ```
   Key: ANTHROPIC_API_KEY
   Value: sk-ant-api03-xxxxx
   点击 "Add"

   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://xxxxx.supabase.co
   点击 "Add"

   ...（重复所有环境变量）
   ```

3. **部署**
   ```
   添加完所有变量后
   点击 "Deploy"
   ```

### 方式 2: 部署后在配置

1. **部署完成后**
   ```
   进入项目
   Settings → Environment Variables
   ```

2. **批量添加**
   ```
   点击 "Add New"
   逐个添加所有环境变量
   ```

3. **重新部署**
   ```
   添加环境变量后
   需要重新部署才能生效
   Deployments → 最新部署 → Redeploy
   ```

---

## ⚠️ 常见错误和解决方法

### 错误 1: NEXTAUTH_URL 配置错误

**错误信息**：
```
Error: Invalid nextauth url
```

**解决方法**：
```bash
# 确保没有尾部斜杠
❌ NEXTAUTH_URL=https://www.aiinvoicegenerators.com/
✅ NEXTAUTH_URL=https://www.aiinvoicegenerators.com
```

### 错误 2: Google OAuth 回调错误

**错误信息**：
```
Error: redirect_uri_mismatch
```

**解决方法**：
1. 检查 Google Console 中的授权重定向 URI
2. 确保完全匹配：
   ```
   https://www.aiinvoicegenerators.com/api/auth/callback/google
   ```
3. 不要有多余的斜杠

### 错误 3: Supabase 连接失败

**错误信息**：
```
Error: Invalid API key
```

**解决方法**：
1. 检查是否混淆了 anon key 和 service_role key
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` 应该用 anon key
3. `SUPABASE_SERVICE_ROLE_KEY` 应该用 service_role key

### 错误 4: Stripe Webhook 失败

**错误信息**：
```
Error: No signatures found matching the expected signature
```

**解决方法**：
1. 确保 webhook secret 正确
2. 在 Stripe Dashboard 检查 endpoint URL 是否正确
3. 测试模式下用 test endpoint，生产用 live endpoint

---

## 🔍 如何检查环境变量是否正确？

### 本地开发

**检查方法**：
```bash
# 在项目中创建测试文件 test-env.js
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Anthropic Key:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
// ... 其他变量

# 运行
node test-env.js
```

### 生产环境（Vercel）

**检查方法**：
1. 进入 Vercel 项目
2. Settings → Environment Variables
3. 查看所有已设置的变量
4. 确认没有遗漏

---

## 📊 环境变量快速检查清单

### 本地开发 (.env.local)

```bash
✅ NEXT_PUBLIC_SUPABASE_URL - 有值
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY - 有值
✅ SUPABASE_SERVICE_ROLE_KEY - 有值
✅ ANTHROPIC_API_KEY - 有值
✅ NEXTAUTH_SECRET - 随机字符串
✅ NEXTAUTH_URL - http://localhost:3000
✅ GOOGLE_CLIENT_ID - 有值
✅ GOOGLE_CLIENT_SECRET - 有值
✅ STRIPE_SECRET_KEY - sk_test_...
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - pk_test_...
✅ STRIPE_WEBHOOK_SECRET - whsec_...
✅ RESEND_API_KEY - re_...
```

### 生产环境 (Vercel)

```bash
✅ 所有上面的变量都有
✅ NEXTAUTH_URL = 您的域名
✅ NEXT_PUBLIC_SITE_URL = 您的域名
✅ STRIPE_SECRET_KEY - sk_live_...（上线后）
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - pk_live_...（上线后）
```

---

## 💡 提示和最佳实践

### 1. 安全性
- ✅ 永远不要把 `.env.local` 提交到 Git
- ✅ 已有 `.gitignore` 忽略此文件
- ✅ 生产环境变量只在 Vercel 中设置

### 2. 命名规范
- ✅ `NEXT_PUBLIC_*` 开头的变量会在浏览器暴露
- ✅ 没有 `NEXT_PUBLIC_*` 的只在服务器端

### 3. 管理密钥
- ✅ 使用密码管理器保存所有密钥
- ✅ 为不同项目使用不同的密钥
- ✅ 定期轮换密钥（安全最佳实践）

### 4. 测试环境
- ✅ 先在本地测试（.env.local）
- ✅ 确认无误后再部署
- ✅ 先用 Stripe 测试模式

---

## 🎯 快速设置流程

### 30 分钟设置指南

**第 1 步: Supabase（5 分钟）**
```
1. 登录 supabase.com
2. 获取 URL, anon key, service_role key
3. 复制到记事本
```

**第 2 步: Anthropic（3 分钟）**
```
1. 登录 console.anthropic.com
2. 创建 API key
3. 复制到记事本
```

**第 3 步: NextAuth（2 分钟）**
```
1. 运行 openssl rand -base64 32
2. 复制结果
```

**第 4 步: Google OAuth（10 分钟）**
```
1. 创建 Google Cloud 项目
2. 配置 OAuth consent screen
3. 创建 OAuth 客户端 ID
4. 复制 Client ID 和 Secret
```

**第 5 步: Stripe（5 分钟）**
```
1. 登录 dashboard.stripe.com
2. 复制 test keys
3. 创建 webhook endpoint
4. 复制 webhook secret
```

**第 6 步: Resend（2 分钟）**
```
1. 注册 resend.com
2. 创建 API key
3. 复制 key
```

**第 7 步: 配置到 Vercel（3 分钟）**
```
1. 在 Vercel 部署页面
2. 逐个粘贴所有环境变量
3. 点击 Deploy
```

**完成！** ✅

---

## 📞 还是不明白？

### 按优先级配置

**必须配置（应用才能运行）**：
```bash
1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY
3. SUPABASE_SERVICE_ROLE_KEY
4. ANTHROPIC_API_KEY
5. NEXTAUTH_SECRET
6. NEXTAUTH_URL
7. GOOGLE_CLIENT_ID
8. GOOGLE_CLIENT_SECRET
```

**推荐配置（功能完整）**：
```bash
9. STRIPE_SECRET_KEY
10. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
11. STRIPE_WEBHOOK_SECRET
12. RESEND_API_KEY
```

**可选配置**：
```bash
13. NEXT_PUBLIC_SITE_URL
```

---

## 🎓 总结

**环境变量就是**：
- 应用的配置信息
- 安全的密钥管理方式
- 让同一代码在不同环境运行

**配置流程**：
1. 从各个服务获取密钥
2. 粘贴到 .env.local（本地）或 Vercel（生产）
3. 重启应用/重新部署

**检查是否正确**：
- 本地运行应用，测试各项功能
- 生产环境查看 Vercel 日志

---

**现在明白了吗？** 😊

还有疑问可以问我具体哪个服务的配置！
