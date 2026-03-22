# Database Migration Guide

This guide will help you set up the new database tables and columns for the enhanced invoice features.

## 🚀 Quick Start

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the migration**
   - Copy the SQL from `supabase/migrations/002_create_profiles.sql`
   - Paste it into the SQL editor
   - Click "Run" or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

4. **Create Storage Bucket for Logos**
   - Go to "Storage" in the left sidebar
   - Click "Create a new bucket"
   - Name it: `logos`
   - Make it **Public** bucket
   - Set File size limit: 2MB
   - Allowed MIME types: `image/png`, `image/jpeg`, `image/jpg`, `image/gif`

5. **Set up Storage Policies** (Optional but recommended)
   ```sql
   -- Users can upload to their own folder
   CREATE POLICY "Users can upload their own logos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

   -- Users can view their own logos
   CREATE POLICY "Users can view their own logos"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'logos' AND (storage.foldername(name))[1] = auth.uid()::text);

   -- Public can view all logos (needed for PDF generation)
   CREATE POLICY "Public can view logos"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'logos');
   ```

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
supabase db push

# Create storage bucket
supabase storage create --name logos --public
```

## 📋 What's Being Created?

### 1. Profiles Table
Stores user company and invoice settings:
- Company name, logo, address
- Phone, website, tax ID
- Payment instructions
- Default currency, tax rate
- Invoice prefix, payment terms

### 2. Invoices Table Updates
Adds new fields to track invoices:
- `status`: draft, sent, viewed, paid, overdue
- `po_number`: Purchase order number
- `payment_method`: How the customer paid
- `paid_at`: When the invoice was paid

### 3. Storage Bucket
- **Bucket name**: `logos`
- **Purpose**: Store user-uploaded company logos
- **Structure**: `/{user_id}/{timestamp}.{ext}`

## ✅ Verification

After running the migration, verify everything works:

### 1. Check Tables
```sql
-- Verify profiles table exists
SELECT * FROM profiles LIMIT 1;

-- Check invoices table has new columns
SELECT
  id,
  status,
  po_number,
  payment_method,
  paid_at
FROM invoices
LIMIT 1;
```

### 2. Test in App
1. Go to http://localhost:3001/settings
2. Fill in your company information
3. Upload a logo
4. Save settings
5. Create an invoice - your info should appear!

## 🐛 Troubleshooting

### Error: "relation 'profiles' does not exist"
**Solution**: Run the migration SQL in Supabase Dashboard

### Error: "Bucket 'logos' not found"
**Solution**:
1. Go to Storage in Supabase Dashboard
2. Create bucket named `logos`
3. Make it public

### Logo upload fails
**Solution**:
1. Check bucket exists and is public
2. Verify storage policies (see Option 1, step 5)
3. Check file size is under 2MB
4. Verify file type is an image

### Invoice number not using custom prefix
**Solution**:
1. Go to Settings page
2. Set your invoice prefix (e.g., "INV", "ACME")
3. Save settings
4. Create new invoice

## 🔄 Rollback (If Needed)

If you need to undo the changes:

```sql
-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;

-- Drop profiles table
DROP TABLE IF EXISTS profiles CASCADE;

-- Remove new columns from invoices
ALTER TABLE invoices
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS po_number,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS paid_at;

-- Drop storage bucket (delete files first!)
-- This must be done in the Supabase Dashboard UI
```

## 📞 Support

If you encounter issues:
1. Check Supabase logs: https://supabase.com/dashboard → Your Project → Logs
2. Verify environment variables are set
3. Try running the migration SQL manually in the Dashboard

## 🎉 Next Steps

After migration:
1. ✅ Go to `/settings` and fill in your company info
2. ✅ Upload your logo
3. ✅ Set your default tax rate and payment terms
4. ✅ Create an invoice and see all your info in action!
