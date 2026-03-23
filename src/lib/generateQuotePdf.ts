import { pdf } from '@react-pdf/renderer';
import { createElement } from 'react';
import { QuotePdfDocument } from './QuotePdfTemplate';
import { calculateQuote } from './calculateQuote';
import type { UserData } from '../types';

function quoteRef() { return 'DS-' + Date.now().toString(36).toUpperCase().slice(-6); }

async function loadWhiteLogoDataUrl(): Promise<string | null> {
  try {
    const svgText = await fetch('/Dassault_Logo.svg').then(r => r.text());
    const white   = svgText
      .replace(/fill:#005386/g, 'fill:#ffffff')
      .replace(/fill:#005589/g, 'fill:#ffffff');
    const blob = new Blob([white], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    return await new Promise<string | null>(resolve => {
      const img = new Image();
      img.onload = () => {
        const S = 4;
        const cw = (img.naturalWidth  || 432) * S;
        const ch = (img.naturalHeight || 133) * S;
        const cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        cv.getContext('2d')!.drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        resolve(cv.toDataURL('image/png'));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  } catch { return null; }
}

export async function generateQuotePdf(userData: UserData) {
  const logoUrl = await loadWhiteLogoDataUrl();
  const today   = new Date();
  const expiry  = new Date(today); expiry.setDate(expiry.getDate() + 30);
  const ref_    = quoteRef();

  const { lineItems, total, totalHours } = calculateQuote(userData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc  = createElement(QuotePdfDocument as any, { userData, ref_, today, expiry, logoUrl, lineItems, total, totalHours });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(doc as any).toBlob();

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `Dassault_Quote_${ref_}_${userData.company_name?.replace(/\s+/g, '_') || 'Proposal'}.pdf`;
  // Must be in DOM for Firefox; hidden so it doesn't affect layout
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  link.style.left = '-9999px';
  document.body.appendChild(link);
  link.click();
  // Clean up after browser has time to initiate download
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }, 500);
}
