# ⚡ 5 分钟快速部署指南

## 🎯 开始前准备

### ✅ 检查清单
```bash
□ GitHub 仓库已创建并推送代码
□ Supabase 项目已创建
□ Anthropic API Key
□ Google OAuth 凭证
□ Stripe 账号
```

---

## 📝 Step 1: 执行数据库迁移（必须）

### 1.1 登录 Supabase
```
https://supabase.com/dashboard
```

### 1.2 执行 SQL
1. 点击左侧 **SQL Editor**
2. 点击 **New Query**
3. 粘贴以下 SQL（或打开 `supabase/migrations/002_create_profiles.sql`）：

```sql
-- 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  logo_url TEXT,
  address TEXT,
  phone VARCHAR(50),
  website VARCHAR(255),
  tax_id VARCHAR(100),
  payment_instructions TEXT,
  default_currency VARCHAR(3) DEFAULT 'USD',
  default_tax_rate DECIMAL(5,2) DEFAULT 0,
  invoice_prefix VARCHAR(20) DEFAULT 'INV',
  payment_terms VARCHAR(50) DEFAULT 'Net 30',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 更新 invoices 表（添加新字段）
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS po_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP;

-- 创建 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. 点击 **Run** ✅

### 1.3 创建 Storage Bucket
1. 点击左侧 **Storage**
2. 点击 **New bucket**
3. 名称: `logos`
4. Public bucket: ✅ 是
5. 点击 **Create bucket**

---

## 🔧 Step 2: 准备环境变量

### 复制这个模板，填入您的值：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (Claude AI)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://www.aiinvoicegenerators.com

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Resend (邮件)
RESEND_API_KEY=re_xxxxx

# 可选
NEXT_PUBLIC_SITE_URL=https://www.aiinvoicegenerators.com
```

### 如何获取这些值？

**Supabase**:
```
1. Supabase Dashboard → Project Settings → API
2. 复制 URL, anon key, service_role key
```

**Anthropic**:
```
1. https://console.anthropic.com
2. API Keys → Create Key
```

**Google OAuth**:
```
1. https://console.cloud.google.com
2. Credentials → OAuth 2.0 Client IDs
3. Create Credentials → OAuth Client ID
```

**Stripe**:
```
1. https://dashboard.stripe.com
2. Developers → API Keys
3. 复制 Publishable key 和 Secret key
4. Webhooks → Add endpoint → 获取 signing secret
```

**Resend**:
```
1. https://resend.com
2. API Keys → Create API Key
```

**NextAuth Secret**:
```bash
# 在终端运行生成随机字符串
openssl rand -base64 32
```

---

## 🚀 Step 3: 部署到 Vercel

### 方式 A: 网页部署（推荐）

1. **访问 Vercel**
   ```
   https://vercel.com/new
   ```

2. **导入 GitHub 仓库**
   - 点击 "Import Git Repository"
   - 选择 `invoice-ai`
   - 点击 "Import"

3. **配置项目**
   ```
   Project Name: invoice-ai
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Install Command: npm install
   ```

4. **添加环境变量**
   - 展开 "Environment Variables"
   - 逐个添加 Step 2 中的所有环境变量
   - 或者粘贴 .env.local 内容

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 看到 "Congratulations!" 即成功 ✅

6. **获取部署 URL**
   ```
   https://invoice-ai.vercel.app
   或自定义域名
   ```

### 方式 B: CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 按提示操作
```

---

## ✅ Step 4: 配置域名（可选）

### 使用 Vercel 提供的域名
```
https://invoice-ai.vercel.app
✅ 立即可用，无需配置
```

### 使用自定义域名

1. **在 Vercel 中添加域名**
   ```
   Project Settings → Domains → Add Domain
   输入: www.aiinvoicegenerators.com
   ```

2. **配置 DNS**
   ```
   类型: CNAME
   名称: @
   值: cname.vercel-dns.com
   ```

3. **等待 DNS 传播**（5-30 分钟）

4. **更新环境变量**
   ```
   NEXTAUTH_URL=https://www.aiinvoicegenerators.com
   NEXT_PUBLIC_SITE_URL=https://www.aiinvoicegenerators.com
   ```

---

## 🔐 Step 5: 更新 Google OAuth 回调

### 重要！部署后必须做

1. **访问 Google Cloud Console**
   ```
   https://console.cloud.google.com
   ```

2. **选择 OAuth 客户端**
   ```
   APIs & Services → Credentials
   点击 OAuth 2.0 Client ID
   ```

3. **添加授权重定向 URI**
   ```
   https://www.aiinvoicegenerators.com/api/auth/callback/google
   ```

4. **保存**

---

## 🧪 Step 6: 测试部署

### 必测功能

```bash
1. 访问首页
   https://www.aiinvoicegenerators.com

2. 测试登录
   点击 "Sign In" → Google

3. 测试 AI 生成
   输入: "Create invoice for 5 hours at $100/hour"

4. 测试 PDF 下载
   点击 "Download PDF"

5. 测试多币种
   Settings → 选择 EUR → 生成发票
```

### 如果有问题？

**查看日志**:
```
Vercel Dashboard → Project → Deployments → View Logs
```

**常见错误**:
- 404: 部署未完成，等待 1-2 分钟
- 登录失败: 检查 NEXTAUTH_URL 和 OAuth 回调
- AI 失败: 检查 ANTHROPIC_API_KEY
- PDF 失败: 检查 Vercel 日志（可能是内存问题）

---

## 🎉 完成后的优化（可选）

### 1. 创建 SEO 图片（2 分钟）
```
访问: https://favicon.io
创建: Logo, Favicon, OG Image
下载并放入 public/ 目录
重新部署
```

### 2. 配置 Google Search Console
```
1. https://search.google.com/search-console
2. 添加网站
3. 验证域名
4. 提交 sitemap.xml
```

### 3. 测试 Stripe Webhook
```
1. Stripe Dashboard → Webhooks
2. 发送测试事件
3. 检查是否接收成功
```

---

## 📊 预期结果

### 部署成功后，您将拥有：

✅ 完整的 AI 发票生成器
✅ Google 登录
✅ PDF 下载
✅ 多币种支持（20+ 币种）
✅ Stripe 支付
✅ 邮件发送
✅ SEO 优化
✅ 响应式设计
✅ 深色主题

### 预计成本：

```
Vercel Pro:    $20/月
Supabase:      $0/月（免费额度）
Claude API:    ~$20-50/月（根据使用量）
Stripe:        2.9% + $0.30/交易
Resend:        $0/月（免费 3000 封/月）
─────────────────────────────
总计:          ~$40-70/月
```

---

## 🚀 现在就开始！

**总耗时**: 约 20-30 分钟

1. ⏱️ 5 分钟 - 数据库迁移
2. ⏱️ 5 分钟 - 准备环境变量
3. ⏱️ 10 分钟 - Vercel 部署
4. ⏱️ 5 分钟 - 测试验证

**完成后**: 您的应用将上线，可被全世界访问！🎉

---

## 🆘 需要帮助？

### 文档参考
- `LAUNCH_CHECKLIST.md` - 完整检查清单
- `DATABASE_MIGRATION.md` - 数据库详细步骤
- `DEPLOYMENT_GUIDE.md` - 部署详细指南
- `SEO_COMPLETE.md` - SEO 相关说明

### 常见问题
- 参考 `LAUNCH_CHECKLIST.md` 中的 "常见问题" 部分

### 服务文档
- Vercel: https://vercel.com/docs
- Supabase: https://supabase.com/docs
- Anthropic: https://docs.anthropic.com

---

**准备好了吗？点击部署！** 🚀
