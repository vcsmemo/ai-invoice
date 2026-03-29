-- Add email preference fields to profiles table
-- Migration: 003_add_email_preferences
-- Created: 2025-03-26

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS auto_email_invoices BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cc_me_on_invoices BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN profiles.auto_email_invoices IS 'Automatically send invoices to client email upon creation';
COMMENT ON COLUMN profiles.cc_me_on_invoices IS 'Send a copy of all invoices to the user''s email';
