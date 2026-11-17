# Projects CRM and acquisition funnel

- `/admin/crm`: private sales pipeline and acquisition tools. Existing project inquiries and contact messages appear automatically. Add manual opportunities for referrals or outreach.
- `/start-project`: public service selector, portfolio links, discovery CTA, and project-brief handoff. The navbar project CTA opens this page.
- Under Acquisition funnel, generate a campaign link with `utm_source` and `utm_campaign`. Those fields follow the visitor from this page to the submitted inquiry and CRM. Attribution covers this direct funnel path, not cross-session or cross-device journeys.

## Daily workflow

1. Review New leads. Move suspicious submissions to Spam. Spam is excluded from sales metrics; this does not block future bot submissions.
2. Confirm the business goal, client budget, decision maker, and timing. Move good fits to Qualified.
3. Set a discovery date in Follow-up, and record the next action.
4. Record agreed scope in notes, attach an HTTPS proposal URL, and use Proposal sent once it has actually been sent.
5. Follow up on the agreed date. Mark accepted projects Won and record their deal value. Record why declined projects were Lost.

The CRM stages are separate from the older Messages inbox statuses. Existing closed inquiries initially map to Lost because the old status does not prove a sale. No example leads or fabricated revenue are included. Deal values are estimates and are grouped by currency. Win rate is won / (won + lost), excluding spam. Follow-up dates use the admin's local calendar. Campaign reports measure submitted leads and current outcomes, not visitor traffic.

Compose email opens the admin's mail client. The CRM does not automatically send outreach, proposals, or reminders. Notes and changes are appended to each opportunity's activity log. Saved opportunities remain in the CRM if their original inbox submission is later deleted.

## Deployment and validation

Deploy the frontend/API through the existing website host. Deploy `firestore.rules` using `firebase deploy --only firestore:rules` to allow admins with the existing `admin` custom claim to access `crm_leads`. The collection is private; public form users cannot read or write it. `firebase.json` now includes the rules path. Without the deployed rules, CRM loading reports a permissions error rather than showing empty or sample data.

Run `node scripts/test-crm.cjs`, `npm run typecheck`, and `npx vite build`. Live acceptance: submit a project from a generated campaign link; check its source/campaign in CRM; save a stage change, value, note and follow-up; reload; verify persistence and Spam exclusion. An authenticated Firebase session and deployed rules are required for this acceptance check.
