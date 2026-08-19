/**
 * English — the source of truth for the whole site's copy.
 *
 * `Content` is derived from this object (see ./index.ts), and fr.ts / ar.ts are
 * annotated with that type, so a key missing from a translation is a build
 * error rather than a blank space on a live page. That is the entire reason
 * this file is written as a plain object and NOT `as const`: `as const` would
 * make every value a string LITERAL type, and "Accueil" is not assignable to
 * `'Home'`.
 *
 * WHAT LIVES HERE AND WHAT DOES NOT
 * Only prose. Image paths, icon names, colour tones, route paths, phone numbers
 * and dates stay in src/data/content.ts, because they are identical in every
 * language and duplicating them three times would mean a photo swap needs three
 * edits and can silently drift. The arrays below are positional — the nth entry
 * here describes the nth entry there — so ORDER IS LOAD-BEARING. If you add a
 * service, add it in the same slot in both files.
 */
export const en = {
  meta: {
    /** BCP-47, used for <html lang> and Intl date formatting. */
    locale: 'en-GB',
    /**
     * Widened deliberately. Without the annotation this infers as `string` and
     * `<html dir>` would accept anything; with `as const` it would infer as the
     * literal 'ltr' and Arabic could never be typed as `Content`.
     */
    dir: 'ltr' as 'ltr' | 'rtl',
    /** Shown in the language switcher. */
    label: 'English',
    short: 'EN',
    switchAria: 'Change language',
    /** Accessible name for the wordmark, which is a link home. */
    homeAria: 'SHIPLI — home',
  },

  nav: {
    items: [
      {
        label: 'About us',
        children: [
          {
            label: 'Business highlights',
            blurb: 'The numbers and milestones behind five years of Morocco–China trade.',
          },
          { label: 'Our strategy', blurb: 'Why we own every link of the chain instead of brokering it.' },
          { label: 'Management philosophy', blurb: 'How we make decisions when your money is in transit.' },
        ],
      },
      {
        label: 'Solutions',
        children: [
          { label: 'Sourcing', blurb: 'Direct factory access, inspection, freight, customs and delivery.' },
          {
            label: 'Sourcing with personalized brand',
            blurb: 'Private labelling, custom packaging and product customisation.',
          },
          {
            label: 'Landed cost calculator',
            blurb: 'Goods, freight, duty, VAT and our fee — what an order really costs delivered.',
          },
        ],
      },
      { label: 'Contact', children: [] },
      {
        label: 'Resources',
        children: [
          { label: 'Blog', blurb: 'Field notes on importing from China into Morocco.' },
          { label: 'Gallery', blurb: 'Factories, containers and projects we have moved.' },
          { label: 'FAQ', blurb: 'Duties, timelines, minimums and payment protection.' },
        ],
      },
      { label: 'Careers', children: [] },
    ],
    primaryAria: 'Primary',
    cta: 'Start sourcing',
    toggleMenu: 'Toggle menu',
    /** {group} is replaced with the nav item's label. */
    toggleGroup: 'Toggle {group}',
  },

  hero: {
    eyebrow: 'China sourcing · Full control',
    lineOneLead: 'We Control the',
    lineOneMark: 'sourcing chain.',
    lineTwoLead: 'You Control the',
    lineTwoMark: 'pricing Market.',
    sub: "Morocco ↔ China, one company, full control, start to finish — because when nothing gets outsourced, nothing gets marked up. That's how you control the market with our pricing.",
    primary: 'Start sourcing',
    secondary: 'Talk to us',
    assurance: 'Two contracts. Two countries. One company.',
  },

  partners: {
    label: 'They trust us',
    title: 'Dealt with leading companies',
    body: 'Carriers, manufacturers and institutions we work alongside on the Morocco–China corridor.',
  },

  video: {
    label: 'A different kind of middle',
    titleA: 'Sourcing With Full Control.',
    titleB: 'Own the Market With Your Price.',
    body: 'One company, two offices, no invisible handoffs. SHIPLI takes your brief from a direct factory relationship in China to a cleared, delivered order in Morocco — with the contracts, checks and decisions in between kept visible.',
    note: 'No agents at any step.',
    fieldNote: 'SHIPLI / field note 01',
    comingSoon: 'Coming soon',
    playAria: 'Play the SHIPLI film',
    posterA: 'From brief',
    posterB: 'to warehouse.',
    corridor: 'Morocco ↔ China',
    notShot: 'The SHIPLI film is not shot yet. This frame is reserved for it — drop the file in and it plays here.',
    close: 'Close',
  },

  advantage: {
    label: 'The SHIPLI advantage',
    title: 'The power of full control',
    body: 'Every step where other companies hand off to an outside party, we keep in-house. That is what “full control” actually means at SHIPLI.',
    cta: 'Source now',
    figureAlt: 'A forklift loading cartons into a container at the Hangzhou warehouse',
    figureCaption: 'Our own team loading, Hangzhou',
    quote: 'From the factory floor in China to your warehouse in Morocco, every link in the chain is SHIPLI.',
    items: [
      {
        title: 'Factories no outsider can reach',
        body: 'Direct relationships in China, not a supplier directory. We negotiate the local price, not the price quoted to a foreigner.',
      },
      {
        title: 'We buy in China, ourselves',
        body: "SHIPLI purchases directly from the manufacturer as buyer of record, removing the agent's margin from your price.",
      },
      {
        title: 'Direct partnerships with major shipping lines',
        body: 'We work as an authorised agent of major sea and air carriers. No external shipping company added.',
      },
      {
        title: 'Customs clearance, only through SHIPLI',
        body: 'All Moroccan customs clearance is handled by SHIPLI directly, never outsourced.',
      },
      {
        title: 'Delivery through our own logistics network',
        body: 'Once cleared, goods move through our own logistics solution in Morocco, all the way to your door.',
      },
    ],
  },

  trust: {
    label: 'The safety architecture',
    title: 'How SHIPLI built trust and safety',
    lead: 'How we make contracts in Morocco and China.',
    body: 'With SHIPLI, you only ever worry about two things: receiving your product, and your money. Everything else is on us.',
    pillars: [
      {
        tag: '01 / Morocco',
        title: 'Legal contract in Morocco',
        body: 'Before anything moves, SHIPLI signs a legally binding contract with you, drafted by our own lawyers in Morocco. SHIPLI is responsible for your product and your money.',
        alt: 'Two colleagues going through the client contract together at the Casablanca office',
      },
      {
        tag: '02 / China',
        title: 'Legal contract in China',
        body: 'Our China-based company signs directly with the factory under Chinese law — the only structure that is actually enforceable in China.',
        alt: 'Signing with a factory manager in a meeting room overlooking the production floor',
      },
    ],
    protectedTitle: 'Protected customer',
    protectedBody: 'Two contracts. Two countries. One company standing behind both.',
    protectedAlt: 'A finished order palletised and labelled, waiting to leave the warehouse',
  },

  presence: {
    label: 'On the ground',
    title: 'We are present physically in Morocco and China.',
    body: 'Our Morocco team manages your brief, contract, clearance and delivery. Our China team works directly with factories, under Chinese law, where the decisions are made.',
    officePrefix: 'Office',
    offices: [
      {
        city: 'Morocco',
        role: 'Clearance · delivery · care',
        detail: 'Your brief, your contract, customs and the last mile to your door.',
      },
      {
        city: 'China',
        role: 'Factories · contracts · quality',
        detail: 'Factory floors, negotiation in Mandarin, inspection before departure.',
      },
    ],
  },

  categories: {
    label: 'The range',
    title: 'What we source',
    body: 'A focused sourcing desk for the things that are hard to buy well from a distance.',
    items: [
      {
        title: 'Construction & manufacturing solutions',
        note: 'Machines, production lines, site equipment and spare parts',
      },
      { title: 'Agriculture solutions', note: 'Irrigation, greenhouses, tractors and processing equipment' },
      { title: 'Electronics & technical products', note: 'POS hardware, components, instruments and control systems' },
      { title: 'Raw materials for factories', note: 'Polymers, metals, chemicals, fabrics and packaging stock' },
      { title: 'Textile & furniture', note: 'Villas, offices, hotels and retail fit-outs' },
    ],
    customEyebrow: 'Your category',
    customTitleA: 'Something',
    customTitleB: 'specific?',
    customCta: 'Ask our sourcing desk',
  },

  process: {
    label: 'The route',
    title: 'How we work at SHIPLI',
    body: 'Six steps, each one owned by a SHIPLI team. You only ever worry about two things: receiving your product, and your money.',
    steps: [
      { title: 'Submit a sourcing request', body: 'Tell us what you need: specs, goals and budget.' },
      { title: 'Factory matching', body: 'We connect you with vetted, direct factory partners in China.' },
      { title: 'Legal contract in Morocco', body: 'Signed and binding before anything moves.' },
      { title: 'Legal contract in China', body: 'Signed directly with the factory, under Chinese law.' },
      {
        title: 'Production & inspection',
        body: 'We manage manufacturing and quality checks, and keep you updated at every stage.',
      },
      {
        title: 'Shipping, customs & delivery',
        body: 'Shipped as an authorised carrier partner, cleared through SHIPLI in Morocco, delivered through our own network.',
      },
    ],
  },

  galleryStrip: {
    label: 'Our projects',
    title: 'Explore some of our shipments',
    cta: 'View the gallery',
  },

  faq: {
    label: 'The short answers',
    title: 'Questions, answered plainly.',
    body: 'No jargon, no disappearing acts. If your question is not here, ask us directly.',
    items: [
      {
        q: 'How is SHIPLI different from a sourcing agent?',
        a: 'We do not hand your order to an agent or broker. SHIPLI operates through its own teams in Morocco and China, buys directly from the manufacturer, and remains responsible for sourcing, contracts, shipping, customs and delivery.',
      },
      {
        q: 'How does the contract protect my payment?',
        a: 'Before anything moves, SHIPLI signs a legally binding contract with you in Morocco, drafted by our own lawyers. Our Moroccan company is responsible for your product and your money throughout the journey.',
      },
      {
        q: 'How can I avoid scams when buying from foreign suppliers?',
        a: 'If you work with us, we take care of everything. We protect you and your money — you either receive your goods or you get your money back.',
      },
      {
        q: 'Do you offer DDP shipping to Morocco?',
        a: 'Yes. We can handle every aspect of the import process, from the factory floor in China to your warehouse in Morocco, duties included.',
      },
      {
        q: 'How long does international shipping usually take?',
        a: 'From China to Morocco, shipping typically takes about 2 weeks by air including customs clearance, or about 2 months by sea. We share a clear timeline before you commit.',
      },
      {
        q: 'How much do customs duties and taxes cost in Morocco?',
        a: 'It depends on the product, but they generally range from 22% to 75%. We calculate the landed cost before you commit so there are no surprises.',
      },
      {
        q: 'What product categories do you source?',
        a: 'Our sourcing desk is built for industrial equipment, textiles, furniture, packaging, electronics and other made-to-spec products. Tell us what you need and we will confirm fit.',
      },
      {
        q: 'What is the minimum order size you work with?',
        a: 'We assess each request on its product, complexity and shipping profile rather than applying a one-size-fits-all number. Start with your specifications and budget.',
      },
      {
        q: 'Can you handle shipping only?',
        a: 'Yes. We can ship almost any commodity from China or Morocco to any country, even when you have already found your own supplier.',
      },
    ],
  },

  cta: {
    label: 'Ready when you are.',
    title: 'Sourcing from China — done right.',
    body: 'Bring us the brief. We will bring you the factory, the contract and the route home.',
    primary: 'Get started',
    secondary: 'Contact',
  },

  footer: {
    blurb: 'One company across two countries. We buy at the factory gate in China, ship as an authorised carrier partner, clear Moroccan customs ourselves and deliver to your door.',
    cta: 'Start sourcing',
    contact: 'Contact',
    morocco: 'Morocco',
    china: 'China',
    rights: 'All rights reserved',
    hours: 'Monday to Saturday — business hours. Sunday closed.',
  },

  whatsapp: {
    teaser: 'Need a price from China? Message us — we usually reply the same day.',
    dismiss: 'Dismiss',
    chatAria: 'Chat with SHIPLI on WhatsApp',
    /** Pre-filled into the WhatsApp compose box. */
    message: 'Hello SHIPLI, I would like to source a product from China.',
  },

  gallery: {
    captions: [
      'Cartons loaded and stacked for export',
      'Bales packed wall to wall for a full container',
      'Excavator secured inside the container',
      'Agricultural machinery at a supplier visit',
      'Wheel loaders on the trailer to the port',
      'Reviewing specifications with a manufacturer',
      'Textile bales loaded for Morocco',
      'Container sealed with the supplier team',
      'Forklift filling the container, Hangzhou',
      'Heavy machine blocked and braced for sea freight',
      'Industrial equipment at the China trade fair',
      'On the floor at the equipment expo',
      'Walking the halls to shortlist suppliers',
      'Inspecting excavators before purchase',
      'Wheel loader checked at the supplier yard',
      'Final count before the doors close',
      'Machinery inspection at the China yard',
      'Supplier meeting at the trade fair',
    ],
  },

  about: {
    eyebrow: 'About us',
    title: 'Trusted partner for global trade between Morocco and China',
    intro: 'We simplify international trade by connecting businesses with verified suppliers and reliable logistics, protecting you from the common risks of sourcing overseas.',
    whoLabel: 'Who we are',
    whoTitle: 'From product sourcing to final delivery, our team manages every stage.',
    whoBody: 'We handle each stage with transparency and care, so you can source with confidence and build long-term partnerships on trust. Our mission is to make international trade simple, secure and accessible by providing reliable sourcing, logistics and customs solutions while protecting businesses from supplier fraud and unnecessary risk.',
    capabilities: [
      'Supplier verification',
      'Factory audits',
      'Quality inspection',
      'Customs clearance',
      'Door-to-door delivery',
    ],
    whoCta: 'Contact our team',
    photoAlt: 'A SHIPLI buyer with a Chinese supplier at a machinery yard',
    photoKicker: 'SHIPLI · Morocco & China',
    photoCaption: 'Two teams, one accountability.',
    highlightsLabel: 'Business highlights',
    highlightsTitle: 'What five years on the corridor adds up to',
    highlights: [
      {
        title: 'Years of trusted trade',
        body: 'Five years moving goods between Chinese factories and Moroccan businesses, without a single order handed to a broker.',
      },
      {
        title: 'Legal entities, two jurisdictions',
        body: 'A Moroccan company that contracts with you and a Chinese company that contracts with the factory — the only structure enforceable on both ends.',
      },
      {
        title: 'Service lines under one roof',
        body: 'Sourcing, freight, customs, DDP, branding and company formation, all delivered by SHIPLI teams rather than subcontractors.',
      },
      {
        title: 'Named partners and carriers',
        body: 'From MSC and China Cargo Airlines to manufacturers such as RONGTA and WEIRONG, plus a presence at WAM and GITEX Africa Morocco.',
      },
    ],
    strategyLabel: 'Our strategy',
    strategyTitle: 'Own the chain, and the price holds.',
    strategyBody: 'Most importers pay two margins they never see: the agent’s, and the one added by every subcontractor in the chain. Our strategy removes both by refusing to hand any step to an outsider.',
    strategy: [
      {
        title: 'Own the chain, do not broker it',
        body: 'Every step where other companies hand off to an outside party, we keep in-house. Buying, shipping, clearing and delivering are all SHIPLI operations, which is the only way to hold a price and a deadline.',
      },
      {
        title: 'Buy at the factory gate',
        body: 'We purchase as buyer of record in China at the local price. The agent margin that normally sits invisibly in your quotation simply does not exist in ours.',
      },
      {
        title: 'Contract on both ends',
        body: 'A binding contract in Morocco makes us answerable to you under Moroccan law. A second contract in China makes the factory answerable to us under Chinese law.',
      },
      {
        title: 'Be physically present',
        body: 'Our Morocco team manages your brief, contract, clearance and delivery. Our China team walks the factory floor, where the decisions actually get made.',
      },
    ],
    philosophyLabel: 'Management philosophy',
    philosophyTitle: 'How we decide when your money is in transit',
    philosophy: [
      {
        title: 'The client worries about two things only',
        body: 'Receiving the product, and their money. Everything between those two points is our problem, not yours.',
      },
      {
        title: 'Transparency is a deliverable',
        body: 'Clear quotations, complete cost visibility and no hidden fees. If a cost changes, you hear it from us before it reaches your invoice.',
      },
      {
        title: 'Say no to the wrong order',
        body: 'If a product, a factory or a timeline does not hold up to inspection, we say so early. A lost order costs us less than a failed shipment costs you.',
      },
      {
        title: 'Decisions travel with the goods',
        body: 'Whoever is closest to the shipment has the authority to act on it. That is why we staff both ends rather than managing China from a desk in Casablanca.',
      },
    ],
    whyLabel: 'Why choose SHIPLI',
    whyTitle: 'Your trusted logistics partner',
    why: [
      {
        title: 'Verified suppliers',
        body: 'Protection against supplier scams through careful verification and due diligence.',
      },
      { title: 'China & Morocco offices', body: 'Local support with faster communication and personalised assistance.' },
      { title: 'End-to-end logistics', body: 'From sourcing to customs clearance and final delivery.' },
      { title: 'Quality inspection', body: 'Every shipment is inspected before departure to ensure quality.' },
      { title: 'Transparent pricing', body: 'No hidden fees. Clear quotations and complete cost visibility.' },
      { title: 'Dedicated support', body: 'Our multilingual team is available throughout your shipment journey.' },
    ],
  },

  solutions: {
    eyebrow: 'Solutions',
    title: 'Two ways to buy from China, both fully controlled',
    intro: 'Straight sourcing when you know what you want, or sourcing under your own brand when the product needs to carry your name. Either way, SHIPLI stays the only company in the chain.',
    oneLabel: 'Solution 01',
    oneTitle: 'Sourcing',
    oneBody: 'We find the factory, negotiate at the local price, sign on both ends, inspect before departure, ship as an authorised carrier partner, clear Moroccan customs ourselves, and deliver to your door.',
    quoteCta: 'Get a quote',
    services: [
      {
        title: 'Product sourcing',
        body: 'We source high-quality products from trusted manufacturers, carefully verifying every supplier to ensure reliability, competitive pricing and consistent quality. Our sourcing process helps you save time, reduce costs and avoid scams, giving you complete confidence in every purchase.',
      },
      {
        title: 'International freight',
        body: 'Transport your goods from China to Morocco with our reliable air freight and sea freight solutions. We ensure safe handling, competitive shipping rates, real-time tracking and on-time delivery for businesses of all sizes.',
      },
      {
        title: 'Customs clearance',
        body: 'Our experienced team manages every aspect of the customs clearance process, including import documentation, customs declarations, duties and regulatory compliance. We help minimise delays and ensure your shipments are cleared quickly.',
      },
      {
        title: 'Sourcing & DDP delivery',
        body: 'Simplify your imports with our complete Sourcing & DDP (Delivered Duty Paid) service. From finding reliable suppliers and inspecting products to customs clearance and door-to-door delivery, we handle the entire process so you can focus on growing your business.',
      },
      {
        title: 'Branding & private label',
        body: 'Strengthen your business identity with our professional branding solutions, including private labelling, custom packaging, logo printing and product customisation. We help you create a unique brand that stands out in a competitive marketplace.',
      },
      {
        title: 'Business setup in China',
        body: 'We help entrepreneurs and businesses establish their presence in China with a complete company setup service. From registration and legal procedures to documentation, local support and operational guidance, we handle every step from A to Z.',
      },
    ],
    twoLabel: 'Solution 02',
    twoTitle: 'Sourcing with a personalised brand',
    twoBody: 'Strengthen your business identity with private labelling, custom packaging, logo printing and product customisation. The same factory, the same controlled chain — with your name on the box instead of somebody else’s.',
    brandSteps: [
      'Private labelling with your logo on the product',
      'Custom packaging, inserts and retail-ready cartons',
      'Colour, material and finish changes at the factory',
      'Barcode, compliance and market-specific labelling',
      'Sample round before the production run is released',
    ],
    twoCta: 'Brief our branding desk',
    twoPhotoAlt: 'A client logo being stitched onto webbing at the factory',
    calcLabel: 'Before you commit',
    calcTitle: 'See the landed cost, not just the factory price',
    calcBody: 'Goods, freight, duty, VAT and our fee — itemised, in USD and dirhams, before a single carton moves.',
    calcCta: 'Open the calculator',
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Talk to the people who will actually move your goods',
    intro: 'No call centre, no intermediary. You reach the Morocco desk that signs your contract or the China desk that walks the factory floor.',
    linesLabel: 'Direct lines',
    linesTitle: 'Reach us where it is fastest',
    channels: {
      email: { label: 'Email', note: 'Quotations and specifications' },
      morocco: { label: 'Morocco desk', note: 'Contracts, customs and delivery' },
      china: { label: 'China desk', note: 'Factories, samples and inspection' },
      moroccoOffice: { label: 'Morocco office', value: 'Ben Guerir' },
      chinaOffice: { label: 'China office', value: 'Hangzhou' },
    },
    formLabel: 'Send a message',
    formTitle: 'Tell us what you need',
    formIntroA: 'For a full sourcing brief with specs, quantities and budget, use the',
    formIntroLink: 'sourcing request form',
    formIntroB: 'instead — it asks everything we need to quote.',
    sentTitle: 'Message noted.',
    sentBodyA: 'This site is not wired to a mailbox yet. In the meantime, email us at',
    sentBodyB: 'and we will answer the same working day.',
    fieldName: 'Full name',
    fieldCompany: 'Company',
    fieldEmail: 'Email',
    fieldPhone: 'Phone / WhatsApp',
    fieldMessage: 'Message',
    messagePlaceholder: 'What product, what quantity, what timeline?',
    send: 'Send message',
  },

  resources: {
    eyebrow: 'Resources',
    title: 'Everything we know, made available before you commit',
    intro: 'Read the notes, look at the work, and check the answers. Then start a sourcing request with a clear picture of what importing actually involves.',
    cards: [
      {
        label: 'Blog',
        title: 'Field notes on importing from China',
        body: 'Landed cost, route selection, supplier risk and private label — written for Moroccan businesses.',
        /** {n} is the count of articles / photographs / answers. */
        meta: '{n} articles',
      },
      {
        label: 'Gallery',
        title: 'Factories, containers and projects',
        body: 'What the work actually looks like between the factory gate in China and your door in Morocco.',
        meta: '{n} photographs',
      },
      {
        label: 'FAQ',
        title: 'Duties, timelines and protection',
        body: 'Customs rates, sea versus air timing, minimum orders and how your payment is secured.',
        meta: '{n} answers',
      },
    ],
    open: 'Open',
    askLabel: 'Ask directly',
    askTitle: 'Cannot find the answer you need?',
    askBody: 'Send us the product and the quantity. We will come back with a landed cost, a route and a timeline rather than a brochure.',
    askCta: 'Start a sourcing request',
  },

  blog: {
    eyebrow: 'Resources · Blog',
    title: 'Field notes from the Morocco–China corridor',
    intro: 'What we learn on factory floors, at the port and in the customs queue — written for Moroccan businesses that import.',
    read: 'Read the note',
    more: 'More notes are being written. If there is a question you want answered here, tell us and we will publish it.',
    posts: [
      {
        title: 'What importing from China actually costs in Morocco',
        excerpt: 'Duties in Morocco range from roughly 22% to 75% depending on the HS code. Here is how to model the landed cost before you commit to an order.',
        tag: 'Customs',
        read: '6 min read',
      },
      {
        title: 'Sea or air: choosing a route from Guangzhou to Casablanca',
        excerpt: 'Two weeks by air including clearance, roughly two months by sea. The right answer depends on your margin, not on the freight quote.',
        tag: 'Freight',
        read: '5 min read',
      },
      {
        title: 'Six ways importers lose money to suppliers, and how to close each one',
        excerpt: 'Deposit fraud, spec drift, quiet material substitution. Each has a documented countermeasure, and most of them happen before production starts.',
        tag: 'Risk',
        read: '8 min read',
      },
      {
        title: 'Private label from a Chinese factory without owning a factory',
        excerpt: 'Custom packaging, logo printing and product customisation are usually available well below the minimums importers assume.',
        tag: 'Branding',
        read: '4 min read',
      },
    ],
  },

  galleryPage: {
    eyebrow: 'Resources · Gallery',
    title: 'Factories, containers and the goods we moved',
    intro: 'A look at the work between the factory gate in China and the delivery door in Morocco.',
    close: 'Close',
  },

  faqPage: {
    eyebrow: 'Resources · FAQ',
    title: 'Duties, timelines, minimums and payment protection',
    intro: 'The questions Moroccan importers ask us before the first order. If yours is missing, the contact desk answers the same working day.',
  },

  careers: {
    eyebrow: 'Careers',
    title: 'Careers at SHIPLI',
    intro: 'We are a small team running a long chain between Guangzhou and Casablanca. If you want ownership rather than a narrow lane, this is the right size of company.',
    rolesLabel: 'Open roles',
    /** {n} is the number of open positions. */
    rolesTitle: '{n} positions across Morocco and China',
    apply: 'Apply',
    applySubject: 'Application — {role}',
    jobs: [
      {
        title: 'Sourcing Specialist',
        location: 'Guangzhou, China',
        type: 'Full-time',
        body: 'Walk factory floors, negotiate in Mandarin, and hold suppliers to the specification our clients signed for.',
      },
      {
        title: 'Customs & Compliance Officer',
        location: 'Casablanca, Morocco',
        type: 'Full-time',
        body: 'Own the declaration end to end: classification, documentation and clearance through Moroccan customs.',
      },
      {
        title: 'Logistics Coordinator',
        location: 'Casablanca, Morocco',
        type: 'Full-time',
        body: 'Coordinate sea and air movements with our carrier partners and run the last mile across Morocco.',
      },
      {
        title: 'Quality Inspector',
        location: 'China — travel required',
        type: 'Full-time',
        body: 'Inspect before departure. Photograph, measure, and refuse what does not match the contract.',
      },
      {
        title: 'Brand & Marketing Coordinator',
        location: 'Casablanca, Morocco',
        type: 'Full-time',
        body: 'Tell the SHIPLI story to Moroccan businesses across channels, campaigns and client case studies.',
      },
    ],
    valuesLabel: 'How we work',
    valuesTitle: 'Three rules that survive every shipment',
    values: [
      {
        title: 'Be where the goods are',
        body: 'We staff both ends of the corridor. Decisions get made by whoever is standing closest to the shipment.',
      },
      {
        title: 'Say the hard thing early',
        body: 'A supplier that will not hold spec, a timeline that will not survive Ramadan traffic — we flag it before it costs a client.',
      },
      {
        title: 'Own it end to end',
        body: 'Nobody here hands a problem to a subcontractor. If it is in our chain, it is ours to solve.',
      },
    ],
    specLabel: 'Speculative applications',
    specTitle: 'No role that fits? Write to us anyway.',
    specBody: 'Tell us what you do and where you would sit in the chain. We read every message that arrives with a real proposal attached.',
    specCta: 'Email',
    specSubject: 'Speculative application',
  },

  calculator: {
    eyebrow: 'Solutions · Landed cost',
    title: 'Know the real cost before you commit a dirham',
    intro: 'Move the sliders to see what a China order actually costs once it has cleared Casablanca — goods, freight, duty, VAT and our fee, with nothing folded in where you cannot see it.',
    notesLabel: 'Reading the number',
    notesTitle: 'Where importers get the maths wrong',
    notesBody: 'Most quotes that look cheap are only cheap because something was left out. These are the four things we see missed most often.',
    notesPhotoAlt: 'Counting cartons inside the container before the doors are sealed',
    notesPhotoCaption: 'Counted before the doors close',
    notesCta: 'Get the real number',
    notes: [
      {
        title: 'Duty is charged on CIF, not on the invoice',
        body: 'Moroccan customs assess the goods value plus freight and insurance, then apply the tariff. Quoting yourself on the factory price alone understates the bill every time.',
      },
      {
        title: 'VAT stacks on top of duty',
        body: 'The 20% is applied after duty, not beside it. If you are VAT-registered you recover it, so treat it as cash flow rather than cost — but you still have to fund it at the port.',
      },
      {
        title: 'Clearance is flat, so small orders cost more per piece',
        body: 'Declaration, port handling and the delivery order cost roughly the same whether the container holds 200 pieces or 20 000. Split across a small order it can dwarf the goods themselves — slide the quantity and watch the per-unit number move.',
      },
      {
        title: 'Light and bulky is billed by volume',
        body: 'Carriers charge whichever is greater: actual weight or volumetric. Furniture, packaging and plastics almost always land on the volumetric side, which is why we measure cartons before quoting.',
      },
      {
        title: 'One fee, on the goods only',
        body: 'We do not take a percentage of your freight, and we do not take a second margin from the factory. What the supplier charges us is what you see.',
      },
    ],
    // The tool itself.
    modeLabel: 'How it ships',
    modeBody: 'Pick a mode and we preload an indicative China → Casablanca rate.',
    reset: 'Reset',
    modes: [
      { label: 'Sea', transit: '30–40 days' },
      { label: 'Air', transit: '7–12 days' },
      { label: 'Express', transit: '4–7 days' },
    ],
    groupOrder: 'The order',
    groupLanding: 'Landing it in Morocco',
    groupYours: 'Your side',
    unitCost: 'Factory unit price',
    quantity: 'Quantity',
    pcs: 'pcs',
    unitWeight: 'Weight per unit',
    unitWeightHint: 'Gross, packed. For bulky-but-light goods carriers bill volumetric weight instead — nudge this up.',
    freightRate: 'Freight rate',
    perKg: '/kg',
    dutyRate: 'Import duty',
    dutyHint: 'Moroccan tariffs run 2.5%–40% by HS code. The China–Morocco lines are not zero-rated, so check the code before you commit.',
    vatRate: 'Import VAT',
    vatHint: '20% is the standard Moroccan rate. Recoverable if you are VAT-registered — a cash-flow cost, not a margin cost.',
    clearance: 'Clearance & port',
    clearanceHint: 'Flat per shipment — declaration, handling, delivery order. This is the line that makes small orders expensive per unit.',
    agencyFee: 'SHIPLI fee',
    agencyFeeHint: 'One fee on the goods value. No commission on freight, no supplier kickback, no hidden second margin.',
    retailPrice: 'Your selling price',
    perUnitLabel: 'Landed cost per unit',
    /** {mad} is the dirham figure. */
    perUnitNote: '≈ {mad} · delivered, duty and VAT paid',
    /** {total} order total, {kg} chargeable weight. */
    orderTotal: 'Order total {total} · {kg} kg chargeable',
    bars: {
      goods: 'Goods, ex-works',
      freight: 'Freight & handling',
      duty: 'Import duty',
      vat: 'VAT',
      clearance: 'Clearance & port',
      fee: 'SHIPLI fee',
    },
    margin: 'Gross margin',
    markup: 'Markup',
    healthGood: 'Healthy margin',
    healthThin: 'Thin — worth re-pricing',
    healthBad: 'Selling below landed cost',
    /** {qty} pieces, {price} unit price, {profit} USD profit, {mad} the same in dirhams. */
    profitLine: 'Sell the whole {qty} pcs at {price} and you keep {profit} ({mad}).',
    fxLabel: 'USD → MAD',
    disclaimerA: 'Indicative only. Real duty depends on your HS code and origin certificate, and freight is quoted on actual carton dimensions.',
    disclaimerLink: 'Send us the brief',
    disclaimerB: 'and we come back with the real number, itemised.',
  },

  notFound: {
    error: 'Error 404',
    title: 'This container never left the port.',
    body: 'The page you asked for does not exist. Everything else on the route is still moving.',
    home: 'Back to homepage',
    start: 'Start a sourcing request',
  },

  start: {
    eyebrow: 'Sourcing request',
    title: 'Give us the brief. We come back with a landed cost.',
    intro: 'A few short steps. Every answer changes the questions that follow, so you only fill what applies to you.',
    shots: [
      { label: 'We meet the maker', alt: 'SHIPLI meeting a manufacturer at a trade fair in China' },
      { label: 'We inspect it', alt: 'Inspecting excavators at a supplier yard before purchase' },
      { label: 'We load it', alt: 'Counting goods inside the container before the doors are closed' },
    ],
    done: 'DONE',
    /** {n} current step, {total} number of steps. */
    stepCounter: '{n} / {total}',
    stepKicker: 'Step {n}',
    optional: 'Optional',
    back: 'Back',
    continue: 'Continue',
    submit: 'Send my brief',
    /** {phone} and {email} are substituted. */
    prefer: 'Prefer to talk first? Call {phone} or write to {email}.',
    doneTitle: 'Brief received.',
    doneBodyA: 'This form is not connected to a backend yet, so nothing was transmitted. Copy your answers below and send them to',
    doneBodyB: ', or call the Morocco desk on',
    emailBrief: 'Email this brief',
    emailSubject: 'Sourcing request',
    backHome: 'Back to homepage',

    productTypes: [
      'Furniture & fit-out',
      'Construction & industrial machinery',
      'Custom manufacturing / private label',
      'Textiles & apparel',
      'Packaging & printing',
      'Electronics & POS hardware',
      'Other',
    ],

    steps: {
      company: {
        title: 'First, are you buying as a company?',
        intro: 'This decides which contract we draft and how customs will treat the shipment in Morocco.',
        registered: 'Is your business registered?',
        registeredOptions: [
          'Yes, registered in Morocco',
          'Yes, registered outside Morocco',
          'Not yet registered',
          'Individual buyer',
        ],
        importer: 'Can you import under your own name?',
        importerOptions: [
          'Yes, we import regularly',
          'Yes, but we have never done it',
          'No — we need SHIPLI to import for us',
          'Not sure',
        ],
      },
      product: {
        title: 'What are you sourcing?',
        productType: 'Product category',
        productOther: 'Describe the category',
        productOtherPlaceholder: 'Only if you picked “Other”',
      },
      furniture: {
        title: 'Tell us about the fit-out',
        use: 'What is the furniture for?',
        useOptions: [
          'Private villa or apartment',
          'Hotel or riad',
          'Office',
          'Restaurant or café',
          'Retail space',
          'Resale / distribution',
        ],
        profile: 'Who is briefing us?',
        profileOptions: [
          'Architect or interior designer',
          'Contractor / fit-out company',
          'End client',
          'Retailer or distributor',
        ],
        rooms: 'How many rooms or units?',
        roomsPlaceholder: 'e.g. 24',
        stage: 'Where is the project today?',
        stageOptions: [
          'Still designing',
          'Drawings finished, choosing suppliers',
          'Under construction',
          'Ready to install',
        ],
        plan: 'Floor plan or mood board',
        planHelp: 'PDF, DWG, images — anything that shows what you are furnishing.',
      },
      machinery: {
        title: 'Tell us about the equipment',
        kind: 'What exactly do you need?',
        kindOptions: [
          'A single machine',
          'A full production line',
          'Spare parts or components',
          'Hardware & tooling',
        ],
        sheet: 'Technical sheet or BOQ',
        sheetHelp: 'Specifications, bill of quantities, or a competing quotation.',
        context: 'What will it produce, and at what capacity?',
        contextPlaceholder: 'Output per hour, voltage, footprint, certifications required…',
      },
      custom: {
        title: 'Tell us about the product to manufacture',
        description: 'Describe the product',
        descriptionPlaceholder: 'Materials, dimensions, finish, function, the closest product on the market…',
        packaging: 'Do you need custom packaging and branding?',
        packagingOptions: [
          'Yes — logo, packaging, inserts',
          'Logo on product only',
          'Neutral packaging is fine',
          'Not decided yet',
        ],
        specs: 'Packaging or branding specifications',
        specsPlaceholder: 'Retail carton, barcode, language on the label, market requirements…',
        files: 'Reference files',
        filesHelp: 'Drawings, samples, photos, logo files.',
      },
      generic: {
        title: 'Tell us about the product',
        description: 'Describe what you want to source',
        descriptionPlaceholder: 'Product, material, specification, the quality level you are targeting…',
        files: 'Reference files',
        filesHelp: 'Photos, drawings, links, existing quotations.',
      },
      volume: {
        title: 'Quantity and budget',
        intro: 'Rough numbers are fine. They tell us which factories can actually take the order.',
        quantity: 'Quantity for the first order',
        quantityPlaceholder: 'e.g. 500 units, 2 containers, 1 line',
        monthly: 'Expected volume after that',
        monthlyOptions: [
          'One-off order',
          'A few orders a year',
          'Monthly repeat orders',
          'Weekly / continuous supply',
        ],
        budget: 'Budget for this order (USD)',
        budgetOptions: [
          'Under $5,000',
          '$5,000 – $20,000',
          '$20,000 – $50,000',
          '$50,000 – $150,000',
          'Above $150,000',
          'Need help estimating',
        ],
        timeline: 'When do you need it delivered?',
        timelineOptions: [
          'As fast as possible',
          'Within 1–2 months',
          'Within 3–6 months',
          'Planning ahead, no fixed date',
        ],
      },
      service: {
        title: 'How do you want us to work?',
        mode: 'Pick the sourcing model',
        modeOptions: [
          'Full DDP — you handle everything to my door',
          'Sourcing only — I arrange my own freight',
          'Shipping & customs only — I already have a supplier',
          'Visit factories in China with your team',
          'Not sure, advise me',
        ],
        tasks: 'What should we take on?',
        tasksOptions: [
          'Product research',
          'Factory identification & vetting',
          'Price negotiation',
          'Sample management',
          'Quality control & inspection',
          'Freight & logistics',
          'Customs clearance in Morocco',
          'Branding & packaging',
          'Company setup in China',
        ],
        updates: 'How often do you want updates?',
        updatesOptions: ['At every milestone', 'Weekly summary', 'Only when something needs a decision'],
      },
      travel: {
        title: 'Your trip to China',
        date: 'Approximate travel date',
        party: 'How many people are travelling?',
        partyPlaceholder: 'e.g. 2',
        stay: 'How long will you stay?',
        stayOptions: ['2–3 days', 'About a week', 'Two weeks or more', 'Not decided'],
        support: 'What support do you need on the ground?',
        supportOptions: [
          'Invitation letter / visa support',
          'Interpreter',
          'Hotel & transport',
          'Factory appointments',
          'Trade fair access',
        ],
      },
      context: {
        title: 'Context that helps us quote',
        supplier: 'Do you already have a supplier in China?',
        supplierOptions: [
          'No, we are starting from zero',
          'Yes, but we want a better price',
          'Yes, and we are happy — we only need logistics',
          'We had one and it went badly',
        ],
        notes: 'Anything else we should know?',
        notesPlaceholder: 'Certifications, competitors, past import problems, deadlines that cannot move…',
      },
      you: {
        title: 'Where do we send the quotation?',
        fullName: 'Full name',
        companyName: 'Company name',
        email: 'Email',
        phone: 'WhatsApp / phone',
        city: 'City',
        cityPlaceholder: 'Casablanca, Tanger, Marrakech…',
      },
    },

    /**
     * Human labels for the answer summary. Keyed by field name because the
     * summary is built from the answers map, which is keyed the same way — the
     * old code derived these by de-camel-casing the key, which only ever
     * produced English.
     */
    fieldLabels: {
      registered: 'Business registered',
      importer: 'Can import',
      productType: 'Product category',
      productOther: 'Category detail',
      furnitureUse: 'Furniture for',
      buyerProfile: 'Briefing us',
      roomCount: 'Rooms or units',
      projectStage: 'Project stage',
      floorPlan: 'Floor plan',
      machineryKind: 'Equipment needed',
      techSheet: 'Technical sheet',
      machineryContext: 'Output and capacity',
      customDescription: 'Product description',
      customPackaging: 'Custom packaging',
      packagingSpecs: 'Packaging specifications',
      referenceFiles: 'Reference files',
      genericDescription: 'Product description',
      quantity: 'First order quantity',
      monthlyVolume: 'Expected volume',
      budget: 'Budget',
      timeline: 'Delivery timeline',
      serviceMode: 'Sourcing model',
      tasks: 'Tasks for SHIPLI',
      updates: 'Update frequency',
      travelDate: 'Travel date',
      partySize: 'People travelling',
      stayDuration: 'Length of stay',
      tripSupport: 'On-the-ground support',
      existingSupplier: 'Existing supplier',
      projectContext: 'Extra context',
      fullName: 'Full name',
      companyName: 'Company',
      email: 'Email',
      phone: 'Phone',
      city: 'City',
    },
  },
};
