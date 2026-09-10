'use client';

import React from 'react';
import LegalLayout from '@/components/LegalLayout';
import { FileText, CheckCircle2, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'accounts', title: '2. Accounts & Workspace Security' },
  { id: 'ownership', title: '3. Customer Content Ownership' },
  { id: 'billing', title: '4. Subscriptions & Billing' },
  { id: 'acceptable-use', title: '5. Acceptable Use & Anti-Spam' },
  { id: 'ai-terms', title: '6. AI Copilot Guidelines' },
  { id: 'confidentiality', title: '7. Confidentiality' },
  { id: 'disclaimer', title: '8. Disclaimers of Warranty' },
  { id: 'liability', title: '9. Limitation of Liability' },
  { id: 'termination', title: '10. Termination & Data Retrieval' },
  { id: 'governing-law', title: '11. Governing Law & Jurisdiction' },
  { id: 'contact', title: '12. Contact Legal Department' },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      subtitle="Standard commercial terms governing agency workspace accounts, subscription billing, customer content ownership, and platform usage."
      lastUpdated="September 10, 2026"
      badgeText="Legal Agreement"
      icon={<FileText size={14} />}
      sections={sections}
    >
      {/* Section 1 */}
      <section id="acceptance" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          1. Acceptance of Terms
        </h2>
        <p>
          These Terms of Service ("Terms") constitute a legally binding contract between <strong>AgencyFlow Inc.</strong> ("AgencyFlow", "we", "us") and the individual or legal entity accessing or using the AgencyFlow platform ("Customer", "you", or "your").
        </p>
        <p>
          By creating an account, accessing an agency workspace, or clicking "Sign Up Free" or "Start Free", you represent that you have the legal authority to bind yourself or your agency to these Terms. If you do not agree to all terms, you must not use or access the Platform.
        </p>
      </section>

      {/* Section 2 */}
      <section id="accounts" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          2. Workspace Accounts & Security Responsibilities
        </h2>
        <p>
          To access the platform, you must create a dedicated agency workspace. You agree to:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>Provide accurate, current, and complete organization and contact details during registration.</li>
          <li>Maintain the confidentiality of your credentials and restrict unauthorized access to your account.</li>
          <li>Promptly notify AgencyFlow at <a href="mailto:security@agencyflow.com" style={{ color: '#d0bcff' }}>security@agencyflow.com</a> of any discovered breach of security or unauthorized account access.</li>
          <li>Assume full legal responsibility for all actions and transactions executed under your agency workspace by your designated team members.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="ownership" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          3. Customer Content & Complete Data Ownership
        </h2>
        <div style={{ background: 'rgba(94, 234, 212, 0.08)', border: '1px solid rgba(94, 234, 212, 0.25)', borderRadius: '10px', padding: '20px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5eead4', fontWeight: 700, marginBottom: '6px' }}>
            <ShieldCheck size={18} /> 100% Customer Intellectual Property Guarantee
          </div>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#e2e2e8' }}>
            You retain sole and exclusive ownership of all right, title, and interest in and to all data, client contacts, leads, deal scopes, contracts, proposals, invoices, and brand assets uploaded to or generated within your workspace ("Customer Content").
          </p>
        </div>
        <p>
          AgencyFlow claims zero ownership over your CRM records. You grant AgencyFlow strictly a limited, non-exclusive, worldwide license to host, copy, process, and transmit Customer Content solely to the extent necessary to provide and operate the Platform on your behalf.
        </p>
      </section>

      {/* Section 4 */}
      <section id="billing" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          4. Subscriptions, Fees & Billing Terms
        </h2>
        <p>
          AgencyFlow offers subscription tiers with monthly or annual billing cycles:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Billing Authorizations:</strong> By subscribing, you authorize our PCI-compliant payment processor (Stripe) to charge your designated payment method on a recurring basis.</li>
          <li><strong>Automatic Renewals:</strong> Subscriptions renew automatically at the conclusion of each billing period unless cancelled through your Account Settings prior to the renewal date.</li>
          <li><strong>Taxes:</strong> All subscription fees are exclusive of applicable national, state, or municipal value-added taxes (VAT/GST/Sales Tax), which are added as mandated by law.</li>
          <li><strong>Refund Policy:</strong> Except as required by consumer protection law, subscription fees are non-refundable once billed. Account cancellations take effect at the conclusion of the current prepaid billing period.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="acceptable-use" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          5. Acceptable Use & Anti-Spam Policy
        </h2>
        <p>
          To protect platform reputation and email deliverability across all agency workspaces, you agree not to use the Platform to:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>Send unsolicited bulk commercial email (spam) in violation of CAN-SPAM, CASL, GDPR, or applicable electronic privacy statutes.</li>
          <li>Engage in deceptive lead scraping, identity impersonation, or credit card fraud.</li>
          <li>Transmit malicious payloads, ransomware, or attempt unauthorized penetration testing against AgencyFlow cloud infrastructure.</li>
          <li>Reverse-engineer, decompile, or copy the proprietary source code, algorithms, or visual interfaces of the Platform.</li>
        </ul>
        <p>
          Violation of this Acceptable Use Policy constitutes cause for immediate workspace suspension or termination without notice or refund.
        </p>
      </section>

      {/* Section 6 */}
      <section id="ai-terms" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          6. AI Features & Usage Guidelines
        </h2>
        <p>
          AgencyFlow incorporates generative AI modules to assist with proposal drafting, email templates, and deal analysis. You acknowledge and agree that:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>AI-generated text is provided for drafting assistance and human review; you are solely responsible for verifying the accuracy of all proposals, legal scopes, and invoices dispatched to clients.</li>
          <li>Your inputs and outputs are processed under enterprise zero-data-retention APIs and are never used to train public machine learning algorithms.</li>
          <li>You will not submit sensitive health records, government identifiers (e.g. SSNs), or classified materials into general AI prompt fields.</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="confidentiality" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          7. Confidentiality
        </h2>
        <p>
          Each party ("Receiving Party") agrees that all commercial, technical, and non-public information disclosed by the other party ("Disclosing Party") will be treated as strictly confidential. The Receiving Party will protect such confidential information with the same standard of care used to protect its own confidential assets (and in no event less than reasonable care).
        </p>
      </section>

      {/* Section 8 */}
      <section id="disclaimer" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          8. Disclaimer of Warranties
        </h2>
        <p style={{ textTransform: 'uppercase', fontSize: '13.5px', color: '#9da0b5' }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM AND ALL ASSOCIATED SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. AGENCYFLOW DOES NOT WARRANT THAT SERVICE OPERATION WILL BE UNINTERRUPTED OR ERROR-FREE.
        </p>
      </section>

      {/* Section 9 */}
      <section id="liability" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          9. Limitation of Liability
        </h2>
        <p style={{ textTransform: 'uppercase', fontSize: '13.5px', color: '#9da0b5' }}>
          IN NO EVENT SHALL AGENCYFLOW INC., ITS DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE PLATFORM.
        </p>
        <p>
          AgencyFlow's total aggregate liability arising out of or related to these Terms shall not exceed the total fees paid by Customer to AgencyFlow under the specific workspace account in the twelve (12) months preceding the incident giving rise to liability.
        </p>
      </section>

      {/* Section 10 */}
      <section id="termination" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          10. Termination & Data Retrieval
        </h2>
        <p>
          You may terminate your account at any time through the workspace settings. Upon termination:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>You will have a <strong>30-day grace period</strong> to export your full CRM database (leads, client profiles, proposals, and invoices in standard JSON/CSV formats).</li>
          <li>After 30 days, AgencyFlow will permanently delete your workspace database and associated encryption keys, making historical records unrecoverable.</li>
        </ul>
      </section>

      {/* Section 11 */}
      <section id="governing-law" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          11. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms and any dispute arising from your use of the Platform shall be governed by and construed in accordance with the laws of the State of California, United States, without giving effect to any principles of conflict of laws. Any legal suit, action, or proceeding shall be instituted exclusively in the federal or state courts located in San Francisco, California.
        </p>
      </section>

      {/* Section 12 */}
      <section id="contact">
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          12. Contact Legal Department
        </h2>
        <p>
          For legal notices, contract inquiries, or enterprise terms negotiation, please contact:
        </p>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginTop: '16px' }}>
          <div style={{ fontWeight: 700, color: '#f1f1f6', marginBottom: '6px' }}>AgencyFlow Inc. — Legal & Corporate Affairs</div>
          <div style={{ fontSize: '14.5px', color: '#9da0b5', lineHeight: 1.6 }}>
            Email: <a href="mailto:legal@agencyflow.com" style={{ color: '#d0bcff', textDecoration: 'none', fontWeight: 600 }}>legal@agencyflow.com</a><br />
            Enterprise Agreements: <a href="mailto:enterprise@agencyflow.com" style={{ color: '#d0bcff', textDecoration: 'none' }}>enterprise@agencyflow.com</a><br />
            Physical Address: AgencyFlow Inc., 100 Innovation Way, Suite 400, San Francisco, CA 94105, USA
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
