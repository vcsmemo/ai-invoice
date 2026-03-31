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
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const categories = [
  { id: 'professions', name: 'By Profession', icon: Briefcase, description: 'Tailored for specific jobs' },
  { id: 'countries', name: 'By Country', icon: Globe, description: 'Regional tax compliance' },
  { id: 'styles', name: 'By Style', icon: Layout, description: 'Different design aesthetics' },
];

const professions = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    emoji: '💼',
    description: 'Perfect for independent contractors and consultants. Includes hourly rates and project-based billing.',
    examples: 'Web dev, consulting, writing, design',
    slug: 'freelancer'
  },
  {
    id: 'photographer',
    name: 'Photographer',
    emoji: '📸',
    description: 'Designed for photography professionals. Includes session fees, deliverables, and usage rights.',
    examples: 'Weddings, events, portraits, products',
    slug: 'photographer'
  },
  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    description: 'Ideal for graphic, web, and UI/UX designers. Track revisions, deliverables, and file formats.',
    examples: 'Logos, websites, brand identity',
    slug: 'designer'
  },
  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    description: 'Built for software developers. Bill by hour, sprint, or project with milestone tracking.',
    examples: 'Web apps, mobile apps, APIs',
    slug: 'developer'
  },
  {
    id: 'consultant',
    name: 'Consultant',
    emoji: '📊',
    description: 'Professional consulting invoices with hourly rates, retainer billing, and expense tracking.',
    examples: 'Strategy, management, financial',
    slug: 'consultant'
  },
  {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    description: 'For writers and content creators. Bill per word, per article, or project-based.',
    examples: 'Blog posts, copywriting, editing',
    slug: 'writer'
  },
];

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', description: 'Standard US invoice with sales tax support.' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', description: 'VAT compliant invoice for UK businesses.' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', description: 'Tax Invoice compliant with ATO standards.' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', description: 'HST/GST/PST compliant Canadian invoice.' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', description: 'Rechnung compliant with German tax laws.' },
  { code: 'FR', name: 'France', flag: '🇫🇷', description: 'Facture compliant with French regulations.' },
];

const styles = [
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean and simple design. Perfect for modern brands that prefer less clutter.',
    features: ['Simple layout', 'Focus on essentials', 'Professional appearance']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic corporate style. Ideal for established firms and B2B invoicing.',
    features: ['Traditional format', 'Detailed breakdown', 'Business-focused']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and vibrant layout. Designed for designers, artists, and creative agencies.',
    features: ['Modern design', 'Eye-catching', 'Brand-focused']
  },
];

function TemplatesContent() {
  const [activeCategory, setActiveCategory] = useState('professions');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfessions = professions.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStyles = styles.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono selection:bg-primary/30">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex-1">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Invoice Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Choose a template optimized for your profession, country, or style. Our AI will customize it based on your description.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <cat.icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{cat.name}</div>
                    <div className="text-[10px] opacity-70">{cat.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory === 'professions' && filteredProfessions.map((profession) => (
            <Link
              key={profession.id}
              href={profession.slug ? `/p/${profession.slug}` : `/generate?profession=${profession.id}`}
              className="group bg-muted/20 border border-border hover:border-primary/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{profession.emoji}</div>
                <Sparkles className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {profession.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-sans">
                {profession.description}
              </p>

              <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-2">Perfect for:</div>
                <div className="text-sm font-medium text-foreground">{profession.examples}</div>
              </div>
            </Link>
          ))}

          {activeCategory === 'countries' && filteredCountries.map((country) => (
            <Link
              key={country.code}
              href={`/generate?country=${country.code}`}
              className="group bg-muted/20 border border-border hover:border-primary/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{country.flag}</div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>

              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {country.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-sans">
                {country.description}
              </p>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {country.code}
                  </span>
                  <span className="text-sm font-bold text-primary group-hover:underline">Use Template →</span>
                </div>
              </div>
            </Link>
          ))}

          {activeCategory === 'styles' && filteredStyles.map((style) => (
            <Link
              key={style.id}
              href={`/generate?style=${style.id}`}
              className="group bg-muted/20 border border-border hover:border-primary/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                <Layout className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                {style.name}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-sans">
                {style.description}
              </p>

              <div className="pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {style.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(activeCategory === 'professions' && filteredProfessions.length === 0) ||
         (activeCategory === 'countries' && filteredCountries.length === 0) ||
         (activeCategory === 'styles' && filteredStyles.length === 0) ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No templates found matching "{searchQuery}"</p>
          </div>
        ) : null}
      </main>
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
