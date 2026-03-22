# 🌐 纯浏览器部署指南 - 完全不用命令行

**适合人群**: 不熟悉命令行的用户
**操作方式**: 全部在浏览器和图形界面完成
**预计时间**: 1.5-2 小时

---

## 🎯 总体流程

```
步骤 1: GitHub Desktop 上传代码（15 分钟）
   ↓
步骤 2: Supabase 网页创建数据库（15 分钟）
   ↓
步骤 3: 各服务网页注册配置（30 分钟）
   ↓
步骤 4: Vercel 网页部署（15 分钟）
   ↓
步骤 5: 浏览器测试验证（5 分钟）
```

---

## 1️⃣ 步骤 1: 用 GitHub Desktop 上传代码（15 分钟）

### 1.1 下载安装 GitHub Desktop

1. 打开浏览器，访问：https://desktop.github.com/
2. 点击 **"Download for macOS"**（或 Windows）
3. 下载完成后，打开安装包
4. 按提示安装（拖到 Applications 文件夹）

### 1.2 登录 GitHub Desktop

1. 打开 **GitHub Desktop** 应用
2. 点击 **"Sign in"**
3. 选择 **"Sign in to GitHub.com"**
4. 浏览器会打开，登录您的 GitHub 账号
5. 授权 GitHub Desktop
6. 回到应用，点击 **"Continue"**

### 1.3 创建本地仓库

1. 在 GitHub Desktop，点击左上角 **"File"** → **"Add Local Repository..."**
2. 点击 **"Choose..."** 按钮
3. 找到并选择您的项目文件夹：
   ```
   /Users/johntian/invoice-ai
   ```
4. 点击 **"Add Repository"**

### 1.4 创建 .gitignore 文件

1. 在 **访达（Finder）** 中，打开项目文件夹
2. 右键点击空白处 → **"新建文件"**
3. 命名为：`.gitignore`（注意前面有个点）
4. 用文本编辑器打开，粘贴以下内容：

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

5. 保存文件（Cmd+S）

### 1.5 在 GitHub 创建远程仓库

1. 打开浏览器，访问：https://github.com
2. 登录后，点击右上角 **"+"** → **"New repository"**
3. 填写信息：
   ```
   Repository name: invoice-ai
   Description: AI-powered invoice generator
   选择: Private（私有）
   ⚠️ 不要勾选任何选项
   ```
4. 点击 **"Create repository"**

### 1.6 推送代码到 GitHub

**回到 GitHub Desktop**：

1. 查看主窗口，应该看到您的文件列表
2. 在左下角 **"Summary"** 框输入：
   ```
   Initial commit: AI Invoice Generator
   ```
3. 点击左下角 **"Commit to main"** 按钮
4. 点击顶部 **"Publish repository"** 按钮
5. 弹出窗口：
   ```
   Name: invoice-ai
   Description: AI-powered invoice generator
   Visibility: Private
   ```
6. 点击 **"Publish repository"**

**完成！** 代码已上传到 GitHub。

### ✅ 验证成功

1. 打开浏览器：https://github.com
2. 您应该能看到 **invoice-ai** 仓库
3. 点击进入，能看到所有代码文件

---

## 2️⃣ 步骤 2: 在 Supabase 网页创建数据库（15 分钟）

### 2.1 注册 Supabase

1. 打开浏览器：https://supabase.com
2. 点击右上角 **"Sign In"** 或 **"Start your project"**
3. 可以用 GitHub 账号登录（推荐）

### 2.2 创建项目

1. 登录后，点击 **"New Project"** 按钮
2. 填写信息：

   **Organization**（如果没有）：
   ```
   点击 "New organization"
   Name: personal
   Plan: Free
   点击 "Create organization"
   ```

   **Project**:
   ```
   Name: invoice-ai
   Database Password: 设置一个密码（记住它！）
   Region: Southeast Asia (Singapore)
   Pricing plan: Free
   ```
3. 点击 **"Create new project"**
4. 等待 1-2 分钟

### 2.3 执行数据库脚本

1. **在 Supabase 项目页面**
2. 找到左侧菜单，点击 **SQL Editor**（图标是个数据库）
   - 或点击 **Database** → 顶部 **SQL Editor**
