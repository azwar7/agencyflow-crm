import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth-session';
import { renderInvoiceHtml } from '@/components/invoices/pdf/InvoiceDocument';
import { generatePdfFromHtml } from '@/lib/pdf/generate-pdf';
import { InvoiceDocumentData } from '@/lib/pdf/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getAuthSession(request);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: 'Invoice ID is required' } },
        { status: 400 }
      );
    }

    // Strict multi-tenant lookup: workspaceId match required
    const invoice = await prisma.invoice.findFirst({
      where: {
        workspaceId: session.workspaceId,
        OR: [{ id }, { number: id }],
      },
      include: {
        company: true,
        workspace: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: { message: 'Invoice not found or unauthorized' } },
        { status: 404 }
      );
    }

    const currencySymbol =
      invoice.workspace?.currency === 'EUR'
        ? '€'
        : invoice.workspace?.currency === 'GBP'
        ? '£'
        : '$';

    const invoiceData: InvoiceDocumentData = {
      invoiceNumber: invoice.number || `INV-${invoice.id.slice(0, 8).toUpperCase()}`,
      issuedDate: invoice.issuedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      dueDate: invoice.dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: invoice.status as 'PAID' | 'PENDING' | 'OVERDUE',
      currency: invoice.workspace?.currency || 'USD',
      currencySymbol,
      issuer: {
        name: invoice.workspace?.name || session.agencyName || 'AgencyFlow Digital',
        tagline: invoice.workspace?.niche || 'Digital Engineering & Custom Growth Systems',
        logoUrl: invoice.workspace?.logoUrl,
        email: invoice.workspace?.businessEmail || 'billing@agencyflow.io',
        phone: invoice.workspace?.businessPhone || '+1 (555) 019-2834',
        address: invoice.workspace?.businessAddress || '100 Innovation Parkway, Suite 400',
        website: invoice.workspace?.website || 'agencyflow.io',
      },
      client: {
        name: invoice.client,
        company: invoice.company?.name || invoice.client,
        email: invoice.company?.domain ? `billing@${invoice.company.domain}` : undefined,
      },
      items: [
        {
          description: `${invoice.client} — Milestone Engineering & SOW Deposit`,
          detail: 'Full-stack engineering, bespoke CRM architecture, and workflow automation pipeline.',
          quantity: 1,
          rate: invoice.amount,
          amount: invoice.amount,
        },
      ],
      subtotal: invoice.amount,
      totalAmount: invoice.amount,
      paymentTerms: 'Payment is due within 14 calendar days of issue date.',
      paymentInstructions: {
        bankName: 'Silicon Valley Commercial Bank',
        routingNumber: '121000358',
        accountNumber: '88492048102',
        reference: invoice.number || invoice.id,
      },
      notes: 'Thank you for your business. For electronic transfer confirmation, please contact our finance desk.',
    };

    const htmlContent = renderInvoiceHtml(invoiceData);

    const pdfBuffer = await generatePdfFromHtml(htmlContent, {
      title: `Invoice-${invoiceData.invoiceNumber}`,
    });

    const url = new URL(request.url);
    const isDownload = url.searchParams.get('download') === 'true';
    const disposition = isDownload ? 'attachment' : 'inline';

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="Invoice-${invoiceData.invoiceNumber}.pdf"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Invoice PDF Generation Error:', error);
    const isUnauthorized = error.message?.includes('Unauthorized') || error.message?.includes('session');
    const status = isUnauthorized ? 401 : 500;
    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to generate invoice PDF' } },
      { status }
    );
  }
}
