import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth-session';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const session = await getAuthSession(request);
    const workspaceId = session.workspaceId;
    const body = await request.json();
    const query = (body.query || body.message || '').trim();
    const conversationHistory: { role: 'user' | 'assistant'; content: string }[] = Array.isArray(body.conversationHistory)
      ? body.conversationHistory.slice(-8)
      : [];

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const qLower = query.toLowerCase();

    // 1. Determine dynamic limits based on user query intent
    const isRequestingAllLeads =
      qLower.includes('all lead') ||
      qLower.includes('all my lead') ||
      qLower.includes('list every lead') ||
      qLower.includes('list all lead') ||
      qLower.includes('show all lead') ||
      qLower.includes('show me all lead') ||
      qLower.includes('every lead') ||
      qLower.includes('all the lead') ||
      qLower.includes('current lead') ||
      qLower.includes('leads table');

    // 2. Fetch total record counts and live workspace data
    const [
      totalLeadsCount,
      totalDealsCount,
      totalProjectsCount,
      totalInvoicesCount,
      totalTasksCount,
    ] = await Promise.all([
      prisma.lead.count({ where: { workspaceId } }),
      prisma.deal.count({ where: { workspaceId } }),
      prisma.project.count({ where: { workspaceId } }),
      prisma.invoice.count({ where: { workspaceId } }),
      prisma.task.count({ where: { workspaceId } }),
    ]);

    const leadTakeLimit = isRequestingAllLeads
      ? Math.min(Math.max(totalLeadsCount, 50), 150)
      : Math.min(Math.max(totalLeadsCount, 30), 60);

    const [leads, deals, tasks, projects, invoices, deliverables] = await Promise.all([
      prisma.lead.findMany({
        where: { workspaceId },
        take: leadTakeLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          status: true,
          leadScore: true,
          email: true,
          phone: true,
          source: true,
        },
      }),
      prisma.deal.findMany({
        where: { workspaceId },
        take: 30,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, value: true, stage: true },
      }),
      prisma.task.findMany({
        where: { workspaceId },
        take: 30,
        orderBy: { dueDate: 'asc' },
        include: { assignedTo: { select: { fullName: true } } },
      }),
      prisma.project.findMany({
        where: { workspaceId },
        take: 25,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          clientName: true,
          status: true,
          progress: true,
          budget: true,
          nextMilestone: true,
          dueDate: true,
        },
      }),
      prisma.invoice.findMany({
        where: { workspaceId },
        take: 30,
        orderBy: { issuedDate: 'desc' },
        select: { id: true, number: true, client: true, amount: true, status: true, dueDate: true },
      }),
      prisma.deliverable.findMany({
        where: { workspaceId },
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, clientContact: true, status: true, version: true, fileType: true },
      }),
    ]);

    // 3. Action Execution: Create Task directly in database
    if (qLower.includes('create task') || qLower.includes('add task') || qLower.includes('new task')) {
      const defaultUser = await prisma.user.findFirst({ where: { workspaceId } });
      const createdTask = await prisma.task.create({
        data: {
          workspaceId,
          assignedToId: defaultUser?.id || session.userId,
          title: query.replace(/(create|add|new)\s+task:?/i, '').trim() || 'AI Generated Sprint Task',
          priority: qLower.includes('high') ? 'HIGH' : qLower.includes('low') ? 'LOW' : 'MEDIUM',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        success: true,
        answer: `✅ **Task Created Successfully!**\n\nI have added **"${createdTask.title}"** to your Task Board:\n- **Priority**: ${createdTask.priority}\n- **Status**: PENDING\n- **Due Date**: ${createdTask.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        cards: [
          {
            title: createdTask.title,
            type: 'Task',
            badge: createdTask.priority,
            link: '/tasks',
            meta: `Status: PENDING • Due: ${createdTask.dueDate.toLocaleDateString()}`,
          },
        ],
      });
    }

    // 4. Prepare structured RAG context payload for LLM
    const crmContext = {
      workspaceId: session.workspaceId,
      user: session.fullName || 'Agency Lead',
      leadsSummary: {
        totalInWorkspace: totalLeadsCount,
        retrievedCount: leads.length,
        hasMore: totalLeadsCount > leads.length,
        items: leads.map((l, idx) => ({
          index: idx + 1,
          company: l.companyName || 'N/A',
          contact: `${l.firstName} ${l.lastName}`.trim(),
          email: l.email || 'N/A',
          phone: l.phone || 'N/A',
          status: l.status,
          score: l.leadScore,
          source: l.source || 'Inbound',
        })),
      },
      dealsSummary: {
        totalInWorkspace: totalDealsCount,
        retrievedCount: deals.length,
        totalValue: deals.reduce((acc, d) => acc + d.value, 0),
        items: deals.map((d) => ({ title: d.title, value: d.value, stage: d.stage })),
      },
      projectsSummary: {
        totalInWorkspace: totalProjectsCount,
        retrievedCount: projects.length,
        items: projects.map((p) => ({
          title: p.title,
          client: p.clientName,
          status: p.status,
          progress: `${p.progress}%`,
          budget: `$${Number(p.budget).toLocaleString()}`,
          nextMilestone: p.nextMilestone,
          dueDate: p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'TBD',
        })),
      },
      invoicesSummary: {
        totalInWorkspace: totalInvoicesCount,
        retrievedCount: invoices.length,
        totalInvoiced: invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
        paidTotal: invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
        pendingTotal: invoices.filter((i) => i.status === 'PENDING').reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
        overdueTotal: invoices.filter((i) => i.status === 'OVERDUE').reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
        items: invoices.map((i) => ({
          number: i.number || i.id,
          client: i.client,
          amount: `$${Number(i.amount).toLocaleString()}`,
          status: i.status,
          due: i.dueDate ? new Date(i.dueDate).toLocaleDateString() : 'N/A',
        })),
      },
      tasksSummary: {
        totalInWorkspace: totalTasksCount,
        retrievedCount: tasks.length,
        openTasks: tasks.filter((t) => t.status !== 'COMPLETED').length,
        items: tasks.map((t) => ({
          title: t.title,
          assignee: t.assignedTo?.fullName || 'Unassigned',
          priority: t.priority,
          status: t.status,
          due: new Date(t.dueDate).toLocaleDateString(),
        })),
      },
      deliverablesSummary: {
        totalInWorkspace: deliverables.length,
        items: deliverables.map((d) => ({
          title: d.title,
          client: d.clientContact,
          status: d.status,
          version: d.version,
          format: d.fileType,
        })),
      },
    };

    // 5. Try Google Gemini API with High-Capacity Structured Instructions
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const systemPrompt = `You are AgencyFlow AI, the executive AI assistant and business intelligence engine for digital agencies.
You have real-time access to the user's CRM database via the following live JSON data:
${JSON.stringify(crmContext, null, 2)}

CORE OPERATIONAL INSTRUCTIONS:
1. ACCURACY & COMPLETENESS:
   - When the user asks for "all leads", "all deals", or asks to list/show records, you MUST provide the COMPLETE requested dataset from the CRM context without skipping, stopping halfway, or summarizing.
   - Never say "Here is the complete list" and only output a subset. If there are 30 leads in context, render all 30.
   - If totalInWorkspace is greater than retrievedCount, mention: "Showing [retrievedCount] of [totalInWorkspace] total records."
2. PRESENTATION & MARKDOWN TABLES:
   - For multi-record listings (e.g. leads, deals, projects, invoices, tasks), ALWAYS format the records as a clean, highly readable Markdown table.
     For Leads: | # | Company / Lead Name | Contact Name | Stage | AI Score | Email |
     For Invoices: | # | Invoice # | Client | Amount | Status | Due Date |
     For Projects: | # | Project Title | Client | Status | Progress | Budget | Due Date |
     For Tasks: | # | Task | Assignee | Priority | Status | Due Date |
   - Use standard Markdown pipes and headers so the interface can format them into rich, responsive tables.
3. INTENT DIFFERENTIATION:
   - Summary requests ("give me a summary of my leads"): Provide an executive breakdown of counts by stage, average score, and key highlights rather than an exhaustive table.
   - Top-N requests ("show me my 5 highest scoring leads"): Filter accurately by score and return exactly the top 5 records requested.
   - Comprehensive list requests ("all the leads that I have currently"): Return the complete table with all records.
4. FINANCIAL & METRIC CALCULATIONS:
   - Calculate exact financial totals and invoice sums directly from the figures in invoicesSummary.
5. CONVERSATIONAL CONTINUITY:
   - Keep previous conversation turns in mind to resolve pronouns or follow-up questions accurately.`;

        // Model candidate list: prioritize env model, with stable gemini-2.5-flash fallback
        const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const modelCandidates = Array.from(new Set([primaryModel, 'gemini-2.5-flash', 'gemini-3.6-flash']));

        // Build conversation contents (without prepending system prompt into user role)
        const conversationContents: any[] = [];
        for (const historyTurn of conversationHistory) {
          if (historyTurn.content && historyTurn.content.trim()) {
            conversationContents.push({
              role: historyTurn.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: historyTurn.content }],
            });
          }
        }
        conversationContents.push({
          role: 'user',
          parts: [{ text: query }],
        });

        for (const modelToTry of modelCandidates) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${geminiApiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: {
                    parts: [{ text: systemPrompt }],
                  },
                  contents: conversationContents,
                  generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 4096,
                  },
                }),
              }
            );

            const geminiData = await geminiRes.json();
            if (!geminiRes.ok || geminiData.error) {
              console.warn(`[RAG Chat] Model ${modelToTry} returned status ${geminiRes.status}: ${geminiData.error?.message || 'Unknown error'}`);
              continue; // Try next model candidate
            }

            const candidate = geminiData.candidates?.[0];
            const finishReason = candidate?.finishReason;
            const geminiAnswer = candidate?.content?.parts?.[0]?.text;

            if (finishReason === 'MAX_TOKENS') {
              console.warn('[RAG Chat] Warning: Gemini reached MAX_TOKENS ceiling (4096).');
            }

            if (geminiAnswer) {
              const latencyMs = Date.now() - startTime;
              console.log(`[RAG Chat] Successfully generated response with ${modelToTry} in ${latencyMs}ms (finishReason: ${finishReason}, length: ${geminiAnswer.length} chars)`);

              // Identify relevant cards to attach
              const relevantCards: any[] = [];
              if (qLower.includes('invoice') || qLower.includes('cash') || qLower.includes('money') || qLower.includes('paid')) {
                invoices.slice(0, 3).forEach((inv) => {
                  relevantCards.push({
                    title: `${inv.client} — $${Number(inv.amount).toLocaleString()}`,
                    type: 'Invoice',
                    badge: inv.status,
                    link: '/invoices',
                    meta: `ID: ${inv.number || inv.id}`,
                  });
                });
              } else if (qLower.includes('project') || qLower.includes('milestone')) {
                projects.slice(0, 3).forEach((p) => {
                  relevantCards.push({
                    title: p.title,
                    type: 'Project',
                    badge: p.status,
                    link: '/projects',
                    meta: `${p.clientName} • ${p.progress}% Complete`,
                  });
                });
              } else if (qLower.includes('lead') || qLower.includes('prospect')) {
                leads.slice(0, 3).forEach((l) => {
                  relevantCards.push({
                    title: l.companyName || `${l.firstName} ${l.lastName}`,
                    type: 'Lead',
                    badge: `Score ${l.leadScore}`,
                    link: '/leads',
                    meta: `Stage: ${l.status}`,
                  });
                });
              } else {
                relevantCards.push(
                  { title: 'Pipeline Leads', type: 'Leads', badge: `${totalLeadsCount} Records`, link: '/leads', meta: 'AI Scored' },
                  { title: 'Project Delivery', type: 'Projects', badge: `${projects.length} Active`, link: '/projects', meta: 'Milestones & Timelines' },
                  { title: 'Billing & Invoices', type: 'Invoices', badge: `$${crmContext.invoicesSummary.totalInvoiced.toLocaleString()}`, link: '/invoices', meta: 'Cashflow' }
                );
              }

              return NextResponse.json({
                success: true,
                answer: geminiAnswer,
                cards: relevantCards,
                meta: {
                  modelUsed: modelToTry,
                  totalRecords: totalLeadsCount,
                  retrievedRecords: leads.length,
                  finishReason,
                  latencyMs,
                },
              });
            }
          } catch (modelErr) {
            console.warn(`[RAG Chat] Error querying candidate model ${modelToTry}:`, modelErr);
          }
        }
      } catch (geminiErr) {
        console.error('[RAG Chat] Gemini API error, falling back to deterministic engine:', geminiErr);
      }
    }

    // 6. Intelligent Intent-Aware Deterministic Fallback
    let fallbackAnswer = `### 🧠 AgencyFlow CRM Intelligence Summary\n\n`;

    const isTopScoringQuery =
      qLower.includes('highest score') ||
      qLower.includes('highest scoring') ||
      qLower.includes('top scoring') ||
      qLower.includes('top 5') ||
      qLower.includes('5 highest') ||
      qLower.includes('best lead');

    const isSummaryQuery =
      qLower.includes('summary') ||
      qLower.includes('summarize') ||
      qLower.includes('breakdown') ||
      qLower.includes('overview') ||
      qLower.includes('tell me about my leads');

    if (isTopScoringQuery && (qLower.includes('lead') || qLower.includes('prospect') || qLower.includes('scoring'))) {
      const top5Leads = [...leads].sort((a, b) => b.leadScore - a.leadScore).slice(0, 5);
      fallbackAnswer += `Here are your **5 highest scoring leads** in the CRM database:\n\n`;
      fallbackAnswer += `| # | Company / Lead Name | Contact Name | Stage | AI Score | Email |\n`;
      fallbackAnswer += `|---|---|---|---|---|---|\n`;
      top5Leads.forEach((l, idx) => {
        fallbackAnswer += `| ${idx + 1} | ${l.companyName || 'N/A'} | ${l.firstName} ${l.lastName} | ${l.status} | ${l.leadScore} | ${l.email || 'N/A'} |\n`;
      });
      fallbackAnswer += `\n*Prioritize outreach to these leads as they represent the highest conversion probability.*`;
    } else if (isSummaryQuery && (qLower.includes('lead') || qLower.includes('prospect'))) {
      const stageCounts: Record<string, number> = {};
      let totalScore = 0;
      leads.forEach((l) => {
        stageCounts[l.status] = (stageCounts[l.status] || 0) + 1;
        totalScore += l.leadScore;
      });
      const avgScore = leads.length > 0 ? Math.round(totalScore / leads.length) : 0;

      fallbackAnswer += `Here is an executive summary of your **${totalLeadsCount} CRM leads**:\n\n`;
      fallbackAnswer += `- **Average AI Lead Score**: ${avgScore}/100\n`;
      fallbackAnswer += `- **Stage Distribution**:\n`;
      Object.entries(stageCounts).forEach(([stage, count]) => {
        const pct = Math.round((count / totalLeadsCount) * 100);
        fallbackAnswer += `  - **${stage}**: ${count} leads (${pct}%)\n`;
      });
      fallbackAnswer += `\n**Key Takeaway**: ${stageCounts['QUALIFIED'] || 0} leads are currently qualified and ready for sales engagement or demo calls.`;
    } else if (qLower.includes('lead') || qLower.includes('prospect')) {
      fallbackAnswer += `You currently have **${totalLeadsCount} leads** in your CRM database:\n\n`;
      fallbackAnswer += `| # | Company / Lead Name | Contact Name | Stage | AI Score | Email |\n`;
      fallbackAnswer += `|---|---|---|---|---|---|\n`;
      leads.forEach((l, idx) => {
        fallbackAnswer += `| ${idx + 1} | ${l.companyName || 'N/A'} | ${l.firstName} ${l.lastName} | ${l.status} | ${l.leadScore} | ${l.email || 'N/A'} |\n`;
      });
      if (totalLeadsCount > leads.length) {
        fallbackAnswer += `\n*Showing ${leads.length} of ${totalLeadsCount} total leads.*`;
      }
    } else if (qLower.includes('invoice') || qLower.includes('cash') || qLower.includes('money')) {
      fallbackAnswer += `- **Total Invoiced**: $${crmContext.invoicesSummary.totalInvoiced.toLocaleString()}\n`;
      fallbackAnswer += `- **Collected Cash**: $${crmContext.invoicesSummary.paidTotal.toLocaleString()}\n`;
      fallbackAnswer += `- **Pending Inflow**: $${crmContext.invoicesSummary.pendingTotal.toLocaleString()}\n`;
      fallbackAnswer += `- **Overdue Invoices Alert**: $${crmContext.invoicesSummary.overdueTotal.toLocaleString()}\n\n`;
      fallbackAnswer += `| # | Invoice # | Client | Amount | Status | Due Date |\n`;
      fallbackAnswer += `|---|---|---|---|---|---|\n`;
      invoices.forEach((inv, idx) => {
        fallbackAnswer += `| ${idx + 1} | ${inv.number || inv.id} | ${inv.client} | $${Number(inv.amount).toLocaleString()} | ${inv.status} | ${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'} |\n`;
      });
    } else if (qLower.includes('project')) {
      fallbackAnswer += `You currently have **${projects.length} active projects** totaling **$${projects.reduce((a, b) => a + Number(b.budget), 0).toLocaleString()}**:\n\n`;
      fallbackAnswer += `| # | Project Title | Client | Status | Progress | Budget |\n`;
      fallbackAnswer += `|---|---|---|---|---|---|\n`;
      projects.forEach((p, idx) => {
        fallbackAnswer += `| ${idx + 1} | ${p.title} | ${p.clientName} | ${p.status} | ${p.progress}% | $${Number(p.budget).toLocaleString()} |\n`;
      });
    } else {
      fallbackAnswer += `**Workspace Overview:**\n- **Leads**: ${totalLeadsCount} records\n- **Active Projects**: ${totalProjectsCount}\n- **Invoiced Volume**: $${crmContext.invoicesSummary.totalInvoiced.toLocaleString()}\n- **Tasks**: ${totalTasksCount} sprint tasks`;
    }

    return NextResponse.json({
      success: true,
      answer: fallbackAnswer,
      cards: [
        { title: 'Pipeline Leads', type: 'Leads', badge: `${totalLeadsCount} Records`, link: '/leads', meta: 'CRM Database' },
        { title: 'Active Projects', type: 'Projects', badge: `${projects.length} Active`, link: '/projects', meta: 'Delivery Roadmaps' },
      ],
      meta: {
        isFallback: true,
        totalRecords: totalLeadsCount,
        latencyMs: Date.now() - startTime,
      },
    });
  } catch (error: any) {
    console.error('[RAG Chat] Fatal API handler error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