3. 点击 **"New query"** 按钮

4. **打开本地文件**：
   ```
   在访达中打开：
   /Users/johntian/invoice-ai/supabase/migrations/002_create_profiles.sql
   ```

5. **复制整个文件内容**（Cmd+A 全选，Cmd+C 复制）

6. **粘贴到 Supabase 的 SQL Editor**（点击文本框，Cmd+V 粘贴）

7. 点击右下角 **"Run"** ▶️ 按钮

8. **确认成功**：
   - 右边显示 "Success. No rows returned"
   - 或绿色勾号 ✅

### 2.4 创建 Storage Bucket（Logo 上传用）

1. 在 Supabase 项目，左侧菜单点击 **Storage**（图标是个桶）
2. 点击 **"New bucket"** 按钮
3. 填写：
   ```
   Name: logos
   Public bucket: ✅ 勾选
   File size limit: 5MB
   ```
4. 点击 **"Create bucket"**

### 2.5 获取 API Keys

1. 左侧菜单 → **⚙️ Settings**（最下边齿轮图标）→ **API**
2. 向下滚动，找到 3 个重要信息：

   **Project URL**:
   ```
   点击右侧的复制按钮 📋
   粘贴到记事本，标记为: SUPABASE_URL
   ```

   **anon public key**:
   ```
   向下滚动找到 "anon public"
   点击复制 📋
   粘贴到记事本: SUPABASE_ANON_KEY
   ```

   **service_role key**:
   ```
   继续向下找到 "service_role"
   点击复制 📋
   粘贴到记事本: SUPABASE_SERVICE_KEY
   ```

### ✅ 步骤 2 完成！

记事本应该有：
```bash
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_KEY = eyJhbGc...
```

---

## 3️⃣ 步骤 3: 各服务网页注册配置（30 分钟）

### 3.1 Anthropic（Claude AI）- 5 分钟

1. 访问：https://console.anthropic.com
2. 点击 **"Sign In"** 或 **"Sign Up"**
3. 注册/登录

**创建 API Key**：

4. 左侧菜单 → **API Keys**
5. 点击 **"Create Key"** 按钮
6. 填写：
   ```
   Name: invoice-ai-production
   ```
7. 点击 **"Create key"**
8. **立即复制显示的 key**（只显示一次！）
   ```
   sk-ant-api03-xxxxxxxxx
   ```
9. 粘贴到记事本：`ANTHROPIC_API_KEY`

### 3.2 Google OAuth - 10 分钟

#### 创建 Google Cloud 项目

1. 访问：https://console.cloud.google.com
2. 登录 Google 账号
3. 点击顶部项目选择器（可能是 "Select a project"）
4. 点击 **"NEW PROJECT"**
5. 填写：
   ```
   Project name: invoice-ai
   ```
6. 点击 **"CREATE"**

#### 启用 Google+ API

7. 左侧菜单 → **APIs & Services** → **Library**
8. 搜索框输入：**"Google+ API"**
9. 点击结果，然后点击 **"ENABLE"**

#### 配置 OAuth 同意屏幕

10. 左侧菜单 → **APIs & Services** → **OAuth consent screen**
11. 选择 **"External"** → 点击 **"Create"**
12. 填写：
    ```
    App name*: AI Invoice Generator
    User support email*: 您的邮箱
    Developer contact*: 您的邮箱
    ```
13. 点击 **"SAVE AND CONTINUE"**
14. 后续页面直接点击 **"SAVE AND CONTINUE"**（跳过）

#### 创建 OAuth 凭证

15. 左侧菜单 → **APIs & Services** → **Credentials**
16. 点击 **"+ CREATE CREDENTIALS"**
17. 选择 **"OAuth client ID"**

18. 填写：
    ```
    Application type: Web application
    Name: AI Invoice Generator

    Authorized redirect URIs:
    点击 "ADD URI"
    添加: http://localhost:3000/api/auth/callback/google
    ```

19. 点击 **"CREATE"**

20. 复制显示的 **Client ID** 和 **Client Secret**
    ```
    粘贴到记事本：
    GOOGLE_CLIENT_ID = xxxxx.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET = GOCSPX-xxxxx
    ```

### 3.3 生成 NextAuth Secret - 1 分钟

