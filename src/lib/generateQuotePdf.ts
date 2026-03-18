import jsPDF from 'jspdf';
import type { UserData } from '../types';

const BRAND = '#005589';
const BRAND_LIGHT = '#e8f3f9';
const SLATE_900 = '#0f172a';
const SLATE_600 = '#475569';
const SLATE_400 = '#94a3b8';
const SLATE_100 = '#f1f5f9';
const EMERALD = '#10b981';
const WHITE = '#ffffff';

const LINE_ITEMS = [
  {
    label: 'Model Engineering',
    description: 'Geometry cleanup, LOD definition & material assignment',
    hours: 560,
    amount: 24500,
  },
  {
    label: 'Virtual Twin Sync',
    description: 'Data pipelines, variant logic & real-time readiness',
    hours: 280,
    amount: 12350,
  },
  {
    label: 'Cloud Compute & Infrastructure',
    description: '3DEXPERIENCE platform hosting, CI/CD & monitoring',
    hours: 80,
    amount: 6000,
  },
];

const TOTAL = LINE_ITEMS.reduce((s, l) => s + l.amount, 0);
const TOTAL_HOURS = LINE_ITEMS.reduce((s, l) => s + l.hours, 0);

function fmt(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function quoteRef() {
  return `DS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function generateQuotePdf(userData: UserData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const MARGIN = 14;
  const CONTENT_W = W - MARGIN * 2;

  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);
  const ref = quoteRef();

  let y = 0;

  // ── Helper fns ─────────────────────────────────────────────────────────────

  function setFont(style: 'normal' | 'bold', size: number, color = SLATE_900) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(color);
  }

  function rect(x: number, ry: number, w: number, h: number, fill: string) {
    doc.setFillColor(fill);
    doc.rect(x, ry, w, h, 'F');
  }

  function line(x1: number, ly: number, x2: number, color = '#e2e8f0') {
    doc.setDrawColor(color);
    doc.setLineWidth(0.3);
    doc.line(x1, ly, x2, ly);
  }

  function text(t: string, x: number, ty: number, opts?: { align?: 'left' | 'center' | 'right'; maxWidth?: number }) {
    doc.text(t, x, ty, opts as object);
  }

  function label(t: string, x: number, ly: number, color = SLATE_400) {
    setFont('bold', 7, color);
    text(t.toUpperCase(), x, ly);
  }

  // ── HEADER (brand bar) ─────────────────────────────────────────────────────
  rect(0, 0, W, 42, BRAND);

  // DS logo area
  setFont('bold', 18, WHITE);
  text('Dassault Systèmes', MARGIN, 14);
  setFont('normal', 8, '#93c5fd');
  text('Virtual Twin as a Service', MARGIN, 20);

  // Quote info top-right
  setFont('bold', 7, '#93c5fd');
  text('QUOTATION', W - MARGIN, 10, { align: 'right' });
  setFont('bold', 9, WHITE);
  text(ref, W - MARGIN, 16, { align: 'right' });
  setFont('normal', 7, '#bfdbfe');
  text(`Issued: ${formatDate(today)}`, W - MARGIN, 21, { align: 'right' });
  text(`Valid until: ${formatDate(validUntil)}`, W - MARGIN, 26, { align: 'right' });

  // Total price
  setFont('bold', 28, WHITE);
  text(fmt(TOTAL), MARGIN, 38);
  setFont('normal', 7, '#bfdbfe');
  text('USD · END-TO-END DELIVERY', MARGIN + 1, 42.5);

  y = 50;

  // ── PREPARED FOR ──────────────────────────────────────────────────────────
  rect(MARGIN, y, CONTENT_W, 18, BRAND_LIGHT);
  label('Prepared for', MARGIN + 4, y + 5);
  setFont('bold', 10, SLATE_900);
  text(userData.company_name || 'Your Company', MARGIN + 4, y + 10);
  setFont('normal', 8, SLATE_600);
  const contactLine = [userData.name, userData.email].filter(Boolean).join('  ·  ');
  text(contactLine || 'Valued Customer', MARGIN + 4, y + 15);

  // Assessment badge
  doc.setFillColor(EMERALD);
  doc.roundedRect(W - MARGIN - 36, y + 4, 36, 9, 2, 2, 'F');
  setFont('bold', 6.5, WHITE);
  text('✓  Assessment Complete', W - MARGIN - 18, y + 9.5, { align: 'center' });

  y += 24;

  // ── LINE ITEMS TABLE ───────────────────────────────────────────────────────
  // Table header
  rect(MARGIN, y, CONTENT_W, 7, SLATE_900);
  setFont('bold', 7, WHITE);
  text('SERVICE', MARGIN + 3, y + 4.8);
  text('HRS', W - MARGIN - 24, y + 4.8, { align: 'right' });
  text('AMOUNT', W - MARGIN - 3, y + 4.8, { align: 'right' });
  y += 7;

  LINE_ITEMS.forEach((item, i) => {
    const rowH = 14;
    rect(MARGIN, y, CONTENT_W, rowH, i % 2 === 0 ? WHITE : SLATE_100);

    // Icon dot
    doc.setFillColor(BRAND);
    doc.circle(MARGIN + 4, y + 7, 2, 'F');

    setFont('bold', 9, SLATE_900);
    text(item.label, MARGIN + 9, y + 5.5);
    setFont('normal', 7, SLATE_600);
    text(item.description, MARGIN + 9, y + 10);

    setFont('bold', 9, SLATE_600);
    text(`${item.hours}h`, W - MARGIN - 24, y + 7, { align: 'right' });

    setFont('bold', 9, SLATE_900);
    text(fmt(item.amount), W - MARGIN - 3, y + 7, { align: 'right' });

    y += rowH;
  });

  line(MARGIN, y, W - MARGIN);
  y += 3;

  // Subtotals
  const totalsX = W - MARGIN - 55;
  const totalsValX = W - MARGIN - 3;

  setFont('normal', 8, SLATE_600);
  text('Subtotal', totalsX, y + 4);
  text(fmt(TOTAL), totalsValX, y + 4, { align: 'right' });

  setFont('normal', 8, SLATE_600);
  text('Tax (0% — B2B Enterprise)', totalsX, y + 9);
  text('$0', totalsValX, y + 9, { align: 'right' });

  y += 12;
  line(totalsX, y, W - MARGIN, BRAND);

  setFont('bold', 12, BRAND);
  text('Total', totalsX, y + 6);
  text(fmt(TOTAL), totalsValX, y + 6, { align: 'right' });

  y += 12;

  // ── EFFORT SUMMARY ────────────────────────────────────────────────────────
  rect(MARGIN, y, CONTENT_W, 14, BRAND_LIGHT);

  const cols = [
    { l: 'Total Effort', v: `${TOTAL_HOURS} Hours` },
    { l: 'Estimated Lead Time', v: '14 Days' },
    { l: 'Quote Validity', v: '30 Days' },
  ];
  cols.forEach((c, i) => {
    const cx = MARGIN + 4 + i * (CONTENT_W / 3);
    label(c.l, cx, y + 5);
    setFont('bold', 9, SLATE_900);
    text(c.v, cx, y + 11);
  });

  y += 20;

  // ── PROJECT SCOPE SUMMARY ─────────────────────────────────────────────────
  const scopeRows = [
    { label: 'Model', value: userData.model_name },
    { label: 'Variants', value: userData.unique_variants_count ? `${userData.unique_variants_count} grades` : '' },
    { label: 'Segment', value: userData.segment },
    { label: 'Trim Levels', value: userData.trim_levels ? `${userData.trim_levels} trims` : '' },
    { label: 'Exterior Colors', value: userData.exterior_colors ? `${userData.exterior_colors} colors` : '' },
    { label: 'Markets', value: userData.markets },
    { label: 'Customization', value: userData.customization_level },
    { label: 'CAD Format', value: userData.cad_format },
    { label: 'Update Cycle', value: userData.update_frequency },
  ].filter(r => r.value);

  if (scopeRows.length > 0) {
    setFont('bold', 8, BRAND);
    text('PROJECT SCOPE SUMMARY', MARGIN, y);
    setFont('bold', 7, SLATE_400);
    text(`— ${userData.model_name || 'Project'}`, MARGIN + 42, y);
    y += 4;
    line(MARGIN, y, W - MARGIN);
    y += 4;

    const cols3 = 3;
    const cellW = CONTENT_W / cols3;
    for (let i = 0; i < scopeRows.length; i += cols3) {
      const rowItems = scopeRows.slice(i, i + cols3);
      rowItems.forEach((r, j) => {
        const cx = MARGIN + j * cellW;
        rect(cx, y, cellW - 1, 11, SLATE_100);
        label(r.label!, cx + 2, y + 4);
        setFont('bold', 8, SLATE_900);
        text(r.value!, cx + 2, y + 9);
      });
      y += 13;
    }
    y += 2;
  }

  // ── WHY DS ────────────────────────────────────────────────────────────────
  setFont('bold', 8, BRAND);
  text('WHY PARTNER WITH DASSAULT SYSTÈMES?', MARGIN, y);
  y += 4;
  line(MARGIN, y, W - MARGIN);
  y += 5;

  const reasons = [
    { title: 'Long Term ROI', body: 'Virtual Twins reduce time-to-market by 25% and minimize physical prototyping costs.' },
    { title: 'Industry Standard', body: "Join the world's most innovative OEMs relying on the 3DEXPERIENCE platform." },
    { title: 'Seamless Integration', body: 'Direct compatibility with SOLIDWORKS, CATIA, and existing PLM infrastructure.' },
    { title: 'Enterprise Security', body: 'IP protected by ISO 27001 certified cloud infrastructure.' },
  ];

  reasons.forEach((r, i) => {
    const col = i % 2;
    const cx = MARGIN + col * (CONTENT_W / 2 + 2);
    if (col === 0 && i > 0) y += 14;

    doc.setFillColor(BRAND);
    doc.circle(cx + 2, y + 3, 1.5, 'F');
    setFont('bold', 8, SLATE_900);
    text(r.title, cx + 6, y + 4.5);
    setFont('normal', 7, SLATE_600);
    const lines = doc.splitTextToSize(r.body, CONTENT_W / 2 - 8);
    doc.text(lines, cx + 6, y + 9);
  });

  y += 20;

  // ── CTA BANNER ────────────────────────────────────────────────────────────
  rect(MARGIN, y, CONTENT_W, 18, SLATE_900);
  setFont('bold', 9, WHITE);
  text('Ready to move forward?', MARGIN + 4, y + 7);
  setFont('normal', 7, '#94a3b8');
  text('Our solution architects will review your specs and confirm final pricing.', MARGIN + 4, y + 12);

  // Button-like badge
  rect(W - MARGIN - 38, y + 4, 38, 10, BRAND);
  setFont('bold', 7.5, WHITE);
  text('Schedule a Call', W - MARGIN - 19, y + 10.5, { align: 'center' });

  y += 24;

  // ── FOOTER ────────────────────────────────────────────────────────────────
  line(MARGIN, y, W - MARGIN);
  y += 4;
  setFont('normal', 6.5, SLATE_400);
  text(
    `Quote ${ref}  ·  Valid 30 days from ${formatDate(today)}  ·  Final pricing subject to detailed scoping  ·  © ${today.getFullYear()} Dassault Systèmes SE. All rights reserved.`,
    W / 2,
    y,
    { align: 'center' }
  );

  // Page border accent
  doc.setDrawColor(BRAND);
  doc.setLineWidth(1.2);
  doc.line(0, 0, 0, H);

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const fileName = `Dassault_Quote_${ref}_${userData.company_name?.replace(/\s+/g, '_') || 'Proposal'}.pdf`;
  doc.save(fileName);
}
