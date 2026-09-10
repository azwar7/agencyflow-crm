'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LeadFinderProvider } from '@/context/LeadFinderContext';
import { LeadFinderStatusWidget } from './LeadFinderStatusWidget';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NewLeadModal } from './NewLeadModal';
import { NewDealModal } from './NewDealModal';
import { SampleDataBanner } from './SampleDataBanner';
import { OnboardingModal } from './OnboardingModal';
import { ProductTour } from './ProductTour';
import { GettingStartedWidget } from './GettingStartedWidget';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isSampleData } = useAuth();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalTab, setLeadModalTab] = useState<'manual' | 'n8n'>('manual');
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeRole, setActiveRole] = useState('OWNER');
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  useEffect(() => {
    if (isSampleData) {
      setIsBannerDismissed(false);
    }
  }, [isSampleData]);

  const showBanner = isSampleData && !isBannerDismissed;

  const handleModalSuccess = () => {
    // Dispatch custom event to trigger page refresh on active view
    window.dispatchEvent(new Event('agencyflow-refresh'));
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const handleOpenLeadModal = () => {
      setLeadModalTab('manual');
      setIsLeadModalOpen(true);
    };

    const handleOpenLeadFinder = () => {
      setLeadModalTab('n8n');
      setIsLeadModalOpen(true);
    };

    const handleOpenDealModal = () => setIsDealModalOpen(true);
    const handleStartTour = () => setIsTourOpen(true);

    const applyAppearance = (detail: any) => {
      if (typeof document === 'undefined') return;
      if (detail.theme) document.documentElement.setAttribute('data-theme', detail.theme);
      if (detail.density) document.documentElement.setAttribute('data-density', detail.density);
      if (detail.reducedMotion !== undefined)
        document.documentElement.setAttribute('data-reduced-motion', String(detail.reducedMotion));
      if (detail.textSize) document.documentElement.setAttribute('data-text-size', detail.textSize);
      if (detail.highContrast !== undefined)
        document.documentElement.setAttribute('data-high-contrast', String(detail.highContrast));
    };

    const handleAppearanceUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) applyAppearance(customEvent.detail);
    };

    window.addEventListener('agencyflow-open-new-lead', handleOpenLeadModal);
    window.addEventListener('agencyflow-open-lead-finder', handleOpenLeadFinder);
    window.addEventListener('agencyflow-open-new-deal', handleOpenDealModal);
    window.addEventListener('agencyflow-start-tour', handleStartTour);
    window.addEventListener('agencyflow-appearance-updated', handleAppearanceUpdated);

    // Initial appearance fetch
    if (isAuthenticated) {
      fetch('/api/v1/settings/appearance')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) applyAppearance(json.data);
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('agencyflow-open-new-lead', handleOpenLeadModal);
      window.removeEventListener('agencyflow-open-lead-finder', handleOpenLeadFinder);
      window.removeEventListener('agencyflow-open-new-deal', handleOpenDealModal);
      window.removeEventListener('agencyflow-start-tour', handleStartTour);
      window.removeEventListener('agencyflow-appearance-updated', handleAppearanceUpdated);
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="app-layout" style={{ minHeight: '100vh', background: '#0f1117' }}>
        {/* Skeleton Sidebar */}
        <aside
          style={{
            width: '240px',
            height: '100vh',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'var(--surface-container-lowest, #0a0e18)',
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
          }}
        >
          {/* Brand Logo Placeholder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="skeleton-pulse" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
            <div className="skeleton-pulse" style={{ width: '100px', height: '18px', borderRadius: '4px' }} />
          </div>

          {/* Navigation Items Skeletons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="skeleton-pulse"
                style={{
                  height: '38px',
                  borderRadius: '8px',
                  opacity: 1 - i * 0.08,
                }}
              />
            ))}
          </div>

          {/* User Profile Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="skeleton-pulse" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <div className="skeleton-pulse" style={{ width: '80%', height: '12px' }} />
              <div className="skeleton-pulse" style={{ width: '50%', height: '10px' }} />
            </div>
          </div>
        </aside>

        {/* Skeleton Main View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top Nav Header Skeleton */}
          <div
            style={{
              height: '64px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 28px',
              background: 'rgba(15, 17, 23, 0.8)',
            }}
          >
            <div className="skeleton-pulse" style={{ width: '280px', height: '36px', borderRadius: '8px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="skeleton-pulse" style={{ width: '110px', height: '34px', borderRadius: '6px' }} />
              <div className="skeleton-pulse" style={{ width: '34px', height: '34px', borderRadius: '50%' }} />
            </div>
          </div>

          {/* Page Canvas Skeletons */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Greeting Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-pulse" style={{ width: '240px', height: '28px', borderRadius: '6px' }} />
              <div className="skeleton-pulse" style={{ width: '180px', height: '14px', borderRadius: '4px' }} />
            </div>

            {/* KPI Cards Skeletons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-pulse" style={{ height: '110px', borderRadius: '12px' }} />
              ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="skeleton-pulse" style={{ height: '340px', borderRadius: '14px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f1117', color: 'var(--on-surface)' }}>
        <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Authenticating workspace...</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div
        className="app-main"
        style={{ '--app-header-height': showBanner ? '104px' : '64px' } as React.CSSProperties}
      >
        <div className="app-top-nav">
          <SampleDataBanner onDismissChange={setIsBannerDismissed} />
          <Header
            onOpenNewLead={() => {
              setLeadModalTab('manual');
              setIsLeadModalOpen(true);
            }}
            onOpenNewDeal={() => setIsDealModalOpen(true)}
            activeRole={activeRole}
            onRoleChange={setActiveRole}
          />
        </div>
        <main className="page-container">{children}</main>
      </div>

      <NewLeadModal
        isOpen={isLeadModalOpen}
        initialTab={leadModalTab}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <NewDealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <OnboardingModal onStartTour={() => setIsTourOpen(true)} />
      <ProductTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
      <GettingStartedWidget />

      {/* Global Persistent Floating AI Lead Finder Background Activity Widget */}
      <LeadFinderStatusWidget />
    </div>
  );
}
