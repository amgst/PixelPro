import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ArrowLeft, Star, Gift, Sparkles, LayoutDashboard, Layers, Link2,
    CheckCircle, Database, ShoppingBag, Cloud, Bot, Mail, Server, Store, CreditCard,
    Gamepad2, Zap, Code2, Boxes, Wrench,
} from 'lucide-react';
import SEO from '../components/SEO';

const techChips = [
    'React Router 7', 'TypeScript', 'Prisma', 'PostgreSQL', 'Shopify Admin GraphQL', 'Polaris',
    'UI Extensions', 'Liquid', 'Claude API', 'Cloudflare R2', 'Resend', 'Vercel',
];

const stats = [
    { value: '580+', label: 'Commits shipped' },
    { value: '60+', label: 'Routes, APIs & webhooks' },
    { value: '16', label: 'Storefront, checkout & account surfaces' },
    { value: '24', label: 'Data models' },
];

const features = [
    {
        icon: Star,
        title: 'Reviews & UGC',
        items: [
            'Product, site-wide and grouped-product reviews',
            'Photo & video uploads with direct-to-R2 presigned URLs',
            'Tokenized post-purchase review request emails',
            'Moderation queue, on-demand translation',
            'Star ratings in Google via AggregateRating JSON-LD',
        ],
    },
    {
        icon: Gift,
        title: 'Loyalty Program',
        items: [
            'Points for orders, reviews, birthdays & custom tasks',
            'VIP tiers with configurable thresholds',
            'Reward redemption in cart and at checkout',
            'Receipt uploads for offline purchases',
            'Points expiry and timed double-points promos',
        ],
    },
    {
        icon: Sparkles,
        title: 'AI Insights',
        items: [
            'Per-product "Customers say" summaries with topic tags',
            'Store-wide analysis reports: themes, complaints, fixes',
            'Cached by filter fingerprint to keep API costs low',
        ],
    },
    {
        icon: LayoutDashboard,
        title: 'Merchant Admin',
        items: [
            'Embedded Polaris admin for members, rewards, reviews',
            'Analytics dashboards with charts and PDF exports',
            'Email template editor and job queue monitor',
            'Manual point credits with full audit ledger',
        ],
    },
    {
        icon: Layers,
        title: '16 Storefront Surfaces',
        items: [
            '12 theme app blocks: widgets, badges, carousel, portal',
            'Checkout UI extension for point balance & redemption',
            'Customer account & rewards page extensions',
        ],
    },
    {
        icon: Link2,
        title: 'Integrations',
        items: [
            'Real-time point bridge with a separate game-score app',
            'Passwordless one-time-code login and account linking',
            'Resend email with delivery webhooks and unsubscribes',
        ],
    },
];

const challenges = [
    {
        title: 'Zero-loss migration off Yotpo',
        body: 'Resumable, dry-run-first scripts imported every member, point balance, transaction history and review (with media) through the Yotpo APIs and CSV exports, then reconciled totals so no customer lost a single point at cutover.',
    },
    {
        title: 'Idempotent cross-app point bridge',
        body: "A separate score-tracking app awards points in real time. Requests are signed with HMAC-SHA256, and the partner's ledger ID acts as an idempotency key, so retries and duplicate deliveries can never double-credit a customer.",
    },
    {
        title: 'Video reviews without a video platform',
        body: 'Browsers upload straight to Cloudflare R2 through presigned URLs. A Worker transcodes to H.264 720p and calls back a secret-authenticated webhook that marks the video ready, so the app server never handles large files.',
    },
    {
        title: 'SEO stars with no client-side JS',
        body: "Every moderation change pushes the product's rating and count to a Shopify metafield. A theme block renders AggregateRating JSON-LD from it, so Google can show star ratings. A failed write never blocks moderation.",
    },
    {
        title: 'AI that pays for itself',
        body: 'Claude Haiku turns hundreds of reviews into short storefront summaries and admin improvement reports. Snapshots and fingerprint caching mean the API is only called when the underlying reviews actually change.',
    },
    {
        title: 'Identity across guest & logged-in sessions',
        body: 'Passwordless one-time-code login, silent re-auth and a merge flow that links guest loyalty records to Shopify customer accounts without duplicating balances.',
    },
];

const clients = [
    { icon: Store, title: 'Storefront theme', sub: '12 Liquid app blocks' },
    { icon: CreditCard, title: 'Checkout & Account', sub: '3 UI extensions' },
    { icon: LayoutDashboard, title: 'Shopify Admin', sub: 'Embedded Polaris app' },
    { icon: Gamepad2, title: 'Score App', sub: 'External partner' },
];

