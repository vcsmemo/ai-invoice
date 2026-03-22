# ✅ 部署前检查清单

在部署到生产环境之前，请完成以下检查：

---

## 🔴 必须完成（否则无法部署）

### 1. GitHub 仓库
- [ ] 代码已推送到 GitHub
- [ ] 仓库是公开的或私有的（都可以）
- [ ] 主分支名称是 `main`

**命令**:
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/yourusername/invoice-ai.git
git push -u origin main
```

---

### 2. 环境变量准备

创建一个安全的笔记保存以下信息：

**从 Supabase 获取**:
- [ ] Project URL: `https://xxxxx.supabase.co`
- [ ] Anon Key: `eyJhbGci...`
- [ ] Service Role Key: `eyJhbGci...`

**从 Anthropic 获取**:
- [ ] API Key: `sk-ant-...`

**生成 NextAuth Secret**:
- [ ] Secret: 运行 `openssl rand -base64 32`

**从 Stripe 获取** (可选):
- [ ] Secret Key: `sk_test_...`
- [ ] Publishable Key: `pk_test_...`
- [ ] Webhook Secret: `whsec_...`

---

### 3. Supabase 设置

**数据库迁移**:
- [ ] 已阅读 `DATABASE_MIGRATION.md`
- [ ] 已运行 `002_create_profiles.sql`
- [ ] 已创建 `profiles` 表
- [ ] 已更新 `invoices` 表（添加新字段）
- [ ] 迁移成功无错误

**Storage 设置**:
- [ ] 已创建 `logos` bucket
- [ ] Bucket 设为 Public
- [ ] 文件大小限制: 2MB
- [ ] 已设置 Storage Policies（可选但推荐）

---

## 🟡 强烈推荐（提高成功率）

### 4. 本地测试

- [ ] `npm run build` 成功无错误
- [ ] `npm run start` 可以运行
- [ ] 所有页面正常显示
- [ ] 可以登录/注册
- [ ] AI 发票生成功能正常

---

### 5. 功能测试

在本地测试所有核心功能：

**认证**:
- [ ] Google 登录正常
- [ ] 会话持久化
- [ ] 登出功能正常

**设置页面**:
- [ ] 可以访问 `/settings`
- [ ] 可以保存公司信息
- [ ] Logo 上传成功
- [ ] 数据正确保存到数据库

**发票生成**:
- [ ] AI 生成发票正常
- [ ] 发票预览显示所有信息
- [ ] 编辑功能正常
- [ ] PDF 下载成功

**支付** (如果启用):
- [ ] Stripe checkout 正常
- [ ] Webhook 接收正常
- [ ] Credits 正确添加

---

## 🟢 可选但建议

### 6. 域名准备

- [ ] 已购买域名
- [ ] 准备好修改 DNS
- [ ] 知道如何在 Vercel 添加域名

---

### 7. 监控和分析

- [ ] Vercel Analytics（免费）
- [ ] 错误监控（Sentry 等）
- [ ] Uptime 监控

---

## 🚀 部署步骤（当所有检查完成）

### Step 1: 创建 Vercel 账号
```
1. 访问: https://vercel.com
2. 使用 GitHub 登录
3. 授权 Vercel 访问仓库
```

### Step 2: 导入项目
```
1. 点击 "New Project"
2. 选择 "invoice-ai" 仓库
3. 点击 "Import"
```

### Step 3: 配置项目
```
Framework Preset: Next.js ✅
Build Command: npm run build ✅
Output Directory: .next ✅
Install Command: npm install ✅
```

### Step 4: 设置环境变量
```
在 Vercel Dashboard → Settings → Environment Variables 添加：

ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXTAUTH_SECRET=生成的随机字符串
NEXTAUTH_URL=https://your-project.vercel.app

STRIPE_SECRET_KEY=sk_test_... (如果使用)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (如果使用)
```

### Step 5: 部署
```
1. 点击 "Deploy"
2. 等待 2-3 分钟
3. 看到 "Congratulations!"
4. 访问您的网站
```

---

## ✅ 部署后验证

### 立即测试:
- [ ] 首页可以访问
- [ ] 用户可以注册/登录
- [ ] 设置页面正常工作
- [ ] AI 发票生成正常
- [ ] Logo 上传成功
- [ ] PDF 下载正常
- [ ] Stripe 支付（如果启用）

---

## 🎯 常见问题

### Q: 构建失败？
**A**: 检查本地 `npm run build` 是否成功

### Q: 环境变量未生效？
**A**:
1. 检查 Vercel Dashboard 设置
2. 重新部署项目
3. 清除浏览器缓存

### Q: 数据库连接错误？
**A**:
1. 验证 Supabase URL 正确
2. 检查 API keys
3. 确保数据库迁移已运行

### Q: 图片上传失败？
**A**:
1. 确认 `logos` bucket 已创建
2. 检查 bucket 是 public 的
3. 验证 storage policies

---

## 📞 需要帮助？

查看完整文档：
- **部署指南**: `DEPLOYMENT_GUIDE.md`
- **数据库迁移**: `DATABASE_MIGRATION.md`
- **功能说明**: `PREVIEW_GUIDE.md`

---

## 🎉 准备好了吗？

当所有检查项都完成后，您就可以部署了！

**预计时间**: 5-10 分钟
**成功率**: 99%

**立即开始**: https://vercel.com/new
