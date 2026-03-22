# 🎉 AI Invoice Generator - 部署就绪！

## ⚡ 快速开始

### 本地开发
```bash
npm install
npm run dev
```
访问: http://localhost:3000

---

## 🚀 部署到生产环境

### 推荐方案: Vercel（5分钟）⭐

**详细指南**: 查看 `DEPLOYMENT_GUIDE.md`

**快速步骤**:
1. 访问 https://vercel.com/new
2. 导入您的 GitHub 仓库
3. 设置环境变量（见 `.env.example`）
4. 点击 Deploy
5. ✅ 完成！

---

## 📋 环境变量配置

复制 `.env.example` 到 `.env.local` 并填写：

```bash
# 必需
ANTHROPIC_API_KEY=your_key
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=your_domain

# Stripe（可选）
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🗄️ 数据库设置

**必须运行数据库迁移！**

详细步骤见: `DATABASE_MIGRATION.md`

---

## 📚 文档

- **部署指南**: `DEPLOYMENT_GUIDE.md` - Vercel 部署完整指南
- **数据库迁移**: `DATABASE_MIGRATION.md` - Supabase 设置步骤
- **功能预览**: `PREVIEW_GUIDE.md` - 所有功能说明
- **功能列表**: `FEATURES_COMPLETE.md` - 完整功能清单
- **Cloudflare 说明**: `CLOUDFLARE_DEPLOYMENT.md` - 如果坚持用 Cloudflare

---

## 🎯 核心功能

✅ AI 智能发票生成
✅ 公司 Logo 上传
✅ 完整的公司信息管理
✅ PO 号码支持
✅ 折扣功能
✅ 多种付款条款
✅ 多货币支持
✅ 专业 PDF 导出
✅ Stripe 支付集成

---

## 📦 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: TailwindCSS
- **数据库**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API
- **认证**: NextAuth.js
- **支付**: Stripe
- **PDF**: @react-pdf/renderer

---

## 🆘 获取帮助

有问题？查看文档或检查：
1. 环境变量是否正确设置
2. 数据库迁移是否完成
3. Supabase Storage bucket 是否创建

---

## 📄 许可证

MIT License - 自由使用和修改
