'use client';

import React, { useState } from 'react';
import { Sparkles, Trash2, ArrowRight, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function SampleDataBanner({ onDismissChange }: { onDismissChange?: (dismissed: boolean) => void }) {
  const { isSampleData, clearSampleData } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isSampleData || dismissed) return null;

  const handleClear = async () => {
    setClearing(true);
    const ok = await clearSampleData();
    setClearing(false);
    if (ok) {
      onDismissChange?.(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismissChange?.(true);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.10) 100%)',
        backgroundColor: '#10141d',
        borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '0.45rem 1.5rem',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxSizing: 'border-box',
        width: '100%',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.825rem', color: 'var(--on-surface)' }}>
        <div
          style={{
            padding: '0.2rem 0.55rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontWeight: 800,
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Sparkles size={11} />
          Demo Mode
        </div>
        <span>
          You&apos;re viewing <strong style={{ color: '#fff' }}>sample demonstration data</strong>. Feel free to explore how deals, deliverables, and invoices work.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={handleClear}
          disabled={clearing}
          style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '0.375rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            fontSize: '0.775rem',
            fontWeight: 700,
            cursor: clearing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.15s ease',
            opacity: clearing ? 0.6 : 1,
          }}
          title="Delete all sample records and restore workspace to clean empty state"
        >
          <Trash2 size={12} />
          {clearing ? 'Clearing Demo Data...' : 'Clear Sample Data'}
        </button>

        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--on-surface-variant)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '0.25rem',
            borderRadius: '4px',
          }}
          title="Dismiss banner"
          aria-label="Dismiss demo banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
