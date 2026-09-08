import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth-session';
import { renderProposalHtml } from '@/components/proposals/pdf/ProposalDocument';
import { generatePdfFromHtml } from '@/lib/pdf/generate-pdf';
import { ProposalDocumentData, ProposalScopePhase, ProposalPricingItem } from '@/lib/pdf/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getAuthSession(request);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: 'Proposal ID is required' } },
        { status: 400 }
      );
    }

    // Strict multi-tenant authorization
    const proposal = await prisma.proposal.findFirst({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
      include: {
        company: true,
        workspace: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: { message: 'Proposal not found or unauthorized' } },
        { status: 404 }
      );
    }

    const currencySymbol =
      proposal.workspace?.currency === 'EUR'
        ? '€'
        : proposal.workspace?.currency === 'GBP'
        ? '£'
        : '$';

    // Normalize Scope of Work
    let scopeOfWork: ProposalScopePhase[] = [];
    if (Array.isArray(proposal.scopeOfWork)) {
      scopeOfWork = proposal.scopeOfWork as unknown as ProposalScopePhase[];
    } else {
      scopeOfWork = [
        {
          phase: 'Phase 1: Architecture & UX Blueprint',
          duration: 'Weeks 1–2',
          description: 'Comprehensive workflow mapping, technical requirements discovery, and clickable visual prototype creation.',
          deliverables: [
            'System Architecture Specification',
            'Clickable High-Fidelity Prototype',
            'Database & API Schema Documentation',
          ],
        },
        {
          phase: 'Phase 2: Full-Stack Engineering & Automation',
          duration: 'Weeks 3–5',
          description: 'Bespoke full-stack development, database migration, automated webhook triggers, and third-party integrations.',
          deliverables: [
            'Core Operational CRM Application',
            'Automated Ingestion & Webhook Pipeline',
            'Role-Based Authorization Engine',
          ],
        },
        {
          phase: 'Phase 3: Quality Assurance, Security & Deployment',
          duration: 'Week 6',
          description: 'End-to-end regression testing, tenant security penetration checks, production data migration, and team onboarding.',
          deliverables: [
            'Production Cloud Deployment',
            'Security Audit Verification Report',
            'Recorded Staff Training Walkthrough',
          ],
        },
      ];
    }

    // Normalize Pricing Items
    let pricingItems: ProposalPricingItem[] = [];
    if (Array.isArray(proposal.pricingItems) && proposal.pricingItems.length > 0) {
      pricingItems = proposal.pricingItems as unknown as ProposalPricingItem[];
    } else {
      const val = proposal.value || 25000;
      pricingItems = [
        {
          item: 'Phase 1: Architecture, Systems Blueprint & UI Prototype',
          description: 'Discovery workshops, stakeholder interviews, and complete technical specifications.',
          price: Math.round(val * 0.35),
        },
        {
          item: 'Phase 2: Custom Application Engineering & Automated Pipelines',
          description: 'Full-stack application development, automated n8n webhooks, and database setup.',
          price: Math.round(val * 0.45),
        },
        {
          item: 'Phase 3: Cloud Deployment, Security Verification & Training',
          description: 'SSL setup, penetration testing, SLA warranty coverage, and team training.',
          price: Math.round(val * 0.2),
        },
      ];
    }

    // Normalize Deliverables list
    let deliverables: string[] = [];
    if (Array.isArray(proposal.deliverables)) {
      deliverables = proposal.deliverables as string[];
    } else {
      deliverables = [
        'Production-ready scalable web application',
        'Multi-channel outreach automation integration',
        'Custom client onboarding portal',
        'Full administrative documentation and source repository transfer',
      ];
    }

    const proposalNumber = `PROP-${proposal.id.slice(0, 8).toUpperCase()}`;

    const proposalData: ProposalDocumentData = {
      proposalId: proposal.id,
      proposalNumber,
      title: proposal.title,
      client: {
        name: proposal.client,
        company: proposal.company?.name || proposal.client,
        email: proposal.company?.domain ? `contact@${proposal.company.domain}` : undefined,
      },
      issuer: {
        name: proposal.workspace?.name || session.agencyName || 'AgencyFlow Digital',
        tagline: proposal.workspace?.niche || 'Digital Engineering & Custom Growth Systems',
        logoUrl: proposal.workspace?.logoUrl,
        email: proposal.workspace?.businessEmail || 'contact@agencyflow.io',
        phone: proposal.workspace?.businessPhone || '+1 (555) 019-2834',
        address: proposal.workspace?.businessAddress || '100 Innovation Parkway, Suite 400',
        website: proposal.workspace?.website || 'agencyflow.io',
      },
      value: proposal.value,
      valueFormatted: `${currencySymbol}${proposal.value.toLocaleString()}`,
      currencySymbol,
      status: proposal.status as 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED',
      preparedBy: proposal.preparedBy || session.fullName || 'AgencyFlow Lead',
      date: proposal.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      summary:
        proposal.summary ||
        'This Statement of Work defines the scope, deliverables, and commercial agreement to engineer a high-velocity operational CRM system tailored to client requirements.',
      scopeOfWork,
      deliverables,
      pricingItems,
      paymentTerms:
        proposal.paymentTerms ||
        '50% deposit upon proposal sign-off, 25% at mid-project milestone review, and 25% upon final production deployment.',
      acceptance: {
        acceptedBy: proposal.acceptedBy,
        acceptedTitle: proposal.acceptedTitle,
        acceptedAt: proposal.acceptedBy ? proposal.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
        signatureStatus: proposal.status === 'ACCEPTED' ? 'SIGNED' : 'PENDING',
      },
    };

    const htmlContent = renderProposalHtml(proposalData);

    const pdfBuffer = await generatePdfFromHtml(htmlContent, {
      title: `Proposal-${proposalData.client.name.replace(/\s+/g, '_')}`,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 8px; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <span>${proposalData.issuer.name} • Statement of Work</span>
          <span>${proposalData.proposalNumber}</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 8px; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <span>Confidential • Prepared for ${proposalData.client.name}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      margins: {
        top: '20mm',
        bottom: '22mm',
        left: '15mm',
        right: '15mm',
      },
    });

    const url = new URL(request.url);
    const isDownload = url.searchParams.get('download') === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';
    const safeClientName = proposalData.client.name.replace(/[^a-zA-Z0-9_-]/g, '_');

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="Proposal-${safeClientName}.pdf"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Proposal PDF Generation Error:', error);
    const isUnauthorized = error.message?.includes('Unauthorized') || error.message?.includes('session');
    const status = isUnauthorized ? 401 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to generate proposal PDF' } },
      { status }
    );
  }
}
