export const STAGES = ['new', 'qualified', 'discovery', 'proposal', 'won', 'lost', 'spam'] as const;
export type LeadStage = typeof STAGES[number];
export const STAGE_LABELS: Record<LeadStage, string> = {
    new: 'New leads', qualified: 'Qualified', discovery: 'Discovery', proposal: 'Proposal sent',
    won: 'Won', lost: 'Lost', spam: 'Spam'
};
export interface LeadActivity { id: string; text: string; at: string }
export interface CrmLead {
    id: string; name: string; email: string; phone: string; service: string;
    brief: string; source: string; campaign: string; stage: LeadStage;
    value: number; currency: string; followUp: string; nextAction: string;
    proposalUrl: string; createdAt: string; activity: LeadActivity[];
}
export const isOpenLead = (lead: CrmLead) => !['won', 'lost', 'spam'].includes(lead.stage);
export const isFollowUpDue = (lead: CrmLead, today: string) =>
    isOpenLead(lead) && Boolean(lead.followUp) && lead.followUp <= today;
export function summarizeLeads(leads: CrmLead[], currency: string, today: string) {
    const real = leads.filter(lead => lead.stage !== 'spam');
    return {
        open: real.filter(isOpenLead).length,
        due: real.filter(lead => isFollowUpDue(lead, today)).length,
        pipeline: real.filter(lead => isOpenLead(lead) && lead.currency === currency).reduce((sum, lead) => sum + lead.value, 0),
        won: real.filter(lead => lead.stage === 'won' && lead.currency === currency).reduce((sum, lead) => sum + lead.value, 0),
        winRate: real.some(lead => ['won', 'lost'].includes(lead.stage))
            ? Math.round(real.filter(lead => lead.stage === 'won').length / real.filter(lead => ['won', 'lost'].includes(lead.stage)).length * 100) : 0
    };
}
