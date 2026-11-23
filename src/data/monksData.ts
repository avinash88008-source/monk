import realtimeBrandsImg from '../assets/images/solution-realtime-brands.webp';
import mediaAccelerationImg from '../assets/images/solution-media-acceleration.webp';
import marketingOrchestrationImg from '../assets/images/solution-marketing-orchestration.webp';
import aiTransformationImg from '../assets/images/solution-ai-transformation.webp';
import monksFlowThumbnail from '../assets/images/monks-flow-thumbnail.png';
import boomtownImg from '../assets/images/expertise-boomtown-unboxed.webp';
import aeoGeoImg from '../assets/images/expertise-aeo-geo.webp';
import ces2026Img from '../assets/images/expertise-ces-2026.webp';
import heroSizzleVideo from '../assets/videos/monks-hero-sizzle.mp4';

import portraitOne from '../assets/images/iwon_portrait_one_1795418326271.jpg';
import portraitTwo from '../assets/images/iwon_portrait_two_1795418326428.jpg';
import portraitThree from '../assets/images/iwon_portrait_three_1795418326521.jpg';
import portraitFour from '../assets/images/iwon_portrait_four_1795418326945.jpg';
import portraitFive from '../assets/images/iwon_portrait_five_1795418325991.jpg';

export const VIDEO_ASSETS = {
  heroSizzle: {
    localUrl: heroSizzleVideo,
    sourceUrl:
      'https://www.monks.com/data/s3fs-public/2026-08/Monks-Sizzle_1280x720%20%283%29.mp4?VersionId=YunZ_b.L72KXocRIFA8._9qbQwtWQSAe',
    dimensions: '1280x720',
    format: 'video/mp4',
  },
  monksFlowManifesto: {
    sourceUrl:
      'https://www.monks.com/data/2026-07/2026_monks-flow_brand-manifesto_v021-MonksBrand.mp4?VersionId=TYvsmadeK_czP8bOFNHFINTAKZercins',
    posterUrl: monksFlowThumbnail,
    dimensions: '1920x1080',
    duration: '00:58',
    format: 'video/mp4',
  },
  sirMartinSorrell: {
    sourceUrl:
      'https://www.monks.com/data/2025-09/SMS-Personalization.mp4?VersionId=EeMCguNIwuV6NuRgLBj2HvhFzFG.9ySt',
    dimensions: '1080x1920',
    format: 'video/mp4',
  },
};

export interface NavDropdownItem {
  label: string;
  description: string;
  href: string;
}

export interface NavCategory {
  id: string;
  label: string;
  items?: NavDropdownItem[];
  href?: string;
}