1. 访问：https://generate-secret.vercel.app/32
2. 页面会自动生成一个随机字符串
3. 点击 **"Copy"** 按钮
4. 粘贴到记事本：`NEXTAUTH_SECRET`

### 3.4 Stripe（支付）- 7 分钟

#### 注册和获取 API Keys

1. 访问：https://dashboard.stripe.com
2. 点击 **"Start now"**
3. 可以先点击 **"Skip account onboarding"**（测试模式）

4. **确保右上角是 Test mode**（测试模式开关打开）

5. 左侧菜单 → **Developers** → **API keys**

6. 复制两个 key：
   ```
   Publishable key:
   pk_test_51XXXXX
   粘贴到记事本: STRIPE_PUBLISHABLE_KEY

   Secret key:
   sk_test_51XXXXX
   粘贴到记事本: STRIPE_SECRET_KEY
   ```

#### 创建 Webhook Endpoint

7. 左侧菜单 → **Developers** → **Webhooks**
8. 点击 **"Add endpoint"**
9. 填写：
    ```
    Endpoint URL:
    http://localhost:3000/api/stripe/webhook

    Events to send:
    点击 "Select events"
    搜索并选择：
    ✅ checkout.session.completed
    ✅ payment_intent.succeeded
    ```
10. 点击 **"Add events"**
11. 点击 **"Add endpoint"**

12. 点击新创建的 endpoint
13. 找到 **"Signing secret"** → 点击 **"Click to reveal"**
14. 复制 secret：
    ```
    whsec_xxxxx
    粘贴到记事本: STRIPE_WEBHOOK_SECRET
    ```

### 3.5 Resend（邮件）- 2 分钟

1. 访问：https://resend.com
2. 点击 **"Sign Up"**
3. 填写信息注册

4. 登录后，左侧菜单 → **API Keys**
5. 点击 **"Add API Key"** 或 **"Create API Key"**
6. 填写：
   ```
   Name: invoice-ai
   ```
7. 点击 **"Create"**
8. 复制显示的 API key：
   ```
   re_xxxxx
   粘贴到记事本: RESEND_API_KEY
   ```

### ✅ 步骤 3 完成！

您的记事本现在应该有所有 13 个密钥！

---

## 4️⃣ 步骤 4: 在 Vercel 网页部署（15 分钟）

### 4.1 注册 Vercel

1. 打开浏览器：https://vercel.com
2. 点击右上角 **"Sign Up"** 或 **"Log In"**
3. **推荐：点击 "Continue with GitHub"**（最简单）
4. 授权 Vercel 访问 GitHub

### 4.2 导入 GitHub 仓库

1. 登录后，会看到 **"Import Git Repository"** 页面
   - 或点击 **"Add New..."** → **"Project"**

2. 在 **"Import Git Repository"** 部分：
   - 找到 **"invoice-ai"** 仓库
   - 点击右侧 **"Import"** 按钮

### 4.3 配置项目

#### 项目信息（页面会自动填充）

```
Project Name: invoice-ai
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Install Command: npm install
```

**不要改这些，保持默认！**

#### 环境变量配置（重点！）

向下滚动找到 **"Environment Variables"** 部分

**逐个添加以下 13 个变量**：

##### 1. Supabase（3 个）

点击 **"Add New"** 按钮：

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co（从记事本复制）
点击 "Add"
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc...（从记事本复制）
点击 "Add"
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc...（从记事本复制）
点击 "Add"
```

##### 2. Anthropic（1 个）

```
Name: ANTHROPIC_API_KEY
Value: sk-ant-api03-xxxxx（从记事本复制）
点击 "Add"
```

##### 3. NextAuth（2 个）

```
Name: NEXTAUTH_SECRET
Value: xxxxx（从记事本复制）
点击 "Add"
```

```
Name: NEXTAUTH_URL
Value: https://invoice-ai.vercel.app
⚠️ 注意：保持这个默认值，部署后用 Vercel 提供的域名
点击 "Add"
```

##### 4. Google OAuth（2 个）

```
Name: GOOGLE_CLIENT_ID
Value: xxxxx.apps.googleusercontent.com（从记事本复制）
点击 "Add"
```

```
Name: GOOGLE_CLIENT_SECRET
Value: GOCSPX-xxxxx（从记事本复制）
点击 "Add"
```

##### 5. Stripe（3 个）

```
Name: STRIPE_SECRET_KEY
Value: sk_test_51XXXXX（从记事本复制）
点击 "Add"
```

```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51XXXXX（从记事本复制）
点击 "Add"
```

```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_xxxxx（从记事本复制）
点击 "Add"
```

##### 6. Resend（1 个）

```
Name: RESEND_API_KEY
Value: re_xxxxx（从记事本复制）
点击 "Add"
```

##### 7. 可选（1 个）

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://invoice-ai.vercel.app
点击 "Add"
```

