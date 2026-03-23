# 数据库设置指南

## ⚠️ 重要：必须运行数据库迁移！

登录功能需要 Supabase 数据库表。请按照以下步骤设置：

---

## 📋 方法 1：在 Supabase Dashboard 中运行（推荐）

### 1. 打开 Supabase SQL Editor

1. 访问：https://supabase.com/dashboard
2. 选择您的项目
3. 点击左侧菜单 **SQL Editor**
4. 点击 **New query**

### 2. 创建 Users 表和 Invoices 表

复制以下 SQL 并运行：

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  credits_remaining INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  invoice_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  po_number VARCHAR(100),
  payment_method VARCHAR(100),
  paid_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. 创建 Profiles 表

复制以下 SQL 并运行：

```sql
-- Create user profiles table
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 4. 创建 Logos Storage Bucket

1. 在 Supabase Dashboard 中，点击 **Storage**
2. 点击 **Create a new bucket**
3. 名称输入：`logos`
4. **Public bucket**: 勾选
5. 点击 **Create bucket**

### 5. 设置 Storage Policy（允许用户上传）

在 **SQL Editor** 中运行：

```sql
-- Allow authenticated users to upload logos
CREATE POLICY "Users can upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logsos');

-- Allow public access to logos
CREATE POLICY "Public can view logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'logos');
```

---

## ✅ 验证设置

### 1. 检查表是否创建成功

在 **SQL Editor** 中运行：

```sql
-- 查看所有表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

应该看到：`credit_purchases`, `invoices`, `profiles`, `users`

### 2. 检查 Storage Bucket

1. 点击 **Storage**
2. 应该看到 `logos` bucket

---

## 🚀 完成后

现在可以测试登录了！

1. 访问您的网站
2. 点击 "Sign in with Google"
3. 应该能成功登录

---

## ❓ 遇到问题？

### 错误：Access Denied

**原因**：数据库表未创建

**解决**：按照上面的步骤运行 SQL

### 错误：relation "users" does not exist

**原因**：Users 表未创建

**解决**：运行第 2 步的 SQL

### 错误：relation "profiles" does not exist

**原因**：Profiles 表未创建

**解决**：运行第 3 步的 SQL

---

## 📞 需要帮助？

如果还有问题，请检查 Vercel 部署日志中的错误信息。
