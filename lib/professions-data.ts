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
  developer: {
    slug: 'developer',
    title: 'Free AI Invoice Generator for Developers',
    h1: 'AI Invoice Generator for Developers',
    description: 'Create professional developer invoices in seconds. Describe your work (web app, mobile app, API) and AI generates a complete invoice with milestones and hourly rates.',
    metaDescription: 'Free AI invoice generator for software developers and programmers. Perfect for web dev, mobile apps, APIs. Track hours, sprints, and milestones.',
    valueProp: 'Development invoices need to track hours, sprints, and milestone deliveries - our AI understands technical work and generates accurate invoices.',
    examples: [
      'Full-stack web development for StartupXYZ - React frontend, Node.js backend, 120 hours at $100/hour, total $12,000',
      'Mobile app development - iOS and Android, 3-month project, milestone payments: $5,000 deposit, $10,000 on beta, $10,000 on launch',
      'API development and integration - RESTful API, 3 endpoints, authentication, documentation, $4,500 flat fee',
      'Bug fixing and maintenance - 20 hours at $85/hour, priority support, 48-hour turnaround',
      'Database optimization - Query optimization, indexing, performance tuning, $3,000 flat fee',
    ],
    commonItems: [
      'Development hours / Sprint-based billing',
      'Project milestones (design, development, testing, deployment)',
      'Hourly rate or project-based pricing',
      'Tech stack details',
      'Code review and maintenance',
      'Deployment and DevOps',
      'Post-launch support and warranty',
      'Licensing and IP rights',
    ],
    rateRange: '$75-200/hour or $5,000-50,000 per project',
    faqs: [
      {
        question: 'How should I price development projects?',
        answer: 'Developer pricing varies widely: junior developers $50-75/hour, mid-level $75-125/hour, senior $125-200/hour. Project-based: simple website $3,000-10,000, web application $10,000-50,000+, mobile apps $15,000-75,000+. Consider your expertise, project complexity, and timeline.',
      },
      {
        question: 'Should I bill hourly or use fixed pricing for development?',
        answer: 'Hourly billing works best for ongoing work, maintenance, or projects with unclear scope. Fixed pricing is better for well-defined projects with clear requirements. Many developers use hybrid approaches: fixed quote for core features + hourly for changes and additions.',
      },
      {
        question: 'What should I include in my developer invoices?',
        answer: 'Include: project description and tech stack, hours worked or milestone completion, hourly rate or project fee, total amount, payment terms (Net 15-30), any third-party costs (APIs, hosting), and project timeline. Be specific about what\'s included (support period, bug fixes, documentation).',
      },
      {
        question: 'How do I handle scope creep in development projects?',
        answer: 'Clearly define the original scope in your invoice or contract. For changes outside the scope, create a separate change order with additional costs. Many developers include a "scope buffer" of 10-15% in their estimates. Always communicate that additional features require additional billing.',
      },
    ],
    relatedProfessions: ['freelancer', 'designer', 'consultant'],
  },
  consultant: {
    slug: 'consultant',
    title: 'Free AI Invoice Generator for Consultants',
    h1: 'AI Invoice Generator for Consultants',
    description: 'Create professional consulting invoices instantly. Describe your engagement (strategy, management, financial) and AI generates a detailed invoice with hourly rates and retainers.',
    metaDescription: 'Free AI invoice generator for consultants. Perfect for strategy, management, IT, and financial consulting. Hourly billing, retainers, and expenses.',
    valueProp: 'Consulting invoices require precise time tracking and clear deliverables - our AI extracts these details from your description and creates professional invoices.',
    examples: [
      'Strategic consulting for ABC Corp - 3-month engagement, 10 hours/month at $250/hour, monthly retainer $2,500',
      'Management consulting - Process optimization, 40 hours total at $300/hour, plus expenses $1,200, total $13,200',
      'IT infrastructure assessment - 2-week project, 5 on-site days, written report and recommendations, $8,500 flat fee',
      'Financial planning and analysis - Quarterly review, 15 hours at $200/hour, deliverables: financial model and strategic recommendations',
      'Change management consulting - 6-month project, weekly workshops, executive coaching, $25,000 per month retainer',
    ],
    commonItems: [
      'Hourly consulting rate',
      'Retainer agreements (monthly/quarterly)',
      'Project phases (assessment, strategy, implementation)',
      'Meeting and preparation time',
      'Travel expenses',
      'Deliverables (reports, presentations, roadmaps)',
      'Phone and email support',
      'Expenses (materials, software, travel)',
    ],
    rateRange: '$150-500/hour or $2,000-25,000 per month retainer',
    faqs: [
      {
        question: 'What should I include on my consulting invoices?',
        answer: 'Include: your business info and credentials, client information, engagement description, date range covered, hours worked or deliverables completed, hourly rate or retainer fee, expenses (if any), total amount, payment terms, and any follow-up actions or next steps included.',
      },
      {
        question: 'Should I use retainer or hourly billing for consulting?',
        answer: 'Retainers provide predictable income and work best for ongoing advisory relationships. Hourly billing works better for project-based work with defined scopes. Many consultants use hybrid models: monthly retainer for core services + hourly for additional work outside the scope.',
      },
      {
        question: 'How do I handle expenses on consulting invoices?',
        answer: 'List expenses separately from your consulting fees. Include: date, description, and amount for each expense. Common reimbursable expenses: travel (flights, hotels, meals), materials, software licenses, research tools. Always get client approval for large expenses in advance.',
      },
      {
        question: 'What payment terms should consultants use?',
        answer: 'Standard terms: Net 15 for individual clients, Net 30 for corporate clients. For retainers: payment in advance at the start of each billing period. For large projects: 25-50% deposit upfront, with milestone payments throughout. Always include late payment penalties (typically 1-2% per month).',
      },
    ],
    relatedProfessions: ['freelancer', 'developer', 'writer'],
  },
  writer: {
    slug: 'writer',
    title: 'Free AI Invoice Generator for Writers',
    h1: 'AI Invoice Generator for Writers',
    description: 'Create professional writer invoices in seconds. Describe your work (blog posts, copywriting, editing) and AI generates an invoice with per-word or per-project pricing.',
    metaDescription: 'Free AI invoice generator for writers and content creators. Perfect for bloggers, copywriters, editors, and journalists. Per-word, per-article, or project billing.',
    valueProp: 'Writing invoices need to specify deliverables, word counts, and revision rounds - our AI understands these details from your natural language description.',
    examples: [
      'Blog writing package - 10 blog posts, 1,000 words each, 2 revisions included, $150 per post, total $1,500',
      'Website copywriting - 5 landing pages, 500 words each, SEO optimized, $200 per page, total $1,000',
      'Editing services - Manuscript editing, 50,000 words, developmental editing, $0.02 per word, total $1,000',
      'Technical documentation - User manual, 20 pages, screenshots and diagrams, $3,000 flat fee',
      'Content strategy + writing - Content calendar, 12 months of blog content, strategy consulting, $5,000 per month retainer',
    ],
    commonItems: [
      'Per-word rate',
      'Per-article / per-post rate',
      'Project-based pricing',
      'Number of revision rounds included',
      'Word count or page count',
      'Research and interview time',
      'SEO optimization',
      'Rush fees (fast turnaround)',
      'Usage rights (one-time, exclusive, etc.)',
    ],
    rateRange: '$0.05-0.50/word or $50-500 per article or $50-150/hour',
    faqs: [
      {
        question: 'How should I price my writing services?',
        answer: 'Writing pricing varies by type and experience: blog posts $100-500 each, website copy $200-800 per page, editing $0.01-0.05 per word, technical writing $75-150/hour. Consider factors: your expertise, research required, turnaround time, and usage rights. Build a rate sheet and adjust based on client budgets.',
      },
      {
        question: 'Should I charge per word, per project, or hourly?',
        answer: 'Per-word pricing is common for content writing and journalism. Per-project works well for defined deliverables like white papers or website copy. Hourly billing fits best for editing, research-heavy work, or ongoing content strategy. Choose what aligns with your work style and client expectations.',
      },
      {
        question: 'What should I include on my writer invoices?',
        answer: 'Include: your business info, client details, description of work (article title, topic, word count), rate applied (per-word, per-project, or hourly), number of revisions included, total fee, payment terms, and rights granted (one-time use, exclusive, etc.). Specify if research, interviews, or SEO are included.',
      },
      {
        question: 'How do I handle revisions in my writing invoices?',
        answer: 'Specify how many revision rounds are included in your price (typically 2-3). Additional revisions should be billed at your hourly rate or as a separate line item. This prevents scope creep and ensures clients provide consolidated feedback. Clearly communicate that changes to scope (like additional research) will incur extra charges.',
      },
    ],
    relatedProfessions: ['freelancer', 'designer', 'consultant'],
  },
}
