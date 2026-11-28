import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { Subweb, SubwebCategory, SUBWEB_CATEGORIES, subwebs, subwebUrl } from '../data/subwebsData';

type Filter = 'All' | SubwebCategory;

/** Mounts children only once the element scrolls near the viewport. */
const useInView = <T extends Element>(rootMargin = '300px') => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
};

const SitePreview: React.FC<{ site: Subweb }> = ({ site }) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [loaded, setLoaded] = useState(false);
  const canEmbed = site.embeddable !== false;

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      {/* Branded placeholder — visible while loading, or permanently if the site can't be framed */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${site.accent} text-white transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span className="text-5xl font-black tracking-tight drop-shadow-sm">
          {site.name.charAt(0)}
        </span>
        <span className="mt-2 text-sm font-medium opacity-90">{site.subdomain}.wbify.com</span>
        {canEmbed && inView && !loaded && (
          <span className="mt-4 h-1 w-16 overflow-hidden rounded-full bg-white/30">
            <span className="block h-full w-1/2 animate-pulse rounded-full bg-white" />
          </span>
        )}
      </div>

      {canEmbed && inView && (
        <iframe
          src={subwebUrl(site)}
          title={`${site.name} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
          // Render the site at 4x the card width (desktop layout), then scale down to fit.
          className="pointer-events-none absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0"
        />
      )}
    </div>
  );
};

const SubwebCard: React.FC<{ site: Subweb; featured?: boolean }> = ({ site, featured }) => {
  const url = subwebUrl(site);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
          <Globe size={12} className="shrink-0" />
          <span className="truncate">
            <span className="font-semibold text-slate-800">{site.subdomain}</span>.wbify.com
          </span>
        </div>
      </div>

      <div className="relative flex-1">
        <SitePreview site={site} />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="m-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
            Visit site <ArrowUpRight size={16} />
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className={`font-bold text-slate-900 ${featured ? 'text-2xl' : 'text-lg'}`}>{site.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{site.tagline}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {site.category}
        </span>
      </div>
    </a>
  );
};

const Subwebs: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('All');

  const visible = useMemo(
    () => (filter === 'All' ? subwebs : subwebs.filter((s) => s.category === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: subwebs.length };
    for (const s of subwebs) c[s.category] = (c[s.category] ?? 0) + 1;
    return c;
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wbify Subwebs',
    description: 'Live web apps and websites built and hosted by Wbify on wbify.com subdomains.',
    url: 'https://www.wbify.com/subwebs',
    hasPart: subwebs.map((s) => ({ '@type': 'WebSite', name: s.name, url: subwebUrl(s) })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Subwebs — Live Apps & Websites on wbify.com | Wbify"
        description="Explore live web apps and websites built by Wbify: tools, business sites, restaurant systems, e-commerce and workspace apps — all running on wbify.com subdomains."
        canonical="/subwebs"
        structuredData={structuredData}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white md:py-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-blue-200">
            <Layers size={16} /> The wbify.com universe
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Subwebs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
            {subwebs.length} live websites and web apps we've built and host on our own subdomains.
            Have a look around, every preview is the real site.
          </p>

          <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-4 text-left">
            <div>
              <div className="text-3xl font-bold">{subwebs.length}</div>
              <div className="text-sm text-slate-400">Live sites</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{SUBWEB_CATEGORIES.length}</div>
              <div className="text-sm text-slate-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1</div>
              <div className="text-sm text-slate-400">Studio behind them</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-20 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {(['All', ...SUBWEB_CATEGORIES] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f} <span className="opacity-60">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((site, i) => (
              <SubwebCard key={site.subdomain} site={site} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Want one of your own?</h2>
          <p className="mt-4 text-lg text-slate-500">
            We build sites and apps like these for clients every week. Tell us what you need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/start-project"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Start a project <ArrowUpRight size={18} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              See our portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subwebs;
