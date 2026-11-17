import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw, X, ArrowUpRight, Copy, Check, Loader2, Mail } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCrmLeads, newLead, saveCrmLead } from '../../lib/crmService';
import { STAGES, STAGE_LABELS, isFollowUpDue, summarizeLeads, type CrmLead, type LeadStage } from '../../lib/crmModel';

const inputClass = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none';
const colors: Record<LeadStage, string> = { new: 'bg-blue-100 text-blue-700', qualified: 'bg-violet-100 text-violet-700', discovery: 'bg-cyan-100 text-cyan-700', proposal: 'bg-amber-100 text-amber-800', won: 'bg-emerald-100 text-emerald-700', lost: 'bg-slate-200 text-slate-600', spam: 'bg-rose-100 text-rose-700' };
const money = (value: number, currency: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
const localToday = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; };
const stageAdvice: Record<LeadStage, string> = {
    new: 'Review the brief and confirm this is a genuine project before qualifying it.',
    qualified: 'Confirm the decision maker, business goal, budget, and timing. Arrange discovery.',
    discovery: 'Agree on scope, deliverables, and success criteria before preparing a proposal.',
    proposal: 'Share the proposal and agree on a date to discuss questions and the next decision.',
    won: 'Confirm the agreement and payment arrangements, then schedule project kickoff.',
    lost: 'Record why the opportunity was lost so future conversations can improve.',
    spam: 'Kept for review and excluded from pipeline values and conversion figures.'
};
export default function Crm() {
    const [leads, setLeads] = useState<CrmLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [stage, setStage] = useState('active');
    const [dueOnly, setDueOnly] = useState(false);
    const [currency, setCurrency] = useState('USD');
    const [editing, setEditing] = useState<CrmLead | null>(null);
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [campaign, setCampaign] = useState('project-outreach');
    const [source, setSource] = useState('linkedin');
    const [copied, setCopied] = useState(false);
    const [tab, setTab] = useState<'pipeline' | 'funnel'>('pipeline');
    const today = localToday();
    const load = async () => {
        setLoading(true); setError('');
        try { setLeads(await getCrmLeads()); }
        catch { setError('Could not load the CRM. Check your connection and deploy the CRM Firestore rules if this is a new installation.'); }
        finally { setLoading(false); }
    };
    useEffect(() => { void load(); }, []);
    const stats = summarizeLeads(leads, currency, today);
    const visible = leads.filter(lead => {
        const matchesStage = stage === 'all' || (stage === 'active' ? !['lost', 'spam', 'won'].includes(lead.stage) : lead.stage === stage);
        return matchesStage && (!dueOnly || isFollowUpDue(lead, today)) &&
            `${lead.name} ${lead.email} ${lead.service} ${lead.source} ${lead.campaign}`.toLowerCase().includes(query.toLowerCase());
    });
    const open = (lead: CrmLead) => { setEditing({ ...lead }); setNote(''); setError(''); };
    const change = (key: keyof CrmLead, value: string | number) => setEditing(current => current ? { ...current, [key]: value } : current);
    const save = async (event: React.FormEvent) => {
        event.preventDefault(); if (!editing) return;
        if (editing.proposalUrl && !/^https:\/\//i.test(editing.proposalUrl)) { setError('Proposal links must start with https://'); return; }
        setSaving(true); setError('');
        const previous = leads.find(lead => lead.id === editing.id);
        const eventText = [previous && previous.stage !== editing.stage ? `Stage: ${STAGE_LABELS[previous.stage]} ? ${STAGE_LABELS[editing.stage]}` : '', note.trim()].filter(Boolean).join(' ? ');
        try {
            await saveCrmLead({ ...editing, name: editing.name.trim(), email: editing.email.trim() }, eventText || (previous ? 'Lead details updated' : 'Lead added to CRM'));
            setEditing(null); await load();
        } catch { setError('Could not save this lead. Your changes are still open; try again.'); }
        finally { setSaving(false); }
    };
    const funnelUrl = `${window.location.origin}/start-project?${new URLSearchParams({ utm_source: source.trim() || 'direct', utm_medium: 'outreach', utm_campaign: campaign.trim() || 'project-outreach' })}`;
    const copy = async () => { try { await navigator.clipboard.writeText(funnelUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setError('Clipboard access is unavailable. Select and copy the funnel link below.'); } };
    const campaigns = [...new Set(leads.filter(lead => lead.campaign && lead.stage !== 'spam').map(lead => lead.campaign))];
    return <AdminLayout>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
            <div><p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">Business development</p><h1 className="text-3xl font-bold text-slate-900">Projects CRM</h1><p className="text-slate-500 mt-2">Turn conversations into your next project.</p></div>
            <div className="flex gap-2"><button aria-label="Refresh leads" disabled={loading || saving} onClick={load} className="p-3 rounded-lg bg-white border"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button><button onClick={() => open(newLead())} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"><Plus size={18} /> Add lead</button></div>
        </div>
        {error && <div role="alert" className="bg-red-50 text-red-700 rounded-xl p-4 mb-5">{error}</div>}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-5"><div className="flex bg-slate-200/60 rounded-lg p-1">{(['pipeline', 'funnel'] as const).map(item => <button key={item} onClick={() => setTab(item)} className={`rounded-md px-5 py-2 text-sm font-semibold ${tab === item ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500'}`}>{item === 'pipeline' ? 'Sales pipeline' : 'Acquisition funnel'}</button>)}</div><label className="text-xs text-slate-500">Value display <select aria-label="Summary currency" value={currency} onChange={e => setCurrency(e.target.value)} className="ml-2 border rounded px-2 py-1">{['USD', 'AUD', 'GBP', 'EUR', 'PKR'].map(code => <option key={code}>{code}</option>)}</select></label></div>
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 mb-7">{[
            ['Open opportunities', stats.open], ['Pipeline value', money(stats.pipeline, currency)], ['Won value', money(stats.won, currency)], ['Follow-ups due', stats.due], ['Closed deal win rate', `${stats.winRate}%`]
        ].map(([label, value]) => <div key={label} className="bg-white border border-slate-200 rounded-xl p-5"><p className="text-xs text-slate-500 mb-2">{label}</p><p className="text-2xl font-bold text-slate-900">{loading ? '?' : value}</p></div>)}</div>
        <p className="text-xs text-slate-400 -mt-4 mb-6">Values include only {currency} deals. Win rate is won ? (won + lost); spam is excluded. Values are estimates, not payments received.</p>
        {tab === 'pipeline' ? <>
            <div className="flex flex-wrap gap-3 mb-5"><div className="relative flex-1 min-w-48"><Search size={17} className="absolute left-3 top-3 text-slate-400" /><input aria-label="Search leads" className={`${inputClass} pl-10`} placeholder="Search name, email, service, campaign?" value={query} onChange={e => setQuery(e.target.value)} /></div><select aria-label="Filter by stage" className="border rounded-lg px-3 py-2 text-sm" value={stage} onChange={e => setStage(e.target.value)}><option value="active">Active pipeline</option><option value="all">All leads</option>{STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}</select><label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={dueOnly} onChange={e => setDueOnly(e.target.checked)} /> Follow-ups due</label></div>
            {loading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div> : <>
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{visible.map(lead => <button key={lead.id} onClick={() => open(lead)} className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-center gap-2 mb-4"><span className={`text-xs font-semibold px-2 py-1 rounded ${colors[lead.stage]}`}>{STAGE_LABELS[lead.stage]}</span><span className="text-xs text-slate-400">{lead.service || 'General'}</span></div>
                    <h2 className="font-bold text-slate-900 truncate">{lead.name || 'Unnamed lead'}</h2><p className="text-sm text-slate-500 truncate mt-1">{lead.email}</p><p className="text-sm text-slate-600 line-clamp-2 mt-3 min-h-10">{lead.nextAction || lead.brief || 'Review this lead and set the next action.'}</p>
                    <div className="border-t mt-4 pt-3 flex flex-wrap justify-between gap-2 text-xs"><span className="font-semibold text-slate-800">{money(lead.value, lead.currency)}</span><span className={isFollowUpDue(lead, today) ? 'text-rose-600 font-semibold' : 'text-slate-400'}>{lead.followUp ? `Follow up ${lead.followUp}` : 'No follow-up set'}</span></div><p className="text-xs text-slate-400 mt-3 truncate">{lead.source}{lead.campaign ? ` / ${lead.campaign}` : ''}</p>
                </button>)}</div>
                {!visible.length && <div className="border border-dashed rounded-xl bg-white p-12 text-center"><h2 className="font-semibold text-slate-800">{leads.length ? 'No leads match these filters' : 'Your next project starts here'}</h2><p className="text-slate-500 mt-2 text-sm">{leads.length ? 'Change your filters or add a new opportunity.' : 'Inquiries and contact messages appear automatically. You can also add leads from referrals and outreach.'}</p></div>}
                <p className="text-xs text-slate-400 mt-4">{visible.length} of {leads.length} leads shown. Review suspicious submissions and move them to Spam; no leads are automatically discarded.</p>
            </>}
        </> : <div className="grid lg:grid-cols-2 gap-5">
            <section className="bg-slate-900 text-white rounded-2xl p-7"><p className="text-blue-300 text-xs uppercase tracking-widest font-bold">Your acquisition path</p><h2 className="text-2xl font-bold mt-3 mb-6">From first click to project kickoff.</h2>{[
                ['01', 'Attract the right business', 'Share a campaign link in your portfolio, referral conversations, or relevant outreach.'],
                ['02', 'Capture a project brief', 'Prospects choose a service, review your work, and submit their requirements.'],
                ['03', 'Qualify and discover', 'Review fit, confirm budget and timing, then agree on scope in a discovery call.'],
                ['04', 'Propose and follow up', 'Attach the proposal URL, set the next action, and track the decision date.'],
                ['05', 'Win and onboard', 'Mark agreed projects Won and arrange the kickoff.']
            ].map(([number, title, body]) => <div key={number} className="flex gap-4 mb-5"><span className="text-blue-300 text-sm font-bold pt-1">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="text-sm text-slate-400 mt-1">{body}</p></div></div>)}<Link className="inline-flex gap-2 items-center text-blue-200 text-sm font-semibold" to="/start-project" target="_blank">Open project funnel <ArrowUpRight size={16} /></Link></section>
            <div className="space-y-5"><section className="bg-white rounded-xl border p-6"><h2 className="font-bold text-lg text-slate-900">Create a campaign link</h2><p className="text-sm text-slate-500 mt-1 mb-5">Campaign and source travel with the inquiry into your CRM.</p><div className="grid grid-cols-2 gap-3"><label className="text-sm">Source<input maxLength={100} className={`${inputClass} mt-1`} value={source} onChange={e => setSource(e.target.value)} placeholder="linkedin" /></label><label className="text-sm">Campaign<input maxLength={100} className={`${inputClass} mt-1`} value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="shopify-audits" /></label></div><input aria-label="Shareable funnel link" readOnly value={funnelUrl} onFocus={e => e.target.select()} className={`${inputClass} mt-4 text-slate-500`} /><button onClick={copy} className="inline-flex gap-2 items-center mt-3 text-sm font-semibold text-blue-600">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy campaign link'}</button></section>
            <section className="bg-white rounded-xl border p-6"><h2 className="font-bold text-lg text-slate-900 mb-4">Pipeline by stage</h2>{STAGES.filter(s => s !== 'spam').map(s => { const count = leads.filter(lead => lead.stage === s).length; return <div key={s} className="mb-3"><div className="flex justify-between text-sm mb-1"><span>{STAGE_LABELS[s]}</span><span>{count}</span></div><div className="h-2 bg-slate-100 rounded"><div className="h-2 bg-blue-500 rounded" style={{ width: `${leads.filter(lead => lead.stage !== 'spam').length ? count / leads.filter(lead => lead.stage !== 'spam').length * 100 : 0}%` }} /></div></div>; })}<p className="text-xs text-slate-400">Current stage counts, not historical visitor conversion. Website visits and abandoned forms are not measured.</p></section></div>
            <section className="lg:col-span-2 bg-white rounded-xl border p-6 overflow-auto"><h2 className="font-bold text-lg mb-4">Campaign results</h2>{campaigns.length ? <table className="w-full text-sm text-left"><thead><tr className="text-slate-400 border-b"><th className="py-3">Campaign</th><th>Leads</th><th>Won</th><th>Won value ({currency})</th></tr></thead><tbody>{campaigns.map(c => { const group = leads.filter(lead => lead.campaign === c && lead.stage !== 'spam'); return <tr key={c} className="border-b last:border-0"><td className="py-3">{c}</td><td>{group.length}</td><td>{group.filter(lead => lead.stage === 'won').length}</td><td>{money(group.filter(lead => lead.stage === 'won' && lead.currency === currency).reduce((sum, lead) => sum + lead.value, 0), currency)}</td></tr>; })}</tbody></table> : <p className="text-sm text-slate-500">Share a campaign link. Submitted inquiries will appear here with their source and campaign.</p>}</section>
        </div>}
        {editing && <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end" onClick={() => !saving && setEditing(null)}><section role="dialog" aria-modal="true" aria-labelledby="lead-title" onKeyDown={event => {
                if (event.key === 'Escape' && !saving) { setEditing(null); return; }
                if (event.key !== 'Tab') return;
                const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')];
                const first = controls[0], last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }} className="w-full max-w-2xl h-full overflow-y-auto bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10"><div><p className="text-xs text-blue-600 font-semibold">PROJECT OPPORTUNITY</p><h2 id="lead-title" className="text-xl font-bold mt-1">{editing.name || 'New lead'}</h2></div><button type="button" disabled={saving} onClick={() => setEditing(null)} aria-label="Close lead"><X size={22} /></button></div>
            <form onSubmit={save} className="p-6 space-y-5">
                {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
                <div className="grid grid-cols-2 gap-4"><label className="text-sm font-medium">Name<input autoFocus required maxLength={150} className={`${inputClass} mt-1`} value={editing.name} onChange={e => change('name', e.target.value)} /></label><label className="text-sm font-medium">Stage<select className={`${inputClass} mt-1`} value={editing.stage} onChange={e => change('stage', e.target.value)}>{STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}</select></label><label className="text-sm font-medium">Email<input required type="email" className={`${inputClass} mt-1`} value={editing.email} onChange={e => change('email', e.target.value)} /></label><label className="text-sm font-medium">Phone<input type="tel" className={`${inputClass} mt-1`} value={editing.phone} onChange={e => change('phone', e.target.value)} /></label><label className="text-sm font-medium">Service<input className={`${inputClass} mt-1`} value={editing.service} onChange={e => change('service', e.target.value)} /></label><label className="text-sm font-medium">Source<input className={`${inputClass} mt-1`} value={editing.source} onChange={e => change('source', e.target.value)} /></label></div>
                <div className="grid grid-cols-2 gap-4"><label className="text-sm font-medium">Client budget<input className={`${inputClass} mt-1`} value={editing.budget} onChange={e => change('budget', e.target.value)} placeholder="Not discussed yet" /></label><label className="text-sm font-medium">Client timeline<input className={`${inputClass} mt-1`} value={editing.timeline} onChange={e => change('timeline', e.target.value)} placeholder="Not discussed yet" /></label></div>
                <p className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{stageAdvice[editing.stage]}</p>
                <label className="block text-sm font-medium">Project brief<textarea rows={3} className={`${inputClass} mt-1`} value={editing.brief} onChange={e => change('brief', e.target.value)} /></label>
                <div className="grid grid-cols-2 gap-4"><label className="text-sm font-medium">Deal value<input type="number" min="0" max="999999999" step="0.01" required className={`${inputClass} mt-1`} value={editing.value} onChange={e => change('value', Number(e.target.value))} /></label><label className="text-sm font-medium">Currency<select className={`${inputClass} mt-1`} value={editing.currency} onChange={e => change('currency', e.target.value)}>{['USD', 'AUD', 'GBP', 'EUR', 'PKR'].map(c => <option key={c}>{c}</option>)}</select></label><label className="text-sm font-medium">Follow-up date<input type="date" className={`${inputClass} mt-1`} value={editing.followUp} onChange={e => change('followUp', e.target.value)} /></label><label className="text-sm font-medium">Campaign<input className={`${inputClass} mt-1`} value={editing.campaign} onChange={e => change('campaign', e.target.value)} /></label></div>
                <label className="block text-sm font-medium">Next action<input placeholder="Send a scope outline, then arrange discovery" className={`${inputClass} mt-1`} value={editing.nextAction} onChange={e => change('nextAction', e.target.value)} /></label>
                <label className="block text-sm font-medium">Proposal URL<input type="url" placeholder="https://?" className={`${inputClass} mt-1`} value={editing.proposalUrl} onChange={e => change('proposalUrl', e.target.value)} /></label>
                <div className="flex gap-4 text-sm font-semibold text-blue-600"><a className="flex gap-1 items-center" href={`mailto:${encodeURIComponent(editing.email)}?subject=${encodeURIComponent(`Your ${editing.service || 'project'} inquiry`)}`}><Mail size={16} /> Compose email</a>{/^https:\/\//i.test(editing.proposalUrl) && <a target="_blank" rel="noopener noreferrer" href={editing.proposalUrl}>Open proposal ?</a>}</div>
                <label className="block text-sm font-medium">Add a note<textarea maxLength={4000} rows={3} className={`${inputClass} mt-1`} value={note} onChange={e => setNote(e.target.value)} placeholder="Discovery notes, proposal feedback, or reason lost?" /></label>
                <button disabled={saving} type="submit" className="w-full bg-blue-600 text-white font-semibold rounded-lg py-3 disabled:opacity-50">{saving ? 'Saving?' : 'Save opportunity'}</button>
                <div><h3 className="text-sm font-bold mb-3">Activity</h3>{editing.activity.length ? [...editing.activity].reverse().map(item => <div key={item.id} className="border-l-2 border-blue-100 pl-3 mb-4"><p className="text-sm text-slate-600 whitespace-pre-wrap">{item.text}</p><time className="text-xs text-slate-400">{new Date(item.at).toLocaleString()}</time></div>) : <p className="text-sm text-slate-400">Save a note or stage change to start the activity log.</p>}</div>
            </form>
        </section></div>}
    </AdminLayout>;
}
