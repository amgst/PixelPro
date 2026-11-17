import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, ShoppingBag, Code2, Palette, CalendarDays } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../components/SettingsProvider';

const services = [
    { id: 'shopify', title: 'An online store', detail: 'Shopify setup, redesign, or improvements to an existing store.', icon: ShoppingBag },
    { id: 'web-dev', title: 'A business website', detail: 'A new website, a redesign, or custom web development.', icon: Code2 },
    { id: 'graphics', title: 'Design & print', detail: 'Brand identity, marketing graphics, or print-ready design.', icon: Palette }
];
export default function StartProject() {
    const [params] = useSearchParams();
    const [service, setService] = useState('shopify');
    const { settings } = useSettings();
    const query = new URLSearchParams({ type: service, funnel: 'project-start' });
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
        const value = params.get(key); if (value) query.set(key, value.slice(0, 100));
    });
    const bookingUrl = settings.bookingUrl?.startsWith('https://') ? settings.bookingUrl : '';
    return <>
        <SEO title="Start your next project" description="Tell Wbify what your business needs. Explore our work and request a tailored website, Shopify, design, or print proposal." canonical="/start-project" />
        <section className="bg-slate-950 text-white px-5 py-16 md:py-24 relative overflow-hidden">
            <div className="absolute w-96 h-96 bg-blue-700/20 rounded-full blur-3xl -top-32 right-0 pointer-events-none" />
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
                <div><p className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-5">Your next chapter starts here</p><h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">Give your business<br /><span className="text-blue-400">a better first impression.</span></h1><p className="text-slate-300 text-lg leading-relaxed mt-6 max-w-lg">A store that fits your products. A website that explains your value. Design that makes your business recognizable. Let?s find the right next step.</p><div className="mt-8 flex flex-wrap gap-4"><a href="#project-options" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-full inline-flex items-center gap-2 font-semibold">Plan my project <ArrowRight size={18} /></a><Link to="/portfolio" className="border border-slate-600 px-6 py-3 rounded-full font-semibold">Explore our work</Link></div><div className="flex flex-wrap gap-5 text-sm text-slate-400 mt-8"><span className="flex gap-2 items-center"><Check size={15} /> Tailored project scope</span><span className="flex gap-2 items-center"><Check size={15} /> No payment to inquire</span></div></div>
                <div id="project-options" className="scroll-mt-28 bg-white text-slate-900 rounded-2xl p-6 md:p-8 shadow-xl"><p className="text-xs text-blue-600 uppercase tracking-widest font-bold">Step 1 of 2 ? Choose your direction</p><h2 className="text-2xl font-bold mt-3 mb-2">What are you working on?</h2><p className="text-sm text-slate-500 mb-6">Choose a starting point. We?ll ask for your brief next.</p><div role="radiogroup" aria-label="Project service" className="space-y-3">{services.map(({ id, title, detail, icon: Icon }) => <label key={id} className={`cursor-pointer rounded-xl border-2 p-4 flex gap-3 items-start ${service === id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}><input type="radio" name="project-service" value={id} checked={service === id} onChange={() => setService(id)} className="mt-1" /><Icon size={22} className="text-blue-600 shrink-0" /><span><span className="font-semibold block">{title}</span><span className="text-sm text-slate-500 block mt-1">{detail}</span></span></label>)}</div><Link to={`/inquiry?${query}`} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-semibold inline-flex items-center justify-center gap-2">Tell us about your project <ArrowRight size={18} /></Link><p className="text-xs text-slate-400 text-center mt-3">Your brief helps us recommend scope and next steps.</p></div>
            </div>
        </section>
        <section className="px-5 py-16 bg-slate-50"><div className="max-w-6xl mx-auto"><p className="text-xs font-bold uppercase tracking-widest text-blue-600">A clear path forward</p><h2 className="text-3xl font-bold mt-3 mb-9">From an idea to an agreed plan.</h2><div className="grid md:grid-cols-3 gap-6">{[
            ['01', 'Share your goals', 'Tell us what you want to improve, who you serve, and when you want to launch.'],
            ['02', 'Find the right scope', 'We review your brief and discuss priorities, budget, and what success looks like.'],
            ['03', 'Agree on the next step', 'Review the proposed deliverables and timeline before deciding to move forward.']
        ].map(([number, title, detail]) => <article key={number} className="bg-white border rounded-xl p-7"><span className="text-blue-600 font-bold text-sm">{number}</span><h3 className="text-xl font-bold mt-4">{title}</h3><p className="text-slate-500 text-sm leading-relaxed mt-3">{detail}</p></article>)}</div></div></section>
        <section className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10"><div><h2 className="text-2xl font-bold mb-4">Want to see how we work?</h2><p className="text-slate-500 mb-4">Explore our portfolio and the Reviews & Rewards case study before sharing your brief.</p><div className="flex flex-wrap gap-5 font-semibold text-sm text-blue-600"><Link to="/portfolio">View portfolio ?</Link><Link to="/case-studies/reviews-rewards">Read the case study ?</Link></div></div><div><h2 className="text-2xl font-bold mb-4">Prefer a conversation first?</h2><p className="text-slate-500 mb-4">Discuss your goals and questions before putting together a full brief.</p>{bookingUrl ? <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold inline-flex gap-2 items-center"><CalendarDays size={18} /> Book a discovery call</a> : <Link to="/contact?consultation=1#contact-form" className="text-blue-600 font-semibold inline-flex gap-2 items-center"><CalendarDays size={18} /> Request a discovery call</Link>}</div></section>
    </>;
}
