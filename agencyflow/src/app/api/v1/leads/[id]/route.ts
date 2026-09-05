import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth-session';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession(request);
    const { id } = await params;

    // Strict workspace-scoped lookup to prevent cross-tenant IDOR
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
      include: {
        assignedTo: { select: { id: true, fullName: true, email: true, role: true } },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { user: { select: { fullName: true } } },
        },
        tasks: {
          orderBy: { dueDate: 'asc' },
          take: 50,
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized') || error.message?.includes('session');
    const isForbidden = error.message?.includes('Forbidden');
    const status = isUnauthorized ? 401 : isForbidden ? 403 : 500;

    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to fetch lead' } },
      { status }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession(request);
    const { id } = await params;
    const body = await request.json();

    // Verify lead exists and belongs strictly to the authenticated workspace
    const existingLead = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    // If reassignment is requested, ensure target user belongs to this workspace
    if (body.assignedToId) {
      const targetUser = await prisma.user.findFirst({
        where: {
          id: body.assignedToId,
          workspaceId: session.workspaceId,
        },
      });

      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: { message: 'Assigned user does not belong to this workspace.' } },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.leadScore !== undefined ? { leadScore: body.leadScore } : {}),
        ...(body.aiSummary ? { aiSummary: body.aiSummary } : {}),
        ...(body.assignedToId !== undefined ? { assignedToId: body.assignedToId || null } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized') || error.message?.includes('session');
    const isForbidden = error.message?.includes('Forbidden');
    const status = isUnauthorized ? 401 : isForbidden ? 403 : 400;

    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to update lead' } },
      { status }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAuthSession(request);
    const { id } = await params;

    // Verify lead exists and belongs strictly to the authenticated workspace
    const existingLead = await prisma.lead.findFirst({
      where: {
        id,
        workspaceId: session.workspaceId,
      },
    });

    if (!existingLead) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const companyName = existingLead.companyName?.trim();

    // 1. Delete associated child records concurrently (outreach emails, activities, tasks, AI analyses, custom fields)
    await Promise.all([
      prisma.outreachEmail.deleteMany({ where: { leadId: id, workspaceId: session.workspaceId } }),
      prisma.activity.deleteMany({ where: { leadId: id, workspaceId: session.workspaceId } }),
      prisma.task.deleteMany({ where: { leadId: id, workspaceId: session.workspaceId } }),
      prisma.leadAiAnalysis.deleteMany({ where: { leadId: id, workspaceId: session.workspaceId } }),
      prisma.customFieldValue.deleteMany({ where: { recordId: id, workspaceId: session.workspaceId } }),
    ]);

    // 2. Delete the lead itself from the database
    await prisma.lead.delete({
      where: { id },
    });

    // 3. Optional Safe Cleanup: If company has no other leads, deals, projects, or invoices, remove it from Clients
    if (companyName) {
      try {
        const otherLeadsCount = await prisma.lead.count({
          where: {
            workspaceId: session.workspaceId,
            companyName: { equals: companyName, mode: 'insensitive' },
          },
        });

        if (otherLeadsCount === 0) {
          const company = await prisma.company.findFirst({
            where: {
              workspaceId: session.workspaceId,
              name: { equals: companyName, mode: 'insensitive' },
            },
            include: {
              deals: { select: { id: true }, take: 1 },
              projects: { select: { id: true }, take: 1 },
              invoices: { select: { id: true }, take: 1 },
              contacts: { select: { id: true }, take: 1 },
              proposals: { select: { id: true }, take: 1 },
            },
          });

          if (
            company &&
            company.deals.length === 0 &&
            company.projects.length === 0 &&
            company.invoices.length === 0 &&
            company.contacts.length === 0 &&
            company.proposals.length === 0
          ) {
            await prisma.company.delete({ where: { id: company.id } });
          }
        }
      } catch (cleanupErr) {
        console.warn('[Lead Delete] Non-critical company cleanup warning:', cleanupErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead permanently deleted from database',
    });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized') || error.message?.includes('session');
    const isForbidden = error.message?.includes('Forbidden');
    const status = isUnauthorized ? 401 : isForbidden ? 403 : 500;

    return NextResponse.json(
      { success: false, error: { message: error.message || 'Failed to delete lead' } },
      { status }
    );
  }
}

