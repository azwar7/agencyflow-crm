'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroPipelineFlowProps {
  isAuthenticated?: boolean;
}

interface PipelineStep {
  icon: string;
  label: string;
  sub: string;
  active?: boolean;
}

export default function HeroPipelineFlow({ isAuthenticated = false }: HeroPipelineFlowProps) {
  const steps: PipelineStep[] = [
    { icon: '◇', label: 'Lead', sub: 'captured' },
    { icon: '▤', label: 'Proposal', sub: 'sent → viewed', active: true },
    { icon: '✓', label: 'Client', sub: 'signed' },
    { icon: '▦', label: 'Project', sub: 'kicked off' },
    { icon: '$', label: 'Invoice', sub: 'paid' },
  ];

  return (
    <div className="hero-pipeline-container">
      <div className="hero-pipeline-grid">
        {/* Left Column: Headline & Actions */}
        <div className="hero-pipeline-text">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(208, 188, 255, 0.1)',
              border: '1px solid rgba(208, 188, 255, 0.25)',
              color: '#d0bcff',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={13} />
            Unified Agency Operating System
          </div>

          <h1>Watch a lead become revenue.</h1>

          <p>
            This is the actual path a deal takes through AgencyFlow — no step
            skipped, nothing falling through a gap between tools.
          </p>

          <div className="hero-pipeline-actions">
            <Link
              href={isAuthenticated ? '/dashboard' : '/signup'}
              className="hero-btn-primary"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Start free'}
              <ArrowRight size={16} />
            </Link>
            <a href="#features" className="hero-btn-secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 5-Step Pipeline Flow */}
        <div className="hero-flow-list">
          {steps.map((step, i) => (
            <div key={step.label}>
              <div className={`hero-flow-node ${step.active ? 'active' : ''}`}>
                <div className="hero-node-icon">{step.icon}</div>
                <div>
                  <div className="hero-node-label">{step.label}</div>
                  <div className="hero-node-sub">{step.sub}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`hero-flow-connector ${i < 1 ? 'on' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Readout Metrics Strip */}
      <div className="hero-pipeline-readout">
        <div>
          <div className="readout-val teal">18 days</div>
          <div className="readout-lbl">LEAD → SIGNED</div>
        </div>
        <div>
          <div className="readout-val">50%</div>
          <div className="readout-lbl">CLOSE RATE</div>
        </div>
        <div>
          <div className="readout-val purple">$173,500</div>
          <div className="readout-lbl">IN PIPELINE NOW</div>
        </div>
        <div>
          <div className="readout-val">0</div>
          <div className="readout-lbl">TOOLS SWITCHED</div>
        </div>
      </div>
    </div>
  );
}
