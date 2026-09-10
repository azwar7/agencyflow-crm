'use client';

import React from 'react';
import LegalLayout from '@/components/LegalLayout';
import { Lock, Server, ShieldCheck, Key, RefreshCw, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

const sections = [
  { id: 'overview', title: '1. Security Philosophy' },
  { id: 'encryption', title: '2. Cryptographic Architecture' },
  { id: 'isolation', title: '3. Multi-Tenant Data Isolation' },
  { id: 'authentication', title: '4. Authentication & RBAC' },
  { id: 'infrastructure', title: '5. Infrastructure & Edge Hardening' },
  { id: 'backups', title: '6. Backups & Disaster Recovery' },
  { id: 'ai-security', title: '7. AI Privacy & Zero Retention' },
  { id: 'disclosure', title: '8. Responsible Disclosure' },
];

export default function SecurityWhitepaperPage() {
  return (
    <LegalLayout
      title="Security Architecture & Trust Whitepaper"
      subtitle="Comprehensive overview of AgencyFlow's cryptographic controls, tenant isolation boundaries, infrastructure hardening, and data defense-in-depth."
      lastUpdated="September 10, 2026"
      badgeText="Security Architecture"
      icon={<Lock size={14} />}
      sections={sections}
    >
      {/* Section 1 */}
      <section id="overview" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          1. Security Philosophy & Defense-in-Depth
        </h2>
        <p>
          At <strong>AgencyFlow</strong>, we recognize that agencies and freelance studios entrust us with their most sensitive commercial capital: high-value lead pipelines, signed client contracts, proprietary deliverables, and itemized billing records.
        </p>
        <p>
          Our security architecture is designed on the principle of <strong>Zero-Trust Defense-in-Depth</strong>. Every layer of the platform—from browser requests at the edge, to serverless lambda execution, down to row-level database transactions—is isolated, authenticated, and encrypted by default.
        </p>
      </section>

      {/* Section 2 */}
      <section id="encryption" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          2. Cryptographic Architecture (Transit & Rest)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5eead4', fontWeight: 700, marginBottom: '8px' }}>
              <Lock size={16} /> Encryption in Transit
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#9da0b5', lineHeight: 1.6 }}>
              All network communications are secured using <strong>TLS 1.3</strong> with modern cipher suites. We enforce HTTP Strict Transport Security (HSTS) with a minimum duration of one year to prevent downgrade attacks.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d0bcff', fontWeight: 700, marginBottom: '8px' }}>
              <Key size={16} /> Encryption at Rest
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#9da0b5', lineHeight: 1.6 }}>
              All PostgreSQL storage volumes, database tables, and automated backup snapshots are encrypted using <strong>AES-256</strong> hardware-accelerated encryption keys managed in certified HSMs.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section id="isolation" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          3. Multi-Tenant Data Isolation
        </h2>
        <p>
          AgencyFlow employs strict logical multi-tenancy. Every single data model—including Leads, Clients, Proposals, Deliverables, and Invoices—is bound to a unique <code>workspaceId</code> foreign key enforced at both the application and database query layer:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Mandatory Workspace Scoping:</strong> All database queries executed via our ORM automatically enforce workspace tenancy validation; queries missing a validated workspace context are rejected with an authorization exception.</li>
          <li><strong>Cross-Tenant Leakage Prevention:</strong> No user session can query, update, or traverse another agency's records, even if entity IDs are known or guessed.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="authentication" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          4. Authentication & Role-Based Access Control (RBAC)
        </h2>
        <p>
          User identity and session integrity are guarded by industry-tested cryptographic mechanisms:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Password Security:</strong> Passwords are never stored in plaintext. They are salted and hashed using <strong>bcrypt</strong> with an adaptive work factor (cost 10), providing strong protection against rainbow-table and offline brute-force attacks.</li>
          <li><strong>Session Security:</strong> Authenticated sessions use digitally signed JSON Web Tokens (JWTs) with cryptographic expiration timers, IP-binding, and secure storage in browser memory.</li>
          <li><strong>Granular RBAC:</strong> Agency workspaces support tiered permission roles (Owner, Admin, Manager, Member), ensuring team members only access data necessary for their workflow responsibilities.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="infrastructure" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          5. Infrastructure & Edge Hardening
        </h2>
        <p>
          AgencyFlow is hosted across top-tier cloud providers with redundant availability zones:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Distributed DDoS Mitigation:</strong> Cloudflare and Vercel edge networks absorb volumetric distributed denial of service attacks before traffic can reach production origin servers.</li>
          <li><strong>Content Security Policy (CSP):</strong> Strict CSP headers and cross-origin resource sharing (CORS) rules prevent Cross-Site Scripting (XSS), clickjacking, and unauthorized third-party script injection.</li>
          <li><strong>Parameterized SQL:</strong> All database queries utilize parameterized prepared statements, rendering SQL injection mathematically impossible.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section id="backups" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          6. Automated Backups & Disaster Recovery
        </h2>
        <p>
          We guarantee business continuity for agency operations:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>Point-in-Time Recovery (PITR):</strong> PostgreSQL transaction write-ahead logs (WAL) are streamed continuously, enabling point-in-time recovery to any second within the retention window.</li>
          <li><strong>Daily Automated Snapshots:</strong> Full database snapshots are created daily, encrypted, and replicated to multi-region storage.</li>
          <li><strong>High Availability Target:</strong> Our cloud infrastructure targets <strong>99.9% uptime</strong>, backed by automated health checks and failover mechanisms.</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section id="ai-security" style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          7. AI Data Protection & Zero-Training Guarantees
        </h2>
        <p>
          When using AgencyFlow's AI features (lead analysis, proposal generation, email templates):
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
          <li><strong>No Model Training:</strong> Prompt data is strictly processed via commercial zero-data-retention APIs and is <strong>never used to train public machine learning algorithms</strong>.</li>
          <li><strong>Stateless Inference:</strong> Data transferred for AI analysis is discarded immediately after generating the response.</li>
          <li><strong>Opt-Out Availability:</strong> Agency owners can toggle AI features on or off at any time directly in Workspace Settings.</li>
        </ul>
      </section>

      {/* Section 8 */}
      <section id="disclosure">
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f1f6', marginBottom: '14px' }}>
          8. Vulnerability Management & Responsible Disclosure
        </h2>
        <p>
          AgencyFlow welcomes reports from independent security researchers and customers. If you believe you have discovered a potential security vulnerability, please notify our response team:
        </p>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px', marginTop: '16px' }}>
          <div style={{ fontWeight: 700, color: '#f1f1f6', marginBottom: '6px' }}>AgencyFlow Security Response Team</div>
          <div style={{ fontSize: '14.5px', color: '#9da0b5', lineHeight: 1.6 }}>
            Report Email: <a href="mailto:security@agencyflow.com" style={{ color: '#d0bcff', textDecoration: 'none', fontWeight: 600 }}>security@agencyflow.com</a><br />
            Response SLA: All vulnerability submissions are triaged within <strong>24 hours</strong>.<br />
            Safe Harbor: We commit not to pursue legal action against security researchers acting in good faith who follow responsible disclosure practices without accessing user data.
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
