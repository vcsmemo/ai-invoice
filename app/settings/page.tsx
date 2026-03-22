'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Building2, Upload, Save, Check, AlertCircle, Globe, Phone, CreditCard, FileText } from 'lucide-react';
import { Profile } from '@/lib/supabase';
import { getSupportedCurrencies } from '@/lib/currencies';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [profile, setProfile] = useState<Partial<Profile>>({
    company_name: '',
    address: '',
    phone: '',
    website: '',
    tax_id: '',
    payment_instructions: '',
    default_currency: 'USD',
    default_tax_rate: 0,
    invoice_prefix: 'INV',
    payment_terms: 'Net 30',
    logo_url: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setIsSaving(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/user/upload-logo', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) throw new Error('Failed to upload logo');

      const data = await response.json();
      setProfile((prev) => ({ ...prev, logo_url: data.logoUrl }));

      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = async () => {
    setProfile((prev) => ({ ...prev, logo_url: '' }));
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[rgb(200,245,66)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 px-6 py-28">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <Building2 className="w-5 h-5 text-[rgb(200,245,66)]" />
              <h1 className="text-3xl font-semibold text-[rgb(250,250,250)]">Company Settings</h1>
            </div>
            <p className="text-[rgb(180,180,180)]">
              Configure your business information to appear on invoices
            </p>
          </div>

          {/* Save Status Banner */}
          {saveStatus === 'success' && (
            <div className="mb-6 p-4 bg-[rgba(200,245,66,0.1)] border border-[rgba(200,245,66,0.3)] rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-[rgb(200,245,66)]" />
              <p className="text-sm text-[rgb(250,250,250)]">Settings saved successfully!</p>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mb-6 p-4 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[rgb(239,68,68)]" />
              <p className="text-sm text-[rgb(250,250,250)]">Failed to save settings. Please try again.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] p-6">
              <h3 className="text-lg font-semibold text-[rgb(250,250,250)] mb-4">Company Logo</h3>

              <div className="flex items-start gap-6">
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  {profile.logo_url ? (
                    <div className="relative w-24 h-24 bg-[rgb(24,24,24)] rounded-lg border border-[rgba(255,255,255,0.08)] flex items-center justify-center overflow-hidden">
                      <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-1 right-1 p-1 bg-[rgba(0,0,0,0.8)] rounded text-[rgb(250,250,250)] hover:bg-[rgb(200,245,66)] hover:text-[rgb(8,8,8)] transition-colors"
                        title="Remove logo"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-[rgb(24,24,24)] rounded-lg border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-[rgb(80,80,80)]" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={isSaving}
                      />
                      <div className="px-4 py-2 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-lg text-sm font-medium hover:bg-[rgb(180,230,60)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {isSaving ? 'Uploading...' : 'Upload Logo'}
                      </div>
                    </label>
                    <p className="text-xs text-[rgb(120,120,120)]">PNG, JPG up to 2MB</p>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="w-full bg-[rgb(24,24,24)] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[rgb(200,245,66)] h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <p className="text-xs text-[rgb(180,180,180)] mt-2">
                    Recommended: Square logo, transparent background, at least 200x200px
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] p-6">
              <h3 className="text-lg font-semibold text-[rgb(250,250,250)] mb-6">Company Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Company Name</label>
                  <input
                    type="text"
                    value={profile.company_name || ''}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="Your Company LLC"
                    className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Business Address</label>
                  <textarea
                    value={profile.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(120,120,120)]" />
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(120,120,120)]" />
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={profile.tax_id || ''}
                    onChange={(e) => setProfile({ ...profile, tax_id: e.target.value })}
                    placeholder="12-3456789"
                    className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                  />
                  <p className="text-xs text-[rgb(120,120,120)] mt-1">Will appear on invoices for tax purposes</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] p-6">
              <h3 className="text-lg font-semibold text-[rgb(250,250,250)] mb-6">Payment Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Payment Instructions</label>
                  <textarea
                    value={profile.payment_instructions || ''}
                    onChange={(e) => setProfile({ ...profile, payment_instructions: e.target.value })}
                    placeholder="Please include invoice number in payment reference.&#10;&#10;Bank transfer:&#10;Bank: Example Bank&#10;Account: XXXXXXXXXX&#10;Routing: XXXXXXXXXX&#10;&#10;PayPal: payments@yourcompany.com"
                    rows={8}
                    className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)] resize-none"
                  />
                  <p className="text-xs text-[rgb(120,120,120)] mt-1">These instructions will appear on all invoices</p>
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="bg-[rgb(16,16,16)] rounded-xl border border-[rgba(255,255,255,0.08)] p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <FileText className="w-5 h-5 text-[rgb(200,245,66)]" />
                <h3 className="text-lg font-semibold text-[rgb(250,250,250)]">Invoice Defaults</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Currency</label>
                    <select
                      value={profile.default_currency}
                      onChange={(e) => setProfile({ ...profile, default_currency: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)]"
                    >
                      {getSupportedCurrencies().map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      value={profile.invoice_prefix}
                      onChange={(e) => setProfile({ ...profile, invoice_prefix: e.target.value.toUpperCase() })}
                      placeholder="INV"
                      maxLength={10}
                      className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Default Tax Rate (%)</label>
                    <input
                      type="number"
                      value={profile.default_tax_rate}
                      onChange={(e) => setProfile({ ...profile, default_tax_rate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)] placeholder:text-[rgb(120,120,120)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[rgb(180,180,180)] mb-2">Default Payment Terms</label>
                  <select
                    value={profile.payment_terms}
                    onChange={(e) => setProfile({ ...profile, payment_terms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-2 focus:ring-[rgb(200,245,66)]"
                  >
                    <option value="Due on receipt">Due on receipt</option>
                    <option value="Net 15">Net 15 days</option>
                    <option value="Net 30">Net 30 days</option>
                    <option value="Net 60">Net 60 days</option>
                    <option value="Net 90">Net 90 days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[rgb(200,245,66)] text-[rgb(8,8,8)] rounded-full font-semibold text-sm hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 glow-accent-strong flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