const services = [
    { icon: Database, title: 'PostgreSQL · Prisma' },
    { icon: ShoppingBag, title: 'Shopify Admin GraphQL' },
    { icon: Cloud, title: 'Cloudflare R2 + Worker' },
    { icon: Bot, title: 'Claude API' },
    { icon: Mail, title: 'Resend email' },
];

const serverCapabilities = [
    'Public APIs · App proxy',
    'Shopify webhooks (orders, customers)',
    'Cron jobs (expiry, digests, cleanup)',
    'HMAC-signed partner endpoint',
    'Rate limiting · OTP auth',
];

const stack = [
    { icon: Code2, title: 'Frontend', body: 'React 18, React Router 7, Shopify Polaris, App Bridge, Recharts' },
    { icon: ShoppingBag, title: 'Shopify', body: 'Admin GraphQL API, Checkout & Customer Account UI Extensions, Theme App Extensions (Liquid), App Proxy, Webhooks' },
    { icon: Boxes, title: 'Backend & Data', body: 'Node.js, TypeScript, Prisma ORM, PostgreSQL (Supabase), Vercel cron' },
    { icon: Wrench, title: 'Services', body: 'Anthropic Claude API, Cloudflare R2 & Workers, Resend, jsPDF' },
];

const ratingBars = [
    { stars: 5, pct: 86 },
    { stars: 4, pct: 9 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
];

const Stars: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
        ))}
    </div>
);

