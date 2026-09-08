/**
 * Wraps dedicated document HTML in a standalone, printable page with a sleek toolbar
 * and automatic print dialog support for environments where serverless Chromium is unavailable.
 */
export function wrapInPrintableHtml(title: string, bodyHtml: string, autoPrint = false): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
    }

    @media screen {
      body {
        background: #0f172a;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 80px 20px 60px;
      }

      .screen-toolbar {
        position: fixed;
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px 16px;
        border-radius: 9999px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      }

      .screen-toolbar-title {
        color: #e2e8f0;
        font-size: 13px;
        font-weight: 600;
        padding-right: 8px;
        border-right: 1px solid rgba(255, 255, 255, 0.15);
      }

      .btn-print {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #8b5cf6;
        color: #ffffff;
        border: none;
        padding: 8px 18px;
        border-radius: 9999px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);
      }

      .btn-print:hover {
        background: #7c3aed;
        transform: translateY(-1px);
      }

      .btn-close {
        background: rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        border: none;
        padding: 8px 14px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .btn-close:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      .document-paper-wrapper {
        width: 100%;
        max-width: 210mm;
        background: #ffffff;
        border-radius: 4px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
      }
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 0 !important;
      }

      html, body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .no-print {
        display: none !important;
      }

      .document-paper-wrapper {
        box-shadow: none !important;
        border-radius: 0 !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
      }
    }
  </style>
  ${
    autoPrint
      ? `
  <script>
    window.addEventListener('load', function() {
      // Small timeout to guarantee fonts and styles are completely painted
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
  `
      : ''
  }
</head>
<body>
  <div class="screen-toolbar no-print">
    <div class="screen-toolbar-title">${title}</div>
    <button class="btn-print" onclick="window.print()">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print / Save as PDF
    </button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
    <span style="color: #94a3b8; font-size: 11px; margin-left: 4px; display: none;" id="hdr-tip">Tip: Uncheck &quot;Headers and footers&quot; in print settings</span>
  </div>

  <div class="document-paper-wrapper">
    ${bodyHtml}
  </div>
</body>
</html>`;
}
