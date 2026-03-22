# Deployment Guide

## Quick Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd invoice-ai
vercel
```

### 4. Add Custom Domain (Optional)
In Vercel dashboard:
1. Go to project settings
2. Domains → Add Domain
3. Update DNS records as instructed

## Environment Variables

Set these in Vercel project settings:

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Pre-deployment Checklist

- [ ] Test all invoice templates
- [ ] Test PDF generation
- [ ] Test free limit (3 invoices)
- [ ] Test upgrade flow
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test all pages load correctly
- [ ] Check Google Search Console
- [ ] Submit sitemap to GSC

## Post-deployment

1. **Google Search Console**
   - Add property
   - Submit sitemap.xml
   - Request indexing

2. **Analytics** (Optional)
   - Add Google Analytics
   - Add PostHog/Mixpanel

3. **Monitoring**
   - Set up Vercel Analytics
   - Configure error tracking

## Performance Optimization

- Images optimized via Next.js Image
- Static pages pre-rendered
- CSS inlined via Tailwind
- PDF generation client-side (no server load)

## SEO Tasks After Launch

1. Submit sitemap to Google & Bing
2. Create Google Business Profile
3. Submit to directories (100+)
4. Create social accounts
5. Post on Product Hunt
6. Share on Reddit
7. Create blog content

## Custom Domain Setup

1. Buy domain (Namecheap, GoDaddy, etc.)
2. In Vercel: Domains → Add Domain
3. Update nameservers:
   - NS1.VERCEL.DNS
   - NS2.VERCEL.DNS
4. Wait for DNS propagation (1-48 hours)
5. Enable SSL (automatic in Vercel)

## Monitoring

Check regularly:
- Vercel dashboard for errors
- Google Search Console for indexing
- Analytics for traffic
- Page speed (Core Web Vitals)
