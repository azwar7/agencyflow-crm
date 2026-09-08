'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import {
  Sparkles,
  Send,
  RefreshCw,
  Copy,
  Check,
  Bot,
  User,
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  CreditCard,
  Layers,
  ArrowRight,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Cpu,
  ArrowDown,
  CornerDownLeft,
  Info,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  cards?: {
    title: string;
    type: string;
    badge?: string;
    link?: string;
    meta?: string;
  }[];
  actionTaken?: any;
  meta?: {
    totalRecords?: number;
    latencyMs?: number;
    finishReason?: string;
    isFallback?: boolean;
  };
}

/**
 * Format inline markdown elements (bold, italic, code, links).
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex tokenizes inline bold (**text**), inline code (`code`), and italic (*text*)
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={idx} style={{ color: '#fff', fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={idx}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            fontSize: '0.85em',
            fontFamily: 'monospace',
            color: '#38bdf8',
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={idx} style={{ fontStyle: 'italic', color: '#c4b5fd' }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

/**
 * Robust, lightweight Markdown and Table Renderer
 * Formats Markdown tables, headings, bullet lists, and paragraphs with clean styles.
 */
function MarkdownMessageRenderer({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const lines = content.split('\n');
    const result: { type: 'table' | 'heading' | 'list' | 'text'; lines: string[]; level?: number }[] = [];
    let currentTableLines: string[] = [];
    let currentListLines: string[] = [];
    let currentTextLines: string[] = [];

    const flushText = () => {
      if (currentTextLines.length > 0) {
        result.push({ type: 'text', lines: [...currentTextLines] });
        currentTextLines = [];
      }
    };
    const flushTable = () => {
      if (currentTableLines.length > 0) {
        result.push({ type: 'table', lines: [...currentTableLines] });
        currentTableLines = [];
      }
    };
    const flushList = () => {
      if (currentListLines.length > 0) {
        result.push({ type: 'list', lines: [...currentListLines] });
        currentListLines = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Table Row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushText();
        flushList();
        currentTableLines.push(trimmed);
        continue;
      } else {
        flushTable();
      }

      // 2. Heading (#, ##, ###)
      if (trimmed.startsWith('### ')) {
        flushText();
        flushList();
        result.push({ type: 'heading', lines: [trimmed.slice(4)], level: 3 });
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushText();
        flushList();
        result.push({ type: 'heading', lines: [trimmed.slice(3)], level: 2 });
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushText();
        flushList();
        result.push({ type: 'heading', lines: [trimmed.slice(2)], level: 1 });
        continue;
      }

      // 3. List Item (*, -, 1.)
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        flushText();
        currentListLines.push(trimmed);
        continue;
      } else {
        flushList();
      }

      // 4. Normal paragraph text
      currentTextLines.push(line);
    }

    flushText();
    flushTable();
    flushList();

    return result;
  }, [content]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {blocks.map((block, bi) => {
        if (block.type === 'table') {
          // Parse table rows
          const rows = block.lines
            .filter((l) => !l.includes('---')) // Filter out separator |---|---|
            .map((l) =>
              l
                .split('|')
                .map((cell) => cell.trim())
                .slice(1, -1)
            );

          if (rows.length === 0) return null;
          const headers = rows[0] || [];
          const dataRows = rows.slice(1);

          return (
            <div
              key={bi}
              style={{
                width: '100%',
                overflowX: 'auto',
                margin: '0.4rem 0',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 17, 23, 0.7)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.825rem',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr style={{ background: 'rgba(168, 85, 247, 0.12)', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    {headers.map((h, hi) => (
                      <th
                        key={hi}
                        style={{
                          padding: '0.6rem 0.85rem',
                          color: '#e2e2e8',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {renderInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        background: ri % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.12s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.07)')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = ri % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)')
                      }
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            padding: '0.5rem 0.85rem',
                            color: ci === 0 ? '#c4b5fd' : '#f1f1f5',
                            whiteSpace: 'nowrap',
                            fontWeight: ci === 0 ? 600 : 400,
                          }}
                        >
                          {renderInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'heading') {
          const text = block.lines[0] || '';
          if (block.level === 1) {
            return (
              <h2 key={bi} style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.3rem 0 0.1rem' }}>
                {renderInlineText(text)}
              </h2>
            );
          }
          if (block.level === 2) {
            return (
              <h3 key={bi} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: '0.25rem 0 0.1rem' }}>
                {renderInlineText(text)}
              </h3>
            );
          }
          return (
            <h4 key={bi} style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e5e7eb', margin: '0.2rem 0 0.05rem' }}>
              {renderInlineText(text)}
            </h4>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={bi} style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {block.lines.map((li, lidx) => {
                const cleanItem = li.replace(/^(\*|-|\d+\.)\s*/, '');
                return (
                  <li key={lidx} style={{ color: '#e2e2e8', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {renderInlineText(cleanItem)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Text Block
        const textContent = block.lines.join('\n');
        if (!textContent.trim()) return null;

        return (
          <div key={bi} style={{ fontSize: '0.89rem', lineHeight: 1.6, color: '#e2e2e8', whiteSpace: 'pre-line' }}>
            {renderInlineText(textContent)}
          </div>
        );
      })}
    </div>
  );
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content: `### 👋 Welcome to AgencyFlow AI Intelligence!

I have live RAG (Retrieval-Augmented Generation) access to your CRM workspace:
- **🎯 Leads & Sales Pipeline** (ICP scores, stages, contacts, automated outreach)
- **🚀 Active Projects & Delivery** (Milestones, SOWs, completion percentages)
- **💰 Invoices & Cashflow** (Paid collections, pending inflows, overdue accounts)
- **📋 Tasks & Sprint Matrix** (Assignees, high-priority deliverables)

You can ask me questions, request complete data tables (e.g. *"all the leads that I have currently"*), or ask me to **create tasks** directly on your board!`,
      timestamp: 'Just now',
      cards: [
        { title: 'Pipeline Leads', type: 'Leads', badge: 'Live Synced', link: '/leads', meta: 'Cold Outreach & Scoring' },
        { title: 'Active Projects', type: 'Projects', badge: 'Delivery Hub', link: '/projects', meta: 'Milestones & Timelines' },
        { title: 'Task Board', type: 'Tasks', badge: 'Sprint Matrix', link: '/tasks', meta: 'Kanban Board' },
        { title: 'Billing & Invoices', type: 'Invoices', badge: 'Cashflow', link: '/invoices', meta: 'Collections Tracker' },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Track user scroll position so we don't aggressively yank them down if reading earlier turns
  const handleContainerScroll = () => {
    const el = chatScrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsScrolledToBottom(distanceToBottom < 90);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
    setIsScrolledToBottom(true);
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Prepare multi-turn history snapshot
    const historySnapshot = messages.slice(-8).map((m) => ({
      role: m.sender,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversationHistory: historySnapshot,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const aiMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: json.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cards: json.cards || [],
          actionTaken: json.actionTaken,
          meta: json.meta,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            content: `⚠️ **CRM Intelligence Notice**: ${json.error || 'Failed to retrieve requested CRM dataset'}\n\nPlease try again or verify your connection.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ **Connection Error**: Failed to dispatch query to the AgencyFlow intelligence engine. Please check your network connection and retry.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: '🎯 All Leads (Complete Table)', query: 'all the leads that i have currently' },
    { label: '📊 Lead Summary by Stage', query: 'give me a summary of my leads' },
    { label: '⭐ Top 5 Highest Scoring Leads', query: 'show me my 5 highest scoring leads' },
    { label: '💰 Cashflow & Unpaid Invoices', query: 'How much money is pending or overdue in our invoices?' },
    { label: '🚀 Active Projects Status', query: 'List all active client projects with progress and budgets' },
    { label: '📝 Create Task: Follow up with leads', query: 'Create task: Follow up with high scoring leads this week' },
  ];

  return (
    <AppShell>
      {/* 
        Container locked to 100vh without outer page scrollbars.
        Desktop: The chat area dominates ~75-80% of screen height.
      */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          maxHeight: '100vh',
          paddingTop: '74px', // 64px header + 10px breathing room
          paddingBottom: '14px',
          paddingLeft: 'clamp(0.75rem, 2vw, 1.75rem)',
          paddingRight: 'clamp(0.75rem, 2vw, 1.75rem)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          gap: '0.65rem',
        }}
      >
        {/* Compact AI Header Bar */}
        <div
          style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.65rem 1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.35)',
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                AgencyFlow AI
              </h1>
              <p style={{ fontSize: '0.725rem', color: 'var(--on-surface-variant)', margin: 0 }}>
                Live RAG intelligence across Leads, Deals, Projects, Tasks & Invoices
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(78, 222, 163, 0.15)',
                border: '1px solid rgba(78, 222, 163, 0.3)',
                color: '#4edea3',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4edea3', boxShadow: '0 0 6px #4edea3' }} />
              Live CRM Synced
            </div>

            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '0.3rem 0.6rem',
                color: 'var(--on-surface-variant)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
              }}
              title="Reset conversation"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 180, 171, 0.12)';
                e.currentTarget.style.color = '#ffb4ab';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = 'var(--on-surface-variant)';
              }}
            >
              <Trash2 size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Quick Executive Prompts Carousel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.15rem',
            flexShrink: 0,
            scrollbarWidth: 'none',
          }}
        >
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p.query)}
              disabled={loading}
              style={{
                padding: '0.32rem 0.75rem',
                borderRadius: '9999px',
                background: 'var(--surface-container-low)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e2e2e8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-container-low)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#e2e2e8';
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Dominant Chat Messages Area */}
        <div
          style={{
            flex: 1,
            minHeight: 0, // Critical for flex child vertical expansion without overflowing parent
            position: 'relative',
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            ref={chatScrollContainerRef}
            onScroll={handleContainerScroll}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    width: '100%',
                  }}
                >
                  {!isUser && (
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                        marginTop: '2px',
                        boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: isUser ? '75%' : '94%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        background: isUser
                          ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                          : 'var(--surface-container)',
                        color: '#fff',
                        padding: isUser ? '0.75rem 1.1rem' : '1.1rem 1.35rem',
                        borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.22)',
                        wordBreak: 'break-word',
                        width: isUser ? 'auto' : '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      {isUser ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      ) : (
                        <MarkdownMessageRenderer content={msg.content} />
                      )}
                    </div>

                    {/* Interactive CRM Entity Cards (if provided) */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                          gap: '0.6rem',
                          width: '100%',
                          marginTop: '0.2rem',
                        }}
                      >
                        {msg.cards.map((card, ci) => (
                          <Link
                            key={ci}
                            href={card.link || '#'}
                            style={{
                              background: 'var(--surface-container-high)',
                              borderRadius: '8px',
                              padding: '0.65rem 0.85rem',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              textDecoration: 'none',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontWeight: 700 }}>
                                {card.type}
                              </span>
                              {card.badge && (
                                <span style={{ fontSize: '0.65rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                                  {card.badge}
                                </span>
                              )}
                            </div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                              {card.title}
                            </h4>
                            {card.meta && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                                {card.meta}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Metadata, Timestamp, and Copy Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.7rem', color: 'var(--on-surface-variant)', padding: '0 4px' }}>
                      <span>{msg.timestamp}</span>
                      {msg.meta?.latencyMs && (
                        <span>• {Math.round(msg.meta.latencyMs / 100) / 10}s</span>
                      )}
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          {copiedId === msg.id ? <Check size={11} color="#4edea3" /> : <Copy size={11} />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <Bot size={16} />
                </div>
                <div
                  style={{
                    background: 'var(--surface-container)',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    color: 'var(--on-surface-variant)',
                    fontSize: '0.85rem',
                  }}
                >
                  <RefreshCw size={15} className="animate-spin" color="#38bdf8" />
                  Querying live CRM records & generating complete analysis...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating 'Scroll to Bottom' indicator if user scrolled up */}
          {!isScrolledToBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '24px',
                background: 'rgba(30, 32, 40, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '0.4rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                zIndex: 10,
              }}
            >
              <ArrowDown size={13} color="#38bdf8" />
              Scroll to latest
            </button>
          )}
        </div>

        {/* Pinned Message Composer Bar */}
        <div
          style={{
            background: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.55rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about Leads, Invoices, Projects, Cashflow, or type 'Create task: ...'"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              padding: '0.35rem 0.5rem',
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || loading}
            style={{
              background: inputQuery.trim() && !loading ? 'linear-gradient(135deg, #a855f7, #38bdf8)' : 'var(--surface-container-high)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1.05rem',
              color: inputQuery.trim() && !loading ? '#fff' : 'var(--outline)',
              cursor: inputQuery.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.825rem',
              transition: 'all 0.15s ease',
              boxShadow: inputQuery.trim() && !loading ? '0 0 15px rgba(168, 85, 247, 0.3)' : 'none',
            }}
          >
            <Send size={14} /> Send
          </button>
        </div>
      </div>
    </AppShell>
  );
}
