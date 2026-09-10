'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AgencyFlowLogo from '@/components/AgencyFlowLogo';
import { ArrowLeft, Shield, FileText, Lock, Mail } from 'lucide-react';

interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  badgeText?: string;
  icon?: React.ReactNode;
  sections: LegalSection[];
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  badgeText = 'Legal & Compliance',
  icon,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div style={{ minHeight: '100vh', background: '#111318', color: '#e2e2e8', fontFamily: "'Inter', sans-serif" }}>
      {/* Top Fixed Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '68px',
          zIndex: 100,
          background: 'rgba(17, 19, 24, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <AgencyFlowLogo height={32} fontSize={17} href="/" />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>/</span>
          <span style={{ color: '#d0bcff', fontSize: '14px', fontWeight: 600 }}>{badgeText}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbc3d7',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '7px 16px',
              background: '#d0bcff',
              color: '#23005c',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Document Header Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(208, 188, 255, 0.06) 0%, rgba(17, 19, 24, 0) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '36px 32px',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '400px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(208, 188, 255, 0.12) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(208, 188, 255, 0.12)', border: '1px solid rgba(208, 188, 255, 0.25)', color: '#d0bcff', fontSize: '12px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {icon || <Shield size={14} />}
            {badgeText}
          </div>

          <h1 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(32px, 3.5vw, 44px)', fontWeight: 800, color: '#f1f1f6', margin: '0 0 12px 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {title}
          </h1>

          <p style={{ color: '#9da0b5', fontSize: '16px', maxWidth: '780px', margin: '0 0 18px 0', lineHeight: 1.6 }}>
            {subtitle}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#73758c' }}>
            <span>Last Updated: <strong style={{ color: '#e2e2e8' }}>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Applicable to all AgencyFlow Workspace Tenancies</span>
          </div>
        </div>

        {/* 2-Column Grid: Sticky Table of Contents + Legal Document Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '48px', alignItems: 'start' }}>
          {/* Left Column: Sticky Table of Contents */}
          <aside
            style={{
              position: 'sticky',
              top: '88px',
              background: 'rgba(26, 28, 35, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px 16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#73758c', marginBottom: '8px', paddingLeft: '8px' }}>
              On this page
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sections.map((sec, idx) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      textDecoration: 'none',
                      color: isActive ? '#d0bcff' : '#9da0b5',
                      background: isActive ? 'rgba(208, 188, 255, 0.1)' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s ease',
                      lineHeight: 1.3,
                    }}
                  >
                    <span style={{ fontSize: '11px', color: isActive ? '#d0bcff' : '#565869', width: '18px' }}>
                      {idx + 1}.
                    </span>
                    <span>{sec.title}</span>
                  </a>
                );
              })}
            </nav>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: '#73758c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related Documents</div>
              <Link href="/privacy" style={{ fontSize: '12.5px', color: '#cbc3d7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={12} color="#a78bfa" /> Privacy Policy
              </Link>
              <Link href="/terms" style={{ fontSize: '12.5px', color: '#cbc3d7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={12} color="#60a5fa" /> Terms of Service
              </Link>
              <Link href="/security" style={{ fontSize: '12.5px', color: '#cbc3d7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} color="#2dd4bf" /> Security Architecture
              </Link>
              <Link href="/contact" style={{ fontSize: '12.5px', color: '#cbc3d7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} color="#f472b6" /> Contact Legal & Support
              </Link>
            </div>
          </aside>

          {/* Right Column: Legal Text Content */}
          <article
            style={{
              background: 'rgba(26, 28, 35, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '36px 40px',
              lineHeight: 1.7,
              fontSize: '15px',
              color: '#cbc3d7',
            }}
          >
            {children}
          </article>
        </div>
      </main>

      {/* Global Clean Legal Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0d0f13',
          padding: '40px 24px 32px 24px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <AgencyFlowLogo height={28} fontSize={15} href="/" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <Link href="/privacy" style={{ color: '#cbc3d7', textDecoration: 'none', fontSize: '13.5px' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: '#cbc3d7', textDecoration: 'none', fontSize: '13.5px' }}>Terms of Service</Link>
              <Link href="/security" style={{ color: '#cbc3d7', textDecoration: 'none', fontSize: '13.5px' }}>Security Whitepaper</Link>
              <Link href="/contact" style={{ color: '#cbc3d7', textDecoration: 'none', fontSize: '13.5px' }}>Contact Support</Link>
              <Link href="/dashboard" style={{ color: '#d0bcff', textDecoration: 'none', fontSize: '13.5px', fontWeight: 600 }}>Agency Dashboard</Link>
            </div>
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#73758c' }}>
            <div>© {new Date().getFullYear()} AgencyFlow Inc. All rights reserved. Registered SaaS Data Controller & Processor.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>GDPR Compliant</span>
              <span>•</span>
              <span>CCPA Ready</span>
              <span>•</span>
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
