'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/AppShell';
import {
  TrendingUp,
  FolderKanban,
  Receipt,
  UserPlus,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  DollarSign,
  Zap,
} from 'lucide-react';
import { getCachedData, setCachedData, prefetchUrl } from '@/lib/client-cache';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const cached = getCachedData<any>('/api/v1/dashboard');
  const [data, setData] = useState<any>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/v1/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setCachedData('/api/v1/dashboard', json.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch dashboard:', err);
      if (!data) setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // High-probability prefetching: prefetch Leads and Pipeline during idle moments
    prefetchUrl('/api/v1/leads');
    prefetchUrl('/api/v1/deals');

    const handleRefresh = () => fetchDashboard();
    window.addEventListener('agencyflow-refresh', handleRefresh);
    return () => window.removeEventListener('agencyflow-refresh', handleRefresh);
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (updatingTaskId === taskId) return;
    setUpdatingTaskId(taskId);

    const nextStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';

    setData((prev: any) => {
      if (!prev || !prev.urgentTasks) return prev;
      return {
        ...prev,
        urgentTasks: prev.urgentTasks.filter((t: any) => t.id !== taskId),
      };
    });

    try {
      await fetch('/api/v1/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: nextStatus }),
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
      fetchDashboard();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const metrics = data?.metrics || {
    totalPipelineValue: 0,
    activeDealsCount: 0,
    activeProjectsCount: 0,
    projectsDueThisWeek: 0,
    outstandingInvoicesAmount: 0,
    awaitingInvoicesCount: 0,
    monthlyRevenue: 0,
    winRate: 0,
    totalLeads: 0,
    closedWonCount: 0,
  };

  const pipeline = data?.pipeline || {
    newLeads: [],
    qualifiedLeads: [],
    proposalDeals: [],
    negotiationDeals: [],
    closedWonCount: 0,
  };

  const urgentTasksList = data?.urgentTasks || [];
  const projectsList = data?.projects || [];
  const recentActivitiesList = data?.recentActivities || [];

  return (
    <AppShell>
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
        {/* Glow Orb Background */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '25%',
            width: '500px',
            height: '500px',
            background: 'rgba(56, 189, 248, 0.04)',
            borderRadius: '50%',
            filter: 'blur(100px)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        {/* 1. Welcome Header & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--on-surface)', margin: 0, letterSpacing: '-0.02em' }}>
              Good morning, {user?.name ? user.name.split(' ')[0] : 'there'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', margin: '0.25rem 0 0 0' }}>
              Here is your live workspace command center.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/projects')} className="btn btn-secondary">
              + New Project
            </button>

            <button onClick={() => router.push('/proposals')} className="btn btn-secondary">
              Create Proposal
            </button>

            <button
              onClick={() => router.push('/leads')}
              className="btn btn-primary"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>add</span>
              New Lead
            </button>
          </div>
        </div>

        {/* 2. Real KPI Summary Cards (Level 2 Floating Glassmorphism Interaction) */}
        {loading ? (
          <div className="kpi-grid">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="kpi-card skeleton-pulse"
                style={{
                  height: '95px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton-bone" style={{ width: '75px', height: '11px' }} />
                  <div className="skeleton-bone" style={{ width: '36px', height: '16px', borderRadius: '4px' }} />
                </div>
                <div className="skeleton-bone" style={{ width: '110px', height: '26px', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="kpi-grid">
            {/* Card 1: Pipeline Value */}
            <div
              className="kpi-card"
              onClick={() => router.push('/pipeline')}
              title="View Pipeline"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  PIPELINE VALUE
                </span>
                <span className="badge-pill badge-pill-cyan">
                  {metrics.activeDealsCount} Deals
                </span>
              </div>
              <div className="kpi-metric">${Number(metrics.totalPipelineValue || 0).toLocaleString()}</div>
            </div>

            {/* Card 2: Active Projects */}
            <div
              className="kpi-card"
              onClick={() => router.push('/projects')}
              title="View Projects"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  ACTIVE PROJECTS
                </span>
                <span className={`badge-pill ${metrics.projectsDueThisWeek > 0 ? 'badge-pill-amber' : 'badge-pill-teal'}`}>
                  {metrics.projectsDueThisWeek > 0 ? `${metrics.projectsDueThisWeek} Due Soon` : 'On Track'}
                </span>
              </div>
              <div className="kpi-metric">{metrics.activeProjectsCount}</div>
            </div>

            {/* Card 3: Outstanding Invoices */}
            <div
              className="kpi-card"
              onClick={() => router.push('/invoices')}
              title="View Invoices"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  OUTSTANDING
                </span>
                <span className="badge-pill badge-pill-coral">
                  {metrics.awaitingInvoicesCount} Awaiting
                </span>
              </div>
              <div className="kpi-metric" style={{ color: metrics.outstandingInvoicesAmount > 0 ? '#ffb4ab' : '#fff' }}>
                ${Number(metrics.outstandingInvoicesAmount || 0).toLocaleString()}
              </div>
            </div>

            {/* Card 4: Monthly Revenue */}
            <div
              className="kpi-card"
              onClick={() => router.push('/invoices')}
              title="View Billing"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  COLLECTED REV
                </span>
                <span className="badge-pill badge-pill-teal">
                  Paid
                </span>
              </div>
              <div className="kpi-metric" style={{ color: '#4edea3' }}>
                ${Number(metrics.monthlyRevenue || 0).toLocaleString()}
              </div>
            </div>

            {/* Card 5: Conversion Win Rate */}
            <div
              className="kpi-card"
              onClick={() => router.push('/pipeline')}
              title="View Conversion"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  WIN RATE
                </span>
                <span className="badge-pill badge-pill-purple">
                  {metrics.closedWonCount} Won
                </span>
              </div>
              <div className="kpi-metric">{metrics.winRate}%</div>
            </div>
          </div>
        )}

        {/* 3. Real Active Pipeline Overview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
              Active Pipeline
            </h2>
            <button
              onClick={() => router.push('/pipeline')}
              style={{ fontSize: '12px', color: '#d0bcff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              View Full Pipeline →
            </button>
          </div>

          {loading ? (
            <div className="kanban-row" style={{ minHeight: '140px' }}>
              {[1, 2, 3, 4].map((col) => (
                <div
                  key={col}
                  className="kanban-col skeleton-pulse"
                  style={{
                    height: '140px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="skeleton-bone" style={{ width: '70px', height: '12px' }} />
                    <div className="skeleton-bone" style={{ width: '24px', height: '14px', borderRadius: '9999px' }} />
                  </div>
                  <div className="skeleton-bone" style={{ width: '100%', height: '55px', borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="kanban-row" style={{ minHeight: '140px' }}>
            {/* Col 1: New Leads */}
            <div className="kanban-col hover-level-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.4rem' }}>
                <span>New Leads</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)' }}>
                  {pipeline.newLeads.length}
                </span>
              </div>

              {pipeline.newLeads.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
                  No new leads
                </div>
              ) : (
                pipeline.newLeads.slice(0, 2).map((lead: any) => (
                  <div
                    key={lead.id}
                    className="kanban-card hover-level-2"
                    onClick={() => router.push('/leads')}
                    style={{ cursor: 'pointer', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                        {(lead.companyName || lead.firstName || 'L')[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                        {lead.companyName || `${lead.firstName} ${lead.lastName}`}
                      </span>
                    </div>
                    <span className="badge-pill badge-pill-teal" style={{ fontSize: '10px' }}>
                      Score: {lead.leadScore || 70}/100
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Col 2: Qualified */}
            <div className="kanban-col hover-level-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.4rem' }}>
                <span>Qualified</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)' }}>
                  {pipeline.qualifiedLeads.length}
                </span>
              </div>

              {pipeline.qualifiedLeads.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
                  No qualified leads
                </div>
              ) : (
                pipeline.qualifiedLeads.slice(0, 2).map((lead: any) => (
                  <div
                    key={lead.id}
                    className="kanban-card hover-level-2"
                    onClick={() => router.push('/leads')}
                    style={{ cursor: 'pointer', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(78, 222, 163, 0.2)', color: '#4edea3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                        {(lead.companyName || lead.firstName || 'Q')[0].toUpperCase()}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                        {lead.companyName || `${lead.firstName} ${lead.lastName}`}
                      </span>
                    </div>
                    <span className="badge-pill badge-pill-cyan" style={{ fontSize: '10px' }}>
                      Ready for Proposal
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Col 3: Proposal Stage */}
            <div className="kanban-col hover-level-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.4rem' }}>
                <span>Proposal Sent</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)' }}>
                  {pipeline.proposalDeals.length}
                </span>
              </div>

              {pipeline.proposalDeals.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
                  No active proposals
                </div>
              ) : (
                pipeline.proposalDeals.slice(0, 2).map((deal: any) => (
                  <div
                    key={deal.id}
                    className="kanban-card hover-level-2"
                    onClick={() => router.push('/pipeline')}
                    style={{ cursor: 'pointer', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px' }}
                  >
                    <strong style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>{deal.title}</strong>
                    <span className="badge-pill badge-pill-cyan" style={{ fontSize: '10px' }}>
                      ${Number(deal.value || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Col 4: Negotiation */}
            <div className="kanban-col hover-level-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.4rem' }}>
                <span>Negotiation</span>
                <span className="badge-pill" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--on-surface-variant)' }}>
                  {pipeline.negotiationDeals.length}
                </span>
              </div>

              {pipeline.negotiationDeals.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
                  No deals in negotiation
                </div>
              ) : (
                pipeline.negotiationDeals.slice(0, 2).map((deal: any) => (
                  <div
                    key={deal.id}
                    className="kanban-card hover-level-2"
                    onClick={() => router.push('/pipeline')}
                    style={{ cursor: 'pointer', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '8px' }}
                  >
                    <strong style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '0.25rem' }}>{deal.title}</strong>
                    <span className="badge-pill badge-pill-amber" style={{ fontSize: '10px' }}>
                      ${Number(deal.value || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Col 5: Closed Won */}
            <div
              className="kanban-col hover-level-3"
              onClick={() => router.push('/pipeline')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'rgba(78, 222, 163, 0.04)',
                border: '1px solid rgba(78, 222, 163, 0.15)',
                borderRadius: '12px',
              }}
              title="View Closed Deals in Pipeline"
            >
              <CheckCircle2 size={24} color="#4edea3" />
              <span style={{ fontSize: '12px', color: '#4edea3', textAlign: 'center', marginTop: '0.35rem', fontWeight: 700 }}>
                {metrics.closedWonCount} deals closed
              </span>
            </div>
          </div>
          )}
        </div>

        {/* 4. Middle Grid: Urgent Tasks & Real Recent Projects */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            <div className="glass-card skeleton-pulse" style={{ height: '260px', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-bone" style={{ width: '130px', height: '16px' }} />
                <div className="skeleton-bone" style={{ width: '90px', height: '12px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-bone" style={{ height: '42px', borderRadius: '8px' }} />
                ))}
              </div>
            </div>

            <div className="glass-card skeleton-pulse" style={{ height: '260px', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-bone" style={{ width: '130px', height: '16px' }} />
                <div className="skeleton-bone" style={{ width: '90px', height: '12px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-bone" style={{ height: '42px', borderRadius: '8px' }} />
                ))}
              </div>
            </div>
          </div>
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {/* Urgent Tasks */}
          <div className="glass-card hover-level-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
                Urgent Tasks ({urgentTasksList.length})
              </h3>
              <button
                onClick={() => router.push('/tasks')}
                style={{ fontSize: '12px', color: '#d0bcff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View Sprint Board →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {urgentTasksList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 0.75rem 0' }}>No pending tasks in this workspace.</p>
                  <button onClick={() => router.push('/tasks')} className="btn btn-primary" style={{ height: '32px', fontSize: '0.75rem', padding: '0 12px' }}>
                    + Create First Task
                  </button>
                </div>
              ) : (
                urgentTasksList.map((task: any) => (
                  <div
                    key={task.id}
                    className="hover-level-2"
                    onClick={() => router.push('/tasks')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(task.id, task.status);
                      }}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </p>
                    </div>
                    <span className={`badge-pill ${task.priority === 'HIGH' ? 'badge-pill-coral' : task.priority === 'LOW' ? 'badge-pill-teal' : 'badge-pill-cyan'}`}>
                      {task.priority || 'MEDIUM'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Real Recent Projects Table */}
          <div className="glass-card hover-level-3" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--on-surface)', margin: 0 }}>
                Recent Projects ({projectsList.length})
              </h3>
              <button
                onClick={() => router.push('/projects')}
                style={{ fontSize: '12px', color: '#d0bcff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View Roadmaps →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {projectsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--on-surface-variant)', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 0.75rem 0' }}>No active projects recorded yet.</p>
                  <button onClick={() => router.push('/projects')} className="btn btn-primary" style={{ height: '32px', fontSize: '0.75rem', padding: '0 12px' }}>
                    + Create First Project
                  </button>
                </div>
              ) : (
                projectsList.map((p: any) => (
                  <div
                    key={p.id}
                    className="hover-level-2"
                    onClick={() => router.push('/projects')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>{p.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{p.clientName}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>{p.progress || 0}%</span>
                      <span className={`badge-pill ${p.status === 'ON TRACK' ? 'badge-pill-teal' : p.status === 'AT RISK' ? 'badge-pill-coral' : 'badge-pill-amber'}`}>
                        {p.status || 'ON TRACK'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </AppShell>
  );
}
