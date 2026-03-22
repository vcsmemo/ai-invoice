# 🚀 部署指南 - Vercel（推荐）

## ⭐ 为什么选择 Vercel？

您的 AI Invoice Generator 是一个完整的 Next.js 应用，Vercel 是**最佳选择**：

### ✅ 完美兼容
- Next.js 官方平台（由同一团队创建）
- 零配置，开箱即用
- 所有功能都能正常工作

### ✅ 零代码修改
- ✅ API Routes 完全支持
- ✅ Server Components 正常工作
- ✅ 文件上传无问题
- ✅ 认证系统完美运行

### ✅ 5分钟部署
1. 连接 GitHub
2. 导入项目
3. 设置环境变量
4. 点击 Deploy
5. 完成！

### ✅ 免费额度
- 100GB 带宽/月
- 无限部署
- 自动 HTTPS
- 全球 CDN

---

## 📋 部署前准备清单

### 1. GitHub 仓库（必须）
```bash
# 如果还没有 Git 仓库
git init
git add .
git commit -m "Ready for Vercel deployment"

# 创建 GitHub 仓库后
git remote add origin https://github.com/yourusername/invoice-ai.git
git branch -M main
git push -u origin main
```

### 2. Supabase 项目（必须）
- 确保已创建 Supabase 项目
- 运行数据库迁移（见 `DATABASE_MIGRATION.md`）
- 创建 `logos` storage bucket
- 记录 API keys

### 3. Anthropic API Key（必须）
- 访问: https://console.anthropic.com
- 创建 API key
- 记录下来

### 4. Stripe 账户（可选）
- 访问: https://dashboard.stripe.com
- 获取 API keys
- 设置 Webhook（部署后）

---

## 🚀 部署步骤（5分钟）

### Step 1: 创建 Vercel 账号
```
1. 访问: https://vercel.com
2. 点击 "Sign Up"
3. 使用 GitHub 登录（推荐）
4. 授权 Vercel 访问您的 GitHub
```

### Step 2: 导入项目
```
1. 点击 "Add New..." → "Project"
2. 从 GitHub 仓库列表中选择 "invoice-ai"
3. 点击 "Import"
```

### Step 3: 配置项目

**Framework Preset**: Next.js（自动检测）

**Build Command**: `npm run build`（自动）

**Output Directory**: `.next`（自动）

**Install Command**: `npm install`（自动）

### Step 4: 设置环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# 必需的环境变量
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://your-project.vercel.app

# Stripe（如果使用支付功能）
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**如何生成 NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### Step 5: 部署
```
1. 点击 "Deploy"
2. 等待 2-3 分钟...
3. 看到 "Congratulations!" 页面
4. 点击域名访问您的网站！
```

---

## 🌐 自定义域名（可选）

### Step 1: 购买域名
- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/

### Step 2: 在 Vercel 添加域名
```
1. 打开 Vercel Dashboard
2. 进入项目设置 → Domains
3. 点击 "Add Domain"
4. 输入您的域名（如: invoiceai.com）
5. 按照提示更新 DNS 记录
```

### Step 3: 更新 DNS
```
在您的域名注册商处：
1. 找到 DNS 设置
2. 添加 A 记录:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
3. 或者使用 CNAME:
   - Type: CNAME
   - Name: @
   - Value: cname.vercel-dns.com
```

---

## 🔄 自动部署

设置完成后，每次您推送到 GitHub：

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel 会**自动部署**您的更新！🚀

---

## 📊 部署后检查清单

### ✅ 功能测试
- [ ] 首页正常显示
- [ ] 用户可以登录/注册
- [ ] 设置页面可以访问
- [ ] AI 发票生成正常工作
- [ ] 文件上传功能正常
- [ ] PDF 下载正常
- [ ] Stripe 支付（如果启用）

### ✅ 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] Lighthouse 分数 > 90
- [ ] 无控制台错误

### ✅ SEO 检查
- [ ] Meta 标签正确
- [ ] Open Graph 标签
- [ ] robots.txt

---

## 🔧 故障排除

### 问题 1: 构建失败
**解决方案**:
```bash
# 检查本地构建
npm run build

# 如果本地构建失败，修复错误后再部署
```

### 问题 2: 环境变量未生效
**解决方案**:
1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确保**所有**环境变量都已设置
3. 重新部署项目

### 问题 3: 数据库连接错误
**解决方案**:
1. 检查 Supabase URL 是否正确
2. 确保 Supabase 项目未暂停
3. 验证 API keys 有效性

### 问题 4: 图片上传失败
**解决方案**:
1. 确保 Supabase Storage bucket 已创建
2. 检查 bucket policies
3. 验证 bucket 是 public 的

### 问题 5: Stripe 支付失败
**解决方案**:
1. 设置 Webhook URL: `https://your-domain.vercel.app/api/stripe/webhook`
2. 在 Stripe Dashboard 测试 Webhook
3. 检查环境变量是否正确

---

## 💰 成本估算

### Vercel 定价（2026年）

**免费版**:
- ✅ 100GB 带宽/月
- ✅ 无限部署
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 100个 Edge Functions

**Pro Plan ($20/月)**:
- ✅ 1TB 带宽/月
- ✅ 无限部署
- ✅ 团队协作
- ✅ 优先支持

**Hobby Plan ($0/月)**:
- 适合个人项目
- 足够的使用额度
- 生产环境就绪

### 其他服务成本

| 服务 | 免费额度 | 月成本 |
|-----|---------|--------|
| **Vercel** | 100GB 带宽 | $0-20 |
| **Supabase** | 500MB 数据库 | $0 |
| **Claude API** | 按量 | $20-50 |
| **Resend** | 3000 封邮件 | $0 |
| **Stripe** | 2.9% + $0.30/交易 | 0 |
| **域名** | - | $10/年 |
| **总计** | - | **$30-80/月** |

---

## 📈 扩展性

### 流量增长时：
1. Vercel 自动扩展（无需配置）
2. Supabase 升级到 Pro 计划（$25/月）
3. 数据库连接池（按需付费）

### 预计月成本与用户数：

| 用户数 | 月收入 | 月成本 | 利润 |
|--------|--------|--------|------|
| 100 | $500 | $50 | $450 |
| 500 | $2,500 | $100 | $2,400 |
| 1,000 | $5,000 | $200 | $4,800 |
| 5,000 | $25,000 | $500 | $24,500 |

---

## 🎯 下一步

### 立即部署：
```bash
# 1. 推送代码
git push

# 2. 访问 Vercel
https://vercel.com/new

# 3. 导入项目并设置环境变量

# 4. 点击 Deploy

# 5. 5分钟后... 🎉
```

### 部署后：
1. ✅ 运行数据库迁移
2. ✅ 测试所有功能
3. ✅ 设置自定义域名（可选）
4. ✅ 配置 Stripe Webhook
5. ✅ 设置监控和告警

---

## 🎊 恭喜！

您的 AI Invoice Generator 现在已经准备好部署到 Vercel 了！

**预计部署时间**: 5 分钟
**预计成本**: $0-80/月
**可靠性**: 99.99% Uptime

**准备好开始了吗？** 🚀

访问: https://vercel.com/new