### 4.4 开始部署

1. **检查清单**：
   - ✅ 所有 13 个环境变量都已添加
   - ✅ 没有拼写错误
   - ✅ 值都从记事本正确复制

2. 点击页面底部 **"Deploy"** 按钮

3. 开始部署，显示进度：
   ```
   ⏳ Building...
   ⏳ Deploying...
   ```

4. 等待 2-3 分钟

### 4.5 部署完成

成功后会显示：

```
🎉 Congratulations!

Your deployment is ready.

Production: https://invoice-ai.vercel.app
```

**复制这个 URL！** 这是您的新网站地址。

### ✅ 步骤 4 完成！

```bash
✅ 应用已部署到 Vercel
✅ 网站地址: https://invoice-ai.vercel.app
✅ 可以访问了！
```

---

## 5️⃣ 步骤 5: 浏览器测试验证（5 分钟）

### 5.1 访问您的网站

打开浏览器，访问：
```
https://invoice-ai.vercel.app
```

### 5.2 测试功能

#### ✅ 测试 1: 首页加载

```
□ 首页能正常打开
□ 看到标题 "AI Invoice Generator"
□ 看到产品介绍
```

#### ✅ 测试 2: Google 登录

```
□ 点击右上角 "Sign In" 按钮
□ 看到 Google 登录按钮
□ 点击 "Sign in with Google"
□ 选择您的 Google 账号
□ 授权后，跳转回网站
□ 登录成功（看到 "Generate Invoice" 按钮）
```

#### ✅ 测试 3: AI 生成发票

```
□ 点击 "Generate Invoice" 或 "+" 按钮
□ 输入框中输入：
   Create invoice for 5 hours web development at $100/hour
□ 点击发送/生成
□ 等待 AI 响应（5-10 秒）
□ 看到生成的发票预览
□ 检查金额：
   - Subtotal: $500
   - Total: $500
```

#### ✅ 测试 4: PDF 下载

```
□ 在发票预览页面
□ 点击 "Download PDF" 按钮
□ PDF 文件下载到电脑
□ 打开 PDF，检查格式正确
```

#### ✅ 测试 5: 设置页面

```
□ 点击右上角 "Settings" 菜单
□ 能看到设置页面
□ 修改 "Company Name"
□ 点击 "Save Changes" 按钮
□ 看到绿色提示 "Settings saved successfully"
```

#### ✅ 测试 6: 多币种

```
□ Settings 页面
□ Currency 下拉菜单选择 "EUR (€)"
□ 点击 "Save Changes"
□ 回到 "Generate Invoice"
□ 输入同样的内容生成发票
□ 检查金额显示为 € 符号
```

### 5.3 如果有错误

#### 错误 1: 无法登录

**可能原因**: Google OAuth 回调 URL 没添加生产环境

**解决方法**：

1. 回到：https://console.cloud.google.com
2. APIs & Services → Credentials
3. 点击您的 OAuth 客户端 ID
4. 在 **"Authorized redirect URIs"** 添加：
   ```
   https://invoice-ai.vercel.app/api/auth/callback/google
   ```
5. 点击 **"Save"**
6. 重新测试登录

#### 错误 2: AI 生成失败

**检查方法**：

1. 回到 Vercel：https://vercel.com/dashboard
2. 找到 **invoice-ai** 项目
3. 点击 **Deployments** → 点击最新部署
4. 查看 **"Function Logs"**
5. 找到错误信息

**常见原因**：
- ANTHROPIC_API_KEY 错误
- 检查环境变量是否正确复制

#### 错误 3: PDF 下载失败