const CaseStudyReviewsRewards: React.FC = () => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: 'Reviews & Rewards — Custom Shopify App',
        description: 'A custom Shopify app that unifies product reviews, UGC, AI review insights and a points-based loyalty program, built to replace Yotpo.',
        creator: { '@type': 'Organization', name: 'Wbify' },
        dateCreated: '2026-04',
        keywords: techChips.join(', '),
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SEO
                title="Reviews & Rewards — Custom Shopify App Case Study"
                description="How we built a custom Shopify app that unifies product reviews, photo & video UGC, AI insights and a loyalty program — replacing Yotpo with zero data loss."
                canonical="/case-studies/reviews-rewards"
                type="article"
                structuredData={structuredData}
            />

            {/* Hero */}
            <section className="relative bg-slate-900 text-white pt-28 pb-24 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link to="/portfolio?category=Shopify" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
                    </Link>

                    <div className="animate-fade-in-up space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                            <ShoppingBag size={16} />
                            <span>Case Study · Shopify App</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
                            Reviews &amp; Rewards — <span className="text-green-400">one app</span> replacing a costly SaaS stack
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                            A custom Shopify app that unifies product reviews, photo &amp; video UGC, AI review insights and a full
                            points-based loyalty program for Doomlings, a fast-growing tabletop game brand. It migrated every member,
                            point balance and review off Yotpo with zero data loss.
                        </p>

                        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10 max-w-4xl">
                            {[
                                ['Role', 'Design & full-stack build'],
                                ['Client', 'Doomlings (DTC brand)'],
                                ['Timeline', 'Apr 2026 – present'],
                                ['Status', 'Live in production'],
                            ].map(([dt, dd]) => (
                                <div key={dt} className="pt-4">
                                    <dt className="text-xs uppercase tracking-wider text-gray-400">{dt}</dt>
                                    <dd className="mt-1 font-semibold">{dd}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="flex flex-wrap gap-2">
                            {techChips.map((chip) => (
                                <span key={chip} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                                    {chip}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white -mt-12 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s) => (
                            <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
                                <div className="text-3xl md:text-4xl font-bold text-slate-900">{s.value}</div>
                                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem + mockups */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-16">
                        <p className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3">The Problem</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Two products, two bills, no shared data</h2>
                        <p className="text-lg text-gray-500 leading-relaxed mb-4">
                            The brand ran reviews and loyalty on a third-party platform that was expensive, hard to customize, and walled
                            off its own customer data. Points couldn't reward things that mattered to the community, like playing the
                            game, and review insights stayed locked in a dashboard nobody had time to read.
                        </p>
                        <p className="text-lg text-gray-500 leading-relaxed">
                            The goal: own the whole stack in one app, match every feature customers relied on, then go further with AI
                            insights, on-brand widgets and integrations a SaaS tool couldn't offer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Reviews widget mock */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Storefront · Product reviews widget</p>
                            <div className="flex flex-wrap items-center gap-8">
                                <div>
                                    <div className="text-5xl font-bold text-slate-900">4.8</div>
                                    <Stars />
                                    <div className="text-xs text-gray-500 mt-1">1,284 reviews</div>
                                </div>
                                <div className="flex-1 min-w-[180px] space-y-1.5">
                                    {ratingBars.map((b) => (
                                        <div key={b.stars} className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="w-3">{b.stars}</span>
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${b.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-100">
                                <div className="flex items-center gap-2 font-bold text-green-700 mb-2">
                                    <Sparkles size={16} /> Customers say
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Players love how fast games are to learn and how replayable the expansions feel. A few mention the box
                                    is tight once sleeves are added.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {['Replayability · 312', 'Family game night · 204', 'Artwork · 158'].map((t) => (
                                        <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white border border-green-100 text-slate-600">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-sm">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">Sam R.</span>
                                        <Stars size={12} />
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                                        <CheckCircle size={14} /> Verified buyer
                                    </span>
                                </div>
                                <p className="text-gray-600">Became our go-to game in a week. The expansion adds a lot without making it harder to teach.</p>
                                <div className="flex gap-2 mt-3">
                                    {['photo', '▶ video'].map((m) => (
                                        <div key={m} className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-50 to-slate-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-500">{m}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rewards mock */}
                        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Customer account · Rewards</p>
                            <p className="text-sm text-gray-400">Your balance</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-4xl font-bold">2,340 pts</span>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-900">Gold</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 mt-5 mb-2 overflow-hidden">
                                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-green-500 to-amber-400" />
                            </div>
                            <p className="text-xs text-gray-400">660 pts to Platinum</p>

                            <div className="space-y-2 mt-6">
                                {[
                                    ['Make a purchase', '5 pts / $1'],
                                    ['Write a photo review', '+100'],
                                    ['Log a game in the Score App', '+25'],
                                    ['Birthday reward', '+250'],
                                ].map(([label, pts]) => (
                                    <div key={label} className="flex justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm">
                                        <span className="text-gray-300">{label}</span>
                                        <span className="font-bold text-green-400 whitespace-nowrap">{pts}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border border-dashed border-amber-400/60 text-amber-400">
                                <Zap size={14} /> Double points on purchases this weekend
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Illustrative mock-ups. Numbers are sample data.</p>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3">What We Built</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything in One App</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Feature parity with the old SaaS stack, then a lot more on top.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f) => (
                            <div key={f.title} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <f.icon className="text-green-600" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                                <ul className="space-y-3">
                                    {f.items.map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3">Architecture</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Fits Together</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            One React Router server on Vercel serves the embedded admin, the public storefront APIs and the webhooks,
                            all backed by a single Postgres schema.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1.2fr_auto_1fr] gap-6 items-center">
                        {/* Clients */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Clients</p>
                            {clients.map((c) => (
                                <div key={c.title} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <c.icon size={20} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">{c.title}</div>
                                        <div className="text-xs text-gray-500">{c.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <ArrowRight className="hidden lg:block text-gray-300 mx-auto" size={28} />
                        <ArrowRight className="lg:hidden text-gray-300 mx-auto rotate-90" size={28} />

                        {/* Core */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30" />
                            <div className="relative bg-slate-900 text-white rounded-2xl p-6 border border-slate-700">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <Server size={20} className="text-green-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold">App Server</div>
                                        <div className="text-xs text-gray-400">React Router 7 · Hosted on Vercel</div>
                                    </div>
                                </div>
                                <ul className="space-y-2.5">
                                    {serverCapabilities.map((cap) => (
                                        <li key={cap} className="flex items-center gap-2.5 text-sm text-gray-300">
                                            <CheckCircle size={14} className="text-green-400 shrink-0" /> {cap}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <ArrowRight className="hidden lg:block text-gray-300 mx-auto" size={28} />
                        <ArrowRight className="lg:hidden text-gray-300 mx-auto rotate-90" size={28} />

                        {/* Services */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Services</p>
                            {services.map((s) => (
                                <div key={s.title} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                        <s.icon size={20} className="text-green-600" />
                                    </div>
                                    <div className="font-semibold text-slate-900 text-sm">{s.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Engineering highlights */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3">Engineering Highlights</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Interesting Problems We Solved</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {challenges.map((c, i) => (
                            <div key={c.title} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className="text-sm font-bold text-green-600 mb-3">{String(i + 1).padStart(2, '0')}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{c.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech stack */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-bold uppercase tracking-wider text-green-600 mb-3">Tech Stack</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built With</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {stack.map((s) => (
                            <div key={s.title} className="flex gap-5 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                                    <s.icon size={22} className="text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{s.title}</h3>
                                    <p className="text-slate-900 font-medium">{s.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Need a custom Shopify app?</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Tired of paying for SaaS tools you can't customize? We build Shopify apps tailored to how your brand actually works.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact">
                            <button className="px-8 py-4 bg-green-500 text-slate-900 rounded-full font-bold hover:bg-green-400 transition-all shadow-lg hover:shadow-green-500/25 inline-flex items-center gap-2">
                                Start Your Project <ArrowRight size={18} />
                            </button>
                        </Link>
                        <Link to="/shopify">
                            <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all inline-flex items-center gap-2">
                                Our Shopify Services
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CaseStudyReviewsRewards;