export const HEADER_NAV: NavCategory[] = [
  {
    id: 'solutions',
    label: 'Solutions',
    items: [
      {
        label: 'Real-Time Brands',
        description: 'Brands built as living systems to move at the speed of culture.',
        href: '#solutions',
      },
      {
        label: 'Marketing Orchestration',
        description: 'Collapse your content supply chain into one AI-powered system.',
        href: '#solutions',
      },
      {
        label: 'Media Acceleration',
        description: 'Unifying intelligence, content, media, and measurement.',
        href: '#solutions',
      },
      {
        label: 'IWON- Flow',
        description: 'Always-on agents for last-mile marketing intelligence.',
        href: '#agents',
      },
    ],
  },
  {
    id: 'marketing-services',
    label: 'Marketing Services',
    items: [
      { label: 'Brand', description: 'Cultural strategy, identity systems, and brand architecture.', href: '#solutions' },
      { label: 'Social', description: 'Real-time community, creator ecosystems, and social storytelling.', href: '#solutions' },
      { label: 'Media', description: 'Data-fueled media planning, buying, and attribution.', href: '#solutions' },
      { label: 'Data', description: 'First-party data foundations, clean rooms, and predictive analytics.', href: '#solutions' },
      { label: 'Experience', description: 'Digital products, spatial environments, and commerce.', href: '#solutions' },
      { label: 'Studio', description: 'High-velocity global content production at scale.', href: '#solutions' },
      { label: 'Platforms', description: 'Enterprise martech, cloud ecosystems, and custom integrations.', href: '#solutions' },
      { label: 'Commerce', description: 'Connected retail media and conversion-driven storefronts.', href: '#solutions' },
    ],
  },
  {
    id: 'technology-services',
    label: 'Technology Services',
    items: [
      {
        label: 'Artificial Intelligence',
        description: 'Custom enterprise AI workflows and generative pipelines.',
        href: '#agents',
      },
      {
        label: 'Custom Software & Digital Platforms',
        description: 'Resilient cloud-native applications engineered for scale.',
        href: '#solutions',
      },
      {
        label: 'QA & Automation Testing',
        description: 'Continuous quality engineering across complex release cycles.',
        href: '#solutions',
      },
      {
        label: 'Cloud & Infrastructure',
        description: 'Modern cloud architecture, FinOps, and security hardening.',
        href: '#solutions',
      },
      {
        label: 'Data, AI, & Automation',
        description: 'Enterprise data pipelines and intelligent process automation.',
        href: '#agents',
      },
      {
        label: 'Consulting Services',
        description: 'Strategic modernization and technical advisory.',
        href: '#contact',
      },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    href: '#expertise',
  },
  {
    id: 'about',
    label: 'About Us',
    items: [
      { label: 'What We Do', description: 'Our unitary operating model across 30+ countries.', href: '#solutions' },
      { label: 'Partners', description: 'Strategic alliances with leading cloud and AI platforms.', href: '#expertise' },
      { label: 'Thinking', description: 'Research, playbooks, and perspectives from our experts.', href: '#insights' },
      { label: 'Events', description: 'Global summits, CES briefings, and industry stages.', href: '#expertise' },
      { label: 'Careers', description: 'Join our global team of creative technologists.', href: '#footer' },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    href: '#contact',
  },
];

export interface SolutionCardData {
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  offsetDown: boolean;
  pillars: string[];
  outcome: string;
}

export const SOLUTIONS_DATA: SolutionCardData[] = [
  {
    number: '01',
    category: 'Solutions',
    title: 'Real-Time Brands',
    description: 'Brands built as living systems to move at the speed of culture',
    image: realtimeBrandsImg,
    alt: 'Bold mustard yellow typographic brand collaboration showcase',
    offsetDown: false,
    pillars: ['Cultural Intelligence', 'Living Design Systems', 'Creator & Social Velocity'],
    outcome: 'Move from quarterly campaign calendars to real-time cultural participation.',
  },
  {
    number: '02',
    category: 'Solutions',
    title: 'Media Acceleration',
    description: 'Unifying intelligence, content, media, and measurement into one performance system',
    image: mediaAccelerationImg,
    alt: 'Multiple dynamic digital campaign variations arranged across screens',
    offsetDown: true,
    pillars: ['Full-Funnel Attribution', 'Dynamic Creative Optimization', 'Retail & Programmatic Media'],
    outcome: 'Eliminate silos between creative resonance and measurable media performance.',
  },
  {
    number: '03',
    category: 'Solutions',
    title: 'Marketing Orchestration',
    description: 'We collapse your content supply chain into one AI-powered system',
    image: marketingOrchestrationImg,
    alt: 'IWON- Flow marketing orchestration interface showing connected workflow modules',
    offsetDown: false,
    pillars: ['IWON- Flow Workflows', 'Automated Localization', 'Global Studio Operations'],
    outcome: 'Produce, adapt, and deploy omnichannel assets faster with human-led craft.',
  },
  {
    number: '04',
    category: 'Solutions',
    title: 'AI Transformation',
    description: 'AI embedded across your business, from strategy to scale',
    image: aiTransformationImg,
    alt: 'Engineers and strategists collaborating around dual monitors in a studio',
    offsetDown: true,
    pillars: ['Custom Agent Architectures', 'Enterprise Data Foundations', 'Governance & Enablement'],
    outcome: 'Turn AI experimentation into secure, measurable enterprise capability.',
  },
];

export interface ExpertiseItem {
  id: string;
  tag: string;
  title: string;
  image: string;
  alt: string;
  colSpanClass: string;
  aspectClass: string;
  summary: string;
  highlights: string[];
}

export const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    id: 'boomtown-unboxed',
    tag: 'Case Study',
    title: 'Boomtown Unboxed',
    image: boomtownImg,
    alt: 'Boomtown Unboxed logo surrounded by vibrant personalized festival recap mobile screens',
    colSpanClass: 'lg:col-span-5',
    aspectClass: 'aspect-[997/600]',
    summary:
      'Transforming festival-goers’ real-world RFID and stage check-ins into hyper-personalized, shareable year-in-review films generated automatically for tens of thousands of unique visitors.',
    highlights: [
      'Dynamic data-driven video rendering personalized per attendee',
      'Seamless mobile-first sharing driving organic post-event advocacy',
      'Built on unified telemetry and automated motion templates',
    ],
  },
  {
    id: 'aeo-geo-playbook',
    tag: 'Content',
    title: 'Owning the Answer: The Marketer’s Playbook for AEO, GEO and the AI Search Era',
    image: aeoGeoImg,
    alt: 'Abstract luminous violet and magenta fluid 3D visual',
    colSpanClass: 'lg:col-span-3',
    aspectClass: 'aspect-square',
    summary:
      'As discovery shifts from ten blue links to synthesized AI answers, brands must architect structured authority across Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).',
    highlights: [
      'Structuring canonical brand facts and schema for LLM retrieval',
      'Measuring citation share across conversational answer engines',
      'Aligning PR, product feeds, and editorial depth for AI discovery',
    ],
  },
  {
    id: 'ces-2026',
    tag: 'Content',
    title: 'CES 2026: From Vision to Velocity',
    image: ces2026Img,
    alt: 'IWON- leadership panel speaking on stage at CES Foundry C Space',
    colSpanClass: 'lg:col-span-4',
    aspectClass: 'aspect-[645/600]',
    summary:
      'Key takeaways from CES C Space in Las Vegas on how CMOs and CIOs are moving beyond generative pilots to production agentic systems that connect brand story with revenue.',
    highlights: [
      'Why connected first-party data separates leaders from laggards',
      'Closing the gap between media optimization and creative supply chains',
      'Practical governance for brand-safe autonomous marketing agents',
    ],
  },
];