**可能原因**: Vercel 免费版内存不足

**解决方法**：
- 升级到 Vercel Pro 计划（$20/月）

---

## 6️⃣ 步骤 6: 上线后配置（必须做！）

### 6.1 更新 Google OAuth（必须）

**重要！** 部署后必须添加生产环境回调 URL。

1. 访问：https://console.cloud.google.com
2. APIs & Services → Credentials
3. 点击您的 OAuth 客户端 ID
4. 在 **"Authorized redirect URIs"** 中：
   ```
   点击 "ADD URI"
   添加: https://invoice-ai.vercel.app/api/auth/callback/google
   ```
5. 点击 **"Save"**

### 6.2 更新 Stripe Webhook（必须）

测试环境的 webhook 不能用于生产。

1. 访问：https://dashboard.stripe.com
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
7. 复制这个新的 secret

8. **更新 Vercel 环境变量**：
   - 访问 Vercel Dashboard
   - 找到 **invoice-ai** 项目
   - Settings → Environment Variables
   - 找到 `STRIPE_WEBHOOK_SECRET`
   - 更新值为新的 secret
   - 点击 **"Save"**

9. **重新部署**：
   - Vercel Dashboard → Deployments
   - 点击最新部署右侧的 **"..."**
   - 点击 **"Redeploy"**

### ✅ 步骤 6 完成！

```bash
✅ Google OAuth 已更新
✅ Stripe Webhook 已更新
✅ 应用已重新部署
✅ 所有功能正常
```

---

## 🎉 恭喜！您已成功上线！

### 您现在拥有：

```bash
✅ GitHub 仓库: https://github.com/yourusername/invoice-ai
✅ 在线网站: https://invoice-ai.vercel.app
✅ 完整功能: AI 生成、PDF 下载、多币种、支付
```

### 可以分享给朋友了！

直接发送这个链接：
```
https://invoice-ai.vercel.app
```

---

## 💰 费用说明

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

### 第一个月免费

Vercel 新用户有试用额度，可以免费测试！

---

## 📊 后续优化（可选）

### 1. 创建 SEO 图片（2 分钟）

**作用**: 社交媒体分享时显示图片

1. 访问：https://favicon.io
2. 上传 Logo 或输入文字（比如 "AI"）
3. 选择颜色：
   ```
   Background: #080808（黑色）
   Text Color: #c8f542（霓虹绿）
   ```
4. 点击 **"Download"**，下载所有文件

5. **上传到 Vercel**：
   - 在 Vercel 项目中
   - 点击 **"Storage"** → **"Files"**
   - 上传图片文件到 `public/` 目录
   - 或通过 GitHub Desktop 上传到本地，然后推送

### 2. 配置自定义域名（可选）

如果想要自己的域名（比如 `invoice-ai.com`）：

1. 在 Vercel 项目
2. Settings → Domains
3. 添加您的域名
4. 按照 Vercel 的 DNS 配置说明操作

---

## 🆘 常见问题快速解答

### Q: 登录失败，提示错误
**A**: 检查 Google OAuth 是否添加了 `https://invoice-ai.vercel.app/api/auth/callback/google`

### Q: AI 生成不工作
**A**:
1. 检查 Vercel 环境变量 `ANTHROPIC_API_KEY` 是否正确
2. 查看 Vercel Function Logs

### Q: PDF 下载失败
**A**: Vercel 免费版限制，升级到 Pro 计划

### Q: 图片上传失败
**A**: 检查 Supabase Storage bucket 是否设置为 public

---

## 📞 需要帮助？

告诉我：
- 您在哪一步卡住了
- 看到了什么错误提示
- 截图更好（如果可以）

我会帮您解决！💪

---

## 🎯 快速参考

### 重要网址

```
GitHub: https://github.com
Vercel: https://vercel.com
Supabase: https://supabase.com
Anthropic: https://console.anthropic.com
Google Cloud: https://console.cloud.google.com
Stripe: https://dashboard.stripe.com
Resend: https://resend.com
```

### 您的网站

```
开发环境: http://localhost:3000（本地）
生产环境: https://invoice-ai.vercel.app（线上）
```

---

**🎉 现在开始吧！全部用浏览器操作，6 个步骤即可上线！**
