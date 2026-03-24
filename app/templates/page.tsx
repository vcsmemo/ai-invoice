'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  ChevronRight, 
  Globe, 
  Layout, 
  Briefcase, 
  FileText, 
  Zap, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const categories = [
  { id: 'countries', name: 'By Country', icon: Globe },
  { id: 'styles', name: 'By Style', icon: Layout },
  { id: 'industries', name: 'By Industry', icon: Briefcase },
];

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', description: 'Standard US invoice with sales tax support.' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', description: 'VAT compliant invoice for UK businesses.' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', description: 'Tax Invoice compliant with ATO standards.' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', description: 'HST/GST/PST compliant Canadian invoice.' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', description: 'Rechnung compliant with German tax laws.' },
  { code: 'FR', name: 'France', flag: '🇫🇷', description: 'Facture compliant with French regulations.' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', description: 'Simplified tax invoice for Japanese businesses.' },
  { code: 'IN', name: 'India', flag: '🇮🇳', description: 'GST compliant invoice for Indian businesses.' },
];

const styles = [
  { id: 'minimal', name: 'Minimalist', description: 'Clean, simple design for modern brands.' },
  { id: 'professional', name: 'Professional', description: 'Classic corporate style for established firms.' },
  { id: 'creative', name: 'Creative', description: 'Bold and vibrant layout for designers and artists.' },
];

function TemplatesContent() {
  const [activeCategory, setActiveCategory] = useState('countries');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono selection:bg-primary/30">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex-1">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Categories</h2>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.name}</span>
                    </div>
                    {activeCategory === cat.id && <ChevronRight className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="bg-primary/5 rounded-xl border border-primary/20 p-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pro Tip</span>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  Our AI can automatically apply regional tax rules for any country you mention.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Invoice Templates</h1>
                <p className="text-sm text-muted-foreground">
                  Select a template to initialize the generator with production-ready defaults.
                </p>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all placeholder:text-white/20"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCategory === 'countries' && filteredCountries.map((country) => (
                <Link
                  key={country.code}
                  href={`/generate?country=${country.code}`}
                  className="group bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-primary/40 hover:bg-[#0f0f0f] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-90 group-hover:scale-100">{country.flag}</div>
                    <div className="text-[9px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-tighter">
                      {country.code}_standard
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                    {country.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                  </h3>
                  
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 font-sans line-clamp-2">
                    {country.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3 text-green-500/60" />
                      verified
                    </div>
                    <span className="text-[10px] font-bold text-primary group-hover:underline">USE TEMPLATE</span>
                  </div>
                </Link>
              ))}

              {activeCategory === 'styles' && styles.map((style) => (
                <Link
                  key={style.id}
                  href={`/generate?style=${style.id}`}
                  className="group bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-primary/40 hover:bg-[#0f0f0f] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
                    {style.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">{style.description}</p>
                </Link>
              ))}

              {activeCategory === 'industries' && (
                <div className="col-span-full py-20 text-center bg-white/2 rounded-xl border border-dashed border-white/5">
                  <p className="text-xs text-muted-foreground font-mono italic">
                    {`// [system]: industry_modules.loading (405 countries remaining)`}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination/Load More */}
            <div className="pt-8 text-center">
              <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all">
                Load More Templates (52)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Toggle (Simplified) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg glow-accent">
          <Layout className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-primary animate-pulse font-mono">Loading templates...</div>}>
      <TemplatesContent />
    </Suspense>
  );
}