export interface InsightItem {
  id: string;
  type: 'Report' | 'Blog Post';
  titleBold: string;
  titleRegular: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
}

export const INSIGHTS_DATA: InsightItem[] = [
  {
    id: 'high-value-users-ml',
    type: 'Report',
    titleBold: 'Unlocking High-Value Users',
    titleRegular: 'with Machine Learning',
    readTime: '2 min read',
    summary:
      'How predictive LTV modeling combined with clean-room signals enables media teams to bid on future customer value rather than short-term click proxies.',
    keyTakeaways: [
      'Shift acquisition bidding from immediate ROAS to predicted 180-day margin.',
      'Combine CRM churn predictors with real-time platform conversion APIs.',
      'Validate incremental lift through automated geo-holdout experiments.',
    ],
  },
  {
    id: 'clv-email-engine',
    type: 'Blog Post',
    titleBold: 'Why Your Customer Lifetime Value Strategy',
    titleRegular: 'Hinges on a High-Performance Email Engine',
    readTime: '5 min read',
    summary:
      'Owned lifecycle channels remain the highest-margin retention lever when modular content blocks, send-time intelligence, and behavioral triggers work as a single system.',
    keyTakeaways: [
      'Modular design systems cut campaign build time by over half.',
      'Real-time behavioral triggers outperform batch-and-blast calendars.',
      'Deliverability hygiene and preference centers protect long-term reach.',
    ],
  },
  {
    id: 'salesforce-connections-agentic-ai',
    type: 'Blog Post',
    titleBold: 'Inside Salesforce Connections 2025',
    titleRegular: 'and the Conversational Potential of Agentic AI',
    readTime: '5 min read',
    summary:
      'Field notes on moving from static customer journeys to conversational, multi-agent orchestration across service, commerce, and marketing clouds.',
    keyTakeaways: [
      'Unified zero-copy data lakes unlock real-time agent context.',
      'Conversational commerce reduces friction in high-consideration categories.',
      'Human-in-the-loop guardrails ensure tone and brand compliance.',
    ],
  },
  {
    id: 'amplitude-experimentation',
    type: 'Blog Post',
    titleBold: 'Driving Experimentation and AI Innovation',
    titleRegular: 'with Amplitude',
    readTime: '5 min read',
    summary:
      'Building a continuous experimentation culture where product telemetry, feature flags, and AI-assisted hypothesis generation accelerate conversion gains.',
    keyTakeaways: [
      'Connect marketing acquisition cohorts directly to in-product activation.',
      'Standardize taxonomy before scaling automated A/B testing velocity.',
      'Use session replay insights alongside quantitative funnel drop-offs.',
    ],
  },
  {
    id: 'experience-centers',
    type: 'Blog Post',
    titleBold: 'Experience Centers:',
    titleRegular: 'Where Brands Come to Life',
    readTime: '6 min read',
    summary:
      'Designing flagship physical-digital environments that blend spatial computing, tactile storytelling, and live telemetry for enterprise and consumer audiences.',
    keyTakeaways: [
      'Blend modular physical architecture with real-time generative canvases.',
      'Design spaces for both executive briefings and shareable social moments.',
      'Capture post-visit engagement loops tied to digital follow-ups.',
    ],
  },
  {
    id: 'mmm-meta-analysis-tiktok',
    type: 'Blog Post',
    titleBold: 'Smarter Investments for an Evolving Marketing Landscape:',
    titleRegular: 'MMM Meta-Analysis with IWON- and TikTok',
    readTime: '7 min read',
    summary:
      'Cross-industry Marketing Mix Modeling findings revealing how short-form video creative freshness directly amplifies upper- and lower-funnel ROI.',
    keyTakeaways: [
      'Creative velocity is the #1 controllable driver of video media efficiency.',
      'Always-on presence builds baseline equity that boosts search capture.',
      'Calibrate MMM priors with ongoing platform lift studies.',
    ],
  },
];

