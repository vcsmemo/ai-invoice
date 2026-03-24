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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Settings] Save failed:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to save profile');
      }

      const data = await response.json();
      console.log('[Settings] Save success:', data);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('[Settings] Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);

      // Show detailed error in alert for debugging
      if (error instanceof Error) {
        alert(`Save Failed: ${error.message}\n\nPlease check F12 Console for details.`);
      }
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
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="flex-1 px-6 py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Company Settings</h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Configure your business information to appear on invoices
            </p>
          </div>

          {/* Save Status Banner */}
          {saveStatus === 'success' && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium">Settings saved successfully!</p>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm font-medium">Failed to save settings. Please try again.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-tight"># company_logo</h3>

              <div className="flex items-start gap-6">
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  {profile.logo_url ? (
                    <div className="relative w-24 h-24 bg-muted/20 rounded-lg border border-border flex items-center justify-center overflow-hidden">
                      <img src={profile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-1 right-1 p-1 bg-background/80 rounded border border-border text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
                        title="Remove logo"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-muted/20 rounded-lg border border-border flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
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
                      <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm glow-accent">
                        <Upload className="w-4 h-4" />
                        {isSaving ? 'Uploading...' : 'Upload Logo'}
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground font-mono">PNG, JPG up to 2MB</p>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-primary h-full transition-all duration-300 shadow-sm"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    Recommended: Square logo, transparent background, at least 200x200px
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight"># company_info</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Company Name</label>
                  <input
                    type="text"
                    value={profile.company_name || ''}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="Your Company LLC"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Business Address</label>
                  <textarea
                    value={profile.address || ''}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="123 Business Street&#10;City, State 12345&#10;Country"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={profile.tax_id || ''}
                    onChange={(e) => setProfile({ ...profile, tax_id: e.target.value })}
                    placeholder="12-3456789"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest opacity-70">Will appear on invoices for tax purposes</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight"># payment_info</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Payment Instructions</label>
                  <textarea
                    value={profile.payment_instructions || ''}
                    onChange={(e) => setProfile({ ...profile, payment_instructions: e.target.value })}
                    placeholder="Please include invoice number in payment reference.&#10;&#10;Bank transfer:&#10;Bank: Example Bank&#10;Account: XXXXXXXXXX&#10;Routing: XXXXXXXXXX&#10;&#10;PayPal: payments@yourcompany.com"
                    rows={8}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono resize-none overflow-y-auto"
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest opacity-70">These instructions will appear on all invoices</p>
                </div>
              </div>
            </div>

            {/* Invoice Settings */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-tight"># invoice_defaults</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Currency</label>
                    <select
                      value={profile.default_currency}
                      onChange={(e) => setProfile({ ...profile, default_currency: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono cursor-pointer"
                    >
                      {getSupportedCurrencies().map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Invoice Prefix</label>
                    <input
                      type="text"
                      value={profile.invoice_prefix}
                      onChange={(e) => setProfile({ ...profile, invoice_prefix: e.target.value.toUpperCase() })}
                      placeholder="INV"
                      maxLength={10}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Default Tax Rate (%)</label>
                    <input
                      type="number"
                      value={profile.default_tax_rate}
                      onChange={(e) => setProfile({ ...profile, default_tax_rate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Default Payment Terms</label>
                  <select
                    value={profile.payment_terms}
                    onChange={(e) => setProfile({ ...profile, payment_terms: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono cursor-pointer"
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
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 glow-accent shadow-lg flex items-center gap-2"
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
