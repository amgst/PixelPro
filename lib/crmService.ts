import { collection, getDocs, doc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { getInquiries } from './inquiryService';
import { getContactMessages } from './contactService';
import type { CrmLead, LeadActivity } from './crmModel';

const isoDate = (value: any): string => {
    const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toISOString() : '';
};
const defaults = (): Omit<CrmLead, 'id' | 'name' | 'email'> => ({
    phone: '', service: '', brief: '', source: 'Manual', campaign: '', stage: 'new', value: 0,
    currency: 'USD', followUp: '', nextAction: '', proposalUrl: '', createdAt: '', activity: []
});
export const newLead = (): CrmLead => ({ ...defaults(), id: `manual_${crypto.randomUUID()}`, name: '', email: '', createdAt: new Date().toISOString() });

// Source records appear immediately. Stable IDs keep CRM updates attached to one submission.
export async function getCrmLeads(): Promise<CrmLead[]> {
    const [inquiries, contacts, saved] = await Promise.all([
        getInquiries(), getContactMessages(), getDocs(collection(db, 'crm_leads'))
    ]);
    const leads = new Map<string, CrmLead>();
    inquiries.forEach(item => {
        if (!item.id) return;
        const id = `inquiry_${item.id}`;
        leads.set(id, { ...defaults(), id, name: item.name, email: item.email,
            phone: item.phone || '', service: item.serviceType, brief: item.additionalInfo || item.message || '',
            source: item.leadSource || 'Project inquiry', campaign: item.campaign || '',
            stage: item.status === 'closed' ? 'lost' : item.status === 'contacted' ? 'qualified' : 'new',
            createdAt: isoDate(item.createdAt) });
    });
    contacts.forEach(item => {
        if (!item.id) return;
        const id = `contact_${item.id}`;
        leads.set(id, { ...defaults(), id, name: `${item.firstName} ${item.lastName}`.trim(), email: item.email,
            service: item.service, brief: item.message, source: 'Contact form', createdAt: isoDate(item.createdAt) });
    });
    saved.docs.forEach(item => leads.set(item.id, { ...defaults(), ...leads.get(item.id), ...item.data(), id: item.id } as CrmLead));
    return [...leads.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function saveCrmLead(lead: CrmLead, note: string): Promise<void> {
    const { activity: _activity, id, ...fields } = lead;
    const entry: LeadActivity = { id: crypto.randomUUID(), text: note.trim() || 'Lead details updated', at: new Date().toISOString() };
    await setDoc(doc(db, 'crm_leads', id), { ...fields, updatedAt: new Date().toISOString(), activity: arrayUnion(entry) }, { merge: true });
}
