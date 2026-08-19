export const CONTACT = {
  email: 'contact@shipli.co',
  moroccoPhone: '+212 679-930096',
  chinaPhone: '+86 198 1771 4120',
  hours: 'Monday to Saturday — business hours. Sunday closed.',
  cities: 'Ben Guerir / Hangzhou',
  moroccoAddress: 'STE SHIPLI NR 13 8D MOHAMEO VI, HAY EL MASSIRA EL KHADRA 20100 BEN GUERIR MAROC',
  chinaAddress: '中国浙江省杭州市拱墅区石祥路525号 邮政编码: 310011.SHIPLI',
} as const;

/** WhatsApp uses the Morocco line; digits only, no plus sign. */
export const WHATSAPP = {
  number: '212679930096',
  message: 'Hello SHIPLI, I would like to source a product from China.',
} as const;

/**
 * Taken from the SHIPLI Linktree (linktr.ee/Shipli.co). Only these four
 * networks are actually published there — there is no TikTok or YouTube
 * account, so none is linked.
 *
 * The Linktree's own WhatsApp link carries a leading zero after the country
 * code (2120679930096), which is not valid E.164. We use the corrected form.
 */
export const SOCIALS = [
  { label: 'WhatsApp', href: `https://wa.me/${WHATSAPP.number}`, icon: 'whatsapp' },
  { label: 'Instagram', href: 'https://www.instagram.com/Shipli_co', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61574671934137', icon: 'facebook' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/shipli', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${CONTACT.email}`, icon: 'mail' },
] as const;

export const NAV: {
  label: string;
  to: string;
  children?: { label: string; to: string; blurb: string }[];
}[] = [
  {
    label: 'About us',
    to: '/about',
    children: [
      {
        label: 'Business highlights',
        to: '/about#highlights',
        blurb: 'The entities, service lines and partners that make full control real.',
      },
      {
        label: 'Our strategy',
        to: '/about#strategy',
        blurb: 'Why we own every link of the chain instead of brokering it.',
      },
      {
        label: 'Management philosophy',
        to: '/about#philosophy',
        blurb: 'How we make decisions when your money is in transit.',
      },
    ],
  },
  {
    label: 'Solutions',
    to: '/solutions',
    children: [
      {
        label: 'Sourcing',
        to: '/solutions#sourcing',
        blurb: 'Direct factory access, inspection, freight, customs and delivery.',
      },
      {
        label: 'Sourcing with personalized brand',
        to: '/solutions#branded',
        blurb: 'Private labelling, custom packaging and product customisation.',
      },
      {
        label: 'Landed cost calculator',
        to: '/calculator',
        blurb: 'Goods, freight, duty, VAT and our fee — what an order really costs delivered.',
      },
    ],
  },
  { label: 'Contact', to: '/contact' },
  {
    label: 'Resources',
    to: '/resources',
    children: [
      { label: 'Blog', to: '/blog', blurb: 'Field notes on importing from China into Morocco.' },
      { label: 'Gallery', to: '/gallery', blurb: 'Factories, containers and projects we have moved.' },
      { label: 'FAQ', to: '/faq', blurb: 'Duties, timelines, minimums and payment protection.' },
    ],
  },
  { label: 'Careers', to: '/careers' },
];

export const HERO = {
  eyebrow: 'China sourcing · Full control',
  /** Two parallel clauses, each with its own marked phrase. */
  lineOneLead: 'We Control the',
  lineOneMark: 'sourcing chain.',
  lineTwoLead: 'You Control the',
  lineTwoMark: 'pricing Market.',
  sub: "Morocco ↔ China, one company, full control, start to finish — because when nothing gets outsourced, nothing gets marked up. That's how you control the market with our pricing.",
  primary: 'Start sourcing',
  secondary: 'Talk to us',
  assurance: 'Two contracts. Two countries. One company.',
} as const;

export const PARTNERS = [
  { name: 'MSC', src: '/images/partners/partner-5.jpg' },
  { name: 'China Cargo Airlines', src: '/images/partners/partner-3.jpg' },
  { name: 'China Post', src: '/images/partners/partner-4.jpg' },
  { name: 'RONGTA', src: '/images/partners/partner-1.jpg' },
  { name: 'WEIRONG', src: '/images/partners/partner-7.jpg' },
  { name: 'WAM Morocco', src: '/images/partners/partner-2.jpg' },
  { name: 'GITEX Africa Morocco', src: '/images/partners/partner-6.jpg' },
] as const;

export const ADVANTAGES = [
  {
    title: 'Factories no outsider can reach',
    body: 'Direct relationships in China, not a supplier directory. We negotiate the local price, not the price quoted to a foreigner.',
    icon: 'factory',
  },
  {
    title: 'We buy in China, ourselves',
    body: "SHIPLI purchases directly from the manufacturer as buyer of record, removing the agent's margin from your price.",
    icon: 'boxes',
  },
  {
    title: 'Direct partnerships with major shipping lines',
    body: 'We work as an authorised agent of major sea and air carriers. No external shipping company added.',
    icon: 'ship',
  },
  {
    title: 'Customs clearance, only through SHIPLI',
    body: 'All Moroccan customs clearance is handled by SHIPLI directly, never outsourced.',
    icon: 'clipboard',
  },
  {
    title: 'Delivery through our own logistics network',
    body: 'Once cleared, goods move through our own logistics solution in Morocco, all the way to your door.',
    icon: 'truck',
  },
] as const;

export const PROCESS = [
  { title: 'Submit a sourcing request', body: 'Tell us what you need: specs, goals and budget.', icon: 'clipboard' },
  { title: 'Factory matching', body: 'We connect you with vetted, direct factory partners in China.', icon: 'factory' },
  { title: 'Legal contract in Morocco', body: 'Signed and binding before anything moves.', icon: 'file' },
  { title: 'Legal contract in China', body: 'Signed directly with the factory, under Chinese law.', icon: 'scale' },
  {
    title: 'Production & inspection',
    body: 'We manage manufacturing and quality checks, and keep you updated at every stage.',
    icon: 'badge',
  },
  {
    title: 'Shipping, customs & delivery',
    body: 'Shipped as an authorised carrier partner, cleared through SHIPLI in Morocco, delivered through our own network.',
    icon: 'package',
  },
] as const;

export const SERVICES = [
  {
    id: 'sourcing',
    title: 'Product sourcing',
    short: 'Find trusted manufacturers and high-quality products directly from China.',
    body: 'We source high-quality products from trusted manufacturers, carefully verifying every supplier to ensure reliability, competitive pricing and consistent quality. Our sourcing process helps you save time, reduce costs and avoid scams, giving you complete confidence in every purchase.',
    icon: 'factory',
  },
  {
    id: 'freight',
    title: 'International freight',
    short: 'Reliable international shipping solutions by sea and air.',
    body: 'Transport your goods from China to Morocco with our reliable air freight and sea freight solutions. We ensure safe handling, competitive shipping rates, real-time tracking and on-time delivery for businesses of all sizes.',
    icon: 'ship',
  },
  {
    id: 'customs',
    title: 'Customs clearance',
    short: 'Efficient customs processing for smooth, compliant imports.',
    body: 'Our experienced team manages every aspect of the customs clearance process, including import documentation, customs declarations, duties and regulatory compliance. We help minimise delays and ensure your shipments are cleared quickly.',
    icon: 'clipboard',
  },
  {
    id: 'ddp',
    title: 'Sourcing & DDP delivery',
    short: 'End-to-end sourcing with door-to-door delivery under DDP terms.',
    body: 'Simplify your imports with our complete Sourcing & DDP (Delivered Duty Paid) service. From finding reliable suppliers and inspecting products to customs clearance and door-to-door delivery, we handle the entire process so you can focus on growing your business.',
    icon: 'truck',
  },
  {
    id: 'branded',
    title: 'Branding & private label',
    short: 'Build your brand with custom packaging and private labelling.',
    body: 'Strengthen your business identity with our professional branding solutions, including private labelling, custom packaging, logo printing and product customisation. We help you create a unique brand that stands out in a competitive marketplace.',
    icon: 'badge',
  },
  {
    id: 'setup',
    title: 'Business setup in China',
    short: 'Professional support for establishing your company in China.',
    body: 'We help entrepreneurs and businesses establish their presence in China with a complete company setup service. From registration and legal procedures to documentation, local support and operational guidance, we handle every step from A to Z.',
    icon: 'building',
  },
] as const;

export const CATEGORIES = [
  {
    title: 'Construction & manufacturing solutions',
    note: 'Machines, production lines, site equipment and spare parts',
    tone: 'sea',
  },
  {
    title: 'Agriculture solutions',
    note: 'Irrigation, greenhouses, tractors and processing equipment',
    tone: 'kelp',
  },
  {
    title: 'Electronics & technical products',
    note: 'POS hardware, components, instruments and control systems',
    tone: 'mist',
  },
  {
    title: 'Raw materials for factories',
    note: 'Polymers, metals, chemicals, fabrics and packaging stock',
    tone: 'sand',
  },
  {
    title: 'Textile & furniture',
    note: 'Villas, offices, hotels and retail fit-outs',
    tone: 'deep',
  },
] as const;

export const WHY = [
  { title: 'Verified suppliers', body: 'Protection against supplier scams through careful verification and due diligence.' },
  { title: 'China & Morocco offices', body: 'Local support with faster communication and personalised assistance.' },
  { title: 'End-to-end logistics', body: 'From sourcing to customs clearance and final delivery.' },
  { title: 'Quality inspection', body: 'Every shipment is inspected before departure to ensure quality.' },
  { title: 'Transparent pricing', body: 'No hidden fees. Clear quotations and complete cost visibility.' },
  { title: 'Dedicated support', body: 'Our multilingual team is available throughout your shipment journey.' },
] as const;

export const FAQS = [
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
    a: "If you work with us, we take care of everything. We protect you and your money — you either receive your goods or you get your money back.",
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
] as const;

/**
 * Real shipment and supplier-visit photographs. Intrinsic w/h are carried so
 * the masonry gallery can reserve space before the image loads — most of these
 * are portrait, which makes layout shift very visible otherwise.
 * The first eight double as the homepage teaser strip.
 */
export const GALLERY = [
  { src: '/images/gallery/gallery-1.jpg', caption: 'Cartons loaded and stacked for export', w: 736, h: 981 },
  { src: '/images/gallery/gallery-13.jpg', caption: 'Bales packed wall to wall for a full container', w: 1200, h: 1600 },
  { src: '/images/gallery/gallery-3.jpg', caption: 'Excavator secured inside the container', w: 736, h: 981 },
  { src: '/images/gallery/gallery-5.jpg', caption: 'Agricultural machinery at a supplier visit', w: 1600, h: 1200 },
  { src: '/images/gallery/gallery-17.jpg', caption: 'Wheel loaders on the trailer to the port', w: 736, h: 981 },
  { src: '/images/gallery/gallery-9.jpg', caption: 'Reviewing specifications with a manufacturer', w: 900, h: 1600 },
  { src: '/images/gallery/gallery-18.jpg', caption: 'Textile bales loaded for Morocco', w: 736, h: 981 },
  { src: '/images/gallery/gallery-12.jpg', caption: 'Container sealed with the supplier team', w: 1200, h: 1600 },
  { src: '/images/gallery/gallery-2.jpg', caption: 'Forklift filling the container, Hangzhou', w: 736, h: 736 },
  { src: '/images/gallery/gallery-4.jpg', caption: 'Heavy machine blocked and braced for sea freight', w: 736, h: 1308 },
  { src: '/images/gallery/gallery-6.jpg', caption: 'Industrial equipment at the China trade fair', w: 1600, h: 1200 },
  { src: '/images/gallery/gallery-7.jpg', caption: 'On the floor at the equipment expo', w: 900, h: 1600 },
  { src: '/images/gallery/gallery-8.jpg', caption: 'Walking the halls to shortlist suppliers', w: 900, h: 1600 },
  { src: '/images/gallery/gallery-10.jpg', caption: 'Inspecting excavators before purchase', w: 900, h: 1600 },
  { src: '/images/gallery/gallery-11.jpg', caption: 'Wheel loader checked at the supplier yard', w: 900, h: 1600 },
  { src: '/images/gallery/gallery-14.jpg', caption: 'Final count before the doors close', w: 1200, h: 1600 },
  { src: '/images/gallery/gallery-15.jpg', caption: 'Machinery inspection at the China yard', w: 1600, h: 1200 },
  { src: '/images/gallery/gallery-16.jpg', caption: 'Supplier meeting at the trade fair', w: 1200, h: 1600 },
] as const;

/**
 * The five facts behind the corridor claim.
 *
 * There is no `value` field any more. These cards used to lead with a big
 * numeral, which only works when every item HAS a number — three of these five
 * do not, and the two that do carry it inside the title ("2 legal entities"),
 * which is where it belongs and where it can be translated. A numeral column
 * with three blanks in it is worse than no numeral column, so the card leads
 * with an icon instead. Hence `icon` where `value` used to be.
 */
export const HIGHLIGHTS = [
  {
    id: 'chain',
    title: 'Full chain',
    body: 'Sourcing, contracts, customs, freight and delivery, all handled directly. No step handed to a broker.',
    icon: 'waypoints',
  },
  {
    id: 'entities',
    title: '2 legal entities',
    body: 'A Moroccan company that contracts with you, and a Chinese company that contracts with the factory — the only structure enforceable on both ends.',
    icon: 'scale',
  },
  {
    id: 'lines',
    title: '6 service lines under one roof',
    body: 'Sourcing, freight, customs, DDP, branding and company formation, all delivered by SHIPLI teams, not subcontractors.',
    icon: 'building',
  },
  {
    id: 'partners',
    title: 'Named partners and carriers',
    body: 'From MSC and China Cargo Airlines to manufacturers such as RONGTA and WEIRONG, plus a presence at WAM and GITEX Africa Morocco.',
    icon: 'ship',
  },
  {
    id: 'market',
    title: 'Market control, by design',
    body: 'Every client works with pricing built to let them control their local market, not just fill an order.',
    icon: 'trend',
  },
] as const;

export const STRATEGY = [
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
] as const;

export const PHILOSOPHY = [
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
] as const;

export const BLOG_POSTS = [
  {
    slug: 'landed-cost-morocco',
    title: 'What importing from China actually costs in Morocco',
    excerpt:
      'Duties in Morocco range from roughly 22% to 75% depending on the HS code. Here is how to model the landed cost before you commit to an order.',
    tag: 'Customs',
    read: '6 min read',
    date: '2026-07-28',
  },
  {
    slug: 'sea-vs-air-china-morocco',
    title: 'Sea or air: choosing a route from Guangzhou to Casablanca',
    excerpt:
      'Two weeks by air including clearance, roughly two months by sea. The right answer depends on your margin, not on the freight quote.',
    tag: 'Freight',
    read: '5 min read',
    date: '2026-07-14',
  },
  {
    slug: 'supplier-scams',
    title: 'Six ways importers lose money to suppliers, and how to close each one',
    excerpt:
      'Deposit fraud, spec drift, quiet material substitution. Each has a documented countermeasure, and most of them happen before production starts.',
    tag: 'Risk',
    read: '8 min read',
    date: '2026-06-30',
  },
  {
    slug: 'private-label-basics',
    title: 'Private label from a Chinese factory without owning a factory',
    excerpt:
      'Custom packaging, logo printing and product customisation are usually available well below the minimums importers assume.',
    tag: 'Branding',
    read: '4 min read',
    date: '2026-06-12',
  },
];

export const JOBS = [
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
];
