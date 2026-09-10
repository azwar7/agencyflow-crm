'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AgencyFlowLogo from '@/components/AgencyFlowLogo';
import { ArrowLeft, Mail, Shield, MessageSquare, CheckCircle, Send, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agencyName: '',
    topic: 'legal',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instantaneous client-side submission with feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

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
          <span style={{ color: '#d0bcff', fontSize: '14px', fontWeight: 600 }}>Contact & Support</span>
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

      {/* Main Container */}
      <main style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '1100px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '9999px',
              background: 'rgba(208, 188, 255, 0.12)',
              border: '1px solid rgba(208, 188, 255, 0.25)',
              color: '#d0bcff',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '16px',
            }}
          >
            <Mail size={13} />
            Direct Support & Inquiries
          </div>
          <h1 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 'clamp(34px, 4vw, 46px)', fontWeight: 800, color: '#f1f1f6', margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
            Get in touch with AgencyFlow
          </h1>
          <p style={{ color: '#9da0b5', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Whether you have a legal inquiry, need a Data Processing Agreement, or have technical questions about the platform, our dedicated team is here to assist.
          </p>
        </div>

        {/* 2-Column Layout: Direct Inboxes vs Interactive Contact Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', alignItems: 'start' }}>
          {/* Direct Communication Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(26, 28, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d0bcff', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                <Shield size={18} /> Legal & Privacy Compliance
              </div>
              <p style={{ fontSize: '14px', color: '#9da0b5', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                For GDPR/CCPA data requests, Data Processing Agreements (DPAs), and contract queries:
              </p>
              <a href="mailto:privacy@agencyflow.com" style={{ color: '#5eead4', textDecoration: 'none', fontWeight: 600, fontSize: '14.5px' }}>
                privacy@agencyflow.com
              </a>
              <div style={{ fontSize: '12px', color: '#73758c', marginTop: '4px' }}>SLA: Responded to within 1 business day</div>
            </div>

            <div style={{ background: 'rgba(26, 28, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                <MessageSquare size={18} /> Customer & Technical Support
              </div>
              <p style={{ fontSize: '14px', color: '#9da0b5', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                For workspace administration, billing inquiries, and troubleshooting:
              </p>
              <a href="mailto:support@agencyflow.com" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600, fontSize: '14.5px' }}>
                support@agencyflow.com
              </a>
            </div>

            <div style={{ background: 'rgba(26, 28, 35, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f472b6', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                <Mail size={18} /> Enterprise & Security
              </div>
              <p style={{ fontSize: '14px', color: '#9da0b5', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Custom multi-workspace plans, SOC reports, and vulnerability submissions:
              </p>
              <a href="mailto:security@agencyflow.com" style={{ color: '#f472b6', textDecoration: 'none', fontWeight: 600, fontSize: '14.5px' }}>
                security@agencyflow.com
              </a>
            </div>

            <div style={{ padding: '16px 20px', fontSize: '13px', color: '#73758c', borderLeft: '2px solid #a78bfa' }}>
              <strong>Corporate Headquarters:</strong><br />
              AgencyFlow Inc.<br />
              100 Innovation Way, Suite 400<br />
              San Francisco, CA 94105, United States
            </div>
          </div>

          {/* Interactive Direct Message Form */}
          <div
            style={{
              background: 'rgba(26, 28, 35, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '32px',
              boxSizing: 'border-box',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f1f6', margin: '0 0 8px 0' }}>Message Dispatched</h3>
                <p style={{ color: '#9da0b5', fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                  Thank you for reaching out. A confirmation has been logged and our legal/support team will respond to <strong>{formData.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', agencyName: '', topic: 'legal', message: '' });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#e2e2e8',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                  }}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f1f6', margin: '0 0 4px 0' }}>
                  Send an Inquiry
                </h2>
                <p style={{ fontSize: '13.5px', color: '#9da0b5', margin: 0 }}>
                  Fill out the form below to connect directly with the appropriate department.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbc3d7', marginBottom: '6px' }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(17, 19, 24, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#f1f1f6',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="legal">Legal, Terms & Privacy Inquiries</option>
                    <option value="dpa">Data Processing Agreement (DPA) Request</option>
                    <option value="security">Security Vulnerability / Trust Report</option>
                    <option value="support">Customer & Workspace Support</option>
                    <option value="enterprise">Enterprise Sales & Custom Contracts</option>
                    <option value="careers">Careers & Freelance Opportunities</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbc3d7', marginBottom: '6px' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(17, 19, 24, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '6px',
                        color: '#f1f1f6',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbc3d7', marginBottom: '6px' }}>
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@agency.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(17, 19, 24, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '6px',
                        color: '#f1f1f6',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbc3d7', marginBottom: '6px' }}>
                    Agency or Organization Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Digital Studio"
                    value={formData.agencyName}
                    onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(17, 19, 24, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#f1f1f6',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#cbc3d7', marginBottom: '6px' }}>
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry, requested agreement, or question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(17, 19, 24, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '6px',
                      color: '#f1f1f6',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: '#d0bcff',
                    color: '#23005c',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '6px',
                    boxShadow: '0 0 20px rgba(208, 188, 255, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Send size={15} />
                  {isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0d0f13',
          padding: '32px 24px',
          boxSizing: 'border-box',
          textAlign: 'center',
          fontSize: '13px',
          color: '#73758c',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>© {new Date().getFullYear()} AgencyFlow Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: '#cbc3d7', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#cbc3d7', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/security" style={{ color: '#cbc3d7', textDecoration: 'none' }}>Security Whitepaper</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
