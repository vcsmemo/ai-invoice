# GitHub 部署指南 🚀

本指南将协助您将 `invoice-ai` 项目部署到 GitHub，并连接到 Vercel 实现自动部署。

## 第一步：初始化本地 Git 仓库

在您的终端中运行以下命令：

```bash
# 1. 进入项目目录
cd /Users/johntian/invoice-ai

# 2. 初始化 Git
git init

# 3. 添加所有文件
git add .

# 4. 提交更改
git commit -m "Initialize project for deployment"
```

## 第二步：在 GitHub 上创建仓库

1. 登录您的 [GitHub](https://github.com/) 账号。
2. 点击右上角的 **+** 图标，选择 **New repository**。
3. 填写 **Repository name** (例如 `invoice-ai`)。
4. 选择 **Public** 或 **Private**（推荐 Private 以保护您的配置）。
5. **不要**勾选 "Initialize this repository with a README"（项目已有 README）。
6. 点击 **Create repository**。

## 第三步：将代码推送到 GitHub

在 GitHub 仓库页面找到 "push an existing repository from the command line" 部分的命令，通常如下：

```bash
# 替换为您的 GitHub 仓库 URL
git remote add origin https://github.com/您的用户名/invoice-ai.git
git branch -M main
git push -u origin main
```

## 第四步：连接到 Vercel (推荐托管方案)

由于 Next.js 包含 API 路由和服务器端功能，Vercel 是最佳的托管平台。

1. 访问 [Vercel](https://vercel.com/) 并使用 GitHub 账号登录。
2. 点击 **Add New...** -> **Project**。
3. 在 "Import Git Repository" 中找到刚才创建的 `invoice-ai` 仓库，点击 **Import**。
4. 在 **Environment Variables** 部分，根据 `.env.example` 文件添加以下变量：
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET` (运行 `openssl rand -base64 32` 生成一个)
   - `NEXTAUTH_URL` (部署后的真实域名或 Vercel 提供的临时域名)
   - `STRIPE_SECRET_KEY` (如需支付功能)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
5. 点击 **Deploy**。

## 第五步：完成！

部署完成后，Vercel 会为您提供一个访问链接（例如 `https://invoice-ai-xxx.vercel.app`）。

---

### 常见问题

- **数据库报错**：确保您的 Supabase 数据库已正确配置，且环境变量在 Vercel 中设置无误。
- **权限问题**：如果您无法推送到 GitHub，请检查您的 SSH Key 或 Personal Access Token 设置。