export const IWON_TEAM_PORTRAITS = [
  {
    id: 'director',
    src: portraitOne,
    alt: 'IWON- Creative Director',
    initials: 'CD',
    ring: 'outer',
    positionClass: 'top-[4%] left-[52%] -translate-x-1/2',
    sizeClass: 'w-12 h-12 sm:w-14 sm:h-14',
  },
  {
    id: 'architect',
    src: portraitTwo,
    alt: 'IWON- AI Solutions Architect',
    initials: 'AI',
    ring: 'outer',
    positionClass: 'top-[28%] right-[3%]',
    sizeClass: 'w-11 h-11 sm:w-13 sm:h-13',
  },
  {
    id: 'strategist',
    src: portraitThree,
    alt: 'IWON- Brand Strategist',
    initials: 'BS',
    ring: 'middle',
    positionClass: 'bottom-[12%] right-[12%]',
    sizeClass: 'w-12 h-12 sm:w-14 sm:h-14',
  },
  {
    id: 'designer',
    src: portraitFour,
    alt: 'IWON- Principal Product Designer',
    initials: 'PD',
    ring: 'outer',
    positionClass: 'bottom-[10%] left-[10%]',
    sizeClass: 'w-11 h-11 sm:w-13 sm:h-13',
  },
  {
    id: 'producer',
    src: portraitFive,
    alt: 'IWON- Executive Producer',
    initials: 'EP',
    ring: 'middle',
    positionClass: 'top-[24%] left-[4%]',
    sizeClass: 'w-12 h-12 sm:w-14 sm:h-14',
  },
];

export const CONTACT_SERVICES = [
  'Real-Time Brands',
  'Media Acceleration',
  'Marketing Orchestration',
  'AI Transformation',
  'Technology & Platforms',
  'Brand & Experience Design',
];

export const CONTACT_COMPANY_SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–1,000 employees',
  '1,000+ employees',
];

export const CONTACT_LOCATIONS = [
  'North America',
  'Europe',
  'United Kingdom',
  'Asia Pacific',
  'Latin America',
  'Middle East & Africa',
  'Global / Multi-Region',
];

export const PARTNER_PLACEHOLDER_MARKS = [
  { id: 'verve', name: 'VERVE LABS', shape: 'circle' as const },
  { id: 'kinetik', name: 'KINETIK', shape: 'bars' as const },
  { id: 'strata', name: 'STRATA', shape: 'layers' as const },
  { id: 'meridian', name: 'MERIDIAN', shape: 'arc' as const },
  { id: 'valence', name: 'VALENCE', shape: 'diamond' as const },
  { id: 'monolith', name: 'MONOLITH', shape: 'square' as const },
  { id: 'pulse', name: 'PULSE GRID', shape: 'dots' as const },
  { id: 'nordic', name: 'NORDIC CORE', shape: 'ring' as const },
];

export const FOOTER_PRIMARY_LINKS = [
  { label: 'What We Do', href: '#solutions' },
  { label: 'Partners', href: '#expertise' },
  { label: 'Work', href: '#expertise' },
  { label: 'Careers', href: '#connect' },
  { label: 'Thinking', href: '#insights' },
  { label: 'Connect', href: '#contact' },
];

export const FOOTER_POLICY_LINKS = [
  'IWON- Global Group',
  'Sustainability',
  'Privacy Notice',
  'Cookie Policy',
  'Information Security & Compliance',
  'Responsible Vulnerability Reporting Policy',
  'Ethical Marketing Policy',
  'Modern Slavery Statement',
  'Code of Conduct',
  'Anti-Hate Statement',
  'Speak Up Policy',
  'Accessibility Statement',
  'Armed Forces Covenant',
  'Land Acknowledgement',
];

export const LANGUAGES = [
  'English',
  'Español',
  'Português',
  'Français',
  'Deutsch',
  'Nederlands',
  '日本語',
  '中文',
];
