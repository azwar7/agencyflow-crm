import React from 'react';
import { InvoiceDocumentData } from '@/lib/pdf/types';

export function renderInvoiceHtml(data: InvoiceDocumentData): string {
  const {
    invoiceNumber,
    issuedDate,
    dueDate,
    status,
    currencySymbol,
    issuer,
    client,
    items,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    totalAmount,
    paymentTerms,
    paymentInstructions,
    notes,
  } = data;

  const statusColor =
    status === 'PAID'
      ? { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' }
      : status === 'OVERDUE'
      ? { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' }
      : { bg: '#fffbeb', text: '#92400e', border: '#fde68a' };

  const itemsHtml = items
    .map(
      (item, idx) => `
      <tr>
        <td style="width: 45px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td>
          <div style="font-weight: 600; color: #0f172a;">${item.description}</div>
          ${item.detail ? `<div style="font-size: 11px; color: #64748b; margin-top: 3px; line-height: 1.4;">${item.detail}</div>` : ''}
        </td>
        <td style="width: 70px; text-align: center; color: #334155;">${item.quantity}</td>
        <td style="width: 110px; text-align: right; color: #334155;">
          ${currencySymbol}${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td style="width: 120px; text-align: right; font-weight: 700; color: #0f172a;">
          ${currencySymbol}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div class="invoice-container">
      <style>
        @page {
          size: A4 portrait;
          margin: 14mm 14mm 16mm 14mm;
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
          font-size: 13px;
          line-height: 1.5;
        }
        .invoice-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          background: #ffffff;
        }
        .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
          margin-bottom: 24px;
        }
        .agency-info h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .agency-info .tagline {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .agency-info .details {
          font-size: 11.5px;
          color: #475569;
          line-height: 1.45;
        }
        .invoice-badge-block {
          text-align: right;
        }
        .invoice-badge-block .doc-type {
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .invoice-badge-block .doc-number {
          font-size: 14px;
          font-weight: 700;
          color: #4338ca;
          margin-bottom: 8px;
        }
        .status-pill {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 10px;
        }
        .dates-table {
          font-size: 11.5px;
          margin-left: auto;
        }
        .dates-table td {
          padding: 2px 0 2px 14px;
        }
        .dates-table .date-label {
          color: #64748b;
          font-weight: 600;
          text-align: right;
        }
        .dates-table .date-val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }
        .parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }
        .party-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 16px;
        }
        .party-title {
          font-size: 10px;
          font-weight: 800;
          color: #6366f1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .party-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .party-sub {
          font-size: 11.5px;
          color: #475569;
          line-height: 1.45;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        .items-table thead {
          display: table-header-group;
        }
        .items-table th {
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 10px 14px;
          text-align: left;
        }
        .items-table th.text-right,
        .items-table td.text-right {
          text-align: right;
        }
        .items-table th.text-center,
        .items-table td.text-center {
          text-align: center;
        }
        .items-table tbody tr {
          break-inside: avoid;
          page-break-inside: avoid;
          border-bottom: 1px solid #e2e8f0;
        }
        .items-table tbody tr:nth-child(even) {
          background: #f8fafc;
        }
        .items-table td {
          padding: 12px 14px;
          font-size: 12px;
          vertical-align: top;
        }
        .summary-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 28px;
        }
        .summary-card {
          width: 280px;
          border-collapse: collapse;
        }
        .summary-card td {
          padding: 6px 10px;
          font-size: 12px;
        }
        .summary-card .lbl {
          color: #64748b;
          font-weight: 600;
          text-align: right;
        }
        .summary-card .val {
          color: #0f172a;
          font-weight: 700;
          text-align: right;
        }
        .summary-card .total-row {
          background: #0f172a;
          color: #ffffff;
        }
        .summary-card .total-row td {
          padding: 10px 12px;
        }
        .summary-card .total-row .lbl {
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
        }
        .summary-card .total-row .val {
          color: #34d399;
          font-size: 18px;
          font-weight: 900;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          font-size: 11.5px;
        }
        .footer-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px 14px;
        }
        .footer-box-title {
          font-size: 10px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }
        .footer-box-content {
          color: #334155;
          line-height: 1.45;
          font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
          font-size: 11px;
        }
        .closing-thanks {
          margin-top: 28px;
          text-align: center;
          padding-top: 16px;
          border-top: 1px dashed #cbd5e1;
          color: #64748b;
          font-size: 11.5px;
        }
      </style>

      <!-- Header Section -->
      <div class="header-section">
        <div class="agency-info">
          <h1>${issuer.name || 'AgencyFlow Digital'}</h1>
          <div class="tagline">${issuer.tagline || 'Digital Engineering & Custom Growth Systems'}</div>
          <div class="details">
            ${issuer.address ? `<div>${issuer.address}</div>` : ''}
            <div>
              ${[issuer.email || 'billing@agencyflow.io', issuer.phone || '+1 (555) 019-2834', issuer.website || 'agencyflow.io']
                .filter(Boolean)
                .join(' • ')}
            </div>
          </div>
        </div>

        <div class="invoice-badge-block">
          <div class="doc-type">INVOICE</div>
          <div class="doc-number">${invoiceNumber}</div>
          <div>
            <span class="status-pill" style="background-color: ${statusColor.bg}; color: ${statusColor.text}; border: 1px solid ${statusColor.border};">
              ${status}
            </span>
          </div>
          <table class="dates-table">
            <tbody>
              <tr>
                <td class="date-label">Issue Date:</td>
                <td class="date-val">${issuedDate}</td>
              </tr>
              <tr>
                <td class="date-label">Due Date:</td>
                <td class="date-val" style="color: ${status === 'OVERDUE' ? '#b91c1c' : '#0f172a'};">${dueDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Parties: Billed From & Billed To -->
      <div class="parties-grid break-inside-avoid">
        <div class="party-card">
          <div class="party-title">Billed From</div>
          <div class="party-name">${issuer.name || 'AgencyFlow Digital'}</div>
          <div class="party-sub">
            ${issuer.address ? `<div>${issuer.address}</div>` : ''}
            <div>${issuer.email || 'billing@agencyflow.io'}</div>
            ${issuer.phone ? `<div>${issuer.phone}</div>` : ''}
          </div>
        </div>

        <div class="party-card">
          <div class="party-title">Billed To (Client)</div>
          <div class="party-name">${client.name}</div>
          <div class="party-sub">
            ${client.company ? `<div>${client.company}</div>` : ''}
            ${client.address ? `<div>${client.address}</div>` : ''}
            ${client.email ? `<div>${client.email}</div>` : ''}
            ${client.phone ? `<div>${client.phone}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Itemized Line Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 45px;" class="text-center">#</th>
            <th>Item & Service Description</th>
            <th style="width: 70px;" class="text-center">Qty</th>
            <th style="width: 110px;" class="text-right">Unit Rate</th>
            <th style="width: 120px;" class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals Summary -->
      <div class="summary-wrapper break-inside-avoid">
        <table class="summary-card">
          <tbody>
            <tr>
              <td class="lbl">Subtotal:</td>
              <td class="val">${currencySymbol}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ${
              taxRate !== undefined && taxRate > 0
                ? `<tr>
                    <td class="lbl">Estimated Tax (${taxRate}%):</td>
                    <td class="val">${currencySymbol}${(taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>`
                : ''
            }
            ${
              discountAmount !== undefined && discountAmount > 0
                ? `<tr>
                    <td class="lbl">Discount Applied:</td>
                    <td class="val" style="color: #059669;">-${currencySymbol}${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>`
                : ''
            }
            <tr class="total-row">
              <td class="lbl">Total Due:</td>
              <td class="val">${currencySymbol}${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment Instructions & Terms -->
      <div class="footer-grid break-inside-avoid">
        <div class="footer-box">
          <div class="footer-box-title">Electronic / Wire Transfer Instructions</div>
          <div class="footer-box-content">
            <div>Bank: ${paymentInstructions?.bankName || 'Silicon Valley Commercial Bank'}</div>
            <div>Routing (ABA): ${paymentInstructions?.routingNumber || '121000358'}</div>
            <div>Account Number: ${paymentInstructions?.accountNumber || '88492048102'}</div>
            <div>Reference: ${paymentInstructions?.reference || invoiceNumber}</div>
          </div>
        </div>

        <div class="footer-box">
          <div class="footer-box-title">Payment Terms & Policies</div>
          <div style="font-size: 11.5px; color: #475569; line-height: 1.5;">
            ${paymentTerms || 'Payment is due within 14 calendar days of issue date. Please state the invoice reference with payment.'}
            ${notes ? `<div style="margin-top: 6px; font-style: italic;">${notes}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="closing-thanks break-inside-avoid">
        Thank you for your partnership with <strong>${issuer.name || 'AgencyFlow Digital'}</strong>.
      </div>
    </div>
  `;
}

export function InvoiceDocument({ data }: { data: InvoiceDocumentData }) {
  return <div dangerouslySetInnerHTML={{ __html: renderInvoiceHtml(data) }} />;
}
