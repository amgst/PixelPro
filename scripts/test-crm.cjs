const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(path, dependencies = {}) {
    const exports = {};
    const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    new Function('require', 'exports', code)(name => {
        if (!(name in dependencies)) throw new Error(`Unexpected dependency ${name}`);
        return dependencies[name];
    }, exports);
    return exports;
}
const { summarizeLeads, isFollowUpDue } = load('lib/crmModel.ts');
const base = { id: 'lead', name: 'Business owner', email: 'client@example.com', stage: 'new', value: 100, currency: 'USD', followUp: '2026-11-17' };
const leads = [
    base, { ...base, stage: 'proposal', value: 300 }, { ...base, stage: 'won', value: 500 },
    { ...base, stage: 'lost' }, { ...base, stage: 'spam', value: 90000 },
    { ...base, currency: 'AUD', value: 800 }, { ...base, followUp: '2026-11-18', value: 0 }
];
assert.deepEqual(summarizeLeads(leads, 'USD', '2026-11-17'), { open: 4, due: 3, pipeline: 400, won: 500, winRate: 50 });
assert.equal(isFollowUpDue({ ...base, stage: 'won' }, '2026-11-17'), false);
assert.equal(isFollowUpDue({ ...base, followUp: '' }, '2026-11-17'), false);
assert.equal(summarizeLeads([], 'USD', '2026-11-17').winRate, 0);
let write;
let fail = false;
const service = load('lib/crmService.ts', {
    'firebase/firestore': {
        collection: (_, name) => name,
        getDocs: async () => { if (fail) throw new Error('permission-denied'); return { docs: [
            { id: 'inquiry_a', data: () => ({ name: 'Updated client', stage: 'proposal', value: 1200, activity: [{ id: 'note1' }] }) },
            { id: 'manual_one', data: () => ({ name: 'Referral', email: 'referral@example.com', createdAt: '2026-11-17', stage: 'qualified' }) }
        ] }; },
        doc: (_, collection, id) => `${collection}/${id}`,
        arrayUnion: entry => ({ append: entry }),
        setDoc: async (...args) => { write = args; }
    },
    './firebase': { db: {} },
    './inquiryService': { getInquiries: async () => [
        { id: 'a', name: 'Original client', email: 'client@example.com', serviceType: 'shopify', timeline: 'flexible', shopifyBudget: '2000', status: 'new', createdAt: { toDate: () => new Date('2026-11-16') }, leadSource: 'linkedin', campaign: 'launch' },
        { id: 'b', name: 'Closed client', email: 'client@example.com', status: 'closed' }
    ] },
    './contactService': { getContactMessages: async () => [{ id: 'c', firstName: 'Contact', lastName: 'Person', email: 'contact@example.com', message: 'A real project brief', service: 'Graphics' }] }
});
(async () => {
    const records = await service.getCrmLeads();
    assert.equal(records.length, 4, 'Repeated loads must merge CRM state without duplicating source records');
    const inquiry = records.find(item => item.id === 'inquiry_a');
    assert.equal(inquiry.stage, 'proposal', 'Saved sales state overrides legacy submission status');
    assert.equal(inquiry.email, 'client@example.com', 'Unmodified source fields survive the CRM overlay');
    assert.equal(inquiry.name, 'Updated client');
    assert.equal(inquiry.campaign, 'launch');
    assert.equal(inquiry.budget, '2000');
    assert.equal(records.find(item => item.id === 'inquiry_b').stage, 'lost', 'Legacy closed inquiries must never count as won');
    assert.equal(records.find(item => item.id === 'contact_c').brief, 'A real project brief');
    await service.saveCrmLead(inquiry, 'Follow up after discovery');
    assert.equal(write[0], 'crm_leads/inquiry_a');
    assert.equal(write[1].activity.append.text, 'Follow up after discovery');
    assert.equal(write[1].activity.append.id.length > 0, true);
    assert.deepEqual(write[2], { merge: true });
    assert.equal('id' in write[1], false);
    fail = true;
    await assert.rejects(service.getCrmLeads, /permission-denied/, 'Permission failures must not masquerade as an empty CRM');
    console.log('CRM checks passed: currency isolation, spam exclusion, follow-ups, legacy status mapping, source merging, campaign attribution, activity writes, and read failures.');
})().catch(error => { console.error(error); process.exitCode = 1; });
