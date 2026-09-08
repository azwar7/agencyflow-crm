import React from 'react';
import { ProposalDocumentData } from '@/lib/pdf/types';

export function renderProposalHtml(data: ProposalDocumentData): string {
  const {
    proposalNumber,
    title,
    client,
    issuer,
    value,
    currencySymbol,
    preparedBy,
    date,
    summary,
    scopeOfWork,
    pricingItems,
    paymentTerms,
    termsAndConditions,
    acceptance,
  } = data;

  const defaultTerms = [
    'Scope Integrity: Any additional features, revisions outside the stated phases, or third-party API license fees will be estimated as a separate Statement of Work.',
    'Intellectual Property: Full proprietary ownership, copyright, and source code of custom engineering deliverables transfer to the Client upon final invoice settlement.',
    'Confidentiality: Both parties agree to protect proprietary source code, credentials, and strategic trade secrets under mutual non-disclosure obligations.',
    'Termination & Milestones: Either party may pause work with 14 days written notice; fees for work completed through the current active milestone remain payable.',
  ];

  const scopeHtml = scopeOfWork
    .map(
      (phase) => `
      <div class="phase-card">
        <div class="phase-top">
          <div class="phase-title">${phase.phase}</div>
          <div class="phase-duration">${phase.duration}</div>
        </div>
        <div class="phase-desc">${phase.description}</div>
        ${
          phase.deliverables && phase.deliverables.length > 0
            ? `
          <ul class="deliverables-list">
            ${phase.deliverables.map((del) => `<li>${del}</li>`).join('')}
          </ul>
        `
            : ''
        }
      </div>
    `
    )
    .join('');

  const pricingHtml = pricingItems
    .map(
      (item, idx) => `
      <tr>
        <td style="color: #64748b; width: 45px;">${idx + 1}</td>
        <td>
          <div class="pricing-item-name">${item.item}</div>
          ${item.description ? `<div class="pricing-item-desc">${item.description}</div>` : ''}
        </td>
        <td class="text-right" style="font-weight: 800; color: #0f172a; width: 130px;">
          ${currencySymbol}${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join('');

  const termsHtml = (termsAndConditions || defaultTerms)
    .map((term) => `<div style="margin-bottom: 8px; line-height: 1.55;">• ${term}</div>`)
    .join('');

  const acceptanceHtml =
    acceptance?.signatureStatus === 'SIGNED'
      ? `
      <div>
        <span class="sig-signed-badge">✓ VERIFIED ELECTRONIC SIGNATURE</span>
        <div style="font-size: 13px; font-weight: 800; color: #0f172a;">${acceptance.acceptedBy || client.name}</div>
        <div style="font-size: 11px; color: #64748b;">${acceptance.acceptedTitle || 'Authorized Signatory'}</div>
        <div class="sig-meta-row" style="margin-top: 12px;">
          <span>Signed Date:</span>
          <span style="font-weight: 700;">${acceptance.acceptedAt || date}</span>
        </div>
      </div>
    `
      : `
      <div>
        <div class="sig-line-block">
          <div class="sig-meta-row">
            <span>Print Name:</span>
            <span style="font-weight: 600;">${client.name}</span>
          </div>
          <div class="sig-meta-row">
            <span>Title:</span>
            <span>_________________________</span>
          </div>
          <div class="sig-meta-row">
            <span>Signature:</span>
            <span>_________________________</span>
          </div>
          <div class="sig-meta-row">
            <span>Date:</span>
            <span>_________________________</span>
          </div>
        </div>
      </div>
    `;

  return `
    <div class="proposal-container">
      <style>
        @page {
          size: A4 portrait;
          margin: 0;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1e293b;
          background: #ffffff;
          font-size: 12.5px;
          line-height: 1.6;
        }
        .proposal-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background: #ffffff;
          padding: 14mm 14mm 16mm 14mm;
        }
        .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .cover-page {
          min-height: 250mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px 10px 20px 10px;
          page-break-after: always;
          break-after: page;
        }
        .cover-top {
          border-bottom: 3px solid #4f46e5;
          padding-bottom: 24px;
        }
        .cover-agency-name {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.03em;
        }
        .cover-agency-sub {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          margin-top: 2px;
        }
        .cover-center {
          margin: 40px 0;
        }
        .cover-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 4px 14px;
          border-radius: 9999px;
          margin-bottom: 20px;
        }
        .cover-title {
          font-size: 34px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          max-width: 580px;
        }
        .cover-tagline {
          font-size: 15px;
          color: #475569;
          max-width: 520px;
          line-height: 1.6;
        }
        .cover-bottom {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 24px 28px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
        }
        .cover-meta-label {
          font-size: 10px;
          font-weight: 800;
          color: #6366f1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .cover-meta-val {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }
        .cover-meta-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
        }
        .section-block {
          margin-bottom: 30px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .section-number {
          font-size: 13px;
          font-weight: 900;
          color: #ffffff;
          background: #4f46e5;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .section-title {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .narrative-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #4f46e5;
          padding: 16px 18px;
          border-radius: 6px;
          font-size: 12.5px;
          color: #334155;
          line-height: 1.7;
        }
        .goals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 12px;
        }
        .goal-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px 14px;
        }
        .goal-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .goal-desc {
          font-size: 11.5px;
          color: #64748b;
          line-height: 1.45;
        }
        .phase-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px 18px;
          margin-bottom: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .phase-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .phase-title {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
        }
        .phase-duration {
          font-size: 10.5px;
          font-weight: 800;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 2px 10px;
          border-radius: 9999px;
        }
        .phase-desc {
          font-size: 12px;
          color: #475569;
          margin-bottom: 10px;
          line-height: 1.55;
        }
        .deliverables-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 16px;
        }
        .deliverables-list li {
          font-size: 11.5px;
          color: #1e293b;
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }
        .deliverables-list li::before {
          content: "✓";
          color: #059669;
          font-weight: 900;
          font-size: 11px;
        }
        .pricing-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          margin-bottom: 18px;
        }
        .pricing-table thead {
          display: table-header-group;
        }
        .pricing-table th {
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 9px 14px;
          text-align: left;
        }
        .pricing-table th.text-right,
        .pricing-table td.text-right {
          text-align: right;
        }
        .pricing-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .pricing-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }
        .pricing-table td {
          padding: 12px 14px;
          font-size: 12px;
          vertical-align: top;
        }
        .pricing-item-name {
          font-weight: 700;
          color: #0f172a;
        }
        .pricing-item-desc {
          font-size: 11px;
          color: #64748b;
          margin-top: 3px;
        }
        .total-investment-bar {
          background: #0f172a;
          color: #ffffff;
          border-radius: 6px;
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          break-inside: avoid;
        }
        .total-label {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .total-amount {
          font-size: 22px;
          font-weight: 900;
          color: #34d399;
        }
        .signatures-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 14px;
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .sig-box {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 16px 18px;
          background: #f8fafc;
        }
        .sig-box-title {
          font-size: 10.5px;
          font-weight: 800;
          color: #6366f1;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .sig-line-block {
          margin-top: 24px;
          border-top: 1px dashed #94a3b8;
          padding-top: 8px;
        }
        .sig-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          margin-top: 6px;
          color: #475569;
        }
        .sig-signed-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
      </style>

      <!-- 1. COVER PAGE -->
      <div class="cover-page">
        <div class="cover-top">
          <div class="cover-agency-name">${issuer.name || 'AgencyFlow Digital'}</div>
          <div class="cover-agency-sub">${issuer.tagline || 'Digital Engineering & Custom Growth Systems'}</div>
        </div>

        <div class="cover-center">
          <div class="cover-badge">OFFICIAL STATEMENT OF WORK</div>
          <h1 class="cover-title">${title}</h1>
          <p class="cover-tagline">
            Prepared specifically for <strong>${client.name}</strong> to outline the strategic architecture, implementation roadmap, deliverables, and commercial agreement.
          </p>
        </div>

        <div class="cover-bottom">
          <div>
            <div class="cover-meta-label">Prepared For (Client)</div>
            <div class="cover-meta-val">${client.name}</div>
            <div class="cover-meta-sub">${client.company || 'Client Organization Entity'}</div>
            ${client.email ? `<div class="cover-meta-sub">${client.email}</div>` : ''}
          </div>

          <div>
            <div class="cover-meta-label">Document Details</div>
            <div class="cover-meta-val">Proposal #${proposalNumber}</div>
            <div class="cover-meta-sub">Date: ${date}</div>
            <div class="cover-meta-sub">Author: ${preparedBy || issuer.name}</div>
          </div>
        </div>
      </div>

      <!-- 2. EXECUTIVE SUMMARY -->
      <div class="section-block">
        <div class="section-header">
          <div class="section-number">1</div>
          <h2 class="section-title">Executive Summary & Strategic Context</h2>
        </div>
        <div class="narrative-box">
          ${summary || 'This comprehensive Statement of Work defines the technical architecture, custom application engineering, and automated CRM ingestion pipelines to accelerate business growth and streamline digital customer acquisition.'}
        </div>
      </div>

      <!-- 3. PROJECT OBJECTIVES -->
      <div class="section-block break-inside-avoid">
        <div class="section-header">
          <div class="section-number">2</div>
          <h2 class="section-title">Core Project Objectives</h2>
        </div>
        <div class="goals-grid">
          <div class="goal-card">
            <div class="goal-title">Operational Velocity</div>
            <div class="goal-desc">Eliminate manual handoffs and fragmentation across disconnected tools.</div>
          </div>
          <div class="goal-card">
            <div class="goal-title">High-Converting Infrastructure</div>
            <div class="goal-desc">Scale pipeline throughput with automated qualification and prompt client sign-offs.</div>
          </div>
          <div class="goal-card">
            <div class="goal-title">Financial Predictability</div>
            <div class="goal-desc">Gain transparent milestone billing with automated invoice schedules and verified receipts.</div>
          </div>
          <div class="goal-card">
            <div class="goal-title">Quality Assurance & Security</div>
            <div class="goal-desc">Enterprise-grade access controls, multi-tenant isolation, and complete data integrity.</div>
          </div>
        </div>
      </div>

      <!-- 4. PHASED SCOPE OF WORK -->
      <div class="section-block">
        <div class="section-header">
          <div class="section-number">3</div>
          <h2 class="section-title">Phased Implementation Roadmap (SOW)</h2>
        </div>
        ${scopeHtml}
      </div>

      <!-- 5. ITEMISED INVESTMENT & PRICING -->
      <div class="section-block break-inside-avoid">
        <div class="section-header">
          <div class="section-number">4</div>
          <h2 class="section-title">Itemized Commercial Investment</h2>
        </div>

        <table class="pricing-table">
          <thead>
            <tr>
              <th style="width: 45px;">#</th>
              <th>Service / Work Stream</th>
              <th style="width: 130px;" class="text-right">Investment</th>
            </tr>
          </thead>
          <tbody>
            ${pricingHtml}
          </tbody>
        </table>

        <div class="total-investment-bar">
          <div class="total-label">Total Contract Investment</div>
          <div class="total-amount">
            ${currencySymbol}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <!-- 6. PAYMENT TERMS -->
      <div class="section-block break-inside-avoid">
        <div class="section-header">
          <div class="section-number">5</div>
          <h2 class="section-title">Payment Terms & Milestone Schedule</h2>
        </div>
        <div class="narrative-box">
          ${paymentTerms || '50% deposit upon proposal sign-off, 25% at mid-project milestone review, and 25% upon final production deployment.'}
        </div>
      </div>

      <!-- 7. TERMS & CONDITIONS -->
      <div class="section-block break-inside-avoid">
        <div class="section-header">
          <div class="section-number">6</div>
          <h2 class="section-title">Terms & Conditions</h2>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; borderRadius: 6px; padding: 14px 18px; font-size: 11.5px; color: #475569;">
          ${termsHtml}
        </div>
      </div>

      <!-- 8. SIGNATURE & ACCEPTANCE BLOCK -->
      <div class="section-block break-inside-avoid">
        <div class="section-header">
          <div class="section-number">7</div>
          <h2 class="section-title">Acceptance & Authorization</h2>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 10px;">
          By signing below, the Client and Agency agree to the deliverables, milestone schedules, and investment outlined in this Statement of Work.
        </p>

        <div class="signatures-grid">
          <div class="sig-box">
            <div class="sig-box-title">Client Authorized Representative</div>
            ${acceptanceHtml}
          </div>

          <div class="sig-box">
            <div class="sig-box-title">Agency Authorized Representative</div>
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
                ${issuer.name || 'AgencyFlow Digital'}
              </div>
              <div style="font-size: 11px; color: #64748b;">
                Principal Partner / Executive Officer
              </div>
              <div class="sig-line-block" style="margin-top: 16px;">
                <div class="sig-meta-row">
                  <span>Author / Lead:</span>
                  <span style="font-weight: 600;">${preparedBy || issuer.name}</span>
                </div>
                <div class="sig-meta-row">
                  <span>Signature:</span>
                  <span style="font-family: monospace; font-weight: 700; color: #4f46e5;">
                    /s/ ${preparedBy || issuer.name}
                  </span>
                </div>
                <div class="sig-meta-row">
                  <span>Date:</span>
                  <span style="font-weight: 700;">${date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function ProposalDocument({ data }: { data: ProposalDocumentData }) {
  return <div dangerouslySetInnerHTML={{ __html: renderProposalHtml(data) }} />;
}
