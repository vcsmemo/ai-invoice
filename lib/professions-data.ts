export interface ProfessionPage {
  slug: string
  title: string
  h1: string
  description: string
  metaDescription: string
  valueProp: string
  examples: string[]
  commonItems: string[]
  rateRange: string
  faqs: Array<{
    question: string
    answer: string
  }>
  relatedProfessions: string[]
}

export const professions: Record<string, ProfessionPage> = {
  freelancer: {
    slug: 'freelancer',
    title: 'Free AI Invoice Generator for Freelancers',
    h1: 'AI Invoice Generator for Freelancers',
    description: 'Free AI-powered invoice generator specifically designed for freelancers. Create professional invoices in 30 seconds by describing your work in plain English.',
    metaDescription: 'Free AI invoice generator for freelancers. Just describe your work and get a professional invoice in 30 seconds. No templates needed. Perfect for independent contractors.',
    valueProp: 'Unlike traditional invoice templates that require manual data entry, our AI understands your freelance work and automatically generates accurate invoices.',
    examples: [
      'Web development for StartupXYZ, 40 hours at $85/hour, total $3,400',
      'Logo design package for Acme Corp - 3 concepts, 2 revisions, flat fee $1,800',
      'Content writing: 10 blog posts at $150 each, total $1,500',
      'Consulting call with ABC Company - 2 hours at $200/hour',
      'UI/UX design for mobile app - 3 weeks project, $5,000 flat fee',
    ],
    commonItems: [
      'Hourly consulting services',
      'Project-based work',
      'Retainer agreements',
      'Recurring services',
      'Milestone-based payments',
    ],
    rateRange: '$50-200/hour (depending on expertise and industry)',
    faqs: [
      {
        question: 'What information should I include on my freelancer invoices?',
        answer: 'Your freelancer invoices should include: your business name and contact details, client information, detailed description of services, hourly rate or project fee, total amount, payment terms (e.g., Net 15 or Net 30), and your tax ID if applicable.',
      },
      {
        question: 'How do I handle invoicing for international clients?',
        answer: 'For international clients, clearly state your preferred currency and payment method. Consider using digital payment platforms like Wise, Payoneer, or PayPal. Specify whether bank transfer is accepted and include any necessary SWIFT/BIC codes.',
      },
      {
        question: 'Should I include payment terms on freelancer invoices?',
        answer: 'Yes, always include clear payment terms such as Net 15 (payment due within 15 days), Net 30, or Due on Receipt. For new clients, consider requesting partial payment upfront - this is common in freelancing to protect against late payments.',
      },
      {
        question: 'Can I use this AI invoice generator for free?',
        answer: 'Yes! You get 5 free credits per month. Each invoice generation and download counts as one credit. No credit card required to start. Simply sign in to track your credits and invoice history.',
      },
    ],
    relatedProfessions: ['designer', 'developer', 'consultant'],
  },
  photographer: {
    slug: 'photographer',
    title: 'Free AI Invoice Generator for Photographers',
    h1: 'AI Invoice Generator for Photographers',
    description: 'Create professional photography invoices in seconds. Simply describe your shoot (wedding, portrait, event) and our AI generates a detailed invoice with line items.',
    metaDescription: 'Free AI invoice generator for photographers. Perfect for wedding, portrait, and event photography. Auto-calculate totals. Instant PDF download.',
    valueProp: 'Photography invoices need to capture session details, deliverables, and usage rights - our AI handles all of this from your simple description.',
    examples: [
      'Wedding photography for Maria & John - 6 hours coverage, 2 photographers, engagement session, digital files, $2,800',
      'Product photography for eCommerce store - 50 products, white background, 2-day turnaround, $1,500',
      'Corporate headshots for ABC Company team - 15 employees, on-location, retouched photos, $1,200',
      'Event photography - TechCrunch Disrupt conference, half-day coverage, social media ready images, $3,500',
      'Real estate photography for 10 properties - exterior and interior shots, HDR processing, 24h delivery, $2,000',
    ],
    commonItems: [
      'Session fee / Hourly rate',
      'Number of hours covered',
      'Number of photographers',
      'Digital files / USB delivery',
      'Photo editing / retouching',
      'Printing costs',
      'Travel expenses',
      'Usage rights (commercial, editorial, etc.)',
    ],
    rateRange: '$100-500/hour or $1,500-5,000 per event',
    faqs: [
      {
        question: 'What should be included in a photography invoice?',
        answer: 'Include your business info, client details, date and type of photography service, hours of coverage, number of photographers, deliverables (digital files, prints, album), editing services, delivery timeline, usage rights, and total fee.',
      },
      {
        question: 'How do I charge for photography services?',
        answer: 'Common pricing models include: hourly rate ($100-500/hour), half-day ($800-1,500), full-day ($1,500-3,000), per project, or per image. Wedding photography often packages: engagement session + wedding day coverage + album starting from $2,500-5,000.',
      },
      {
        question: 'Should I include usage rights in my photography invoice?',
        answer: 'Absolutely. Always specify usage rights: personal use, commercial use, editorial use, or unlimited. Commercial usage typically costs 2-3x more than personal use. Clearly state what the client can do with the photos.',
      },
      {
        question: 'How quickly should I deliver photos to clients?',
        answer: 'Delivery times vary: event photographers typically deliver within 1-2 weeks, portrait photographers within 3-5 days, product/commercial photographers within 24-48 hours. Always specify your delivery timeline in the invoice or contract.',
      },
    ],
    relatedProfessions: ['designer', 'contractor', 'freelancer'],
  },
  designer: {
    slug: 'designer',
    title: 'Free AI Invoice Generator for Designers',
    h1: 'AI Invoice Generator for Designers',
    description: 'Create professional design invoices instantly. Describe your design work (logo, website, brand identity) and AI generates a complete invoice with proper line items.',
    metaDescription: 'Free AI invoice generator for graphic, web, and UI/UX designers. Instant PDF invoices. Perfect for freelancers and design studios.',
    valueProp: 'Design invoices need to specify deliverables, revisions, and file formats - our AI extracts these details from your natural language description.',
    examples: [
      'Logo design for TechStart Inc - 3 initial concepts, 2 revision rounds, final files in AI, SVG, PNG formats, $2,500',
      'Website UI/UX design for mobile app - 20 screens, 2 design iterations, Figma files and assets, $4,500',
      'Brand identity package for Coffee Co - logo, color palette, typography, brand guidelines, business cards, $3,200',
      'Social media graphics pack - 20 posts for Instagram and Facebook, sized and ready to post, $800',
      'Presentation design for investor deck - 15 slides, custom icons and charts, 2 revision rounds, $1,800',
    ],
    commonItems: [
      'Project type (logo, website, brand identity, etc.)',
      'Number of concepts/mockups',
      'Number of revisions included',
      'Deliverable file formats',
      'Project phases (discovery, design, revisions)',
      'License type (exclusive, non-exclusive)',
      'Rush fees (if applicable)',
    ],
    rateRange: '$50-150/hour or $1,000-10,000 per project',
    faqs: [
      {
        question: 'How do I price design projects?',
        answer: 'Design pricing varies widely: logo design $500-5,000, website design $3,000-15,000, brand identity $2,000-10,000. Consider factors like project complexity, number of revisions, your experience level, and client budget. Always specify what\'s included in your price.',
      },
      {
        question: 'Should I charge for revisions?',
        answer: 'Yes! Your invoice should specify how many revision rounds are included. Common practice: 2-3 rounds included, then charge hourly ($50-150/hour) for additional revisions. This prevents scope creep and ensures clients are invested in the feedback process.',
      },
      {
        question: 'What deliverables should I list on my design invoice?',
        answer: 'List all deliverables with their formats: logo (AI, SVG, PNG, EPS), website (Figma/Sketch/Adobe XD), brand guidelines (PDF), business cards (print-ready files), social media avatars, etc. Be specific about sizes and versions.',
      },
      {
        question: 'How do I handle design project milestones?',
        answer: 'For larger projects, consider milestone billing: 25% deposit to start work, 25% on concept approval, 25% on final design, 25% on file delivery. Your invoice should reference the project milestones and payment schedule.',
      },
    ],
    relatedProfessions: ['freelancer', 'developer', 'photographer'],
  },
}
