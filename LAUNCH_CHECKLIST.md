# 🚀 上线检查清单

## ✅ 代码状态（已完成）

### 核心功能 ✅
- ✅ 用户认证（Google OAuth）
- ✅ AI 发票生成
- ✅ PDF 生成和下载
- ✅ 发票列表和管理
- ✅ 用户设置和公司信息
- ✅ Logo 上传
- ✅ 多币种支持（20+ 币种）
- ✅ 折扣和税务计算
- ✅ Stripe 支付集成
- ✅ 邮件发送（Resend）

### SEO 优化 ✅
- ✅ 元数据配置
- ✅ Open Graph 和 Twitter Cards
- ✅ 结构化数据（Schema.org）
- ✅ Sitemap
- ✅ Robots.txt
- ✅ PWA Manifest

### 设计 ✅
- ✅ 深色主题 + 霓虹绿强调色
- ✅ 响应式设计
- ✅ 紧凑布局

---

## 📋 上线前必做（Critical）

### 1. 数据库迁移 ⚠️ **必须执行**
```bash
# 登录 Supabase Dashboard
# 1. 进入 SQL Editor
# 2. 执行文件: supabase/migrations/002_create_profiles.sql
# 3. 创建 Storage bucket (logos)
# 4. 设置 bucket 为 public
```

**详细步骤**: 参考 `DATABASE_MIGRATION.md`

### 2. 环境变量配置 ⚠️ **必须配置**

在 Vercel 中设置（或本地 .env.local）:

```bash
# 必需
ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Resend（邮件）
RESEND_API_KEY=your_resend_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 可选
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Google OAuth 配置 ⚠️ **必须更新**

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 更新授权重定向 URI：
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
3. 重新生成 Client Secret

### 4. Stripe Webhook 配置 ⚠️ **必须配置**

1. 登录 Stripe Dashboard
2. 添加 Webhook 端点：
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
3. 复制 Webhook Secret 到环境变量

---

## 📸 可选但推荐（Recommended）

### 1. 创建 SEO 图片
**影响**: 社交媒体分享效果

```bash
# 必需图片（public/ 目录）
public/og-image.png           # 1200x630
public/twitter-image.png      # 1200x600
public/favicon.ico            # 32x32
public/favicon-16x16.png      # 16x16
public/apple-touch-icon.png   # 180x180
public/icon-192.png           # 192x192
public/icon-512.png           # 512x512
```

**快速创建**: 访问 https://favicon.io （2分钟）

**详细指南**: `public/images/README.md`

### 2. 更新域名配置
**文件**:
- `app/sitemap.ts` (line 4)
- `public/robots.txt` (line 10)
- `app/layout.tsx` (line 36)
- 环境变量 `NEXT_PUBLIC_SITE_URL`

**替换**: `yourdomain.com` → 实际域名

### 3. Google Search Console（可选）
1. 访问 https://search.google.com/search-console
2. 添加网站
3. 提交 sitemap.xml
4. 获取验证码添加到 `app/layout.tsx`

---

## 🚀 部署步骤（Vercel）

### 方式 1: 通过 Vercel Dashboard（推荐）

1. **访问 Vercel**
   ```
   https://vercel.com/new
   ```

2. **导入项目**
   - 连接 GitHub 账号
   - 选择 `invoice-ai` 仓库
   - 点击 "Import"

3. **配置项目**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **添加环境变量**
   - 在 Vercel Dashboard 中逐个添加上面列出的环境变量
   - 或者从 .env.local 复制

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 完成！✅

6. **配置自定义域名**（可选）
   - 在 Project Settings → Domains
   - 添加您的域名
   - 按照 Vercel 的 DNS 配置说明操作

### 方式 2: 通过 Vercel CLI

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

## ✅ 部署后验证

### 1. 功能测试
```bash
□ 登录功能正常
□ AI 生成发票正常
□ PDF 下载正常
□ 发票列表显示正常
□ 设置页保存正常
□ Logo 上传正常
□ 多币种显示正常
□ Stripe 支付正常
□ 邮件发送正常
```

### 2. SEO 测试
```bash
□ Lighthouse 得分 > 90
□ Meta 标签正确
□ Open Graph 正确
□ Twitter Card 正确
□ Sitemap 可访问: /sitemap.xml
□ Robots.txt 可访问: /robots.txt
```

### 3. 性能测试
```bash
□ 首页加载 < 3 秒
□ PDF 生成 < 5 秒
□ AI 响应 < 10 秒
```

---

## 🎯 快速上线流程（30 分钟）

### Step 1: 数据库设置（10 分钟）
```bash
1. 登录 Supabase
2. 执行 002_create_profiles.sql
3. 创建 logos bucket
4. 设置为 public
```

### Step 2: 环境变量准备（5 分钟）
```bash
1. 复制所有 API keys
2. 准备粘贴到 Vercel
```

### Step 3: 部署到 Vercel（10 分钟）
```bash
1. 访问 vercel.com/new
2. 导入 GitHub 仓库
3. 添加环境变量
4. 点击 Deploy
```

### Step 4: 验证（5 分钟）
```bash
1. 测试登录
2. 测试 AI 生成
3. 测试 PDF 下载
```

**完成！** 🎉

---

## 📊 上线后第一周

### Day 1-2: 监控和修复
- 检查错误日志
- 修复发现的 bug
- 优化性能

### Day 3-4: 小规模测试
- 邀请 10-20 个朋友测试
- 收集反馈
- 快速迭代

### Day 5-7: 准备发布
- Product Hunt 发布
- Reddit 分享
- Twitter 宣发

---

## 🆘 常见问题

### Q1: 部署后登录失败？
**A**: 检查 NEXTAUTH_URL 和 Google OAuth 回调 URL

### Q2: AI 生成失败？
**A**: 检查 ANTHROPIC_API_KEY 是否正确

### Q3: PDF 生成失败？
**A**: 检查服务器日志，可能是内存问题（Vercel 免费版限制）

### Q4: Stripe 支付失败？
**A**: 检查 webhook secret 和端点配置

### Q5: 图片上传失败？
**A**: 检查 Supabase Storage bucket 是否为 public

---

## 📞 紧急联系

如果遇到问题：
1. 检查 Vercel 部署日志
2. 检查 Supabase logs
3. 检查浏览器 Console
4. 参考各服务文档

---

## 🎉 准备好了吗？

**上线前最后检查**：
```bash
✅ 数据库迁移已执行
✅ 环境变量已配置
✅ OAuth 回调已更新
✅ Stripe Webhook 已配置
✅ 代码已推送到 GitHub
✅ 本地测试通过
```

**如果是，点击 Deploy！** 🚀

---

**预计上线时间**: 30 分钟
**预计成本**: $20/月（Vercel Pro）
**预计用户**: 第一个月 100-500 用户

祝上线顺利！🎉
