// Sub-websites hosted on *.wbify.com (CNAME records in DNS).
// Technical records (www, Vercel verification, Resend `send` / `rsend`) are intentionally excluded.

export type SubwebCategory = 'Tools' | 'Business' | 'Food & Events' | 'Commerce' | 'Workspace';

export interface Subweb {
  subdomain: string;
  name: string;
  tagline: string;
  category: SubwebCategory;
  /** Accent gradient used for the card fallback / glow. */
  accent: string;
  /** False when the site sends X-Frame-Options / frame-ancestors and can't be previewed live. */
  embeddable?: boolean;
}

export const SUBWEB_CATEGORIES: SubwebCategory[] = ['Tools', 'Business', 'Food & Events', 'Commerce', 'Workspace'];

export const subwebs: Subweb[] = [
  // Workspace
  { subdomain: 'mail', name: 'WBIFY Mail', tagline: 'Private business email for wbify.com.', category: 'Workspace', accent: 'from-sky-500 to-indigo-600' },
  { subdomain: 'meet', name: 'WBIFY Meet', tagline: 'Meetings that feel effortless.', category: 'Workspace', accent: 'from-violet-500 to-fuchsia-600' },
  { subdomain: 'fax', name: 'FaxBridge', tagline: 'Send faxes online, no machine needed.', category: 'Workspace', accent: 'from-slate-500 to-slate-800' },
  { subdomain: 'screen', name: 'LuminaSign Cloud', tagline: 'Cloud-managed digital signage screens.', category: 'Workspace', accent: 'from-cyan-500 to-blue-700' },

  // Tools
  { subdomain: 'ats', name: 'ATS Resume Converter', tagline: 'Turn creative PDF resumes into ATS-friendly ones.', category: 'Tools', accent: 'from-emerald-500 to-teal-700' },
  { subdomain: 'tube', name: 'Live Stream Recorder', tagline: 'Record live streams, tabs or your whole screen in-browser.', category: 'Tools', accent: 'from-red-500 to-rose-700' },
  { subdomain: 'cursorforge', name: 'Cursor Forge', tagline: 'Design and download custom cursors.', category: 'Tools', accent: 'from-amber-500 to-orange-700' },
  { subdomain: 'card', name: 'EliteCard Designer', tagline: 'Design premium business cards online.', category: 'Tools', accent: 'from-yellow-500 to-amber-700' },
  { subdomain: 'dcard', name: 'TheCard', tagline: 'Link-in-bio digital card builder for Instagram.', category: 'Tools', accent: 'from-pink-500 to-purple-700' },
  { subdomain: 'voucher', name: 'VoucherVibe', tagline: 'Create and share gift vouchers.', category: 'Tools', accent: 'from-lime-500 to-green-700' },
  { subdomain: 'shopify', name: 'Shopify Sections', tagline: 'Premium pre-built Shopify theme sections.', category: 'Tools', accent: 'from-green-500 to-emerald-700' },

  // Business
  { subdomain: 'dental', name: 'Dental Clinic', tagline: 'Modern dental clinic website and bookings.', category: 'Business', accent: 'from-sky-400 to-cyan-700' },
  { subdomain: 'cars', name: 'Premium Car Rentals', tagline: 'Luxury vehicle hire across Australia.', category: 'Business', accent: 'from-zinc-600 to-neutral-900' },
  { subdomain: 'leadger', name: 'ClearLedger', tagline: 'Accounting & advisory firm website.', category: 'Business', accent: 'from-blue-600 to-indigo-900' },
  { subdomain: 'jobs', name: "Architect's Job Portal", tagline: 'Job board for architecture professionals.', category: 'Business', accent: 'from-stone-500 to-stone-800', embeddable: false },
  { subdomain: 'neon', name: 'Luminal Sign', tagline: 'Design and shop custom LED neon signs.', category: 'Business', accent: 'from-fuchsia-500 to-pink-700' },

  // Food & Events
  { subdomain: 'pizza', name: 'Pizza Shop', tagline: 'Hand-crafted pizza & Italian cuisine.', category: 'Food & Events', accent: 'from-orange-500 to-red-700' },
  { subdomain: 'restaurant', name: 'GenSavor AI Cuisine', tagline: 'AI-powered restaurant experience.', category: 'Food & Events', accent: 'from-amber-600 to-red-800' },
  { subdomain: 'cafe', name: 'GenSavor Café', tagline: 'Café menus and ordering, AI-crafted.', category: 'Food & Events', accent: 'from-yellow-700 to-amber-900' },
  { subdomain: 'resturent', name: 'Restaurant Manager', tagline: 'Multi-location POS & order management.', category: 'Food & Events', accent: 'from-rose-500 to-orange-700' },
  { subdomain: 'sweet', name: 'SweetTreats & Events', tagline: 'Bakery, sweets and event catering hub.', category: 'Food & Events', accent: 'from-pink-400 to-rose-600' },
  { subdomain: 'event', name: 'Event Hub', tagline: 'Plan, promote and manage events.', category: 'Food & Events', accent: 'from-indigo-500 to-violet-700' },

  // Commerce
  { subdomain: 'dukan', name: 'SwiftCart COD', tagline: 'Effortless cash-on-delivery e-commerce.', category: 'Commerce', accent: 'from-teal-500 to-cyan-800' },
  { subdomain: 'dollar', name: 'DollarDash & Bundler', tagline: 'Dollar-store deals and product bundles.', category: 'Commerce', accent: 'from-green-600 to-lime-800' },
];

export const subwebUrl = (s: Subweb) => `https://${s.subdomain}.wbify.com`;
