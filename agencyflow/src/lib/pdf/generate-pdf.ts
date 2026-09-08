import { getPdfBrowser } from './browser';
import { GeneratePdfOptions } from './types';

/**
 * Generates an A4 print-optimized PDF Buffer from HTML markup using Puppeteer.
 */
export async function generatePdfFromHtml(
  htmlContent: string,
  options: GeneratePdfOptions = {}
): Promise<Buffer> {
  const browser = await getPdfBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 1240,
      height: 1754,
      deviceScaleFactor: 2,
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${options.title || 'Document'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0;">
  ${htmlContent}
</body>
</html>`;

    await page.setContent(fullHtml, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000,
    });

    // Generate A4 PDF with exact background graphics
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: options.displayHeaderFooter ?? false,
      headerTemplate: options.headerTemplate || '<div></div>',
      footerTemplate: options.footerTemplate || '<div></div>',
      margin: options.margins || {
        top: '16mm',
        bottom: '18mm',
        left: '15mm',
        right: '15mm',
      },
    });

    return Buffer.from(pdfUint8Array);
  } finally {
    try {
      await page.close();
    } catch (err) {
      console.error('Error closing Puppeteer page:', err);
    }
  }
}
