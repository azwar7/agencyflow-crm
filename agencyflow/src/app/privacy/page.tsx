'use client';

import React from 'react';
import LegalLayout from '@/components/LegalLayout';
import { Shield, Lock, Eye, Database, Cpu, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';

const sections = [
  { id: 'introduction', title: 'Introduction & Scope' },
  { id: 'data-collection-audit', title: 'Complete Audit of Data Collected' },
  { id: 'controller-vs-processor', title: 'Data Controller vs. Processor' },
  { id: 'ai-privacy', title: 'AI Copilot & Zero-Training Guarantee' },
  { id: 'legal-bases', title: 'Legal Bases for Processing' },
  { id: 'data-retention', title: 'Data Retention & Deletion' },
  { id: 'subprocessors', title: 'Third-Party Sub-Processors' },
  { id: 'user-rights', title: 'Your Rights (GDPR & CCPA)' },
  { id: 'security-measures', title: 'Security & Encryption Standards' },
  { id: 'contact-dpo', title: 'Contact & Data Protection Officer' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy & Data Disclosure"
      subtitle="Complete transparency on how AgencyFlow collects, processes, encrypts, and protects workspace data, client CRM records, and deal flows."
      lastUpdated="September 10, 2026"
      badgeText="Privacy & Compliance"
      icon={<Shield size={14} />}
      sections={sections}
    >
      {/* Section 1 */}
      <section id="introduction" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          1. Introduction & Scope
        </h2>
        <p>
          At <strong>AgencyFlow Inc.</strong> ("AgencyFlow", "we", "us", or "our"), privacy, data sovereignty, and security are fundamental to our architecture. This Privacy Policy governs your use of the AgencyFlow SaaS CRM platform, APIs, dashboard, and related services (collectively, the "Platform").
        </p>
        <p>
          This document explains in exact detail what data we collect from you (the agency or freelancer workspace owner), how your agency's clients' and leads' data is processed, the technical protections implemented to safeguard that data, and how you retain complete control over your commercial information in full compliance with the <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA/CPRA)</strong>, and international data protection standards.
        </p>
      </section>

      {/* Section 2 */}
      <section id="data-collection-audit" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          2. Complete Audit of Data We Take From Users
        </h2>
        <p>
          To eliminate all legal ambiguity, AgencyFlow provides an exhaustive breakdown of the five distinct categories of data collected and processed through our service:
        </p>

        {/* Tier 1 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d0bcff', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            <UserCheck size={18} /> Tier 1: User Account & Workspace Identity Data
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14.5px' }}>
            <strong>What We Collect:</strong> Full legal name, business email address, salted and cryptographically hashed passwords (via bcrypt with work factor 10), agency name, workspace slug, profile avatar or logo URL, company size tier (e.g. 1-5, 6-20), industry niche, business address, and telephone number.
          </p>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#9da0b5' }}>
            <strong>Purpose & Use:</strong> Authenticating user accounts, enforcing multi-tenant workspace isolation, personalizing invoice headers, and dispatching transactional system alerts.
          </p>
        </div>

        {/* Tier 2 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2dd4bf', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            <Database size={18} /> Tier 2: CRM, Client & Commercial Operations Data
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14.5px' }}>
            <strong>What We Collect:</strong> 
            Lead contact records (names, email addresses, phone numbers, lead source tags, pipeline stage, deal valuation, meeting notes, custom status tags), client profiles, deliverable milestones, project timelines, and task logs.
          </p>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#9da0b5' }}>
            <strong>Purpose & Use:</strong> Powering your internal agency sales pipeline, tracking deal progression from lead to signed contract, and coordinating deliverables across team members.
          </p>
        </div>

        {/* Tier 3 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            <Lock size={18} /> Tier 3: Financial, Invoicing & Billing Data
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14.5px' }}>
            <strong>What We Collect:</strong> Invoice numbers, itemized billable line items, currency codes, tax rates, billing recipient names/addresses, payment issue and due dates, and paid/unpaid status records.
          </p>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#9da0b5' }}>
            <strong>Payment Processing Safeguard:</strong> AgencyFlow <strong>never</strong> collects, stores, or processes raw credit card numbers or security CVVs on our servers. All credit card transactions and subscription billing are processed directly through PCI-DSS Level 1 certified processors (Stripe).
          </p>
        </div>

        {/* Tier 4 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            <Cpu size={18} /> Tier 4: AI Copilot & Automated Deal Analysis Data
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14.5px' }}>
            <strong>What We Collect:</strong> Lead qualification fields, proposal scope outlines, and user prompt inputs passed into automated AI assistance tools (such as proposal drafting and email generation).
          </p>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#9da0b5' }}>
            <strong>Zero-Training Guarantee:</strong> Detailed in Section 4 below, customer prompts and deal data are <strong>strictly never used to train public machine learning models</strong>.
          </p>
        </div>

        {/* Tier 5 */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>
            <Eye size={18} /> Tier 5: Technical Telemetry, Device & Essential Cookies
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14.5px' }}>
            <strong>What We Collect:</strong> Internet Protocol (IP) addresses, browser user agent string, operating system, session timestamps, and encrypted JWT authentication tokens stored in browser local storage or secure HTTP-only cookies.
          </p>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#9da0b5' }}>
            <strong>No Third-Party Ad Trackers:</strong> AgencyFlow does not deploy third-party advertising pixels, behavioral tracking networks, or data broker beacons. Cookies are strictly utilized for session authentication, CSRF mitigation, and user interface preferences.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section id="controller-vs-processor" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          3. Data Controller vs. Data Processor Designation (GDPR Art. 28)
        </h2>
        <p>
          Under European data protection law (GDPR) and similar global privacy frameworks, the legal relationship between you and AgencyFlow is defined as follows:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>
            <strong>AgencyFlow as Data Controller:</strong> With respect to your agency's account owner credentials, subscription billing records, and direct communications with us, AgencyFlow acts as a Data Controller.
          </li>
          <li>
            <strong>Your Agency as Data Controller:</strong> With respect to your clients' and leads' personal information stored within your CRM workspace (e.g. your client emails, contact phone numbers, proposal scopes), <strong>your agency is the Data Controller</strong>.
          </li>
          <li>
            <strong>AgencyFlow as Data Processor:</strong> AgencyFlow acts solely as a Data Processor on behalf of your agency, processing client data strictly in accordance with your instructions and our Data Processing Agreement (DPA).
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="ai-privacy" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          4. AI Copilot & Zero-Training Privacy Guarantee
        </h2>
        <div style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.25)', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d0bcff', fontWeight: 700, marginBottom: '6px' }}>
            <CheckCircle size={18} color="#2dd4bf" /> Strict Zero-Training Enterprise Commitment
          </div>
          <p style={{ margin: 0, fontSize: '14.5px', color: '#e2e2e8' }}>
            AgencyFlow guarantees that neither your proprietary business data, lead contact details, contract valuations, nor prompt inputs are ever shared, sold, or used to train, retrain, or improve foundational machine learning models (including OpenAI, Google Gemini, Anthropic, or open-weight models).
          </p>
        </div>
        <p>
          When you use AI-assisted proposal generation or lead scoring, data is transmitted over TLS 1.3 encrypted connections directly to enterprise API endpoints covered by strict Zero Data Retention (ZDR) and business privacy terms. Prompts and outputs are discarded immediately following completion of the inference request.
        </p>
      </section>

      {/* Section 5 */}
      <section id="legal-bases" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          5. Legal Bases for Processing (GDPR Art. 6)
        </h2>
        <p>We process personal data only when an established legal basis under applicable law applies:</p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Performance of Contract:</strong> Providing CRM functionality, authentication, workspace provisioning, and invoice delivery according to our Terms of Service.</li>
          <li><strong>Legitimate Interests:</strong> Securing our systems against cyber attacks, preventing fraud or unauthorized account access, and optimizing platform performance.</li>
          <li><strong>Compliance with Legal Obligations:</strong> Retaining financial transaction and billing tax records as mandated by applicable accounting and fiscal laws.</li>
          <li><strong>Consent:</strong> Where you explicitly opt-in to optional beta features or marketing communications (which can be revoked at any time).</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="data-retention" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          6. Data Retention & Deletion Protocol
        </h2>
        <p>
          We retain your workspace data for as long as your account remains active and in good standing. If an agency owner initiates a workspace deletion request:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li>All active leads, client profiles, proposals, tasks, and team member permissions are permanently purged from live production databases within <strong>30 days</strong>.</li>
          <li>Encrypted database backup snapshots are rotated and permanently overwritten within <strong>60 days</strong>.</li>
          <li>Invoiced transaction receipts are retained solely for the statutory period required by tax authorities (typically 7 years).</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="subprocessors" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          7. Third-Party Sub-Processors
        </h2>
        <p>
          To deliver our cloud infrastructure, AgencyFlow engages carefully vetted third-party sub-processors bound by strict Data Processing Agreements (DPAs) and Standard Contractual Clauses (SCCs):
        </p>
        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', color: '#d0bcff' }}>
                <th style={{ padding: '10px 14px' }}>Sub-Processor</th>
                <th style={{ padding: '10px 14px' }}>Purpose</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f1f6' }}>Vercel Inc.</td>
                <td style={{ padding: '10px 14px' }}>Serverless edge hosting & content delivery</td>
                <td style={{ padding: '10px 14px' }}>United States / Global Edge</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f1f6' }}>Neon / Supabase PostgreSQL</td>
                <td style={{ padding: '10px 14px' }}>Encrypted transactional database & cloud storage</td>
                <td style={{ padding: '10px 14px' }}>United States / EU Regions</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f1f6' }}>Stripe Inc.</td>
                <td style={{ padding: '10px 14px' }}>PCI-DSS Level 1 subscription billing & payment gateway</td>
                <td style={{ padding: '10px 14px' }}>United States / Global</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f1f6' }}>Google Cloud / OpenAI</td>
                <td style={{ padding: '10px 14px' }}>Enterprise generative AI inference (zero data retention)</td>
                <td style={{ padding: '10px 14px' }}>United States</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f1f6' }}>Resend / SMTP Relay</td>
                <td style={{ padding: '10px 14px' }}>Transactional system email dispatching</td>
                <td style={{ padding: '10px 14px' }}>United States</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 8 */}
      <section id="user-rights" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          8. Your Data Protection Rights (GDPR & CCPA/CPRA)
        </h2>
        <p>Regardless of your geographic jurisdiction, AgencyFlow extends comprehensive privacy rights to all workspace owners:</p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Right to Access:</strong> You may request a complete copy of the personal data held about your workspace.</li>
          <li><strong>Right to Rectification:</strong> You may update or correct inaccurate profile or contact details directly in Settings.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request complete deletion of your account and all associated workspace records.</li>
          <li><strong>Right to Data Portability:</strong> You may export your leads, clients, invoices, and proposals in structured JSON and CSV formats.</li>
          <li><strong>Right to Restrict or Object to Processing:</strong> You may restrict certain processing activities, including disabling optional AI capabilities.</li>
          <li><strong>Non-Discrimination:</strong> We do not discriminate against users who exercise their privacy rights under CCPA or GDPR.</li>
        </ul>
      </section>

      {/* Section 9 */}
      <section id="security-measures" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          9. Security & Encryption Standards
        </h2>
        <p>
          AgencyFlow enforces defense-in-depth security across all software layers:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Encryption in Transit:</strong> 100% of data transferred between client browsers and AgencyFlow endpoints is secured with TLS 1.3 encryption and strict HTTP Strict Transport Security (HSTS).</li>
          <li><strong>Encryption at Rest:</strong> Database volumes, file attachments, and automated snapshots are encrypted at rest using AES-256 standards.</li>
          <li><strong>Multi-Tenant Isolation:</strong> Logical tenancy barriers enforced via workspace IDs ensure no cross-workspace data leakage is mathematically possible.</li>
        </ul>
        <p>
          For comprehensive technical documentation on our threat modeling and defenses, please consult our <a href="/security" style={{ color: '#d0bcff', textDecoration: 'underline' }}>Security Whitepaper</a>.
        </p>
      </section>

      {/* Section 10 */}
      <section id="contact-dpo">
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px', letterSpacing: '-0.01em' }}>
          10. Contact Our Data Protection Officer
        </h2>
        <p>
          If you have any questions regarding this Privacy Policy, wish to exercise any of your statutory rights, or need to execute a custom Data Processing Addendum (DPA), please contact our legal and privacy team:
        </p>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginTop: '16px' }}>
          <div style={{ fontWeight: 700, color: '#f1f1f6', marginBottom: '6px' }}>AgencyFlow Inc. — Data Protection Office</div>
          <div style={{ fontSize: '14.5px', color: '#9da0b5', lineHeight: 1.6 }}>
            Email: <a href="mailto:privacy@agencyflow.com" style={{ color: '#d0bcff', textDecoration: 'none', fontWeight: 600 }}>privacy@agencyflow.com</a><br />
            Support Helpdesk: <a href="mailto:support@agencyflow.com" style={{ color: '#d0bcff', textDecoration: 'none' }}>support@agencyflow.com</a><br />
            Physical Address: AgencyFlow Inc., 100 Innovation Way, Suite 400, San Francisco, CA 94105, USA
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
