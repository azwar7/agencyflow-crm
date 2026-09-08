import fs from 'fs';
import path from 'path';

// Common locations for Google Chrome & Microsoft Edge as resilient fallbacks
const COMMON_EXECUTABLES = [
  // Windows
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  // Linux / Docker / Server
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
];

function getSystemExecutablePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  for (const exePath of COMMON_EXECUTABLES) {
    if (fs.existsSync(exePath)) {
      return exePath;
    }
  }

  return undefined;
}

// Global browser holder across server invocations
let browserInstance: any = null;
let idleTimer: NodeJS.Timeout | null = null;
const IDLE_TIMEOUT_MS = 60_000; // Close idle Chromium after 60 seconds

function scheduleIdleCleanup() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(async () => {
    if (browserInstance) {
      try {
        await browserInstance.close();
      } catch (err) {
        console.error('Error closing idle Puppeteer browser:', err);
      } finally {
        browserInstance = null;
      }
    }
  }, IDLE_TIMEOUT_MS);
}

/**
 * Returns a warm or newly launched Puppeteer browser instance.
 */
export async function getPdfBrowser(): Promise<any> {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }

  if (browserInstance && typeof browserInstance.isConnected === 'function' && browserInstance.isConnected()) {
    scheduleIdleCleanup();
    return browserInstance;
  }

  // Dynamically require puppeteer
  const puppeteer = await import('puppeteer');

  const launchOptions: any = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=medium',
      '--hide-scrollbars',
    ],
  };

  // If Puppeteer didn't download Chromium or on Windows with system Edge/Chrome available, use fallback
  const systemExe = getSystemExecutablePath();
  if (systemExe) {
    try {
      // Test launching without explicit path first (if bundled Chromium exists)
      browserInstance = await puppeteer.default.launch(launchOptions);
    } catch {
      // Fall back to system executable
      launchOptions.executablePath = systemExe;
      browserInstance = await puppeteer.default.launch(launchOptions);
    }
  } else {
    browserInstance = await puppeteer.default.launch(launchOptions);
  }

  browserInstance.on('disconnected', () => {
    browserInstance = null;
  });

  scheduleIdleCleanup();
  return browserInstance;
}
